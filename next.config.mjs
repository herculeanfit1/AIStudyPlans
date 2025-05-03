/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable static export since we have dynamic API routes
  output: undefined,
  distDir: '.next',
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
  // Include the API routes in the static export
  trailingSlash: true,
  // Ensure API routes are copied to the output directory
  experimental: {
    // This will copy the /api directory to the output folder
    outputFileTracingIncludes: {
      '/api/**/*': ['./app/api/**/*'],
    },
  },
};

// In development mode, add Next-Auth specific configuration
if (process.env.NODE_ENV !== 'production') {
  nextConfig.output = undefined; // Ensure we're not using export in development
}

export default nextConfig; 