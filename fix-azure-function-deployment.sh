#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Azure Function App Deployment Fix Script${NC}"
echo "=================================================="

# Default values
RESOURCE_GROUP="AIStudyPlans-RG1"
FUNCTION_APP_NAME="aistudyplans-function"
STORAGE_ACCOUNT="aistudyplansstorage"
LOCATION="eastus2"

# Function to check if Azure CLI is installed
check_azure_cli() {
  if ! command -v az &> /dev/null; then
    echo -e "${RED}Error: Azure CLI is not installed.${NC}"
    echo "Please install it first: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
    exit 1
  fi

  # Check if logged in
  az account show &> /dev/null || {
    echo -e "${YELLOW}You need to login to Azure first.${NC}"
    az login
  }
}

# Function to check if Function App exists
check_function_app() {
  echo -e "\n${YELLOW}Checking if Function App exists...${NC}"
  
  if az functionapp show --name "$FUNCTION_APP_NAME" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${GREEN}Function App '$FUNCTION_APP_NAME' exists.${NC}"
    FUNCTION_APP_EXISTS=true
  else
    echo -e "${RED}Function App '$FUNCTION_APP_NAME' does not exist.${NC}"
    FUNCTION_APP_EXISTS=false
  fi
}

# Function to check if Storage Account exists
check_storage_account() {
  echo -e "\n${YELLOW}Checking if Storage Account exists...${NC}"
  
  if az storage account show --name "$STORAGE_ACCOUNT" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo -e "${GREEN}Storage Account '$STORAGE_ACCOUNT' exists.${NC}"
    STORAGE_ACCOUNT_EXISTS=true
  else
    echo -e "${RED}Storage Account '$STORAGE_ACCOUNT' does not exist.${NC}"
    STORAGE_ACCOUNT_EXISTS=false
  fi
}

# Function to create Storage Account if it doesn't exist
create_storage_account() {
  if [ "$STORAGE_ACCOUNT_EXISTS" = false ]; then
    echo -e "\n${YELLOW}Creating Storage Account '$STORAGE_ACCOUNT'...${NC}"
    
    az storage account create \
      --name "$STORAGE_ACCOUNT" \
      --resource-group "$RESOURCE_GROUP" \
      --location "$LOCATION" \
      --sku Standard_LRS \
      --kind StorageV2 \
      --allow-blob-public-access false
      
    echo -e "${GREEN}Storage Account created successfully.${NC}"
  fi
}

# Function to create Function App if it doesn't exist
create_function_app() {
  if [ "$FUNCTION_APP_EXISTS" = false ]; then
    echo -e "\n${YELLOW}Creating Function App '$FUNCTION_APP_NAME'...${NC}"
    
    # Create App Insights component
    echo "Creating Application Insights..."
    az monitor app-insights component create \
      --app "aistudyplans-insights" \
      --location "$LOCATION" \
      --resource-group "$RESOURCE_GROUP" \
      --application-type web
      
    INSTRUMENTATION_KEY=$(az monitor app-insights component show \
      --app "aistudyplans-insights" \
      --resource-group "$RESOURCE_GROUP" \
      --query instrumentationKey \
      --output tsv)
    
    # Create the Function App
    echo "Creating Function App..."
    az functionapp create \
      --name "$FUNCTION_APP_NAME" \
      --resource-group "$RESOURCE_GROUP" \
      --storage-account "$STORAGE_ACCOUNT" \
      --consumption-plan-location "$LOCATION" \
      --functions-version 4 \
      --runtime node \
      --runtime-version 22 \
      --app-insights "$INSTRUMENTATION_KEY" \
      --disable-app-insights false
      
    echo -e "${GREEN}Function App created successfully.${NC}"
    
    # Add Managed Identity
    echo "Enabling Managed Identity..."
    az functionapp identity assign \
      --name "$FUNCTION_APP_NAME" \
      --resource-group "$RESOURCE_GROUP"
  fi
}

