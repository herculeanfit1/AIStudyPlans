-- Fix RLS policies for waitlist and feedback functionality
-- Run this in the Supabase SQL Editor to fix the database access issues

-- Drop existing restrictive policies
DROP POLICY IF EXISTS waitlist_users_policy ON waitlist_users;
DROP POLICY IF EXISTS feedback_responses_policy ON feedback_responses;

-- Create new policies that allow anonymous users to insert data
-- This is necessary for the waitlist signup form and feedback submission

-- Policy for waitlist_users table
-- Allow anonymous users to INSERT (signup)
-- Allow authenticated users to do everything (admin access)
CREATE POLICY waitlist_users_insert_policy ON waitlist_users
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY waitlist_users_select_policy ON waitlist_users
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY waitlist_users_update_policy ON waitlist_users
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY waitlist_users_delete_policy ON waitlist_users
  FOR DELETE TO authenticated
  USING (true);

-- Policy for feedback_responses table
-- Allow anonymous users to INSERT (feedback submission)
-- Allow authenticated users to do everything (admin access)
CREATE POLICY feedback_responses_insert_policy ON feedback_responses
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY feedback_responses_select_policy ON feedback_responses
  FOR SELECT TO authenticated
  USING (true);

CREATE POLICY feedback_responses_update_policy ON feedback_responses
  FOR UPDATE TO authenticated
  USING (true);

CREATE POLICY feedback_responses_delete_policy ON feedback_responses
  FOR DELETE TO authenticated
  USING (true);

-- Ensure grants are still in place (these should already exist but let's be safe)
GRANT SELECT, INSERT, UPDATE ON waitlist_users TO anon;
GRANT SELECT, INSERT ON feedback_responses TO anon;
GRANT USAGE ON SEQUENCE waitlist_users_id_seq TO anon;
GRANT USAGE ON SEQUENCE feedback_responses_id_seq TO anon;

-- Grant full access to authenticated users (for admin functions)
GRANT ALL ON waitlist_users TO authenticated;
GRANT ALL ON feedback_responses TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated; 