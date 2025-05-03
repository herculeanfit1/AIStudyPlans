# CI/CD Pipeline Documentation

This document outlines the CI/CD (Continuous Integration/Continuous Deployment) setup for the AI Study Plans project.

## Overview

The project uses GitHub Actions for CI/CD with a streamlined approach:

1. **Simplified Architecture**: We use a direct-to-Azure deployment approach for this static website
2. **Two Workflows**: One for deployment, one for backup
3. **No Docker**: We've eliminated Docker complexity as it's unnecessary for our static site needs

## Workflows

### 1. Azure Static Web Apps Deployment

The `azure-static-web-apps.yml` workflow:
- Triggers on pushes to `main` branch, PRs, or manual dispatches
- Builds the static site using the `ci-build.sh` script
- Handles NextAuth compatibility with static exports
- Deploys directly to Azure Static Web Apps

#### Special NextAuth Handling

Since NextAuth is incompatible with static exports, the `ci-build.sh` script:
1. Temporarily moves the NextAuth route files
2. Sets `SKIP_AUTH=true` for the build
3. Verifies API routes have proper `generateStaticParams()` functions
4. Builds the app as a static export
5. Restores the NextAuth route files after build

### 2. Backup Repository

The `backup-repository.yml` workflow:
- Creates backups on a schedule, on pushes to main, or manual triggers
- Excludes GitHub workflows from the backup
- Pushes to a separate backup repository

## Environment Variables

The following environment variables are used in the deployment workflow:

- `NEXT_PUBLIC_APP_URL`: The public URL of the application
- `AZURE_STATIC_WEB_APPS_API_TOKEN`: Authentication token for Azure Static Web Apps (stored as a GitHub secret)

## Manual Deployments

You can manually trigger deployments:

1. Go to the "Actions" tab in GitHub
2. Select the "Azure Static Web Apps CI/CD" workflow
3. Click "Run workflow"
4. Select the branch to deploy
5. Click "Run workflow"

## Troubleshooting

If deployments fail, check:

1. The GitHub Actions logs for errors
2. The NextAuth configuration (see `docs/nextauth-static-export.md`)
3. API route compatibility with static exports
4. Azure Static Web Apps configuration 