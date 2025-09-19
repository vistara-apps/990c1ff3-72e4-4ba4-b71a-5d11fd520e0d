/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'storage.xyz', 'cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  // Disable static optimization to prevent wagmi hook issues during build
  serverExternalPackages: ['@coinbase/onchainkit'],
  // Force dynamic rendering for pages that use client-side hooks
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },
};

export default nextConfig;
