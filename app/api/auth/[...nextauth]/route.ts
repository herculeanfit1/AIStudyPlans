import NextAuth from "next-auth";
import AzureAD from "next-auth/providers/azure-ad";
import { logAuthEvent } from "@/lib/monitoring";

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

// For debugging purposes
const logAuthEventLocal = (event: string, data: any) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[NextAuth] ${event}:`, JSON.stringify(data, null, 2));
  } else {
    // In production, log minimal information for security
    console.log(`[NextAuth] ${event} processed: ${new Date().toISOString()}`);
  }
};

const handler = NextAuth({
  providers: [
    AzureAD({
      clientId: process.env.AZURE_AD_CLIENT_ID || "",
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET || "",
      tenantId: process.env.AZURE_AD_TENANT_ID || "",
      authorization: {
        params: {
          prompt: "select_account", // Force account selection to prevent automatic login with cached credentials
          response_type: "code",
          response_mode: "query"
        },
      },
    }),
  ],
  debug: process.env.NODE_ENV === 'development',
  callbacks: {
    async signIn({ user, account }) {
      // More detailed logging
      logAuthEventLocal('signIn attempt', { 
        email: user.email,
        provider: account?.provider,
        timestamp: new Date().toISOString()
      });
      
      // Log to Application Insights
      logAuthEvent('signIn attempt', {
        email: user.email,
        provider: account?.provider
      });
      
      // Allow only the specific admin email for Azure AD
      const allowedEmails = [
        "btaiadmin@bridgingtrustai.onmicrosoft.com",
        "terence@bridgingtrust.ai" // Adding your email for testing
      ];
      
      if (!user.email) {
        console.error("[NextAuth] Sign in failed: No email provided");
        logAuthEvent('signIn failed', { reason: 'no email' });
        return false;
      }
      
      const isAllowed = allowedEmails.includes(user.email);
      console.log(`[NextAuth] User ${user.email} ${isAllowed ? 'allowed' : 'denied'} access`);
      logAuthEvent('signIn result', { 
        email: user.email, 
        allowed: isAllowed 
      });
      return isAllowed;
    },
    async jwt({ token, user, account, trigger }) {
      // Pass information to the token
      logAuthEventLocal('jwt callback', { 
        tokenEmail: token.email,
        userPresent: !!user,
        accountProvider: account?.provider,
        trigger,
        timestamp: new Date().toISOString()
      });
      
      // Log to Application Insights
      logAuthEvent('jwt callback', {
        email: token.email,
        userPresent: !!user,
        provider: account?.provider,
        trigger: trigger
      });
      
      // If this is a sign-in (user object present)
      if (user) {
        // Check specifically for admin emails
        if (["btaiadmin@bridgingtrustai.onmicrosoft.com", "terence@bridgingtrust.ai"].includes(user.email || "")) {
          token.isAdmin = true;
          console.log("[NextAuth] Admin privileges granted to token");
          logAuthEvent('admin granted', { email: user.email });
        } else {
          token.isAdmin = false;
          console.log("[NextAuth] Standard user privileges set on token");
          logAuthEvent('admin denied', { email: user.email });
        }
      }
      // If token already has isAdmin field, preserve it
      else if (typeof token.isAdmin === 'undefined') {
        // Default to false if not set
        token.isAdmin = false;
        console.log("[NextAuth] Setting default isAdmin=false on token");
        logAuthEvent('admin default', { email: token.email });
      }
      
      return token;
    },
    async session({ session, token }) {
      // Pass information to the client session
      logAuthEventLocal('session callback', { 
        sessionEmail: session.user?.email,
        tokenIsAdmin: token.isAdmin,
        timestamp: new Date().toISOString()
      });
      
      // Log to Application Insights
      logAuthEvent('session callback', {
        email: session.user?.email,
        isAdmin: token.isAdmin
      });
      
      if (session.user) {
        // Explicitly cast and set isAdmin from token
        session.user.isAdmin = !!token.isAdmin;
        console.log(`[NextAuth] Session created for ${session.user.email}, isAdmin: ${session.user.isAdmin}`);
        logAuthEvent('session created', {
          email: session.user.email,
          isAdmin: session.user.isAdmin
        });
      }
      
      return session;
    },
  },
  events: {
    async signIn(message) {
      console.log(`[NextAuth] User signed in: ${message.user.email}`);
    },
    async signOut(message) {
      console.log(`[NextAuth] User signed out: ${message.token.email}`);
    },
    async sessionError(message) {
      console.error(`[NextAuth] Session error: ${message.error}`);
    },
    async error(message) {
      console.error(`[NextAuth] Error: ${message.error}`);
    }
  },
  pages: {
    signIn: "/admin/login",
    error: "/admin/login",
    signOut: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  // Enhanced JWT settings
  jwt: {
    // Customize max age of the JWT token
    maxAge: 24 * 60 * 60, // 24 hours (make sure it matches session maxAge)
  },
  // Add cookie options for better security and debugging
  cookies: {
    // Enable secure cookies in production
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
});

export { handler as GET, handler as POST };
