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

# Update staticwebapp.config.json to use Next.js API routes
echo -e "\n${YELLOW}Step 2: Updating staticwebapp.config.json...${NC}"

cat > out/staticwebapp.config.json << EOL
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/images/*.{png,jpg,gif,ico}", "/css/*", "/js/*", "/*.{css,js}"]
  },
  "mimeTypes": {
    ".json": "application/json",
    ".js": "application/javascript",
    ".mjs": "application/javascript",
    ".css": "text/css",
    ".html": "text/html",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
  },
  "responseOverrides": {
    "404": {
      "rewrite": "/index.html",
      "statusCode": 200
    }
  },
  "globalHeaders": {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "X-XSS-Protection": "1; mode=block",
    "Content-Security-Policy": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdnjs.cloudflare.com; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https://api.resend.com https://*.supabase.co; frame-src 'self';"
  },
  "routes": [
    {
      "route": "/api/*",
      "allowedRoles": ["anonymous"]
    },
    {
      "route": "/login",
      "allowedRoles": ["anonymous"],
      "rewrite": "/login.html"
    },
    {
      "route": "/logout",
      "allowedRoles": ["anonymous"],
      "rewrite": "/logout.html"
    },
    {
      "route": "/admin/direct-login*",
      "redirect": "/admin/ms-login",
      "statusCode": 301
    },
    {
      "route": "/admin/emergency*",
      "redirect": "/admin/ms-login",
      "statusCode": 301
    },
    {
      "route": "/admin/login*",
      "redirect": "/admin/ms-login",
      "statusCode": 301
    },
    {
      "route": "/static/*",
      "headers": {
        "Cache-Control": "public, max-age=604800, immutable"
      }
    },
    {
      "route": "/*.{js,css,png,jpg,gif,ico,woff,woff2,ttf,svg}",
      "headers": {
        "Cache-Control": "public, max-age=604800, immutable"
      }
    }
  ],
  "platform": {
    "apiRuntime": "node:18"
  }
}
EOL

echo -e "${GREEN}staticwebapp.config.json updated successfully.${NC}"
echo "Content of staticwebapp.config.json:"
cat out/staticwebapp.config.json

# Log in to Azure
echo -e "\n${YELLOW}Step 3: Logging in to Azure...${NC}"
echo "Please log in to your Azure account in the browser window that opens."
az login

if [ $? -ne 0 ]; then
  echo -e "${RED}Azure login failed. Please try again.${NC}"
  exit 1
fi

# Get deployment token
echo -e "\n${YELLOW}Step 4: Getting Azure Static Web App deployment token...${NC}"
DEPLOYMENT_TOKEN=$(az staticwebapp secrets list --name $STATIC_WEB_APP_NAME --resource-group $RESOURCE_GROUP --query "properties.apiKey" -o tsv)

if [ -z "$DEPLOYMENT_TOKEN" ]; then
  echo -e "${RED}Failed to get deployment token. Please check your Azure access permissions.${NC}"
  exit 1
fi

echo -e "${GREEN}Deployment token retrieved successfully.${NC}"

# Deploy to Azure Static Web App
echo -e "\n${YELLOW}Step 5: Deploying to Azure Static Web App...${NC}"
echo "Deploying to $STATIC_WEB_APP_NAME using swa-cli..."

# Install swa-cli if not already installed
if ! command -v swa &> /dev/null; then
  echo "Installing Azure Static Web Apps CLI..."
  npm install -g @azure/static-web-apps-cli
fi

# Deploy using SWA CLI
swa deploy ./out --deployment-token $DEPLOYMENT_TOKEN --env production

if [ $? -ne 0 ]; then
  echo -e "${RED}Deployment failed. Please check the error messages above.${NC}"
  exit 1
fi

echo -e "\n${GREEN}✅ Deployment completed successfully!${NC}"
echo "Your application has been deployed to Azure Static Web App."
echo "You can access it at: https://$STATIC_WEB_APP_NAME.azurewebsites.net"
echo ""
echo "Next steps:"
echo "1. Verify that the application works correctly in production"
echo "2. Test the API endpoints: /api/test-email and /api/waitlist"
echo "3. Monitor logs in the Azure portal for any issues"
echo "" 