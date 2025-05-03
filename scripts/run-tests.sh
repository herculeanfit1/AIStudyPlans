#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}AIStudyPlans Test Runner${NC}"
echo -e "${BLUE}========================================${NC}"

# Make this script executable
chmod +x "$0"

# Function to display help
function show_help {
  echo -e "Usage: ./scripts/run-tests.sh [type] [options]"
  echo
  echo -e "Test types:"
  echo -e "  all       Run all tests (default)"
  echo -e "  unit      Run unit tests"
  echo -e "  e2e       Run end-to-end tests"
  echo -e "  visual    Run visual regression tests"
  echo -e "  a11y      Run accessibility tests"
  echo -e "  perf      Run performance tests"
  echo -e "  security  Run security tests"
  echo
  echo -e "Options:"
  echo -e "  --docker        Run tests using Docker (default)"
  echo -e "  --local         Run tests locally without Docker"
  echo -e "  --ci            Run in CI mode (more strict, no browser UI)"
  echo -e "  --help          Show this help message"
  echo -e "  --no-cleanup    Skip Docker cleanup after tests (for debugging)"
  echo
  echo -e "Examples:"
  echo -e "  ./scripts/run-tests.sh unit        Run unit tests in Docker"
  echo -e "  ./scripts/run-tests.sh e2e --local Run end-to-end tests locally"
  echo -e "  ./scripts/run-tests.sh all --ci    Run all tests in CI mode"
}

# Parse arguments
TEST_TYPE="all"
USE_DOCKER=true
CI_MODE=false
SKIP_CLEANUP=false

# Process command-line arguments
for arg in "$@"; do
  case $arg in
    all|unit|e2e|visual|a11y|perf|security)
      TEST_TYPE="$arg"
      ;;
    --docker)
      USE_DOCKER=true
      ;;
    --local)
      USE_DOCKER=false
      ;;
    --ci)
      CI_MODE=true
      ;;
    --no-cleanup)
      SKIP_CLEANUP=true
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown argument: $arg${NC}"
      show_help
      exit 1
      ;;
  esac
done

# Set up environment variables for CI mode
if [ "$CI_MODE" = true ]; then
  export CI=true
  export PLAYWRIGHT_HEADLESS=true
  echo -e "${YELLOW}Running in CI mode (headless browsers, stricter checks)${NC}"
fi

# Display selected options
echo -e "${GREEN}Selected test type: ${TEST_TYPE}${NC}"
if [ "$USE_DOCKER" = true ]; then
  echo -e "${GREEN}Running tests using Docker${NC}"
else
  echo -e "${GREEN}Running tests locally${NC}"
fi

if [ "$SKIP_CLEANUP" = true ]; then
  echo -e "${YELLOW}Docker cleanup will be skipped${NC}"
fi

# Function to perform Docker cleanup
function cleanup_docker {
  if [ "$SKIP_CLEANUP" = true ]; then
    echo -e "${YELLOW}Skipping Docker cleanup as requested${NC}"
    return
  fi
  
  echo -e "${YELLOW}Cleaning up Docker resources...${NC}"
  
  # Bring down any running docker-compose services
  docker-compose -f docker-compose.test.yml down 2>/dev/null
  
  # Remove test containers that might be leftover
  TEST_CONTAINERS=$(docker ps -a --filter "name=aistudyplans-test" --format "{{.ID}}")
  if [ -n "$TEST_CONTAINERS" ]; then
    echo -e "${YELLOW}Removing test containers...${NC}"
    docker rm -f $TEST_CONTAINERS > /dev/null
  fi
  
  # Prune unused networks
  echo -e "${YELLOW}Pruning unused networks...${NC}"
  docker network prune -f > /dev/null
  
  echo -e "${GREEN}Cleanup completed.${NC}"
}

