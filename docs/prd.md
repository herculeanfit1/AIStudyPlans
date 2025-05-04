# SchedulEd - Product Requirements Document

## Overview
SchedulEd is an AI-powered study plan generator that creates personalized learning paths tailored to individual learning styles. The platform uses advanced algorithms to generate step-by-step study plans based on subject matter, time availability, learning style preferences, and current knowledge level. Users can create accounts to save their personalized study plans, track progress, and access additional features.

The current implementation includes:
- A modern, responsive landing page built with Next.js 14 (App Router)
- Waitlist collection for early access to the platform
- Email integration with Resend for confirmation emails
- Dark/light mode theming with Next.js theme provider
- Responsive particle background effects
- Clear presentation of features, pricing, and value proposition
- Mobile-responsive design with proper navigation

Key capabilities include:
- Personalized study plan generation with blended learning style approach (visual, auditory, kinesthetic)
- User authentication with both traditional email/password and OAuth single sign-on (Google, Microsoft)
- Profile management with customizable preferences and saved study plans
- Advanced customization options for resource types, study environments, and learning preferences
- Responsive, modern interface optimized for all devices
- Content curation system for recommending high-quality educational resources
- Modular architecture with clear separation of concerns
- Containerized deployment with Docker for consistent development and production environments

## Current Implementation

### 1. Landing Page Components
- Modern hero section with clear value proposition and particle background
- Feature showcase highlighting key platform capabilities
- Pricing tiers with toggle between monthly and annual billing
- Waitlist form for early access registration
- Navigation header with responsive mobile menu and dark/light mode toggle
- Footer with links to important sections
- FAQ section with common questions and answers
- "How It Works" section explaining the platform process
- Responsive and animated UI elements

### 2. Email Integration
- Resend API integration for reliable email delivery
- Waitlist confirmation emails
- Environment-variable based configuration
- Comprehensive error handling
- Testing utilities for email functionality (test-resend.js, email-cli.js)

### 3. API Routes
- Waitlist submission endpoint with data validation (/api/waitlist)
- Error handling and appropriate status codes
- Secure handling of user information

### 4. UI/UX Design
- Responsive design for all devices (mobile, tablet, desktop)
- Modern UI with consistent color scheme and typography
- Dark and light mode theme support
- Interactive elements with appropriate hover/focus states
- Animated components for improved user experience
- Particle effects background for visual appeal

### 5. Technical Infrastructure
- Next.js 14 with App Router architecture
- TypeScript for type safety
- Tailwind CSS for styling
- Docker containerization for development and production
- Comprehensive testing setup with Jest and Playwright
- CI/CD setup with GitHub Actions

### 6. Theme Implementation
- Dark/light mode toggle with system preference detection
- Theme persistence with local storage
- Smooth transitions between themes
- Proper component hydration to prevent flickering

## Deployment Architecture

### Docker Containerization
- Production-ready Dockerfile with multi-stage build
- Development Dockerfile (Dockerfile.dev) for local development
- Testing Dockerfile (Dockerfile.test) for CI/CD
- Docker Compose configuration for running the complete stack
- Environment variable management for secure configuration
- Health checks for container monitoring
- Optimized Docker image with proper caching

### Development Workflow
- Comprehensive testing infrastructure (unit, e2e)
- Linting and code quality tools
- Development server with hot reloading
- Environment-specific configurations
- **Local AI development using Qwen3 Coder**:
  - MCP (Model Context Protocol) integration
  - Direct connection to local LLM at http://10.1.10.98:1234/v1
  - Reduced dependency on cloud-based models
  - Elimination of token costs for development
  - Enhanced privacy by keeping code local

### Hosting Infrastructure
- Containerized deployment ready for any container hosting platform
- Optimized for horizontal scaling
- Environment variable configuration
- Health check endpoints

## Future Enhancements
- Backend implementation for study plan generation
- User authentication system
- Database integration for storing user data and study plans
- Advanced AI algorithms for plan personalization
- Mobile application development
- Admin dashboard for content management
- Analytics dashboard for user insights
- Enhanced recommendation engine
- Integration with third-party educational resources

## Success Metrics
- User engagement (measured by website analytics)
- Waitlist registrations
- Email open and click-through rates
- User satisfaction (measured through feedback forms)
- System performance metrics
- Error rates
- Feature adoption rates
- User retention and growth

