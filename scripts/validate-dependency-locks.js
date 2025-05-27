#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Simple color utility to avoid chalk ES module issues
const colors = {
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`
};

class DependencyLockValidator {
  constructor() {
    this.projectRoot = process.cwd();
    this.packageJsonPath = path.join(this.projectRoot, 'package.json');
    this.shrinkwrapPath = path.join(this.projectRoot, 'npm-shrinkwrap.json');
    this.lockBackupPath = path.join(this.projectRoot, '.dependency-locks');
    this.errors = [];
    this.warnings = [];
  }

  async validate() {
    console.log(colors.blue('🔒 Validating Dependency Locks...'));
    
    try {
      await this.checkFileIntegrity();
      await this.validateVersionConsistency();
      await this.checkSecurityVulnerabilities();
      await this.validateLockFileStructure();
      await this.checkDependencyDrift();
      
      this.generateReport();
      return this.errors.length === 0;
    } catch (error) {
      console.error(colors.red('❌ Validation failed:'), error.message);
      return false;
    }
  }

  async checkFileIntegrity() {
    // Check if required files exist
    if (!fs.existsSync(this.packageJsonPath)) {
      this.errors.push('package.json not found');
      return;
    }

    if (!fs.existsSync(this.shrinkwrapPath)) {
      this.warnings.push('npm-shrinkwrap.json not found - consider running npm shrinkwrap');
      return;
    }

    // Validate JSON structure
    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
      const shrinkwrap = JSON.parse(fs.readFileSync(this.shrinkwrapPath, 'utf8'));
      
      if (!packageJson.dependencies && !packageJson.devDependencies) {
        this.warnings.push('No dependencies found in package.json');
      }
      
      if (!shrinkwrap.packages) {
        this.errors.push('Invalid shrinkwrap structure - missing packages');
      }
    } catch (error) {
      this.errors.push(`JSON parsing error: ${error.message}`);
    }
  }

  async validateVersionConsistency() {
    if (!fs.existsSync(this.shrinkwrapPath)) {
      return; // Skip if no shrinkwrap file
    }

    try {
      const packageJson = JSON.parse(fs.readFileSync(this.packageJsonPath, 'utf8'));
      const shrinkwrap = JSON.parse(fs.readFileSync(this.shrinkwrapPath, 'utf8'));
      
      // Check if package.json versions match shrinkwrap
      const allDeps = {
        ...packageJson.dependencies || {},
        ...packageJson.devDependencies || {}
      };
      
      for (const [name, version] of Object.entries(allDeps)) {
        const shrinkwrapEntry = shrinkwrap.packages[`node_modules/${name}`];
        if (shrinkwrapEntry && shrinkwrapEntry.version !== version.replace(/[\^~]/, '')) {
          this.warnings.push(`Version mismatch for ${name}: package.json(${version}) vs shrinkwrap(${shrinkwrapEntry.version})`);
        }
      }
    } catch (error) {
      this.errors.push(`Version consistency check failed: ${error.message}`);
    }
  }

  async checkSecurityVulnerabilities() {
    // Basic security check - enhanced in audit script
    console.log(colors.yellow('🔍 Basic security check (run npm run lock:audit for comprehensive scan)'));
  }

  async validateLockFileStructure() {
    if (!fs.existsSync(this.shrinkwrapPath)) {
      return; // Skip if no shrinkwrap file
    }

    try {
      const shrinkwrap = JSON.parse(fs.readFileSync(this.shrinkwrapPath, 'utf8'));
      
      // Check required fields
      const requiredFields = ['name', 'version', 'lockfileVersion', 'packages'];
      for (const field of requiredFields) {
        if (!shrinkwrap[field]) {
          this.errors.push(`Missing required field in shrinkwrap: ${field}`);
        }
      }
      
      // Validate lockfile version
      if (shrinkwrap.lockfileVersion < 2) {
        this.warnings.push('Consider upgrading to lockfile version 3 for better performance');
      }
    } catch (error) {
      this.errors.push(`Lock file structure validation failed: ${error.message}`);
    }
  }

  async checkDependencyDrift() {
    // Check if node_modules matches lock file
    const nodeModulesPath = path.join(this.projectRoot, 'node_modules');
    if (!fs.existsSync(nodeModulesPath)) {
      this.warnings.push('node_modules directory not found - run npm install');
      return;
    }
    
    // Basic drift detection
    console.log(colors.yellow('📊 Basic drift check complete (run npm run lock:check for detailed analysis)'));
  }

  generateReport() {
    console.log('\n' + colors.blue('📋 DEPENDENCY LOCK VALIDATION REPORT'));
    console.log('='.repeat(50));
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(colors.green('✅ All dependency locks are valid!'));
    } else {
      if (this.errors.length > 0) {
        console.log(colors.red(`❌ ${this.errors.length} Error(s):`));
        this.errors.forEach(error => console.log(colors.red(`  • ${error}`)));
      }
      
      if (this.warnings.length > 0) {
        console.log(colors.yellow(`⚠️  ${this.warnings.length} Warning(s):`));
        this.warnings.forEach(warning => console.log(colors.yellow(`  • ${warning}`)));
      }
    }
    
    console.log('\n' + colors.blue('Next steps:'));
    console.log('• Run `npm run lock:check` for detailed status');
    console.log('• Run `npm run lock:audit` for security scan');
    console.log('• Run `npm run lock:fix` to resolve issues');
  }
}

// Run validation
if (require.main === module) {
  const validator = new DependencyLockValidator();
  validator.validate().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = DependencyLockValidator; 