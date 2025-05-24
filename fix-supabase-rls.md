# Fix Supabase RLS Policies for Waitlist

## Problem
The waitlist signup is failing with the error: `"new row violates row-level security policy for table "waitlist_users"`

This happens because the current RLS policies only allow authenticated users to access the tables, but our API uses the anonymous Supabase client.

## Solution

1. **Open your Supabase dashboard**
   - Go to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar

3. **Run the fix script**
   - Copy the contents of `scripts/fix-rls-policies.sql`
   - Paste it into a new query in the SQL Editor
   - Click "Run" to execute the script

## What this fix does

- **Removes** the overly restrictive policies that blocked anonymous access
- **Creates** new granular policies that:
  - Allow anonymous users to INSERT (for waitlist signups and feedback)
  - Allow authenticated users full access (for admin functions)
  - Maintain security while enabling functionality

## Test the fix

After running the SQL script:

1. **Test locally**: Try submitting the waitlist form at `http://localhost:3000`
2. **Check logs**: The database error should be gone
3. **Verify production**: Test the waitlist form at `https://aistudyplanslanding.azurewebsites.net`

## Expected result

✅ Waitlist signups will be saved to the database  
✅ Users will receive confirmation emails  
✅ Admin will receive notification emails  
✅ No more RLS policy violations 