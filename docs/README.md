# AIStudyPlans Documentation

Welcome to the AIStudyPlans (SchedulEd) documentation. This repository contains comprehensive documentation for the AIStudyPlans application, a Next.js-based platform for generating AI-powered study plans.

## Documentation Overview

This documentation is organized into several sections, each focusing on a specific aspect of the application:

1. [**Codebase Documentation**](./CODEBASE.md) - Overall codebase structure and architecture
2. [**API Documentation**](./API.md) - Details about API endpoints and usage
3. [**Email Service Documentation**](./EMAIL.md) - Email configuration, templates, and utilities
4. [**Components Documentation**](./COMPONENTS.md) - Frontend components and their usage
5. [**Project Status**](./project-status.md) - Current implementation status and roadmap
6. [**TODO List**](./TODO.md) - Current development tasks and progress

## Getting Started

If you're new to the project, we recommend starting with the following documents:

1. Start with the [Codebase Documentation](./CODEBASE.md) to understand the overall structure
2. Review the [Project Status](./project-status.md) to learn about the current state of development
3. Explore the [Components Documentation](./COMPONENTS.md) to understand the frontend UI

## Local Development

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher
- A Resend API key for email functionality

### Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/AIStudyPlans.git
   cd AIStudyPlans
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the following environment variables:
   ```
   RESEND_API_KEY=your_resend_api_key
   EMAIL_FROM=Lindsey <lindsey@aistudyplans.com>
   EMAIL_REPLY_TO=support@aistudyplans.com
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Using Docker

Alternatively, you can use Docker for development:

```bash
./run-docker.sh start
```

This will start the application in a Docker container, and you can access it at [http://localhost:3001](http://localhost:3001).

## Testing

The application includes a testing infrastructure:

1. **Unit Tests**:
   ```bash
   npm run test
   ```

2. **End-to-End Tests**:
   ```bash
   npm run test:e2e
   ```

## Email Testing

To test the email functionality:

1. Ensure you have a valid Resend API key in your `.env.local` file
2. Run the test script:
   ```bash
   node test-resend.js your-email@example.com
   ```

## Project Structure Highlights

- `app/` - Next.js 14 App Router directory
- `app/api/` - API routes
- `app/components/` - Client-side components
- `lib/` - Utility functions and services
- `docs/` - Documentation files
- `public/` - Static assets

## Future Development

The application is currently in the initial development phase. Key features planned for future implementation include:

1. User authentication system
2. Database integration for storing user data
3. AI-powered study plan generation
4. Study plan management and tracking
5. Dashboard functionality

For a complete list of planned tasks, see the [TODO List](./TODO.md).

## Contact

For questions about the documentation or the project, please contact the development team at support@aistudyplans.com. 