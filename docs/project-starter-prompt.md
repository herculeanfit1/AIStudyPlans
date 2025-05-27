# AIStudyPlans Project Starter Prompt

This comprehensive guide will help you get started with the AIStudyPlans project, understand its architecture, and establish an effective development workflow.

## Project Overview

AIStudyPlans is a modern Next.js 14 application for AI-powered study plan generation. The project features:

- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with Resend email service
- **Database**: Supabase (PostgreSQL with Row Level Security)
- **Deployment**: Azure Static Web Apps
- **Development**: Local Qwen3 LLM integration via MCP for zero-token AI assistance

## Initial Setup & Environment

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js 18+** and **npm 9+**
- **Docker & Docker Compose** (for containerized development)
- **Git** for version control
- **Cursor IDE** (recommended for AI-assisted development)

### 2. Repository Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/AIStudyPlans.git
cd AIStudyPlans

# Install dependencies
npm install

# Verify installation
npm run build
```

### 3. Environment Configuration

Create your local environment file:

```bash
# Copy the example environment file
cp .env.example .env.local

# Required environment variables:
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM=Lindsey <lindsey@aistudyplans.com>
EMAIL_REPLY_TO=support@aistudyplans.com
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional for database features:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Local AI Development Setup (Recommended)

For cost-effective development with local LLM:

1. **Start your local Qwen3 model** at `http://10.1.10.98:1234/v1` (using LM Studio)
2. **MCP configuration** is already set up globally in Cursor
3. **Restart Cursor** and select "Local Qwen3" in Settings → MCP Servers
4. **Develop normally** - all AI interactions use your local model (zero tokens!)

## Understanding the Codebase

### 5. Project Structure Deep Dive

```
AIStudyPlans/
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API Routes
│   │   ├── waitlist/            # Waitlist signup endpoint
│   │   ├── health/              # Health check endpoint
│   │   └── debug-*/             # Development/testing endpoints
│   ├── components/              # Shared React components
│   │   ├── landing/             # Landing page sections
│   │   ├── waitlist/            # Waitlist form components
│   │   └── admin/               # Admin dashboard components
│   ├── hooks/                   # Custom React hooks
│   ├── lib/                     # Utility functions and services
│   ├── styles/                  # Global styles
│   └── [pages]/                 # Route pages (landing, admin, etc.)
├── lib/                         # Shared libraries
│   ├── feedback-templates/      # Modular email templates
│   └── hooks/                   # Additional custom hooks
├── components/                  # Legacy components (being phased out)
├── public/                      # Static assets
├── docs/                        # Comprehensive documentation
├── __tests__/                   # Unit tests
├── e2e/                         # End-to-end tests
└── scripts/                     # Utility scripts
```

### 6. Key Files to Understand First

**Start with these files in order:**

1. **`app/page.tsx`** - Main landing page (recently refactored)
2. **`app/components/landing/`** - Modular landing page sections
3. **`app/api/waitlist/route.ts`** - Core API functionality
4. **`lib/feedback-templates/`** - Email template system
5. **`app/hooks/useWaitlistForm.ts`** - Form logic and state management

**Configuration files:**
- **`next.config.mjs`** - Next.js configuration
- **`tailwind.config.ts`** - Tailwind CSS setup
- **`tsconfig.json`** - TypeScript configuration

### 7. Recent Major Refactoring (Important Context)

The project recently underwent a major refactoring to comply with the 100-150 line file size guidelines:

- **Email Templates**: Split 491-line file into 9 modular files
- **WaitlistForm**: Split 458-line component into 4 focused components
- **Landing Page**: Split 448-line page into 6 section components

**Result**: All files now comply with size guidelines, improved maintainability and testability.

## Development Workflows

### 8. Starting Development

**Option A: Local Development**
```bash
# Start the development server
npm run dev

# Access at http://localhost:3000
```

**Option B: Docker Development (Recommended)**
```bash
# Start containerized environment
./run-docker.sh start

# Access at http://localhost:3001
# Stop when done
./run-docker.sh stop
```

### 9. Testing Procedures

**Run all tests before making changes:**

```bash
# Unit tests
npm run test

# End-to-end tests
npm run test:e2e

# Docker-based testing
./run-docker.sh test
./run-docker.sh e2e

# Performance testing
./run-docker.sh lighthouse
```

### 10. Email Functionality Testing

The project uses Resend for email delivery:

```bash
# Test email configuration
node test-resend-config.js

# Test specific email templates
./run-docker.sh email simple your-email@example.com
./run-docker.sh email waitlist your-email@example.com
./run-docker.sh email all your-email@example.com

# Test API endpoints
node test-api-local.js dev  # (with dev server running)
node test-api-local.js prod # (tests production)
```

## Code Quality & Standards

### 11. Coding Standards

**Follow the master coding preferences:**

- **File Size**: Keep files under 100-150 lines (strictly enforced)
- **TypeScript**: Full strict mode enabled (`"strict": true`)
- **Components**: Use JSDoc documentation for all components
- **Imports**: Organize alphabetically, remove unused imports
- **Testing**: Write tests for all new functionality

