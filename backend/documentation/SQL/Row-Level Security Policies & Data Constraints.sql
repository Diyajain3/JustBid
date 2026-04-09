-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================
-- Run this in Supabase SQL Editor to enable RLS on all tables
-- This script is idempotent - safe to run multiple times
--
-- Policy summary:
--   tenders:            Public read for everyone (anon + authenticated)
--   cpv_codes/npk_codes: Public read (reference data)
--   companies:          Read by authenticated, write by linked users
--   user_profiles:      Users access only their own profiles
--   search_profiles:    Users access only their own (via user_profiles)
--   user_tender_actions: Users access only their own (via user_profiles)
--   subscriptions:      Users access only their own
-- ============================================

-- ============================================
-- 1. TENDERS (public procurement data)
-- ============================================
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "tenders_select_anon" ON public.tenders;
DROP POLICY IF EXISTS "tenders_select_authenticated" ON public.tenders;
DROP POLICY IF EXISTS "tenders_all_service_role" ON public.tenders;

-- Anyone can read non-deleted tenders (public procurement data)
CREATE POLICY "tenders_select_anon" ON public.tenders
    FOR SELECT
    TO anon
    USING (deleted_at IS NULL);

-- All authenticated users can read non-deleted tenders
CREATE POLICY "tenders_select_authenticated" ON public.tenders
    FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Service role can do everything (for sync worker)
CREATE POLICY "tenders_all_service_role" ON public.tenders
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 2. CPV_CODES (public reference data)
-- ============================================
ALTER TABLE public.cpv_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "cpv_codes_select_all" ON public.cpv_codes;

-- Anyone can read CPV codes (including anon for public pages)
CREATE POLICY "cpv_codes_select_all" ON public.cpv_codes
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- ============================================
-- 3. NPK_CODES (public reference data)
-- ============================================
ALTER TABLE public.npk_codes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "npk_codes_select_all" ON public.npk_codes;

-- Anyone can read NPK codes (including anon for public pages)
CREATE POLICY "npk_codes_select_all" ON public.npk_codes
    FOR SELECT
    TO anon, authenticated
    USING (true);

-- ============================================
-- 4. COMPANIES
-- ============================================
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "companies_select_authenticated" ON public.companies;
DROP POLICY IF EXISTS "companies_update_linked_users" ON public.companies;
DROP POLICY IF EXISTS "companies_insert_authenticated" ON public.companies;

-- All authenticated users can read non-deleted companies
CREATE POLICY "companies_select_authenticated" ON public.companies
    FOR SELECT
    TO authenticated
    USING (deleted_at IS NULL);

