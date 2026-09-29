-- ============================================
-- Campus Ambassador Profile System
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Create the campus_ambassadors table
CREATE TABLE IF NOT EXISTS campus_ambassadors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ref_no TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  college TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  linkedin_url TEXT NOT NULL,
  photo_url TEXT,
  status TEXT DEFAULT 'pending' NOT NULL CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT now(),
  approved_at TIMESTAMPTZ
);

-- 2. Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_campus_ambassadors_status ON campus_ambassadors(status);
CREATE INDEX IF NOT EXISTS idx_campus_ambassadors_ref_no ON campus_ambassadors(ref_no);
CREATE INDEX IF NOT EXISTS idx_campus_ambassadors_email ON campus_ambassadors(email);

-- 3. Enable Row Level Security
ALTER TABLE campus_ambassadors ENABLE ROW LEVEL SECURITY;

-- 4. Policy: Anyone can view approved ambassadors
CREATE POLICY "Public can view approved ambassadors"
  ON campus_ambassadors
  FOR SELECT
  USING (status = 'approved');

-- 5. Policy: Anyone can insert (registration)
CREATE POLICY "Anyone can register as ambassador"
  ON campus_ambassadors
  FOR INSERT
  WITH CHECK (true);

-- ============================================
-- ALSO DO THIS MANUALLY IN SUPABASE DASHBOARD:
-- ============================================
-- 1. Go to Storage > Create new bucket
-- 2. Name: "ambassador-photos"
-- 3. Set it as PUBLIC bucket
-- 4. Add policies for upload and read access
--
-- Or run these SQL statements:
--
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('ambassador-photos', 'ambassador-photos', true);
--
-- CREATE POLICY "Allow public upload to ambassador-photos"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'ambassador-photos');
--
-- CREATE POLICY "Allow public read from ambassador-photos"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'ambassador-photos');
-- ============================================