# Function to check Function App runtime stack
check_and_update_runtime() {
  echo -e "\n${YELLOW}Checking Function App runtime...${NC}"
  
  # Get the current runtime version
  CURRENT_RUNTIME=$(az functionapp config show --name "$FUNCTION_APP_NAME" --resource-group "$RESOURCE_GROUP" --query "properties.linuxFxVersion" -o tsv 2>/dev/null || echo "Unknown")
  CURRENT_NODE_VERSION=$(az functionapp config appsettings list --name "$FUNCTION_APP_NAME" --resource-group "$RESOURCE_GROUP" --query "[?name=='WEBSITE_NODE_DEFAULT_VERSION'].value" -o tsv 2>/dev/null || echo "Unknown")
  
  echo "Current runtime: $CURRENT_RUNTIME"
  echo "Current Node.js version: $CURRENT_NODE_VERSION"
  
  # Update to Node.js 22 if not already set
  if [[ "$CURRENT_NODE_VERSION" != "~22" && "$CURRENT_RUNTIME" != *"NODE|22"* ]]; then
    echo -e "${YELLOW}Updating to Node.js 22...${NC}"
    
    # Update the runtime version directly
    az functionapp config appsettings set \
      --name "$FUNCTION_APP_NAME" \
      --resource-group "$RESOURCE_GROUP" \
      --settings "WEBSITE_NODE_DEFAULT_VERSION=~22"
    
    # Also set the function runtime to match
    az functionapp update \
      --name "$FUNCTION_APP_NAME" \
      --resource-group "$RESOURCE_GROUP" \
      --set "siteConfig.linuxFxVersion=NODE|22"
      
    echo -e "${GREEN}Runtime updated to Node.js 22.${NC}"
  else
    echo -e "${GREEN}Runtime is already set to Node.js 22.${NC}"
  fi
}

