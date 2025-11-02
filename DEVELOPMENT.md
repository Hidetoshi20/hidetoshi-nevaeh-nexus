# DEVELOPMENT

本文档提供 Hidetoshi & Nevaeh's Nexus 项目的完整开发和部署指南。

## 🚀 快速开始

### 环境要求

- Python 3.13+
- uv (推荐)

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/Hidetoshi20/hidetoshi-nevaeh-nexus.git
cd hidetoshi-nevaeh-nexus

# 使用 uv 安装依赖（推荐）
uv sync

# 启动本地开发服务器
uv run mkdocs serve

# 访问 http://127.0.0.1:8000 查看网站
```

### 构建和部署

```bash
# 使用 uv 构建（推荐）
uv run mkdocs build

# 严格模式构建（检查链接）
uv run mkdocs build --strict
```

## 📁 项目结构

```
hidetoshi-nevaeh-nexus/
├── docs/                          # 文档目录
│   ├── Recipe Book/               # 食谱数据库
│   │   ├── 主食类/               # 米饭、抓饭等主食
│   │   ├── 面食类/               # 面条、包子等面食
│   │   ├── 肉类菜品/             # 肉类为主的菜品
│   │   ├── 蔬菜类/               # 蔬菜为主的菜品
│   │   ├── 汤类/                 # 汤品
│   │   └── 其他菜品/             # 其他分类
│   ├── hidetoshi/                # Hidetoshi 个人空间
│   ├── nevaeh/                   # Nevaeh 个人空间
│   └── .pages                    # 导航配置
├── .github/                      # GitHub 配置
│   └── workflows/                # GitHub Actions 工作流
├── overrides/                    # 主题覆盖目录
│   └── main.html                 # 主模板文件
├── mkdocs.yml                    # MkDocs 配置文件
├── pyproject.toml                # 项目配置和依赖管理
├── wrangler.toml                 # Cloudflare Pages 配置
├── DEVELOPMENT.md                # 开发和部署指南（本文档）
├── CLAUDE.md                     # Claude 指导文档
├── AGENTS.md                     # AI Agent 指导文档
├── GEMINI.md                     # Gemini 指导文档
└── README.md                     # 项目说明
```

## 🛠️ 技术栈

- **MkDocs** - 静态站点生成器
- **Material for MkDocs** - 现代化主题
- **Python** - 后端支持
- **uv** - 现代化包管理器
- **Cloudflare Pages** - 全托管静态网站平台

## 📦 依赖管理

项目使用 `uv` 进行依赖管理，配置在 `pyproject.toml` 中：

```toml
[project]
name = "hidetoshi-nevaeh-nexus"
dependencies = [
    "mkdocs",                      # 静态站点生成器
    "mkdocs-material",            # Material Design 主题
    "pymdown-extensions",         # Markdown 扩展
    "mkdocs-awesome-pages-plugin", # 页面管理插件
]
```

## 📝 内容管理

### 添加新食谱

1. 在 `docs/Recipe Book/` 对应分类文件夹中创建新的 `.md` 文件
2. 使用 Markdown 格式编写食谱内容
3. 添加适当的标签和分类信息
4. 提交并推送到 GitHub

### 创建新文档

1. 在 `docs/` 目录下创建新的 `.md` 文件
2. 使用标准 Markdown 语法
3. 可选：添加 YAML 前置元数据

```yaml
---
title: 文档标题
tags: [标签1, 标签2]
---
```

### 文档命名规范

- 使用描述性文件名
- 支持中文和 emoji（如 `🏋️ Lower 1 - Squat Focus.md`）
- 避免使用特殊字符可能导致的问题

## ⚙️ 配置管理

### MkDocs 配置

编辑 `mkdocs.yml` 文件来：

- 修改网站标题和描述
- 调整主题设置
- 配置插件和扩展
- 自定义导航结构

### 导航配置

项目使用 `.pages` 文件配置导航结构：

```yaml
nav:
  - Home: README.md
  - 食谱数据库: Recipe Book/
  - Hidetoshi: hidetoshi/
  - Nevaeh: nevaeh/
```

## 🌐 部署指南

### Cloudflare Pages（推荐）

项目主要部署在 Cloudflare Pages，提供全球 CDN 加速和自动部署。

#### 自动部署

项目已配置 GitHub Actions 工作流，实现代码推送后自动部署。

##### 设置步骤

1. **创建 Cloudflare Pages 项目**
   - 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - 进入 Pages 页面
   - 点击 "Create a project"
   - 选择 "Connect to Git"
   - 授权并选择本仓库

2. **配置构建设置**
   ```bash
   # 构建命令
   uv sync && uv run mkdocs build

   # 构建输出目录
   site

   # 环境变量
   PYTHON_VERSION=3.13
   ```

3. **配置 GitHub Secrets**

   在 GitHub 仓库的 `Settings → Secrets and variables → Actions` 中添加：

   - `CLOUDFLARE_API_TOKEN`: 具有 Pages:edit 权限的 API Token
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare 账户 ID
   - `CLOUDFLARE_PAGES_PROJECT`: Pages 项目名称

##### GitHub Actions 工作流

项目使用 `.github/workflows/cloudflare-pages.yml` 配置自动部署：

```yaml
name: Deploy to Cloudflare Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v4
      - run: uv sync
      - run: uv run mkdocs build --strict
      - uses: cloudflare/pages-action@v1
