/** @type {import('next').NextConfig} */
const nextConfig = {
  // This is important for serving static files correctly
  // Don't use redirects as they can cause loops
  
  // Enable output standalone for Docker
  output: 'standalone',
};

module.exports = nextConfig; 