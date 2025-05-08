# Dependency Troubleshooting Guide

This guide covers common dependency issues you might encounter in this project and how to resolve them.

## Common Issues

### 1. White Screen / Module Not Found Errors

If you encounter a white screen in the browser or "Module not found" errors:

```
Error: Cannot find module 'some-package'
```

**Solution:**

```bash
# Option 1: Run our fix utility
npm run fix:deps
# Choose option 6 (Clean reinstall)

# Option 2: Manual fix
rm -rf node_modules package-lock.json
npm install
```

### 2. Dependency Version Conflicts

If you see warnings about peer dependencies or conflicting versions:

```
npm WARN ERESOLVE overriding peer dependency "react"
```

**Solution:**

```bash
# Run our dependency deduplication
npm run dedupe

# If that doesn't work, try the fixer utility
npm run fix:deps
# Choose option 7 (Fix peer dependency issues)
```

### 3. Missing date-fns Dependency

The monitoring dashboard component requires date-fns, which might cause errors if missing:

```
Error: Cannot find module 'date-fns' or its corresponding type declarations
```

**Solution:**

```bash
npm install date-fns@4.1.0 --save-exact
npm shrinkwrap
```

### 4. Authentication/Session Issues

White screens in admin areas are often caused by authentication issues. Try these solutions:

1. Visit `/monitoring-test` which doesn't require authentication
2. Use the `/admin-auth-fix.html` utility page
3. Open browser console and run:
   ```javascript
   localStorage.setItem('isAdmin', 'true');
   document.cookie = "isAdmin=true; path=/; max-age=86400";
   ```

### 5. Server Port Conflicts

If you see errors about port 3000 being in use:

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**

```bash
# Kill existing processes on port 3000
lsof -ti:3000 | xargs kill -9 2>/dev/null

# Or specify a different port
PORT=3001 npm run dev
```

## Using the Dependency Fixer

Our custom dependency fixer utility provides an interactive way to solve most issues:

```bash
npm run fix:deps
```

This tool offers various options:
- Fix security vulnerabilities
- Check for outdated dependencies
- Remove duplicate dependencies
- Generate npm-shrinkwrap.json
- Clean reinstall dependencies
- Fix peer dependency issues
- Run all health checks

## Verifying Dependency Health

To check if dependencies are following our standards:

```bash
npm run validate:deps
```

This will verify:
- All dependencies use exact versions
- npm-shrinkwrap.json exists
- Node.js and npm version requirements are specified
- .npmrc is properly configured

## When All Else Fails

If you've tried everything and still have issues:

1. Document the error you're seeing (screenshot or copy/paste)
2. Check the console output for specific error messages
3. Try the server on a different port: `PORT=3003 npm run dev`
4. Contact a senior team member for assistance 