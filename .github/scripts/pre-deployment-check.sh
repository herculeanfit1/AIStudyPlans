#!/bin/bash

# Pre-deployment validation script
# Runs comprehensive checks before deploying to Azure
# Usage: ./pre-deployment-check.sh [environment]
#   environment: 'production' or 'staging' (default: staging)

set -e

# Set text colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# Check arguments
ENVIRONMENT=${1:-staging}
if [[ "$ENVIRONMENT" != "production" && "$ENVIRONMENT" != "staging" ]]; then
  echo -e "${RED}${BOLD}Error: Invalid environment.${NC}"
  echo -e "Usage: ./pre-deployment-check.sh [environment]"
  echo -e "  environment: 'production' or 'staging' (default: staging)"
  exit 1
fi

echo -e "\n${BLUE}${BOLD}=== Pre-deployment Validation for ${ENVIRONMENT^^} ===${NC}\n"

# Check if all files are committed
echo -e "${BLUE}Checking for uncommitted changes...${NC}"
if [[ -n $(git status --porcelain) ]]; then
  echo -e "${YELLOW}Warning: You have uncommitted changes in your repository.${NC}"
  git status --short
  echo ""
  echo -e "${YELLOW}Recommendation: Commit or stash your changes before deploying.${NC}"
else
  echo -e "${GREEN}✓ Repository is clean. All changes are committed.${NC}"
fi

# Check if we're on the correct branch
echo -e "\n${BLUE}Checking current branch...${NC}"
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
EXPECTED_BRANCH="main"

if [[ "$CURRENT_BRANCH" == "$EXPECTED_BRANCH" ]]; then
  echo -e "${GREEN}✓ On the correct branch: ${EXPECTED_BRANCH}${NC}"
else
  echo -e "${RED}✗ Not on the expected branch! Current: ${CURRENT_BRANCH}, Expected: ${EXPECTED_BRANCH}${NC}"
  echo -e "${YELLOW}Recommendation: Switch to the ${EXPECTED_BRANCH} branch before deploying.${NC}"
fi

# Check if branch is up to date
echo -e "\n${BLUE}Checking if branch is up to date with origin...${NC}"
git fetch origin
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse "origin/$CURRENT_BRANCH")

if [[ "$LOCAL" == "$REMOTE" ]]; then
  echo -e "${GREEN}✓ Branch is up to date with origin/${CURRENT_BRANCH}${NC}"
else
  echo -e "${YELLOW}Warning: Your branch is not up to date with origin/${CURRENT_BRANCH}${NC}"
  echo -e "${YELLOW}Local : ${LOCAL}${NC}"
  echo -e "${YELLOW}Remote: ${REMOTE}${NC}"
  echo -e "${YELLOW}Recommendation: Pull latest changes before deploying.${NC}"
fi

# Check dependency integrity
echo -e "\n${BLUE}Checking dependency integrity...${NC}"
if node scripts/validate-dependencies.js > /dev/null; then
  echo -e "${GREEN}✓ Dependencies are valid${NC}"
else
  echo -e "${RED}✗ Dependency validation failed${NC}"
  node scripts/validate-dependencies.js
  if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${RED}Error: Cannot deploy to production with invalid dependencies.${NC}"
    exit 1
  else
    echo -e "${YELLOW}Warning: Proceeding with invalid dependencies to staging.${NC}"
  fi
fi

# Run linting and type checking
echo -e "\n${BLUE}Running linting and type checking...${NC}"
if npm run lint > /dev/null 2>&1 && npm run type-check > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Linting and type checking passed${NC}"
else
  echo -e "${YELLOW}Warning: Linting or type checking issues found.${NC}"
  echo -e "${YELLOW}Running detailed checks...${NC}"
  npm run lint || true
  npm run type-check || true
  
  if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${RED}Error: Cannot deploy to production with linting or type issues.${NC}"
    exit 1
  else
    echo -e "${YELLOW}Warning: Proceeding with linting/type issues to staging.${NC}"
  fi
fi

# Run tests
echo -e "\n${BLUE}Running tests...${NC}"
if npm test > /dev/null 2>&1; then
  echo -e "${GREEN}✓ All tests passed${NC}"
