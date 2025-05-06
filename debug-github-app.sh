#!/bin/bash
# GitHub App Debugging Script
# This script helps diagnose GitHub App installation and permission issues

set -e  # Exit on any failure

echo "===== GitHub App Debug Tool ====="
echo "This script will help diagnose issues with GitHub Apps"
echo ""

# Check for required tools
for cmd in jq curl; do
  if ! command -v $cmd &> /dev/null; then
    echo "❌ Required tool not found: $cmd"
    echo "Please install it before continuing."
    if [ "$cmd" = "jq" ]; then
      echo "Install with: brew install jq  # on macOS"
    fi
    exit 1
  fi
done

# Read GitHub App credentials
read -p "Enter GitHub App ID (e.g., 1243050): " APP_ID

# Ask for private key file
read -p "Enter path to GitHub App private key file: " PRIVATE_KEY_FILE
if [ ! -f "$PRIVATE_KEY_FILE" ]; then
  echo "❌ Private key file not found: $PRIVATE_KEY_FILE"
  exit 1
fi

# Verify private key format
if ! grep -q "BEGIN RSA PRIVATE KEY" "$PRIVATE_KEY_FILE" || ! grep -q "END RSA PRIVATE KEY" "$PRIVATE_KEY_FILE"; then
  echo "⚠️ Private key file doesn't appear to be in the correct format."
  echo "It should contain 'BEGIN RSA PRIVATE KEY' and 'END RSA PRIVATE KEY' markers."
  read -p "Continue anyway? (y/n): " continue_anyway
  if [ "$continue_anyway" != "y" ]; then
    exit 1
  fi
fi

# Function to generate a JWT token for GitHub App authentication
generate_jwt() {
  # This is simplified JWT generation - in real scenarios use a proper JWT library
  echo "Generating JWT for GitHub App authentication..."
  
  # Use Node.js to generate the token
  node -e "
    const fs = require('fs');
    const crypto = require('crypto');
    
    // Read private key
    const privateKey = fs.readFileSync('$PRIVATE_KEY_FILE', 'utf8');
    
    // Create JWT header
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };
    
    // Create JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iat: now - 60,                // issued 60 seconds ago
      exp: now + 10 * 60,           // expires in 10 minutes
      iss: '$APP_ID'                // GitHub App ID
    };
    
    // Encode header and payload
    const encodedHeader = Buffer.from(JSON.stringify(header)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    // Create signature
    const signatureBase = encodedHeader + '.' + encodedPayload;
    const signer = crypto.createSign('RSA-SHA256');
    signer.update(signatureBase);
    const signature = signer.sign(privateKey, 'base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    
    // Create JWT
    const jwt = signatureBase + '.' + signature;
    console.log(jwt);
  "
}

# Generate JWT token
JWT=$(generate_jwt)
echo "✅ JWT generated successfully"

# Check GitHub App metadata
echo ""
echo "Checking GitHub App details..."
APP_INFO=$(curl -s -H "Authorization: Bearer $JWT" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/app)

# Extract app name and owner from response
APP_NAME=$(echo "$APP_INFO" | jq -r '.name // "Unknown"')
APP_OWNER=$(echo "$APP_INFO" | jq -r '.owner.login // "Unknown"')
APP_HTML_URL=$(echo "$APP_INFO" | jq -r '.html_url // "Unknown"')

if [ "$APP_NAME" != "Unknown" ]; then
  echo "✅ GitHub App authenticated successfully!"
  echo "App Name: $APP_NAME"
  echo "App Owner: $APP_OWNER"
  echo "App URL: $APP_HTML_URL"
else
  echo "❌ Failed to authenticate with GitHub App"
  echo "Response: $APP_INFO"
  exit 1
fi

# List installations
echo ""
echo "Checking App installations..."
INSTALLATIONS=$(curl -s -H "Authorization: Bearer $JWT" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/app/installations)

INSTALLATION_COUNT=$(echo "$INSTALLATIONS" | jq length)
echo "App is installed in $INSTALLATION_COUNT location(s)"

# Get installation details
echo ""
echo "Installation details:"
echo "$INSTALLATIONS" | jq -r '.[] | "ID: \(.id), Account: \(.account.login), Target Type: \(.target_type), Repository Selection: \(.repository_selection)"'

# For each installation, get an access token and check repositories
echo ""
echo "Checking repositories for each installation..."
echo "$INSTALLATIONS" | jq -r '.[] | .id' | while read -r INSTALLATION_ID; do
  ACCOUNT=$(echo "$INSTALLATIONS" | jq -r ".[] | select(.id == $INSTALLATION_ID) | .account.login")
  echo ""
  echo "Installation ID $INSTALLATION_ID (Account: $ACCOUNT)"
  
  # Get an installation token
  TOKEN_RESPONSE=$(curl -s -X POST \
    -H "Authorization: Bearer $JWT" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/app/installations/$INSTALLATION_ID/access_tokens)
  
  INSTALLATION_TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.token // "error"')
  
  if [ "$INSTALLATION_TOKEN" = "error" ]; then
    echo "❌ Failed to get installation token"
    echo "Response: $TOKEN_RESPONSE"
    continue
  fi
  
  echo "✅ Generated installation token"
  
  # List accessible repositories
  REPOS=$(curl -s \
    -H "Authorization: token $INSTALLATION_TOKEN" \
    -H "Accept: application/vnd.github.v3+json" \
    https://api.github.com/installation/repositories)
  
  REPO_COUNT=$(echo "$REPOS" | jq '.repositories | length')
  echo "This installation can access $REPO_COUNT repositories:"
  echo "$REPOS" | jq -r '.repositories[] | "- \(.full_name) (\(.private ? "private" : "public"))"'
  
  # Specifically check for the AIStudyPlans-Backups repository
  if echo "$REPOS" | jq -r '.repositories[].full_name' | grep -q "AIStudyPlans-Backups"; then
    echo "✅ Installation has access to the AIStudyPlans-Backups repository!"
    
    # Test a Git operation with the token
    echo ""
    echo "Testing Git operations with the installation token..."
    TEMP_DIR=$(mktemp -d)
    pushd "$TEMP_DIR" > /dev/null
    
    # Try to access the repository
    GIT_RESULT=$(GIT_TRACE=1 git ls-remote https://x-access-token:$INSTALLATION_TOKEN@github.com/herculeanfit1/AIStudyPlans-Backups.git 2>&1) || true
    
    if echo "$GIT_RESULT" | grep -q "ERROR\|fatal\|not found\|denied"; then
      echo "❌ Git operation failed:"
      echo "$GIT_RESULT"
    else
      echo "✅ Git operation succeeded"
    fi
    
    popd > /dev/null
    rm -rf "$TEMP_DIR"
  else
    echo "❌ Installation does NOT have access to the AIStudyPlans-Backups repository!"
    echo "Please make sure the app is installed on that repository."
  fi
done

echo ""
echo "===== Debugging Summary ====="
echo "1. Check if your app has the correct permissions (needs 'Contents: Read & write')"
echo "2. Make sure the app is installed specifically on the AIStudyPlans-Backups repository"
echo "3. If it's a private repository, ensure the app has access to it"
echo "4. The private key in GitHub Secrets must match the one downloaded from GitHub"
echo "5. For repository-specific installations, ensure 'Only select repositories' includes AIStudyPlans-Backups"
echo ""
echo "For more troubleshooting, visit: https://docs.github.com/en/apps/using-github-apps/understanding-installation-scopes-for-github-apps" 