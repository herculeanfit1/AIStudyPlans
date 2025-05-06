#!/bin/bash
# deploy-azure-functions.sh
# Script for deploying the Azure Functions app with Key Vault integration for email relay
# This script creates/updates all necessary Azure resources for the email relay

set -e # Exit on any error

# Configuration variables
RESOURCE_GROUP="aistudyplans-rg"
LOCATION="eastus"
STORAGE_ACCOUNT_NAME="aistudyplansstorage"
KEYVAULT_NAME="aistudyplans-kv"
FUNCTION_APP_NAME="aistudyplans-function"
APP_SERVICE_PLAN="aistudyplans-asp"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting deployment of Azure Functions with Key Vault integration...${NC}"

# Function to check if a resource exists
resource_exists() {
    az $1 show --name $2 --resource-group $RESOURCE_GROUP &> /dev/null
    return $?
}

# Create Resource Group if it doesn't exist
if ! az group show --name $RESOURCE_GROUP &> /dev/null; then
    echo -e "${YELLOW}Creating Resource Group: $RESOURCE_GROUP...${NC}"
    az group create --name $RESOURCE_GROUP --location $LOCATION
else
    echo -e "${GREEN}Resource Group $RESOURCE_GROUP already exists.${NC}"
fi

# Create Storage Account if it doesn't exist
if ! resource_exists "storage account" $STORAGE_ACCOUNT_NAME; then
    echo -e "${YELLOW}Creating Storage Account: $STORAGE_ACCOUNT_NAME...${NC}"
    az storage account create \
        --name $STORAGE_ACCOUNT_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku Standard_LRS
else
    echo -e "${GREEN}Storage Account $STORAGE_ACCOUNT_NAME already exists.${NC}"
fi

# Create Key Vault if it doesn't exist
if ! resource_exists "keyvault" $KEYVAULT_NAME; then
    echo -e "${YELLOW}Creating Key Vault: $KEYVAULT_NAME...${NC}"
    az keyvault create \
        --name $KEYVAULT_NAME \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION
else
    echo -e "${GREEN}Key Vault $KEYVAULT_NAME already exists.${NC}"
fi

# Create App Service Plan if it doesn't exist
if ! resource_exists "appservice plan" $APP_SERVICE_PLAN; then
    echo -e "${YELLOW}Creating App Service Plan: $APP_SERVICE_PLAN...${NC}"
    az appservice plan create \
        --name $APP_SERVICE_PLAN \
        --resource-group $RESOURCE_GROUP \
        --location $LOCATION \
        --sku B1
else
    echo -e "${GREEN}App Service Plan $APP_SERVICE_PLAN already exists.${NC}"
fi

# Create Function App if it doesn't exist
if ! resource_exists "functionapp" $FUNCTION_APP_NAME; then
    echo -e "${YELLOW}Creating Function App: $FUNCTION_APP_NAME...${NC}"
    az functionapp create \
        --name $FUNCTION_APP_NAME \
        --resource-group $RESOURCE_GROUP \
        --storage-account $STORAGE_ACCOUNT_NAME \
        --plan $APP_SERVICE_PLAN \
        --runtime node \
        --runtime-version 18 \
        --functions-version 4
else
    echo -e "${GREEN}Function App $FUNCTION_APP_NAME already exists.${NC}"
fi

# Enable managed identity for the Function App
echo -e "${YELLOW}Enabling system-assigned managed identity for Function App...${NC}"
az functionapp identity assign \
    --name $FUNCTION_APP_NAME \
    --resource-group $RESOURCE_GROUP

# Get the principal ID of the Function App's managed identity
PRINCIPAL_ID=$(az functionapp identity show --name $FUNCTION_APP_NAME --resource-group $RESOURCE_GROUP --query principalId --output tsv)

# Set Key Vault Access Policy for the Function App
echo -e "${YELLOW}Setting Key Vault access policy for Function App...${NC}"
az keyvault set-policy \
    --name $KEYVAULT_NAME \
    --resource-group $RESOURCE_GROUP \
    --object-id $PRINCIPAL_ID \
    --secret-permissions get list

# Update Function App settings
echo -e "${YELLOW}Configuring Function App settings...${NC}"
az functionapp config appsettings set \
    --name $FUNCTION_APP_NAME \
    --resource-group $RESOURCE_GROUP \
    --settings \
    KEY_VAULT_NAME=$KEYVAULT_NAME \
    EMAIL_FROM="Lindsey <lindsey@aistudyplans.com>" \
    EMAIL_REPLY_TO="support@aistudyplans.com" \
    ADMIN_EMAIL="waitlist@aistudyplans.com" \
    NEXT_PUBLIC_APP_URL="https://aistudyplans.com"

# Deploy the function app code
echo -e "${YELLOW}Deploying Function App code...${NC}"
pushd azure-functions
npm install
func azure functionapp publish $FUNCTION_APP_NAME
popd

echo -e "${GREEN}Deployment completed successfully!${NC}"
echo -e "${YELLOW}Important Note:${NC}"
echo -e "1. Make sure to add your Resend API key to Key Vault as 'resend-api-key'"
echo -e "2. You can do this with the following command:"
echo -e "   az keyvault secret set --vault-name $KEYVAULT_NAME --name resend-api-key --value YOUR_RESEND_API_KEY"
echo -e "3. Update the CORS settings in host.json if needed"
echo -e "4. Make sure to update the app to use the Azure Function endpoint: https://$FUNCTION_APP_NAME.azurewebsites.net/api/waitlist" 