# Function to set up Key Vault references
setup_keyvault() {
  echo -e "\n${YELLOW}Setting up Key Vault references...${NC}"
  
  # Check if Key Vault exists
  if ! az keyvault show --name "aistudyplansvault" --resource-group "$RESOURCE_GROUP" &> /dev/null; then
    echo "Creating Key Vault..."
    az keyvault create \
      --name "aistudyplansvault" \
      --resource-group "$RESOURCE_GROUP" \
      --location "$LOCATION" \
      --enable-rbac-authorization true
  fi
  
  # Get the Function App's managed identity principal ID
  PRINCIPAL_ID=$(az functionapp identity show \
    --name "$FUNCTION_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query principalId \
    --output tsv)
  
  # Assign RBAC role for Key Vault secrets if not already assigned
  echo "Assigning Key Vault Secrets User role to Function App..."
  if ! az role assignment list --assignee "$PRINCIPAL_ID" --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/aistudyplansvault" --query "[?roleDefinitionName=='Key Vault Secrets User']" -o tsv &> /dev/null; then
    az role assignment create \
      --role "Key Vault Secrets User" \
      --assignee-object-id "$PRINCIPAL_ID" \
      --assignee-principal-type ServicePrincipal \
      --scope "/subscriptions/$(az account show --query id -o tsv)/resourceGroups/$RESOURCE_GROUP/providers/Microsoft.KeyVault/vaults/aistudyplansvault"
    echo -e "${GREEN}Role assignment created successfully.${NC}"
  else
    echo -e "${GREEN}Role assignment already exists.${NC}"
  fi
  
  # Check if RESEND_API_KEY is already set correctly in Function App settings
  echo -e "\n${YELLOW}Checking RESEND_API_KEY configuration...${NC}"
  RESEND_API_KEY_SETTING=$(az functionapp config appsettings list \
    --name "$FUNCTION_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "[?name=='RESEND_API_KEY'].value" -o tsv)
  
  if [[ "$RESEND_API_KEY_SETTING" == *"KeyVault"* || "$RESEND_API_KEY_SETTING" == *"@Microsoft"* ]]; then
    echo -e "${GREEN}RESEND_API_KEY is already configured with Key Vault reference.${NC}"
    echo "Current setting: $RESEND_API_KEY_SETTING"
  else
    echo -e "${YELLOW}RESEND_API_KEY is not configured with Key Vault reference.${NC}"
    
    # Ask if the user wants to provide an API key
    echo "Would you like to set the Resend API Key? (y/n)"
    read -r SET_API_KEY
    
    if [[ "$SET_API_KEY" == "y" ]]; then
      read -sp "Enter your Resend API Key (input will be hidden): " RESEND_API_KEY
      echo ""
      
      if [ -n "$RESEND_API_KEY" ]; then
        # Set the API key in Key Vault
        echo "Setting Resend API Key in Key Vault..."
        az keyvault secret set \
          --vault-name "aistudyplansvault" \
          --name "RESEND-API-KEY" \
          --value "$RESEND_API_KEY"
        
        # Configure the Function App to use Key Vault reference
        echo "Configuring Function App to use Key Vault reference..."
        az functionapp config appsettings set \
          --name "$FUNCTION_APP_NAME" \
          --resource-group "$RESOURCE_GROUP" \
          --settings "RESEND_API_KEY=@Microsoft.KeyVault(SecretUri=https://aistudyplansvault.vault.azure.net/secrets/RESEND-API-KEY/)"
      fi
    else
      echo "Skipping Resend API Key configuration."
    fi
  fi
  
  # Ensure proper storage configuration for Function App
  echo -e "\n${YELLOW}Ensuring proper storage configuration...${NC}"
  az functionapp config appsettings set \
    --name "$FUNCTION_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --settings "WEBSITE_CONTENTAZUREFILECONNECTIONSTRING=DefaultEndpointsProtocol=https;AccountName=$STORAGE_ACCOUNT;AccountKey=$(az storage account keys list --account-name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --query '[0].value' -o tsv);EndpointSuffix=core.windows.net"
}

# Function to check if function app is ready to be deployed to
verify_function_app() {
  echo -e "\n${YELLOW}Verifying Function App configuration...${NC}"
  
  # Check if all necessary settings are configured
  echo "Checking application settings..."
  SETTINGS=$(az functionapp config appsettings list \
    --name "$FUNCTION_APP_NAME" \
    --resource-group "$RESOURCE_GROUP" \
    --query "[].name" -o tsv)
  
  # Required settings
  REQUIRED_SETTINGS=("FUNCTIONS_WORKER_RUNTIME" "FUNCTIONS_EXTENSION_VERSION" "AzureWebJobsStorage")
  MISSING_SETTINGS=()
  
  for setting in "${REQUIRED_SETTINGS[@]}"; do
    if ! echo "$SETTINGS" | grep -q "$setting"; then
      MISSING_SETTINGS+=("$setting")
    fi
  done
  
  if [ ${#MISSING_SETTINGS[@]} -eq 0 ]; then
    echo -e "${GREEN}All required application settings are configured.${NC}"
  else
    echo -e "${YELLOW}Missing required application settings:${NC}"
    for missing in "${MISSING_SETTINGS[@]}"; do
      echo " - $missing"
    done
    
    # Set missing settings with default values
    echo "Setting up missing configuration..."
    
    SETTINGS_ARGS=""
    if echo "$MISSING_SETTINGS" | grep -q "FUNCTIONS_WORKER_RUNTIME"; then
      SETTINGS_ARGS="$SETTINGS_ARGS \"FUNCTIONS_WORKER_RUNTIME=node\""
    fi
    
    if echo "$MISSING_SETTINGS" | grep -q "FUNCTIONS_EXTENSION_VERSION"; then
      SETTINGS_ARGS="$SETTINGS_ARGS \"FUNCTIONS_EXTENSION_VERSION=~4\""
    fi
    
    if echo "$MISSING_SETTINGS" | grep -q "AzureWebJobsStorage"; then
      SETTINGS_ARGS="$SETTINGS_ARGS \"AzureWebJobsStorage=DefaultEndpointsProtocol=https;AccountName=$STORAGE_ACCOUNT;AccountKey=$(az storage account keys list --account-name $STORAGE_ACCOUNT --resource-group $RESOURCE_GROUP --query '[0].value' -o tsv);EndpointSuffix=core.windows.net\""
    fi
    
    if [ -n "$SETTINGS_ARGS" ]; then
      # Use eval to correctly handle the constructed arguments
      eval az functionapp config appsettings set \
        --name "$FUNCTION_APP_NAME" \
        --resource-group "$RESOURCE_GROUP" \
        --settings $SETTINGS_ARGS
    fi
  fi
  
  echo -e "\n${GREEN}Function App verification complete.${NC}"
}

# Function to display deployment info
show_deployment_info() {
  echo -e "\n${YELLOW}Function App Deployment Information${NC}"
  echo "============================================="
  echo -e "Resource Group: ${GREEN}$RESOURCE_GROUP${NC}"
  echo -e "Function App Name: ${GREEN}$FUNCTION_APP_NAME${NC}"
  echo -e "Storage Account: ${GREEN}$STORAGE_ACCOUNT${NC}"
  echo -e "Location: ${GREEN}$LOCATION${NC}"
  echo -e "Function App URL: ${GREEN}https://$FUNCTION_APP_NAME.azurewebsites.net${NC}"
  
  # Display deployment commands
  echo -e "\n${YELLOW}To deploy the Function App, run:${NC}"
  echo -e "${GREEN}cd azure-functions${NC}"
  echo -e "${GREEN}func azure functionapp publish $FUNCTION_APP_NAME --force${NC}"
  
  echo -e "\n${YELLOW}Note:${NC} The --force flag is recommended to ensure proper deployment."
  echo "If you encounter any issues, check the func CLI version with: func --version"
}

# Main execution
check_azure_cli
check_function_app
check_storage_account
create_storage_account
create_function_app
check_and_update_runtime
setup_keyvault
verify_function_app
show_deployment_info

echo -e "\n${GREEN}Azure Function App deployment fix script completed!${NC}" 