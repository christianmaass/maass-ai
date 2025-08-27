import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
