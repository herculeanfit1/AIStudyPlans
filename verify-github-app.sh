#!/bin/bash
#
# GitHub App Verification Script
# This script validates that a GitHub App is correctly configured for repository access
#

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}GitHub App Verification Script${NC}"
echo "================================"
echo "This script verifies GitHub App installation and permissions"
echo ""

# Function to check prerequisites
check_prerequisites() {
  # Check if curl is installed
  if ! command -v curl &> /dev/null; then
    echo -e "${RED}Error: curl is not installed. Please install it and try again.${NC}"
    exit 1
  fi
  
  # Check if jq is installed (for JSON parsing)
  if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Warning: jq is not installed. This script works best with jq.${NC}"
    echo "Install with: apt-get install jq or brew install jq"
    USE_JQ=false
  else
    USE_JQ=true
  fi
}

# Function to prompt for GitHub App credentials
get_app_credentials() {
  echo -e "${YELLOW}GitHub App Credentials${NC}"
  echo "======================="
  
  # Prompt for GitHub App ID
  read -p "Enter GitHub App ID: " APP_ID
  
  # Prompt for private key file
  read -p "Enter path to private key file (.pem): " PRIVATE_KEY_FILE
  if [ ! -f "$PRIVATE_KEY_FILE" ]; then
    echo -e "${RED}Error: Private key file not found at $PRIVATE_KEY_FILE${NC}"
    exit 1
  fi
  
  # Optional: Prompt for installation ID (if known)
  read -p "Enter installation ID (leave blank to auto-detect): " INSTALLATION_ID
}

# Function to generate JWT token for GitHub App
generate_jwt() {
  echo -e "\n${YELLOW}Generating JWT for GitHub App authentication...${NC}"
  
  # Generate header
  HEADER=$(echo -n '{"alg":"RS256","typ":"JWT"}' | base64 | tr -d '=' | tr '/+' '_-')
  
  # Generate payload with current timestamp
  NOW=$(date +%s)
  EXPIRY=$((NOW + 600)) # 10 minutes
  PAYLOAD=$(echo -n "{\"iat\":$NOW,\"exp\":$EXPIRY,\"iss\":$APP_ID}" | base64 | tr -d '=' | tr '/+' '_-')
  
  # Sign with private key
  SIGNATURE=$(echo -n "$HEADER.$PAYLOAD" | openssl dgst -sha256 -sign "$PRIVATE_KEY_FILE" | base64 | tr -d '=' | tr '/+' '_-')
  
  # Create JWT
  JWT="$HEADER.$PAYLOAD.$SIGNATURE"
  
  echo -e "${GREEN}JWT token generated successfully${NC}"
}

