#!/bin/bash
# Script to set up managed identity for Azure Static Web App to access Key Vault

# Your specific values
STATIC_WEB_APP_NAME="aistudyplanslanding"
KEY_VAULT_NAME="aistudyplansvault" 
RESOURCE_GROUP="BridgingTrust.AI"  # Based on your screenshot showing "Bridging Trust AI"

echo "Setting up managed identity for $STATIC_WEB_APP_NAME to access Key Vault $KEY_VAULT_NAME..."

# Step 1: Enable system-assigned managed identity for your Static Web App
echo "Enabling system-assigned managed identity..."
az staticwebapp identity assign \
  --name $STATIC_WEB_APP_NAME \
  --resource-group "$RESOURCE_GROUP" \
  --identities [system]

# Step 2: Get the principal ID (object ID) of the managed identity
echo "Getting managed identity principal ID..."
PRINCIPAL_ID=$(az staticwebapp identity show \
  --name $STATIC_WEB_APP_NAME \
  --resource-group "$RESOURCE_GROUP" \
  --query principalId \
  --output tsv)

echo "Static Web App managed identity principal ID: $PRINCIPAL_ID"

# Step 3: Grant the managed identity access to Key Vault secrets
echo "Granting Key Vault access permissions..."
az keyvault set-policy \
  --name $KEY_VAULT_NAME \
  --resource-group "$RESOURCE_GROUP" \
  --object-id $PRINCIPAL_ID \
  --secret-permissions get list

echo "✅ Managed identity setup complete!"
echo ""
echo "Now update your environment variable in Azure Portal to use this format:"
echo "RESEND_API_KEY=@Microsoft.KeyVault(VaultName=$KEY_VAULT_NAME;SecretName=resend-api-key)"
echo ""
echo "If that format doesn't work, try:"
echo "RESEND_API_KEY=@Microsoft.KeyVault(SecretUri=https://$KEY_VAULT_NAME.vault.azure.net/secrets/resend-api-key/)"
echo ""
echo "Note: Make sure the secret name (resend-api-key) matches exactly what's in your Key Vault, including case sensitivity." 