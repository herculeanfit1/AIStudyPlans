#!/bin/bash

# Automated Backup Setup Script for AIStudyPlans repository
# This script configures a launchd job to automatically run the backup script on macOS

# Set up variables
REPO_PATH="/Users/herculeanfit1/dev/AIStudyPlans"
BACKUP_SCRIPT="$REPO_PATH/aistudyplans-backup_script.sh"
PLIST_FILE="$REPO_PATH/com.herculeanfit1.aistudyplans.backup.plist"
LAUNCHD_PLIST_PATH="$HOME/Library/LaunchAgents/com.herculeanfit1.aistudyplans.backup.plist"

# Check if the backup script exists
if [ ! -f "$BACKUP_SCRIPT" ]; then
  echo "Error: Backup script not found at $BACKUP_SCRIPT"
  exit 1
fi

# Check if the plist file exists
if [ ! -f "$PLIST_FILE" ]; then
  echo "Error: LaunchAgent plist file not found at $PLIST_FILE"
  exit 1
fi

# Ensure the backup script is executable
chmod +x "$BACKUP_SCRIPT"

# Create LaunchAgents directory if it doesn't exist
mkdir -p "$HOME/Library/LaunchAgents"

# Copy the plist file to the LaunchAgents directory
cp "$PLIST_FILE" "$LAUNCHD_PLIST_PATH"
echo "Copied plist file to $LAUNCHD_PLIST_PATH"

# Unload the job if it's already loaded
launchctl unload "$LAUNCHD_PLIST_PATH" 2>/dev/null

# Load the job
launchctl load "$LAUNCHD_PLIST_PATH"
echo "LaunchAgent loaded successfully"

echo "Automated backup setup complete!"
echo "The backup script will run every 6 hours (21600 seconds) and back up your repository to GitHub."
echo "You can adjust the frequency by editing the StartInterval value in the plist file."
echo "To run a manual backup immediately, execute: $BACKUP_SCRIPT"
echo ""
echo "To verify the job is running, use:"
echo "  launchctl list | grep com.herculeanfit1.aistudyplans.backup"
echo ""
echo "To stop the automated backups, use:"
echo "  launchctl unload $LAUNCHD_PLIST_PATH" 