## Dependencies
- Next.js 14+
- React 18+
- TypeScript 5+
- Tailwind CSS 3+
- next-themes for theming
- Resend for email
- react-tsparticles for visual effects
- Docker for containerization
- Jest and React Testing Library for testing
- Playwright for end-to-end testing

## Production Deployment Readiness

### Current Status
- Landing page implementation complete
- Waitlist functionality operational
- Email integration functioning
- Docker containerization ready
- Testing infrastructure in place

### Pre-Production Checklist
- Set up proper environment variables for production
- Configure production domain and DNS settings
- Set up proper SSL certificates
- Implement monitoring and logging solutions
- Create backup and disaster recovery plans
- Perform security audit and penetration testing
- Optimize for performance and SEO
- Configure proper caching strategies
- Set up analytics tracking
- Prepare documentation for maintenance and operations

## Core Features

### 1. User Authentication & Profile Management
- User registration with email verification
- Secure login with multi-factor authentication support
- Comprehensive profile management with learning preferences
- Password reset functionality
- Role-based access (student, admin)
- OAuth integration with multiple providers (Google, Microsoft)
- Modular authentication controllers organized by functionality:
  - Login management
  - Registration flows
  - Password reset/recovery
  - Profile management
  - Multi-factor authentication
  - OAuth authentication
  - Subscription management

### 2. Study Plan Generation
- AI-powered study plan creation
- Customizable learning parameters
- Multiple learning style support
- Time availability consideration
- Subject-specific recommendations
- Service-based architecture for plan generation logic

### 3. Study Plan Management
- View and edit study plans
- Track progress
- Mark steps as complete
- Add custom notes
- Share plans with others
- Export plans to PDF format
- Modular controllers for different study plan operations

### 4. Resource Integration
- Educational resource recommendations
- Resource categorization
- Resource validation
- Resource rating system
- Service layer for resource management

### 5. Content Curation System
- Automated content quality evaluation
- Resource type detection
- Subject tag extraction
- Expertise level assessment
- Completion time estimation
- Content verification workflow
- Content flagging system
- Content search and filtering
- Service-based architecture for content curation operations

### 6. Administrative Management
- User management dashboard
- Content moderation tools
- System configuration controls
- Usage analytics and reporting
- Modular admin controllers organized by domain:
  - User management
  - Content management
  - System configuration
  - Analytics and reporting
  - Subscription management

## Technical Architecture

### Frontend
- HTML5/CSS3 with Tailwind CSS
- HTMX for dynamic interactions
- Vanilla JavaScript for complex interactions
- Responsive design for all devices

### Backend
- Flask web framework
- Clean architecture with service layer pattern
- Modular routing by domain and functionality
- SQLAlchemy ORM
- Flask-Login for authentication
- Flask-Mail for email services
- Flask-WTF for form handling
- Comprehensive service layer abstracting business logic

### Application Architecture
- Clear separation of concerns:
  - Controllers: Handle HTTP requests/responses
  - Services: Encapsulate business logic and operations
  - Models: Define data structures and database schema
  - Utils: Provide shared functionality across the application
- Modular routing by functionality:
  - Authentication routes split by feature (login, registration, etc.)
  - Admin routes organized by domain (users, content, etc.)
  - API routes with proper versioning

### Database
- PostgreSQL for all environments (including development and production)
- Database migrations with Flask-Migrate
- Connection pooling with SQLAlchemy
- Database configuration abstraction layer

### Caching and Session Management
- Redis for session storage in production
- Redis for application-level caching
- Filesystem fallback for sessions in development
- Simple memory caching fallback in development
- Centralized cache configuration with environment-based settings
- Cache invalidation strategies for critical data
- Session data encryption and security

### Logging Infrastructure
- Centralized logging configuration
- Format-based log handling (standard and JSON)
- Rotating file handlers for persistent logs
- Console logging for development
- Log level configuration via environment variables
- Structured logging for machine parsing
- Context-enriched log records

### Testing Infrastructure
The application includes comprehensive testing infrastructure to ensure quality and reliability:

#### UI Test Framework (Selenium)
- Implements the Page Object Model pattern for maintainable test code
- Features a centralized test configuration system
- Includes HTML report generation with screenshots for failures
- Supports data-driven testing with parameterized test cases
- Provides a master test runner with configurable options
- Organizes tests by functional area (auth, dashboard, study plans)
- Captures screenshots on test failures for easier debugging
- Supports both headless and browser-visible test execution
- Includes parallel test execution capabilities
- Supports multiple browsers (Chrome, Firefox)
- Includes mobile device emulation for responsive testing
- Features retry mechanisms for handling flaky tests
- Integrates with CI/CD pipelines through GitHub Actions
- Provides comprehensive documentation for framework usage
- Supports test data management through configuration files
- Implements enhanced error reporting with detailed logs

