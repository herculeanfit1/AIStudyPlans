#!/bin/bash

# Test script for GitHub App authentication
# This script will test parts of the GitHub App authentication process

echo "===== GitHub App Authentication Test ====="
echo "The App ID showing in the screenshot is: 1243050"
echo "Testing repository access..."

# Check if repository exists
echo "Testing access to AIStudyPlans-Backups repository..."
git ls-remote https://github.com/herculeanfit1/AIStudyPlans-Backups.git > /dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "✅ Repository exists and is accessible"
else
  echo "❌ Cannot access repository - check repository name or visibility settings"
  exit 1
fi

echo ""
echo "===== Next Steps ====="
echo "1. Verify the App ID is correctly set as 1243050 in GitHub Secrets"
echo "2. Check that the private key is properly formatted (includes BEGIN/END lines)"
echo "3. Confirm the app is installed on the AIStudyPlans-Backups repository"
echo "4. Make sure the app has 'Contents: Read and write' permission"
echo ""
echo "Once confirmed, try running the backup workflow again"
