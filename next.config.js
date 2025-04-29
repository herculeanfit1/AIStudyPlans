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
  }
};

module.exports = nextConfig; 