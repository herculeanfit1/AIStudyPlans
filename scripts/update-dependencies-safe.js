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

class SafeDependencyUpdater {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupPath = path.join(this.projectRoot, '.dependency-backup');
  }

  async updateSafely() {
    console.log(colors.blue('🔄 Safe Dependency Updater'));
    console.log('='.repeat(50));
    
    try {
      await this.createBackup();
      const updates = await this.analyzeUpdates();
      
      if (updates.length === 0) {
        console.log(colors.green('✅ All dependencies are up to date!'));
        return;
      }
      
      await this.applyUpdates(updates);
      await this.validateUpdates();
      
    } catch (error) {
      console.error(colors.red('❌ Update failed:'), error.message);
      await this.restoreBackup();
    }
  }

  async createBackup() {
    console.log(colors.blue('📦 Creating backup...'));
    
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true });
    }
    
    // Backup package files
    const filesToBackup = ['package.json', 'npm-shrinkwrap.json', 'package-lock.json'];
    filesToBackup.forEach(file => {
      const sourcePath = path.join(this.projectRoot, file);
      if (fs.existsSync(sourcePath)) {
        const backupFile = path.join(this.backupPath, `${file}.backup`);
        fs.copyFileSync(sourcePath, backupFile);
      }
    });
    
    console.log(colors.green('✅ Backup created'));
  }

  async analyzeUpdates() {
    console.log(colors.blue('🔍 Analyzing available updates...'));
    
    try {
      execSync('npm outdated --json', { stdio: 'pipe' });
      return []; // No outdated packages
    } catch (error) {
      if (error.stdout) {
        const outdated = JSON.parse(error.stdout);
        return Object.entries(outdated).map(([name, info]) => ({
          name,
          current: info.current,
          wanted: info.wanted,
          latest: info.latest,
          type: this.categorizeUpdate(info.current, info.wanted, info.latest)
        }));
      }
      return [];
    }
  }

  categorizeUpdate(current, wanted, latest) {
    const currentParts = current.split('.').map(Number);
    const wantedParts = wanted.split('.').map(Number);
    
    if (currentParts[0] !== wantedParts[0]) return 'major';
    if (currentParts[1] !== wantedParts[1]) return 'minor';
    return 'patch';
  }

  async applyUpdates(updates) {
    const safeUpdates = updates.filter(update => update.type === 'patch');
    const minorUpdates = updates.filter(update => update.type === 'minor');
    const majorUpdates = updates.filter(update => update.type === 'major');
    
    // Apply patch updates automatically
    if (safeUpdates.length > 0) {
      console.log(colors.green(`🔧 Applying ${safeUpdates.length} patch updates...`));
      safeUpdates.forEach(update => {
        console.log(`  • ${update.name}: ${update.current} → ${update.wanted}`);
      });
      execSync('npm update', { stdio: 'inherit' });
    }
    
    // Warn about minor/major updates
    if (minorUpdates.length > 0) {
      console.log(colors.yellow(`⚠️  ${minorUpdates.length} minor updates available (manual review recommended):`));
      minorUpdates.forEach(update => {
        console.log(`  • ${update.name}: ${update.current} → ${update.wanted}`);
      });
    }
    
    if (majorUpdates.length > 0) {
      console.log(colors.red(`🚨 ${majorUpdates.length} major updates available (breaking changes possible):`));
      majorUpdates.forEach(update => {
        console.log(`  • ${update.name}: ${update.current} → ${update.latest}`);
      });
    }
  }

  async validateUpdates() {
    console.log(colors.blue('✅ Validating updates...'));
    
    // Run basic validation
    try {
      execSync('npm run lock:validate', { stdio: 'inherit' });
      console.log(colors.green('✅ Lock validation passed'));
    } catch (error) {
      throw new Error('Lock validation failed after update');
    }
    
    // Update shrinkwrap
    try {
      execSync('npm shrinkwrap', { stdio: 'inherit' });
      console.log(colors.green('✅ Shrinkwrap updated'));
    } catch (error) {
      console.log(colors.yellow('⚠️  Could not update shrinkwrap'));
    }
  }

  async restoreBackup() {
    console.log(colors.yellow('🔄 Restoring from backup...'));
    
    const filesToRestore = ['package.json', 'npm-shrinkwrap.json', 'package-lock.json'];
    filesToRestore.forEach(file => {
      const backupFile = path.join(this.backupPath, `${file}.backup`);
      const targetPath = path.join(this.projectRoot, file);
      
      if (fs.existsSync(backupFile)) {
        fs.copyFileSync(backupFile, targetPath);
      }
    });
    
    // Reinstall from backup
    try {
      execSync('npm ci', { stdio: 'inherit' });
      console.log(colors.green('✅ Backup restored'));
    } catch (error) {
      console.log(colors.red('❌ Could not restore backup - manual intervention required'));
    }
  }
}

// Run updater
if (require.main === module) {
  const updater = new SafeDependencyUpdater();
  updater.updateSafely();
}

module.exports = SafeDependencyUpdater; 