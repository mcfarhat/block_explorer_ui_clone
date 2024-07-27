/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.BUILD_STANDALONE === "true" ? "standalone" : undefined,
  images: {
    domains: ['images.hive.blog'],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        module: false,
        'graceful-fs': false,
      };
    }
    return config;
  },
}

module.exports = nextConfig;
