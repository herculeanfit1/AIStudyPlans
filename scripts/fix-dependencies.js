#!/usr/bin/env node

/**
 * Dependency fixing script
 * 
 * This script helps developers resolve common dependency issues by providing
 * an interactive menu of common dependency-related problems and fixes.
 */

const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function executeCommand(command, description) {
  console.log(`\n${colors.blue}${description}${colors.reset}`);
  console.log(`${colors.yellow}Running: ${command}${colors.reset}\n`);
  
  try {
    execSync(command, { stdio: 'inherit' });
    console.log(`\n${colors.green}Command completed successfully${colors.reset}`);
    return true;
  } catch (error) {
    console.error(`\n${colors.red}Command failed with error: ${error.message}${colors.reset}`);
    return false;
  }
}

function showMenu() {
  console.log(`\n${colors.cyan}${colors.bold}=== Dependency Troubleshooting Menu ===${colors.reset}\n`);
  console.log(`${colors.white}Choose an option:${colors.reset}`);
  console.log(`${colors.green}1.${colors.reset} Fix security vulnerabilities (npm audit fix)`);
  console.log(`${colors.green}2.${colors.reset} Check for outdated dependencies`);
  console.log(`${colors.green}3.${colors.reset} Remove duplicate dependencies (dedupe)`);
  console.log(`${colors.green}4.${colors.reset} Generate npm-shrinkwrap.json file for exact version locking`);
  console.log(`${colors.green}5.${colors.reset} Clear dependency cache`);
  console.log(`${colors.green}6.${colors.reset} Clean reinstall (remove node_modules & reinstall)`);
  console.log(`${colors.green}7.${colors.reset} Fix peer dependency issues`);
  console.log(`${colors.green}8.${colors.reset} Run all dependency health checks`);
  console.log(`${colors.green}9.${colors.reset} Update a single package`);
  console.log(`${colors.red}0.${colors.reset} Exit\n`);
  
  rl.question(`${colors.yellow}Enter your choice: ${colors.reset}`, (choice) => {
    handleChoice(choice);
  });
}

function handleChoice(choice) {
  switch (choice) {
    case '1':
      executeCommand('npm audit fix', 'Fixing security vulnerabilities');
      askToContinue();
      break;
    case '2':
      executeCommand('npx npm-check-updates', 'Checking for outdated dependencies');
      askToContinue();
      break;
    case '3':
      executeCommand('npm dedupe', 'Removing duplicate dependencies');
      askToContinue();
      break;
    case '4':
      executeCommand('npm shrinkwrap', 'Generating npm-shrinkwrap.json file');
      askToContinue();
      break;
    case '5':
      executeCommand('npm cache clean --force', 'Clearing npm cache');
      askToContinue();
      break;
    case '6':
      executeCommand('rm -rf node_modules package-lock.json && npm install', 'Performing clean reinstall');
      askToContinue();
      break;
    case '7':
      executeCommand('npx install-peerdeps --dev', 'Fixing peer dependency issues');
      askToContinue();
      break;
    case '8':
      console.log(`\n${colors.blue}Running all dependency health checks...${colors.reset}`);
      executeCommand('npm ls --prod', 'Verifying production dependencies');
      executeCommand('npm audit', 'Checking for security vulnerabilities');
      executeCommand('npm dedupe --dry-run', 'Checking for duplicate dependencies');
      executeCommand('npx npm-check-updates', 'Checking for outdated dependencies');
      askToContinue();
      break;
    case '9':
      rl.question(`\n${colors.yellow}Enter package name to update: ${colors.reset}`, (packageName) => {
        if (packageName.trim()) {
          executeCommand(`npm update ${packageName}`, `Updating package: ${packageName}`);
        } else {
          console.log(`${colors.red}No package name provided${colors.reset}`);
        }
        askToContinue();
      });
      return;
    case '0':
      console.log(`\n${colors.green}Exiting dependency fixer. Goodbye!${colors.reset}`);
      rl.close();
      break;
    default:
      console.log(`\n${colors.red}Invalid choice. Please try again.${colors.reset}`);
      askToContinue();
      break;
  }
}

function askToContinue() {
  rl.question(`\n${colors.yellow}Do you want to continue? (Y/n): ${colors.reset}`, (answer) => {
    if (answer.toLowerCase() === 'n') {
      console.log(`\n${colors.green}Exiting dependency fixer. Goodbye!${colors.reset}`);
      rl.close();
    } else {
      showMenu();
    }
  });
}

// Display welcome message
console.log(`\n${colors.bold}${colors.magenta}=== AIStudyPlans Dependency Fixer ===${colors.reset}`);
console.log(`${colors.cyan}This tool helps resolve common dependency issues.${colors.reset}`);

// Start the menu
showMenu();

// Handle exit
rl.on('close', () => {
  process.exit(0);
}); 