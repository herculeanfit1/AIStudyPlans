#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Simple color utility to avoid chalk ES module issues
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

class DependencyStatusChecker {
  constructor() {
    this.projectRoot = process.cwd();
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.statusFile = path.join(this.projectRoot, '.dependency-status.json');
  }

  async checkStatus() {
    console.log(colors.blue('📊 Checking Dependency Status...'));
    
    const status = {
      timestamp: new Date().toISOString(),
      totalDependencies: 0,
      outdatedCount: 0,
      vulnerabilityCount: 0,
      lockFileValid: false,
      lastUpdate: null,
      recommendations: []
    };

    try {
      await this.countDependencies(status);
      await this.checkOutdated(status);
      await this.checkVulnerabilities(status);
      await this.validateLocks(status);
      await this.generateRecommendations(status);
      
      this.saveStatus(status);
      this.displayStatus(status);
      
      return status;
    } catch (error) {
      console.error(colors.red('❌ Status check failed:'), error.message);
      return null;
    }
  }

  async countDependencies(status) {
    const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
    const deps = Object.keys(packageJson.dependencies || {});
    const devDeps = Object.keys(packageJson.devDependencies || {});
    status.totalDependencies = deps.length + devDeps.length;
  }

  async checkOutdated(status) {
    try {
      const result = execSync('npm outdated --json', { encoding: 'utf8', stdio: 'pipe' });
      const outdated = JSON.parse(result);
      status.outdatedCount = Object.keys(outdated).length;
      status.outdatedPackages = outdated;
    } catch (error) {
      // npm outdated returns exit code 1 when packages are outdated
      if (error.stdout) {
        try {
          const outdated = JSON.parse(error.stdout);
          status.outdatedCount = Object.keys(outdated).length;
          status.outdatedPackages = outdated;
        } catch (parseError) {
          status.outdatedCount = 0;
        }
      }
    }
  }

  async checkVulnerabilities(status) {
    try {
      const result = execSync('npm audit --json', { encoding: 'utf8', stdio: 'pipe' });
      const audit = JSON.parse(result);
      status.vulnerabilityCount = audit.metadata?.vulnerabilities?.total || 0;
      status.vulnerabilities = audit.vulnerabilities;
    } catch (error) {
      if (error.stdout) {
        try {
          const audit = JSON.parse(error.stdout);
          status.vulnerabilityCount = audit.metadata?.vulnerabilities?.total || 0;
          status.vulnerabilities = audit.vulnerabilities;
        } catch (parseError) {
          status.vulnerabilityCount = 0;
        }
      }
    }
  }

  async validateLocks(status) {
    try {
      const DependencyLockValidator = require('./validate-dependency-locks.js');
      const validator = new DependencyLockValidator();
      status.lockFileValid = await validator.validate();
    } catch (error) {
      console.log(colors.yellow('⚠️  Could not validate locks - validator not found'));
      status.lockFileValid = false;
    }
  }

  async generateRecommendations(status) {
    if (status.outdatedCount > 0) {
      status.recommendations.push(`Update ${status.outdatedCount} outdated packages`);
    }
    
    if (status.vulnerabilityCount > 0) {
      status.recommendations.push(`Fix ${status.vulnerabilityCount} security vulnerabilities`);
    }
    
    if (!status.lockFileValid) {
      status.recommendations.push('Fix dependency lock file issues');
    }
    
    if (status.recommendations.length === 0) {
      status.recommendations.push('All dependencies are up to date and secure! 🎉');
    }
  }

  saveStatus(status) {
    fs.writeFileSync(this.statusFile, JSON.stringify(status, null, 2));
  }

  displayStatus(status) {
    console.log('\n' + colors.blue('📊 DEPENDENCY STATUS REPORT'));
    console.log('='.repeat(50));
    
    console.log(`📦 Total Dependencies: ${colors.cyan(status.totalDependencies)}`);
    console.log(`📅 Last Checked: ${colors.gray(new Date(status.timestamp).toLocaleString())}`);
    
    if (status.outdatedCount > 0) {
      console.log(`⬆️  Outdated Packages: ${colors.yellow(status.outdatedCount)}`);
    } else {
      console.log(`⬆️  Outdated Packages: ${colors.green('0')}`);
    }
    
    if (status.vulnerabilityCount > 0) {
      console.log(`🔒 Security Issues: ${colors.red(status.vulnerabilityCount)}`);
    } else {
      console.log(`🔒 Security Issues: ${colors.green('0')}`);
    }
    
    console.log(`🔐 Lock File Valid: ${status.lockFileValid ? colors.green('Yes') : colors.red('No')}`);
    
    console.log('\n' + colors.blue('📋 Recommendations:'));
    status.recommendations.forEach(rec => {
      console.log(`  • ${rec}`);
    });
    
    console.log('\n' + colors.blue('🛠️  Available Commands:'));
    console.log('  • npm run lock:audit - Run security audit');
    console.log('  • npm run lock:update - Safe dependency updates');
    console.log('  • npm run lock:fix - Fix dependency issues');
    console.log('  • npm run lock:report - Generate detailed report');
  }
}

// Run status check
if (require.main === module) {
  const checker = new DependencyStatusChecker();
  checker.checkStatus();
}

module.exports = DependencyStatusChecker; 