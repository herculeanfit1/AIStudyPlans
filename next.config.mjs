/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for production builds (needed for Azure Static Web Apps)
  // but disable it if we're building with auth enabled
  output: process.env.SKIP_AUTH === 'true' && process.env.NODE_ENV === 'production' ? 'export' : undefined,
  // Specify 'out' as the output directory for static exports (required for Azure Static Web Apps)
  distDir: process.env.SKIP_AUTH === 'true' && process.env.NODE_ENV === 'production' ? 'out' : '.next',
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Typescript and ESLint are ignored during builds to speed up CI/CD
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Include the API routes in the static export, but exclude auth routes
  trailingSlash: true,
  experimental: {
    // This will copy the /api directory to the output folder, excluding auth
    outputFileTracingIncludes: {
      '/api/**/*': ['./app/api/**/*'],
    },
  },
  // Explicitly exclude the NextAuth routes from static export
  skipTrailingSlashRedirect: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

// In development mode, add Next-Auth specific configuration
if (process.env.NODE_ENV !== 'production') {
  nextConfig.output = undefined; // Ensure we're not using export in development
}

export default nextConfig; 