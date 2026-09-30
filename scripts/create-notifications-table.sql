-- ==========================================================
-- CodeNeuraX Notification System Migration
-- Run this in your Supabase SQL Editor if not already run
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.notifications (
  id BIGSERIAL PRIMARY KEY,
  recipient_email VARCHAR(255) NOT NULL,
  sender_name VARCHAR(255),
  sender_email VARCHAR(255),
  type VARCHAR(50) NOT NULL, -- 'team_join_request', 'team_accepted', 'team_rejected', 'team_removed'
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  team_id UUID,
  team_name VARCHAR(255),
  link_url TEXT DEFAULT '/buddykid',
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optimize lookup queries for user's unread notifications
CREATE INDEX IF NOT EXISTS idx_notifications_recipient_unread ON public.notifications (recipient_email, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications (created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Policies (Public / Anon users access via API routes with Service Role Key)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Service role full access on notifications'
  ) THEN
    CREATE POLICY "Service role full access on notifications" ON public.notifications
      FOR ALL USING (auth.role() = 'service_role');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can read own notifications'
  ) THEN
    CREATE POLICY "Users can read own notifications" ON public.notifications
      FOR SELECT USING (auth.jwt() ->> 'email' = recipient_email);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'notifications' AND policyname = 'Users can update own notifications'
  ) THEN
    CREATE POLICY "Users can update own notifications" ON public.notifications
      FOR UPDATE USING (auth.jwt() ->> 'email' = recipient_email);
  END IF;
END
$$;
