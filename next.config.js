/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // We'll tighten this up once we see the actual image domain
      },
    ],
    unoptimized: true,
    domains: ['query.ampre.ca'], // Add your image domain here
  },
}

module.exports = nextConfig 