#!/bin/bash
# update-dependencies.sh
# A script to help update dependencies in a controlled manner

set -e

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Main directory
BASEDIR=$(pwd)

# Function to display help
show_help() {
  echo -e "${YELLOW}Dependency Update Script${NC}"
  echo ""
  echo "Usage: ./scripts/update-dependencies.sh [options]"
  echo ""
  echo "Options:"
  echo "  --security     Update security-related packages (Next.js, auth, sharp)"
  echo "  --performance  Update performance-related packages (Three.js, Chart.js)"
  echo "  --dev-tools    Update development tools (Playwright, Jest, TypeScript)"
  echo "  --all          Update all packages"
  echo "  --dry-run      Show what would be updated without making changes"
  echo "  --help         Display this help message"
  echo ""
  echo "Example: ./scripts/update-dependencies.sh --security --dry-run"
}

# Function to run tests
run_tests() {
  echo -e "${YELLOW}Running tests...${NC}"
  npm run typecheck
  npm run lint
  npm run test
  echo -e "${GREEN}Tests completed successfully!${NC}"
}

# Function to create backup of package.json
create_backup() {
  echo -e "${YELLOW}Creating backup of package.json...${NC}"
  cp package.json package.json.backup
  cp package-lock.json package-lock.json.backup
  echo -e "${GREEN}Backup created!${NC}"
}

# Function to restore backup
restore_backup() {
  echo -e "${YELLOW}Restoring backup of package.json...${NC}"
  mv package.json.backup package.json
  mv package-lock.json.backup package-lock.json
  echo -e "${GREEN}Backup restored!${NC}"
}

# Function to update auth packages correctly
update_auth_packages() {
  echo -e "${YELLOW}Updating authentication packages...${NC}"
  npm uninstall next-auth @auth/core
  npm install @auth/core@0.34.2
  npm install next-auth@4.24.11
  echo -e "${GREEN}Authentication packages updated to compatible versions!${NC}"
}

# Parse command line arguments
DRY_RUN=false
UPDATE_SECURITY=false
UPDATE_PERFORMANCE=false
UPDATE_DEV_TOOLS=false
UPDATE_ALL=false

for arg in "$@"
do
  case $arg in
    --help)
      show_help
      exit 0
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --security)
      UPDATE_SECURITY=true
      shift
      ;;
    --performance)
      UPDATE_PERFORMANCE=true
      shift
      ;;
    --dev-tools)
      UPDATE_DEV_TOOLS=true
      shift
      ;;
    --all)
      UPDATE_ALL=true
      shift
      ;;
    *)
      # Unknown option
      echo -e "${RED}Unknown option: $arg${NC}"
      show_help
      exit 1
      ;;
  esac
done

# If no update type is specified, show help
if [[ "$UPDATE_SECURITY" == "false" && "$UPDATE_PERFORMANCE" == "false" && "$UPDATE_DEV_TOOLS" == "false" && "$UPDATE_ALL" == "false" ]]; then
  echo -e "${RED}No update type specified!${NC}"
  show_help
  exit 1
fi

# Create backup unless in dry run mode
if [[ "$DRY_RUN" == "false" ]]; then
  create_backup
fi

# Update security-related packages
if [[ "$UPDATE_SECURITY" == "true" || "$UPDATE_ALL" == "true" ]]; then
  echo -e "${YELLOW}Updating security-related packages...${NC}"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would update: next to 14.2.28"
    echo "Would update: @auth/core to 0.34.2 (compatible with next-auth)"
    echo "Would update: next-auth to 4.24.11"
    echo "Would update: sharp to 0.34.1"
    echo "Would update/add: zod to 3.22.4"
  else
    # Handle auth packages special case
    update_auth_packages
    
    # Update other security packages
    npm install next@14.2.28 sharp@0.34.1
    
    # Add zod if not already installed
    if ! grep -q "zod" package.json; then
      npm install zod@3.22.4
    fi
    
    echo -e "${GREEN}Security packages updated!${NC}"
    
    # Run tests after security updates
    if ! run_tests; then
      echo -e "${RED}Tests failed after security updates! Restoring backup...${NC}"
      restore_backup
      exit 1
    fi
  fi
fi

# Update performance-related packages
if [[ "$UPDATE_PERFORMANCE" == "true" || "$UPDATE_ALL" == "true" ]]; then
  echo -e "${YELLOW}Updating performance-related packages...${NC}"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would update: three to 0.158.0"
    echo "Would update: @react-three/fiber to 8.15.12"
    echo "Would update: @react-three/drei to 9.92.1"
    echo "Would update: chart.js to 4.4.9"
    echo "Would update: react-chartjs-2 to 5.3.0"
  else
    npm install three@0.158.0 @react-three/fiber@8.15.12 @react-three/drei@9.92.1
    npm install chart.js@4.4.9 react-chartjs-2@5.3.0
    echo -e "${GREEN}Performance packages updated!${NC}"
    
    # Run tests after performance updates
    if ! run_tests; then
      echo -e "${RED}Tests failed after performance updates! Restoring backup...${NC}"
      restore_backup
      exit 1
    fi
  fi
fi

# Update development tools
if [[ "$UPDATE_DEV_TOOLS" == "true" || "$UPDATE_ALL" == "true" ]]; then
  echo -e "${YELLOW}Updating development tools...${NC}"
  if [[ "$DRY_RUN" == "true" ]]; then
    echo "Would update: @playwright/test to 1.42.1"
    echo "Would update: jest to 29.7.0"
    echo "Would update: jest-environment-jsdom to 29.7.0"
    echo "Would update: typescript to 5.5.3"
  else
    npm install -D @playwright/test@1.42.1
    npm install -D jest@29.7.0 jest-environment-jsdom@29.7.0
    npm install -D typescript@5.5.3
    echo -e "${GREEN}Development tools updated!${NC}"
    
    # Run tests after dev tools updates
    if ! run_tests; then
      echo -e "${RED}Tests failed after dev tools updates! Restoring backup...${NC}"
      restore_backup
      exit 1
    fi
  fi
fi

# Verify dependency security
if [[ "$DRY_RUN" == "false" ]]; then
  echo -e "${YELLOW}Verifying dependency security...${NC}"
  if [ -f "./scripts/check-deps-security.sh" ]; then
    ./scripts/check-deps-security.sh
  else
    npm audit --audit-level=moderate
  fi
fi

# Final success message
if [[ "$DRY_RUN" == "false" ]]; then
  echo -e "${GREEN}All requested updates completed successfully!${NC}"
  echo "Don't forget to update the CHANGELOG.md file with the changes made."
else
  echo -e "${YELLOW}Dry run completed. No changes were made.${NC}"
  echo "Run without --dry-run to apply the changes."
fi

exit 0 