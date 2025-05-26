/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  // Configuración para monorepo
  transpilePackages: ['@radix-ui/react-progress', '@radix-ui/react-separator', '@radix-ui/react-slider']
}

module.exports = nextConfig 