#### API Testing
- Comprehensive test suite using pytest
- Test fixtures for common scenarios
- Session management best practices
- Database transaction handling
- Authentication testing utilities
- Test isolation and cleanup
- Mocking of external services and AI components
- Integration testing for core workflows
- Custom test fixtures for database operations

#### Unit Testing
- Comprehensive test suite using pytest
- Test fixtures for common scenarios
- Session management best practices
- Database transaction handling
- Authentication testing utilities
- Test isolation and cleanup
- Mocking of external services and AI components
- Integration testing for core workflows
- Custom test fixtures for database operations

#### Test Organization
```
tests/
├── conftest.py                    # Global test configuration and fixtures
├── test_utils.py                  # Common test utilities and helpers
├── test_auth/                     # Authentication tests
├── test_models/                   # Database model tests
├── test_controllers/              # Route and controller tests
├── test_integration/              # Integration tests
├── test_content_curator.py        # Content curation utility tests
├── test_admin_content_controller.py  # Admin content management tests
└── test_user_content_interactions.py # User content interaction tests
```

#### Test Best Practices
1. Use session-scoped app fixture for performance
2. Function-scoped fixtures for test isolation
3. Proper session management with context managers
4. Automatic cleanup after each test
5. Consistent database transaction handling
6. Reusable test utilities
7. Clear test naming and organization
8. Comprehensive test coverage
9. Proper mocking and patching
10. Error handling and edge cases
11. Tests that match implementation behavior
12. Effective handling of AI component testing

## Security Requirements
- Secure password hashing with modern algorithms
- CSRF protection for all forms and state-changing requests
- XSS prevention through proper output encoding and CSP
- SQL injection prevention with parameterized queries
- Rate limiting on authentication and API endpoints
- Input validation and sanitization for all user inputs
- Secure session management with proper timeout settings
- Multi-factor authentication:
  - TOTP-based authentication compatible with Google Authenticator, Microsoft Authenticator, etc.
  - One-time recovery codes for backup access
  - "Remember this device" functionality for 30-day verification bypass
  - Secure QR code setup workflow
- Email service integration:
  - SendGrid integration for reliable email delivery
  - Automatic fallback to standard SMTP via Flask-Mail
  - Environment-variable based configuration
  - Comprehensive error handling
- OAuth implementation with proper state validation:
  - Google OAuth integration for single sign-on
  - Microsoft OAuth integration for single sign-on
  - Note: Facebook and Apple OAuth are not implemented
- JWT token validation for API requests
- Regular security audits and penetration testing
- Advanced password policy controls
- Session fixation protection
- Context-aware input sanitization
- Database connection security
- Comprehensive security event logging
- Privacy compliance (GDPR/CCPA) features
  - Data Export Service for GDPR Article 20 compliance
  - User data export in portable, machine-readable formats (JSON)
  - Optional file encryption for secure data transfers
  - Automatic management of export file lifecycle with expiration
  - Complete documentation of all collected user data
  - Proper anonymization and data deletion capabilities
- Automated security alerting system
- Incident response workflow

## Performance Requirements
- Page load time < 2 seconds
- API response time < 500ms
- Support for 1000+ concurrent users
- Efficient database queries
- Proper caching strategies
- Redis-backed caching for high-traffic routes and expensive computations
- SQL query optimization and indexing
- Connection pooling for optimal database resource utilization
- Client-side asset optimization and compression
- Lazy loading of non-essential resources
- Distributed session management for horizontal scaling
- Graceful degradation under heavy load
- Asynchronous processing of non-critical operations

## Development Workflow
1. Feature branch creation
2. Test-driven development
3. Code review process
4. Automated testing
5. Documentation updates
6. Deployment pipeline

## Deployment Strategy
- Docker-based containerization for all environments
- Development environment with hot-reloading
- Staging environment with testing data
- Production environment with optimized settings
- Automated deployment with CI/CD pipelines
- Prometheus and Grafana for monitoring
- ELK stack for centralized logging
- Automated backup and recovery strategy

### Docker Containerization
- Multi-container setup with Docker Compose
- Environment-specific configurations:
  - Development setup with hot-reloading and debugging
  - Testing environment with isolated services
  - Production setup with optimized performance settings
