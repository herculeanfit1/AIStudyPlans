#!/usr/bin/env node

/**
 * This script checks all API route files to ensure they have the required
 * generateStaticParams function needed for Next.js static export.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const apiDir = path.join(process.cwd(), 'app', 'api');
const routePattern = /route\.(js|ts)$/;
const requiredFunction = 'export function generateStaticParams';

// Utility function to find all route files recursively
function findRouteFiles(dir) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results = results.concat(findRouteFiles(filePath));
    } else if (routePattern.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Check if a file contains the required function
function hasRequiredFunction(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return content.includes(requiredFunction);
}

// Main execution
console.log('Checking API routes for generateStaticParams function...');

const routeFiles = findRouteFiles(apiDir);
console.log(`Found ${routeFiles.length} API route files`);

let missingFunctionFiles = [];

for (const file of routeFiles) {
  const relativePath = path.relative(process.cwd(), file);
  
  if (!hasRequiredFunction(file)) {
    missingFunctionFiles.push(relativePath);
    console.error(`❌ Missing generateStaticParams in: ${relativePath}`);
  } else {
    console.log(`✅ Found generateStaticParams in: ${relativePath}`);
  }
}

if (missingFunctionFiles.length > 0) {
  console.error('\n🛑 The following files are missing the generateStaticParams function:');
  missingFunctionFiles.forEach(file => console.error(`  - ${file}`));
  console.error('\nAll API routes must export a generateStaticParams function for static export compatibility.');
  process.exit(1);
} else {
  console.log('\n✅ All API routes have the required generateStaticParams function.');
} 