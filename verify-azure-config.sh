#!/bin/bash
# Verification script for Azure resources configuration
set -e

# Set variables - make sure these match what was used in creation
RESOURCE_GROUP="AIStudyPlans-RG1"
STORAGE_ACCOUNT="aistudyplansstorage"
FUNCTION_APP_NAME="aistudyplans-function"
KEYVAULT_NAME="aistudyplansvault"
APPINSIGHTS_NAME="aistudyplans-insights"

echo "===== Azure Configuration Verification ====="
echo "Checking all resources for proper configuration..."
echo ""

# Check if resource group exists
echo "Checking Resource Group: $RESOURCE_GROUP"
if az group show --name $RESOURCE_GROUP >/dev/null 2>&1; then
  echo "✅ Resource Group exists"
  LOCATION=$(az group show --name $RESOURCE_GROUP --query location -o tsv)
  echo "   Location: $LOCATION"
else
  echo "❌ Resource Group not found!"
  exit 1
fi

echo ""
# Check Storage Account
echo "Checking Storage Account: $STORAGE_ACCOUNT"
if az storage account show --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP >/dev/null 2>&1; then
  echo "✅ Storage Account exists"
  
  # Check settings
  HTTPS_ONLY=$(az storage account show --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --query enableHttpsTrafficOnly -o tsv)
  TLS_VERSION=$(az storage account show --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --query minimumTlsVersion -o tsv)
  NETWORK_ACCESS=$(az storage account show --name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --query networkRuleSet.defaultAction -o tsv)
  
  echo "   HTTPS Only: $HTTPS_ONLY"
  echo "   TLS Version: $TLS_VERSION"
  echo "   Network Access: $NETWORK_ACCESS"
  
  if [[ "$HTTPS_ONLY" == "true" && "$TLS_VERSION" == "TLS1_2" && "$NETWORK_ACCESS" == "Allow" ]]; then
    echo "   ✅ Storage Account configured correctly"
  else
    echo "   ⚠️ Storage Account settings may not be optimal"
    [[ "$HTTPS_ONLY" != "true" ]] && echo "      - HTTPS Only should be true"
    [[ "$TLS_VERSION" != "TLS1_2" ]] && echo "      - TLS Version should be TLS1_2"
    [[ "$NETWORK_ACCESS" != "Allow" ]] && echo "      - Network Access should be Allow for Consumption plan"
  fi
else
  echo "❌ Storage Account not found!"
  exit 1
fi

echo ""
# Check Function App
echo "Checking Function App: $FUNCTION_APP_NAME"
if az functionapp show --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP >/dev/null 2>&1; then
  echo "✅ Function App exists"
  
  # Check settings
  RUNTIME=$(az functionapp show --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP --query siteConfig.linuxFxVersion -o tsv)
  RUNTIME_VERSION=$(echo $RUNTIME | cut -d'|' -f2)
  STATUS=$(az functionapp show --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP --query state -o tsv)
  
  echo "   Runtime: $RUNTIME"
  echo "   Status: $STATUS"
  
  # Check Managed Identity
  IDENTITY_TYPE=$(az functionapp identity show --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP --query type -o tsv 2>/dev/null || echo "None")
  
  if [[ "$IDENTITY_TYPE" == "SystemAssigned" || "$IDENTITY_TYPE" == "SystemAssigned, UserAssigned" ]]; then
    echo "   ✅ Managed Identity enabled"
    PRINCIPAL_ID=$(az functionapp identity show --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP --query principalId -o tsv)
    echo "   Principal ID: $PRINCIPAL_ID"
  else
    echo "   ❌ Managed Identity not enabled"
  fi
  
  # Check App Settings
  echo "   Checking App Settings..."
  APP_SETTINGS=$(az functionapp config appsettings list --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP -o json)
  
  if echo "$APP_SETTINGS" | grep -q "APPLICATIONINSIGHTS_CONNECTION_STRING"; then
    echo "   ✅ Application Insights connection found"
  else
    echo "   ❌ Application Insights connection not configured"
  fi
  
  # Check for Resend API Key (or reference to Key Vault)
  if echo "$APP_SETTINGS" | grep -q "RESEND_API_KEY"; then
    echo "   ✅ Resend API Key configured"
    
    # Check if it's a Key Vault reference
    if echo "$APP_SETTINGS" | grep -q "RESEND_API_KEY.*KeyVault"; then
      echo "   ✅ Resend API Key references Key Vault"
    else
      echo "   ⚠️ Resend API Key may be stored directly (not using Key Vault)"
    fi
  else
    echo "   ⚠️ Resend API Key not found"
  fi
else
  echo "❌ Function App not found!"
  exit 1
fi

echo ""
# Check Key Vault
echo "Checking Key Vault: $KEYVAULT_NAME"
if az keyvault show --name $KEYVAULT_NAME --resource-group $RESOURCE_GROUP >/dev/null 2>&1; then
  echo "✅ Key Vault exists"
  
  # Check if Function App has access
  if [[ -n "$PRINCIPAL_ID" ]]; then
    ROLE_ASSIGNMENTS=$(az role assignment list --assignee "$PRINCIPAL_ID" --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/$KEYVAULT_NAME" -o json)
    
    if echo "$ROLE_ASSIGNMENTS" | grep -q "Key Vault Secrets User"; then
      echo "   ✅ Function App has proper Key Vault role assignment"
    else
      echo "   ❌ Function App missing 'Key Vault Secrets User' role"
    fi
  fi
  
  # Check for required secrets
  if az keyvault secret show --vault-name $KEYVAULT_NAME --name "RESEND-API-KEY" >/dev/null 2>&1; then
    echo "   ✅ RESEND-API-KEY secret found in Key Vault"
  else
    echo "   ⚠️ RESEND-API-KEY secret not found in Key Vault"
  fi
else
  echo "❌ Key Vault not found!"
  exit 1
fi

echo ""
# Check Application Insights
echo "Checking Application Insights: $APPINSIGHTS_NAME"
if az monitor app-insights component show --app $APPINSIGHTS_NAME --resource-group $RESOURCE_GROUP >/dev/null 2>&1; then
  echo "✅ Application Insights exists"
  
  # Get instrumentation key
  INSTRUMENTATION_KEY=$(az monitor app-insights component show --app $APPINSIGHTS_NAME --resource-group $RESOURCE_GROUP --query instrumentationKey -o tsv)
  echo "   Instrumentation Key: ${INSTRUMENTATION_KEY:0:8}..." # Show only beginning for security
else
  echo "❌ Application Insights not found!"
  exit 1
fi

echo ""
echo "===== Verification Complete ====="
echo "Resource Group: $RESOURCE_GROUP"
echo "Location: $LOCATION"
echo "Storage Account: $STORAGE_ACCOUNT"
echo "Function App: $FUNCTION_APP_NAME"
echo "Key Vault: $KEYVAULT_NAME"
echo "Application Insights: $APPINSIGHTS_NAME" 