#!/usr/bin/env node

/**
 * Migration script for Application Insights
 * 
 * This script updates the connection strings in all necessary files 
 * when migrating from one Application Insights resource to another.
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
  bold: '\x1b[1m',
};

// Get the old and new connection strings from command line arguments
const oldConnectionString = process.argv[2];
const newConnectionString = process.argv[3];

if (!oldConnectionString || !newConnectionString) {
  console.log(`${colors.red}${colors.bold}Error: Missing connection strings${colors.reset}`);
  console.log(`Usage: node migrate-app-insights.js OLD_CONNECTION_STRING NEW_CONNECTION_STRING`);
  process.exit(1);
}

console.log(`${colors.blue}${colors.bold}=== Application Insights Migration Tool ===${colors.reset}\n`);
console.log(`${colors.yellow}This script will update all references to the Application Insights connection string.${colors.reset}`);
console.log(`${colors.yellow}From: ${oldConnectionString.substring(0, 20)}...${colors.reset}`);
console.log(`${colors.yellow}To:   ${newConnectionString.substring(0, 20)}...${colors.reset}\n`);

// Files to update
const FILES_TO_UPDATE = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  'next.config.js',
];

// Backup all files before modifying them
function backupFiles() {
  const backupDir = path.join(process.cwd(), 'backup-app-insights');
  
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir);
  }
  
  FILES_TO_UPDATE.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      const backupPath = path.join(backupDir, file);
      fs.copyFileSync(filePath, backupPath);
      console.log(`${colors.green}✓ Backed up ${file}${colors.reset}`);
    }
  });
}

// Update the connection string in all files
function updateFiles() {
  let updatedFiles = 0;
  
  FILES_TO_UPDATE.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Skip if the file doesn't contain the old connection string
      if (!content.includes(oldConnectionString)) {
        return;
      }
      
      // Replace all occurrences
      content = content.replace(new RegExp(oldConnectionString, 'g'), newConnectionString);
      
      // Write the updated content back
      fs.writeFileSync(filePath, content);
      console.log(`${colors.green}✓ Updated ${file}${colors.reset}`);
      updatedFiles++;
    }
  });
  
  return updatedFiles;
}

// Main execution
try {
  console.log(`${colors.blue}Backing up files...${colors.reset}`);
  backupFiles();
  
  console.log(`\n${colors.blue}Updating connection strings...${colors.reset}`);
  const updatedFiles = updateFiles();
  
  if (updatedFiles > 0) {
    console.log(`\n${colors.green}${colors.bold}✓ Successfully updated ${updatedFiles} files${colors.reset}`);
    console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
    console.log(`1. Restart your development server (npm run dev)`);
    console.log(`2. Update your deployment workflows with the new connection string`);
    console.log(`3. Check your application to ensure monitoring is working properly`);
  } else {
    console.log(`\n${colors.yellow}No files were updated. The old connection string was not found in any of the target files.${colors.reset}`);
  }
} catch (error) {
  console.error(`\n${colors.red}${colors.bold}Error: ${error.message}${colors.reset}`);
  process.exit(1);
} 