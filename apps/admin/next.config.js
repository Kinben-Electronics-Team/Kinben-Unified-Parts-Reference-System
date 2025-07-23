/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  transpilePackages: ['@kinben/shared-types', '@kinben/data-model'],
}

module.exports = nextConfig