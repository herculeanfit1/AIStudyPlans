# Branching Strategy

This document outlines our Git branching strategy and pull request workflow.

## Core Branches

- **main**: Production code. Always deployable and protected.
- **develop**: Integration branch for feature development. Deployable to staging environments.

## Support Branches

- **feature/[name]**: For new features (branched from develop, merged back to develop)
- **fix/[name]**: For bug fixes (branched from develop or main, merged to both)
- **hotfix/[name]**: For urgent production fixes (branched from main, merged to main and develop)
- **release/[version]**: Preparation for a production release (branched from develop, merged to main and develop)
- **refactor/[name]**: For code refactoring without functional changes
- **docs/[name]**: For documentation updates only
- **chore/[name]**: For maintenance tasks, dependency updates, etc.

## Pull Request Process

1. **Branch Creation**:
   - Create a branch from the appropriate base branch
   - Use the naming convention described above
   - Include a ticket/issue number if applicable (e.g., `feature/123-user-authentication`)

2. **Development**:
   - Make focused, smaller commits using conventional commit messages
   - Keep PRs focused on a single concern
   - Run tests locally before pushing

3. **Pull Request Creation**:
   - Fill out the PR template completely
   - Link relevant issues
   - Add appropriate reviewers (see CODEOWNERS file)
   - Add meaningful title and description

4. **Code Review**:
   - At least one approval is required before merging
   - Address all feedback
   - All PR checks must pass (CI, tests, lint, etc.)

5. **Merging**:
   - Use squash merging for feature branches to keep history clean
   - Use merge commits for release and hotfix branches to preserve history
   - Delete the branch after merging

## Branch Protection

The `main` branch is protected with the following rules:

- Pull request required before merging
- At least one approval required
- Status checks must pass (CI/CD, tests, linting)
- Branch is locked against force pushes
- No direct commits allowed (except by administrators in emergencies)

## Continuous Integration

Every pull request triggers automated checks:

- Code linting
- Type checking
- Unit and integration tests
- Dependency validation
- Security scanning
- Build verification
- Deployment validation

## Release Process

1. Create a `release/vX.Y.Z` branch from `develop`
2. Perform final testing and bug fixes
3. Update version numbers and CHANGELOG.md
4. Create a PR to merge into `main`
5. After approval and merge, tag the release in GitHub
6. Merge changes back to `develop`

## Hotfix Process

1. Create a `hotfix/[name]` branch from `main`
2. Fix the issue with minimal changes
3. Update patch version number
4. Create PRs to merge into both `main` and `develop`
5. After approval and merges, tag the hotfix release 