import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export", // Commented out for Vercel Web Deployment (Enable for APK)
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  images: { unoptimized: true },
};

export default nextConfig;
