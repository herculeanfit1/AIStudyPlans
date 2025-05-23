# AI Study Plans

> Web application for personalized AI learning paths

<!-- Deployment restart: 2025-01-28 -->

A modern web application for AI-powered study plan generation.

Updated: Triggering Static Web App restart - timestamp: 2025-05-22-00:36:18

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
- 📧 Email functionality using Next.js API Routes
- 🧪 Comprehensive testing infrastructure (unit tests, E2E tests, performance tests)
- 🐳 Containerized development and testing environment

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **API Routes**: Next.js Edge API Routes for serverless functionality
- **Email Service**: [Resend](https://resend.com) for reliable email delivery
- **Testing**:
  - [Jest](https://jestjs.io/) and [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) for unit tests
  - [Playwright](https://playwright.dev/) for end-to-end testing
  - [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) for performance testing
- **Containerization**: Docker & Docker Compose
- **AI Development**:
  - Local Qwen3 Coder model for development
  - MCP (Model Context Protocol) integration with Cursor
  - Zero-token cost development workflow

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

### Setting Up Local AI Development

For development, we use a local Qwen3 Coder model instead of cloud-based models:

1. Start your local LLM server (e.g., using LM Studio) at http://10.1.10.98:1234/v1
2. The global MCP configuration is already set up at:

   ```
   ~/Library/Application Support/Cursor/User/settings.json
   ```

3. Restart Cursor and select "Local Qwen3" in Settings → MCP Servers
4. Use Cursor's AI features as normal - all interactions will use your local model

See [complete documentation](./docs/README.md#development-with-local-llm) for troubleshooting.

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

### Testing Email Functionality

The application uses Next.js API Routes with Resend for email functionality:

```bash
# Test API functionality in production
node test-api-local.js prod

# Test API functionality in development (start local server first)
npm run dev
node test-api-local.js dev

# Test a simple notification email
./run-docker.sh email simple your-email@example.com

# Test a waitlist confirmation email
./run-docker.sh email waitlist your-email@example.com

# Test all email templates
./run-docker.sh email all your-email@example.com
```

For more details on the email setup, see [Email Setup Guide](./email-setup.md).

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
│   ├── api/              # Next.js API Routes
│   │   ├── waitlist/     # Waitlist API route
│   │   ├── test-email/   # Test email API route
│   │   └── health/       # Health check API route
│   ├── components/       # React components
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── lib/                  # Shared libraries
│   ├── email.ts          # Email functionality
│   └── email-templates.ts # Email templates
├── e2e/                  # End-to-end tests
├── __tests__/            # Unit tests
├── public/               # Static assets
├── scripts/              # Utility scripts
│   ├── email-test.js     # Consolidated email testing utility
│   └── cleanup-duplicates.sh # Configuration cleanup script
├── docker-compose.yml    # Docker Compose configuration
├── Dockerfile.dev        # Development Dockerfile
├── Dockerfile.test       # Testing Dockerfile
└── run-docker.sh         # Helper script for Docker operations
```

## Configuration

The project uses modern JavaScript/TypeScript tooling with consolidated configuration files:

- **Next.js**: `next.config.mjs` - Unified configuration for Next.js
- **Tailwind CSS**: `tailwind.config.ts` - TypeScript-based Tailwind configuration
- **PostCSS**: `postcss.config.mjs` - Modern PostCSS configuration
- **Docker**: Multiple Dockerfiles for different environments (production, development, testing)

To clean up any duplicate configuration files after a pull, run:

```bash
./scripts/cleanup-duplicates.sh
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

This application is deployed to Azure Static Web Apps using GitHub Actions. The deployment process includes:

1. Building the Next.js application
2. Setting up environment variables
3. Configuring routing via staticwebapp.config.json
4. Deploying the application

For manual deployment:

```bash
# Deploy to Azure Static Web Apps
./deploy-to-prod.sh
```

For more details on the migration from Azure Functions to Next.js API Routes, see [API Migration Documentation](./docs/api-migration.md).

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

Updated: Testing backup workflow - timestamp: 2023-11-14T15:42:00Z

## Docker CI/CD Setup

This project uses GitHub Actions for continuous integration and deployment with Docker containers.

### CI/CD Workflow Overview

1. **Build Workflow** (.github/workflows/build-artifact.yml)

   - Triggered on push to main/develop branches or via manual workflow dispatch
   - Builds and tags Docker images with environment and commit hash
   - Pushes images to GitHub Container Registry
   - Runs security scanning with Trivy
   - Saves build metrics

2. **Test Workflow** (.github/workflows/test.yml)
   - Runs unit and E2E tests in parallel

## Dependency Management

This project follows strict dependency management practices to ensure security, stability, and reproducibility across environments.

### Key Principles

- **Exact Versioning**: All dependencies use exact versions (no `^` or `~`) to ensure consistent builds
- **Shrinkwrap Locking**: We use npm-shrinkwrap.json to lock all transitive dependencies
- **Security First**: Automatic security audits run on every dependency change

### Dependency Tools

We've built several specialized tools to help manage dependencies:

| Command                       | Description                                      |
| ----------------------------- | ------------------------------------------------ |
| `npm run validate:deps`       | Verify dependencies follow our standards         |
| `npm run fix:deps`            | Interactive tool to fix common dependency issues |
| `npm run dependencies:check`  | Check for outdated dependencies                  |
| `npm run dependencies:update` | Update dependencies (with caution)               |

### Adding New Dependencies

When adding new dependencies:

1. Always use exact versions: `npm install package-name --save-exact`
2. Run `npm shrinkwrap` after adding dependencies
3. Commit both package.json and npm-shrinkwrap.json

See [our full dependency documentation](./docs/dependency-management.md) for more details.

## Docker Infrastructure

### Overview

AIStudyPlans uses Docker extensively for development, testing, and production deployment. Our Docker setup ensures consistent environments across all stages of the application lifecycle.

### Docker Components

- **Dockerfile**: Main production-ready multi-stage build
- **Dockerfile.test**: Specialized testing image with all necessary testing tools
- **docker-compose.yml**: Development and baseline configuration
- **docker-compose.test.yml**: Testing-specific services configuration
- **docker-compose.prod.yml**: Production-optimized configuration
- **docker-compose.email-test.yml**: Email testing configuration

### Container Architecture

Our container architecture follows modern best practices:

1. **Multi-stage builds**: Optimize image size and security
2. **Specific service roles**: Each container has a single responsibility
3. **Proper health checks**: Enhanced health monitoring via `/api/health` endpoint
4. **Resource limits**: Memory and CPU constraints to prevent container sprawl
5. **Security hardening**: Non-root users and security options for production

### Development with Docker

```bash
# Start the development server
docker-compose up

# Run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f
```

### Testing with Docker

We provide a comprehensive test suite that runs in Docker:

```bash
# Run all tests
./scripts/run-tests.sh all

# Run specific test types
./scripts/run-tests.sh unit    # Unit tests
./scripts/run-tests.sh e2e     # End-to-end tests
./scripts/run-tests.sh visual  # Visual regression tests
./scripts/run-tests.sh a11y    # Accessibility tests
./scripts/run-tests.sh perf    # Performance tests
```

### Docker Resource Management

To ensure optimal performance and avoid resource leaks, we've implemented an automated cleanup system:

```bash
# Clean all Docker resources
./scripts/docker-cleanup.sh --all

# Clean specific resource types
./scripts/docker-cleanup.sh --cont      # Remove containers only
./scripts/docker-cleanup.sh --images    # Remove images only
./scripts/docker-cleanup.sh --volumes   # Remove volumes only
./scripts/docker-cleanup.sh --networks  # Remove networks only
./scripts/docker-cleanup.sh --prune     # Run system prune
```