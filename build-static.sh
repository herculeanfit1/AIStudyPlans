#!/bin/bash
set -e

# Verify all API routes have proper generateStaticParams
echo "Verifying API routes for static export compatibility..."
node scripts/verify-api-routes.js

# Build the app
echo "Building Next.js static export..."
NODE_ENV=production npm run build

echo "Static build completed successfully!" 