#!/bin/bash

# Script to fix the encoded quotes in component files
# Usage: ./scripts/fix-component-quotes.sh

echo "🔧 Fixing encoded quotes in component files..."

# Find all component files
find app components -name "*.tsx" -type f | while read -r file; do
  echo "Processing $file"
  # Create backup
  cp "$file" "$file.bak"
  
  # Replace encoded quotes with actual quotes
  sed -i '' -e 's/&quot;/"/g' -e "s/&apos;/'/g" "$file"
done

# Fix src/app/layout.tsx if it exists
if [ -f "src/app/layout.tsx" ]; then
  echo "Processing src/app/layout.tsx"
  cp "src/app/layout.tsx" "src/app/layout.tsx.bak"
  sed -i '' -e 's/&quot;/"/g' -e "s/&apos;/'/g" "src/app/layout.tsx"
  
  # Also fix the import statement if needed
  sed -i '' -e 's/import { Geist, Geist_Mono } from "next\/font\/google";/import { Inter } from "next\/font\/google";/' "src/app/layout.tsx"
  sed -i '' -e 's/const geist = Geist/const geist = Inter/' "src/app/layout.tsx"
  sed -i '' -e 's/const geistMono = Geist_Mono/\/\/ const geistMono = Inter/' "src/app/layout.tsx"
fi

echo "✅ Fixed encoded quotes in component files!" 