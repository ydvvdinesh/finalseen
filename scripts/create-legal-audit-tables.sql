-- ==========================================================
-- CodeNeuraX Legal & Government Audit Archive System
-- Compliance with IT Act, CERT-In & Cyber Investigation Standards
-- Run this in Supabase SQL Editor
-- ==========================================================

-- ──────────────────────────────────────────────────────────
-- 1. BuddyKid Squad Legal Audit Archive (Creations & Deletions)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.buddykid_audit_archive (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL,
  team_name TEXT,
  hackathon_name TEXT,
  team_code TEXT,
  max_members INTEGER,
  creator_name TEXT,
  creator_email TEXT NOT NULL,
  creator_college TEXT,
  creator_linkedin TEXT,
  creator_skills TEXT,
  team_created_at TIMESTAMPTZ,
  members_snapshot JSONB DEFAULT '[]'::jsonb,
  recorded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT now(),
  actor_email TEXT NOT NULL,
  deleted_by_email TEXT,
  ip_address TEXT,
  user_agent TEXT,
  action_type TEXT DEFAULT 'team_created' NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_buddykid_audit_team_id ON public.buddykid_audit_archive (team_id);
CREATE INDEX IF NOT EXISTS idx_buddykid_audit_creator_email ON public.buddykid_audit_archive (creator_email);
CREATE INDEX IF NOT EXISTS idx_buddykid_audit_actor_email ON public.buddykid_audit_archive (actor_email);
CREATE INDEX IF NOT EXISTS idx_buddykid_audit_action_type ON public.buddykid_audit_archive (action_type);
CREATE INDEX IF NOT EXISTS idx_buddykid_audit_recorded_at ON public.buddykid_audit_archive (recorded_at);

-- Row Level Security: TAMPER-PROOF
-- Public and regular users CANNOT SELECT, UPDATE, or DELETE audit evidence
ALTER TABLE public.buddykid_audit_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on buddykid audit"
  ON public.buddykid_audit_archive
  FOR ALL
  USING (auth.role() = 'service_role');

-- ──────────────────────────────────────────────────────────
-- 2. Campus Ambassador Legal Audit Archive (Applications & Deletions)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.campus_ambassadors_audit_archive (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ambassador_id UUID NOT NULL,
  ref_no TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  college TEXT,
  address TEXT,
  linkedin_url TEXT,
  photo_url TEXT,
  status TEXT,
  ambassador_created_at TIMESTAMPTZ,
  approved_at TIMESTAMPTZ,
  recorded_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT now(),
  actor TEXT NOT NULL,
  deleted_by TEXT,
  ip_address TEXT,
  user_agent TEXT,
  action_type TEXT DEFAULT 'ambassador_applied' NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_ca_audit_ambassador_id ON public.campus_ambassadors_audit_archive (ambassador_id);
CREATE INDEX IF NOT EXISTS idx_ca_audit_email ON public.campus_ambassadors_audit_archive (email);
CREATE INDEX IF NOT EXISTS idx_ca_audit_ref_no ON public.campus_ambassadors_audit_archive (ref_no);
CREATE INDEX IF NOT EXISTS idx_ca_audit_action_type ON public.campus_ambassadors_audit_archive (action_type);
CREATE INDEX IF NOT EXISTS idx_ca_audit_recorded_at ON public.campus_ambassadors_audit_archive (recorded_at);

-- Row Level Security: TAMPER-PROOF
-- Public and regular users CANNOT SELECT, UPDATE, or DELETE audit evidence
ALTER TABLE public.campus_ambassadors_audit_archive ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on campus ambassador audit"
  ON public.campus_ambassadors_audit_archive
  FOR ALL
  USING (auth.role() = 'service_role');

-- ──────────────────────────────────────────────────────────
-- 3. User Authentication Legal Audit (IP & Geo-Location Tracking)
-- ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_login_audit (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  email TEXT NOT NULL,
  name TEXT,
  ip_address TEXT NOT NULL,
  city TEXT,
  region TEXT,
  country TEXT,
  country_code TEXT,
  latitude TEXT,
  longitude TEXT,
  timezone TEXT,
  user_agent TEXT,
  login_method TEXT DEFAULT 'google_oauth' NOT NULL,
  login_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_login_audit_email ON public.user_login_audit (email);
CREATE INDEX IF NOT EXISTS idx_login_audit_ip ON public.user_login_audit (ip_address);
CREATE INDEX IF NOT EXISTS idx_login_audit_login_at ON public.user_login_audit (login_at);
CREATE INDEX IF NOT EXISTS idx_login_audit_country ON public.user_login_audit (country);

ALTER TABLE public.user_login_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access on login audit"
  ON public.user_login_audit
  FOR ALL
  USING (auth.role() = 'service_role');

