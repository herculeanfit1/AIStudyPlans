# Security Scanning

This document outlines the security scanning processes used to ensure the SchedulEd codebase remains secure.

## Security Scan Results

Last scan performed: April 25, 2024

### Dependency Vulnerabilities

The following vulnerabilities were found in dependencies:

```
lodash.pick  >=4.0.0
Severity: high
Prototype Pollution in lodash - https://github.com/advisories/GHSA-p6mc-m468-83gw

next  9.5.5 - 14.2.24
Severity: critical
Next.js Server-Side Request Forgery in Server Actions - https://github.com/advisories/GHSA-fr5h-rqp8-mj6g
Next.js Cache Poisoning - https://github.com/advisories/GHSA-gp8f-8m3g-qvj9
Denial of Service condition in Next.js image optimization - https://github.com/advisories/GHSA-g77x-44xx-532m
Next.js authorization bypass vulnerability - https://github.com/advisories/GHSA-7gfc-8cq8-jh5f
Next.js Allows a Denial of Service (DoS) with Server Actions - https://github.com/advisories/GHSA-7m27-7ghc-44w9
Authorization Bypass in Next.js Middleware - https://github.com/advisories/GHSA-f82v-jwr5-mffw
```

### Remediation Plan

- [ ] Update Next.js to version 14.2.28 or later
- [ ] Review and replace lodash.pick in @react-three/drei dependency

## Secret Scanning

Code scanning tools were used to check for hardcoded secrets, API keys, tokens, and passwords. No sensitive credentials were found in the codebase.

### Secret Scanning Process

The repository is regularly scanned for secrets using the following methods:

1. **Automated scanning tools**:
   - `trufflehog` for detecting secrets in the codebase
   - GitHub's secret scanning feature for repositories

2. **Manual review processes**:
   - Code reviews that specifically look for credentials
   - Regular audits of all configuration files

3. **Prevention measures**:
   - Pre-commit hooks to prevent committing secrets
   - Developer education about secret management

## Recommended Security Tools

For ongoing security maintenance, we recommend:

### Dependency Scanning

```bash
# Regular dependency audits
npm audit

# Automated dependency updates
# Configure GitHub Dependabot in repository settings
```

### Secret Scanning

```bash
# Install trufflehog
npm install -g trufflehog

# Scan repository
trufflehog --regex --entropy=False .

# Check for keys in git history
git log -p | grep -i "key\|secret\|password\|token"
```

### Code Quality and Security

```bash
# ESLint security plugin
npm install eslint-plugin-security

# Run security linting
npx eslint --plugin security --rule 'security/detect-unsafe-regex: error' .
```

## Security Best Practices

1. **Never commit secrets** to the repository
2. **Use environment variables** for sensitive data
3. **Keep dependencies updated** with the latest security patches
4. **Follow the principle of least privilege** for all integrations
5. **Implement Content Security Policy (CSP)** headers
6. **Use HTTPS** for all connections
7. **Validate all user inputs** to prevent injection attacks

## Regular Maintenance

- Run `npm audit` weekly and after adding new dependencies
- Update dependencies at least monthly
- Perform full security scan quarterly
- Review security headers and configurations bi-annually 