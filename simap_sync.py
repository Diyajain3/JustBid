#!/usr/bin/env python3
import argparse
import asyncio
import logging
import os
import sys
import time
import json
from datetime import datetime, timedelta, timezone
from typing import Optional

import re
import httpx
from deep_translator import GoogleTranslator

logger = logging.getLogger(__name__)

def setup_logging(verbose: bool = False, log_file: Optional[str] = None) -> None:
    log_level = logging.DEBUG if verbose else logging.INFO
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(log_level)
    console_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
    handlers = [console_handler]

    if log_file:
        file_handler = logging.FileHandler(log_file, mode='w', encoding='utf-8')
        file_handler.setLevel(logging.WARNING) 
        file_handler.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(name)s: %(message)s"))
        handlers.append(file_handler)

    logging.basicConfig(level=logging.DEBUG, handlers=handlers, force=True)

def write_run_summary(log_file: str, stats: dict, dry_run: bool = False) -> None:
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    mode = "[DRY RUN] " if dry_run else ""
    summary = (
        f"\n{'=' * 60}\n"
        f"RUN SUMMARY - {timestamp}\n"
        f"{'=' * 60}\n"
        f"{mode}Fetched:         {stats.get('fetched', 0)}\n"
        f"{mode}Inserted:        {stats.get('inserted', 0)}\n"
        f"{mode}Updated:         {stats.get('updated', 0)}\n"
        f"{mode}Details fetched: {stats.get('details_fetched', 0)}\n"
        f"{mode}Details errors:  {stats.get('details_errors', 0)}\n"
        f"{mode}Errors:          {stats.get('errors', 0)}\n"
        f"{'=' * 60}\n"
    )
    try:
        with open(log_file, 'a', encoding='utf-8') as f:
            f.write(summary)
    except OSError as e:
        logger.warning(f"Could not write run summary to log file: {e}")

SIMAP_API_BASE_V2 = "https://www.simap.ch/api/publications/v2/project"
SIMAP_API_BASE_V1 = "https://www.simap.ch/api/publications/v1/project"
SIMAP_SEARCH_ENDPOINT = f"{SIMAP_API_BASE_V2}/project-search"

DETAIL_API_DELAY_SECONDS = 0.5  
DETAIL_API_MAX_RETRIES = 3    
DETAIL_API_RETRY_DELAY = 2.0   
DATABASE_BATCH_SIZE = 100       
UPSERT_BATCH_SIZE = 100         
MAX_CONCURRENT_DETAILS = 10     
SYNC_STATE_ID = "simap_search"
CLOSING_SOON_DAYS = 7  

PROJECT_SUB_TYPES = [
    "construction", "service", "supply", "project_competition",
    "idea_competition", "overall_performance_competition",
    "project_study", "idea_study", "overall_performance_study",
    "request_for_information"
]

