# CI/CD and Code Fixes Plan

## Completed Fixes

### CI/CD Improvements
- ✅ Fixed Dockerfile ENV syntax to use key=value format
- ✅ Created environment-specific configurations in `/environments` directory
- ✅ Updated build-artifact.yml workflow to handle environment variables
- ✅ Added health check endpoint for Docker container monitoring
- ✅ Added feature flag system in environment configurations
- ✅ Updated README.md with CI/CD documentation
- ✅ Created a script to fix linting and TypeScript issues

### Docker Build Improvements
- ✅ Fixed legacy ENV syntax in Dockerfile
- ✅ Added environment variable handling during build
- ✅ Added container HEALTHCHECK
- ✅ Set up proper build arguments

### Documentation
- ✅ Updated environment configuration documentation
- ✅ Added CI/CD workflow documentation in README
- ✅ Created environment README

## Remaining Issues

### Linting Issues

#### TypeScript `any` Types
Need to fix explicit `any` types in:
- app/api/feedback-campaign/route.ts (lines 71, 91)
- app/api/waitlist/route.ts (lines 98, 120)
- app/components/StudyPlan3D.tsx (lines 9, 37, 70)
- app/feedback/page.tsx (lines 53, 165)
- lib/supabase.ts (lines 65, 87, 115, 178, 198)

#### Unused Imports
Need to address unused imports in:
- app/components/Footer.tsx (Line 3: 'Link')
- app/components/Hero.tsx (Line 5: 'Image', Line 9: 'setEmail', Line 15: 'handleSubmit')
- app/components/Pricing.tsx (Line 4: 'Link')
- app/page.tsx (Line 3: 'useEffect')
- components/StudyPlanCard.tsx (Line 3: 'Image')
- app/landing/page.tsx (Line 4: 'Image')

#### React Hook Issues
- app/components/HowItWorks.tsx (Line 60: Fix react-hooks/exhaustive-deps warning)

#### HTML Entities Escaping
Multiple files have unescaped entities that need fixing.

### TypeScript Errors

#### Jest Testing Types
- __tests__/Header.test.tsx: Missing Jest DOM extensions (`toBeInTheDocument`, `toBeVisible`)

#### Null Safety
- app/feedback/page.tsx: Lines 9-10 - `searchParams` is possibly 'null'

#### Property Naming
- lib/email.ts: Line 61 - Use `replyTo` instead of `reply_to`

#### Function Declarations
- lib/supabase.ts: Line 133 - Function declarations not allowed in strict mode when targeting ES5

#### Import Errors
- src/app/layout.tsx: Lines 2 - Incorrect imports from "next/font/google"

## Automatic Fixing
Run the following script to automatically fix many of the linting and TypeScript issues:

```bash
./scripts/fix-lint-issues.sh
```

Note: Some issues may require manual intervention beyond what the script can fix. 