#!/usr/bin/env node

/**
 * Azure Resource Deletion Script
 * 
 * This script helps delete Azure resources that may have deny assignments
 * by using proper Azure CLI commands with the right permissions.
 * 
 * Prerequisites:
 * - Azure CLI installed and configured (az login)
 * - Proper permissions to delete resources
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
    return null;
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

// Helper to remove deny assignments
async function removeDenyAssignments(resourceId) {
  console.log(`\n${colors.blue}Checking for deny assignments on resource...${colors.reset}`);
  
  try {
    // Get deny assignments
    const denyAssignments = JSON.parse(executeAzCommand(`az resourcelock list --scope ${resourceId} -o json`));
    
    if (denyAssignments && denyAssignments.length > 0) {
      console.log(`${colors.yellow}Found ${denyAssignments.length} locks/deny assignments.${colors.reset}`);
      
      for (const assignment of denyAssignments) {
        console.log(`${colors.yellow}Removing lock: ${assignment.name}${colors.reset}`);
        executeAzCommand(`az resourcelock delete --ids ${assignment.id} --yes`);
      }
      
      console.log(`${colors.green}✓ All locks removed successfully${colors.reset}`);
      return true;
    } else {
      console.log(`${colors.green}No resource locks found.${colors.reset}`);
      return true;
    }
  } catch (error) {
    console.error(`${colors.red}Error removing deny assignments: ${error.message}${colors.reset}`);
    return false;
  }
}

// Main function
async function main() {
  console.log(`\n${colors.blue}${colors.bold}=== Azure Resource Deletion Tool ===${colors.reset}\n`);
  console.log(`${colors.cyan}This script will help you delete Azure resources that may have deny assignments.${colors.reset}\n`);
  
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
  
  // Get resources with "aistudyplans" in the name
  console.log(`${colors.blue}Finding resources with 'aistudyplans' in the name...${colors.reset}`);
  const resources = JSON.parse(executeAzCommand('az resource list --query "[?contains(name, \'aistudyplans\')].{id:id, name:name, resourceGroup:resourceGroup, type:type}" -o json'));
  
  console.log(`${colors.green}Found ${resources.length} resources:${colors.reset}`);
  resources.forEach((resource, index) => {
    console.log(`${index + 1}. ${resource.name} (${resource.type}) - Resource Group: ${resource.resourceGroup}`);
  });
  
  // Get resource groups with "aistudyplans" in the name
  console.log(`\n${colors.blue}Finding resource groups with 'aistudyplans' in the name...${colors.reset}`);
  const resourceGroups = JSON.parse(executeAzCommand('az group list --query "[?contains(name, \'aistudyplans\')].{name:name}" -o json'));
  
  console.log(`${colors.green}Found ${resourceGroups.length} resource groups:${colors.reset}`);
  resourceGroups.forEach((group, index) => {
    console.log(`${String.fromCharCode(65 + index)}. ${group.name}`);
  });
  
  // Ask what to delete
  console.log(`\n${colors.yellow}${colors.bold}What would you like to delete?${colors.reset}`);
  console.log(`1. A specific resource (by number)`);
  console.log(`2. A resource group (by letter)`);
  
  const deleteChoice = await askQuestion(`\n${colors.yellow}Enter your choice (1 or 2): ${colors.reset}`);
  
  if (deleteChoice === '1') {
    // Delete specific resource
    const resourceIndexStr = await askQuestion(`\n${colors.yellow}Enter the number of the resource to delete: ${colors.reset}`);
    const resourceIndex = parseInt(resourceIndexStr, 10) - 1;
    
    if (isNaN(resourceIndex) || resourceIndex < 0 || resourceIndex >= resources.length) {
      console.error(`${colors.red}Invalid selection. Please run the script again.${colors.reset}`);
      process.exit(1);
    }
    
    const resource = resources[resourceIndex];
    console.log(`\n${colors.yellow}You selected: ${resource.name} (${resource.type})${colors.reset}`);
    
    const confirmDelete = await askQuestion(`${colors.red}${colors.bold}Are you sure you want to delete this resource? (yes/no): ${colors.reset}`);
    
    if (confirmDelete.toLowerCase() !== 'yes') {
      console.log(`${colors.green}Operation cancelled.${colors.reset}`);
      process.exit(0);
    }
    
    // Try to remove deny assignments first
    await removeDenyAssignments(resource.id);
    
    // Delete the resource
    console.log(`\n${colors.blue}Deleting resource...${colors.reset}`);
    const deleteResult = executeAzCommand(`az resource delete --ids ${resource.id} --verbose`);
    
    if (deleteResult !== null) {
      console.log(`\n${colors.green}${colors.bold}✓ Resource deleted successfully!${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}${colors.bold}Alternative approach: Try to move the resource first${colors.reset}`);
      console.log(`Run: az resource move --destination-group "AIStudyPlans-RG1" --ids ${resource.id}`);
    }
  } else if (deleteChoice === '2') {
    // Delete resource group
    const groupIndexStr = await askQuestion(`\n${colors.yellow}Enter the letter of the resource group to delete: ${colors.reset}`);
    const groupIndex = groupIndexStr.toUpperCase().charCodeAt(0) - 65;
    
    if (isNaN(groupIndex) || groupIndex < 0 || groupIndex >= resourceGroups.length) {
      console.error(`${colors.red}Invalid selection. Please run the script again.${colors.reset}`);
      process.exit(1);
    }
    
    const resourceGroup = resourceGroups[groupIndex];
    console.log(`\n${colors.yellow}You selected resource group: ${resourceGroup.name}${colors.reset}`);
    
    const confirmDelete = await askQuestion(`${colors.red}${colors.bold}Are you sure you want to delete this entire resource group? (yes/no): ${colors.reset}`);
    
    if (confirmDelete.toLowerCase() !== 'yes') {
      console.log(`${colors.green}Operation cancelled.${colors.reset}`);
      process.exit(0);
    }
    
    // Try to delete each resource in the group first
    console.log(`\n${colors.blue}Getting resources in the resource group...${colors.reset}`);
    const groupResources = JSON.parse(executeAzCommand(`az resource list --resource-group ${resourceGroup.name} -o json`));
    
    if (groupResources && groupResources.length > 0) {
      console.log(`${colors.yellow}Found ${groupResources.length} resources in the group.${colors.reset}`);
      
      // First try to remove deny assignments from each resource
      for (const resource of groupResources) {
        await removeDenyAssignments(resource.id);
      }
      
      console.log(`\n${colors.blue}Attempting to delete each resource individually first...${colors.reset}`);
      for (const resource of groupResources) {
        console.log(`${colors.yellow}Deleting: ${resource.name} (${resource.type})${colors.reset}`);
        executeAzCommand(`az resource delete --ids ${resource.id} --verbose`);
      }
    }
    
    // Now try to delete the resource group
    console.log(`\n${colors.blue}Deleting resource group...${colors.reset}`);
    const deleteResult = executeAzCommand(`az group delete --name ${resourceGroup.name} --yes --verbose`);
    
    if (deleteResult !== null) {
      console.log(`\n${colors.green}${colors.bold}✓ Resource group deleted successfully!${colors.reset}`);
    } else {
      console.log(`\n${colors.yellow}${colors.bold}Could not delete resource group automatically.${colors.reset}`);
      console.log(`You may need to delete individual resources manually or contact Azure support.`);
    }
  } else {
    console.error(`${colors.red}Invalid choice. Please run the script again.${colors.reset}`);
    process.exit(1);
  }
  
  rl.close();
}

// Run the script
main().catch(error => {
  console.error(`\n${colors.red}${colors.bold}Unexpected error:${colors.reset}`);
  console.error(error);
  process.exit(1);
}); 