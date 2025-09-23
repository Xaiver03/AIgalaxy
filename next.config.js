/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  images: {
    domains: ['localhost', 'images.unsplash.com', 'vercel.app', 'vercel.com'],
    formats: ['image/webp', 'image/avif'],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'production',
  },
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'production',
  },
  compiler: {
    styledJsx: true,
    removeConsole: process.env.NODE_ENV === 'production',
  },
  experimental: {
    // 禁用 import 优化以规避 Webpack/React Refresh 在开发环境的已知问题
    // 需要时再在生产环境单独开启
    // optimizePackageImports: ['antd', '@ant-design/icons'],
    serverComponentsExternalPackages: ['prisma', '@prisma/client'],
    // 禁用可能导致originalFactory.call问题的特性
    esmExternals: false,
  },
  swcMinify: true,
  output: process.env.BUILD_OUTPUT === 'export' ? 'export' : (process.env.NODE_ENV === 'production' ? 'standalone' : undefined),
  trailingSlash: false,
  poweredByHeader: false,
  generateEtags: true,
  compress: true,
  // Vercel 部署优化配置
  env: {
    FORCE_CACHE_REFRESH: process.env.FORCE_CACHE_REFRESH || 'v2.1.5',
  },
  // Headers 配置用于性能优化（开发环境禁用对 _next/static 的长期缓存）
  headers: async () => {
    const isProd = process.env.NODE_ENV === 'production'
    const headers = [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=86400, stale-while-revalidate',
          },
        ],
      },
    ]

    // 仅在生产环境对 Next 静态资源使用长缓存
    if (isProd) {
      headers.push({
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      })
    } else {
      // 开发环境确保不缓存，以避免 HMR/模块 ID 不一致导致 originalFactory.call 报错
      headers.push({
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store' },
        ],
      })
    }

    return headers
  },
  // 明确配置路径映射以确保Vercel环境中正常工作
  webpack: (config, { isServer, dev }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app': path.resolve(__dirname, './app'),
    };

    // 开发环境特殊处理，解决originalFactory.call问题
    if (dev) {
      // 禁用webpack缓存以避免模块ID不一致
      config.cache = false;

      // 强制使用deterministic模块ID
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
      };

      // 处理React相关模块
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'react/jsx-dev-runtime': require.resolve('react/jsx-dev-runtime'),
        'react/jsx-runtime': require.resolve('react/jsx-runtime'),
      };
    }

    // 服务端专用优化
    if (isServer) {
      config.externals = [...(config.externals || []), 'prisma', '@prisma/client'];
    }

    return config;
  },
}

// 只在需要分析时才使用 bundle analyzer
if (process.env.ANALYZE === 'true') {
  try {
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    });
    module.exports = withBundleAnalyzer(nextConfig);
  } catch (e) {
    console.warn('Bundle analyzer not available, continuing without it');
    module.exports = nextConfig;
  }
} else {
  module.exports = nextConfig;
}
