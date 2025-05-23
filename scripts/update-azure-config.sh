#!/bin/bash

# Script to update Azure Static Web App settings with email configuration status
# This script checks if email configuration is present and sets the NEXT_PUBLIC_RESEND_CONFIGURED flag

# Set error handling
set -e

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Azure CLI is not installed. Please install it first."
    echo "Visit: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
fi

# Check if user is logged in to Azure
az account show &> /dev/null || {
    echo "You are not logged in to Azure. Please run 'az login' first."
    exit 1
}

# Get Static Web App name from argument or use default
STATIC_WEBAPP_NAME=${1:-"aistudyplans"}

echo "Updating configuration for Azure Static Web App: $STATIC_WEBAPP_NAME"

# Check if RESEND_API_KEY is configured in Azure
RESEND_API_KEY_VALUE=$(az staticwebapp appsettings list --name $STATIC_WEBAPP_NAME --query "[?name=='RESEND_API_KEY'].value" -o tsv)
EMAIL_FROM_VALUE=$(az staticwebapp appsettings list --name $STATIC_WEBAPP_NAME --query "[?name=='EMAIL_FROM'].value" -o tsv)
EMAIL_REPLY_TO_VALUE=$(az staticwebapp appsettings list --name $STATIC_WEBAPP_NAME --query "[?name=='EMAIL_REPLY_TO'].value" -o tsv)

# Determine if email is fully configured
EMAIL_CONFIGURED="false"
if [[ -n "$RESEND_API_KEY_VALUE" && -n "$EMAIL_FROM_VALUE" && -n "$EMAIL_REPLY_TO_VALUE" ]]; then
    EMAIL_CONFIGURED="true"
    echo "✅ Email configuration is present in Azure"
else
    echo "❌ Email configuration is incomplete in Azure"
fi

# Update NEXT_PUBLIC_RESEND_CONFIGURED setting
echo "Setting NEXT_PUBLIC_RESEND_CONFIGURED to $EMAIL_CONFIGURED"
az staticwebapp appsettings set --name $STATIC_WEBAPP_NAME --setting-names NEXT_PUBLIC_RESEND_CONFIGURED=$EMAIL_CONFIGURED

echo "✅ Configuration updated successfully"
echo ""
echo "To verify the settings, run:"
echo "az staticwebapp appsettings list --name $STATIC_WEBAPP_NAME --query \"[?contains(name, 'RESEND')].{Name:name, Value:value}\" -o table" 