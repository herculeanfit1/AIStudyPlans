/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable output standalone for Docker
  output: 'standalone',
  images: {
    domains: ['randomuser.me'],
  },
};

module.exports = nextConfig; 