class SimapSyncWorker:
    def __init__(
        self,
        api_url: str,
        api_key: str,
        dry_run: bool = False,
        detail_api_delay: float = DETAIL_API_DELAY_SECONDS,
        max_concurrent: int = MAX_CONCURRENT_DETAILS,
        enable_checkpoints: bool = True,
    ):
        self.dry_run = dry_run
        self.detail_api_delay = detail_api_delay
        self.max_concurrent = max_concurrent
        self.enable_checkpoints = enable_checkpoints
        self.api_url = api_url.rstrip('/')
        self.api_key = api_key
        
        self.http_client = httpx.Client(timeout=30.0, headers={"Accept": "application/json"})
        self.async_http_client: Optional[httpx.AsyncClient] = None
        self.stats = {"fetched": 0, "inserted": 0, "updated": 0, "details_fetched": 0, "details_errors": 0, "errors": 0}

    def __enter__(self) -> "SimapSyncWorker":
        return self

    def __exit__(self, exc_type, exc_val, exc_tb) -> bool:
        self.close()
        return False

    def _load_checkpoint(self, state_id: str) -> Optional[dict]:
        try:
            if os.path.exists(".sync_state.json"):
                with open(".sync_state.json", "r") as f:
                    data = json.load(f)
                    return data.get(state_id)
        except Exception as e:
            logger.debug(f"Could not load checkpoint {state_id}: {e}")
        return None

    def _save_checkpoint(self, state_id: str, cursor: Optional[str], status: str, records: int, metadata: Optional[dict] = None) -> None:
        if self.dry_run or not self.enable_checkpoints:
            return
        state = {
            "id": state_id, "last_cursor": cursor, "last_run_at": datetime.now(timezone.utc).isoformat(),
            "last_run_status": status, "records_processed": records, "metadata": metadata or {},
        }
        try:
            data = {}
            if os.path.exists(".sync_state.json"):
                with open(".sync_state.json", "r") as f:
                    data = json.load(f)
            data[state_id] = state
            with open(".sync_state.json", "w") as f:
                json.dump(data, f)
            logger.debug(f"Checkpoint saved: {state_id} ({status}, {records} records)")
        except Exception as e:
            logger.warning(f"Could not save checkpoint {state_id}: {e}")

    def _clear_checkpoint(self, state_id: str) -> None:
        if self.dry_run or not self.enable_checkpoints:
            return
        try:
            if os.path.exists(".sync_state.json"):
                with open(".sync_state.json", "r") as f:
                    data = json.load(f)
                if state_id in data:
                    del data[state_id]
                    with open(".sync_state.json", "w") as f:
                        json.dump(data, f)
            logger.debug(f"Checkpoint cleared: {state_id}")
        except Exception as e:
            logger.debug(f"Could not clear checkpoint {state_id}: {e}")

    async def _get_async_client(self) -> httpx.AsyncClient:
        if self.async_http_client is None:
            self.async_http_client = httpx.AsyncClient(timeout=30.0, headers={"Accept": "application/json"}, limits=httpx.Limits(max_connections=self.max_concurrent + 5))
        return self.async_http_client

    async def _close_async_client(self) -> None:
        if self.async_http_client is not None:
            await self.async_http_client.aclose()
            self.async_http_client = None

    def fetch_projects(self, project_sub_types: Optional[list[str]] = None, publication_from: Optional[str] = None, publication_until: Optional[str] = None, swiss_only: bool = True, limit: Optional[int] = None, resume: bool = False) -> list[dict]:
        all_projects = []
        last_item = None
        if resume and self.enable_checkpoints:
            checkpoint = self._load_checkpoint(SYNC_STATE_ID)
            if checkpoint and checkpoint.get("last_run_status") in ("in_progress", "interrupted"):
                last_item = checkpoint.get("last_cursor")
                if last_item:
                    logger.info(f"Resuming from checkpoint: {last_item}")

        params = {"lang": "en"}
        if project_sub_types: params["projectSubTypes"] = ",".join(project_sub_types)
        if swiss_only: params["orderAddressCountryOnlySwitzerland"] = "true"
        if publication_from: params["newestPublicationFrom"] = publication_from
        if publication_until: params["newestPublicationUntil"] = publication_until

        page = 1
        error_occurred = False
        try:
            while True:
                if last_item: params["lastItem"] = last_item
                try:
                    response = self.http_client.get(SIMAP_SEARCH_ENDPOINT, params=params)
                    response.raise_for_status()
                    data = response.json()
                except httpx.HTTPStatusError as e:
                    logger.error(f"HTTP error fetching projects: {e}")
                    self.stats["errors"] += 1
                    error_occurred = True
                    break
                except Exception as e:
                    logger.error(f"Error fetching projects: {e}")
                    self.stats["errors"] += 1
                    error_occurred = True
                    break

                projects = data.get("projects", [])
                pagination = data.get("pagination", {})
                if not projects: break

                all_projects.extend(projects)
                self.stats["fetched"] += len(projects)
                logger.info(f"Fetched {len(projects)} projects (total: {len(all_projects)})")

                if limit and len(all_projects) >= limit:
                    all_projects = all_projects[:limit]
                    logger.info(f"Reached limit of {limit} projects")
                    break

                last_item = pagination.get("lastItem")
                if not last_item: break
                self._save_checkpoint(SYNC_STATE_ID, cursor=last_item, status="in_progress", records=len(all_projects), metadata={"page": page, "types": project_sub_types or []})
                page += 1
                if page > 1000: break
        except KeyboardInterrupt:
            logger.warning("Interrupted by user (Ctrl+C)")
            error_occurred = True
            raise
        finally:
            if error_occurred:
                self._save_checkpoint(SYNC_STATE_ID, cursor=last_item, status="interrupted", records=len(all_projects), metadata={"page": page, "types": project_sub_types or []})
            else:
                self._save_checkpoint(SYNC_STATE_ID, cursor=None, status="completed", records=len(all_projects), metadata={"types": project_sub_types or []})
        return all_projects

    def _translate_dict(self, data_dict: dict, target_lang: str = "en") -> tuple[dict, str]:
        if not data_dict:
            return data_dict, "en"

        # Check existing languages
        for lang in ["en", "de", "fr", "it"]:
            if data_dict.get(lang):
                source_lang = lang
                if source_lang == target_lang:
                    return data_dict, target_lang
                
                # We have a source but it's not our target
                try:
                    translated_text = GoogleTranslator(source='auto', target=target_lang).translate(data_dict.get(source_lang)[:4000])
                    data_dict[target_lang] = translated_text
                    return data_dict, target_lang
                except Exception as e:
                    logger.debug(f"Translation failed for {source_lang} to {target_lang}: {e}")
                    return data_dict, source_lang
        
        return data_dict, "en"

    def transform_project(self, project: dict) -> dict:
        title_dict = project.get("title", {})
        translated_title, language = self._translate_dict(title_dict)
        order_address = project.get("orderAddress", {})

        return {
            "external_id": project.get("id"),
            "source": "simap",
            "source_url": f"https://www.simap.ch/project/{project.get('projectNumber')}",
            "title": translated_title, 
            "project_number": project.get("projectNumber"),
            "publication_number": project.get("publicationNumber"),
            "project_type": project.get("projectType"),
            "project_sub_type": project.get("projectSubType"),
            "process_type": project.get("processType"),
            "lots_type": project.get("lotsType"),
            "authority": project.get("procOfficeName"),
            "publication_date": project.get("publicationDate"),
            "pub_type": project.get("pubType"),
            "corrected": project.get("corrected", False),
            "region": order_address.get("cantonId"),
            "country": order_address.get("countryId", "CH"),
            "order_address": order_address if order_address else None,
            "language": language,
            "raw_data": project,
            "updated_at": datetime.now(timezone.utc).isoformat(),
            "publication_id": project.get("publicationId"),
        }

    async def fetch_publication_details_async(self, tender_id: str, project_id: str, publication_id: str, semaphore: asyncio.Semaphore) -> Optional[dict]:
        async with semaphore:
            client = await self._get_async_client()
            url = f"{SIMAP_API_BASE_V1}/{project_id}/publication-details/{publication_id}"
            for attempt in range(1, DETAIL_API_MAX_RETRIES + 1):
                try:
                    response = await client.get(url)
                    response.raise_for_status()
                    return {"tender_id": tender_id, "data": response.json()}
                except httpx.HTTPStatusError as e:
                    status_code = e.response.status_code
                    if 400 <= status_code < 500 and status_code != 429: return None
                    if attempt < DETAIL_API_MAX_RETRIES: await asyncio.sleep(DETAIL_API_RETRY_DELAY)
                    else: return None
                except httpx.TimeoutException:
                    if attempt < DETAIL_API_MAX_RETRIES: await asyncio.sleep(DETAIL_API_RETRY_DELAY)
                    else: return None
                except Exception as e: return None
            return None

    async def fetch_details_parallel(self, tenders: list[dict]) -> list[dict]:
        semaphore = asyncio.Semaphore(self.max_concurrent)
        tasks = []
        for tender in tenders:
            tender_id = tender.get("id")
            external_id = tender.get("externalId")
            publication_id = tender.get("publicationId")
            if not external_id or not publication_id: continue
            task = self.fetch_publication_details_async(tender_id=tender_id, project_id=external_id, publication_id=publication_id, semaphore=semaphore)
            tasks.append(task)
        if not tasks: return []
        results = await asyncio.gather(*tasks, return_exceptions=True)
        successful = []
        for result in results:
            if result and not isinstance(result, Exception) and result.get("data"):
                successful.append(result)
            elif isinstance(result, Exception):
                self.stats["details_errors"] += 1
        return successful
    def strip_tags(self, text: str) -> str:
        if not text: return ""
        # Remove HTML tags but try to preserve structural spacing
        clean = re.compile('<.*?>')
        text = re.sub(clean, ' ', text)
        # Unescape common HTML entities
        text = text.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
        # Normalize whitespace
        return re.sub(r'\s+', ' ', text).strip()

    def transform_publication_details(self, details: dict) -> dict:
        project_info = details.get("project-info") or {}
        procurement = details.get("procurement") or {}
        terms = details.get("terms") or {}
        dates = details.get("dates") or {}
        criteria = details.get("criteria") or {}
        decision = details.get("decision") or {}
        base = details.get("base") or {}

        # Translate and clean description
        desc_dict = procurement.get("orderDescription") or {}
        if isinstance(desc_dict, str):
            desc_dict = {"auto": desc_dict}
        translated_desc, _ = self._translate_dict(desc_dict)
        clean_desc = self.strip_tags(translated_desc)

        # Translate Criteria
        qual_dict = criteria.get("qualification") or {}
        award_dict = criteria.get("award") or {}
        translated_qual, _ = self._translate_dict(qual_dict)
        translated_award, _ = self._translate_dict(award_dict)

        # Enhanced Budget Extraction
        budget = (procurement.get("budget") or 
                  procurement.get("totalPriceSelectionValue") or 
                  procurement.get("totalPriceRange", {}).get("range", {}).get("min"))
        
        if not budget and clean_desc:
            # Enhanced Regex Budget Hunting
            budget_matches = re.findall(r'(?:Budget|Value|Price|Total|CHF|USD|\$)\D*([\d\s\'\.,]+)', clean_desc, re.IGNORECASE)
            if budget_matches:
                # Take the first plausible number, clean it
                raw_val = re.sub(r'[\s\'\.]', '', budget_matches[0].split(',')[0])
                if raw_val.isdigit() and len(raw_val) > 3:
                   budget = int(raw_val)

        # Enhanced Location Extraction
        location = (procurement.get("orderAddress") or {}).get("cantonId")
        if not location and clean_desc:
            # Hunt for Swiss Cantons (ZH, BE, GL, etc.)
            cantons = ["ZH", "BE", "LU", "UR", "SZ", "OW", "NW", "GL", "ZG", "FR", "SO", "BS", "BL", "SH", "AR", "AI", "SG", "GR", "AG", "TG", "TI", "VD", "VS", "NE", "GE", "JU"]
            pattern = r'\b(' + '|'.join(cantons) + r')\b'
            loc_match = re.search(pattern, clean_desc)
            if loc_match:
                location = loc_match.group(1)

        # Enhanced Deadline Extraction
        deadline = (
            dates.get("offerDeadline") or 
            procurement.get("executionDeadline") or 
            decision.get("awardDecisionDate") or 
            base.get("publicationDate")
        )

        return {
            "deadline": deadline,
            "publicationDate": base.get("publicationDate"),
            "budget": budget,
            "offer_opening": (dates.get("offerOpening") or {}).get("dateTime") or dates.get("offerOpening"),
            "qna_deadlines": dates.get("qnas", []),
            "offer_validity_days": dates.get("offerValidityDeadlineDays"),
            "description": clean_desc,
            "location": location,
            "cpv_codes": [procurement.get("cpvCode", {}).get("code")] if isinstance(procurement.get("cpvCode"), dict) else [],
            "bkp_codes": procurement.get("bkpCodes", []),
            "npk_codes": procurement.get("npkCodes", []),
            "oag_codes": procurement.get("oagCodes", []),
            "additional_cpv_codes": procurement.get("additionalCpvCodes", []),
            "proc_office_address": project_info.get("procOfficeAddress"),
            "procurement_recipient_address": project_info.get("procurementRecipientAddress"),
            "offer_address": project_info.get("offerAddress"),
            "order_address_description": procurement.get("orderAddressDescription"),
            "region": (procurement.get("orderAddress") or {}).get("cantonId"),
            "country": (procurement.get("orderAddress") or {}).get("countryId"),
            "documents_languages": project_info.get("documentsLanguages", []),
            "offer_languages": project_info.get("offerLanguages", []),
            "publication_languages": project_info.get("publicationLanguages", []),
            "offer_types": project_info.get("offerTypes", []),
            "documents_source_type": project_info.get("documentsSourceType"),
            "state_contract_area": project_info.get("stateContractArea", False),
            "publication_ted": project_info.get("publicationTed", False),
            "construction_type": procurement.get("constructionType"),
            "construction_category": procurement.get("constructionCategory"),
            "variants_allowed": procurement.get("variants"),
            "partial_offers_allowed": procurement.get("partialOffers"),
            "execution_deadline_type": procurement.get("executionDeadlineType"),
            "execution_period": procurement.get("executionPeriod"),
            "execution_days": procurement.get("executionDays"),
            "consortium_allowed": terms.get("consortiumAllowed"),
            "subcontractor_allowed": terms.get("subContractorAllowed"),
            "terms_type": terms.get("termsType"),
            "remedies_notice": terms.get("remediesNotice"),
            "qualification_criteria": translated_qual,
            "award_criteria": translated_award,
            "lots": details.get("lots", []),
            "has_project_documents": details.get("hasProjectDocuments", False),
            "raw_detail_data": details,
            "details_fetched_at": datetime.now(timezone.utc).isoformat(),
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }

    def fetch_details_for_tenders(self, limit: Optional[int] = None, only_missing: bool = True) -> None:
        if self.dry_run: return
        total_processed = 0
        offset = 0
        batch_number = 0
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        try:
            while True:
                batch_size = DATABASE_BATCH_SIZE
                if limit:
                    remaining = limit - total_processed
                    if remaining <= 0: break
                    batch_size = min(batch_size, remaining)

                try:
                    res = self.http_client.get(f"{self.api_url}/api/tenders/missing-details?limit={batch_size}&offset={offset}", headers={"x-api-key": self.api_key})
                    if not res.is_success: break
                    tenders = res.json()
                except Exception as e:
                    logger.error(f"Error querying missing details: {e}")
                    break

                if not tenders: break
                logger.info(f"Processing batch of {len(tenders)} tenders (offset: {offset})")

                if batch_number > 0 and self.detail_api_delay > 0: time.sleep(self.detail_api_delay)

                results = loop.run_until_complete(self.fetch_details_parallel(tenders))
                if results:
                    self._batch_update_details(results)

                total_processed += len(tenders)
                batch_number += 1
                if len(tenders) < batch_size: break
                if not only_missing: offset += batch_size
            logger.info(f"Total tenders processed: {total_processed}")
        except Exception as e:
            logger.error(f"Error fetching tender details: {e}")
            self.stats["errors"] += 1
        finally:
            if self.async_http_client: loop.run_until_complete(self._close_async_client())
            loop.close()

    def upsert_tenders(self, projects: list[dict]) -> None:
        if self.dry_run: return
        tender_records = []
        for project in projects:
            try: tender_records.append(self.transform_project(project))
            except Exception as e: self.stats["errors"] += 1

        if not tender_records: return
        for i in range(0, len(tender_records), UPSERT_BATCH_SIZE):
            batch = tender_records[i:i + UPSERT_BATCH_SIZE]
            try:
                res = self.http_client.post(f"{self.api_url}/api/tenders/ingest", json={"tenders": batch}, headers={"x-api-key": self.api_key})
                if res.is_success:
                    self.stats["updated"] += len(batch)
                    logger.info(f"Batch upserted {len(batch)} tenders.")
            except Exception as e:
                logger.error(f"Batch upsert error: {e}")

    def _batch_update_details(self, results: list[dict]) -> None:
        if not results or self.dry_run: return
        updates = []
        for result in results:
            if not result or not result.get("data"): continue
            try:
                detail_data = self.transform_publication_details(result["data"])
                detail_data = {k: v for k, v in detail_data.items() if v is not None}
                detail_data["id"] = result["tender_id"]
                updates.append(detail_data)
            except Exception as e:
                self.stats["details_errors"] += 1

        if not updates: return
        try:
            res = self.http_client.put(f"{self.api_url}/api/tenders/batch-update", json={"updates": updates}, headers={"x-api-key": self.api_key})
            if res.is_success: self.stats["details_fetched"] += len(updates)
        except Exception as e:
            logger.error(f"Detail update error: {e}")
            self.stats["details_errors"] += len(updates)
        logger.info(f"Updated {self.stats['details_fetched']} tender details")

    def run(self, project_sub_types: Optional[list[str]] = None, days_back: Optional[int] = None, limit: Optional[int] = None, fetch_details: bool = True, details_limit: Optional[int] = None, resume: bool = False) -> dict:
        publication_from = None
        publication_until = None
        if days_back: publication_from = (datetime.now(timezone.utc) - timedelta(days=days_back)).strftime("%Y-%m-%d")
        types_to_fetch = project_sub_types or PROJECT_SUB_TYPES

        projects = self.fetch_projects(project_sub_types=types_to_fetch, publication_from=publication_from, publication_until=publication_until, limit=limit, resume=resume)
        if projects:
            self.upsert_tenders(projects)
        if fetch_details:
            self.fetch_details_for_tenders(limit=details_limit, only_missing=True)
        return self.stats

    def close(self) -> None:
        self.http_client.close()

