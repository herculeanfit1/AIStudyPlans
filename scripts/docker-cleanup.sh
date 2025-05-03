#!/bin/bash

# Docker Cleanup Script for AIStudyPlans Project
# This script helps clean up Docker resources related to the project

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}AIStudyPlans Docker Cleanup${NC}"
echo -e "${BLUE}========================================${NC}"

# Function to show help message
show_help() {
  echo "This script cleans up Docker resources related to the AIStudyPlans project."
  echo
  echo "Usage: ./scripts/docker-cleanup.sh [options]"
  echo
  echo "Options:"
  echo "  --all       Clean all resources (containers, images, volumes, networks)"
  echo "  --cont      Remove only containers"
  echo "  --images    Remove only images"
  echo "  --volumes   Remove only volumes"
  echo "  --networks  Remove only networks"
  echo "  --prune     Run Docker system prune (remove all unused resources)"
  echo "  --help      Display this help message"
  echo
  echo "Example: ./scripts/docker-cleanup.sh --all"
}

# Function to stop and remove containers
cleanup_containers() {
  echo -e "${YELLOW}Stopping and removing AIStudyPlans containers...${NC}"
  
  # First, bring down any running docker-compose services
  docker-compose down 2>/dev/null
  docker-compose -f docker-compose.test.yml down 2>/dev/null
  docker-compose -f docker-compose.email-test.yml down 2>/dev/null
  
  # Find and remove any remaining containers with aistudyplans prefix
  CONTAINERS=$(docker ps -a --filter "name=aistudyplans" --format "{{.ID}}")
  if [ -n "$CONTAINERS" ]; then
    echo -e "${YELLOW}Found orphaned containers:${NC}"
    docker ps -a --filter "name=aistudyplans"
    echo -e "${YELLOW}Removing containers...${NC}"
    docker rm -f $CONTAINERS
    echo -e "${GREEN}Containers removed.${NC}"
  else
    echo -e "${GREEN}No AIStudyPlans containers found.${NC}"
  fi
}

# Function to remove images
cleanup_images() {
  echo -e "${YELLOW}Removing AIStudyPlans images...${NC}"
  
  # Find images with aistudyplans prefix
  IMAGES=$(docker images --filter "reference=aistudyplans*" --format "{{.ID}}")
  if [ -n "$IMAGES" ]; then
    echo -e "${YELLOW}Found images:${NC}"
    docker images --filter "reference=aistudyplans*"
    echo -e "${YELLOW}Removing images...${NC}"
    docker rmi -f $IMAGES
    echo -e "${GREEN}Images removed.${NC}"
  else
    echo -e "${GREEN}No AIStudyPlans images found.${NC}"
  fi
}

# Function to remove volumes
cleanup_volumes() {
  echo -e "${YELLOW}Removing AIStudyPlans volumes...${NC}"
  
  # Find volumes with aistudyplans prefix
  VOLUMES=$(docker volume ls --filter "name=aistudyplans" --format "{{.Name}}")
  if [ -n "$VOLUMES" ]; then
    echo -e "${YELLOW}Found volumes:${NC}"
    docker volume ls --filter "name=aistudyplans"
    echo -e "${YELLOW}Removing volumes...${NC}"
    docker volume rm $VOLUMES
    echo -e "${GREEN}Volumes removed.${NC}"
  else
    echo -e "${GREEN}No AIStudyPlans volumes found.${NC}"
  fi
}

# Function to remove networks
cleanup_networks() {
  echo -e "${YELLOW}Removing AIStudyPlans networks...${NC}"
  
  # Find networks with aistudyplans prefix
  NETWORKS=$(docker network ls --filter "name=aistudyplans" --format "{{.ID}}")
  if [ -n "$NETWORKS" ]; then
    echo -e "${YELLOW}Found networks:${NC}"
    docker network ls --filter "name=aistudyplans"
    echo -e "${YELLOW}Removing networks...${NC}"
    docker network rm $NETWORKS
    echo -e "${GREEN}Networks removed.${NC}"
  else
    echo -e "${GREEN}No AIStudyPlans networks found.${NC}"
  fi
}

# Function to run Docker system prune
run_prune() {
  echo -e "${YELLOW}Running Docker system prune...${NC}"
  docker system prune -f
  echo -e "${GREEN}Prune completed.${NC}"
}

# Default behavior is to show help if no arguments provided
if [ $# -eq 0 ]; then
  show_help
  exit 0
fi

# Process command-line arguments
while [ "$1" != "" ]; do
  case $1 in
    --all)
      cleanup_containers
      cleanup_images
      cleanup_volumes
      cleanup_networks
      ;;
    --cont)
      cleanup_containers
      ;;
    --images)
      cleanup_images
      ;;
    --volumes)
      cleanup_volumes
      ;;
    --networks)
      cleanup_networks
      ;;
    --prune)
      run_prune
      ;;
    --help)
      show_help
      exit 0
      ;;
    *)
      echo -e "${RED}Unknown option: $1${NC}"
      show_help
      exit 1
      ;;
  esac
  shift
done

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}Cleanup completed!${NC}"
echo -e "${BLUE}========================================${NC}" 