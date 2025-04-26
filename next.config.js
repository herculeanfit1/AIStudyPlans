/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
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
  // Exclude backup directory from build
  distDir: '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Commenting out redirects since they don't work with static export
  // async redirects() {
  //   return [
  //     {
  //       source: '/app',
  //       destination: 'https://app.aistudyplans.com',
  //       permanent: false,
  //     },
  //   ];
  // },
};

module.exports = nextConfig; 