def main():
    parser = argparse.ArgumentParser(description="Sync SIMAP tenders to MongoDB API")
    parser.add_argument("--api-url", type=str, default=None, help="Backend API URL")
    parser.add_argument("--api-key", type=str, default=None, help="Backend API Key")
    parser.add_argument("--days", type=int, default=None)
    parser.add_argument("--type", type=str, choices=PROJECT_SUB_TYPES, action="append", dest="types")
    parser.add_argument("--limit", type=int, default=None)
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--skip-details", action="store_true")
    parser.add_argument("--details-limit", type=int, default=None)
    parser.add_argument("--details-only", action="store_true")
    parser.add_argument("--rate-limit", type=float, default=DETAIL_API_DELAY_SECONDS)
    parser.add_argument("--max-concurrent", type=int, default=MAX_CONCURRENT_DETAILS)
    parser.add_argument("--resume", action="store_true")
    parser.add_argument("--no-checkpoint", action="store_true")
    parser.add_argument("--verbose", "-v", action="store_true")
    parser.add_argument("--log-file", type=str, default="simap_sync.log")
    parser.add_argument("--no-log-file", action="store_true")

    args = parser.parse_args()
    log_file = None if args.no_log_file else args.log_file
    setup_logging(verbose=args.verbose, log_file=log_file)

    # Note: Retained legacy CLI arguments but correctly point to MongoDB API Config!
    api_url = args.api_url or os.environ.get("BACKEND_API_URL", "http://localhost:5000")
    api_key = args.api_key or os.environ.get("BACKEND_API_KEY", "worker-secret-key-for-python-script")

    with SimapSyncWorker(
        api_url=api_url,
        api_key=api_key,
        dry_run=args.dry_run,
        detail_api_delay=args.rate_limit,
        max_concurrent=args.max_concurrent,
        enable_checkpoints=not args.no_checkpoint,
    ) as worker:
        if args.details_only:
            worker.fetch_details_for_tenders(limit=args.details_limit, only_missing=True)
            stats = worker.stats
        else:
            stats = worker.run(
                project_sub_types=args.types,
                days_back=args.days,
                limit=args.limit,
                fetch_details=not args.skip_details,
                details_limit=args.details_limit,
                resume=args.resume,
            )
        if log_file: write_run_summary(log_file, stats, dry_run=args.dry_run)
        if stats["errors"] > 0: sys.exit(1)

if __name__ == "__main__":
    main()
