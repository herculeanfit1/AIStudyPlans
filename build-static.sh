#!/bin/bash
set -e

# Verify all API routes have proper generateStaticParams
echo "Verifying API routes for static export compatibility..."
node scripts/verify-api-routes.js

# Special handling for NextAuth
echo "Applying special handling for NextAuth routes..."
if [ -f "app/api/auth/[...nextauth]/route.ts" ]; then
  echo "Checking NextAuth route file..."
  # Check for BOM characters and clean if needed
  if grep -q $'\xEF\xBB\xBF' "app/api/auth/[...nextauth]/route.ts"; then
    echo "Removing BOM characters from NextAuth route..."
    # Use different sed syntax based on OS (macOS vs Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' '1s/^\xEF\xBB\xBF//' "app/api/auth/[...nextauth]/route.ts"
    else
      sed -i '1s/^\xEF\xBB\xBF//' "app/api/auth/[...nextauth]/route.ts"
    fi
  fi
  
  # Make sure generateStaticParams is defined first in the file
  TEMP_FILE=$(mktemp)
  cat > "$TEMP_FILE" << 'EOL'
import NextAuth from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render any NextAuth routes
  return [];
}

EOL
  
  # Append the rest of the file without the generateStaticParams function
  grep -v "export function generateStaticParams" "app/api/auth/[...nextauth]/route.ts" | grep -v "return \[\];" >> "$TEMP_FILE"
  
  # Replace the original file
  mv "$TEMP_FILE" "app/api/auth/[...nextauth]/route.ts"
  echo "NextAuth route updated for static export."
fi

# Build the app
echo "Building Next.js static export..."
NODE_ENV=production npm run build

echo "Static build completed successfully!" 