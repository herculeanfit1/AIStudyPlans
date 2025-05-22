# End of Development Session Prompt for AIStudyPlans Website

This document serves as a systematic prompt for AI agents to complete necessary cleanup tasks at the end of a development session. Follow these steps to ensure the codebase is in a maintainable, secure, and well-documented state before committing changes.

## Code Documentation & Comments

1. **Component & Function Documentation**

   - Ensure all React components have proper JSDoc comments explaining purpose, props, and usage
   - Verify TypeScript interfaces and types are well-documented, especially for study plan data structures
   - Add explanatory comments for complex AI-related algorithms or study plan generation logic
   - Document any workarounds or browser-specific fixes for 3D animations or interactive elements

2. **README & Documentation Files**

   - Update README.md with any new features or changes to the study plan generator
   - Verify installation and setup instructions are accurate, including Docker-specific instructions
   - Document environment variables and configuration options, especially for email functionality
   - Ensure all documentation references Next.js 14.2.28 and React 18.3.1 (not older versions)
   - Update docs/promptlog.md with a summary of the current development session

3. **Inline Code Comments**
   - Review code for sufficient explanatory comments, especially in complex state management for study plans
   - Add comments explaining any non-obvious design decisions in AI interactions
   - Document any performance optimizations for the 3D animations
   - Explain complex state management approaches in form submissions and validations

## Code Quality & Cleanup

1. **TypeScript & Linting**

   - Run TypeScript type checking: `npm run typecheck`
   - Fix any remaining type errors, especially in study plan data structures
   - Run ESLint: `npm run lint`
   - Address warnings and errors, especially security-related ones in API routes

2. **Dead Code Removal**

   - Remove any commented-out code that's no longer needed
   - Delete unused imports, functions, and variables
   - Clean up any debug console.log statements
   - Remove any TODO comments that have been completed, particularly in email functionality

3. **Code Formatting**
   - Ensure consistent code formatting: `npx prettier --write .`
   - Verify consistent naming conventions across the codebase (camelCase for variables, PascalCase for components)
   - Check for consistent indentation and spacing
   - Organize imports alphabetically according to the project conventions

## Testing & Validation

1. **Component Testing**

   - Ensure all critical components have tests, particularly study plan generation components
   - Verify tests pass: `npm test`
   - Add tests for any new functionality
   - Check test coverage and add additional tests if needed
   - Run Docker-based tests: `npm run test:docker:all` to ensure cross-environment compatibility

2. **Browser Compatibility**

   - Document which browsers were tested
   - Verify Safari compatibility with WebGL and 3D animations
   - Check mobile responsiveness across different viewports
   - Test dark mode functionality with next-themes implementation

3. **Accessibility Checks**
   - Verify proper semantic HTML usage
   - Check for appropriate ARIA attributes
   - Ensure proper color contrast for both light and dark themes
   - Test keyboard navigation functionality, especially in interactive study plan elements

## Build & Performance

1. **Build Verification**

   - Run a production build: `npm run build`
   - Fix any build errors (especially module resolution issues)
   - Test the production build locally: `npm run start`
   - Verify no 404s or broken resources, especially for dynamic routes

2. **Performance Optimization**

   - Check for image optimization using Next.js Image component
   - Verify code splitting is working correctly between pages
   - Optimize third-party script loading, especially for analytics
   - Address any render-blocking resources, particularly in 3D animations

3. **Bundle Analysis**
   - Run bundle analysis if available
   - Identify and fix any unusually large dependencies
   - Look for duplicate dependencies
   - Optimize client-side JavaScript, especially in animation libraries

## Security Checks

1. **Content Security Policy**

   - Verify CSP headers are properly configured
   - Check for unsafe-inline or unsafe-eval usage
   - Ensure third-party resources are properly allowed
   - Test CSP in different browsers

2. **Authentication & Authorization**

   - Review authentication mechanisms using NextAuth.js
   - Check for proper authorization controls in admin sections
   - Verify JWT or session handling security
   - Test login/logout functionality for admin users

3. **Data Validation**
   - Ensure all user inputs are properly validated
   - Verify schemas are used for validation in study plan forms
   - Check for proper error handling in API routes
   - Test form submission with invalid data, especially in the study plan generator

## Email Functionality

1. **Email Templates**

   - Verify all email templates render correctly
   - Check for responsive design in email templates
   - Test all email templates: `npm run test:email`
   - Ensure Resend API integration is working as expected

2. **Email Configuration**

   - Verify Resend API key is securely stored
   - Check FROM and REPLY-TO email addresses
   - Run email configuration verification: `npm run verify:email`
   - Test email functionality in Docker environment

3. **Notification Flow**
   - Test waitlist confirmation emails
   - Verify study plan delivery emails
   - Check administrator notification emails
   - Ensure all links in emails are working correctly

## Docker & Deployment

1. **Docker Configuration**

   - Verify Docker development environment works correctly
   - Check Docker test environment configuration
   - Ensure Docker Compose files are up-to-date
   - Test container startup with `./run-docker.sh start`

2. **Docker Cleanup**

   - Stop all running containers: `docker ps -a && docker stop $(docker ps -q)`
   - Remove project-specific containers: `docker rm $(docker ps -a -q --filter "name=aistudyplans*")`
   - Remove project-specific images: `docker rmi $(docker images "aistudyplans*" -q)`
   - Remove project-specific volumes: `docker volume rm $(docker volume ls -q --filter "name=aistudyplans*")`
   - Remove project-specific networks: `docker network rm $(docker network ls -q --filter "name=aistudyplans*")`
   - Verify cleanup was successful: `docker ps -a && docker images && docker volume ls && docker network ls`
   - Check for any lingering development processes: `ps aux | grep -E 'node|next' | grep -v grep`
   - Kill any remaining Next.js processes if needed: `kill <PID>`

3. **Azure Deployment**
   - Verify Azure Static Web Apps configuration
   - Check GitHub Action workflows for proper deployment steps
   - Ensure environment variables are properly set in Azure
   - Test production deployment process if changes were made

## Final Verification

1. **Environment Configuration**

   - Verify .env.example includes all required variables
   - Check that sensitive values aren't committed to the repo
   - Document required environment variables
   - Test with different environment configurations

2. **Cross-cutting Concerns**

   - Verify theme switching works correctly with next-themes
   - Check dark mode functionality across all components
   - Test error handling and error boundaries
   - Verify analytics integration if implemented

3. **Documentation Consistency**
   - Ensure version numbers are consistent across all docs (Next.js 14.2.28, React 18.3.1)
   - Verify links work in documentation
   - Check for outdated screenshots or examples
   - Update changelog or release notes

## Pre-commit Checklist

1. **Final Build & Tests**

   - Run final build: `npm run build`
   - Run all tests: `npm test`
   - Fix any remaining errors
   - Run Docker tests: `npm run test:docker:all`

2. **Commit Message Preparation**

   - Use conventional commit format
   - Reference issue numbers if applicable
   - Include brief description of changes
   - Mention breaking changes if any

3. **Pull Request Template**
   - Fill out PR template completely
   - Add screenshots or videos of visual changes, especially for study plan UI
   - List any manual testing performed
   - Document any known issues or limitations

By completing all sections in this checklist, you'll ensure the AIStudyPlans codebase remains high quality, well-documented, and maintainable for future development sessions.
