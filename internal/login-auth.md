# 登录与访问控制现状

## 现状

- Cloudflare Pages 当前直接托管站点内容，不再启用 Netlify Identity 登录或 `_redirects` 保护。
- 站点面向公开访问，无需登录即可查看所有页面。
- 如需限制访问，推荐改用 Cloudflare Access（零信任）或为仓库设置私有权限。

## 迁移背景

原先的 Netlify Identity 登录流程依赖以下组件：

- `_redirects` 和 `netlify.toml` 用于强制匿名用户跳转登录页并控制访问权限。
- `docs/login.md` 页面和 `docs/assets/javascripts/netlify-identity.js` 脚本负责触发 Netlify Identity Widget。
- `overrides/main.html` 在每页头部注入 Identity Widget 脚本。

迁移到 Cloudflare Pages 后，这些文件已移除，站点结构简化。

## 如果未来需要重新启用登录

1. 评估 Cloudflare Access：可针对邮箱域、GitHub/Google 账户或一次性 PIN 做访问控制，配置在 Cloudflare 控制台完成，无需改动站点代码。
2. 若仍想使用 Netlify Identity，需要：
   - 在 Cloudflare Pages 中自定义 `_headers` 或 `wrangler.toml` 对接第三方身份验证。
   - 添加客户端脚本与登录页，并保证静态资源能在未登录状态加载。
3. 任何访问控制方案都应额外在仓库 README 中注明使用说明，避免贡献者误解。

## 建议

- 持续跟踪 Cloudflare Pages 的访问控制能力；若数据敏感，优先启用 Cloudflare Access 或迁移到受控的私有站点。
- 在需要临时分享时，可通过 Cloudflare Dash 中的「临时访问链接」（One-Time PIN）功能快速限制访问范围。
