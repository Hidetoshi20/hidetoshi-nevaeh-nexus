# 登录逻辑实现说明

## 目标

当前项目只实现最小可用的登录保护，目标是：
- 未登录访问除 `/login/` 外的任意页面时，强制跳转到登录页。
- 登录成功后如果仍在登录页，回到首页 `/`。
- 点击“退出登录”后，回到登录页。

所有额外体验（Toast 提示、重定向状态缓存等）都已移除，保证脚本足够简洁，便于维护。

## 关键组成

- `docs/assets/javascripts/netlify-identity.js`：浏览器端的 Netlify Identity 辅助脚本，仅处理登录状态和强制重定向。
- `docs/login.md`：登录页内容，提供 `id="netlify-login-trigger"` 的按钮触发 Identity Widget。
- `_redirects`：Netlify 平台上的强制访问控制，真实保护内容不被匿名访问。
- `netlify.toml`：构建阶段将 `_redirects` 复制到发布目录，确保部署后规则生效。

## 浏览器脚本逻辑

`netlify-identity.js` 负责监听 Netlify Identity Widget 的三个事件：

1. **init**：Widget 初始化后获取当前用户。
   - 未登录且不在 `/login/`，转到登录页。
   - 已登录且在 `/login/`，转到首页。
2. **login**：任意位置登录成功，直接 `window.location.replace('/')`。
3. **logout**：退出后转到 `/login/`。

脚本只做重定向，不再写入 `sessionStorage` 或展示提示信息，事件绑定也只执行一次（`identityBound` 标记）。

登录页在脚本初始化时会自动为按钮绑定 `identity.open('login')`，方便在 widget 未自动弹出时手动触发。

## Netlify 端保护

`_redirects` 文件提供两层保障：

- `/* /:splat 200! Role=member`：仅 member 角色的已登录用户才能命中正常页面。
- `/* /login/index.html?redirect=/:splat 302`：匿名访问则重定向到登录页。
- 额外的 `/assets/*`、`/search/*` 等规则允许静态资源和搜索在未登录时加载，避免登录页挂载时缺少样式或脚本。

构建时 `netlify.toml` 会把 `_redirects` 复制进 `site/_redirects`，部署完成后 Netlify 执行这些规则。

## 开发与调试建议

- 本地预览时（`mkdocs serve`）不会读取 `_redirects`，请使用 Netlify Identity Widget 的 login/logout 按钮模拟流程。
- 如果需要更强的用户体验（提示、重定向提示等），可以在现有脚本基础上按需扩展，但务必保持 `init/login/logout` 的主流程清晰。
- 修改 `_redirects` 后记得重新部署或在本地构建一次，验证规则仍然覆盖受保护路径。

## 后续可选优化

- 加入登录失败、注销成功等 Toast 消息提示。
- 根据 `?redirect=` 查询参数，登录后返回原始页面而不是首页。
- 使用 Netlify Identity Webhooks 更新角色，结合 `_redirects` 做更细粒度的访问控制。
