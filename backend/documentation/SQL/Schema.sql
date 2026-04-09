-- ============================================
-- Tender Scout - Supabase Schema
-- ============================================
-- Run this in Supabase SQL Editor to create all tables.
-- For RLS policies, see: Row-Level Security Policies & Data Constraints.sql
-- For schema documentation, see: ../DATABASE.md
-- ============================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- DROP EXISTING TABLES (reverse dependency order)
-- ============================================
DROP TABLE IF EXISTS user_tender_actions CASCADE;
DROP TABLE IF EXISTS search_profiles CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS tenders CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS npk_codes CASCADE;
DROP TABLE IF EXISTS cpv_codes CASCADE;
DROP TABLE IF EXISTS sync_state CASCADE;

-- Drop functions (will also drop associated triggers)
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS ensure_single_default_profile() CASCADE;

-- ============================================
-- 1. USERS (managed by Supabase Auth)
-- ============================================
-- Note: The auth.users table is managed by Supabase Auth.
-- We reference it via auth.uid() in RLS policies.
-- Additional user metadata can be stored in auth.users.raw_user_meta_data

-- ============================================
-- 2. SUBSCRIPTIONS
-- ============================================
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) NOT NULL UNIQUE,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    plan VARCHAR(20) NOT NULL DEFAULT 'pro' CHECK (plan IN ('free', 'pro')),
    status VARCHAR(20) NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'past_due', 'cancelled')),
    trial_ends_at TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. COMPANIES
-- ============================================
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    uid VARCHAR(20) UNIQUE, -- Swiss UID (CHE-xxx.xxx.xxx)
    city VARCHAR(100) NOT NULL,
    address VARCHAR(255),
    company_type VARCHAR(50) NOT NULL,
    zefix_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- ============================================
-- 4. USER_PROFILES
-- ============================================
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE (user_id, company_id)
);

-- ============================================
-- 5. SEARCH_PROFILES
-- ============================================
CREATE TABLE search_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL UNIQUE REFERENCES user_profiles(id) ON DELETE CASCADE,
    industry VARCHAR(100),
    company_size VARCHAR(20),
    keywords TEXT[] DEFAULT '{}',
    exclude_keywords TEXT[] DEFAULT '{}',
    regions TEXT[] DEFAULT '{}',
    cpv_codes JSONB DEFAULT '[]',
    npk_codes JSONB DEFAULT '[]',
    ai_generated BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_matched_at TIMESTAMPTZ
);

