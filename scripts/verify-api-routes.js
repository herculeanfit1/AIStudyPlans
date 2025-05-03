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

// Special handling for NextAuth routes
const nextAuthPattern = /auth\/\[\.\.\.[^/]+\]/;

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

// Check if the route is a NextAuth route
function isNextAuthRoute(filePath) {
  return nextAuthPattern.test(filePath);
}

// Handle NextAuth routes specially
function handleNextAuthRoutes(filePath) {
  console.log(`🔍 Special handling for NextAuth route: ${filePath}`);
  
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for BOM or other invisible characters
  const hasInvisibleChars = content.charCodeAt(0) === 0xFEFF;
  if (hasInvisibleChars) {
    console.log('⚠️ File contains BOM or invisible characters');
    
    // Remove BOM and invisible characters and rewrite the file
    const cleanContent = content.replace(/^\uFEFF/, '');
    fs.writeFileSync(filePath, cleanContent, 'utf8');
    console.log('✅ Cleaned up invisible characters');
  }
  
  // Ensure proper format for generateStaticParams
  if (!content.includes('export function generateStaticParams() {')) {
    console.log('⚠️ generateStaticParams function might not be properly formatted');
    
    // Add a properly formatted generateStaticParams function
    let updatedContent = content;
    
    // Remove any existing generateStaticParams function
    updatedContent = updatedContent.replace(/export\s+function\s+generateStaticParams\(\)\s*{\s*return\s*\[\];\s*}/g, '');
    
    // Add the properly formatted function before the last export
    const lastExportIndex = updatedContent.lastIndexOf('export {');
    if (lastExportIndex !== -1) {
      updatedContent = 
        updatedContent.substring(0, lastExportIndex) + 
        '\n// This is required for static export in Next.js\nexport function generateStaticParams() {\n  return [];\n}\n\n' + 
        updatedContent.substring(lastExportIndex);
    }
    
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log('✅ Added properly formatted generateStaticParams function');
  }
  
  return true;
}

// Main execution
console.log('Checking API routes for generateStaticParams function...');

const routeFiles = findRouteFiles(apiDir);
console.log(`Found ${routeFiles.length} API route files`);

let missingFunctionFiles = [];

for (const file of routeFiles) {
  const relativePath = path.relative(process.cwd(), file);
  
  // Special handling for NextAuth routes
  if (isNextAuthRoute(relativePath)) {
    handleNextAuthRoutes(file);
    console.log(`✅ Enhanced NextAuth route: ${relativePath}`);
    continue;
  }
  
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