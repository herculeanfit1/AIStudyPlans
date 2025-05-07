#!/bin/bash
# fix-dependencies.sh
# A script to fix dependency issues

set -e

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Creating backup of package.json...${NC}"
cp package.json package.json.backup
cp package-lock.json package-lock.json.backup
echo -e "${GREEN}Backup created!${NC}"

echo -e "${YELLOW}Fixing dependency issues...${NC}"

# First handle auth dependencies properly
echo -e "${YELLOW}Fixing authentication dependencies...${NC}"
npm uninstall next-auth @auth/core
npm install @auth/core@0.34.2
npm install next-auth@4.24.11

# Install other dependencies
echo -e "${YELLOW}Updating other dependencies...${NC}"
npm install next@14.2.28
npm install sharp@0.34.1

# Install performance-related packages
echo -e "${YELLOW}Updating performance-related packages...${NC}"
npm install three@0.158.0
npm install chart.js@4.4.9
npm install react-chartjs-2@5.3.0

# Install development tools
echo -e "${YELLOW}Updating development tools...${NC}"
npm install -D @playwright/test@1.42.1

# Install validation library if not present
if ! grep -q "zod" package.json; then
  echo -e "${YELLOW}Installing Zod for input validation...${NC}"
  npm install zod@3.22.4
fi

echo -e "${GREEN}All dependency issues fixed!${NC}"
echo "Please run 'npm run security:deps' to verify the security of the dependencies."
echo "Then run 'npm run lint && npm run typecheck && npm run test' to verify everything works."

exit 0 