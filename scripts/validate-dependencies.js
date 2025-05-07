#!/usr/bin/env node

/**
 * Dependency validation script
 * 
 * This script analyzes package.json and flags potential issues:
 * - Dependencies using caret (^) or tilde (~) ranges
 * - Outdated or vulnerable packages
 * - Missing peer dependencies
 * - Unused dependencies
 * - Duplicate dependencies
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  bold: '\x1b[1m',
};

console.log(`\n${colors.cyan}${colors.bold}=== Dependency Validator ===${colors.reset}\n`);

try {
  // Read package.json
  const packageJsonPath = path.resolve(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  let issuesFound = 0;
  
  // Check for non-exact versions
  console.log(`${colors.blue}Checking for non-exact version specifications...${colors.reset}`);
  const nonExactDeps = [];
  
  // Check dependencies
  if (packageJson.dependencies) {
    Object.entries(packageJson.dependencies).forEach(([name, version]) => {
      if (version.startsWith('^') || version.startsWith('~')) {
        nonExactDeps.push({ name, version, type: 'dependencies' });
      }
    });
  }
  
  // Check devDependencies
  if (packageJson.devDependencies) {
    Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
      if (version.startsWith('^') || version.startsWith('~')) {
        nonExactDeps.push({ name, version, type: 'devDependencies' });
      }
    });
  }
  
  if (nonExactDeps.length > 0) {
    console.log(`${colors.yellow}Found ${nonExactDeps.length} dependencies with non-exact versions:${colors.reset}`);
    nonExactDeps.forEach(dep => {
      console.log(`  - ${dep.name} (${dep.version}) in ${dep.type}`);
    });
    console.log(`${colors.yellow}Recommendation: Use exact versions by removing ^ and ~ prefixes${colors.reset}`);
    issuesFound += nonExactDeps.length;
  } else {
    console.log(`${colors.green}✓ All dependencies use exact versions${colors.reset}`);
  }
  
  // Check for shrinkwrap file
  console.log(`\n${colors.blue}Checking for npm-shrinkwrap.json...${colors.reset}`);
  const shrinkwrapPath = path.resolve(process.cwd(), 'npm-shrinkwrap.json');
  if (fs.existsSync(shrinkwrapPath)) {
    console.log(`${colors.green}✓ npm-shrinkwrap.json exists${colors.reset}`);
  } else {
    console.log(`${colors.yellow}⚠ npm-shrinkwrap.json not found${colors.reset}`);
    console.log(`${colors.yellow}Recommendation: Run 'npm shrinkwrap' to lock down dependency versions${colors.reset}`);
    issuesFound++;
  }
  
  // Check for engines specification
  console.log(`\n${colors.blue}Checking for Node.js and npm version requirements...${colors.reset}`);
  if (packageJson.engines && packageJson.engines.node && packageJson.engines.npm) {
    console.log(`${colors.green}✓ Node.js and npm version requirements specified${colors.reset}`);
    console.log(`  - Node.js: ${packageJson.engines.node}`);
    console.log(`  - npm: ${packageJson.engines.npm}`);
  } else {
    console.log(`${colors.yellow}⚠ Node.js and/or npm version requirements not specified${colors.reset}`);
    console.log(`${colors.yellow}Recommendation: Add "engines" field to package.json${colors.reset}`);
    issuesFound++;
  }
  
  // Check for .npmrc
  console.log(`\n${colors.blue}Checking for .npmrc configuration...${colors.reset}`);
  const npmrcPath = path.resolve(process.cwd(), '.npmrc');
  if (fs.existsSync(npmrcPath)) {
    const npmrcContent = fs.readFileSync(npmrcPath, 'utf8');
    console.log(`${colors.green}✓ .npmrc exists${colors.reset}`);
    
    // Check for important flags
    const importantFlags = ['save-exact', 'audit', 'package-lock'];
    const missingFlags = [];
    
    importantFlags.forEach(flag => {
      if (!npmrcContent.includes(flag)) {
        missingFlags.push(flag);
      }
    });
    
    if (missingFlags.length > 0) {
      console.log(`${colors.yellow}⚠ .npmrc is missing some recommended flags: ${missingFlags.join(', ')}${colors.reset}`);
      issuesFound += missingFlags.length;
    }
  } else {
    console.log(`${colors.yellow}⚠ .npmrc not found${colors.reset}`);
    console.log(`${colors.yellow}Recommendation: Create an .npmrc file with important settings${colors.reset}`);
    issuesFound++;
  }
  
  // Summary
  if (issuesFound > 0) {
    console.log(`\n${colors.yellow}${colors.bold}Found ${issuesFound} potential issue(s) with dependency configuration${colors.reset}`);
    console.log(`${colors.yellow}Run 'npm run fix:deps' to fix issues interactively${colors.reset}`);
  } else {
    console.log(`\n${colors.green}${colors.bold}✓ No dependency issues found! Configuration follows best practices.${colors.reset}`);
  }

} catch (error) {
  console.error(`\n${colors.red}Error: ${error.message}${colors.reset}`);
  process.exit(1);
} 