- Services included:
  - Web application (Flask)
  - PostgreSQL database
  - Redis for caching and session management
  - Nginx as reverse proxy and static asset server
  - Mailhog for email testing
  - (Planned) Prometheus for monitoring
  - (Planned) Grafana for metrics visualization
- Security features:
  - Non-root container execution
  - Resource limitations and quotas
  - Health checks for all services
  - Secure networking with isolated bridge networks
  - No-new-privileges security option
- Runtime features:
  - Automatic service dependency resolution
  - Persistent storage with named volumes
  - Efficient environment variable management
  - Healthcheck endpoints for all critical services
  - Container restart policies

### Scalability Infrastructure
- PostgreSQL-optimized database configuration
- Redis-based session management for stateless application scaling
- Centralized caching system for performance optimization
- Environment-specific configuration management
- Connection pooling for database scalability
- Health check endpoints for load balancer integration
- Graceful startup and shutdown procedures
- Robust error handling and recovery mechanisms
- Docker swarm compatibility for horizontal scaling

## Future Enhancements
- Mobile application for iOS and Android with offline capabilities
- Collaborative study plan creation and editing
- Advanced content recommendation engine using machine learning
- Progress analytics and visualization dashboards
- Integration with Learning Management Systems (Canvas, Moodle, Blackboard)
- Enhanced content rating and review system
- Study communities and discussion forums
- Advanced study tools (flashcards, notes, pomodoro timer, spaced repetition)
- Content creation tools for user-generated materials
- Subscription tiers and premium content marketplace
- Kubernetes deployment for automated scaling
- CI/CD pipeline integration with GitHub Actions
- A/B testing framework for feature experimentation

## Success Metrics
- User engagement
- Study plan completion rates
- User satisfaction
- System performance
- Error rates
- Test coverage
- Content quality metrics
- Resource recommendation relevance
- Security incident frequency
- Feature adoption rates
- User retention and growth

## Timeline
- Phase 1: Core Features (2 weeks)
- Phase 2: Enhanced Features (2 weeks)
- Phase 3: Polish & Optimization (1 week)
- Phase 4: Testing & Documentation (1 week)
- Phase 5: Security Enhancements (2 weeks)
- Phase 6: Advanced Features & Integrations (4 weeks)

## Dependencies
- Python 3.8+
- Flask 2.0+
- SQLAlchemy 1.4+
- pytest 7.0+
- HTMX 1.9+
- Tailwind CSS 3.0+

# Additional Privacy and Enhanced Enrollment Features

## User Privacy and Minor Protection

SchedulEd prioritizes user privacy and provides enhanced protection for minors (ages 13-17) using the platform.

### Age Verification and Parental Consent

- Users must be at least 13 years old to use the service
- Users under 18 must have parental consent
- Registration includes age verification checkboxes
- School level selection (middle school, high school, college) ties to appropriate content and safety controls

### Minor Account Protections

- Accounts for users under 18 are automatically set to private
- Profile pictures are disabled for users under 18
- Study plans cannot be shared publicly by minor users
- Content is filtered based on school level appropriateness
- All communication is directed to parent/guardian-approved email addresses

### Data Collection Limitations

- Only essential data is collected from minor users
- ZIP code collection is optional and only used for local educational resources
- Data is never sold to third parties or used for marketing unrelated to educational content
- Strict data retention policies with clear deletion procedures for parent requests

### Special Privacy Policy

- Dedicated privacy policy specifically for youth users (ages 13-17)
- Clear explanations of data collection, usage, and protections
- Parent/guardian control options clearly outlined
- Compliance with relevant regulations
- US-only availability to ensure regulatory compliance

## Enhanced Enrollment Flow

### Registration Improvements

- Added ZIP code field for local resource recommendations
- Added age verification checkbox with link to youth privacy policy
- Clearer indication of which fields are required vs. optional

### Study Plan Setup Enhancements

- Learning preferences text field with helpful placeholder
- Connection between educational level and content filtering
- Improved learning style ranking with validation
- Regional content filtering based on ZIP code

## Study Plan Deliverables

### Portal Deliverables

- Interactive study plan calendar view
- Progress tracking dashboard
- Resource library organized by learning style
- Downloadable study materials (PDF guides, worksheets)
- Weekly progress reports
- Local resource recommendations based on zip code

### Email Deliverables

- Welcome email with study plan summary
- Calendar invites (.ics) for scheduled study sessions
- Bi-weekly progress summaries
- Curated resource recommendations
- Reminder emails for upcoming study sessions 