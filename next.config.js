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
  async redirects() {
    return [
      {
        source: '/app',
        destination: 'https://app.aistudyplans.com',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig; 