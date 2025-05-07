#!/bin/bash
# Script to configure the Resend API Key in Function App

# Variables
RESOURCE_GROUP="AIStudyPlans-RG1"
FUNCTION_APP_NAME="aistudyplans-function"
KEYVAULT_NAME="aistudyplansvault"

echo "Configuring Resend API Key for Function App..."

# Set the Resend API Key as a Key Vault reference
az functionapp config appsettings set --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP \
  --settings "RESEND_API_KEY=@Microsoft.KeyVault(SecretUri=https://$KEYVAULT_NAME.vault.azure.net/secrets/RESEND-API-KEY/)"

echo "✅ Resend API Key reference added to Function App settings"
echo "The Function App now references the Key Vault for the Resend API Key" 