```

**注意**：Cloudflare Pages 会从控制台的 Build settings 读取构建命令，而不是从 `wrangler.toml`。

##### wrangler.toml 配置

根目录的 `wrangler.toml` 用于识别 Cloudflare Pages 项目：

```toml
name = "hidetoshi-nevaeh-nexus"
compatibility_date = "2024-05-01"
pages_build_output_dir = "site"
```

##### 手动部署

如需手动触发部署：

1. 进入 GitHub Actions 页面
2. 选择 "Deploy to Cloudflare Pages" 工作流
3. 点击 "Run workflow"

#### 自定义域名配置

1. 在 Cloudflare Pages 项目设置中
2. 点击 "Custom domains"
3. 添加自定义域名
4. 配置 DNS 记录

### 其他部署选项

#### GitHub Pages

```yaml
# .github/workflows/github-pages.yml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: astral-sh/setup-uv@v4
      - run: uv sync
      - run: uv run mkdocs build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./site
```

#### Netlify

在 Netlify 控制台配置：

- **Build command**: `uv sync && uv run mkdocs build`
- **Publish directory**: `site`
- **Environment variables**: `PYTHON_VERSION=3.13`

#### Vercel

在 `vercel.json` 中配置：

```json
{
  "buildCommand": "uv sync && uv run mkdocs build",
  "outputDirectory": "site",
  "installCommand": "uv sync",
  "framework": null
}
```

## 🧪 开发工作流

### 日常开发

1. **拉取最新代码**
   ```bash
   git pull origin main
   ```

2. **启动开发服务器**
   ```bash
   uv run mkdocs serve
   ```

3. **编辑内容**
   - 在 `docs/` 目录下编辑或创建文件
   - 实时预览会自动刷新

4. **验证构建**
   ```bash
   uv run mkdocs build --strict
   ```

5. **提交更改**
   ```bash
   git add .
   git commit -m "docs: 添加新内容"
   git push origin main
   ```

### 代码质量

#### 构建检查

```bash
# 严格模式构建（检查链接和警告）
uv run mkdocs build --strict
```

#### 链接检查

项目配置了严格的链接检查，确保：
- 所有内部链接有效
- 锚点存在
- 图片文件可访问

## 📊 监控和维护

### 部署状态监控

#### Cloudflare Pages

- 实时查看构建状态
- 分析访问日志
- 监控错误率

#### GitHub Actions

- 查看工作流运行状态
- 分析构建时间
- 监控失败率

### 性能优化

#### 站点性能

- 启用 Gzip 压缩
- 配置浏览器缓存
- 优化图片资源

#### 构建性能

- 使用依赖缓存
- 优化构建脚本
- 并行化任务

### 备份策略

#### 内容备份

- Git 版本控制
- 定期导出 Markdown 文件
- 备份配置文件

#### 配置备份

- 保存 `mkdocs.yml`
- 备份自定义主题
- 记录环境变量

## 🔒 安全配置

### API 密钥管理

#### GitHub Secrets

```yaml
# 使用安全的方式存储密钥
env:
  CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

#### 权限最小化

- API Token 仅授予必要权限
- 定期轮换密钥
- 限制访问范围

### 内容安全

#### 隐私设置

```yaml
# mkdocs.yml 中的隐私配置
extra:
  meta:
    - name: robots
      content: noindex, nofollow
```

#### 访问控制

- 配置 Cloudflare Access
- 设置 IP 白名单
- 启用密码保护

## 🐛 故障排除

### 常见问题

#### 构建失败

1. **检查依赖**
   ```bash
   uv sync
   ```

2. **检查 Python 版本**
   ```bash
   python --version  # 需要 3.8+
   ```

3. **检查语法错误**
   ```bash
   uv run mkdocs build --strict
   ```

#### 链接错误

1. **检查文件路径**
   - 确保所有链接指向存在的文件
   - 检查文件名大小写

2. **检查锚点**
   - 确保所有 `#anchor` 链接对应实际标题

#### 部署失败

1. **API Token 问题**
   - 验证 Token 有效性
   - 检查权限范围

2. **域名配置问题**
   - 检查 DNS 记录
   - 验证 SSL 证书

3. **构建输出问题**
   - 检查输出目录
   - 验证文件完整性

### 调试技巧

#### 本地调试

```bash
# 详细构建日志
uv run mkdocs build --verbose

# 检查链接
uv run mkdocs build --strict
```

#### 远程调试

- 查看 GitHub Actions 日志
- 检查 Cloudflare Pages 构建日志
- 分析错误信息

## 🤝 贡献指南

### 提交规范

使用 Conventional Commits 格式：

```
docs(类别): 简短描述

[可选的详细描述]

[可选的脚注]
```

示例：
- `docs(recipe): 添加新疆抓饭食谱`
- `docs(setup): 更新安装说明`
- `fix: 修复导航链接错误`

### Pull Request 流程

1. Fork 本仓库
2. 创建特性分支：`git checkout -b feature/amazing-feature`
3. 提交更改：`git commit -m 'docs: 添加新功能'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 开启 Pull Request

### 审查标准

- 内容准确、完整
- 格式符合项目规范
- 链接有效
- 构建通过

## 🔄 升级和维护

### 依赖升级

```bash
# 检查可用更新
uv tree

# 更新依赖
uv sync --upgrade
```

### 平台升级

- 关注 Cloudflare Pages 更新
- 更新 GitHub Actions 版本
- 升级 MkDocs 和主题

### 定期维护

- 清理无用文件
- 更新文档
- 优化配置

## 📚 相关文档

- [MkDocs 官方文档](https://www.mkdocs.org/)
- [Material for MkDocs 文档](https://squidfunk.github.io/mkdocs-material/)
- [uv 官方文档](https://docs.astral.sh/uv/)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)

## 🆘 获取帮助

如果遇到问题：

1. 查看本文档的故障排除部分
2. 检查相关官方文档
3. 在 GitHub Issues 中搜索类似问题
4. 创建新的 Issue 描述具体问题

---

💡 **提示**: 本文档会随着项目发展持续更新，建议定期查看最新版本。