#!/bin/bash
# Script to set up RBAC permissions for Azure Static Web App to access Key Vault
# This is for Key Vaults with RBAC authorization enabled

# Your specific values
STATIC_WEB_APP_NAME="aistudyplanslanding"
KEY_VAULT_NAME="aistudyplansvault" 
RESOURCE_GROUP="AIStudyPlans-RG1"

echo "Setting up RBAC permissions for $STATIC_WEB_APP_NAME to access Key Vault $KEY_VAULT_NAME..."

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

# Step 3: Get Key Vault resource ID
echo "Getting Key Vault resource ID..."
KEY_VAULT_ID=$(az keyvault show \
  --name $KEY_VAULT_NAME \
  --resource-group "$RESOURCE_GROUP" \
  --query id \
  --output tsv)

echo "Key Vault ID: $KEY_VAULT_ID"

# Step 4: Assign "Key Vault Secrets User" role to the managed identity
echo "Assigning 'Key Vault Secrets User' role..."
az role assignment create \
  --assignee "$PRINCIPAL_ID" \
  --role "Key Vault Secrets User" \
  --scope "$KEY_VAULT_ID"

echo "✅ RBAC permissions setup complete!"
echo ""
echo "Now update your environment variable in Azure Portal to use this format:"
echo "RESEND_API_KEY=@Microsoft.KeyVault(VaultName=$KEY_VAULT_NAME;SecretName=resend-api-key)"
echo ""
echo "If that format doesn't work, try:"
echo "RESEND_API_KEY=@Microsoft.KeyVault(SecretUri=https://$KEY_VAULT_NAME.vault.azure.net/secrets/resend-api-key/)"
echo ""
echo "Note: Make sure the secret name (resend-api-key) matches exactly what's in your Key Vault, including case sensitivity." 