import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),

  compiler: {
    // The codebase logs ~700 times, much of it wallet addresses, balances and
    // raw RPC payloads. Strip it from production builds rather than auditing
    // every call site; `console.error`/`warn` are kept so real failures still
    // reach the server logs and the browser console.
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? { exclude: ['error', 'warn'] }
        : false,
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Don't leak full URLs (which can carry wallet addresses in paths) to
          // third-party origins.
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },

  // `bufferutil` and `utf-8-validate` are optional native add-ons of `ws`. They
  // cannot be bundled for the browser, so they are stubbed out — the pure-JS
  // fallbacks in `ws` take over.
  //
  // Next 16 builds with Turbopack by default, which does not read the `webpack`
  // key, so the same stub is declared for both bundlers.
  turbopack: {
    resolveAlias: {
      bufferutil: './lib/empty-module.js',
      'utf-8-validate': './lib/empty-module.js',
    },
  },

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
