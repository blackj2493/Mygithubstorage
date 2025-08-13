import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['query.ampre.ca'], // IDX image domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'query.ampre.ca',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
