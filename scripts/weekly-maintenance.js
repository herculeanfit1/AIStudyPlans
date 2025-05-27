#!/usr/bin/env node

// Simple color utility to avoid chalk ES module issues
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

const { execSync } = require('child_process');

async function weeklyMaintenance() {
  console.log(colors.blue('🗓️  Weekly Dependency Maintenance'));
  console.log('='.repeat(50));
  console.log(colors.gray('This should take about 5 minutes...'));
  
  const tasks = [
    { 
      name: 'Validate dependency locks', 
      command: 'npm run lock:validate',
      critical: true
    },
    { 
      name: 'Check dependency status', 
      command: 'npm run lock:check',
      critical: false
    },
    { 
      name: 'Run security audit', 
      command: 'npm run lock:audit',
      critical: false
    },
    { 
      name: 'Generate dependency report', 
      command: 'npm run lock:report',
      critical: false
    }
  ];
  
  let criticalFailures = 0;
  let warnings = 0;
  
  for (const task of tasks) {
    console.log(colors.blue(`\n📋 ${task.name}...`));
    try {
      execSync(task.command, { stdio: 'inherit' });
      console.log(colors.green(`✅ ${task.name} completed`));
    } catch (error) {
      if (task.critical) {
        console.log(colors.red(`❌ ${task.name} failed (critical)`));
        criticalFailures++;
      } else {
        console.log(colors.yellow(`⚠️  ${task.name} had issues (check output above)`));
        warnings++;
      }
    }
  }
  
  // Summary
  console.log('\n' + colors.blue('📊 WEEKLY MAINTENANCE SUMMARY'));
  console.log('='.repeat(50));
  
  if (criticalFailures === 0 && warnings === 0) {
    console.log(colors.green('🎉 All tasks completed successfully!'));
    console.log(colors.green('✅ Your dependencies are healthy and secure.'));
  } else {
    if (criticalFailures > 0) {
      console.log(colors.red(`❌ ${criticalFailures} critical issue(s) found`));
      console.log(colors.red('🚨 Immediate attention required!'));
    }
    
    if (warnings > 0) {
      console.log(colors.yellow(`⚠️  ${warnings} warning(s) found`));
      console.log(colors.yellow('📋 Review recommended when convenient'));
    }
  }
  
  console.log('\n' + colors.blue('📋 Next steps:'));
  console.log('  • Review the dependency report (dependency-report.md)');
  console.log('  • Address any security issues found');
  console.log('  • Consider updating outdated packages');
  console.log('  • Run this again next week: npm run maintenance:weekly');
  
  console.log('\n' + colors.blue('🛠️  Need help?'));
  console.log('  • npm run lock:fix - Auto-fix common issues');
  console.log('  • npm run lock:update - Safe dependency updates');
  console.log('  • Check docs/dependency-locking-implementation-guide.md');
  
  console.log(colors.gray('\n⏱️  Weekly maintenance completed!'));
}

// Run maintenance if called directly
if (require.main === module) {
  weeklyMaintenance().catch(error => {
    console.error(colors.red('❌ Weekly maintenance failed:'), error.message);
    process.exit(1);
  });
}

module.exports = weeklyMaintenance; 