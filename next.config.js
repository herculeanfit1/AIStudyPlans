/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com'],
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