---
title: 登录
hide:
  - navigation
  - toc
---

# 欢迎，请先登录

使用 Netlify Identity 登录以访问数据库内容。如果登录窗口没有自动弹出，请点击下方按钮。

<button class="md-button md-button--primary" id="netlify-login-trigger">打开登录窗口</button>

<p class="identity-help">如需新建账户，请在登录窗口选择注册。</p>

<script>
  document.addEventListener("DOMContentLoaded", () => {
    const trigger = document.getElementById("netlify-login-trigger");

    if (!trigger) {
      return;
    }

    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      if (window.netlifyIdentity) {
        window.netlifyIdentity.open();
      }
    });
  });
</script>
