#!/bin/bash
set -Eeuo pipefail
trap 'echo "❌ Validation failed at line $LINENO"' ERR

echo "🔍 Running pre-push validation..."

echo "📋 Step 1/4: Lint"
npm run lint

echo "📋 Step 2/4: Type check"
npm run typecheck

echo "📋 Step 3/4: Unit tests"
npm test

echo "📋 Step 4/4: Build"
npm run build

echo "✅ All checks passed — safe to push"
