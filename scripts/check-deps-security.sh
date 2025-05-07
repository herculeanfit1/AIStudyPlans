#!/bin/bash

# Script to check dependencies for security issues

set -e

echo "=== SchedulEd Dependency Security Check ==="
echo "Running comprehensive checks on project dependencies..."

# Check for legacy-peer-deps in scripts
echo -e "\n📋 Checking for legacy-peer-deps in scripts..."
if grep -r --include="*.sh" --include="*.js" "legacy-peer-deps" .; then
  echo "⚠️ Warning: Found legacy-peer-deps in scripts. This can lead to security issues."
  echo "Consider refactoring these scripts to use proper dependency resolution."
else
  echo "✅ No legacy-peer-deps found in scripts"
fi

# Check package.json for vulnerabilities
echo -e "\n📋 Checking for direct dependency vulnerabilities..."
npm audit --audit-level=moderate || echo "⚠️ Some vulnerabilities detected. Review the output above."

# Verify auth dependencies
echo -e "\n📋 Checking authentication dependency compatibility..."
if grep -q "next-auth" package.json; then
  NEXT_AUTH_VERSION=$(node -e "try { console.log(require('./package.json').dependencies['next-auth'].replace('^', '').replace('~', '')) } catch(e) { console.log('unknown') }")
  AUTH_CORE_VERSION=$(node -e "try { console.log(require('./package.json').dependencies['@auth/core'].replace('^', '').replace('~', '')) } catch(e) { console.log('unknown') }")
  
  echo "Found next-auth@$NEXT_AUTH_VERSION and @auth/core@$AUTH_CORE_VERSION"
  
  if [[ "$NEXT_AUTH_VERSION" == *"4.24.11"* && "$AUTH_CORE_VERSION" != *"0.34.2"* ]]; then
    echo "❌ Error: Incompatible versions. next-auth@4.24.11 requires @auth/core@0.34.2"
    echo "Run ./scripts/fix-auth-deps.sh to fix this issue."
  else
    echo "✅ Auth dependencies appear to be compatible"
  fi
else
  echo "next-auth not found in dependencies"
fi

# Check for Zod (validation library)
echo -e "\n📋 Checking for validation library..."
if ! grep -q "zod" package.json; then
  echo "⚠️ Warning: Zod not found in dependencies. This is recommended for robust input validation."
  echo "Run 'npm install zod@3.22.4' to install it."
else
  echo "✅ Zod validation library found"
fi

# Check package-lock.json for consistency with package.json
echo -e "\n📋 Checking lockfile consistency..."
if [ -f package-lock.json ]; then
  if npm ls &>/dev/null; then
    echo "✅ package-lock.json is consistent with package.json"
  else
    echo "❌ package-lock.json is inconsistent with package.json"
    echo "Run 'npm ci' to reinstall dependencies properly."
  fi
else
  echo "⚠️ No package-lock.json found. Run 'npm install' to generate it."
fi

# Check .npmrc settings
echo -e "\n📋 Checking .npmrc settings..."
if [ -f .npmrc ]; then
  echo "Found .npmrc file with the following settings:"
  cat .npmrc
  
  # Check for recommended security settings
  missing_settings=""
  
  if ! grep -q "save-exact" .npmrc; then
    missing_settings+=" save-exact"
  fi
  
  if ! grep -q "ignore-scripts" .npmrc; then
    missing_settings+=" ignore-scripts"
  fi
  
  if [ -n "$missing_settings" ]; then
    echo "⚠️ Warning: Recommended security settings missing from .npmrc:$missing_settings"
  else
    echo "✅ .npmrc has recommended security settings"
  fi
else
  echo "⚠️ No .npmrc file found. Consider creating one with recommended security settings."
fi

echo -e "\n=== Security Check Complete ==="
echo "Review any warnings or errors above to improve dependency security." 