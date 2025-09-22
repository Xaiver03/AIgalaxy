# 🐳 AI Agent Platform Docker部署保姆级指南

> 📌 **本指南将手把手教你完成从零开始的Docker部署，提供多种经济实惠的镜像仓库选择。**

## 📋 目录

1. [准备工作](#准备工作)
2. [方案选择](#方案选择)
3. [方案A: GitHub Actions自动化部署（推荐）](#方案a-github-actions自动化部署推荐)
4. [方案B: 手动Docker部署](#方案b-手动docker部署)
5. [验证和测试](#验证和测试)
6. [常见问题解决](#常见问题解决)

---

## 🔧 准备工作

### 需要准备的账号和工具

- [ ] **腾讯云服务器** - Ubuntu 20.04或更高版本
- [ ] **本地Docker** - 已安装Docker Desktop
- [ ] **镜像仓库账号**（选择一种即可）：
  - [ ] **Docker Hub账号**（推荐，免费）
  - [ ] **阿里云容器镜像服务**（免费）
  - [ ] **腾讯云容器镜像服务**（付费，但速度快）
- [ ] **域名**（可选）- 用于HTTPS访问

### 本地环境检查

```bash
# 1. 检查Docker是否安装
docker --version
# 应该显示: Docker version 20.x.x 或更高

# 2. 检查Docker是否运行
docker ps
# 应该显示表头，没有错误

# 3. 进入项目目录
cd /Users/rocalight/同步空间/miracleplus/ai-agent-platform
pwd
# 应该显示: /Users/rocalight/同步空间/miracleplus/ai-agent-platform
```

---

## 🎯 方案选择

根据你的需求选择合适的部署方案：

### 方案A：GitHub Actions自动化部署（推荐⭐）

**优势**：
- ✅ **完全自动化** - git push后3分钟自动部署
- ✅ **零运维成本** - 无需手动操作
- ✅ **多镜像仓库支持** - Docker Hub/阿里云/腾讯云自动选择
- ✅ **实时监控** - 部署过程可视化
- ✅ **版本控制** - 自动打tag和版本管理

**适合**：正式项目、团队开发、持续集成

### 方案B：手动Docker部署

**优势**：
- ✅ **简单直接** - 本地构建，手动部署
- ✅ **完全控制** - 每步操作都可自定义
- ✅ **学习价值** - 理解Docker部署原理

**适合**：学习研究、一次性部署、小项目

---

## 🚀 方案A: GitHub Actions自动化部署（推荐）

> 💡 **一次配置，终身受益！代码推送即自动部署**

### 🔄 自动化流程图

```
本地修改代码 → git push → GitHub Actions → Docker构建 → 推送镜像 → 服务器部署 → 应用重启
     ↓              ↓            ↓             ↓          ↓          ↓         ↓
  修改文件        推送main      自动触发        构建镜像    推送仓库    SSH连接    健康检查
```

### 第1步：Fork项目到你的GitHub

1. **访问项目地址**：https://github.com/Xaiver03/AIgalaxy
2. **点击右上角 Fork 按钮**
3. **选择你的GitHub账号**，创建副本

### 第2步：配置Docker Hub（免费镜像仓库）

#### 2.1 注册Docker Hub账号

1. 访问：https://hub.docker.com/
2. 点击 **Sign Up** 注册账号
3. 验证邮箱并登录

#### 2.2 创建访问令牌

1. 登录Docker Hub后，点击右上角头像
2. 选择 **Account Settings**
3. 点击左侧 **Security**
4. 点击 **New Access Token**
5. 填写Token名称：`github-actions`
6. 选择权限：**Read, Write, Delete**
7. 点击 **Generate** 并**复制保存令牌**

### 第3步：配置服务器SSH密钥

#### 3.1 生成专用SSH密钥

```bash
# 在本地终端执行
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_actions_rsa

# 查看私钥（用于GitHub）
cat ~/.ssh/github_actions_rsa

# 查看公钥（用于服务器）
cat ~/.ssh/github_actions_rsa.pub
```

#### 3.2 配置服务器SSH访问

```bash
# 1. SSH连接到服务器
ssh root@你的服务器IP

# 2. 添加公钥到授权文件
mkdir -p ~/.ssh
echo "你的公钥内容" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
chmod 700 ~/.ssh

# 3. 测试SSH连接（在本地执行）
ssh -i ~/.ssh/github_actions_rsa root@你的服务器IP
# 能正常连接说明配置成功
```

### 第4步：配置GitHub Secrets

1. **进入你Fork的仓库页面**
2. **点击 Settings → Secrets and variables → Actions**
3. **点击 New repository secret**，添加以下配置：

#### 必需的Secrets配置：

| Secret名称 | 值 | 获取方式 |
|-----------|-----|---------|
| **Docker Hub配置** |
| `DOCKER_HUB_USERNAME` | `你的Docker Hub用户名` | Docker Hub个人页面 |
| `DOCKER_HUB_TOKEN` | `dckr_pat_xxx...` | 第2步生成的令牌 |
| **服务器SSH配置** |
| `HOST` | `192.168.1.100` | 你的服务器IP |
| `USERNAME` | `root` | SSH用户名 |
| `SSH_KEY` | `-----BEGIN RSA PRIVATE KEY-----...` | 第3步生成的私钥**完整内容** |
| `PORT` | `22` | SSH端口 |
| **应用环境配置** |
| `DATABASE_URL` | `postgresql://user:pass@host:5432/db` | PostgreSQL连接字符串 |
| `SESSION_SECRET` | `至少32位随机字符串` | `openssl rand -base64 48` |

#### 添加Secret详细步骤：

```bash
# 1. 点击 "New repository secret"
# 2. Name: DOCKER_HUB_USERNAME
# 3. Secret: 你的Docker Hub用户名
# 4. 点击 "Add secret"
# 5. 重复添加所有其他secrets
```

### 第5步：配置服务器环境

#### 5.1 安装Docker

```bash
# SSH到服务器
ssh root@你的服务器IP

# 安装Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 启动Docker
sudo systemctl start docker
sudo systemctl enable docker

# 验证安装
docker --version
```

#### 5.2 创建数据库

```bash
# 创建PostgreSQL容器
docker run -d \
  --name postgres \
  -e POSTGRES_DB=ai_galaxy \
  -e POSTGRES_USER=ai_galaxy_user \
  -e POSTGRES_PASSWORD=your_secure_password \
  -p 5432:5432 \
  --restart unless-stopped \
  -v /opt/postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine

# 验证数据库运行
docker ps | grep postgres
```

### 第6步：测试自动部署

#### 6.1 触发首次部署

```bash
# 1. 克隆你Fork的仓库
git clone https://github.com/你的用户名/AIgalaxy.git
cd AIgalaxy

# 2. 做一个测试修改
echo "# Auto Deploy Test $(date)" >> README.md

# 3. 提交并推送（这会触发自动部署）
git add README.md
git commit -m "test: trigger auto deployment"
git push origin main
```

#### 6.2 监控部署过程

1. **打开GitHub Actions页面**：
   ```
   https://github.com/你的用户名/AIgalaxy/actions
   ```

2. **查看运行的工作流**：
   - 点击最新的 "🐳 Docker Build and Deploy"
   - 实时查看构建和部署日志
   - 整个过程约3-5分钟

3. **查看部署结果**：
   ```bash
   # 访问你的应用
   curl http://你的服务器IP:3000/api/health
   # 应该返回: {"status":"healthy"}
   ```

### 第7步：日常开发流程

**现在你的开发流程变成：**

```bash
# 1. 本地开发
# 修改代码...

# 2. 提交更改
git add .
git commit -m "feat: 添加新功能"
git push origin main

# 3. 自动部署（无需任何操作）
# GitHub Actions会自动：
# - 构建Docker镜像
# - 推送到Docker Hub
# - SSH到服务器
# - 更新容器
# - 健康检查

# 4. 3分钟后访问查看更新
curl http://你的服务器IP:3000
```

### 🎊 恭喜！自动化部署配置完成

**你现在拥有了：**
- ✅ 代码推送即自动部署
- ✅ 实时构建和部署监控  
- ✅ 自动化健康检查
- ✅ 版本控制和回滚能力

---

## 🛠️ 方案B: 手动Docker部署

> 📚 **适合学习Docker原理，理解每个部署步骤**

### 🔄 更新流程（方案B）

当你需要手动更新应用时：

```bash
# 1. 本地重新构建镜像
cd /Users/rocalight/同步空间/miracleplus/ai-agent-platform
docker build -f deploy/docker/Dockerfile -t ai-agent-platform:latest .

# 2. 推送新镜像到你选择的仓库
# Docker Hub:
docker push your-username/ai-agent-platform:latest
# 或阿里云:
docker push registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-agent-platform:latest

# 3. 服务器更新
ssh root@your-server-ip
docker pull your-username/ai-agent-platform:latest
docker stop ai-agent-platform
docker rm ai-agent-platform
# 重新运行容器（使用之前的命令）
```

### 🏗️ 本地Docker镜像构建

#### 步骤1：检查Docker配置文件

```bash
# 查看Dockerfile是否存在
ls deploy/docker/Dockerfile
# 应该显示: deploy/docker/Dockerfile

# 查看docker-compose.yml
ls deploy/docker/docker-compose.yml
# 应该显示: deploy/docker/docker-compose.yml
```

#### 步骤2：准备环境变量

```bash
# 1. 复制环境变量模板
cp deploy/docker/.env.example deploy/docker/.env

# 2. 打开编辑器修改配置
nano deploy/docker/.env
# 或使用你喜欢的编辑器: code deploy/docker/.env
```

**必须修改的配置项：**

```env
# 数据库密码（修改为你自己的强密码）
DB_PASSWORD=your_secure_database_password_2024

# Redis密码（修改为你自己的强密码）
REDIS_PASSWORD=your_secure_redis_password_2024

# 会话密钥（必须至少32个字符）
SESSION_SECRET=your-super-secret-session-key-minimum-32-characters-long-change-this

# 管理员邮箱（修改为你的邮箱）
ADMIN_EMAIL=your-email@example.com

# 管理员密码（修改为强密码）
ADMIN_PASSWORD=your_secure_admin_password_2024

# 域名（如果有域名就填写，没有就用IP）
DOMAIN=your-server-ip-or-domain.com
APP_URL=http://your-server-ip-or-domain.com
```

### 步骤3：构建Docker镜像

```bash
# 1. 确保在项目根目录
pwd
# 应该显示: /Users/rocalight/同步空间/miracleplus/ai-agent-platform

# 2. 构建镜像（这一步需要5-10分钟）
docker build -f deploy/docker/Dockerfile -t ai-agent-platform:latest .

# 3. 查看构建进度
# 你会看到类似这样的输出：
# [+] Building 120.5s (23/23) FINISHED
# => [internal] load build definition from Dockerfile
# => [internal] load .dockerignore
# ... 更多构建步骤 ...
```

### 步骤4：验证镜像构建成功

```bash
# 查看构建的镜像
docker images | grep ai-agent-platform

# 应该看到类似输出：
# ai-agent-platform   latest   714b87450c9e   2 minutes ago   443MB
```

**🎉 如果看到镜像信息，说明构建成功！**

---

## 📦 镜像仓库选择

选择一种适合你的镜像仓库方案：

### 方案1：Docker Hub（推荐，免费）

**优势**：
- ✅ 完全免费
- ✅ 全球CDN加速
- ✅ 简单易用
- ✅ 支持私有仓库（免费1个）

**注册地址**：https://hub.docker.com/

**步骤**：
1. 注册Docker Hub账号
2. 登录并创建仓库（可选私有）

### 方案2：阿里云容器镜像服务（推荐，免费）

**优势**：
- ✅ 完全免费
- ✅ 国内访问速度快
- ✅ 个人版支持私有仓库
- ✅ 中文界面友好

**注册地址**：https://cr.console.aliyun.com/

**步骤**：
1. 注册阿里云账号
2. 开通容器镜像服务（个人版免费）
3. 创建命名空间

### 方案3：直接传输镜像文件（最省钱）

**优势**：
- ✅ 完全免费
- ✅ 不依赖外部服务
- ✅ 适合小团队

**缺点**：
- ❌ 需要手动传输文件
- ❌ 更新时需要重新传输

---

## 📤 推送镜像

### 方案1：推送到Docker Hub

```bash
# 1. 登录Docker Hub
docker login

# 输入你的Docker Hub用户名和密码
Username: your-dockerhub-username
Password: your-dockerhub-password

# 2. 标记镜像（替换your-username为你的用户名）
docker tag ai-agent-platform:latest your-username/ai-agent-platform:latest
docker tag ai-agent-platform:latest your-username/ai-agent-platform:$(date +%Y%m%d-%H%M)

# 3. 推送镜像
docker push your-username/ai-agent-platform:latest
docker push your-username/ai-agent-platform:$(date +%Y%m%d-%H%M)

# 4. 验证推送成功
# 访问: https://hub.docker.com/r/your-username/ai-agent-platform
```

### 方案2：推送到阿里云

```bash
# 1. 登录阿里云镜像仓库
docker login --username=your-aliyun-username registry.cn-hangzhou.aliyuncs.com

# 2. 标记镜像
docker tag ai-agent-platform:latest registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-agent-platform:latest

# 3. 推送镜像
docker push registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-agent-platform:latest
```

### 方案3：直接传输镜像文件

```bash
# 1. 将镜像保存为文件
docker save ai-agent-platform:latest -o ai-agent-platform.tar

# 2. 压缩文件
gzip ai-agent-platform.tar

# 3. 上传到服务器
scp ai-agent-platform.tar.gz root@your-server-ip:/tmp/

# 4. 在服务器上加载镜像
ssh root@your-server-ip
cd /tmp
gunzip ai-agent-platform.tar.gz
docker load -i ai-agent-platform.tar
```

---

## 🖥️ 腾讯云服务器部署

### 步骤1：连接到服务器

```bash
# 使用SSH连接到你的腾讯云服务器
ssh root@你的服务器IP

# 例如：
ssh root@192.144.154.224
```

### 步骤2：安装Docker（如果未安装）

```bash
# 1. 更新系统
sudo apt update && sudo apt upgrade -y

# 2. 安装Docker（一键安装脚本）
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. 启动Docker
sudo systemctl start docker
sudo systemctl enable docker

# 4. 验证安装
docker --version
```

### 步骤3：配置Docker镜像加速（可选但推荐）

```bash
# 创建Docker配置目录
sudo mkdir -p /etc/docker

# 配置镜像加速器（使用阿里云加速器）
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": [
    "https://docker.mirrors.ustc.edu.cn",
    "https://hub-mirror.c.163.com",
    "https://mirror.baidubce.com"
  ]
}
EOF

# 重启Docker
sudo systemctl daemon-reload
sudo systemctl restart docker
```

### 步骤4：创建必要的目录

```bash
# 1. 创建应用目录
mkdir -p /opt/ai-agent-platform/data
mkdir -p /opt/ai-agent-platform/uploads

# 2. 设置权限
chmod -R 755 /opt/ai-agent-platform
```

### 步骤5：创建网络（推荐）

```bash
# 创建自定义Docker网络
docker network create ai-network
```

### 步骤6：创建PostgreSQL数据库

```bash
# 1. 运行PostgreSQL容器
docker run -d \
  --name postgres \
  --network ai-network \
  -e POSTGRES_DB=ai_galaxy \
  -e POSTGRES_USER=ai_galaxy_user \
  -e POSTGRES_PASSWORD=your_database_password \
  -p 5432:5432 \
  --restart unless-stopped \
  -v /opt/ai-agent-platform/postgres-data:/var/lib/postgresql/data \
  postgres:15-alpine

# 2. 验证数据库运行
docker ps | grep postgres
```

### 步骤7：创建Redis缓存服务

```bash
# 1. 运行Redis容器
docker run -d \
  --name redis \
  --network ai-network \
  -p 6379:6379 \
  --restart unless-stopped \
  redis:7-alpine redis-server --requirepass your_redis_password

# 2. 验证Redis运行
docker ps | grep redis
```

### 步骤8：运行应用容器

**选择对应的镜像源**：

#### 使用Docker Hub镜像

```bash
# 1. 拉取镜像
docker pull your-username/ai-agent-platform:latest

# 2. 运行应用
docker run -d \
  --name ai-agent-platform \
  --network ai-network \
  -p 3000:3000 \
  --restart unless-stopped \
  -v /opt/ai-agent-platform/data:/app/data \
  -v /opt/ai-agent-platform/uploads:/app/public/uploads \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://ai_galaxy_user:your_database_password@postgres:5432/ai_galaxy" \
  -e REDIS_URL="redis://:your_redis_password@redis:6379" \
  -e SESSION_SECRET="your-super-secret-session-key-minimum-32-characters" \
  your-username/ai-agent-platform:latest
```

#### 使用阿里云镜像

```bash
# 1. 拉取镜像
docker pull registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-agent-platform:latest

# 2. 运行应用
docker run -d \
  --name ai-agent-platform \
  --network ai-network \
  -p 3000:3000 \
  --restart unless-stopped \
  -v /opt/ai-agent-platform/data:/app/data \
  -v /opt/ai-agent-platform/uploads:/app/public/uploads \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://ai_galaxy_user:your_database_password@postgres:5432/ai_galaxy" \
  -e REDIS_URL="redis://:your_redis_password@redis:6379" \
  -e SESSION_SECRET="your-super-secret-session-key-minimum-32-characters" \
  registry.cn-hangzhou.aliyuncs.com/your-namespace/ai-agent-platform:latest
```

#### 使用本地镜像文件

```bash
# 如果使用了方案3，镜像已经加载到本地，直接运行：
docker run -d \
  --name ai-agent-platform \
  --network ai-network \
  -p 3000:3000 \
  --restart unless-stopped \
  -v /opt/ai-agent-platform/data:/app/data \
  -v /opt/ai-agent-platform/uploads:/app/public/uploads \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://ai_galaxy_user:your_database_password@postgres:5432/ai_galaxy" \
  -e REDIS_URL="redis://:your_redis_password@redis:6379" \
  -e SESSION_SECRET="your-super-secret-session-key-minimum-32-characters" \
  ai-agent-platform:latest
```

### 步骤9：初始化数据库

```bash
# 1. 等待容器启动（约30秒）
sleep 30

# 2. 执行数据库迁移
docker exec ai-agent-platform npx prisma db push

# 3. 初始化种子数据（可选）
docker exec ai-agent-platform npm run db:seed
```

### 步骤10：配置Nginx反向代理（可选但推荐）

```bash
# 1. 安装Nginx
sudo apt install nginx -y

# 2. 创建配置文件
sudo nano /etc/nginx/sites-available/ai-agent-platform
```

粘贴以下内容：

```nginx
server {
    listen 80;
    server_name 你的域名或IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# 3. 启用配置
sudo ln -s /etc/nginx/sites-available/ai-agent-platform /etc/nginx/sites-enabled/

# 4. 测试配置
sudo nginx -t

# 5. 重启Nginx
sudo systemctl restart nginx
```

---

## ✅ 验证和测试

### 步骤1：检查所有服务状态

```bash
# 查看所有运行的容器
docker ps

# 应该看到3个容器：
# - ai-agent-platform (应用)
# - postgres (数据库)
# - redis (缓存)
```

### 步骤2：查看应用日志

```bash
# 查看最新日志
docker logs ai-agent-platform --tail 50

# 持续查看日志
docker logs -f ai-agent-platform
```

### 步骤3：访问应用

1. **使用浏览器访问**：
   - 如果配置了Nginx：`http://你的服务器IP`
   - 如果没有配置Nginx：`http://你的服务器IP:3000`

2. **测试API健康检查**：
   ```bash
   curl http://localhost:3000/api/health
   # 应该返回: {"status":"healthy"}
   ```

### 步骤4：登录管理后台

1. 访问：`http://你的服务器IP/admin`
2. 使用默认账号登录：
   - 邮箱：`admin@ai-galaxy.com`
   - 密码：`admin123`
3. **⚠️ 登录后立即修改密码！**

---

## 💰 成本对比

| 方案 | 月费用 | 优点 | 缺点 |
|------|--------|------|------|
| Docker Hub | 免费 | 全球CDN，稳定 | 国内访问可能较慢 |
| 阿里云镜像服务 | 免费 | 国内访问快，中文界面 | 仅限国内 |
| 文件传输 | 免费 | 完全免费，无限制 | 手动操作，更新麻烦 |
| 腾讯云TCR | ¥1.2/GB/月 | 速度最快，功能强大 | 有费用 |

### 🚨 方案B故障排除

#### 问题1：镜像构建失败

**错误信息示例**：
```
failed to compute cache key: failed to calculate checksum
```

**解决方案**：
```bash
# 清理构建缓存重试
docker builder prune -a
docker build --no-cache -f deploy/docker/Dockerfile -t ai-agent-platform:latest .
```

#### 问题2：容器启动失败

**查看容器日志**：
```bash
docker logs ai-agent-platform --tail 100
```

**常见原因**：
- 环境变量配置错误
- 数据库连接失败
- 端口已被占用

#### 问题3：数据库连接问题

**验证数据库连接**：
```bash
# 在容器内测试连接
docker exec ai-agent-platform npx prisma db push
```

---

### 📊 方案B vs 方案A对比

| 特性 | 方案A（GitHub Actions） | 方案B（手动部署） |
|------|------------------------|------------------|
| **自动化程度** | ✅ 完全自动 | ❌ 需要手动操作 |
| **学习价值** | ⭐ 了解CI/CD | ⭐⭐⭐ 深入理解Docker |
| **适用场景** | 生产环境，团队协作 | 学习，测试环境 |
| **维护成本** | ✅ 极低 | ❌ 需要手动维护 |
| **部署速度** | ✅ 推送即部署 | ❌ 每次需操作多步 |
| **错误恢复** | ✅ 自动重试 | ❌ 手动排查 |

### 💡 从方案B升级到方案A

如果你已经使用方案B部署，想升级到自动化部署：

1. **Fork原项目到你的GitHub**
2. **按照方案A配置GitHub Secrets**
3. **推送代码触发自动部署**
4. **验证自动化部署成功后，停用手动流程**

这样可以平滑过渡到自动化部署模式。

---

## 🚨 通用故障排除

### GitHub Actions部署问题

#### 问题1：Secrets配置错误
```bash
# 检查GitHub Secrets是否正确设置
# 仓库 → Settings → Secrets and variables → Actions
# 确认所有必需的Secrets都已添加
```

#### 问题2：镜像仓库访问失败
```bash
# 检查Docker Hub/阿里云账号状态
# 验证访问令牌是否有效
# 确认命名空间或仓库名称正确
```

#### 问题3：服务器SSH连接失败
```bash
# 测试SSH连接
ssh -i ~/.ssh/github_actions_rsa root@你的服务器IP

# 检查防火墙设置
sudo ufw status
sudo ufw allow 22/tcp
```

### 应用运行问题

#### 数据库连接失败
```bash
# 检查PostgreSQL服务状态
docker ps | grep postgres

# 测试数据库连接
docker exec -it postgres psql -U ai_galaxy_user -d ai_galaxy

# 查看应用日志中的数据库错误
docker logs ai-agent-platform | grep -i database
```

#### 内存或性能问题
```bash
# 检查系统资源使用
free -h
df -h
docker stats

# 清理无用资源
docker system prune -af
```

### 监控和维护

#### 应用健康检查
```bash
# API健康检查
curl http://你的服务器IP:3000/api/health

# 检查应用响应时间
time curl -I http://你的服务器IP:3000
```

#### 日志监控
```bash
# 实时查看应用日志
docker logs -f ai-agent-platform

# 查看最近的错误
docker logs ai-agent-platform --tail 100 | grep -i error
```

---

## 📞 获取帮助

### 🆘 遇到问题？

1. **GitHub Issues**: [提交问题](https://github.com/Xaiver03/AIgalaxy/issues)
2. **查看Actions日志**: GitHub仓库 → Actions → 查看失败的工作流
3. **检查部署文档**: [完整部署指南](./docs/deployment/README.md)

### 📋 问题报告模板

提交问题时请包含以下信息：

```markdown
## 问题描述
[简要描述遇到的问题]

## 使用的方案
- [ ] 方案A: GitHub Actions自动化部署
- [ ] 方案B: 手动Docker部署

## 错误信息
```
[粘贴完整的错误日志]
```

## 环境信息
- 操作系统: [如 Ubuntu 20.04]
- Docker版本: [docker --version 输出]
- 镜像仓库: [Docker Hub/阿里云/腾讯云]

## 已尝试的解决方案
[描述你已经尝试过的解决方法]
```

---

## 📝 总结

### 推荐方案选择

| 用户类型 | 推荐方案 | 原因 |
|---------|----------|------|
| **个人开发者** | 方案A + Docker Hub | 免费，自动化，易维护 |
| **小团队** | 方案A + 阿里云 | 国内访问快，团队协作 |
| **学习目的** | 方案B | 深入理解Docker原理 |
| **企业用户** | 方案A + 私有仓库 | 安全性高，可控性强 |

### 🎯 最终目标

完成这个指南后，你将拥有：

✅ **生产级的容器化部署方案**  
✅ **完全自动化的CI/CD流水线**  
✅ **多镜像仓库支持和容灾备份**  
✅ **实时监控和健康检查机制**  
✅ **从开发到生产的完整工作流**  

无论选择哪种方案，都能让你的AI Agent Platform稳定运行在云端！

---

**最后更新**: 2025-08-20  
**版本**: 完整版 v2.1  
**维护者**: AI Galaxy团队