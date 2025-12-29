import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Re-enable for mobile builds
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
};

export default nextConfig;
