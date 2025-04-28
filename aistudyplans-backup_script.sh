#!/bin/bash

# Backup Script for AIStudyPlans repository
# This script creates a mirror backup of the main repository and pushes it to the backup repository

# Set up variables
SOURCE_REPO="/Users/herculeanfit1/dev/AIStudyPlans"
BACKUP_REPO_URL="https://github.com/herculeanfit1/AIStudyPlans-Backups.git"
TEMP_DIR="/tmp/AIStudyPlans-backup-$(date +%Y%m%d-%H%M%S)"
LOG_FILE="$SOURCE_REPO/aistudyplans-backup_log.txt"

# Logging function
log_message() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a "$LOG_FILE"
}

# Start backup process
log_message "Starting backup process"

# Create temporary directory for the backup
mkdir -p "$TEMP_DIR"
log_message "Created temporary directory: $TEMP_DIR"

# Clone the source repository as a mirror to capture all branches and history
cd "$TEMP_DIR"
log_message "Cloning source repository as mirror"
git clone --mirror "$SOURCE_REPO/.git" ./git-backup

# Enter the backup repository
cd ./git-backup

# Check if the backup remote exists, if not add it
if ! git remote | grep -q "backup"; then
  log_message "Adding backup remote"
  git remote add backup "$BACKUP_REPO_URL"
fi

# Push all refs to the backup repository
log_message "Pushing to backup repository"
git push -f backup --all
git push -f backup --tags

# Clean up
cd "$SOURCE_REPO"
log_message "Removing temporary directory"
rm -rf "$TEMP_DIR"

log_message "Backup completed successfully"
echo "Backup completed. Check $LOG_FILE for details." 