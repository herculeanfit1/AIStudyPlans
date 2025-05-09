#!/bin/bash
# Script to create .env.production with proper Key Vault references

# Set variables
TEMPLATE_FILE="environments/production/env-production-template.txt"
OUTPUT_FILE=".env.production"
KEYVAULT_NAME="aistudyplansvault"

echo "=== Creating .env.production with Key Vault References ==="

# Check if template exists
if [ ! -f "$TEMPLATE_FILE" ]; then
  echo "❌ Error: Template file not found: $TEMPLATE_FILE"
  exit 1
fi

# Create output file from template
cp "$TEMPLATE_FILE" "$OUTPUT_FILE"

echo "✅ Created .env.production with Key Vault references"
echo "This file should now pass GitHub secret scanning checks."
echo ""
echo "Make sure your Application Service has managed identity configured"
echo "and proper permissions to access the Key Vault secrets."
echo ""
echo "To verify your Key Vault setup, run:"
echo "  az keyvault secret list --vault-name $KEYVAULT_NAME --query '[].name'"
echo ""
echo "⚠️ IMPORTANT: Do not commit the .env.production file to the repository."
echo "              It is already in .gitignore, but please double-check." 