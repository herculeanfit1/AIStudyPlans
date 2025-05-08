# AI Study Plans

A modern web application for AI-powered study plan generation.

Updated: Testing backup workflow - timestamp: 2023-11-14T15:42:00Z

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

We provide a consolidated email testing utility:

```bash
# Test a simple notification email
./run-docker.sh email simple your-email@example.com

# Test a waitlist confirmation email
./run-docker.sh email waitlist your-email@example.com

# Test all email templates
./run-docker.sh email all your-email@example.com
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

| Command | Description |
|---------|-------------|
| `npm run validate:deps` | Verify dependencies follow our standards |
| `npm run fix:deps` | Interactive tool to fix common dependency issues |
| `npm run dependencies:check` | Check for outdated dependencies |
| `npm run dependencies:update` | Update dependencies (with caution) |

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

This cleanup is also integrated into our CI/CD pipeline and runs automatically after test workflows complete.

### Health Monitoring

Our Docker containers include a sophisticated health check system:

- **Enhanced health endpoint**: `/api/health` provides detailed system metrics
- **Automatic degradation detection**: Memory and CPU thresholds trigger health status changes
- **Container-aware**: Detects when running in a containerized environment

### Production Deployment

For production deployment, we use:

```bash
# Build and deploy with production settings
docker-compose -f docker-compose.prod.yml up -d

# Scale specific services if needed
docker-compose -f docker-compose.prod.yml up -d --scale app=3
```

### Best Practices

1. **Always use resource limits**: Prevents any single container from consuming all resources
2. **Use named volumes**: Improves data persistence and cleanup
3. **Run cleanup regularly**: Prevents orphaned resources
4. **Use multi-stage builds**: Keeps production images lean
5. **Implement proper health checks**: Ensures reliable container orchestration
6. **Set up proper logging**: Configure output size limits to prevent disk space issues
7. **Use environment-specific configurations**: Separate development, testing, and production configurations

## Email Testing

AIStudyPlans includes comprehensive email testing functionality to make it easy to verify your email templates and configuration.

### Testing Email Templates

You can test emails using our convenient helper script, or directly via Node.js or Docker:

#### Using the Helper Script (Recommended)

```bash
# Run the interactive helper script
./scripts/email-test.sh

# Specify template and recipient
./scripts/email-test.sh waitlist your-email@example.com

# Use Docker mode
./scripts/email-test.sh all your-email@example.com --docker

# Get help
./scripts/email-test.sh --help
```

#### Direct Node.js Testing

```bash
# Test a specific email template
node scripts/test-email.js [template] [recipient-email]

# Examples:
node scripts/test-email.js simple your-email@example.com
node scripts/test-email.js waitlist your-email@example.com 
node scripts/test-email.js feedback your-email@example.com

# Send all email templates at once
node scripts/test-email.js all your-email@example.com
```

#### Docker Email Testing

```bash
# Test using Docker with default settings
docker-compose -f docker-compose.email-test.yml up

# Test a specific template
TEMPLATE=waitlist EMAIL_TO=your-email@example.com docker-compose -f docker-compose.email-test.yml up

# Test all templates
TEMPLATE=all EMAIL_TO=your-email@example.com docker-compose -f docker-compose.email-test.yml up
```

### Available Email Templates

1. **simple** - A basic test email to verify your setup
2. **waitlist** - The waitlist confirmation email template 
3. **feedback** - The feedback request email template
4. **all** - Sends all available templates at once

### Email Configuration

Email settings are managed through environment variables in your `.env.local` file:

```
# Required
RESEND_API_KEY=your_resend_api_key_here

# Optional (defaults shown)
EMAIL_FROM=lindsey@aistudyplans.com
EMAIL_REPLY_TO=support@aistudyplans.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Viewing Test Emails

When using the default recipient (`delivered@resend.dev`), emails won't be delivered to an actual inbox but will appear in your [Resend dashboard](https://resend.com/dashboard).

To test delivery to a real inbox, use your own email address as the recipient.

## MCP Server for Local Development

This repository includes a secure Model Context Protocol (MCP) server that enables Cursor to connect with your local Qwen3 Coder model. This allows you to use Cursor's AI features with your local model instead of relying on cloud-based services.

### Features

- Server-Sent Events (SSE) transport with secure configuration
- Input validation with JSON Schema
- Comprehensive logging and monitoring
- Secure headers and CORS protection

### Usage

1. Configure the MCP Server:

```bash
cd mcp-server
npm ci
npm run build
npm start
```

2. In Cursor, you should now see "Local Qwen3" available as an MCP server in the settings.

For more details, see [mcp-server/README.md](mcp-server/README.md).

## Azure Resource Migration Utilities

This repository includes scripts to help with migrating Azure resources between resource groups.

### Application Insights Migration

Since Application Insights resources can't be directly moved between resource groups (due to deny assignments), we provide utilities to create a new resource and update your application configuration:

1. **Create a new Application Insights in your target resource group:**
   ```bash
   # Install Azure CLI if needed
   # brew install azure-cli (macOS) or follow https://docs.microsoft.com/en-us/cli/azure/install-azure-cli

   # Login to Azure
   az login

   # Run the Application Insights creation script
   node scripts/azure-create-app-insights.js
   ```

2. **Update your application configuration with the new connection string:**
   ```bash
   # After creating the new Application Insights resource,
   # use the migration script to update all configuration files
   node scripts/migrate-app-insights.js "OLD_CONNECTION_STRING" "NEW_CONNECTION_STRING"
   ```

3. **Verify functionality:**
   - Start the development server: `npm run dev`
   - Check the monitoring endpoints work correctly
   - Update CI/CD workflows with the new connection string

4. **Delete the old resource:**
   Once everything is working with the new Application Insights resource, you can safely delete the old one.

## Deployment & Development Workflow

We follow a robust branching and deployment strategy to ensure code quality:

### Branch Strategy

We use a modified Git Flow strategy with protected branches:
- `main`: Production code, always deployable
- `develop`: Integration branch for features

See [our complete branching strategy](./docs/branching-strategy.md) for details.

### Pull Request Process

All changes must go through pull requests:
1. Create a branch following our naming convention
2. Develop and test your changes
3. Create a pull request using the PR template
4. Address review feedback
5. Merge once approved and checks pass

### Continuous Integration

Every PR triggers comprehensive checks:
- Code linting and type checking
- Unit and integration tests
- Dependency validation
- Security scans
- Build verification
- Deployment validation

### Dependency Management

We maintain strict dependency control:
- All dependencies use exact versions (no `^` or `~`)
- `npm-shrinkwrap.json` locks all transitive dependencies
- Automated validation on all PRs
- See [our dependency documentation](./docs/dependency-management.md)

### Azure Deployment

For Azure deployment, follow these steps:
1. Changes must be merged to `main` through a PR
2. The Azure Static Web App workflow builds and deploys to Azure
3. Application Insights monitoring is automatically configured

For questions about deployment, contact the repository maintainers.
