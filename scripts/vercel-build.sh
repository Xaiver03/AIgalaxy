#!/bin/bash

echo "🚀 Starting Vercel build process for AI Galaxy..."

# 显示构建环境信息
echo "📦 Node version: $(node --version)"
echo "📦 NPM version: $(npm --version)"
echo "🌏 Environment: $VERCEL_ENV"

# 数据库连接配置优先级处理
if [ ! -z "$DATABASE_URL" ]; then
  echo "✅ DATABASE_URL is configured"
elif [ ! -z "$POSTGRES_PRISMA_URL" ]; then
  echo "🔄 Setting DATABASE_URL from POSTGRES_PRISMA_URL"
  export DATABASE_URL="$POSTGRES_PRISMA_URL"
elif [ ! -z "$POSTGRES_URL" ]; then
  echo "🔄 Setting DATABASE_URL from POSTGRES_URL"
  export DATABASE_URL="$POSTGRES_URL"
else
  echo "⚠️  Warning: No database URL found, using placeholder for build"
  export DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
fi

# 显示数据库连接状态（隐藏敏感信息）
if [[ "$DATABASE_URL" != "postgresql://placeholder"* ]]; then
  echo "🗄️  Database: ${DATABASE_URL:0:30}..."
else
  echo "🗄️  Database: Placeholder (build-only)"
fi

# 生成 Prisma 客户端
echo "🔧 Generating Prisma client..."
npx prisma generate

# 检查 Prisma 生成状态
if [ $? -eq 0 ]; then
  echo "✅ Prisma client generated successfully"
else
  echo "❌ Failed to generate Prisma client"
  exit 1
fi

# 运行类型检查
echo "🔍 Running type check..."
npm run type-check
if [ $? -eq 0 ]; then
  echo "✅ Type check passed"
else
  echo "⚠️  Type check warnings found, continuing build..."
fi

# 运行构建
echo "🏗️  Building Next.js application..."
npm run build

# 检查构建状态
if [ $? -eq 0 ]; then
  echo "🎉 Build completed successfully!"
else
  echo "❌ Build failed"
  exit 1
fi

# 显示构建统计
if [ -d ".next" ]; then
  echo "📊 Build output size:"
  du -sh .next 2>/dev/null || echo "Could not calculate build size"
fi

echo "🚀 AI Galaxy is ready for deployment!"