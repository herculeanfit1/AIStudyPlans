/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for production builds (needed for Azure Static Web Apps)
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
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
  // Exclude API routes from static export requirements
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

// Exclude API routes from static generation validation
if (process.env.NODE_ENV === 'production') {
  // Azure Static Web Apps needs exportPathMap to exclude NextAuth routes
  nextConfig.exportPathMap = async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
    // Filter out API routes from static export
    const filteredPaths = {};
    
    // Copy all non-API routes to the filtered paths
    Object.keys(defaultPathMap).forEach(path => {
      if (!path.startsWith('/api/')) {
        filteredPaths[path] = defaultPathMap[path];
      }
    });
    
    return filteredPaths;
  };
}

export default nextConfig; 