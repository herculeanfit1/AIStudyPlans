# AI Study Plans

A modern web application for AI-powered study plan generation.

## Deployment Status

This application is deployed on Azure Static Web Apps.

## Features

- AI-powered study plan generation
- Responsive design
- Modern UI with animations
- Email notifications
- Custom domain support

# AIStudyPlans Landing Page

A modern, eye-catching landing page for AIStudyPlans - an AI-powered study plan generator. This landing page is built with Next.js 14 and Tailwind CSS, showcasing modern web development techniques and best practices.

## Key Features

- 🚀 Modern, responsive design optimized for all devices
- ✨ Subtle animations and interactive UI elements
- 🔍 SEO-friendly architecture
- 🧪 Comprehensive testing infrastructure (unit tests, E2E tests, performance tests)
- 🐳 Containerized development and testing environment

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Testing**:
  - [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit tests
  - [Playwright](https://playwright.dev/) for end-to-end testing
  - [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) for performance testing
- **Containerization**: Docker & Docker Compose

## Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AIStudyPlans.git
   cd AIStudyPlans
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Using Docker

We provide a convenient Docker development environment:

1. Start the development environment:
   ```bash
   ./run-docker.sh start
   ```

2. Access the site at [http://localhost:3001](http://localhost:3001)

3. To stop the development environment:
   ```bash
   ./run-docker.sh stop
   ```

## Testing

### Running Unit Tests

```bash
# Local
npm run test

# With Docker
./run-docker.sh test
```

### Running E2E Tests

```bash
# Local
npm run test:e2e

# With Docker
./run-docker.sh e2e
```

### Running Performance Tests

```bash
# With Docker
./run-docker.sh lighthouse
```

## Project Structure

```
├── app/                  # Next.js App Router structure
│   ├── components/       # React components
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── e2e/                  # End-to-end tests
├── __tests__/            # Unit tests
├── public/               # Static assets
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile.dev        # Development Dockerfile
├── Dockerfile.test       # Testing Dockerfile
└── run-docker.sh         # Helper script for Docker operations
```

## Deployment

This landing page is designed to be deployed to platforms like Vercel, Netlify, or any other static site hosting service.

```bash
# Build for production
npm run build

# Preview the production build
npm run start
```

## Azure Static Web Apps Deployment

This landing page is configured for deployment to Azure Static Web Apps using GitHub Actions.

### Required GitHub Secrets

The following GitHub secrets should be configured in your repository for successful deployment:

- `AZURE_STATIC_WEB_APPS_API_TOKEN`: Token from Azure Static Web Apps
- `RESEND_API_KEY`: API key for the Resend email service
- `EMAIL_FROM`: Email address used for sending notifications
- `EMAIL_REPLY_TO`: Reply-to email address for notifications
- `NEXT_PUBLIC_APP_URL`: The production URL of your application

### How to Deploy

1. Create an Azure Static Web App in the Azure Portal
2. Get the deployment token and add it as a GitHub secret
3. Push to the main branch to trigger automatic deployment

### Custom Domain Setup

1. Configure your custom domain in the Azure Static Web Apps portal
2. Create the necessary DNS records:
   - For apex domain: A records pointing to Azure's IP
   - For www subdomain: CNAME record pointing to your Azure app hostname

### Troubleshooting Deployment

If you encounter issues with deployment:

1. Check GitHub Actions logs for detailed error information
2. Verify that all required secrets are correctly configured
3. Ensure that your Next.js application builds successfully locally

## License

[MIT](LICENSE)

## Backup System

AIStudyPlans is secured with an automated backup system that:

1. Creates encrypted backups of the codebase using GPG encryption
2. Pushes the encrypted backups to a separate private repository
3. Runs automatically twice daily (9AM and 9PM Central Time)
4. Can also be triggered manually when needed

### Running a Manual Backup

1. Go to GitHub → Actions → "Secure Backup" workflow
2. Click "Run workflow" → "Run workflow"
3. The backup will be created and pushed to the backup repository

### Restoring from a Backup

1. Get access to the backup repository (`AIStudyPlans-Backups`)
2. Clone the backup repository
3. View the branches to see all available backups: `git branch -r`
4. Choose a backup branch and check it out: `git checkout backup-YYYY-MM-DD-HHMMSS`
5. Decrypt the backup file: `gpg --decrypt backup-YYYY-MM-DD-HHMMSS.tar.gz.gpg > restored-backup.tar.gz`
6. Extract the backup: `tar -xzf restored-backup.tar.gz`

Note: You need the GPG private key to decrypt the backup files. This key is stored securely in the repository secrets and in 1Password.

## Testing the Backup System

To test if the backup system is working properly:

1. Go to GitHub → Actions → "Verify PAT Token" workflow
2. Run the workflow to verify GitHub token permissions
3. If successful, the backup system should be fully operational
