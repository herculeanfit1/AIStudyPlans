#!/bin/bash
# Script to properly install and set up Zod validation

set -e

# Colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Installing Zod validation library...${NC}"

# Check if Zod is already installed
if grep -q '"zod"' package.json; then
  echo -e "${YELLOW}Zod is already installed. Checking version...${NC}"
  INSTALLED_VERSION=$(node -e "try { console.log(require('./package.json').dependencies.zod.replace('^', '').replace('~', '')) } catch(e) { console.log('unknown') }")
  
  if [[ "$INSTALLED_VERSION" == "3.22.4" ]]; then
    echo -e "${GREEN}Zod is already installed at version 3.22.4${NC}"
  else
    echo -e "${YELLOW}Updating Zod to version 3.22.4...${NC}"
    npm install zod@3.22.4
  fi
else
  echo -e "${YELLOW}Installing Zod...${NC}"
  npm install zod@3.22.4
fi

# Check if lib/validation.ts exists
if [ -f "lib/validation.ts" ]; then
  echo -e "${GREEN}Validation file already exists at lib/validation.ts${NC}"
else
  # Create lib directory if it doesn't exist
  mkdir -p lib
  
  echo -e "${YELLOW}Creating validation file...${NC}"
  cat > lib/validation.ts << 'EOF'
import { z } from 'zod';

/**
 * Schema for the waitlist signup form data
 */
export const waitlistSchema = z.object({
  name: z.string()
    .min(1, { message: "Name is required" })
    .max(100, { message: "Name must be less than 100 characters" })
    .trim(),
  email: z.string()
    .min(1, { message: "Email is required" })
    .max(255, { message: "Email must be less than 255 characters" })
    .email({ message: "Please enter a valid email address" })
    .trim()
    .toLowerCase(),
  source: z.string()
    .max(100, { message: "Source must be less than 100 characters" })
    .optional()
    .default("website")
    .transform(val => val || "website")
});

/**
 * Type for the validated waitlist form data
 */
export type WaitlistInput = z.infer<typeof waitlistSchema>;

/**
 * Validates user input against a schema
 * @param schema The Zod schema to validate against
 * @param data The data to validate
 * @returns A result object with success status and data or error
 */
export function validateInput<T>(schema: z.ZodType<T>, data: unknown): {
  success: boolean;
  data?: T;
  error?: { [key: string]: string };
} {
  try {
    const validData = schema.parse(data);
    return {
      success: true,
      data: validData
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      // Convert ZodError to a more friendly format
      const fieldErrors: { [key: string]: string } = {};
      
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        fieldErrors[path] = err.message;
      });
      
      return {
        success: false,
        error: fieldErrors
      };
    }
    
    // For other types of errors, return a generic error
    return {
      success: false,
      error: { _form: "Invalid input data" }
    };
  }
}
EOF
  echo -e "${GREEN}Validation file created at lib/validation.ts${NC}"
fi

# Check if tsconfig.json has strict mode enabled
if grep -q '"strict": true' tsconfig.json; then
  echo -e "${GREEN}TypeScript strict mode is already enabled${NC}"
else
  echo -e "${YELLOW}TypeScript strict mode not enabled. Adding to tsconfig.json...${NC}"
  # This is a simple replacement - for more complex cases a JSON tool would be better
  sed -i.bak 's/"compilerOptions": {/"compilerOptions": {\n    "strict": true,/' tsconfig.json
  echo -e "${GREEN}TypeScript strict mode enabled in tsconfig.json${NC}"
fi

echo -e "${GREEN}Zod installation and setup complete!${NC}"
echo "Use validateInput() from lib/validation.ts to validate your forms"
echo "See docs/zod-installation-checklist.md for more details on how to use Zod" 