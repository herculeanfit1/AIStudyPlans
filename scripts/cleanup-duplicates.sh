#!/bin/bash

# Cleanup script for removing duplicate configuration files
# This script removes redundant configuration files after consolidation

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting cleanup of duplicate configuration files...${NC}"

# Function to safely remove a file with confirmation
remove_file() {
  local file=$1
  if [ -f "$file" ]; then
    echo -e "${YELLOW}Removing duplicate file: ${file}${NC}"
    rm "$file"
    if [ $? -eq 0 ]; then
      echo -e "${GREEN}✓ Successfully removed: ${file}${NC}"
    else
      echo -e "${RED}✗ Failed to remove: ${file}${NC}"
    fi
  else
    echo -e "${YELLOW}File not found: ${file}${NC}"
  fi
}

# Remove duplicate Next.js config files
# We keep next.config.mjs and remove others
echo -e "\n${YELLOW}Removing duplicate Next.js config files...${NC}"
remove_file "next.config.js"
remove_file "next.config.ts"

# Remove duplicate PostCSS config files
# We keep postcss.config.mjs and remove others
echo -e "\n${YELLOW}Removing duplicate PostCSS config files...${NC}"
remove_file "postcss.config.js"

# Remove duplicate Tailwind config files
# We keep tailwind.config.ts and remove others
echo -e "\n${YELLOW}Removing duplicate Tailwind config files...${NC}"
remove_file "tailwind.config.js"

# Remove duplicate email testing scripts
# We've consolidated them into scripts/email-test.js
echo -e "\n${YELLOW}Removing duplicate email testing scripts...${NC}"
remove_file "test-email-local.js"
remove_file "test-email-simple.js"
remove_file "test-email-specific.js"
remove_file "test-resend.js"

echo -e "\n${GREEN}Cleanup completed successfully!${NC}"
echo -e "${YELLOW}The following files have been consolidated:${NC}"
echo -e "  - Next.js config: next.config.mjs"
echo -e "  - PostCSS config: postcss.config.mjs"
echo -e "  - Tailwind config: tailwind.config.ts"
echo -e "  - Email testing: scripts/email-test.js"
echo -e "\n${YELLOW}Make sure to update any scripts or documentation that reference the removed files.${NC}" 