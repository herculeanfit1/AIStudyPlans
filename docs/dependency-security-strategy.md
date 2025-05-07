# Dependency Security Strategy

This document outlines our comprehensive approach to dependency management and security within the SchedulEd (AIStudyPlans) project.

## Core Principles

1. **No Legacy Peer Dependency Bypasses**: We do not use `--legacy-peer-deps` flag as it circumvents npm's dependency resolution system and may lead to subtle incompatibilities.
2. **Version Pinning**: We use exact versions (`save-prefix=""` in .npmrc) to ensure consistent builds.
3. **Comprehensive Lockfiles**: We commit package-lock.json to ensure all developers and CI systems use identical dependency trees.
4. **Security Scanning**: We regularly audit dependencies for vulnerabilities.

## Authentication Dependencies

Our application uses NextAuth.js which has a peer dependency on specific versions of @auth/core. To maintain proper compatibility:

- Use next-auth@4.24.11 with @auth/core@0.34.2
- Do not upgrade one without the other
- Use the `scripts/fix-auth-deps.sh` script to fix version mismatches

## NPM Configuration

Our .npmrc file contains the following settings:

```
audit=true               # Always check for vulnerabilities
fund=false               # Disable funding messages
loglevel=warn            # Show warnings and errors only
package-lock=true        # Always generate package-lock.json
progress=false           # Disable progress bar for CI systems
save-exact=true          # Save exact versions
engine-strict=true       # Enforce Node.js version compatibility
ignore-scripts=true      # Prevent scripts from running during install (security)
prefer-offline=true      # Prefer cached packages
save-prefix=""           # Don't use ~ or ^ prefixes in package.json
```

## Validation & Security Libraries

We use the following libraries for input validation and security:

- **Zod (zod@3.22.4)**: Type-safe schema validation
- **CSRF Protection**: Custom implementation in lib/csrf.ts
- **Rate Limiting**: Custom implementation in lib/rate-limit.ts

## Automated Security Checks

1. **npm audit**: Run `npm audit` at least once per sprint
2. **OWASP Dependency Check**: Integrated into CI/CD pipeline
3. **Snyk**: Used for advanced vulnerability detection

## Dependency Update Process

1. **Scheduled Reviews**: Review dependencies monthly
2. **Update Strategy**: 
   - Security updates: Immediate
   - Minor versions: Monthly
   - Major versions: Quarterly with full testing

3. **Testing Requirements**:
   - All tests must pass before accepting dependency changes
   - Run `npm test:all` to validate changes

## Azure Static Web Apps Integration

As we deploy to Azure Static Web Apps, we follow these additional practices:

1. **Build-time Validation**: Validate dependencies during CI/CD
2. **Runtime Protection**: Use Azure's built-in WAF capabilities
3. **Environment Segregation**: Maintain separate package-lock.json between environments if necessary

## Incident Response

If a vulnerability is detected:

1. Assess the severity and exploit potential
2. Update the affected package immediately if a fix is available
3. If no fix is available, implement mitigations or temporarily remove the feature
4. Document the incident and response in the security log

## Reference

- [npm documentation on dependency resolution](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#dependencies)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Snyk documentation](https://docs.snyk.io/) 