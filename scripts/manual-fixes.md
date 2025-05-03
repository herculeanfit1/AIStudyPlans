# Manual Fixes for Linting and TypeScript Issues

Since our automated approach caused issues with React components, here are the individual fixes needed:

## TypeScript Fixes

1. **Fix TypeScript `any` types in API routes**:
   - In `app/api/feedback-campaign/route.ts` (lines 71, 91): Add specific error types
   - In `app/api/waitlist/route.ts` (lines 98, 120): Add specific error types
   - In `lib/supabase.ts` (lines 65, 87, 115, 178, 198): Create interface for error type

2. **Fix null safety for searchParams**:
   - In `app/feedback/page.tsx` (Lines 9-10): Update to use optional chaining
   ```typescript
   const userId = searchParams?.get('userId');
   const emailId = searchParams?.get('emailId');
   ```

3. **Fix property naming in email.ts**:
   - In `lib/email.ts` (Line 61): Change `reply_to` to `replyTo`

4. **Fix src/app/layout.tsx font imports**:
   - Replace `import { Geist, Geist_Mono } from "next/font/google";` with `import { Inter } from "next/font/google";`
   - Replace `const geist = Geist` with `const geist = Inter`
   - Replace `const geistMono = Geist_Mono` with `// const geistMono = Inter`

## Fix ESLint Configuration

Update `.eslintrc.json` to:

```json
{
  "extends": [
    "next/core-web-vitals",
    "next/typescript"
  ],
  "plugins": [
    "@typescript-eslint",
    "unused-imports"
  ],
  "rules": {
    "unused-imports/no-unused-imports": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "react/no-unescaped-entities": "off"
  }
}
```

## Fix Jest Testing Types

Add to `jest.setup.js`:
```javascript
import '@testing-library/jest-dom';
```

## Steps for Implementation

1. Install the eslint plugin for unused imports:
   ```bash
   npm install -D eslint-plugin-unused-imports
   ```

2. Update the eslint configuration
3. Add testing library types
4. Go through each file and make the recommended fixes manually

## Final Verification

After making these changes, run:

```bash
npm run lint
npm run typecheck
``` 