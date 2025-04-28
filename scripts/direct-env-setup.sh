#!/bin/bash
# Script to directly set environment variables in Azure Static Web App (bypassing Key Vault)
# Use this for immediate testing while you work on fixing Key Vault integration

# Your specific values - REPLACE API_KEY with your actual Resend API key
STATIC_WEB_APP_NAME="aistudyplanslanding"
RESOURCE_GROUP="BridgingTrust.AI"
API_KEY="re_REPLACE_WITH_YOUR_ACTUAL_KEY"

echo "Setting environment variables directly for immediate testing..."

# Update app settings directly with the API key
az staticwebapp appsettings set \
  --name $STATIC_WEB_APP_NAME \
  --resource-group "$RESOURCE_GROUP" \
  --setting-names \
    "RESEND_API_KEY=$API_KEY" \
    "EMAIL_FROM=lindsey@aistudyplans.com" \
    "EMAIL_REPLY_TO=support@aistudyplans.com" \
    "NEXT_PUBLIC_APP_URL=https://aistudyplans.com"

echo "✅ Environment variables set directly!"
echo ""
echo "This should immediately fix your email functionality."
echo "After confirming it works, you can set up Key Vault integration using the fix-managed-identity.sh script." 