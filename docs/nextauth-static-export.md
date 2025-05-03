# NextAuth and Static Export Compatibility Guide

## Problem Statement

Next.js static export (using `output: 'export'`) is fundamentally incompatible with server-side functionality like NextAuth. When building a static export, Next.js requires all dynamic routes, including API routes like `[...nextauth]`, to have a `generateStaticParams()` function.

However, even with this function correctly implemented, NextAuth routes may still cause build failures because of their inherent server-side nature.

## Our Solution

We've implemented a multi-faceted solution that allows us to use NextAuth in development and dynamic builds, while ensuring static exports succeed for deployment:

1. **CI-Specific Build Script (`ci-build.sh`)**
   - Temporarily removes the NextAuth route during the build process
   - Restores it after the build is complete
   - Used automatically in GitHub Actions workflows

2. **Docker-Specific CI Script**
   - Created in-line during Docker build process
   - Skips NextAuth functionality for Docker builds
   - Outputs to the correct directory for deployment

3. **Environment Variable Control**
   - `SKIP_AUTH` environment variable determines if static export is enabled
   - Set automatically by our build scripts

4. **Verification Script**
   - Checks all API routes for required `generateStaticParams()` function
   - Special handling for NextAuth routes

## Local Development

During local development:

1. NextAuth works normally with `npm run dev`
2. When building for production using `npm run build`, the application still includes NextAuth

## CI/CD Pipeline

In the CI/CD pipeline:

1. The `ci-build.sh` script is used automatically in GitHub Actions
2. A Docker-specific build script is generated for Docker builds
3. NextAuth routes are temporarily removed for the static export
4. The build succeeds without server-side functionality errors
5. Output is directed to the `out` directory for Azure Static Web Apps deployment

## When to Use Which Build Script

- **Regular development**: Use `npm run dev` or `npm run build`
- **Local static export testing**: Use `./ci-build.sh`
- **GitHub Actions**: CI workflow uses `ci-build.sh`
- **Docker builds**: Docker build process creates its own script internally

## Troubleshooting

If you encounter build failures related to NextAuth:

1. Ensure all API routes have the `generateStaticParams()` function
2. Verify the NextAuth route is correctly formatted
3. For static exports, use the `ci-build.sh` script
4. For Docker builds, check the Dockerfile uses the internal script creation approach

## Technical Implementation Details

### NextAuth Route Requirements

For development and server-side rendering, each NextAuth route should include:

```typescript
// This is required for static export in Next.js
export function generateStaticParams() {
  return [];
}
```

### Static Export Logic

Our `next.config.mjs` uses this logic to determine when to enable static export:

```javascript
output: process.env.SKIP_AUTH === 'true' && process.env.NODE_ENV === 'production' 
  ? 'export' 
  : undefined,
```

This ensures static export is only enabled when:
1. We're in production mode
2. We've explicitly indicated that auth should be skipped (set by our build scripts)

### Output Directory Configuration

For Azure Static Web Apps deployment, we configure Next.js to output to the `out` directory:

```javascript
distDir: process.env.SKIP_AUTH === 'true' && process.env.NODE_ENV === 'production' 
  ? 'out' 
  : '.next',
```

### Docker Build Process

For Docker builds, we create a script inline during the build process:

```dockerfile
# Create the CI build script for Docker environment
RUN echo '#!/bin/sh' > docker-ci-build.sh && \
    echo 'set -e' >> docker-ci-build.sh && \
    echo 'export SKIP_AUTH=true' >> docker-ci-build.sh && \
    echo 'NODE_ENV=production npm run build' >> docker-ci-build.sh && \
    chmod +x docker-ci-build.sh
```

This approach ensures the script is always available during Docker builds, regardless of the state of the repository. 