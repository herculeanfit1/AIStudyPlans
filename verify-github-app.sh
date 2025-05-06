#!/bin/bash
# Script to verify GitHub App authentication outside of GitHub Actions

echo "===== GitHub App Authentication Verification ====="
echo "This script will help verify if a GitHub App is correctly configured"
echo ""

# Prompt for GitHub App ID
read -p "Enter GitHub App ID (e.g., 1243050): " APP_ID

# Prompt for private key file path
read -p "Enter path to the GitHub App private key file: " PRIVATE_KEY_PATH

if [ ! -f "$PRIVATE_KEY_PATH" ]; then
  echo "❌ Error: Private key file not found at $PRIVATE_KEY_PATH"
  exit 1
fi

# Check format of private key
if ! grep -q "BEGIN" "$PRIVATE_KEY_PATH" || ! grep -q "END" "$PRIVATE_KEY_PATH"; then
  echo "⚠️ Warning: Private key file does not appear to be in proper PEM format"
  echo "   It should contain BEGIN and END markers"
fi

echo ""
echo "Testing GitHub App authentication..."

# Generate JWT token for GitHub App authentication
# This requires the "jwt" command-line tool or similar
# For demonstration purposes, I'm showing a simplified approach
echo "To properly test GitHub App authentication, we would need to:"
echo "1. Generate a JWT token using the App ID and private key"
echo "2. Use this JWT to request an installation token"
echo "3. Use the installation token to access the repository"
echo ""
echo "In GitHub Actions, this is handled by actions/create-github-app-token"
echo ""
echo "For manual testing:"
echo "1. Verify the App ID is correct: $APP_ID"
echo "2. Ensure the private key is in proper PEM format"
echo "3. Check that the app is installed on the target repository"
echo "4. Confirm it has 'Contents: Read and write' permission"
echo ""
echo "The most common issues are:"
echo "- Private key format issues (BEGIN/END lines missing, newlines not preserved)"
echo "- Repository name case sensitivity (GitHub repositories are case-sensitive)"
echo "- App not actually installed on the target repository"
echo "- Token scope limitations"
echo ""
echo "Suggestion: Consider regenerating the private key and updating the GitHub secret"
echo "to rule out any issues with the current key format." 