-- ============================================
-- 6. TENDERS
-- ============================================
CREATE TABLE tenders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(100) NOT NULL,
    publication_id VARCHAR(100), -- SIMAP publication UUID (different from project ID)
    source VARCHAR(20) NOT NULL CHECK (source IN ('simap', 'ted', 'eu')),
    source_url VARCHAR(500),
    title JSONB NOT NULL, -- Multilingual: {"de": "...", "fr": "...", "it": "...", "en": "..."}
    project_number VARCHAR(50),
    publication_number VARCHAR(50),
    project_type VARCHAR(50) CHECK (project_type IN ('tender', 'competition', 'study', 'study_contract', 'request_for_information')),
    project_sub_type VARCHAR(50) CHECK (project_sub_type IN (
        'construction', 'service', 'supply',
        'project_competition', 'idea_competition', 'overall_performance_competition',
        'project_study', 'idea_study', 'overall_performance_study',
        'request_for_information'
    )),
    process_type VARCHAR(20) CHECK (process_type IN ('open', 'selective', 'invitation', 'direct', 'no_process')),
    lots_type VARCHAR(20) CHECK (lots_type IN ('with', 'without')),
    authority JSONB, -- Multilingual: {"de": "...", "fr": "...", "it": "...", "en": "..."}
    authority_type VARCHAR(50) CHECK (authority_type IN ('municipal', 'cantonal', 'federal', 'other')),
    description JSONB, -- Multilingual description from detail API: {"de": "...", ...}
    price_min DECIMAL(15, 2),
    price_max DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'CHF',
    deadline TIMESTAMPTZ, -- Offer submission deadline from detail API
    publication_date TIMESTAMPTZ NOT NULL,
    pub_type VARCHAR(50) CHECK (pub_type IN (
        'advance_notice', 'request_for_information', 'tender', 'competition',
        'study_contract', 'award', 'award_tender', 'award_study_contract', 'award_competition',
        'direct_award', 'participant_selection', 'revocation', 'abandonment',
        'selective_offering_phase'
    )),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closing_soon', 'closed')),
    status_changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    region VARCHAR(10), -- Canton code: BE, ZH, VD, etc.
    country VARCHAR(5) DEFAULT 'CH',
    order_address JSONB, -- Full address from SIMAP: {countryId, cantonId, postalCode, city}
    language VARCHAR(5) DEFAULT 'de' CHECK (language IN ('de', 'fr', 'it', 'en')),
    cpv_codes JSONB DEFAULT '[]',
    corrected BOOLEAN DEFAULT false,
    raw_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,

    -- ========================================
    -- DETAIL FIELDS (from publication-details API)
    -- ========================================
    details_fetched_at TIMESTAMPTZ, -- When details were last fetched from API

    -- Project Info (from project-info section)
    proc_office_address JSONB, -- Full procurement office address with contact details
    procurement_recipient_address JSONB, -- Address for procurement recipient
    offer_address JSONB, -- Where to submit offers
    documents_languages TEXT[] DEFAULT '{}', -- Languages documents are available in
    offer_languages TEXT[] DEFAULT '{}', -- Languages offers can be submitted in
    publication_languages TEXT[] DEFAULT '{}', -- Languages publication is available in
    documents_source_type VARCHAR(50), -- documents_source_simap, documents_source_url, etc.
    offer_types TEXT[] DEFAULT '{}', -- offer_external, offer_simap, etc.
    state_contract_area BOOLEAN DEFAULT false, -- Whether this is a state contract area tender
    publication_ted BOOLEAN DEFAULT false, -- Whether published on TED

    -- Procurement Details (from procurement section)
    construction_type VARCHAR(50), -- execution, planning, etc.
    construction_category VARCHAR(50), -- structural_engineering, civil_engineering, etc.
    bkp_codes JSONB DEFAULT '[]', -- Swiss BKP classification codes (array of {code, label})
    npk_codes JSONB DEFAULT '[]', -- Swiss NPK codes (array of {code, label})
    oag_codes JSONB DEFAULT '[]', -- Swiss OAG codes (array of {code, label})
    additional_cpv_codes JSONB DEFAULT '[]', -- Additional CPV codes beyond main one
    order_address_description JSONB, -- Multilingual description of order address
    variants_allowed VARCHAR(20) CHECK (variants_allowed IN ('yes', 'no', 'not_specified')),
    partial_offers_allowed VARCHAR(20) CHECK (partial_offers_allowed IN ('yes', 'no', 'not_specified')),
    execution_deadline_type VARCHAR(50), -- not_specified, fixed, period, days_after
    execution_period JSONB, -- Period object if applicable
    execution_days INTEGER, -- Number of days if applicable

    -- Terms (from terms section)
    consortium_allowed VARCHAR(20) CHECK (consortium_allowed IN ('yes', 'no', 'not_specified')),
    subcontractor_allowed VARCHAR(20) CHECK (subcontractor_allowed IN ('yes', 'no', 'not_specified')),
    terms_type VARCHAR(50), -- in_documents, specified, etc.
    remedies_notice JSONB, -- Multilingual legal remedies notice

    -- Dates (from dates section)
    qna_deadlines JSONB DEFAULT '[]', -- Array of Q&A deadline objects [{date, note}]
    offer_opening TIMESTAMPTZ, -- When offers will be opened
    offer_validity_days INTEGER, -- How long offers must remain valid

    -- Criteria (from criteria section)
    qualification_criteria JSONB DEFAULT '[]', -- Array of qualification criteria
    award_criteria JSONB DEFAULT '[]', -- Array of award criteria with weights

    -- Lots (from lots array)
    lots JSONB DEFAULT '[]', -- Array of lot objects if lots_type = 'with'

    -- Documents
    has_project_documents BOOLEAN DEFAULT false,

    -- Raw detail data for debugging
    raw_detail_data JSONB,

    UNIQUE (external_id, source)
);

-- ============================================
-- 7. USER_TENDER_ACTIONS
-- ============================================
CREATE TABLE user_tender_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_profile_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    tender_id UUID NOT NULL REFERENCES tenders(id) ON DELETE CASCADE,
    bookmarked BOOLEAN NOT NULL DEFAULT false,
    applied BOOLEAN NOT NULL DEFAULT false,
    hidden BOOLEAN NOT NULL DEFAULT false,
    match_score INTEGER CHECK (match_score >= 0 AND match_score <= 100),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_profile_id, tender_id)
);

