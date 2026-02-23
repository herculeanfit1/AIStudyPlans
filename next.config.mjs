/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: process.env.NODE_ENV !== "production",
  swcMinify: true,
  // Set environment variables for client-side access
  env: {
    // Make email configuration status available on the client side
    // This is safe because it doesn't expose the actual API key, just whether it's configured
    NEXT_PUBLIC_RESEND_CONFIGURED: process.env.RESEND_API_KEY && 
                                   process.env.EMAIL_FROM && 
                                   process.env.EMAIL_REPLY_TO ? 'true' : 'false',
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Enable trailing slashes for Azure Static Web Apps compatibility
  trailingSlash: false,
  // Experimental features
  experimental: {
    // Suppress the useSearchParams warnings in client components
    missingSuspenseWithCSRBailout: false,
  },
  pageExtensions: ["js", "jsx", "ts", "tsx"],
};

export default nextConfig;
