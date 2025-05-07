import NextAuth from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render any NextAuth routes
  return [];
}

// Extend the Session interface to include the isAdmin property
declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isAdmin?: boolean;
    }
  }
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
      // Allow only the specific admin email for Azure AD
      const allowedEmails = ["btaiadmin@bridgingtrustai.onmicrosoft.com"];
      if (!user.email) return false;
      return allowedEmails.includes(user.email);
    },
    async jwt({ token, user }) {
      // Pass information to the token
      if (user && user.email === "btaiadmin@bridgingtrustai.onmicrosoft.com") {
        token.isAdmin = true;
      } else {
        token.isAdmin = false;
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