else
  echo -e "${RED}✗ Some tests failed${NC}"
  npm test || true
  
  if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${RED}Error: Cannot deploy to production with failing tests.${NC}"
    exit 1
  else
    echo -e "${YELLOW}Warning: Proceeding with failing tests to staging.${NC}"
  fi
fi

# Check for security vulnerabilities
echo -e "\n${BLUE}Checking for security vulnerabilities...${NC}"
if npm audit --omit=dev --audit-level=high > /dev/null 2>&1; then
  echo -e "${GREEN}✓ No high or critical security vulnerabilities found${NC}"
else
  echo -e "${YELLOW}Warning: Security vulnerabilities found${NC}"
  npm audit --omit=dev --audit-level=high || true
  
  if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${YELLOW}Warning: Deploying to production with security vulnerabilities.${NC}"
    echo -e "${YELLOW}Review the vulnerabilities and proceed with caution.${NC}"
  fi
fi

# Build check
echo -e "\n${BLUE}Checking build integrity...${NC}"
if chmod +x ci-build.sh && ./ci-build.sh > /dev/null 2>&1; then
  echo -e "${GREEN}✓ Build successful${NC}"
  
  if [[ ! -d "out" || ! -f "out/index.html" || ! -f "out/staticwebapp.config.json" ]]; then
    echo -e "${RED}✗ Build output is missing critical files${NC}"
    ls -la out/ || true
    if [[ "$ENVIRONMENT" == "production" ]]; then
      echo -e "${RED}Error: Cannot deploy to production with invalid build output.${NC}"
      exit 1
    fi
  else
    echo -e "${GREEN}✓ Build output validated${NC}"
  fi
else
  echo -e "${RED}✗ Build failed${NC}"
  chmod +x ci-build.sh && ./ci-build.sh || true
  
  if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${RED}Error: Cannot deploy to production with failing build.${NC}"
    exit 1
  else
    echo -e "${YELLOW}Warning: Proceeding with failing build to staging.${NC}"
  fi
fi

# Azure configuration check
echo -e "\n${BLUE}Checking Azure configuration...${NC}"
if [[ -f "staticwebapp.config.json" ]]; then
  echo -e "${GREEN}✓ staticwebapp.config.json exists${NC}"
else
  echo -e "${RED}✗ staticwebapp.config.json not found${NC}"
  if [[ "$ENVIRONMENT" == "production" ]]; then
    echo -e "${RED}Error: Cannot deploy to production without staticwebapp.config.json.${NC}"
    exit 1
  fi
fi

if [[ -d "azure-functions" ]]; then
  echo -e "${GREEN}✓ Azure Functions directory exists${NC}"
else
  echo -e "${YELLOW}Warning: Azure Functions directory not found${NC}"
  echo -e "${YELLOW}This may be normal if your app doesn't use Azure Functions.${NC}"
fi

# Check Application Insights configuration
echo -e "\n${BLUE}Checking monitoring configuration...${NC}"
INS_CHECK=$(grep "APPLICATIONINSIGHTS_CONNECTION_STRING" .env.production 2>/dev/null || grep "APPLICATIONINSIGHTS_CONNECTION_STRING" .env 2>/dev/null || echo "")
if [[ -n "$INS_CHECK" ]]; then
  echo -e "${GREEN}✓ Application Insights connection string found${NC}"
else
  echo -e "${YELLOW}Warning: Application Insights connection string not found in environment files${NC}"
  echo -e "${YELLOW}Monitoring may not work correctly after deployment.${NC}"
fi

# Summary
echo -e "\n${BLUE}${BOLD}=== Deployment Readiness Summary for ${ENVIRONMENT^^} ===${NC}"
if [[ "$ENVIRONMENT" == "production" ]]; then
  echo -e "${GREEN}✓ All critical checks passed!${NC}"
  echo -e "${GREEN}✓ Ready to deploy to PRODUCTION${NC}"
else
  echo -e "${GREEN}✓ Basic validation complete for STAGING${NC}"
  echo -e "${YELLOW}⚠ Review any warnings before deploying to production${NC}"
fi

echo -e "\nTo deploy, run:"
if [[ "$ENVIRONMENT" == "production" ]]; then
  echo -e "${BOLD}git push origin main${NC}"
else
  echo -e "${BOLD}git push origin $CURRENT_BRANCH${NC}"
fi

exit 0 