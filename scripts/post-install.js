#!/usr/bin/env node

/**
 * Post-install script for dependency health and security checks
 * 
 * This script performs various checks after dependencies are installed:
 * - Verifies all dependencies match expected versions
 * - Runs security audits
 * - Identifies potentially unsafe packages
 * - Ensures consistent lockfile
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

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
};

console.log(`${colors.cyan}=== Running post-install dependency checks ===${colors.reset}`);

// Check if we should skip in CI environments
if (process.env.CI === 'true') {
  console.log(`${colors.yellow}Detected CI environment, skipping interactive checks${colors.reset}`);
  process.exit(0);
}

try {
  // Verify package-lock.json integrity
  console.log(`${colors.blue}Verifying package-lock.json integrity...${colors.reset}`);
  
  if (fs.existsSync(path.resolve(process.cwd(), 'package-lock.json'))) {
    try {
      execSync('npm ls --prod', { stdio: 'ignore' });
      console.log(`${colors.green}✓ Production dependencies verified${colors.reset}`);
    } catch (error) {
      console.warn(`${colors.yellow}⚠ Production dependency tree has issues${colors.reset}`);
    }
  } else {
    console.warn(`${colors.yellow}⚠ No package-lock.json found${colors.reset}`);
  }

  // Run npm audit (but don't fail on issues)
  console.log(`${colors.blue}Running security audit...${colors.reset}`);
  try {
    execSync('npm audit --omit=dev', { stdio: 'pipe' });
    console.log(`${colors.green}✓ No security vulnerabilities found in production dependencies${colors.reset}`);
  } catch (error) {
    console.warn(`${colors.yellow}⚠ Security vulnerabilities found in dependencies${colors.reset}`);
    console.warn(`${colors.yellow}  Run 'npm audit' for details and 'npm audit fix' to attempt fixing${colors.reset}`);
  }

  // Detect duplicate dependencies
  console.log(`${colors.blue}Checking for duplicate dependencies...${colors.reset}`);
  try {
    const dedupe = execSync('npm dedupe --dry-run', { encoding: 'utf8' });
    if (dedupe.includes('up to date')) {
      console.log(`${colors.green}✓ No duplicate dependencies found${colors.reset}`);
    } else {
      console.warn(`${colors.yellow}⚠ Duplicate dependencies found${colors.reset}`);
      console.warn(`${colors.yellow}  Run 'npm dedupe' to fix${colors.reset}`);
    }
  } catch (error) {
    console.warn(`${colors.yellow}⚠ Could not check for duplicates${colors.reset}`);
  }

  console.log(`${colors.cyan}=== Dependency checks completed ===${colors.reset}`);
  
  // Add helpful next steps
  console.log(`
${colors.white}Helpful commands:${colors.reset}
  ${colors.green}npm run audit:fix${colors.reset} - Fix security vulnerabilities
  ${colors.green}npm run dependencies:check${colors.reset} - Check for outdated dependencies
  ${colors.green}npm run dependencies:update${colors.reset} - Update all dependencies
`);

} catch (error) {
  console.error(`${colors.red}Error during post-install checks: ${error.message}${colors.reset}`);
  // Non-zero exit would break npm install, so we just warn
  process.exit(0);
} 