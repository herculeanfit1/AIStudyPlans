# NextAuth and Static Export Compatibility Guide

## Problem Statement

Next.js static export (using `output: 'export'`) is fundamentally incompatible with server-side functionality like NextAuth. When building a static export, Next.js requires all dynamic routes, including API routes like `[...nextauth]`, to have a `generateStaticParams()` function.

However, even with this function correctly implemented, NextAuth routes may still cause build failures because of their inherent server-side nature.

## Our Solution

We've implemented a multi-faceted solution that allows us to use NextAuth in development and dynamic builds, while ensuring static exports succeed for deployment:

1. **CI-Specific Build Script (`ci-build.sh`)**
   - Temporarily removes the NextAuth route during the build process
   - Restores it after the build is complete
   - Used automatically in the CI/CD pipeline

2. **Environment Variable Control**
   - `SKIP_AUTH` environment variable determines if static export is enabled
   - Set automatically by our build scripts

3. **Verification Script**
   - Checks all API routes for required `generateStaticParams()` function
   - Special handling for NextAuth routes

## Local Development

During local development:

1. NextAuth works normally with `npm run dev`
2. When building for production using `npm run build`, the application still includes NextAuth

## CI/CD Pipeline

In the CI/CD pipeline:

1. The `ci-build.sh` script is used automatically in the Dockerfile
2. NextAuth routes are temporarily removed for the static export
3. The build succeeds without server-side functionality errors
4. NextAuth routes are restored in the repository

## When to Use Which Build Script

- **Regular development**: Use `npm run dev` or `npm run build`
- **Local static export testing**: Use `./ci-build.sh`
- **CI/CD pipeline**: The Dockerfile automatically uses `ci-build.sh`

## Troubleshooting

If you encounter build failures related to NextAuth:

1. Ensure all API routes have the `generateStaticParams()` function
2. Verify the NextAuth route is correctly formatted
3. For static exports, use the `ci-build.sh` script

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