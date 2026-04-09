# SIMAP Sync Worker

Daily scheduled job that fetches public procurement tenders from the Swiss SIMAP API and syncs them to the Supabase database.

---

## What the Worker Does

1. **Fetches tenders** from SIMAP search API for all project types (with pagination)
2. **Transforms data** to match our database schema (see `documentation/DATABASE.md`)
3. **Upserts records** to the `tenders` table (insert new, update existing)
4. **Updates statuses** based on deadlines:
   - `open` → `closing_soon` (7 days before deadline)
   - `closing_soon` → `closed` (after deadline)
5. **Fetches details** from SIMAP publication-details API (by default):
   - Procurement terms, dates, criteria, addresses
   - BKP/NPK/CPV classification codes
   - Rate-limited with automatic retry on transient failures

---

## Quick Start

```bash
# 1. Install dependencies
cd workers/simap_sync
pip install -r requirements.txt

# 2. Run with credentials (test mode)
python simap_sync.py \
  --supabase-url "https://xxx.supabase.co" \
  --supabase-key "sb_secret_xxx" \
  --limit 50 \
  --dry-run
```

---

## Command Line Options

| Option | Required | Default | Description |
|--------|----------|---------|-------------|
| `--supabase-url URL` | Yes* | env var | Supabase project URL |
| `--supabase-key KEY` | Yes* | env var | Supabase secret key |
| `--days N` | No | all | Only fetch publications from last N days |
| `--type TYPE` | No | all | Filter by project type (can be repeated) |
| `--limit N` | No | unlimited | Maximum tenders to fetch from search API |
| `--details-limit N` | No | unlimited | Maximum details to fetch from detail API |
| `--dry-run` | No | false | Preview mode - don't write to database |
| `--skip-details` | No | false | Skip fetching publication details |
| `--details-only` | No | false | Only fetch details, skip project search |
| `--rate-limit N` | No | 0.5 | Delay between detail API calls (seconds) |
| `--max-concurrent N` | No | 10 | Max concurrent detail API calls (parallel processing) |
| `--resume` | No | false | Resume from last interrupted sync checkpoint |
| `--no-checkpoint` | No | false | Disable checkpoint saving |
| `--verbose`, `-v` | No | false | Enable verbose/debug logging |
| `--log-file PATH` | No | simap_sync.log | Log file path |
| `--no-log-file` | No | false | Disable file logging |

*Required via args or `SUPABASE_URL`/`SUPABASE_KEY` environment variables.

**Logging Behavior:**
- Console: Shows INFO level and above (or DEBUG with `--verbose`)
- Log file: Captures WARNING and ERROR messages, plus a run summary
- Log file is **overwritten** on each run (not appended)
- **Run summary**: Always appended to log file with timestamp and stats, even if no errors

---

## Usage Examples

```bash
# Daily sync (last 24 hours)
python simap_sync.py --supabase-url "https://xxx.supabase.co" --supabase-key "your-key" --days 1

# Weekly sync
python simap_sync.py --supabase-url "https://xxx.supabase.co" --supabase-key "your-key" --days 7

# Filter by type
python simap_sync.py --supabase-url "https://xxx.supabase.co" --supabase-key "your-key" --days 7 --type construction

# Skip details (faster)
python simap_sync.py --supabase-url "https://xxx.supabase.co" --supabase-key "your-key" --days 7 --skip-details

# More parallel API calls
python simap_sync.py --supabase-url "https://xxx.supabase.co" --supabase-key "your-key" --days 7 --max-concurrent 20

# Resume interrupted sync
python simap_sync.py --supabase-url "https://xxx.supabase.co" --supabase-key "your-key" --days 30 --resume

# Backfill missing details
python simap_sync.py --supabase-url "https://xxx.supabase.co" --supabase-key "your-key" --details-only --details-limit 100

# Dry run (no database writes)
python simap_sync.py --supabase-url "https://xxx.supabase.co" --supabase-key "your-key" --limit 50 --dry-run

# Verbose logging
python simap_sync.py --supabase-url "https://xxx.supabase.co" --supabase-key "your-key" --days 1 --verbose
```

---

## Setup

### 1. Install Dependencies

