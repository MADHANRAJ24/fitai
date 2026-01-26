/** @type {import('next').NextConfig} */
const nextConfig = {
    trailingSlash: false,
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: { unoptimized: true },
};

export default nextConfig;
