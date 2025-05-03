#!/bin/bash
set -e

# Determine if we should skip auth functionality for static export
echo "Determining build configuration..."
if [ -f "app/api/auth/[...nextauth]/route.ts" ]; then
  echo "NextAuth functionality detected - disabling static export"
  export SKIP_AUTH=false
else
  echo "NextAuth functionality not detected - enabling static export"
  export SKIP_AUTH=true
fi

# Verify all API routes have proper generateStaticParams
echo "Verifying API routes for static export compatibility..."
node scripts/verify-api-routes.js

# Special handling for NextAuth
echo "Applying special handling for NextAuth routes..."
if [ -f "app/api/auth/[...nextauth]/route.ts" ]; then
  echo "Checking NextAuth route file..."
  # Check for BOM characters and clean if needed
  if grep -q $'\xEF\xBB\xBF' "app/api/auth/[...nextauth]/route.ts"; then
    echo "Removing BOM characters from NextAuth route..."
    # Use different sed syntax based on OS (macOS vs Linux)
    if [[ "$OSTYPE" == "darwin"* ]]; then
      sed -i '' '1s/^\xEF\xBB\xBF//' "app/api/auth/[...nextauth]/route.ts"
    else
      sed -i '1s/^\xEF\xBB\xBF//' "app/api/auth/[...nextauth]/route.ts"
    fi
  fi
  
  # Completely rewrite the file to ensure proper format
  TEMP_FILE=$(mktemp)
  cat > "$TEMP_FILE" << 'EOL'
import NextAuth from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render any NextAuth routes
  return [];
}

const handler = NextAuth({
  providers: [
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Allow only specific users based on their email
      const allowedEmails = process.env.ADMIN_EMAILS?.split(',') || [];
      if (!user.email) return false;
      
      return allowedEmails.includes(user.email) || false;
    },
    async jwt({ token, user }) {
      // Pass information to the token
      if (user) {
        token.isAdmin = true;
      }
      return token;
    },
    async session({ session, token }) {
      // Pass information to the client session
      if (session.user) {
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
});

export { handler as GET, handler as POST };
EOL
  
  # Replace the original file
  mv "$TEMP_FILE" "app/api/auth/[...nextauth]/route.ts"
  echo "NextAuth route file completely rewritten for static export."
fi

# Build the app
echo "Building Next.js static export..."
NODE_ENV=production npm run build

echo "Static build completed successfully!" 