```bash
cd workers/simap_sync
pip install -r requirements.txt
```

### 2. Get Supabase Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Project Settings** → **API**
4. Copy the **Secret key** (`sb_secret_...`)

> **Important:** Use the **secret key** (not the publishable key) for server-side operations.

### 3. Run the Worker

**Option A: Pass credentials directly (recommended for testing)**
```bash
python simap_sync.py \
  --supabase-url "https://xxx.supabase.co" \
  --supabase-key "sb_secret_xxx" \
  --limit 50 \
  --dry-run
```

**Option B: Use environment variables**
```bash
export SUPABASE_URL="https://xxx.supabase.co"
export SUPABASE_KEY="sb_secret_xxx"
python simap_sync.py --limit 50 --dry-run
```

---

## Scheduling

### Option 1: Cron (Linux/macOS)

Add to crontab (`crontab -e`):

```cron
# Run daily at 6:00 AM
0 6 * * * cd /path/to/tender-scout/workers && /usr/bin/python3 simap_sync.py --days 7 >> /var/log/simap-sync.log 2>&1
```

### Option 2: GitHub Actions

Create `.github/workflows/simap-sync.yml`:

```yaml
name: SIMAP Sync

on:
  schedule:
    - cron: '0 6 * * *'  # Daily at 6:00 AM UTC
  workflow_dispatch:      # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'

      - name: Install dependencies
        run: pip install -r workers/requirements.txt

      - name: Run sync
        env:
          SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          SUPABASE_KEY: ${{ secrets.SUPABASE_KEY }}
        run: python workers/simap_sync.py --days 7
```

### Option 3: Supabase Edge Functions (with pg_cron)

Use Supabase's built-in cron scheduling to trigger an Edge Function that calls this worker.

---

## Monitoring

The worker logs to stdout with timestamps:

```
2026-01-19 06:00:00 [INFO] ============================================================
2026-01-19 06:00:00 [INFO] SIMAP Tender Sync Worker
2026-01-19 06:00:00 [INFO] ============================================================
2026-01-19 06:00:00 [INFO] Project types: construction, service, supply, ...
2026-01-19 06:00:01 [INFO] Fetching page 1...
2026-01-19 06:00:02 [INFO] Fetched 20 projects (total: 20)
...
2026-01-19 06:01:30 [INFO] ------------------------------------------------------------
2026-01-19 06:01:30 [INFO] Sync Statistics:
2026-01-19 06:01:30 [INFO]   Fetched:         1250
2026-01-19 06:01:30 [INFO]   Inserted:        45
2026-01-19 06:01:30 [INFO]   Updated:         1205
2026-01-19 06:01:30 [INFO]   Details fetched: 1250
2026-01-19 06:01:30 [INFO]   Details errors:  3
2026-01-19 06:01:30 [INFO]   Errors:          0
2026-01-19 06:01:30 [INFO] ============================================================
```

**Log File (`simap_sync.log`):**

By default, warnings/errors and a run summary are written to `simap_sync.log`. This file is overwritten on each run to keep it small and focused on issues from the latest sync.

```bash
# Check the log file after a run
cat simap_sync.log

# Example log file (successful run with no errors):
============================================================
RUN SUMMARY - 2026-01-19 06:01:30 UTC
============================================================
Fetched: 1250 | Inserted: 45 | Updated: 1205 | Details: 1250 | Errors: 0
============================================================

# Example log file (run with errors):
2026-01-19 06:00:15 [ERROR] __main__: Error upserting tender 12345: APIError: {...}
2026-01-19 06:00:45 [WARNING] __main__: Retry 1/3 for detail API call...

============================================================
RUN SUMMARY - 2026-01-19 06:01:30 UTC
============================================================
Fetched: 1250 | Inserted: 45 | Updated: 1202 | Details: 1247 | Errors: 3
============================================================
```

**For production, consider:**
- Setting up alerts for non-zero error counts or non-empty log files
- Using the exit code (non-zero if errors occurred) for CI/CD pipelines
- Archiving log files before each run if you need history

---

## Project Types

The worker supports all SIMAP project sub-types:

