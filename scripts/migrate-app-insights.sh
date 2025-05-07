#!/bin/bash

# Application Insights Migration Shell Script
# This script helps migrate from one Application Insights resource to another
# by updating the necessary configuration files.

# Set text colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Check if required parameters are provided
if [ $# -lt 2 ]; then
  echo -e "${RED}${BOLD}Error: Missing connection strings${NC}"
  echo "Usage: $0 OLD_CONNECTION_STRING NEW_CONNECTION_STRING"
  exit 1
fi

OLD_CONNECTION_STRING="$1"
NEW_CONNECTION_STRING="$2"

echo -e "\n${BLUE}${BOLD}=== Application Insights Migration Tool ===${NC}\n"
echo -e "${YELLOW}This script will update all references to the Application Insights connection string.${NC}"
echo -e "${YELLOW}From: ${OLD_CONNECTION_STRING:0:20}...${NC}"
echo -e "${YELLOW}To:   ${NEW_CONNECTION_STRING:0:20}...${NC}\n"

# Files to update
FILES_TO_UPDATE=(".env" ".env.local" ".env.development" ".env.production" "next.config.js")

# Create backup directory
BACKUP_DIR="backup-app-insights"
mkdir -p "$BACKUP_DIR"

# Backup all files before modifying them
echo -e "${BLUE}Backing up files...${NC}"
for file in "${FILES_TO_UPDATE[@]}"; do
  if [ -f "$file" ]; then
    cp "$file" "$BACKUP_DIR/"
    echo -e "${GREEN}✓ Backed up $file${NC}"
  fi
done

# Update the connection string in all files
echo -e "\n${BLUE}Updating connection strings...${NC}"
UPDATED_FILES=0

for file in "${FILES_TO_UPDATE[@]}"; do
  if [ -f "$file" ]; then
    # Check if file contains the old connection string
    if grep -q "$OLD_CONNECTION_STRING" "$file"; then
      # Replace all occurrences
      sed -i.bak "s|$OLD_CONNECTION_STRING|$NEW_CONNECTION_STRING|g" "$file"
      rm -f "$file.bak" # Remove backup created by sed
      echo -e "${GREEN}✓ Updated $file${NC}"
      UPDATED_FILES=$((UPDATED_FILES + 1))
    fi
  fi
done

# Display summary
if [ $UPDATED_FILES -gt 0 ]; then
  echo -e "\n${GREEN}${BOLD}✓ Successfully updated $UPDATED_FILES files${NC}"
  echo -e "\n${YELLOW}Next steps:${NC}"
  echo "1. Restart your development server (npm run dev)"
  echo "2. Update your deployment workflows with the new connection string"
  echo "3. Check your application to ensure monitoring is working properly"
else
  echo -e "\n${YELLOW}No files were updated. The old connection string was not found in any of the target files.${NC}"
fi

# Update Azure Static Web Apps workflow file if it exists
if [ -f ".github/workflows/azure-static-web-apps.yml" ]; then
  echo -e "\n${BLUE}Checking GitHub workflow files...${NC}"
  if grep -q "APPLICATIONINSIGHTS_CONNECTION_STRING" ".github/workflows/azure-static-web-apps.yml"; then
    echo -e "${YELLOW}You may need to update the Application Insights connection string in your GitHub workflow.${NC}"
    echo -e "${YELLOW}Check .github/workflows/azure-static-web-apps.yml${NC}"
  fi
fi

echo -e "\n${BLUE}${BOLD}Migration process completed.${NC}" 