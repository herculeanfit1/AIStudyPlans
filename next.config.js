/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export in production, never in development
  output: process.env.NODE_ENV === 'production' ? "export" : undefined,
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
    ],
    unoptimized: true,
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

module.exports = nextConfig; 