| Type | Description |
|------|-------------|
| `construction` | Construction works (Bauaufträge) |
| `service` | Service contracts (Dienstleistungen) |
| `supply` | Supply/goods contracts (Lieferungen) |
| `project_competition` | Project competition |
| `idea_competition` | Idea competition |
| `overall_performance_competition` | Overall performance competition |
| `project_study` | Project study |
| `idea_study` | Idea study |
| `overall_performance_study` | Overall performance study |
| `request_for_information` | Request for information (RFI) |

---

## SIMAP API Reference

**Official Documentation:** https://www.simap.ch/api-doc/#/publications/getPublicProjectSearch

**Request API Client Credentials:** https://forms.office.com/pages/responsepage.aspx?id=o2w6IQhIR0CKyoFNLN5EdGFhHlNcfO1OgKkZv7DGPcRUOExMVldHSlpKVFZHMk5YOVRXU1g0VzlWSS4u
(Microsoft Forms - covers both production and test/integration environments)

**Additional Guides:** https://kissimap.ch/de/anleitungen (tutorials and how-tos)

**Community Forum:** https://kissimap.ch/de/forum (for questions and discussions)

SIMAP (Système d'information sur les marchés publics) is the official Swiss public procurement platform. The API provides access to all public tenders published in Switzerland.

**API Endpoint:**
```
GET https://www.simap.ch/api/publications/v2/project/project-search
```

**Key Points:**
- The API is **public** and requires no authentication for read access
- At least one filter parameter is required (e.g., `projectSubTypes` or `orderAddressCountryOnlySwitzerland`)
- Uses **rolling pagination** with a `lastItem` cursor (format: `YYYYMMDD|projectNumber`)
- Returns multilingual data (German, French, Italian, English)
- Default page size is 20 items

### Filter Parameters

**Available Filters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `search` | string | Free text search (3-1000 chars) |
| `lang` | array | Languages to search in (see values below) |
| `projectSubTypes` | array | Project sub-types to filter (see values below) |
| `processTypes` | array | Procurement process types (see values below) |
| `newestPubTypes` | array | Publication types (see values below) |
| `cpvCodes` | array | CPV classification codes |
| `npkCodes` | array | NPK codes (Swiss construction standards) |
| `bkpCodes` | array | BKP codes (Swiss construction cost codes) |
| `orderAddressCantons` | array | Canton codes: `BE`, `ZH`, `VD`, etc. |
| `orderAddressCountryOnlySwitzerland` | boolean | Filter to Swiss projects only |
| `newestPublicationFrom` | date | Publication date from (YYYY-MM-DD) |
| `newestPublicationUntil` | date | Publication date until (YYYY-MM-DD) |
| `lastItem` | string | Pagination cursor from previous response |

**Parameter Values:**

`lang` - Languages to search:
```
de, en, fr, it
```

`projectSubTypes` - Project sub-types:
```
construction, service, supply, project_competition, idea_competition,
overall_performance_competition, project_study, idea_study,
overall_performance_study, request_for_information
```

`processTypes` - Procurement process types:
```
open, selective, invitation, direct, no_process
```

`projectTypes` - Project types (different from sub-types):
```
tender, competition, study, request_for_information
```

`newestPubTypes` - Publication types:
```
advance_notice, request_for_information, tender, competition, study_contract,
award, award_tender, award_study_contract, award_competition, direct_award,
participant_selection, revocation, abandonment, selective_offering_phase
```

**Date Filters (for incremental sync):**

For daily update jobs, use these date filters to fetch only recent publications:

| Parameter | Format | Description |
|-----------|--------|-------------|
| `newestPublicationFrom` | `YYYY-MM-DD` | Filter projects with newest publication date >= this date |
| `newestPublicationUntil` | `YYYY-MM-DD` | Filter projects with newest publication date <= this date |
| `lastItem` | `YYYYMMDD\|projectNumber` | Pagination cursor (from previous response's `pagination.lastItem`) |

**Example API Request:**
```bash
# Get Swiss construction tenders
curl -X GET "https://www.simap.ch/api/publications/v2/project/project-search?projectSubTypes=construction&lang=de&orderAddressCountryOnlySwitzerland=true" \
  -H "accept: application/json"

# Get publications from the last week
curl -X GET "https://www.simap.ch/api/publications/v2/project/project-search?orderAddressCountryOnlySwitzerland=true&newestPublicationFrom=2026-01-12" \
  -H "accept: application/json"
```

For the complete API specification, visit the [SIMAP API Documentation](https://www.simap.ch/api-doc/).

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `Missing Supabase URL` | Pass `--supabase-url` or set `SUPABASE_URL` env var |
| `Missing Supabase key` | Pass `--supabase-key` or set `SUPABASE_KEY` env var |
| `HTTP 403 from SIMAP` | The API may block requests from certain IPs/hosts |
| `HTTP 400 Bad Request` | At least one filter parameter is required |
| `Connection timeout` | Check network connectivity, increase timeout in code |

---

## API Rate Limits

The SIMAP API doesn't document specific rate limits, but the worker:
- Uses pagination (20 items per page by default)
- Has a safety limit of 1000 pages per run
- Includes proper error handling for failed requests
- Rate-limits detail API calls (default: 0.5s between requests)
- Automatic retry with backoff for transient failures (429, 5xx errors)

---

## Implemented Optimizations

The following performance optimizations are now available:

### Parallel Processing ✅
- **Concurrent detail fetching**: Fetches multiple publication details in parallel using `asyncio` + `httpx.AsyncClient`
- **Configurable concurrency**: Use `--max-concurrent N` to control parallel API calls (default: 10)
- **Performance improvement**: 5-10x faster detail fetching (~2/sec → 10-20/sec)

### Batch Processing ✅
- **Chunked database writes**: Batches upserts into 100-record transactions
- **Batch detail updates**: Efficiently updates multiple tender details in single operations
- **Automatic fallback**: Falls back to individual writes if batch fails

### Incremental Sync / Checkpoint Resume ✅
- **Checkpoint tracking**: Saves sync progress to `sync_state` table after each page
- **Resume capability**: Use `--resume` to continue from last interrupted sync
- **Automatic cleanup**: Clears checkpoint after successful completion

---

## Future Improvements

Potential enhancements for further scaling:

### Monitoring & Observability
- **Structured logging**: JSON logs for better parsing in log aggregation systems
- **Metrics export**: Prometheus/StatsD metrics for sync duration, error rates, throughput
- **Alerting**: Slack/email notifications on sync failures or anomalies

### Additional Resilience
- **Dead letter queue**: Track and retry permanently failed records
- **Circuit breaker**: Automatically back off when SIMAP API is degraded
- **Delta sync**: Only fetch tenders modified since last `updated_at` timestamp

### Authenticated Document Sync
Access the full tender documents (the 3rd layer of SIMAP data) via authenticated API:

**Prerequisites:**
- SIMAP vendor account with OAuth2 credentials (client_id, client_secret) - [Request credentials here](https://forms.office.com/pages/responsepage.aspx?id=o2w6IQhIR0CKyoFNLN5EdGFhHlNcfO1OgKkZv7DGPcRUOExMVldHSlpKVFZHMk5YOVRXU1g0VzlWSS4u)
- User must be registered and approved on SIMAP platform

**Implementation Flow:**
1. **OAuth2 Authentication**: Implement Authorization Code flow (`/oauth/authorize` → `/oauth/token`)
2. **Express Interest**: Call `PUT /publications/v1/project/{projectId}/interest` for each tender
3. **List Documents**: Fetch available documents via `GET /vendors/v1/my/projects/{projectId}/documents`
4. **Download Documents**: Get download token from `GET /project-documents/v1/docs/{documentId}` and download

**Key API Endpoints:**
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/oauth/authorize` | GET | Start OAuth2 authorization flow |
| `/oauth/token` | POST | Exchange code for access token |
| `/publications/v1/project/{id}/interest` | PUT | Express interest in a tender |
| `/vendors/v1/my/projects/{id}/documents` | GET | List available documents |
| `/project-documents/v1/docs/{id}` | GET | Get document download token |

**Features to Build:**
- **Auto-express interest**: Automatically express interest for bookmarked tenders
- **Document indexing**: Download and parse PDF/DOC files for full-text search
- **Attachment metadata**: Store document list in `tenders.documents` JSONB column
- **Secure credential storage**: Use environment variables or secrets manager for OAuth tokens
