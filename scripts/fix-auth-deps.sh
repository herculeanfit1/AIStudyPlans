#!/bin/bash

# Script to fix authentication dependencies without using --legacy-peer-deps
# This ensures proper compatibility between next-auth and @auth/core

set -e

echo "Starting auth dependencies fix"

# First, remove the conflicting packages
npm uninstall next-auth @auth/core

# Install the compatible version of @auth/core first
npm install @auth/core@0.34.2

# Then install next-auth
npm install next-auth@4.24.11

echo "Auth dependencies have been fixed successfully"
echo "Installed: @auth/core@0.34.2 and next-auth@4.24.11"

# Verify the installation
echo "Verifying installation..."
if npm ls next-auth@4.24.11 && npm ls @auth/core@0.34.2; then
  echo "✅ Verification successful: Both packages are installed at the correct versions."
else
  echo "❌ Verification failed: Please check the installation manually."
  exit 1
fi

# Add missing dependency
if ! npm ls zod; then
  echo "Installing zod for proper validation..."
  npm install zod@3.22.4
fi

echo "Fix complete." 