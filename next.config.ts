import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Re-enable for mobile builds
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    turbo: {
      resolveAlias: {
        canvas: './empty-module.ts',
      },
    },
  },
  images: { unoptimized: true },
};

export default nextConfig;
