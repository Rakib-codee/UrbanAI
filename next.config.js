/** @type {import('next').NextConfig} */

const path = require('path');
const fs = require('fs');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    unoptimized: process.env.NODE_ENV === 'production',
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: false,
    disableOptimizedLoading: true,
  },
  // Transpile only necessary packages
  transpilePackages: ['lightningcss', 'bcrypt', 'jsonwebtoken'],
  webpack: (config, { isServer, webpack }) => {
    // Client-side polyfills
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        util: require.resolve('util/'),
        fs: false,
        net: false,
        tls: false,
        os: false,
        path: false,
        http: false,
        https: false,
        zlib: false,
      };
      
      // Add buffer polyfill
      config.plugins = [
        ...config.plugins,
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ];
    }

    // Enable case-insensitive module resolution
    config.resolve = {
      ...config.resolve,
      alias: {
        ...config.resolve.alias,
        '@/components/ui/button': path.resolve(__dirname, './src/components/ui/Button.tsx'),
        '@/components/ui/input': path.resolve(__dirname, './src/components/ui/Input.tsx'),
        '@/components/ui/label': path.resolve(__dirname, './src/components/ui/Label.tsx'),
        '@/components/ui/textarea': path.resolve(__dirname, './src/components/ui/Textarea.tsx'),
        '@/components/dashboard/charts/AreaChart': path.resolve(__dirname, './src/components/dashboard/charts/AreaChart.tsx'),
      },
    };

    // Disable parsing of problematic native modules
    config.module = {
      ...config.module,
      exprContextCritical: false,
      rules: [
        ...(config.module.rules || []),
        {
          test: /node-pre-gyp|\.html$/,
          loader: 'ignore-loader',
        },
        {
          test: /bcrypt|lightningcss/,
          loader: 'ignore-loader'
        }
      ],
    };

    config.output = {
      ...config.output,
      assetModuleFilename: 'static/[name][ext]',
    };
    
    // Disable caching to solve issues
    config.cache = false;
    
    return config;
  },
  // Production deployment settings
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  allowedDevOrigins: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'],
  serverRuntimeConfig: {
    timeoutSeconds: 60,
  },
  redirects: async () => {
    return [];
  },
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
