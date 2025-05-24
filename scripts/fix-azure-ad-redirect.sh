#!/bin/bash

# Script to help fix Azure AD redirect URI configuration for NextAuth
# This script provides instructions to fix the OAuth signin error

echo "🔧 Azure AD Redirect URI Fix for NextAuth"
echo "========================================"
echo ""

echo "📋 Current Issue:"
echo "   You're getting an 'OAuthSignin' error because the redirect URI"
echo "   in your Azure AD app registration doesn't match what NextAuth expects."
echo ""

echo "✅ Required Redirect URI for NextAuth:"
echo "   https://aistudyplans.com/api/auth/callback/azure-ad"
echo ""

echo "🛠️ How to Fix:"
echo "1. Go to Azure Portal: https://portal.azure.com"
echo "2. Navigate to: Microsoft Entra ID > App registrations"
echo "3. Find your app registration (look for the one with your client ID)"
echo "4. Click on 'Authentication' in the left menu"
echo "5. Under 'Web' redirect URIs, make sure you have:"
echo "   ✓ https://aistudyplans.com/api/auth/callback/azure-ad"
echo "6. Remove any other production redirect URIs that don't match this format"
echo "7. Click 'Save'"
echo ""

echo "📝 Additional Configuration Checks:"
echo "   ✓ Platform type: Web (not SPA)"
echo "   ✓ ID tokens should be enabled"
echo "   ✓ Access tokens should be enabled"
echo "   ✓ Account type: Accounts in this organizational directory only (Single tenant)"
echo ""

echo "🔍 To verify your current Azure AD app configuration:"
echo "   Run: az ad app list --filter \"displayName eq 'YourAppName'\" --query '[].{appId:appId,displayName:displayName,web:web}'"
echo ""

echo "🧪 After making changes:"
echo "1. Wait 5-10 minutes for changes to propagate"
echo "2. Try accessing: https://aistudyplans.com/admin"
echo "3. You should be redirected to Microsoft sign-in without errors"
echo ""

echo "📧 If you're still having issues, check that your admin email is in the allowed list:"
echo "   - btaiadmin@bridgingtrustai.onmicrosoft.com"
echo "   - terence@bridgingtrust.ai"
echo ""

# Optional: Check if Azure CLI is available and provide more specific help
if command -v az &> /dev/null; then
    echo "🔧 Azure CLI is available. Checking your app registrations..."
    echo ""
    
    # List app registrations (user will need to identify theirs)
    echo "Your current app registrations:"
    az ad app list --query '[].{appId:appId,displayName:displayName}' --output table 2>/dev/null || echo "   (Run 'az login' first to see your app registrations)"
    echo ""
    
    echo "💡 To get detailed info about a specific app, run:"
    echo "   az ad app show --id YOUR_CLIENT_ID --query '{appId:appId,displayName:displayName,web:web}'"
else
    echo "💡 Install Azure CLI for automated checks: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli"
fi

echo ""
echo "✨ Once fixed, your authentication should work perfectly!" 