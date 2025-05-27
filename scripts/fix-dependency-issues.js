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

class DependencyIssueFixer {
  constructor() {
    this.projectRoot = process.cwd();
  }

  async fixIssues() {
    console.log(colors.blue('🔧 Dependency Issue Fixer'));
    console.log('='.repeat(50));
    
    try {
      const issues = await this.detectIssues();
      if (issues.length === 0) {
        console.log(colors.green('✅ No dependency issues detected!'));
        return;
      }
      
      console.log(colors.yellow(`Found ${issues.length} issue(s) to fix:`));
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. ${issue.description} (${issue.severity})`);
      });
      
      console.log(colors.blue('\n🔧 Applying automatic fixes...'));
      await this.applyFixes(issues);
      
    } catch (error) {
      console.error(colors.red('❌ Fix process failed:'), error.message);
    }
  }

  async detectIssues() {
    const issues = [];
    
    // Check for security vulnerabilities
    try {
      execSync('npm audit --json', { stdio: 'pipe' });
    } catch (error) {
      if (error.stdout) {
        const audit = JSON.parse(error.stdout);
        if (audit.metadata?.vulnerabilities?.total > 0) {
          issues.push({
            type: 'security',
            severity: 'high',
            description: `${audit.metadata.vulnerabilities.total} security vulnerabilities found`,
            fix: () => this.fixSecurityIssues()
          });
        }
      }
    }
    
    // Check for missing shrinkwrap
    if (!fs.existsSync(path.join(this.projectRoot, 'npm-shrinkwrap.json'))) {
      issues.push({
        type: 'missing-shrinkwrap',
        severity: 'medium',
        description: 'npm-shrinkwrap.json is missing',
        fix: () => this.generateShrinkwrap()
      });
    }
    
    // Check for node_modules issues
    if (!fs.existsSync(path.join(this.projectRoot, 'node_modules'))) {
      issues.push({
        type: 'missing-node-modules',
        severity: 'high',
        description: 'node_modules directory is missing',
        fix: () => this.installDependencies()
      });
    }
    
    return issues;
  }

  async applyFixes(issues) {
    for (const issue of issues) {
      console.log(colors.blue(`\n🔧 Fixing: ${issue.description}`));
      try {
        await issue.fix();
        console.log(colors.green(`✅ Fixed: ${issue.description}`));
      } catch (error) {
        console.error(colors.red(`❌ Failed to fix: ${issue.description}`), error.message);
      }
    }
    
    console.log(colors.green('\n🎉 All fixes applied! Run npm run lock:validate to verify.'));
  }

  async fixSecurityIssues() {
    console.log('Running npm audit fix...');
    try {
      execSync('npm audit fix', { stdio: 'inherit' });
    } catch (error) {
      console.log(colors.yellow('⚠️  Some vulnerabilities may require manual intervention'));
    }
  }

  async generateShrinkwrap() {
    console.log('Generating npm-shrinkwrap.json...');
    execSync('npm shrinkwrap', { stdio: 'inherit' });
  }

  async installDependencies() {
    console.log('Installing dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }
}

// Run fixer
if (require.main === module) {
  const fixer = new DependencyIssueFixer();
  fixer.fixIssues();
}

module.exports = DependencyIssueFixer; 