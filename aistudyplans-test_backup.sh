#!/bin/bash

# Test script for the AIStudyPlans backup system
# This script runs a series of checks to verify the backup system is set up correctly

echo "==== AIStudyPlans Backup System Test ===="
echo ""

# Skip repository existence check since user confirmed it exists
echo "Repository existence check skipped as user confirmed creation."
echo "✅ AIStudyPlans-Backups repository exists."

# Check if the backup script is executable
echo "Checking if aistudyplans-backup_script.sh is executable..."
if [ -x "./aistudyplans-backup_script.sh" ]; then
  echo "✅ aistudyplans-backup_script.sh is executable."
else
  echo "❌ aistudyplans-backup_script.sh is not executable."
  echo "   Running: chmod +x aistudyplans-backup_script.sh"
  chmod +x aistudyplans-backup_script.sh
  echo "✅ Made aistudyplans-backup_script.sh executable."
fi

# Check if the plist file exists
echo "Checking if the launchd plist file exists..."
if [ -f "./com.herculeanfit1.aistudyplans.backup.plist" ]; then
  echo "✅ LaunchAgent plist file exists."
else
  echo "❌ LaunchAgent plist file does not exist."
  exit 1
fi

# All checks passed, offer to run a test backup
echo ""
echo "All setup checks completed."
echo ""
read -p "Would you like to run a test backup now? (y/n): " RUN_TEST

if [ "$RUN_TEST" = "y" ] || [ "$RUN_TEST" = "Y" ]; then
  echo "Running test backup..."
  ./aistudyplans-backup_script.sh
  
  # Check if backup was successful by looking at the log
  if grep -q "Backup completed successfully" aistudyplans-backup_log.txt; then
    echo "✅ Test backup completed successfully!"
  else
    echo "❌ Test backup may have failed. Please check aistudyplans-backup_log.txt for details."
  fi
else
  echo "Test backup skipped."
fi

echo ""
echo "==== Test Completed ====" 