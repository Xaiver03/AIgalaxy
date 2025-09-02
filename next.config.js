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
    optimizePackageImports: ['antd', '@ant-design/icons'],
    serverComponentsExternalPackages: ['prisma', '@prisma/client'],
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
  // Headers 配置用于性能优化
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'origin-when-cross-origin',
        },
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
    {
      source: '/_next/static/(.*)',
      headers: [
        {
          key: 'Cache-Control',
          value: 'public, max-age=31536000, immutable',
        },
      ],
    },
  ],
  // 明确配置路径映射以确保Vercel环境中正常工作
  webpack: (config, { isServer }) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '.'),
      '@/components': path.resolve(__dirname, './components'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/app': path.resolve(__dirname, './app'),
    };
    
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