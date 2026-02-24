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

# Set environment for production build with server-side features
export NODE_ENV=production

# Ensure Supabase environment variables are available
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
  echo "Warning: NEXT_PUBLIC_SUPABASE_URL not set, using placeholder for build"
  export NEXT_PUBLIC_SUPABASE_URL="https://placeholder-for-build.supabase.co"
fi

if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "Warning: NEXT_PUBLIC_SUPABASE_ANON_KEY not set, using placeholder for build"
  export NEXT_PUBLIC_SUPABASE_ANON_KEY="placeholder-key-for-build-process"
fi

# Build the app (NEXT_PUBLIC_* vars are read from process environment by Next.js)
# No .env.production file needed — env vars are injected by GitHub Actions
echo "Building Next.js application with server-side features..."
npm run build

# Verify the output directory exists
if [ -d ".next" ]; then
  echo "Build directory '.next' was created successfully."
  # List contents for debugging
  ls -la .next/
  
  echo "✅ Next.js build completed successfully"
  echo "✅ Server-side rendering and API routes are enabled"
else
  echo "ERROR: Build directory '.next' was not created!"
  echo "Current directory contents:"
  ls -la
  exit 1
fi

echo "CI build completed successfully with server-side features!" 