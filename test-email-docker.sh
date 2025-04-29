#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}SchedulEd Email Test in Docker${NC}"
echo -e "${BLUE}========================================${NC}"

# Get recipient email from command line or use default
EMAIL_TO=${1:-delivered@resend.dev}
echo -e "${GREEN}Target email: ${EMAIL_TO}${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}Warning: .env.local file not found.${NC}"
  
  # Prompt for API key
  echo -e "${YELLOW}Please enter your Resend API key:${NC}"
  read -r RESEND_API_KEY
  
  if [ -z "$RESEND_API_KEY" ]; then
    echo -e "${RED}Error: Resend API key is required.${NC}"
    exit 1
  fi
  
  # Export variables so docker-compose can use them
  export RESEND_API_KEY
else
  echo -e "${GREEN}Using configuration from .env.local${NC}"
  # Source the .env file to get variables
  export $(grep -v '^#' .env.local | xargs)
fi

# Make sure EMAIL_TO is set for docker-compose
export EMAIL_TO

echo -e "${GREEN}Starting email test container...${NC}"
echo -e "${YELLOW}This will install dependencies and run the test script.${NC}"

# Run the docker-compose file
docker-compose -f docker-compose.email-test.yml up --build

echo -e "${GREEN}Test completed.${NC}" 