-- Users can update companies they're linked to via user_profiles
CREATE POLICY "companies_update_linked_users" ON public.companies
    FOR UPDATE
    TO authenticated
    USING (
        id IN (
            SELECT company_id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    )
    WITH CHECK (
        id IN (
            SELECT company_id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Users can insert new companies (for registration flow)
CREATE POLICY "companies_insert_authenticated" ON public.companies
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- ============================================
-- 5. USER_PROFILES
-- ============================================
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "user_profiles_select_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_insert_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_update_own" ON public.user_profiles;
DROP POLICY IF EXISTS "user_profiles_delete_own" ON public.user_profiles;

-- Users can only see their own non-deleted profiles
CREATE POLICY "user_profiles_select_own" ON public.user_profiles
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL);

-- Users can only insert profiles for themselves
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

-- Users can only update their own profiles
CREATE POLICY "user_profiles_update_own" ON public.user_profiles
    FOR UPDATE
    TO authenticated
    USING (user_id = auth.uid() AND deleted_at IS NULL)
    WITH CHECK (user_id = auth.uid());

-- Users can soft-delete their own profiles
CREATE POLICY "user_profiles_delete_own" ON public.user_profiles
    FOR DELETE
    TO authenticated
    USING (user_id = auth.uid());

-- ============================================
-- 6. SEARCH_PROFILES
-- ============================================
ALTER TABLE public.search_profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "search_profiles_select_own" ON public.search_profiles;
DROP POLICY IF EXISTS "search_profiles_insert_own" ON public.search_profiles;
DROP POLICY IF EXISTS "search_profiles_update_own" ON public.search_profiles;
DROP POLICY IF EXISTS "search_profiles_delete_own" ON public.search_profiles;
DROP POLICY IF EXISTS "search_profiles_all_service_role" ON public.search_profiles;

-- Users can only see search profiles linked to their user_profiles
CREATE POLICY "search_profiles_select_own" ON public.search_profiles
    FOR SELECT
    TO authenticated
    USING (
        user_profile_id IN (
            SELECT id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Users can insert search profiles for their own user_profiles
CREATE POLICY "search_profiles_insert_own" ON public.search_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_profile_id IN (
            SELECT id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Users can update their own search profiles
CREATE POLICY "search_profiles_update_own" ON public.search_profiles
    FOR UPDATE
    TO authenticated
    USING (
        user_profile_id IN (
            SELECT id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    )
    WITH CHECK (
        user_profile_id IN (
            SELECT id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Users can delete their own search profiles
CREATE POLICY "search_profiles_delete_own" ON public.search_profiles
    FOR DELETE
    TO authenticated
    USING (
        user_profile_id IN (
            SELECT id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Service role can do everything (for matching worker)
CREATE POLICY "search_profiles_all_service_role" ON public.search_profiles
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 7. USER_TENDER_ACTIONS
-- ============================================
ALTER TABLE public.user_tender_actions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "user_tender_actions_select_own" ON public.user_tender_actions;
DROP POLICY IF EXISTS "user_tender_actions_insert_own" ON public.user_tender_actions;
DROP POLICY IF EXISTS "user_tender_actions_update_own" ON public.user_tender_actions;
DROP POLICY IF EXISTS "user_tender_actions_delete_own" ON public.user_tender_actions;
DROP POLICY IF EXISTS "user_tender_actions_all_service_role" ON public.user_tender_actions;

-- Users can only see actions linked to their user_profiles
CREATE POLICY "user_tender_actions_select_own" ON public.user_tender_actions
    FOR SELECT
    TO authenticated
    USING (
        user_profile_id IN (
            SELECT id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Users can insert actions for their own user_profiles
CREATE POLICY "user_tender_actions_insert_own" ON public.user_tender_actions
    FOR INSERT
    TO authenticated
    WITH CHECK (
        user_profile_id IN (
            SELECT id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Users can update their own actions
CREATE POLICY "user_tender_actions_update_own" ON public.user_tender_actions
    FOR UPDATE
    TO authenticated
    USING (
        user_profile_id IN (
            SELECT id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    )
    WITH CHECK (
        user_profile_id IN (
            SELECT id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Users can delete their own actions
CREATE POLICY "user_tender_actions_delete_own" ON public.user_tender_actions
    FOR DELETE
    TO authenticated
    USING (
        user_profile_id IN (
            SELECT id
            FROM public.user_profiles
            WHERE user_id = auth.uid()
            AND deleted_at IS NULL
        )
    );

-- Service role can do everything (for matching worker)
CREATE POLICY "user_tender_actions_all_service_role" ON public.user_tender_actions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 8. SUBSCRIPTIONS
-- ============================================
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "subscriptions_select_own" ON public.subscriptions;
DROP POLICY IF EXISTS "subscriptions_all_service_role" ON public.subscriptions;

-- Users can only see their own subscription
CREATE POLICY "subscriptions_select_own" ON public.subscriptions
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

-- Only service role can insert/update subscriptions (Stripe webhooks)
CREATE POLICY "subscriptions_all_service_role" ON public.subscriptions
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- 9. SYNC_STATE (worker checkpoints)
-- ============================================
ALTER TABLE public.sync_state ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "sync_state_all_service_role" ON public.sync_state;

-- Only service role can access sync_state (for sync worker)
CREATE POLICY "sync_state_all_service_role" ON public.sync_state
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- ============================================
-- UNIQUE CONSTRAINT FOR TENDERS
-- ============================================
-- Ensure no duplicate tenders from same source (use IF NOT EXISTS pattern)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'tenders_external_id_source_unique'
    ) THEN
        ALTER TABLE public.tenders
            ADD CONSTRAINT tenders_external_id_source_unique
            UNIQUE (external_id, source);
    END IF;
END $$;

-- ============================================
-- INDEX FOR USER_TENDER_ACTIONS
-- ============================================
-- Prevent duplicate actions per user_profile + tender
CREATE UNIQUE INDEX IF NOT EXISTS user_tender_actions_profile_tender_unique
    ON public.user_tender_actions (user_profile_id, tender_id);
