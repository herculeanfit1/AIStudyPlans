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

# Check if the required environment variables are set
if [ -z "$GH_APP_ID" ] || [ -z "$GH_APP_PRIVATE_KEY" ] || [ -z "$GH_APP_INSTALLATION_ID" ]; then
    echo "Error: Required environment variables are not set."
    echo "Please ensure the following are defined:"
    echo "  - GH_APP_ID"
    echo "  - GH_APP_PRIVATE_KEY (path to private key file)"
    echo "  - GH_APP_INSTALLATION_ID"
    exit 1
fi

echo "Step 1: Generating JWT for GitHub App authentication..."
# Generate JWT token for GitHub App
now=$(date +%s)
iat=$now
exp=$((now + 600)) # 10 minutes expiration

# Create JWT header
header=$(echo -n '{"alg":"RS256","typ":"JWT"}' | base64 | tr -d '=' | tr '/+' '_-')

# Create JWT payload
payload=$(echo -n '{"iat":'"$iat"',"exp":'"$exp"',"iss":'"$GH_APP_ID"'}' | base64 | tr -d '=' | tr '/+' '_-')

# Sign with private key
if [ -f "$GH_APP_PRIVATE_KEY" ]; then
    signature=$(echo -n "$header.$payload" | openssl dgst -sha256 -sign "$GH_APP_PRIVATE_KEY" | base64 | tr -d '=' | tr '/+' '_-')
    jwt="$header.$payload.$signature"
    echo "✅ JWT token generated successfully"
else
    echo "❌ Error: Private key file not found at $GH_APP_PRIVATE_KEY"
    exit 1
fi

echo "Step 2: Getting installation token..."
# Get installation token using JWT
response=$(curl -s -X POST \
    -H "Authorization: Bearer $jwt" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/app/installations/$GH_APP_INSTALLATION_ID/access_tokens")

# Extract token from response
if echo "$response" | grep -q "token"; then
    installation_token=$(echo "$response" | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo "✅ Installation token obtained successfully"
else
    echo "❌ Error getting installation token:"
    echo "$response"
    exit 1
fi

echo "Step 3: Checking accessible repositories..."
# List repositories accessible to the app
repo_response=$(curl -s \
    -H "Authorization: token $installation_token" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/installation/repositories")

# Check if we got a list of repositories
if echo "$repo_response" | grep -q "repositories"; then
    echo "✅ App has access to the following repositories:"
    echo "$repo_response" | grep -o '"full_name":"[^"]*' | cut -d'"' -f4
else
    echo "❌ Error listing repositories or no repositories found:"
    echo "$repo_response"
fi

echo "Step 4: Checking AIStudyPlans-Backups repository..."
# Check if the target repository exists and is accessible
target_repo="herculeanfit1/AIStudyPlans-Backups"
repo_check=$(curl -s \
    -H "Authorization: token $installation_token" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/repos/$target_repo")

# Check if the repository exists and is accessible
if echo "$repo_check" | grep -q "id"; then
    echo "✅ Repository $target_repo exists and is accessible"
else
    echo "❌ Repository not found or not accessible: $target_repo"
    echo "$repo_check"
fi

echo "Step 5: Checking installation permissions..."
# Get the app's permissions
perm_response=$(curl -s \
    -H "Authorization: Bearer $jwt" \
    -H "Accept: application/vnd.github.v3+json" \
    "https://api.github.com/app/installations/$GH_APP_INSTALLATION_ID")

echo "Installation permissions:"
echo "$perm_response" | grep -o '"permissions":{[^}]*}' | tr ',' '\n' | tr -d '{'

echo -e "\nDebug complete. If issues persist, verify:"
echo "1. The repository exists at github.com/$target_repo"
echo "2. The GitHub App is installed on the target repository"
echo "3. The GitHub App has appropriate permissions (contents: write)"
echo "4. The installation ID is correct"
echo "5. The private key is valid and correctly formatted"

echo ""
echo "===== Debugging Summary ====="
echo "1. Check if your app has the correct permissions (needs 'Contents: Read & write')"
echo "2. Make sure the app is installed specifically on the AIStudyPlans-Backups repository"
echo "3. If it's a private repository, ensure the app has access to it"
echo "4. The private key in GitHub Secrets must match the one downloaded from GitHub"
echo "5. For repository-specific installations, ensure 'Only select repositories' includes AIStudyPlans-Backups"
echo ""
echo "For more troubleshooting, visit: https://docs.github.com/en/apps/using-github-apps/understanding-installation-scopes-for-github-apps" 