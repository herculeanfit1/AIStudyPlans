# Static Export API Routes Fix Documentation

## Problem

Next.js with `output: 'export'` (static export) requires all dynamic route segments to have a `generateStaticParams` function. This includes API routes like `[...nextauth]` and other dynamic routes. Without this function, the build fails with an error like:

```
Error: Page '/api/auth/[...nextauth]' is missing 'generateStaticParams()' so it cannot be used with 'output: export' config.
```

## Solution Implemented

1. **Added `generateStaticParams` function to all API routes**
   - Each API route file now includes:
   ```typescript
   export function generateStaticParams() {
     return [];
   }
   ```

2. **Created verification script**
   - Created `scripts/verify-api-routes.js` to check all API routes for `generateStaticParams` function
   - This script scans all route files in the `app/api` directory to ensure compliance

3. **Updated build process**
   - Modified `build-static.sh` to run the verification script before building
   - Enhanced the Dockerfile to use the `build-static.sh` script for production builds

4. **Configuration updates**
   - Updated Next.js configuration to handle static exports properly
   - Ensured all API routes will be properly included in the static export

## Implementation Details

### API Route Requirements

For each API route file (e.g., `app/api/*/route.ts`), the following function must be included:

```typescript
// This is required for static export in Next.js
export function generateStaticParams() {
  return [];
}
```

The function returns an empty array because API routes don't need to be pre-rendered with specific parameters.

### Verification Process

The verification script (`scripts/verify-api-routes.js`) performs these steps:
1. Recursively find all API route files in the `app/api` directory
2. Check if each file contains the required `generateStaticParams` function
3. Fail the build if any API route is missing the function

### Build Process Integration

The `build-static.sh` script now:
1. Runs the verification script to ensure all API routes are compliant
2. Only proceeds with the build if all routes are properly configured
3. Executes the Next.js production build with static export

### Docker Integration

The Dockerfile has been updated to:
1. Use `build-static.sh` for production builds
2. Use the standard build process for non-production environments

## Future Maintenance

When adding new API routes:
1. Always include the `generateStaticParams` function
2. Run the verification script locally before committing
3. Keep this documentation updated with any changes to the approach

## Troubleshooting

If build failures occur:
1. Run `node scripts/verify-api-routes.js` to identify any non-compliant routes
2. Add the missing `generateStaticParams` function to any flagged files
3. Verify the build locally with `./build-static.sh` 