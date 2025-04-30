# CI/CD Pipeline Documentation

This document outlines the Continuous Integration and Continuous Deployment (CI/CD) pipeline for the AIStudyPlans application.

## Overview

Our CI/CD pipeline follows industry best practices including:

- **Build Once, Deploy Many**: We build Docker images once and promote them through environments
- **Immutable Artifacts**: Each build creates a uniquely tagged, immutable container image
- **Automated Testing**: Each build includes linting, unit tests, and container validation
- **Security Scanning**: Vulnerability scanning is performed on each build
- **Separate Environments**: We maintain distinct development, staging, and production environments
- **Post-deployment Validation**: Automated checks verify successful deployments

## Pipeline Structure

### 1. Build Pipeline (`.github/workflows/build-artifact.yml`)

The build pipeline runs on:
- Every push to `main` and `develop` branches
- Every push to feature branches matching `feature/*`
- Every pull request to `main` or `develop`
- Manual triggers via workflow dispatch

Steps:
1. Checkout code
2. Set up Docker BuildX for efficient builds
3. Configure environment-specific variables
4. Build and tag Docker image
5. Push image to GitHub Container Registry (except for PRs)
6. Run security scanning with Trivy
7. Save image information as artifact for deployment

### 2. Deployment Pipeline (`.github/workflows/deploy.yml`)

The deployment pipeline runs:
- Automatically after successful builds on `main` or `develop`
- Manually via workflow dispatch for any environment

Steps:
1. Determine target environment (production, staging, development)
2. Download image information from build pipeline
3. Deploy to Azure Static Web Apps with environment-specific configurations
4. Perform post-deployment validation

## Environment Strategy

### Development
- Built from feature branches or `develop` branch
- Deployed to development environment in Azure
- Minimal validation requirements

### Staging
- Built from `develop` branch
- Full test suite and validation
- Mirror of production configuration

### Production
- Built from `main` branch
- Highest security standards
- Additional validation steps
- Canary deployments (coming soon)

## Container Tests

We validate our Docker images using Container Structure Tests (`container-structure-test.yaml`):
- File existence verification
- Command output validation
- Runtime environment checking
- Security posture validation

## Image Tagging Strategy

Images are tagged with multiple identifiers:
- Git branch or PR reference
- Commit SHA
- Environment name
- Semantic version (when available)

## Manual Workflows

### Manual Build

```bash
# Trigger a manual build for a specific environment
gh workflow run build-artifact.yml -f environment=staging
```

### Manual Deployment

```bash
# Deploy a specific image tag to an environment
gh workflow run deploy.yml -f environment=production -f image_tag=ghcr.io/username/repo:v1.0.0
```

## Security Considerations

- Secrets are stored in GitHub Secrets, never in code
- Container images are scanned for vulnerabilities
- All deployments use least-privilege principles
- Production deployments require approval gates

## Monitoring

We track key metrics for our CI/CD pipeline:
- Build duration
- Deployment success rates
- Security findings
- Environment status

## Future Improvements

- [ ] Feature flag integration
- [ ] Canary deployments
- [ ] A/B testing framework
- [ ] Enhanced monitoring dashboard 