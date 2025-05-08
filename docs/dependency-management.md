# Dependency Management

This document outlines our strategy for managing dependencies in the AIStudyPlans project. Our approach focuses on security, reliability, and reproducibility across different environments.

## Key Principles

1. **Exact Versioning**: All dependencies use exact versions (no `^` or `~`) to ensure all environments have identical packages.
2. **Security First**: Dependencies are regularly audited for vulnerabilities and outdated packages.
3. **Minimal Dependencies**: We strive to minimize dependency count to reduce security risks and maintenance burden.
4. **Regular Updates**: Dependencies are updated on a scheduled basis, not ad-hoc, to maintain stability.
5. **Transitive Control**: We actively manage transitive dependencies using npm-shrinkwrap.json.

## Dependency Management Scripts

We've implemented several utility scripts to facilitate dependency management:

| Command | Description |
|---------|-------------|
| `npm run audit:fix` | Fix security vulnerabilities |
| `npm run dependencies:check` | Check for outdated dependencies |
| `npm run dependencies:update` | Update all dependencies to their latest versions |
| `npm run shrinkwrap` | Generate npm-shrinkwrap.json for exact version control |
| `npm run dedupe` | Remove duplicate dependencies |
| `npm run clean:install` | Perform a clean reinstall of all dependencies |
| `npm run fix:deps` | Interactive menu for resolving dependency issues |

## Best Practices

### Adding Dependencies

When adding a new dependency:

1. Verify the package is actively maintained
2. Check its vulnerability history on Snyk or similar platforms
3. Evaluate its dependency tree size
4. Add it with an exact version: `npm install package-name --save-exact` 
5. Run tests after adding the dependency

### Updating Dependencies

1. Use `npm run dependencies:check` to identify outdated packages
2. Research breaking changes in significant updates
3. Update packages individually or as logical groups
4. Run the full test suite after updates: `npm run test:all`
5. Generate a new shrinkwrap file: `npm run shrinkwrap`

### Troubleshooting Dependency Issues

If you encounter dependency-related issues:

1. Run `npm run fix:deps` and follow the interactive prompts
2. For CI/CD environments, use `npm ci` instead of `npm install`
3. Keep package-lock.json or npm-shrinkwrap.json in version control

## Security Measures

Our dependency security approach includes:

1. Regular security audits in CI/CD pipelines
2. Automated vulnerability scanning with tools like Snyk
3. Enforced package hash verification
4. Locked dependency versions with npm-shrinkwrap.json

## Package Lock Strategy

We use npm-shrinkwrap.json rather than package-lock.json because:

1. It locks all dependency versions, including transitive dependencies
2. It's respected when the package is used as a dependency
3. It ensures all environment builds are truly identical

## Further Reading

- [npm documentation on shrinkwrap](https://docs.npmjs.com/cli/v9/commands/npm-shrinkwrap)
- [Security best practices for npm](https://docs.npmjs.com/cli/v9/using-npm/security)
- [Managing dependencies (npm docs)](https://docs.npmjs.com/cli/v9/configuring-npm/package-json#dependencies) 