#!/bin/bash

# Script to set up environment variables for Azure Static Web Apps
# Replace these values with your actual values
STATIC_WEBAPP_NAME="your-static-webapp-name"
RESOURCE_GROUP="your-resource-group"

# Display current settings
echo "Current application settings:"
az staticwebapp appsettings list \
  --name $STATIC_WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "[].{name:name,value:value}" \
  --output table

# Set environment variables for email functionality
echo "Setting environment variables for email functionality..."
az staticwebapp appsettings set \
  --name $STATIC_WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --setting-names \
    RESEND_API_KEY="your-resend-api-key" \
    EMAIL_FROM="notifications@aistudyplans.com" \
    EMAIL_REPLY_TO="support@aistudyplans.com" \
    NEXT_PUBLIC_APP_URL="https://aistudyplans.com"

# Verify settings were applied
echo "Updated application settings:"
az staticwebapp appsettings list \
  --name $STATIC_WEBAPP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query "[].{name:name,value:value}" \
  --output table

echo "Environment variables have been configured."
echo "Note: Your Azure Static Web App will automatically rebuild with these new settings." 