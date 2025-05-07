#!/bin/bash

# Script to remove WEBSITE_RUN_FROM_PACKAGE setting from Azure Function App
# This is needed to fix deployment issues with the GitHub Actions workflow

echo "Removing WEBSITE_RUN_FROM_PACKAGE setting from Azure Function App..."

# Set resource group and function app name
RESOURCE_GROUP="AIStudyPlans-RG1"
FUNCTION_APP_NAME="aistudyplans-function"

# Check if the setting exists
SETTING_EXISTS=$(az functionapp config appsettings list \
  --name "$FUNCTION_APP_NAME" \
  --resource-group "$RESOURCE_GROUP" \
  --query "[?name=='WEBSITE_RUN_FROM_PACKAGE'].name" -o tsv)

if [ -n "$SETTING_EXISTS" ]; then
  echo "Found WEBSITE_RUN_FROM_PACKAGE setting. Removing it..."
  
  # Remove the setting
  az functionapp config appsettings delete \
    --name "$FUNCTION_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --setting-names WEBSITE_RUN_FROM_PACKAGE
  
  echo "Setting removed successfully."
else
  echo "WEBSITE_RUN_FROM_PACKAGE setting not found."
fi

echo "Done." 