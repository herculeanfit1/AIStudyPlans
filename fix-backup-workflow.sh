#!/bin/bash

# Create the fixed backup workflow file
cat > .github/workflows/backup-repository.yml << 'EOL'
name: Backup to Separate Repository

on:
  workflow_run:
    workflows: ["Azure Static Web Apps CI/CD"]
    branches: [main]
    types:
      - completed
  workflow_dispatch:

jobs:
  backup:
    runs-on: ubuntu-latest
    name: Backup Repository
    # Only run if the Azure workflow completed successfully
    if: ${{ github.event.workflow_run.conclusion == 'success' || github.event_name == 'workflow_dispatch' }}
    steps:
      - name: Checkout Source Repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0
          path: source-repo

      - name: Debug Secrets
        run: |
          echo "BACKUP_PAT is set: ${{ secrets.BACKUP_PAT != '' }}"
          
          # Check backup repo info
          echo "Using explicit backup repository: herculeanfit1/aistudyplans-backups"

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
          
          # Show the repo URL we're pushing to (with any token part masked)
          echo "Pushing to: https://***@github.com/herculeanfit1/aistudyplans-backups.git"
          
          # Push to backup repository (force to overwrite history)
          git remote add backup https://${{ secrets.BACKUP_PAT }}@github.com/herculeanfit1/aistudyplans-backups.git
          git push backup main:main --force
EOL

echo "Fixed backup workflow file created successfully"
