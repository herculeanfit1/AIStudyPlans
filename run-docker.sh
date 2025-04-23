#!/bin/bash

# Run Docker setup for SchedulEd application
# This script helps you manage the Docker development environment

# Ensure script is executable: chmod +x run-docker.sh

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if .env.local exists
check_env_file() {
  if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Warning: .env.local file not found.${NC}"
    echo "Creating a template .env.local file..."
    
    cat > .env.local << EOL
# SchedulEd application environment variables
# This file should not be committed to version control

# Resend API key for email service
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
  fi
}

# Function to start the development environment
start_dev() {
  echo -e "${GREEN}Starting development environment...${NC}"
  check_env_file
  docker-compose down
  docker-compose build --no-cache
  docker-compose up
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
  if [ -z "$1" ]; then
    echo -e "${RED}Error: Email address is required.${NC}"
    echo "Usage: ./run-docker.sh email your-email@example.com"
    exit 1
  fi
  
  echo -e "${GREEN}Testing email with address: $1${NC}"
  docker-compose run --rm web node test-resend.js "$1"
}

# Parse arguments
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
  email)
    test_email "$2"
    ;;
  *)
    echo -e "${GREEN}SchedulEd Docker Development Environment${NC}"
    echo ""
    echo "Usage: ./run-docker.sh [command]"
    echo ""
    echo "Commands:"
    echo "  start   - Start the development environment"
    echo "  stop    - Stop the development environment"
    echo "  restart - Restart the development environment"
    echo "  test    - Run tests"
    echo "  email   - Test email system (requires email address)"
    echo ""
    echo "Examples:"
    echo "  ./run-docker.sh start"
    echo "  ./run-docker.sh email your-email@example.com"
    ;;
esac 