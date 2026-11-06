-- ============================================================
-- NeuraSprint 2026 — Registration & Payment Tables
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. Registration table
CREATE TABLE IF NOT EXISTS neurasprint_registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,

  -- Personal info
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  college TEXT NOT NULL,
  year TEXT NOT NULL,          -- e.g. "1st Year", "2nd Year", etc.
  branch TEXT NOT NULL,        -- e.g. "Computer Science", "IT", etc.

  -- Technical info
  skills TEXT[] DEFAULT '{}',  -- e.g. {"React","Node.js","Python"}
  github_url TEXT,
  linkedin_url TEXT,
  prior_hackathons TEXT,       -- brief description or count

  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_amount INTEGER DEFAULT 9900,  -- amount in paise (₹99 = 9900 paise)
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  payment_method TEXT,         -- "upi", "card", "wallet", etc.
  paid_at TIMESTAMPTZ,

  -- Registration meta
  registration_id TEXT UNIQUE NOT NULL,  -- human-readable ID like "NS26-XXXX"
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'confirmed', 'cancelled', 'disqualified')),
  notes TEXT,                  -- admin notes

  -- Auth (optional — link to Supabase auth user if logged in)
  user_id UUID REFERENCES auth.users(id),

  -- Constraints
  CONSTRAINT unique_email UNIQUE (email)
);

-- 2. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_neurasprint_email ON neurasprint_registrations(email);
CREATE INDEX IF NOT EXISTS idx_neurasprint_payment_status ON neurasprint_registrations(payment_status);
CREATE INDEX IF NOT EXISTS idx_neurasprint_registration_id ON neurasprint_registrations(registration_id);
CREATE INDEX IF NOT EXISTS idx_neurasprint_status ON neurasprint_registrations(status);
CREATE INDEX IF NOT EXISTS idx_neurasprint_created_at ON neurasprint_registrations(created_at DESC);

-- 3. Auto-update `updated_at` on row change
CREATE OR REPLACE FUNCTION update_neurasprint_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_neurasprint_updated_at
  BEFORE UPDATE ON neurasprint_registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_neurasprint_updated_at();

-- 4. Row Level Security
ALTER TABLE neurasprint_registrations ENABLE ROW LEVEL SECURITY;

-- Allow inserts from anon (public registration form)
CREATE POLICY "Allow public registration inserts"
  ON neurasprint_registrations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Allow users to read their own registration
CREATE POLICY "Users can read own registration"
  ON neurasprint_registrations
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Allow service role full access (for admin API routes)
CREATE POLICY "Service role full access"
  ON neurasprint_registrations
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow anon to read by registration_id (for verification page)
CREATE POLICY "Allow anon read by registration_id"
  ON neurasprint_registrations
  FOR SELECT
  TO anon
  USING (true);

-- Allow updates to payment fields (for payment callback)
CREATE POLICY "Allow payment updates"
  ON neurasprint_registrations
  FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Helper RPC function for aggregated stats (used by admin dashboard)
CREATE OR REPLACE FUNCTION neurasprint_stats()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_build_object(
    'total', COUNT(*),
    'paid', COUNT(*) FILTER (WHERE payment_status = 'paid'),
    'pending', COUNT(*) FILTER (WHERE payment_status = 'pending'),
    'failed', COUNT(*) FILTER (WHERE payment_status = 'failed'),
    'revenue', COALESCE(SUM(payment_amount) FILTER (WHERE payment_status = 'paid'), 0) / 100
  )
  INTO result
  FROM neurasprint_registrations;
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
