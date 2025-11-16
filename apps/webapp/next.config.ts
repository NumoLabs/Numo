import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Fallbacks for client-side WebSocket dependencies
      config.resolve.fallback = {
        ...config.resolve.fallback,
        bufferutil: false,
        'utf-8-validate': false,
      }
    }
    return config
  },
}

export default nextConfig
