# TypeScript Fixes TODO

## 1. Type Definition Consolidation

- [x] Update `FeedbackWithUser` interface to include missing fields (`email_id`, `waitlist_user_id`)
- [x] Consolidate `FeedbackResponse` type between `supabase.ts` and `types.ts`
- [x] Create interface extensions instead of duplicate definitions
- [ ] Research Supabase CLI for type generation

## 2. Custom Type Declarations

- [x] Create custom type declaration to add `maxDiffPixelRatio` to `PageScreenshotOptions`
- [x] Add custom typings for any other third-party libraries with missing types

## 3. Supabase Client Methods

- [x] Fix `.lt()` method type errors with appropriate type assertions
- [x] Add type guards for Supabase responses to handle error properties correctly
- [x] Review and fix other Supabase-related type issues

## 4. Server Code Configuration

- [x] Create separate `tsconfig.json` for the MCP server code
- [ ] Install or update server dependencies with proper typing:
  - [ ] Evaluate OpenAI SDK v4 upgrade
  - [ ] Fix Zod import and typing issues
  - [ ] Address remaining server dependency issues

## 5. Type Strictness Implementation Plan

- [x] Phase 1: Fix all current TypeScript errors with minimal compiler flags
- [ ] Phase 2: Enable `noImplicitAny: true` and fix resulting errors
- [ ] Phase 3: Enable `strictNullChecks: true` and fix resulting errors

## 6. Developer Experience Improvements

- [x] Enable incremental compilation in tsconfig.json
- [ ] Create a pre-commit hook for TypeScript linting
- [ ] Document type conventions and practices for the project
- [ ] Add automated type checking to CI/CD pipeline

## Implementation Order

1. ✅ Fix all type definition conflicts (Step 1) - COMPLETED
2. ✅ Add custom type declarations (Step 2) - COMPLETED
3. ✅ Address Supabase client method typing (Step 3) - COMPLETED
4. ✅ Configure server code separately (Step 4) - COMPLETED
5. ✅ Implement Phase 1 of gradual type strictness (Step 5) - COMPLETED
6. 🔄 Proceed to Phase 2: Enabling `noImplicitAny`
7. ⏳ Implement Phase 3 and Developer Experience improvements 