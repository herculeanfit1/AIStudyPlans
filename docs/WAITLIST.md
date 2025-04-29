# Waitlist and Feedback Campaign System

This document describes the waitlist signup and feedback campaign system implemented for SchedulEd.

## Overview

The system consists of:

1. A waitlist signup form that collects user information
2. Database storage for waitlist users in Supabase
3. A feedback email campaign to gather user feedback
4. A feedback form to collect responses
5. Database storage for feedback responses

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Run the database setup script in the Supabase SQL Editor:
   - Go to SQL Editor in your Supabase dashboard
   - Copy and paste the contents of `scripts/db-setup.sql`
   - Click "Run" to execute the script

### 2. Environment Variables

Add the following environment variables to your project:

```env
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Email sending (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=Your Name <your-email@domain.com>
EMAIL_REPLY_TO=support@domain.com
NEXT_PUBLIC_APP_URL=https://your-app-url.com

# Feedback campaign API key (generate a random secure string)
FEEDBACK_CAMPAIGN_API_KEY=your-secure-random-string
```

### 3. GitHub Actions Setup

For the feedback campaign to run automatically:

1. Add the following secrets to your GitHub repository:
   - `FEEDBACK_CAMPAIGN_API_KEY`: The same value you set in your environment variables
   - `NEXT_PUBLIC_APP_URL`: Your application's URL

2. The GitHub Actions workflow will automatically run at the scheduled time (9:00 AM UTC by default)

## How It Works

### Waitlist Signup

1. User submits the waitlist form with their name and email
2. The data is sent to the `/api/waitlist` endpoint
3. The data is stored in the Supabase `waitlist_users` table
4. A confirmation email is sent to the user
5. An admin notification is sent
6. The user is enrolled in the feedback campaign (with `feedback_campaign_started = true`)

### Feedback Campaign

1. The GitHub Actions workflow runs on a schedule
2. It calls the `/api/feedback-campaign` endpoint, which:
   - Retrieves users who need to receive the next email in their campaign sequence
   - Sends the appropriate feedback email to each user
   - Updates the user's position in the email sequence

3. Each email in the sequence focuses on a different aspect:
   - Email 1: What features would you like to see?
   - Email 2: What challenges do you face with study planning?
   - Email 3: How would you design your ideal study tool?
   - Email 4: Final thoughts before launch and satisfaction rating

4. When a user clicks the feedback link in an email, they're taken to the feedback form with their user ID and email ID as URL parameters
5. When they submit feedback, it's stored in the `feedback_responses` table in Supabase

## Email Sequence Timing

Emails are sent with the following schedule:

1. First email: Immediately after waitlist signup
2. Subsequent emails: At least 3 days after the previous email
3. Maximum of 4 emails in the sequence

## Accessing and Analyzing Feedback

To view and analyze feedback:

1. Log in to your Supabase dashboard
2. Go to Table Editor
3. Select the `feedback_responses` table
4. Use SQL queries for more detailed analysis

Example SQL query to see all feedback, joined with user information:

```sql
SELECT 
  fr.id,
  wu.name,
  wu.email,
  fr.feedback_text,
  fr.feedback_type,
  fr.rating,
  fr.created_at
FROM 
  feedback_responses fr
JOIN 
  waitlist_users wu ON fr.waitlist_user_id = wu.id
ORDER BY 
  fr.created_at DESC;
```

## Customizing Email Templates

Email templates are defined in `lib/feedback-email-templates.ts`. You can modify them to change the content, design, or number of emails in the sequence.

## Customizing the Form

The feedback form is located at `app/feedback/page.tsx`. You can modify this file to change the appearance or fields of the form. 