### 12. Pre-Development Checklist

Before starting any new feature:

```bash
# 1. Ensure clean build
npm run build

# 2. Run type checking
npm run typecheck

# 3. Run linting
npm run lint

# 4. Run all tests
npm run test

# 5. Check Docker environment
./run-docker.sh start
./run-docker.sh test
./run-docker.sh stop
```

### 13. Quality Assurance Commands

```bash
# Format code
npx prettier --write .

# Fix auto-fixable lint issues
npm run lint -- --fix

# Check for security vulnerabilities
npm audit

# Analyze bundle size
npm run build && npm run analyze
```

## Key Development Areas

### 14. Current Implementation Status

**✅ Completed Features:**
- Responsive landing page with modern UI
- Waitlist signup with email confirmation
- Email template system with Resend integration
- Admin dashboard for monitoring
- Comprehensive testing infrastructure
- Docker development environment
- Azure deployment pipeline

**🚧 In Progress:**
- Database integration (Supabase RLS policies need fixing)
- User authentication system
- Study plan generation (AI integration)

**📋 Planned Features:**
- User dashboard
- Study plan management
- Progress tracking
- Payment integration

### 15. Common Development Tasks

**Adding a new component:**
1. Create in appropriate directory (`app/components/`)
2. Keep under 150 lines
3. Add JSDoc documentation
4. Write unit tests
5. Update relevant documentation

**Adding a new API route:**
1. Create in `app/api/[route]/route.ts`
2. Implement proper error handling
3. Add input validation
4. Write integration tests
5. Update API documentation

**Modifying email templates:**
1. Edit files in `lib/feedback-templates/`
2. Test with email testing scripts
3. Verify responsive design
4. Update template documentation

## Deployment & Production

### 16. Deployment Process

**Azure Static Web Apps deployment:**

```bash
# Build for production
npm run build

# Deploy to Azure (automated via GitHub Actions)
git push origin main

# Manual deployment (if needed)
npm run deploy

# Verify deployment
curl https://aistudyplanslanding.azurewebsites.net/api/health
```

### 17. Environment-Specific Configurations

**Development:**
- Local server at `localhost:3000`
- Docker at `localhost:3001`
- Local email testing with Resend

**Production:**
- Azure Static Web Apps
- Custom domain support
- Environment variables in Azure portal
- Production email delivery

## Troubleshooting & Common Issues

### 18. Common Problems & Solutions

**Build Failures:**
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

**Docker Issues:**
```bash
# Clean Docker environment
./run-docker.sh clean

# Rebuild containers
docker-compose build --no-cache
```

**Email Not Working:**
1. Verify `RESEND_API_KEY` in environment
2. Check email configuration: `node test-resend-config.js`
3. Test API endpoint: `node test-api-local.js dev`

**TypeScript Errors:**
```bash
# Run type checking
npm run typecheck

# Common fixes:
# - Add missing type imports
# - Fix any types with proper interfaces
# - Update deprecated type definitions
```

### 19. Getting Help

**Documentation Resources:**
- **`docs/README.md`** - Main documentation hub
- **`docs/CODEBASE.md`** - Architecture details
- **`docs/COMPONENTS.md`** - Component documentation
- **`docs/API.md`** - API reference
- **`docs/project-status.md`** - Current status and roadmap

**Development Support:**
- Use local Qwen3 model for AI assistance (zero cost!)
- Check `docs/promptlog.md` for previous solutions
- Review test files for usage examples

## Next Steps After Setup

### 20. Recommended First Tasks

1. **Explore the codebase:**
   - Run the application locally
   - Test the waitlist signup flow
   - Examine the refactored components

2. **Understand the email system:**
   - Send test emails to yourself
   - Review the template structure
   - Test different email scenarios

3. **Review the testing infrastructure:**
   - Run all test suites
   - Examine test patterns
   - Add a simple test for practice

4. **Study the deployment process:**
   - Review Azure configuration
   - Understand the CI/CD pipeline
   - Test local Docker environment

### 21. Development Best Practices

**Before Each Coding Session:**
- Pull latest changes: `git pull origin main`
- Run quality checks (build, test, lint)
- Review any new documentation updates

**During Development:**
- Keep files under 150 lines (strictly enforced)
- Write tests for new functionality
- Document complex logic with comments
- Use TypeScript strictly (no `any` types)

**Before Committing:**
- Run the full test suite
- Check code formatting
- Update documentation if needed
- Use conventional commit messages

**Commit Message Format:**
```
type(scope): description

feat(landing): add new hero section animation
fix(api): resolve waitlist email delivery issue
docs(readme): update setup instructions
```

## Final Notes

This project follows modern web development best practices with a focus on:
- **Maintainability**: Small, focused files and components
- **Quality**: Comprehensive testing and type safety
- **Performance**: Optimized builds and efficient code
- **Developer Experience**: Local AI assistance and Docker workflows
- **Security**: Proper validation, CSRF protection, and secure deployment

The codebase is well-documented, thoroughly tested, and ready for continued development. The recent refactoring has significantly improved maintainability while preserving all functionality.

**Happy coding! 🚀** 