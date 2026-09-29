-- SQL script to add approval status to BuddyKid members
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql/new

-- 1. Add status column to buddykid_members if it doesn't exist
ALTER TABLE IF EXISTS public.buddykid_members 
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'approved';

-- 2. Update existing rows to 'approved' if they are null
UPDATE public.buddykid_members 
SET status = 'approved' 
WHERE status IS NUL

-- 3. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_buddykid_members_status ON public.buddykid_members (status);
CREATE INDEX IF NOT EXISTS idx_buddykid_members_team_status ON public.buddykid_members (team_id, status);
CREATE INDEX IF NOT EXISTS idx_buddykid_members_email_status ON public.buddykid_members (member_email, status);
