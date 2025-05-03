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