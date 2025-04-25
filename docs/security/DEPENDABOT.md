# Setting Up Dependabot for SchedulEd

This guide explains how to set up GitHub Dependabot to automatically monitor and update dependencies in the SchedulEd repository.

## What is Dependabot?

Dependabot is a GitHub feature that helps keep your dependencies up-to-date by automatically creating pull requests when new versions of packages are released. This is particularly important for security updates.

## Current Dependency Issues

As of April 25, 2024, the repository has the following vulnerabilities:

```
lodash.pick  >=4.0.0
Severity: high
Prototype Pollution in lodash

next  9.5.5 - 14.2.24
Severity: critical
Multiple vulnerabilities including SSRF and DoS
```

Configuring Dependabot will help automatically address these and future vulnerabilities.

## Setting Up Dependabot

### Step 1: Create a Dependabot Configuration File

Create a file at `.github/dependabot.yml` with the following content:

```yaml
version: 2
updates:
  # Enable version updates for npm
  - package-ecosystem: "npm"
    # Look for package.json and package-lock.json files in the root directory
    directory: "/"
    # Check for updates once a week
    schedule:
      interval: "weekly"
    # Specify default labels for pull requests
    labels:
      - "dependencies"
      - "security"
    # Limit the number of open pull requests for version updates
    open-pull-requests-limit: 10
    # Set version update strategy
    versioning-strategy: increase
    # Group dependency updates to reduce PR noise
    groups:
      # Group all development dependencies together
      development-dependencies:
        patterns:
          - "eslint*"
          - "@typescript-eslint/*"
          - "jest*"
          - "@testing-library/*"
        exclude-patterns:
          - "next"
      # Group React dependencies together
      react:
        patterns:
          - "react"
          - "react-dom"
      # Group Next.js dependencies
      next:
        patterns:
          - "next"
          - "@next/*"
    # Security updates should be prioritized
    allow:
      - dependency-type: "direct"
      - dependency-type: "indirect"
```

### Step 2: Enable Dependabot in GitHub Repository Settings

1. Go to the repository on GitHub
2. Navigate to Settings > Code security and analysis
3. Enable the following features:
   - Dependabot alerts
   - Dependabot security updates
   - Dependency graph

### Step 3: Configure Pull Request Reviews

For efficient handling of Dependabot pull requests:

1. Consider creating a CODEOWNERS file to automatically assign reviews
2. Set up CI to automatically test Dependabot pull requests
3. Configure branch protection rules for the main branch

Example CODEOWNERS file (`.github/CODEOWNERS`):

```
# Dependabot pull requests
package.json @tech-lead-username
package-lock.json @tech-lead-username
yarn.lock @tech-lead-username

# Security-related files
*.yml @security-team-username
.github/dependabot.yml @security-team-username
```

### Step 4: Testing Dependabot Setup

After configuring Dependabot, you can manually trigger a version update check:

1. Go to the repository on GitHub
2. Navigate to the Insights tab > Dependency graph > Dependabot
3. Click "Check for updates" to trigger a manual check

## Best Practices for Managing Dependencies

1. **Review all Dependabot PRs carefully**:
   - Test the changes locally before merging
   - Verify that the application still works as expected
   - Check for breaking changes in major version updates

2. **Set up automatic tests**:
   - Configure GitHub Actions to run tests on Dependabot PRs
   - Only merge PRs that pass all tests

3. **Manage your dependencies proactively**:
   - Regularly review the dependency graph
   - Remove unused dependencies
   - Consolidate similar dependencies

4. **Monitor security advisories**:
   - Pay special attention to security updates
   - Prioritize fixing critical and high severity issues

## Conclusion

Setting up Dependabot is a crucial step in maintaining the security and health of the SchedulEd repository. By automating dependency updates, you can ensure that the project stays up-to-date with the latest security patches and feature improvements. 