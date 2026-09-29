-- Create users table (this is handled by Supabase Auth automatically)
-- But we can create additional profile information if needed

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id BIGSERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_waitlist_created_at ON waitlist(created_at);

-- Enable Row Level Security
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert into waitlist
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- Waitlist readings should only be accessible by service role or authenticated admins
-- (Public anon users cannot read other subscribers' emails)

-- Create a function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_waitlist_updated_at
  BEFORE UPDATE ON waitlist
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- Create community_posts table with RLS
-- ==========================================
CREATE TABLE IF NOT EXISTS community_posts (
  id BIGSERIAL PRIMARY KEY,
  category VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  organizer VARCHAR(255),
  description TEXT NOT NULL,
  link_url TEXT NOT NULL,
  badge VARCHAR(100),
  deadline VARCHAR(100),
  location VARCHAR(150),
  stipend_or_prize VARCHAR(150),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours')
);

CREATE INDEX IF NOT EXISTS idx_community_posts_created_at ON community_posts(created_at);

-- Enable Row Level Security
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone (anon & authenticated) can SELECT posts
CREATE POLICY "Public read community posts" ON community_posts
  FOR SELECT USING (true);

-- Policy: Only service role / admins can INSERT/UPDATE/DELETE community posts
-- (Anonymous users CANNOT insert, update or delete directly)
CREATE POLICY "Service role full access on community posts" ON community_posts
  FOR ALL USING (auth.role() = 'service_role');

