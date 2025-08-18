import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Enable server actions and other features
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Add webpack config for handling JSON imports
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };
    return config;
  },
};

export default nextConfig;
