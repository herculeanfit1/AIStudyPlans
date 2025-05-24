#!/bin/bash
# Script to update production environment variables for the waitlist functionality

STATIC_WEB_APP_NAME="aistudyplanslanding"
RESOURCE_GROUP="AIStudyPlans-RG1"

echo "🔧 Updating production environment variables for waitlist functionality..."

# Set Supabase configuration
az staticwebapp appsettings set --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP \
  --setting-names \
  "NEXT_PUBLIC_SUPABASE_URL=https://zygigeysssdfcabpqtjh.supabase.co" \
  "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp5Z2lnZ1lzc3NkZmNhYnBxdGpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY3NDYyMzQsImV4cCI6MjA2MjMyMjIzNH0.EC0FZ2UsAcLwpTa1-qHz0nN313dILPLvraV0dwNcDUI"

# Set email configuration  
az staticwebapp appsettings set --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP \
  --setting-names \
  "RESEND_API_KEY=re_YUEfUwWk_HShNqoBExHNjEnNdZVA7gb1S" \
  "EMAIL_FROM=Lindsey <lindsey@aistudyplans.com>" \
  "EMAIL_REPLY_TO=support@aistudyplans.com"

# Set application URLs
az staticwebapp appsettings set --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP \
  --setting-names \
  "NEXT_PUBLIC_APP_URL=https://aistudyplanslanding.azurewebsites.net" \
  "NEXTAUTH_URL=https://aistudyplanslanding.azurewebsites.net"

echo "✅ Environment variables updated successfully!"
echo "📋 Next steps:"
echo "1. Go to your Supabase dashboard: https://supabase.com/dashboard"
echo "2. Run the SQL script from scripts/fix-rls-policies.sql"
echo "3. Test the waitlist form on: https://aistudyplanslanding.azurewebsites.net" 