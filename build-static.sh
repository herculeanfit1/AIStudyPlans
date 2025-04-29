#!/bin/bash
set -e

echo "Creating static build with API routes temporarily removed..."

# Create a backup directory for API routes
mkdir -p ./temp_api_backup

# Move API routes to temp backup
echo "Moving API routes to temporary backup..."
mv ./app/api ./temp_api_backup/

# Run the build
echo "Running Next.js build..."
npm run build

# Restore API routes
echo "Restoring API routes..."
mv ./temp_api_backup/api ./app/

# Clean up
echo "Cleaning up..."
rmdir ./temp_api_backup

echo "Build completed successfully!" 