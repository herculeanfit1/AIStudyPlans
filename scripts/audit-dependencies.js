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

class SecurityAuditor {
  constructor() {
    this.projectRoot = process.cwd();
    this.auditReportPath = path.join(this.projectRoot, '.security-audit.json');
  }

  async runAudit() {
    console.log(colors.blue('🔒 Running Security Audit...'));
    
    const auditResult = {
      timestamp: new Date().toISOString(),
      npmAudit: null,
      customChecks: [],
      recommendations: [],
      riskLevel: 'low'
    };

    try {
      await this.runNpmAudit(auditResult);
      await this.runCustomSecurityChecks(auditResult);
      await this.assessRiskLevel(auditResult);
      await this.generateRecommendations(auditResult);
      
      this.saveAuditReport(auditResult);
      this.displayAuditResults(auditResult);
      
      return auditResult;
    } catch (error) {
      console.error(colors.red('❌ Security audit failed:'), error.message);
      return null;
    }
  }

  async runNpmAudit(auditResult) {
    try {
      const result = execSync('npm audit --json', { encoding: 'utf8', stdio: 'pipe' });
      auditResult.npmAudit = JSON.parse(result);
    } catch (error) {
      if (error.stdout) {
        try {
          auditResult.npmAudit = JSON.parse(error.stdout);
        } catch (parseError) {
          console.warn(colors.yellow('⚠️  Could not parse npm audit output'));
        }
      }
    }
  }

  async runCustomSecurityChecks(auditResult) {
    // Check for known problematic packages
    const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
    const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    const problematicPackages = [
      'event-stream', 'flatmap-stream', 'ps-tree', 'getcookies'
    ];
    
    for (const pkg of problematicPackages) {
      if (allDeps[pkg]) {
        auditResult.customChecks.push({
          type: 'problematic-package',
          package: pkg,
          severity: 'high',
          message: `Package ${pkg} has known security issues`
        });
      }
    }
    
    // Check for outdated Node.js version requirements
    if (packageJson.engines?.node) {
      const nodeVersion = packageJson.engines.node;
      if (nodeVersion.includes('14') || nodeVersion.includes('16')) {
        auditResult.customChecks.push({
          type: 'outdated-node',
          severity: 'medium',
          message: 'Consider updating Node.js version requirement'
        });
      }
    }
    
    // Check for missing security-related scripts
    const securityScripts = ['audit', 'audit:fix'];
    const missingScripts = securityScripts.filter(script => !packageJson.scripts?.[script]);
    if (missingScripts.length > 0) {
      auditResult.customChecks.push({
        type: 'missing-security-scripts',
        severity: 'low',
        message: `Missing security scripts: ${missingScripts.join(', ')}`
      });
    }

    // Check for exact versioning compliance
    const nonExactVersions = [];
    Object.entries(allDeps).forEach(([name, version]) => {
      if (version.startsWith('^') || version.startsWith('~')) {
        nonExactVersions.push(name);
      }
    });
    
    if (nonExactVersions.length > 0) {
      auditResult.customChecks.push({
        type: 'non-exact-versions',
        severity: 'medium',
        message: `${nonExactVersions.length} packages use non-exact versions: ${nonExactVersions.slice(0, 3).join(', ')}${nonExactVersions.length > 3 ? '...' : ''}`
      });
    }
  }

  async assessRiskLevel(auditResult) {
    let riskScore = 0;
    
    if (auditResult.npmAudit?.metadata?.vulnerabilities) {
      const vulns = auditResult.npmAudit.metadata.vulnerabilities;
      riskScore += (vulns.critical || 0) * 10;
      riskScore += (vulns.high || 0) * 5;
      riskScore += (vulns.moderate || 0) * 2;
      riskScore += (vulns.low || 0) * 1;
    }
    
    // Add custom check scores
    auditResult.customChecks.forEach(check => {
      switch (check.severity) {
        case 'high': riskScore += 5; break;
        case 'medium': riskScore += 2; break;
        case 'low': riskScore += 1; break;
      }
    });
    
    if (riskScore === 0) auditResult.riskLevel = 'low';
    else if (riskScore <= 5) auditResult.riskLevel = 'medium';
    else auditResult.riskLevel = 'high';
  }

  async generateRecommendations(auditResult) {
    if (auditResult.npmAudit?.metadata?.vulnerabilities?.total > 0) {
      auditResult.recommendations.push('Run `npm audit fix` to automatically fix vulnerabilities');
      auditResult.recommendations.push('Review and manually fix remaining vulnerabilities');
    }
    
    auditResult.customChecks.forEach(check => {
      switch (check.type) {
        case 'problematic-package':
          auditResult.recommendations.push(`Remove or replace ${check.package}`);
          break;
        case 'outdated-node':
          auditResult.recommendations.push('Update Node.js version requirement to latest LTS');
          break;
        case 'missing-security-scripts':
          auditResult.recommendations.push('Add missing security-related npm scripts');
          break;
        case 'non-exact-versions':
          auditResult.recommendations.push('Consider using exact versions for better security');
          break;
      }
    });
    
    if (auditResult.recommendations.length === 0) {
      auditResult.recommendations.push('No security issues found! Keep up the good work! 🎉');
    }
  }

  saveAuditReport(auditResult) {
    fs.writeFileSync(this.auditReportPath, JSON.stringify(auditResult, null, 2));
  }

  displayAuditResults(auditResult) {
    console.log('\n' + colors.blue('🔒 SECURITY AUDIT REPORT'));
    console.log('='.repeat(50));
    
    const riskColor = auditResult.riskLevel === 'high' ? 'red' : 
                     auditResult.riskLevel === 'medium' ? 'yellow' : 'green';
    console.log(`🎯 Risk Level: ${colors[riskColor](auditResult.riskLevel.toUpperCase())}`);
    
    if (auditResult.npmAudit?.metadata?.vulnerabilities) {
      const vulns = auditResult.npmAudit.metadata.vulnerabilities;
      console.log(`🔍 NPM Vulnerabilities: ${vulns.total || 0}`);
      if (vulns.critical) console.log(`  • Critical: ${colors.red(vulns.critical)}`);
      if (vulns.high) console.log(`  • High: ${colors.red(vulns.high)}`);
      if (vulns.moderate) console.log(`  • Moderate: ${colors.yellow(vulns.moderate)}`);
      if (vulns.low) console.log(`  • Low: ${colors.gray(vulns.low)}`);
    }
    
    if (auditResult.customChecks.length > 0) {
      console.log(`🔧 Custom Security Checks: ${auditResult.customChecks.length} issues found`);
      auditResult.customChecks.forEach(check => {
        const color = check.severity === 'high' ? 'red' : check.severity === 'medium' ? 'yellow' : 'gray';
        console.log(`  • ${colors[color](check.message)}`);
      });
    }
    
    console.log('\n' + colors.blue('📋 Recommendations:'));
    auditResult.recommendations.forEach(rec => {
      console.log(`  • ${rec}`);
    });
    
    console.log(`\n📅 Report saved to: ${colors.gray(this.auditReportPath)}`);
  }
}

// Run security audit
if (require.main === module) {
  const auditor = new SecurityAuditor();
  auditor.runAudit();
}

module.exports = SecurityAuditor; 