#!/bin/bash

# Script to fix common linting and TypeScript issues in the codebase
# Usage: ./scripts/fix-lint-issues.sh

echo "🔍 Fixing linting and TypeScript issues..."

# Fix TypeScript any types by updating tsconfig.json temporarily
echo "⚙️ Temporarily allowing 'any' type for fixing process..."
sed -i.bak 's/"strict": true/"strict": false/g' tsconfig.json

# Fix React unescaped entity issues
echo "🔧 Fixing unescaped entities in React components..."
find app components -name "*.tsx" -type f -exec sed -i.bak \
  -e "s/'/\&apos;/g" \
  -e 's/"/\&quot;/g' \
  {} \;

# Fix unused imports by installing and running eslint-plugin-unused-imports
echo "📦 Installing eslint-plugin-unused-imports..."
npm install -D eslint-plugin-unused-imports

echo "🧹 Running eslint to fix unused imports..."
npx eslint --fix --ext .js,.jsx,.ts,.tsx app/ components/ lib/ pages/ src/

# Add Jest DOM types for tests
echo "🧪 Adding Jest DOM types to test configuration..."
if ! grep -q "@testing-library/jest-dom" jest.setup.js; then
  echo "import '@testing-library/jest-dom';" >> jest.setup.js
fi

# Fix smoothScroll.ts this context issue
echo "🔧 Fixing 'this' context in smoothScroll.ts..."
if [ -f lib/smoothScroll.ts ]; then
  sed -i.bak 's/const href = this.getAttribute/const href = (this as HTMLAnchorElement).getAttribute/g' lib/smoothScroll.ts
fi

# Fix email.ts property name (reply_to -> replyTo)
echo "📧 Fixing email property name in email.ts..."
if [ -f lib/email.ts ]; then
  sed -i.bak 's/reply_to: /replyTo: /g' lib/email.ts
fi

# Fix function declarations in supabase.ts
echo "⚡ Fixing function declarations in supabase.ts..."
if [ -f lib/supabase.ts ]; then
  sed -i.bak 's/function getTimeThresholdForPosition/const getTimeThresholdForPosition = function/g' lib/supabase.ts
fi

# Fix null safety for searchParams in feedback/page.tsx
echo "🔐 Adding null safety checks for searchParams..."
if [ -f app/feedback/page.tsx ]; then
  sed -i.bak 's/const userId = searchParams.get/const userId = searchParams?.get/g' app/feedback/page.tsx
  sed -i.bak 's/const emailId = searchParams.get/const emailId = searchParams?.get/g' app/feedback/page.tsx
fi

# Fix src/app/layout.tsx font imports
echo "🔤 Fixing font imports in src/app/layout.tsx..."
if [ -f src/app/layout.tsx ]; then
  sed -i.bak 's/import { Geist, Geist_Mono } from "next\/font\/google";/import { Inter } from "next\/font\/google";/g' src/app/layout.tsx
  sed -i.bak 's/const geist = Geist/const geist = Inter/g' src/app/layout.tsx
  sed -i.bak 's/const geistMono = Geist_Mono/\/\/ const geistMono = Inter/g' src/app/layout.tsx
fi

# Restore tsconfig.json to strict mode
echo "⚙️ Restoring strict TypeScript checking..."
mv tsconfig.json.bak tsconfig.json

# Clean up backup files
echo "🧹 Cleaning up backup files..."
find . -name "*.bak" -type f -delete

echo "✅ Lint and TypeScript fixes applied! Run 'npm run lint' and 'npm run typecheck' to verify."
echo "Note: Some complex issues may still require manual fixes." 