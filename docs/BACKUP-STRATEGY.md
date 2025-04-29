# AIStudyPlans Backup Strategy

This document outlines the comprehensive backup strategy implemented for the AIStudyPlans project, ensuring data security, version control, and disaster recovery capabilities.

## Overview

The AIStudyPlans project utilizes a multi-layered backup approach:

1. **Primary Source Repository**: Main GitHub repository where active development occurs
2. **Backup Repository**: Secondary GitHub repository that automatically mirrors the main repository
3. **Secure Encrypted Backup**: Additional layer with GPG encryption for sensitive content

## Backup Architecture

```
┌───────────────────┐     ┌───────────────────┐     ┌───────────────────┐
│                   │     │                   │     │                   │
│  Primary GitHub   │────▶│  Backup GitHub    │────▶│  Tertiary Secure  │
│  Repository       │     │  Repository       │     │  Backup Location  │
│                   │     │                   │     │                   │
└───────────────────┘     └───────────────────┘     └───────────────────┘
        GitHub Actions           GitHub Actions
        Workflow #1              Workflow #2
        (backup-repository.yml)  (secure-backup workflow)
```

## 1. Primary to Backup Repository Workflow

### Configuration

Located in the primary repository at `.github/workflows/backup-repository.yml`, this workflow:

- Triggers on pushes to the main branch and manual workflow dispatch
- Clones the primary repository
- Excludes the `.github` directory to prevent workflow conflicts
- Pushes content to the backup repository

### Required Secrets in Primary Repository

- `BACKUP_PAT`: GitHub Personal Access Token with repository access permissions
- `BACKUP_REPO`: Name of the backup repository in format `username/repository-name`

### Implementation Details

```yaml
name: Backup to Separate Repository

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    name: Backup Repository
    steps:
      - name: Checkout Source Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          path: source-repo

      - name: Push to Backup Repository
        run: |
          cd source-repo
          
          # Configure Git
          git config --global user.name "GitHub Action"
          git config --global user.email "action@github.com"
          
          # Create a temporary directory for the filtered content
          mkdir -p ../filtered-repo
          
          # Copy everything except .github directory to the filtered directory
          rsync -av --exclude='.github' ./ ../filtered-repo/
          
          # Add a special .gitignore to the backup repo to prevent workflow triggers
          echo "# Ignore GitHub workflows to prevent duplicate runs" > ../filtered-repo/.github-actions-ignore
          echo ".github/" >> ../filtered-repo/.github-actions-ignore
          
          # Set up the new remote repository
          cd ../filtered-repo
          git init
          git config user.name "GitHub Action"
          git config user.email "action@github.com"
          git add .
          git commit -m "Backup from main repository - $(date)"
          
          # Push to backup repository (force to overwrite history)
          git remote add backup https://${{ secrets.BACKUP_PAT }}@github.com/${{ secrets.BACKUP_REPO }}.git
          git push backup main:main --force
```

This workflow ensures that the backup repository contains all code and content from the main repository, excluding GitHub workflow configurations that could cause conflicts.

## 2. Secure Encrypted Backup Workflow

This workflow runs in the backup repository and provides an additional layer of security by:

- Creating GPG-encrypted backups of the repository content
- Pushing the encrypted backups to a tertiary location

### Required Secrets in Backup Repository

- `GPG_PRIVATE_KEY`: The GPG private key used for encryption
- `GPG_RECIPIENT`: The key ID to identify which key to use for encryption
- `BACKUP_TOKEN`: GitHub Personal Access Token for pushing to repositories

### Security Considerations

- The GPG key used for encryption is stored securely as a GitHub Secret
- The workflow creates encrypted archives that can only be decrypted with the private key
- The key fingerprint is: `96F81382B87F0406CCD9CBD8ADFACE7006FAC229`
- Local copies of the key are removed after setup, with backups stored securely offline

## Setup and Maintenance Procedures

### Setting up the Primary Repository Backup

1. Create a GitHub Personal Access Token with repository access
2. Add `BACKUP_PAT` and `BACKUP_REPO` secrets to the primary repository
3. Create the backup repository if it doesn't exist
4. Add the backup workflow file to the primary repository

### Setting up the Secure Encrypted Backup

1. Generate a GPG key pair (already completed)
2. Add the GPG key as a secret in the backup repository 
3. Configure the `GPG_RECIPIENT` with the key ID
4. Add a GitHub token as the `BACKUP_TOKEN` secret

### Backup Verification Process

1. **Manual Verification**: Periodically check that the backup repository content matches the main repository
2. **Automated Checks**: GitHub Actions workflow status provides verification of successful backups
3. **Recovery Testing**: Schedule quarterly recovery tests to verify backup integrity

### Recovery Procedures

#### From Backup Repository

1. Clone the backup repository
2. Create a new repository or restore to the original repository
3. Push the content to the target repository

#### From Encrypted Backup

1. Download the encrypted backup files
2. Import the GPG key from secure offline storage
3. Decrypt the backup archives
4. Restore content to a repository

## Backup Frequency and Retention

- **Primary to Backup**: Real-time backup on every push to the main branch
- **Encrypted Backup**: Automated on schedule and after significant changes
- **Retention Policy**: Both backup repositories retain all history indefinitely

## Security Protocols

- Access to the backup repositories is strictly controlled
- GPG private key for decryption is stored securely offline
- Personal Access Tokens have minimal necessary permissions
- All tokens and secrets are stored as GitHub Secrets, never in code

## Backup Testing and Validation

We maintain a regular schedule for testing the backup and recovery process:

1. Monthly verification of backup content integrity
2. Quarterly test recovery to a temporary repository
3. Annual comprehensive disaster recovery simulation

## Conclusion

This multi-layered backup strategy provides comprehensive protection for the AIStudyPlans codebase. By utilizing both an unencrypted backup repository and an encrypted tertiary backup, we ensure that we can recover from data loss, accidental deletion, or repository corruption with minimal disruption.

The combination of automated GitHub Actions workflows, GPG encryption, and secure key management provides a robust backup solution that balances security, accessibility, and redundancy.

## Appendix: Key Management

The GPG key used for encryption is backed up securely at:
- `/Users/herculeanfit1/backups/github_backup_gpg_new.key`

This key should be stored securely offline, and access should be restricted to authorized personnel only. 