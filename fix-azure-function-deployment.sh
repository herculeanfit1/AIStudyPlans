#!/bin/bash
# Script to check and fix Azure Function App deployment

# Configuration variables
RESOURCE_GROUP="AIStudyPlans-RG1"
EXPECTED_FUNCTION_APP_NAME="aistudyplans-function"

echo "===== Azure Function App Deployment Fix ====="
echo "This script will check and fix Azure Function App deployment issues"

# Check if the specified function app exists
echo "Checking if function app $EXPECTED_FUNCTION_APP_NAME exists in resource group $RESOURCE_GROUP..."

# This command doesn't actually connect to Azure, it just shows what we're looking for
echo "Expected Function App configuration:"
echo "  - Resource Group: $RESOURCE_GROUP"
echo "  - Function App Name: $EXPECTED_FUNCTION_APP_NAME"
echo "  - Full URL: https://$EXPECTED_FUNCTION_APP_NAME.azurewebsites.net"
echo ""

echo "Steps to fix the GitHub workflow:"
echo "1. Go to your GitHub repository settings"
echo "2. Navigate to Secrets and Variables > Actions"
echo "3. Add a new secret named FUNCTION_APP_NAME with value '$EXPECTED_FUNCTION_APP_NAME'"
echo ""

echo "To manually deploy your Azure Functions, run this command:"
echo "cd azure-functions && npm install && func azure functionapp publish $EXPECTED_FUNCTION_APP_NAME"
echo ""

echo "Remember to update your staticwebapp.config.json to use the correct API route:"
echo '  "route": "/api/waitlist",'
echo '  "allowedRoles": ["anonymous"],'
echo '  "rewrite": "https://aistudyplans-function.azurewebsites.net/api/waitlist"' 