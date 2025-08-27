import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Sentry integration
  sentry: {
    hideSourceMaps: true,
  },

  async redirects() {
    return [
      {
        source: '/tracks/strategy',
        destination: '/strategy-track',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
