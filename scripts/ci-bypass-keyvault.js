#!/usr/bin/env node
/**
 * This script replaces Key Vault references in .env.production with placeholder values for CI builds
 * It's needed because GitHub Actions CI/CD can't resolve Key Vault references during static build
 */

const fs = require('fs');
const path = require('path');

// Path to the .env.production file
const envFilePath = path.join(process.cwd(), '.env.production');

// Check if the file exists
if (!fs.existsSync(envFilePath)) {
  console.error('❌ Error: .env.production file not found');
  process.exit(1);
}

// Read the current content
const content = fs.readFileSync(envFilePath, 'utf8');

// Replace Key Vault references with CI placeholders
const updatedContent = content
  // Replace Supabase URL with a valid URL for CI
  .replace(/@Microsoft\.KeyVault\(SecretUri=https:\/\/aistudyplansvault\.vault\.azure\.net\/secrets\/supabase-url\/\)/g, 'https://example-ci-placeholder.supabase.co')
  // Replace other secrets with placeholders
  .replace(/@Microsoft\.KeyVault\(SecretUri=https:\/\/aistudyplansvault\.vault\.azure\.net\/secrets\/[^/]+\/\)/g, 'ci-placeholder-value');

// Write the updated content back to the file
fs.writeFileSync(envFilePath, updatedContent);

console.log('✅ Successfully replaced Key Vault references with CI placeholders in .env.production');
console.log('This allows the CI build to complete without trying to resolve Key Vault references.'); 