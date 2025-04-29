#!/bin/bash
set -e

echo "Creating static build with API routes included..."

# Run the build
echo "Running Next.js build..."
npm run build

echo "Build completed successfully with API routes included!" 