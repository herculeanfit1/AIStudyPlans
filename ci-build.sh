#!/bin/bash
set -e

echo "Running CI-specific build script..."

# Clean any existing output
if [ -d "out" ]; then
  echo "Cleaning existing output directory"
  rm -rf out/
fi

if [ -d ".next" ]; then
  echo "Cleaning existing .next directory"
  rm -rf .next/
fi

# Temporarily move NextAuth route out of the way for static export
if [ -f "app/api/auth/[...nextauth]/route.ts" ]; then
  echo "Temporarily removing NextAuth route for static export"
  mkdir -p temp_backup
  mv "app/api/auth/[...nextauth]/route.ts" temp_backup/
fi

# Set environment variable to enable static export
export SKIP_AUTH=true
export NODE_ENV=production

# Verify all API routes have proper generateStaticParams
echo "Verifying API routes for static export compatibility..."
node scripts/verify-api-routes.js

# Build the app
echo "Building Next.js static export..."
npm run build

# Verify the output directory exists
if [ -d "out" ]; then
  echo "Static export directory 'out' was created successfully."
  # List contents for debugging
  ls -la out/
  
  # Make sure the routing works
  echo "Checking for critical files..."
  if [ -f "out/index.html" ]; then
    echo "✅ index.html exists"
  else
    echo "❌ ERROR: index.html is missing!"
  fi
  
  if [ -f "out/404.html" ]; then
    echo "✅ 404.html exists"
  else
    echo "❌ ERROR: 404.html is missing!"
  fi
  
  # Copy staticwebapp.config.json to the output directory
  echo "Copying staticwebapp.config.json to out directory"
  cp staticwebapp.config.json out/
else
  echo "ERROR: Static export directory 'out' was not created!"
  echo "Current directory contents:"
  ls -la
  exit 1
fi

# Restore NextAuth route if it was moved
if [ -f "temp_backup/route.ts" ]; then
  echo "Restoring NextAuth route"
  mkdir -p "app/api/auth/[...nextauth]"
  mv temp_backup/route.ts "app/api/auth/[...nextauth]/"
  rmdir temp_backup
fi

echo "CI build completed successfully!" 