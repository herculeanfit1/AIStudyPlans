#!/bin/bash

# AIStudyPlans Email Testing Script
# A convenient wrapper for testing email functionality

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Make sure the script is executable
chmod +x "$0"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}AIStudyPlans Email Testing${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to display help
function show_help {
  echo -e "Usage: ./scripts/email-test.sh [template] [email] [--docker]"
  echo
  echo -e "Templates:"
  echo -e "  simple    Send a basic test email (default)"
  echo -e "  waitlist  Send the waitlist confirmation email"
  echo -e "  feedback  Send the feedback request email"
  echo -e "  all       Send all email templates"
  echo
  echo -e "Options:"
  echo -e "  --docker    Run using Docker (default: run locally)"
  echo -e "  --help      Show this help message"
  echo
  echo -e "Examples:"
  echo -e "  ./scripts/email-test.sh"
  echo -e "  ./scripts/email-test.sh waitlist your-email@example.com"
  echo -e "  ./scripts/email-test.sh all your-email@example.com --docker"
}

# Default values
TEMPLATE="simple"
EMAIL="delivered@resend.dev"
USE_DOCKER=false

# Parse arguments
for arg in "$@"; do
  case $arg in
    simple|waitlist|feedback|all)
      TEMPLATE="$arg"
      ;;
    --docker)
      USE_DOCKER=true
      ;;
    --help)
      show_help
      exit 0
      ;;
    *@*)
      # This looks like an email address
      EMAIL="$arg"
      ;;
    *)
      if [ "$arg" != "--docker" ] && [ "$arg" != "--help" ]; then
        echo -e "${RED}Unknown argument: $arg${NC}"
        show_help
        exit 1
      fi
      ;;
  esac
done

# Check for .env.local file
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}Warning: .env.local file not found.${NC}"
  echo -e "${YELLOW}Creating a template .env.local file...${NC}"
  
  cat > .env.local << EOL
# Resend API Configuration
RESEND_API_KEY=your_resend_api_key_here

# Email Configuration
EMAIL_FROM=lindsey@aistudyplans.com
EMAIL_REPLY_TO=support@aistudyplans.com

# Application URL (for email templates and links)
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOL
  
  echo -e "${YELLOW}Please edit .env.local and add your RESEND_API_KEY before continuing.${NC}"
  echo -e "Press Enter to continue or Ctrl+C to cancel..."
  read
fi

# Load API key from .env.local
RESEND_API_KEY=$(grep RESEND_API_KEY .env.local | cut -d= -f2)

# Display settings
echo -e "${GREEN}Email Test Configuration:${NC}"
echo -e "  Template: ${TEMPLATE}"
echo -e "  Recipient: ${EMAIL}"
echo -e "  API Key: ${RESEND_API_KEY:0:5}...${RESEND_API_KEY: -4}"
echo -e "  Mode: ${USE_DOCKER && "Docker" || "Local"}"

# Confirm before sending
echo
echo -e "${YELLOW}Ready to send email(s). Continue? (y/n)${NC}"
read -r CONFIRM

if [[ ! "$CONFIRM" =~ ^[Yy]$ ]]; then
  echo -e "${RED}Cancelled.${NC}"
  exit 0
fi

# Send the email(s)
if [ "$USE_DOCKER" = true ]; then
  echo -e "${GREEN}Sending email(s) using Docker...${NC}"
  TEMPLATE=$TEMPLATE EMAIL_TO=$EMAIL RESEND_API_KEY=$RESEND_API_KEY docker-compose -f docker-compose.email-test.yml up
else
  echo -e "${GREEN}Sending email(s) locally...${NC}"
  RESEND_API_KEY=$RESEND_API_KEY node scripts/test-email.js $TEMPLATE $EMAIL
fi

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Email testing completed!${NC}"
echo -e "${BLUE}========================================${NC}" 