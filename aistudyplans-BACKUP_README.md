# AIStudyPlans Automated Backup System

This directory contains scripts to automatically back up the AIStudyPlans repository to the AIStudyPlans-Backups GitHub repository.

## Components

1. **aistudyplans-backup_script.sh** - The main backup script that creates a mirror of this repository and pushes it to the backup repository.
2. **aistudyplans-setup_automated_backup.sh** - Script to configure launchd to run the backup automatically.
3. **com.herculeanfit1.aistudyplans.backup.plist** - LaunchAgent plist file for macOS automation.
4. **aistudyplans-create_backup_repo.sh** - Helper script with instructions for creating the backup repository.
5. **aistudyplans-backup_log.txt** - Log file containing details of each backup operation.
6. **aistudyplans-launchd_backup.log** - Log file for the launchd job execution.

## Setup Instructions

1. First, create the backup repository on GitHub:

```bash
./aistudyplans-create_backup_repo.sh
```

Follow the instructions provided by this script to create the AIStudyPlans-Backups repository on GitHub.

2. Once the repository is created, run the setup script to configure automated backups:

```bash
./aistudyplans-setup_automated_backup.sh
```

This will configure a launchd job to run the backup every 6 hours.

## Manual Backup

To run a backup manually:

```bash
./aistudyplans-backup_script.sh
```

## Modifying Backup Schedule

The default schedule is to run backups every 6 hours (21600 seconds). To change this:

1. Edit the `com.herculeanfit1.aistudyplans.backup.plist` file
2. Modify the `StartInterval` value
3. Run the setup script again to apply changes

## Managing the Backup Job

- Check if the job is running:
  ```bash
  launchctl list | grep com.herculeanfit1.aistudyplans.backup
  ```

- Stop the automated backups:
  ```bash
  launchctl unload ~/Library/LaunchAgents/com.herculeanfit1.aistudyplans.backup.plist
  ```

- Start the automated backups again:
  ```bash
  launchctl load ~/Library/LaunchAgents/com.herculeanfit1.aistudyplans.backup.plist
  ```

## Troubleshooting

- Check `aistudyplans-backup_log.txt` for detailed logs of each backup operation
- Check `aistudyplans-launchd_backup.log` and `aistudyplans-launchd_backup_error.log` for any execution issues
- Ensure you have proper GitHub authentication configured

## Notes

- The backup is a mirror of your repository, including all branches and tags
- The script uses force push to ensure the backup repository exactly matches the source
- Your working directory remains unchanged by the backup process 