-- ============================================
-- 8. CPV_CODES (Lookup)
-- ============================================
CREATE TABLE cpv_codes (
    code VARCHAR(20) PRIMARY KEY,
    label_de VARCHAR(500) NOT NULL,
    label_fr VARCHAR(500),
    label_it VARCHAR(500),
    label_en VARCHAR(500),
    parent_code VARCHAR(20) REFERENCES cpv_codes(code)
);

-- ============================================
-- 9. NPK_CODES (Lookup)
-- ============================================
CREATE TABLE npk_codes (
    code VARCHAR(20) PRIMARY KEY,
    name_de VARCHAR(500) NOT NULL,
    name_fr VARCHAR(500),
    name_it VARCHAR(500),
    parent_code VARCHAR(20) REFERENCES npk_codes(code)
);

-- ============================================
-- 10. SYNC_STATE (Worker checkpoints)
-- ============================================
-- Tracks sync progress for resume capability
CREATE TABLE sync_state (
    id TEXT PRIMARY KEY,                    -- 'simap_search', 'simap_details'
    last_cursor TEXT,                       -- Pagination cursor (e.g., 'YYYYMMDD|projectNumber')
    last_run_at TIMESTAMPTZ,               -- When sync last ran
    last_run_status TEXT CHECK (last_run_status IN ('in_progress', 'completed', 'interrupted', 'failed')),
    records_processed INTEGER DEFAULT 0,    -- Count for current/last run
    metadata JSONB DEFAULT '{}',            -- Additional state (filters, page number, etc.)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- TRIGGERS: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER search_profiles_updated_at
    BEFORE UPDATE ON search_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER tenders_updated_at
    BEFORE UPDATE ON tenders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER user_tender_actions_updated_at
    BEFORE UPDATE ON user_tender_actions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER sync_state_updated_at
    BEFORE UPDATE ON sync_state
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- TRIGGER: Ensure only one default profile per user
-- ============================================
CREATE OR REPLACE FUNCTION ensure_single_default_profile()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        UPDATE user_profiles
        SET is_default = false
        WHERE user_id = NEW.user_id
          AND id != NEW.id
          AND is_default = true;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profiles_single_default
    BEFORE INSERT OR UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION ensure_single_default_profile();

-- ============================================
-- INDEXES
-- ============================================
-- Primary Indexes (auto-created):
-- - All primary keys (UUID) are automatically indexed
-- - Unique constraints auto-create indexes: companies.uid, subscriptions.user_id,
--   subscriptions.stripe_customer_id, tenders(external_id, source)

-- Tender queries (dashboard, filtering)
CREATE INDEX idx_tenders_status_deadline ON tenders(status, deadline)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_tenders_region ON tenders(region)
    WHERE deleted_at IS NULL;
CREATE INDEX idx_tenders_cpv_gin ON tenders USING GIN(cpv_codes);

-- Tender detail fields (for filtering and matching)
CREATE INDEX idx_tenders_bkp_gin ON tenders USING GIN(bkp_codes);
CREATE INDEX idx_tenders_npk_gin ON tenders USING GIN(npk_codes);
CREATE INDEX idx_tenders_additional_cpv_gin ON tenders USING GIN(additional_cpv_codes);
CREATE INDEX idx_tenders_details_fetched ON tenders(details_fetched_at)
    WHERE deleted_at IS NULL AND details_fetched_at IS NULL;

-- Search profile queries
CREATE INDEX idx_search_profiles_cpv_gin ON search_profiles USING GIN(cpv_codes);
CREATE INDEX idx_search_profiles_npk_gin ON search_profiles USING GIN(npk_codes);
CREATE INDEX idx_search_profiles_last_matched ON search_profiles(last_matched_at);

-- User tender actions (dashboard, filtering)
CREATE INDEX idx_actions_profile_score ON user_tender_actions(user_profile_id, match_score DESC);
CREATE INDEX idx_actions_profile_status ON user_tender_actions(user_profile_id, bookmarked, applied, hidden);
CREATE INDEX idx_actions_tender ON user_tender_actions(tender_id);

-- Soft delete filters
CREATE INDEX idx_companies_active ON companies(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_user_profiles_active ON user_profiles(user_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tenders_active ON tenders(id) WHERE deleted_at IS NULL;

-- Subscription queries
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_trial_ends ON subscriptions(trial_ends_at) WHERE status = 'trialing';

-- Lookup tables (hierarchy queries)
CREATE INDEX idx_cpv_parent ON cpv_codes(parent_code);
CREATE INDEX idx_npk_parent ON npk_codes(parent_code);
