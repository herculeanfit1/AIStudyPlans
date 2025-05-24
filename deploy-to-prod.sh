#!/bin/bash
# Script to deploy AIStudyPlans to Azure Static Web App
# with updated configuration for Next.js API routes instead of Azure Functions

# Set variables
STATIC_WEB_APP_NAME="aistudyplanslanding"
RESOURCE_GROUP="AIStudyPlans-RG1"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}====== AIStudyPlans Production Deployment ======${NC}"
echo "This script will build and deploy the application to Azure Static Web App."
echo ""

# Build the application
echo -e "${YELLOW}Step 1: Building Next.js application...${NC}"
npm run build

if [ $? -ne 0 ]; then
  echo -e "${RED}Build failed. Please fix the errors and try again.${NC}"
  exit 1
fi

echo -e "${GREEN}Build completed successfully.${NC}"

# Update the staticwebapp.config.json file
echo -e "${YELLOW}Step 2: Updating staticwebapp.config.json...${NC}"
cp swa-deploy/staticwebapp.config.json out/staticwebapp.config.json

# Show the content of staticwebapp.config.json
echo "staticwebapp.config.json updated successfully."
echo "Content of staticwebapp.config.json:"
cat out/staticwebapp.config.json

# Log in to Azure
echo -e "\n${YELLOW}Step 3: Logging in to Azure...${NC}"
echo "Please log in to your Azure account in the browser window that opens."
az login

# Get the deployment token
echo -e "\n${YELLOW}Step 4: Getting Azure Static Web App deployment token...${NC}"
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --query "properties.apiKey" -o tsv)

if [ -z "$DEPLOYMENT_TOKEN" ]; then
  echo -e "${RED}Failed to retrieve deployment token. Please check your Azure credentials and try again.${NC}"
  exit 1
fi

echo "Deployment token retrieved successfully."

# Deploy using the SWA CLI
echo -e "\n${YELLOW}Step 5: Deploying to Azure Static Web App...${NC}"
echo "Deploying to $STATIC_WEB_APP_NAME using swa-cli..."

# Ensure environment variables are set in Azure
echo -e "${YELLOW}Setting environment variables in Azure...${NC}"
# Read from .env.production and set in Azure
if [ -f ".env.production" ]; then
  while IFS='=' read -r key value || [[ -n "$key" ]]; do
    # Skip comments and empty lines
    if [[ $key == \#* ]] || [[ -z "$key" ]]; then
      continue
    fi
    
    # Remove leading/trailing whitespace
    key=$(echo "$key" | xargs)
    value=$(echo "$value" | xargs)
    
    if [[ -n "$key" && -n "$value" ]]; then
      echo "Setting environment variable: $key"
      az staticwebapp appsettings set --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --setting-names "$key=$value"
    fi
  done < .env.production
  
  echo "Environment variables configured in Azure."
else
  echo -e "${RED}Warning: .env.production file not found. Environment variables will not be updated.${NC}"
fi

# Deploy the app
npx @azure/static-web-apps-cli deploy --env production --deployment-token "$DEPLOYMENT_TOKEN" --app-location "./out" --api-location "api"

if [ $? -ne 0 ]; then
  echo -e "${RED}Deployment failed. Please check the logs and try again.${NC}"
  exit 1
fi

echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"
echo "Your application has been deployed to Azure Static Web App."
echo "You can access it at: https://aistudyplanslanding.azurewebsites.net"
echo ""
echo "Next steps:"
echo "1. Verify that the application works correctly in production"
echo "2. Test the API endpoints: /api/test-email and /api/waitlist"
echo "3. Monitor logs in the Azure portal for any issues"
echo "" 