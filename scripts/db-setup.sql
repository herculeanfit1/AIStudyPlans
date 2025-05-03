-- Schema for waitlist and feedback functionality
-- Run this in the Supabase SQL Editor to set up the database tables

-- Create waitlist users table
CREATE TABLE IF NOT EXISTS waitlist_users (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  feedback_campaign_started BOOLEAN NOT NULL DEFAULT FALSE,
  last_email_sent_at TIMESTAMPTZ,
  email_sequence_position INTEGER,
  tags TEXT[],
  source TEXT,
  notes TEXT
);

-- Create feedback responses table
CREATE TABLE IF NOT EXISTS feedback_responses (
  id BIGSERIAL PRIMARY KEY,
  waitlist_user_id BIGINT NOT NULL REFERENCES waitlist_users(id),
  feedback_text TEXT NOT NULL,
  rating INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  email_id TEXT,
  feedback_type TEXT NOT NULL
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_users(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_campaign ON waitlist_users(feedback_campaign_started, email_sequence_position);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON feedback_responses(waitlist_user_id);

-- RLS (Row Level Security) policies for enhanced security
-- These policies control access to the tables

-- Enable RLS on both tables
ALTER TABLE waitlist_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_responses ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows only authenticated access to waitlist users
CREATE POLICY waitlist_users_policy ON waitlist_users
  FOR ALL USING (auth.role() = 'authenticated');

-- Create a policy that allows only authenticated access to feedback responses
CREATE POLICY feedback_responses_policy ON feedback_responses
  FOR ALL USING (auth.role() = 'authenticated');

-- Grant access to the anon user for the web application
GRANT SELECT, INSERT, UPDATE ON waitlist_users TO anon;
GRANT SELECT, INSERT ON feedback_responses TO anon;
GRANT USAGE ON SEQUENCE waitlist_users_id_seq TO anon;
GRANT USAGE ON SEQUENCE feedback_responses_id_seq TO anon; 