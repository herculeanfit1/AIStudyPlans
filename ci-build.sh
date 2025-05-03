#!/bin/bash
set -e

echo "Running CI-specific build script..."

# Temporarily move NextAuth route out of the way for static export
if [ -f "app/api/auth/[...nextauth]/route.ts" ]; then
  echo "Temporarily removing NextAuth route for static export"
  mkdir -p temp_backup
  mv "app/api/auth/[...nextauth]/route.ts" temp_backup/
fi

# Set environment variable to enable static export
export SKIP_AUTH=true

# Verify all API routes have proper generateStaticParams
echo "Verifying API routes for static export compatibility..."
node scripts/verify-api-routes.js

# Build the app
echo "Building Next.js static export..."
NODE_ENV=production npm run build

# Restore NextAuth route if it was moved
if [ -f "temp_backup/route.ts" ]; then
  echo "Restoring NextAuth route"
  mkdir -p "app/api/auth/[...nextauth]"
  mv temp_backup/route.ts "app/api/auth/[...nextauth]/"
  rmdir temp_backup
fi

echo "CI build completed successfully!" 