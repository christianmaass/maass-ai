/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Fast Refresh optimizations
  experimental: {
    // Enable SWC for faster builds and better Fast Refresh
    forceSwcTransforms: true,
  },

  // Webpack optimizations for development
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Optimize Fast Refresh in development
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  // No env exposure: use process.env at runtime only (server-side). Do not expose secrets here.
  // Headers for better development experience
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
