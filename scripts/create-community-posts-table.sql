-- Table for daily 24-hour community updates (Internships, Hackathons, Tech News)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/vyyrpodennxjgjgmlxeu/sql/new

CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category VARCHAR(50) NOT NULL CHECK (category IN ('internship', 'hackathon', 'news')),
  title VARCHAR(255) NOT NULL,
  organizer VARCHAR(255),
  description TEXT NOT NULL,
  link_url TEXT NOT NULL,
  badge VARCHAR(100),
  deadline VARCHAR(100),
  location VARCHAR(100),
  stipend_or_prize VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

-- Index for fast 24-hour queries and category filters
CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON public.community_posts (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_community_posts_category ON public.community_posts (category);
CREATE INDEX IF NOT EXISTS idx_community_posts_expires_at ON public.community_posts (expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view active posts
CREATE POLICY "Allow public read active posts" ON public.community_posts
  FOR SELECT
  USING (created_at >= NOW() - INTERVAL '24 hours');

-- Allow insert/delete from service role or API
CREATE POLICY "Allow authenticated insert" ON public.community_posts
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow delete" ON public.community_posts
  FOR DELETE
  USING (true);