# Function to run Docker tests
function run_docker_tests {
  local test_type=$1
  
  # Make sure we have necessary scripts
  chmod +x scripts/*
  
  case $test_type in
    all)
      echo -e "${BLUE}Running all tests with Docker...${NC}"
      # Run services individually in the correct order
      docker-compose -f docker-compose.test.yml up --build test-unit
      docker-compose -f docker-compose.test.yml up --build test-e2e
      docker-compose -f docker-compose.test.yml up --build test-a11y
      docker-compose -f docker-compose.test.yml up --build test-visual
      docker-compose -f docker-compose.test.yml up --build test-perf
      # Run security check
      echo -e "${YELLOW}Running npm audit...${NC}"
      docker-compose -f docker-compose.test.yml run --rm test-unit npm audit --audit-level=high
      echo -e "${YELLOW}Completed security tests${NC}"
      ;;
    unit)
      echo -e "${BLUE}Running unit tests with Docker...${NC}"
      docker-compose -f docker-compose.test.yml up --build test-unit
      ;;
    e2e)
      echo -e "${BLUE}Running E2E tests with Docker...${NC}"
      docker-compose -f docker-compose.test.yml up --build test-e2e
      ;;
    visual)
      echo -e "${BLUE}Running visual regression tests with Docker...${NC}"
      docker-compose -f docker-compose.test.yml up --build test-visual
      ;;
    a11y)
      echo -e "${BLUE}Running accessibility tests with Docker...${NC}"
      docker-compose -f docker-compose.test.yml up --build test-a11y
      ;;
    perf)
      echo -e "${BLUE}Running performance tests with Docker...${NC}"
      docker-compose -f docker-compose.test.yml up --build test-perf
      ;;
    security)
      echo -e "${BLUE}Running security tests with Docker...${NC}"
      echo -e "${YELLOW}Running npm audit...${NC}"
      docker-compose -f docker-compose.test.yml run --rm test-unit npm audit --audit-level=high
      echo -e "${YELLOW}Completed security tests${NC}"
      ;;
  esac
}

# Function to run local tests
function run_local_tests {
  local test_type=$1
  
  case $test_type in
    all)
      echo -e "${BLUE}Running all tests locally...${NC}"
      npm run lint && npm run typecheck && npm run test && npm run test:e2e && npm run test:a11y && npm run test:visual && npm run test:perf && npm run test:security
      ;;
    unit)
      echo -e "${BLUE}Running unit tests locally...${NC}"
      npm run test
      ;;
    e2e)
      echo -e "${BLUE}Running E2E tests locally...${NC}"
      npm run test:e2e
      ;;
    visual)
      echo -e "${BLUE}Running visual regression tests locally...${NC}"
      npm run test:visual
      ;;
    a11y)
      echo -e "${BLUE}Running accessibility tests locally...${NC}"
      npm run test:a11y
      ;;
    perf)
      echo -e "${BLUE}Running performance tests locally...${NC}"
      npm run test:perf
      ;;
    security)
      echo -e "${BLUE}Running security tests locally...${NC}"
      npm run test:security
      ;;
  esac
}

# Ensure we have necessary dependencies
if [ "$USE_DOCKER" = false ]; then
  echo -e "${YELLOW}Checking for required dependencies...${NC}"
  npm install
  
  if [ "$TEST_TYPE" = "e2e" ] || [ "$TEST_TYPE" = "visual" ] || [ "$TEST_TYPE" = "all" ]; then
    echo -e "${YELLOW}Installing Playwright browsers...${NC}"
    npx playwright install --with-deps chromium
  fi
  
  if [ "$TEST_TYPE" = "a11y" ] || [ "$TEST_TYPE" = "all" ]; then
    echo -e "${YELLOW}Installing PA11Y...${NC}"
    npm install -g pa11y-ci
  fi
  
  if [ "$TEST_TYPE" = "perf" ] || [ "$TEST_TYPE" = "all" ]; then
    echo -e "${YELLOW}Installing Lighthouse CI...${NC}"
    npm install -g @lhci/cli
  fi
fi

# Run the tests
if [ "$USE_DOCKER" = true ]; then
  run_docker_tests "$TEST_TYPE"
else
  run_local_tests "$TEST_TYPE"
fi

# Clean up Docker resources if tests were run in Docker
if [ "$USE_DOCKER" = true ]; then
  cleanup_docker
fi

# Show summary
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Tests completed!${NC}"
echo -e "${BLUE}========================================${NC}" 