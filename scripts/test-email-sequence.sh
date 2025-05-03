#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}SchedulEd Email Sequence Test Tool${NC}"
echo -e "${BLUE}========================================${NC}"

# Check if email is provided
if [ -z "$1" ]; then
  echo -e "${YELLOW}Usage: ./scripts/test-email-sequence.sh [email] [position]${NC}"
  echo -e "${YELLOW}Example: ./scripts/test-email-sequence.sh your@email.com 2${NC}"
  echo ""
  echo -e "Using default test email: ${GREEN}delivered@resend.dev${NC}"
  EMAIL_TO="delivered@resend.dev"
else
  EMAIL_TO="$1"
  echo -e "${GREEN}Using email: $EMAIL_TO${NC}"
fi

# Check if position is provided
if [ -z "$2" ]; then
  echo -e "${YELLOW}No position specified. Options:${NC}"
  echo "  0: Welcome email"
  echo "  1: First feedback email (features)"
  echo "  2: Second feedback email (challenges)"
  echo "  3: Third feedback email (design)"
  echo "  4: Final feedback email (satisfaction)"
  echo "  all: Send all emails in sequence"
  echo ""
  echo -e "Please specify which email to send:"
  read -r POSITION
else
  POSITION="$2"
fi

# Make scripts executable
chmod +x scripts/test-feedback-emails.js
chmod +x scripts/test-welcome-email.js

# Check for .env.local file
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}Warning: .env.local file not found.${NC}"
  echo -e "${YELLOW}Creating a template .env.local file...${NC}"
  
  # Create a template .env.local file
  cat > .env.local << EOL
# Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email sending (Resend)
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=Your Name <your-email@domain.com>
EMAIL_REPLY_TO=support@domain.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Feedback campaign API key (for testing)
FEEDBACK_CAMPAIGN_API_KEY=test-api-key

# Feature flags
ENABLE_FEEDBACK_CAMPAIGN=true
ENABLE_WAITLIST=true

# Set to development for local testing
NODE_ENV=development
EOL

  echo -e "${YELLOW}Please edit .env.local with your credentials and run this script again.${NC}"
  exit 1
fi

# Install required dependencies if needed
echo -e "${GREEN}Checking dependencies...${NC}"
if ! npm list resend >/dev/null 2>&1 || ! npm list @supabase/supabase-js >/dev/null 2>&1 || ! npm list dotenv >/dev/null 2>&1; then
  echo -e "${YELLOW}Installing required dependencies...${NC}"
  npm install --no-save resend @supabase/supabase-js dotenv
fi

# Function to send an email at a specific position
send_email() {
  local pos=$1
  if [ "$pos" = "0" ]; then
    echo -e "${GREEN}Sending Welcome Email (position 0)...${NC}"
    node scripts/test-welcome-email.js "$EMAIL_TO" "Test User"
  else
    echo -e "${GREEN}Sending Feedback Email (position $pos)...${NC}"
    node scripts/test-feedback-emails.js "$EMAIL_TO" "$pos"
  fi
  echo ""
}

# Send emails based on selected position
if [ "$POSITION" = "all" ]; then
  echo -e "${GREEN}Sending all emails in sequence...${NC}"
  for pos in {0..4}; do
    send_email $pos
    if [ $pos -lt 4 ]; then
      echo -e "${YELLOW}Press Enter to send the next email...${NC}"
      read -r
    fi
  done
else
  # Validate position
  if [[ ! "$POSITION" =~ ^[0-4]$ ]]; then
    echo -e "${RED}Invalid position. Must be 0-4 or 'all'.${NC}"
    exit 1
  fi
  
  send_email "$POSITION"
fi

echo -e "${GREEN}Email testing completed!${NC}"
echo -e "${YELLOW}To run the local server: npm run dev${NC}"
echo -e "${YELLOW}To sign up for the waitlist: http://localhost:3000${NC}" 