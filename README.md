# Hidetoshi & Nevaeh's Nexus

一个基于 MkDocs 构建的综合性知识数据库，为 Hidetoshi 和 Nevaeh 提供知识管理和分享平台。

## 📖 项目简介

这是一个使用 MkDocs 和 Material for MkDocs 主题构建的静态文档网站，主要包含：

- 🍳 **食谱数据库** - 新疆特色菜谱和家常菜做法
- 📚 **知识管理** - 个人知识库和笔记整理
- 🌐 **在线访问** - 通过 Cloudflare Pages 提供在线访问

## 🚀 快速开始

### 环境要求

- Python 3.8+
- uv (推荐) 或 pip

### 安装和运行

```bash
# 克隆项目
git clone https://github.com/Hidetoshi20/hidetoshi-nevaeh-nexus.git
cd hidetoshi-nevaeh-nexus

# 安装依赖
uv sync

# 启动本地开发服务器
uv run mkdocs serve

# 访问 http://127.0.0.1:8000 查看网站
```

## 🍳 食谱分类

项目中的食谱已按以下分类整理：

| 分类 | 数量 | 特色 |
|------|------|------|
| **主食类** | 4个 | 抓饭、米饭等主食 |
| **面食类** | 8个 | 面条、包子、饼子等 |
| **肉类菜品** | 4个 | 牛肉、羊肉等肉类菜品 |
| **蔬菜类** | 4个 | 土豆、茄子等蔬菜菜品 |
| **汤类** | 1个 | 汤品 |
| **其他菜品** | 1个 | 其他特色菜 |

## 🎨 功能特性

### 网站功能
- 📱 **响应式设计** - 支持手机、平板、电脑访问
- 🌙 **深色模式** - 支持明暗主题切换
- 🔍 **全文搜索** - 快速查找内容
- 📱 **移动优化** - 移动端友好体验

### 内容管理
- 📝 **Markdown 支持** - 使用 Markdown 编写内容
- 🏷️ **标签系统** - 内容分类和标签
- 📂 **自动导航** - 自动生成导航菜单
- 🔗 **内部链接** - 支持文档间链接

### 技术特性
- ⚡ **静态生成** - 快速加载
- 🔧 **插件扩展** - 丰富的插件生态
- 📊 **SEO 优化** - 搜索引擎友好
- 🚀 **CDN 支持** - 全球加速访问

## 🛠️ 技术栈

- **MkDocs** - 静态站点生成器
- **Material for MkDocs** - 现代化主题
- **Python** - 后端支持
- **uv** - 现代化包管理器
- **Cloudflare Pages** - 全托管静态网站平台

## 📁 项目结构

```
hidetoshi-nevaeh-nexus/
├── docs/                          # 文档目录
│   ├── Recipe Book/               # 食谱数据库
│   ├── hidetoshi/                 # Hidetoshi 个人空间
│   ├── nevaeh/                    # Nevaeh 个人空间
│   └── .pages                     # 导航配置
├── mkdocs.yml                     # MkDocs 配置文件
├── pyproject.toml                 # 项目配置和依赖管理
├── DEVELOPMENT.md                 # 开发与部署指南
├── CLAUDE.md                      # 项目指南
├── AGENTS.md                      # AI Agent 指南
├── GEMINI.md                      # Gemini 指南
└── README.md                      # 项目说明
```

## 📚 详细文档

- 📖 **[开发与部署指南](DEVELOPMENT.md)** - 完整的开发环境设置、工作流程和部署配置
- 📋 **[项目指南](CLAUDE.md)** - 项目规范和贡献指南

## 🌐 在线访问

- **部署地址**: https://hidetoshi-nevaeh-nexus.pages.dev/
- **GitHub 仓库**: https://github.com/Hidetoshi20/hidetoshi-nevaeh-nexus

## 🤝 贡献指南

欢迎贡献内容！请查看 [开发与部署指南](DEVELOPMENT.md#贡献指南) 了解详细的贡献流程。

简要步骤：
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'docs: 添加新内容'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 👥 作者

- **Hidetoshi Dekisugi** - 项目创建者
- **Nevaeh** - 项目协作者

## 🙏 致谢

- [MkDocs](https://www.mkdocs.org/) - 优秀的静态站点生成器
- [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) - 精美的 Material Design 主题
- [Cloudflare Pages](https://developers.cloudflare.com/pages/) - 全托管的静态网站托管服务

---

⭐ 如果这个项目对你有帮助，请给我们一个星标！ 
