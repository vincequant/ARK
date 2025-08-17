/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,
  },
  reactStrictMode: true,
  swcMinify: true,
};

export default nextConfig;