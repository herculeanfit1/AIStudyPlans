#!/usr/bin/env node

/**
 * Azure Application Insights Creation Script
 * 
 * This script helps create a new Application Insights resource in Azure
 * as part of the migration process from an existing Application Insights.
 * 
 * Prerequisites:
 * - Azure CLI installed and configured (az login)
 * - Proper permissions to create resources in the target resource group
 */

const { execSync } = require('child_process');
const readline = require('readline');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

// Configuration
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper to execute Azure CLI commands
function executeAzCommand(command) {
  try {
    const output = execSync(command, { encoding: 'utf8' });
    return output.trim();
  } catch (error) {
    console.error(`${colors.red}Error executing command: ${command}${colors.reset}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Helper to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

// Main function
async function main() {
  console.log(`\n${colors.blue}${colors.bold}=== Azure Application Insights Creation Tool ===${colors.reset}\n`);
  console.log(`${colors.cyan}This script will help you create a new Application Insights resource in Azure.${colors.reset}\n`);
  
  // Check if Azure CLI is installed
  try {
    const azVersion = execSync('az --version', { encoding: 'utf8' });
    console.log(`${colors.green}✓ Azure CLI is installed${colors.reset}`);
  } catch (error) {
    console.error(`${colors.red}✗ Azure CLI is not installed or not in PATH${colors.reset}`);
    console.log(`Please install Azure CLI from: https://docs.microsoft.com/en-us/cli/azure/install-azure-cli`);
    process.exit(1);
  }
  
  // Check if logged in to Azure
  try {
    const account = JSON.parse(execSync('az account show', { encoding: 'utf8' }));
    console.log(`${colors.green}✓ Logged in to Azure as: ${account.user.name}${colors.reset}`);
    console.log(`${colors.green}✓ Subscription: ${account.name}${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✗ Not logged in to Azure${colors.reset}`);
    console.log(`Please run 'az login' first.`);
    process.exit(1);
  }
  
  // Get available resource groups
  console.log(`${colors.blue}Fetching available resource groups...${colors.reset}`);
  const resourceGroups = JSON.parse(executeAzCommand('az group list --query "[].name" -o json'));
  
  console.log(`${colors.green}Available resource groups:${colors.reset}`);
  resourceGroups.forEach((group, index) => {
    console.log(`${index + 1}. ${group}`);
  });
  
  // Get user input for resource group
  const resourceGroupIndexStr = await askQuestion(`\n${colors.yellow}Enter the number of the target resource group: ${colors.reset}`);
  const resourceGroupIndex = parseInt(resourceGroupIndexStr, 10) - 1;
  
  if (isNaN(resourceGroupIndex) || resourceGroupIndex < 0 || resourceGroupIndex >= resourceGroups.length) {
    console.error(`${colors.red}Invalid selection. Please run the script again.${colors.reset}`);
    process.exit(1);
  }
  
  const resourceGroup = resourceGroups[resourceGroupIndex];
  console.log(`${colors.green}Selected resource group: ${resourceGroup}${colors.reset}`);
  
  // Get App Insights name
  const appInsightsName = await askQuestion(`\n${colors.yellow}Enter a name for the new Application Insights resource: ${colors.reset}`);
  
  if (!appInsightsName) {
    console.error(`${colors.red}Invalid name. Please run the script again.${colors.reset}`);
    process.exit(1);
  }
  
  // Get location
  console.log(`\n${colors.blue}Fetching available locations...${colors.reset}`);
  const locations = JSON.parse(executeAzCommand('az account list-locations --query "[].name" -o json'));
  
  console.log(`${colors.green}Common locations:${colors.reset}`);
  const commonLocations = ['eastus', 'westus', 'westus2', 'centralus', 'eastus2', 'westeurope', 'northeurope'];
  commonLocations.forEach((loc, index) => {
    console.log(`${index + 1}. ${loc}`);
  });
  
  console.log(`\n${colors.cyan}For full list of locations, enter 'full'${colors.reset}`);
  
  const locationInput = await askQuestion(`\n${colors.yellow}Enter location number or name: ${colors.reset}`);
  let location;
  
  if (locationInput.toLowerCase() === 'full') {
    console.log(`\n${colors.green}All available locations:${colors.reset}`);
    locations.forEach((loc, index) => {
      console.log(`${index + 1}. ${loc}`);
    });
    
    const fullLocationIndexStr = await askQuestion(`\n${colors.yellow}Enter the number of the location: ${colors.reset}`);
    const fullLocationIndex = parseInt(fullLocationIndexStr, 10) - 1;
    
    if (isNaN(fullLocationIndex) || fullLocationIndex < 0 || fullLocationIndex >= locations.length) {
      console.error(`${colors.red}Invalid selection. Please run the script again.${colors.reset}`);
      process.exit(1);
    }
    
    location = locations[fullLocationIndex];
  } else if (!isNaN(parseInt(locationInput, 10))) {
    const locationIndex = parseInt(locationInput, 10) - 1;
    
    if (locationIndex < 0 || locationIndex >= commonLocations.length) {
      console.error(`${colors.red}Invalid selection. Please run the script again.${colors.reset}`);
      process.exit(1);
    }
    
    location = commonLocations[locationIndex];
  } else {
    location = locationInput;
    
    if (!locations.includes(location)) {
      console.log(`${colors.yellow}Warning: '${location}' is not in the standard location list. Continuing anyway.${colors.reset}`);
    }
  }
  
  console.log(`${colors.green}Selected location: ${location}${colors.reset}`);
  
  // Create the Application Insights resource
  console.log(`\n${colors.blue}Creating Application Insights resource...${colors.reset}`);
  console.log(`Resource Group: ${resourceGroup}`);
  console.log(`Name: ${appInsightsName}`);
  console.log(`Location: ${location}`);
  
  const confirmCreate = await askQuestion(`\n${colors.yellow}Proceed with creation? (y/n): ${colors.reset}`);
  
  if (confirmCreate.toLowerCase() !== 'y') {
    console.log(`${colors.yellow}Operation cancelled by user.${colors.reset}`);
    process.exit(0);
  }
  
  try {
    console.log(`\n${colors.blue}Creating resource...${colors.reset}`);
    
    const createOutput = executeAzCommand(`az monitor app-insights component create --app ${appInsightsName} --location ${location} --resource-group ${resourceGroup} --application-type web`);
    
    console.log(`\n${colors.green}${colors.bold}✓ Application Insights created successfully!${colors.reset}`);
    
    // Get the connection string
    console.log(`\n${colors.blue}Retrieving connection string...${colors.reset}`);
    const connectionString = executeAzCommand(`az monitor app-insights component show --app ${appInsightsName} --resource-group ${resourceGroup} --query connectionString -o tsv`);
    
    console.log(`\n${colors.magenta}${colors.bold}Connection String:${colors.reset}`);
    console.log(connectionString);
    
    console.log(`\n${colors.yellow}Next steps:${colors.reset}`);
    console.log(`1. Use this connection string to update your application's configuration`);
    console.log(`2. Run the migration script: node scripts/migrate-app-insights.js OLD_CONNECTION_STRING "${connectionString}"`);
    console.log(`3. Test your application to ensure monitoring is working correctly`);
    console.log(`4. Once confirmed working, you can safely delete the old Application Insights resource`);
  } catch (error) {
    console.error(`\n${colors.red}${colors.bold}Error creating Application Insights resource:${colors.reset}`);
    console.error(error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
main().catch(error => {
  console.error(`\n${colors.red}${colors.bold}Unexpected error:${colors.reset}`);
  console.error(error);
  process.exit(1);
}); 