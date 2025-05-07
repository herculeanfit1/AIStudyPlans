#!/bin/bash
# Script to directly check the Resend API Key format

# Variables
RESOURCE_GROUP="AIStudyPlans-RG1"
FUNCTION_APP_NAME="aistudyplans-function"

echo "=== Detailed Function App Settings Check ==="

# Get the raw settings without filtering
SETTINGS=$(az functionapp config appsettings list --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP -o json)

# Echo the Resend API Key setting directly
echo "Checking RESEND_API_KEY setting format:"
echo "$SETTINGS" | jq '.[] | select(.name=="RESEND_API_KEY")'

# Check the format directly
RESEND_KEY_VALUE=$(echo "$SETTINGS" | jq -r '.[] | select(.name=="RESEND_API_KEY") | .value')

if [ "$RESEND_KEY_VALUE" == "null" ]; then
  echo ""
  echo "The key value is masked (shows as null), which is expected for sensitive data."
  echo "This doesn't mean it's not set - Azure CLI just doesn't display the actual value."
  echo ""
  echo "To verify it's working properly, try deploying and running a test email function."
elif [[ "$RESEND_KEY_VALUE" == *"KeyVault"* || "$RESEND_KEY_VALUE" == *"@Microsoft"* ]]; then
  echo ""
  echo "✅ Confirmed: RESEND_API_KEY is using Key Vault reference format."
else
  echo ""
  echo "⚠️ RESEND_API_KEY appears to be set directly rather than as a Key Vault reference."
  
  # Set it correctly
  echo ""
  echo "Updating to use Key Vault reference..."
  az functionapp config appsettings set --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP \
    --settings "RESEND_API_KEY=@Microsoft.KeyVault(SecretUri=https://aistudyplansvault.vault.azure.net/secrets/RESEND-API-KEY/)"
  echo "Done."
fi 