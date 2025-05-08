#!/bin/bash
set -e

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Running Admin Dashboard Tests${NC}"
echo "========================================"

# Run unit tests for admin components
echo -e "${GREEN}Running unit tests for admin components...${NC}"
npx jest __tests__/admin --verbose

# Run end-to-end tests for admin functionality
echo -e "${GREEN}Running end-to-end tests for admin functionality...${NC}"
npx playwright test e2e/admin-dashboard.spec.ts

echo -e "${GREEN}Admin tests completed successfully!${NC}" 