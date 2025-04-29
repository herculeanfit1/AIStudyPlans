#!/bin/bash

# Run Docker setup for SchedulEd application
# This script helps you manage the Docker development environment

# Ensure script is executable: chmod +x run-docker.sh

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}AIStudyPlans Docker Development Environment${NC}"

# Check if docker and docker-compose are installed
if ! command -v docker &> /dev/null || ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}Error: Docker and docker-compose are required to run this script.${NC}"
    exit 1
fi

# Function to check if .env.local exists
check_env_file() {
  if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Warning: .env.local file not found.${NC}"
    echo "Creating a template .env.local file..."
    
    cat > .env.local << EOL
# Resend API Configuration
RESEND_API_KEY=your_actual_resend_api_key_here

# Email Configuration
EMAIL_FROM=Lindsey <lindsey@aistudyplans.com>
EMAIL_REPLY_TO=support@aistudyplans.com

# Application URL (for email templates and links)
NEXT_PUBLIC_APP_URL=http://localhost:3001
EOL
    
    echo -e "${YELLOW}Please edit .env.local and add your RESEND_API_KEY before continuing.${NC}"
    echo -e "Press Enter to continue or Ctrl+C to cancel..."
    read
  else
    echo -e "${GREEN}Found .env.local file.${NC}"
  fi
}

# Function to start the development environment
start_dev() {
  echo -e "${GREEN}Starting development environment...${NC}"
  check_env_file
  docker-compose down
  docker-compose up --build
}

# Function to stop the environment
stop_dev() {
  echo -e "${GREEN}Stopping development environment...${NC}"
  docker-compose down
}

# Function to run tests
run_tests() {
  echo -e "${GREEN}Running tests in Docker...${NC}"
  docker-compose run --rm web npm test
}

# Function to test the email system
test_email() {
  local email_type=${1:-"simple"}
  local recipient=$2
  
  check_env_file
  
  if [ -z "$recipient" ] && [ "$email_type" != "simple" ] && [ "$email_type" != "waitlist" ] && [ "$email_type" != "feedback" ] && [ "$email_type" != "all" ]; then
    # If only one argument is provided and it's not a valid type, consider it as the recipient
    recipient=$email_type
    email_type="simple"
  fi
  
  echo -e "${GREEN}Testing ${email_type} email${recipient:+ with address: $recipient}${NC}"
  
  # Run the consolidated email test script
  node scripts/email-test.js $email_type $recipient
}

# Function to run e2e tests
run_e2e() {
    echo -e "${YELLOW}Running end-to-end tests...${NC}"
    docker-compose up --build e2e-tests
}

# Function to run lighthouse tests
run_lighthouse() {
    echo -e "${YELLOW}Running Lighthouse tests...${NC}"
    docker-compose up --build lighthouse
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [command]"
    echo "Commands:"
    echo "  start     - Start the development environment"
    echo "  stop      - Stop the development environment"
    echo "  restart   - Restart the development environment"
    echo "  test      - Run unit tests"
    echo "  e2e       - Run end-to-end tests"
    echo "  lighthouse - Run Lighthouse performance tests"
    echo "  email [type] [recipient] - Test email sending functionality"
    echo "           Types: simple, waitlist, feedback, all (default: simple)"
    echo "Examples:"
    echo "  $0 start"
    echo "  $0 test"
    echo "  $0 email your-email@example.com"
    echo "  $0 email waitlist your-email@example.com"
}

# Main script logic
case "$1" in
    start)
        start_dev
        ;;
    stop)
        stop_dev
        ;;
    restart)
        stop_dev
        start_dev
        ;;
    test)
        run_tests
        ;;
    e2e)
        run_e2e
        ;;
    lighthouse)
        run_lighthouse
        ;;
    email)
        test_email "$2" "$3"
        ;;
    *)
        show_usage
        ;;
esac 