# Function to verify GitHub App details
verify_app() {
  echo -e "\n${YELLOW}Verifying GitHub App...${NC}"
  
  APP_RESPONSE=$(curl -s -H "Authorization: Bearer $JWT" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/app")
  
  if $USE_JQ; then
    APP_NAME=$(echo "$APP_RESPONSE" | jq -r '.name // "Unknown"')
    OWNER=$(echo "$APP_RESPONSE" | jq -r '.owner.login // "Unknown"')
  else
    APP_NAME=$(echo "$APP_RESPONSE" | grep -o '"name":"[^"]*' | cut -d'"' -f4)
    OWNER=$(echo "$APP_RESPONSE" | grep -o '"login":"[^"]*' | head -1 | cut -d'"' -f4)
  fi
  
  if [ "$APP_NAME" != "Unknown" ] && [ -n "$APP_NAME" ]; then
    echo -e "${GREEN}Successfully authenticated with GitHub App: $APP_NAME${NC}"
    echo "App Owner: $OWNER"
  else
    echo -e "${RED}Failed to authenticate with GitHub App${NC}"
    echo "Response: $APP_RESPONSE"
    exit 1
  fi
}

# Function to get app installations
get_installations() {
  echo -e "\n${YELLOW}Getting GitHub App installations...${NC}"
  
  INSTALLATIONS_RESPONSE=$(curl -s -H "Authorization: Bearer $JWT" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/app/installations")
  
  if $USE_JQ; then
    INSTALLATION_COUNT=$(echo "$INSTALLATIONS_RESPONSE" | jq '. | length')
    echo -e "Found ${GREEN}$INSTALLATION_COUNT${NC} installation(s)"
    
    if [ -z "$INSTALLATION_ID" ]; then
      # If no installation ID was provided, use the first one
      INSTALLATION_ID=$(echo "$INSTALLATIONS_RESPONSE" | jq -r '.[0].id')
      echo "Using installation ID: $INSTALLATION_ID"
    fi
    
    # Display installation details
    echo "Installations:"
    echo "$INSTALLATIONS_RESPONSE" | jq -r '.[] | "- ID: \(.id), Account: \(.account.login), Target Type: \(.target_type), Repository Selection: \(.repository_selection)"'
  else
    echo "Installations (first 3):"
    echo "$INSTALLATIONS_RESPONSE" | grep -o '"id":[0-9]*' | head -3 | while read -r line; do
      ID=$(echo "$line" | cut -d':' -f2)
      echo "- ID: $ID"
    done
    
    if [ -z "$INSTALLATION_ID" ]; then
      # If no installation ID was provided, use the first one
      INSTALLATION_ID=$(echo "$INSTALLATIONS_RESPONSE" | grep -o '"id":[0-9]*' | head -1 | cut -d':' -f2)
      echo "Using installation ID: $INSTALLATION_ID"
    fi
  fi
  
  if [ -z "$INSTALLATION_ID" ]; then
    echo -e "${RED}Error: No installations found for this GitHub App${NC}"
    exit 1
  fi
}

# Function to get installation token
get_installation_token() {
  echo -e "\n${YELLOW}Getting installation token...${NC}"
  
  TOKEN_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $JWT" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/app/installations/$INSTALLATION_ID/access_tokens")
  
  if $USE_JQ; then
    INSTALLATION_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.token // "error"')
  else
    INSTALLATION_TOKEN=$(echo "$TOKEN_RESPONSE" | grep -o '"token":"[^"]*' | head -1 | cut -d'"' -f4)
  fi
  
  if [ "$INSTALLATION_TOKEN" = "error" ] || [ -z "$INSTALLATION_TOKEN" ]; then
    echo -e "${RED}Failed to get installation token${NC}"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
  else
    echo -e "${GREEN}Successfully generated installation token${NC}"
  fi
}

# Function to verify repository access
verify_repository_access() {
  echo -e "\n${YELLOW}Verifying repository access...${NC}"
  
  TARGET_REPO="herculeanfit1/AIStudyPlans-Backups"
  
  REPOS_RESPONSE=$(curl -s \
    -H "Authorization: token $INSTALLATION_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/installation/repositories")
  
  if $USE_JQ; then
    REPO_COUNT=$(echo "$REPOS_RESPONSE" | jq '.repositories | length')
    echo "Installation has access to $REPO_COUNT repositories"
    
    # Check if target repo is in the list
    TARGET_REPO_EXISTS=$(echo "$REPOS_RESPONSE" | jq --arg repo "$TARGET_REPO" '.repositories[] | select(.full_name == $repo) | .full_name' | wc -l)
    
    if [ "$TARGET_REPO_EXISTS" -gt 0 ]; then
      echo -e "${GREEN}✓ GitHub App has access to target repository: $TARGET_REPO${NC}"
    else
      echo -e "${RED}✗ GitHub App does NOT have access to target repository: $TARGET_REPO${NC}"
      echo "List of accessible repositories:"
      echo "$REPOS_RESPONSE" | jq -r '.repositories[] | "  - \(.full_name)"'
    fi
  else
    echo "Checking repository access..."
    if echo "$REPOS_RESPONSE" | grep -q "$TARGET_REPO"; then
      echo -e "${GREEN}✓ GitHub App has access to target repository: $TARGET_REPO${NC}"
    else
      echo -e "${RED}✗ GitHub App does NOT have access to target repository: $TARGET_REPO${NC}"
      echo "First 5 accessible repositories:"
      echo "$REPOS_RESPONSE" | grep -o '"full_name":"[^"]*' | head -5 | cut -d'"' -f4 | while read -r repo; do
        echo "  - $repo"
      done
    fi
  fi
}

# Function to check app permissions
check_permissions() {
  echo -e "\n${YELLOW}Checking GitHub App permissions...${NC}"
  
  PERMISSIONS_RESPONSE=$(curl -s -H "Authorization: Bearer $JWT" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/app/installations/$INSTALLATION_ID")
  
  if $USE_JQ; then
    PERMISSIONS=$(echo "$PERMISSIONS_RESPONSE" | jq '.permissions')
    CONTENTS_PERMISSION=$(echo "$PERMISSIONS" | jq -r '.contents // "none"')
    
    echo "Permission details:"
    echo "$PERMISSIONS" | jq -r 'to_entries[] | "  - \(.key): \(.value)"'
    
    if [ "$CONTENTS_PERMISSION" = "write" ] || [ "$CONTENTS_PERMISSION" = "admin" ]; then
      echo -e "${GREEN}✓ GitHub App has write permissions to repository contents${NC}"
    else
      echo -e "${RED}✗ GitHub App does NOT have write permissions to repository contents${NC}"
      echo "Current contents permission: $CONTENTS_PERMISSION"
      echo "Please update the GitHub App permissions to include 'Contents: Read & write'"
    fi
  else
    echo "Permission summary:"
    echo "$PERMISSIONS_RESPONSE" | grep -o '"permissions":{[^}]*}' | sed 's/[{}]//g' | tr ',' '\n' | while read -r perm; do
      echo "  - $perm"
    done
    
    if echo "$PERMISSIONS_RESPONSE" | grep -q '"contents":"write"'; then
      echo -e "${GREEN}✓ GitHub App has write permissions to repository contents${NC}"
    else
      echo -e "${RED}✗ GitHub App does NOT have write permissions to repository contents${NC}"
      echo "Please update the GitHub App permissions to include 'Contents: Read & write'"
    fi
  fi
}

# Function to display secrets recommendations
show_secrets_recommendations() {
  echo -e "\n${YELLOW}GitHub Secrets Configuration${NC}"
  echo "==========================="
  echo "Add the following secrets to your GitHub repository:"
  echo ""
  echo "1. GH_APP_ID"
  echo "   Value: $APP_ID"
  echo ""
  echo "2. GH_APP_PRIVATE_KEY"
  echo "   Value: (contents of $PRIVATE_KEY_FILE)"
  echo ""
  echo "3. GH_APP_INSTALLATION_ID"
  echo "   Value: $INSTALLATION_ID"
  echo ""
  echo "To add these secrets:"
  echo "1. Go to your GitHub repository"
  echo "2. Click on 'Settings' tab"
  echo "3. In the left sidebar, click 'Secrets and variables' → 'Actions'"
  echo "4. Click 'New repository secret' for each secret above"
}

# Main execution
check_prerequisites
get_app_credentials
generate_jwt
verify_app
get_installations
get_installation_token
verify_repository_access
check_permissions
show_secrets_recommendations

echo -e "\n${GREEN}GitHub App verification completed!${NC}" 