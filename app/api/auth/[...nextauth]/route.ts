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
  interface JWT {
    isAdmin?: boolean;
  }
}

const handler = NextAuth({
  providers: [
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "",
      authorization: {
        params: {
          prompt: "select_account",
          response_type: "code",
          response_mode: "query"
        },
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account }) {
      // Allow only the specific admin emails
      const allowedEmails = [
        "btaiadmin@bridgingtrustai.onmicrosoft.com",
        "terence@bridgingtrust.ai"
      ];
      
      if (!user.email) {
        console.error("[NextAuth] Sign in failed: No email provided");
        return false;
      }
      
      const isAllowed = allowedEmails.includes(user.email);
      console.log(`[NextAuth] User ${user.email} ${isAllowed ? 'allowed' : 'denied'} access`);
      return isAllowed;
    },
    async jwt({ token, user }) {
      // If this is a sign-in (user object present)
      if (user) {
        // Check specifically for admin emails
        const adminEmails = ["btaiadmin@bridgingtrustai.onmicrosoft.com", "terence@bridgingtrust.ai"];
        token.isAdmin = adminEmails.includes(user.email || "");
        console.log(`[NextAuth] Admin privileges ${token.isAdmin ? 'granted' : 'denied'} to ${user.email}`);
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.isAdmin = !!token.isAdmin;
        console.log(`[NextAuth] Session created for ${session.user.email}, isAdmin: ${session.user.isAdmin}`);
      }
      
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 24 * 60 * 60, // 24 hours
  },
});

export { handler as GET, handler as POST };
