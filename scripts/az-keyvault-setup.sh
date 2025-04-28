#!/bin/bash
# Script to set up proper Key Vault integration with Azure Static Web Apps

# Replace these with your actual values
RESOURCE_GROUP="your-resource-group"
STATIC_WEB_APP_NAME="aistudyplanslanding"
KEY_VAULT_NAME="aistudyplansvault"
RESEND_API_KEY_SECRET_NAME="RESEND-API-KEY"

echo "Setting up Azure Key Vault integration with Static Web App..."

# Step 1: Ensure the Static Web App has a system-assigned managed identity
echo "Enabling system-assigned managed identity for Static Web App..."
az staticwebapp identity assign \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --identities [system]

# Step 2: Get the principal ID of the managed identity
PRINCIPAL_ID=$(az staticwebapp identity show \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --query principalId \
  --output tsv)

echo "Static Web App managed identity principal ID: $PRINCIPAL_ID"

# Step 3: Grant the managed identity access to Key Vault secrets
echo "Granting managed identity access to Key Vault secrets..."
az keyvault set-policy \
  --name $KEY_VAULT_NAME \
  --resource-group $RESOURCE_GROUP \
  --object-id $PRINCIPAL_ID \
  --secret-permissions get list

# Step 4: Get the Key Vault ID
KEY_VAULT_ID=$(az keyvault show \
  --name $KEY_VAULT_NAME \
  --resource-group $RESOURCE_GROUP \
  --query id \
  --output tsv)

echo "Key Vault ID: $KEY_VAULT_ID"

# Step 5: Update app settings to use Key Vault references correctly
echo "Updating app settings with proper Key Vault references..."

# Option 1: Direct secret reference format
# This works with newer Azure Static Web Apps
az staticwebapp appsettings set \
  --name $STATIC_WEB_APP_NAME \
  --resource-group $RESOURCE_GROUP \
  --setting-names \
    "RESEND_API_KEY=@Microsoft.KeyVault(SecretUri=$KEY_VAULT_ID/secrets/$RESEND_API_KEY_SECRET_NAME/)" \
    "EMAIL_FROM=lindsey@aistudyplans.com" \
    "EMAIL_REPLY_TO=support@aistudyplans.com" \
    "NEXT_PUBLIC_APP_URL=https://aistudyplans.com"

echo "Configuration complete! Please rebuild your Static Web App."
echo "If Key Vault integration still fails, try using the direct API key temporarily:"

echo "az staticwebapp appsettings set \\"
echo "  --name $STATIC_WEB_APP_NAME \\"
echo "  --resource-group $RESOURCE_GROUP \\"
echo "  --setting-names \\"
echo "    RESEND_API_KEY=\"your-actual-resend-api-key\" \\"
echo "    EMAIL_FROM=\"lindsey@aistudyplans.com\" \\"
echo "    EMAIL_REPLY_TO=\"support@aistudyplans.com\" \\"
echo "    NEXT_PUBLIC_APP_URL=\"https://aistudyplans.com\"" 