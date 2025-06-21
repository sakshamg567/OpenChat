import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  rewrites: async () => {
    return [
      {
        source: '/((?!api/).*)',
        destination: '/static-app-shell'
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(md|MD|LICENSE|node|d\.ts)$/,
      use: 'null-loader',
    });
    return config;
  },
};

export default nextConfig;
