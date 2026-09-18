# myblog

一个基于 **Astro 7** 的最小博客骨架，采用 **SSR（服务端渲染）**，
由 `@astrojs/node` 适配器输出 Node 服务，方便后续接入后端接口与数据库。

- 纯 Astro（无前端框架依赖），构建快、体积小
- Markdown 写作，内容集合（Content Collections）带类型校验
- 归档页 + 分页、上下篇导航、RSS、亮/暗主题
- 已内置一个 API 路由示例：`GET /api/health`

---

## 一、本地开发

环境要求：**Node.js >= 22.12**，包管理器 **pnpm**。

```bash
pnpm install
pnpm dev          # http://localhost:4321
```

常用命令：

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器（默认 4321 端口） |
| `pnpm build` | 构建生产版本到 `dist/` |
| `pnpm serve` | 运行构建后的 Node 服务 |
| `pnpm check` | Astro 类型与语法检查 |
| `pnpm type-check` | 单独运行 tsc 检查 |

## 二、目录结构

```
myblog/
├── astro.config.mjs        # Astro 配置（output: "server" + node 适配器）
├── pnpm-workspace.yaml     # pnpm 配置（构建脚本白名单、typescript 版本锁定）
├── public/                 # 直接对外提供的静态文件
└── src/
    ├── config/
    │   └── siteConfig.ts   # ★ 站点标题、导航、页脚等都在这里改
    ├── content/
    │   ├── posts/          # ★ 文章（Markdown）
    │   └── spec/about.md   # ★ 关于页正文
    ├── content.config.ts   # 内容集合的字段定义
    ├── components/         # PostCard / PostList / NavBar / Footer / Pagination
    ├── layouts/            # BaseLayout / PostLayout
    ├── pages/              # 路由（见下表）
    ├── styles/global.css   # 全局样式与主题变量
    └── utils/              # 日期、分页、URL 等工具函数
```

### 路由一览

| 路径 | 文件 |
| --- | --- |
| `/` | `src/pages/index.astro` |
| `/archive/` | `src/pages/archive/index.astro` |
| `/archive/page/N/` | `src/pages/archive/page/[page].astro` |
| `/posts/<文件名>/` | `src/pages/posts/[id].astro` |
| `/about/` | `src/pages/about.astro` |
| `/rss.xml` | `src/pages/rss.xml.ts` |
| `/api/health` | `src/pages/api/health.ts` |
| 404 | `src/pages/404.astro` |

## 三、写文章

在 `src/content/posts/` 下新建 `.md` 文件，**文件名即 URL**：

```markdown
---
title: 文章标题
published: 2026-01-01
description: 一句话摘要
tags: ["标签"]
category: 分类
draft: false
---

正文……
```

`draft: true` 的文章只在开发环境可见，构建后不会出现在站点上。

## 四、部署到云服务器（宝塔面板）

> 本项目是 **SSR**，构建产物不是纯静态 HTML，而是 `dist/server/entry.mjs`
> 这个 Node 服务。因此部署方式是「**Node 进程常驻 + Nginx 反向代理**」，
> 不能用宝塔的「纯静态站点」方式。

### 4.1 服务器准备

1. **安装 Node.js**：宝塔面板 →「软件商店」→ 搜索 **Node.js 版本管理器** 安装。
   在里面安装 **Node 22（>= 22.12）**，并把它设为默认版本。
2. **开通端口**：宝塔「安全」及云厂商安全组放行 **80 / 443**。
   注意：Node 服务端口（下文用 4321）**不需要**对公网放行。
3. **安装 pnpm**（在宝塔终端里执行）：

   ```bash
   npm install -g pnpm
   node -v && pnpm -v
   ```

### 4.2 拉取代码

```bash
mkdir -p /www/wwwroot/myblog
cd /www/wwwroot/myblog
git clone https://github.com/baotnight/myblog.git .
```

> 私有仓库需要配置凭据。推荐用 SSH 部署密钥：
> `ssh-keygen -t ed25519 -C "server"` 生成后，把 `~/.ssh/id_ed25519.pub`
> 加到 GitHub 仓库的 **Settings → Deploy keys**（勾选只读即可）。
> 之后用 `git clone git@github.com:baotnight/myblog.git .`。

### 4.3 构建

```bash
cd /www/wwwroot/myblog
pnpm install --frozen-lockfile
pnpm build
```

构建完成后会生成：

```
dist/
├── client/            # 静态资源（CSS/JS/图片）
└── server/entry.mjs   # Node 服务入口
```

### 4.4 用 PM2 常驻运行

宝塔「软件商店」安装 **PM2 管理器**，然后在其终端里执行：

```bash
cd /www/wwwroot/myblog
PORT=4321 HOST=127.0.0.1 NODE_ENV=production pm2 start ./dist/server/entry.mjs --name myblog
pm2 save
```

不想用 PM2 也可以直接用宝塔的 **Node 项目管理器**：

- 项目目录：`/www/wwwroot/myblog`
- 启动文件：`dist/server/entry.mjs`
- 端口：`4321`
- 运行方式：`node`

验证服务是否正常（在服务器上执行）：

```bash
curl -I http://127.0.0.1:4321/
curl http://127.0.0.1:4321/api/health
```

### 4.5 配置 Nginx 反向代理

宝塔「网站」→ 添加站点（绑定你的域名，**不要**选纯静态/PHP，选「Node 项目」或普通站点后手动改 Nginx 配置），
把站点配置改成：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 静态资源交给 Nginx 直接返回，减轻 Node 压力
    location /_astro/ {
        alias /www/wwwroot/myblog/dist/client/_astro/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /favicon.svg {
        alias /www/wwwroot/myblog/dist/client/favicon.svg;
    }

    location / {
        proxy_pass http://127.0.0.1:4321;
        proxy_http_version 1.1;
        proxy_set_header Host              $host;
        proxy_set_header X-Real-IP         $remote_addr;
        proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade           $http_upgrade;
        proxy_set_header Connection        "upgrade";
    }
}
```

保存后重载 Nginx，访问域名即可。

### 4.6 开启 HTTPS

宝塔站点 →「SSL」→ **Let's Encrypt** 申请证书，勾选「强制 HTTPS」。
注意 `src/config/siteConfig.ts` 里的 `siteUrl` 要改成 `https://你的域名`。

### 4.7 后续更新发布

```bash
cd /www/wwwroot/myblog
git pull
pnpm install --frozen-lockfile
pnpm build
pm2 restart myblog
```

> 更省事的做法：本地开发完直接 `git push`，在服务器上执行上面的四条命令；
> 或在宝塔上用 **Webhook / 计划任务** 在 push 后自动执行脚本。

### 4.8 常见问题

| 现象 | 处理 |
| --- | --- |
| 502 Bad Gateway | Node 进程没起来，`pm2 list` / `pm2 logs myblog` 查看 |
| 页面样式丢失 | Nginx 的 `/_astro/` 路径没配好，检查 `dist/client/_astro/` 是否存在 |
| 提示 Node 版本过低 | Astro 7 要求 **>= 22.12**，用 Node 版本管理器切换并重启 PM2 |
| 改了端口不生效 | 端口通过环境变量传入，重启 PM2 时带上新的 `PORT` |

## 五、接入后端

本项目已经是 SSR，新增接口只需**新建文件**，无需改配置：

```ts
// src/pages/api/posts.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = async () => {
	return new Response(JSON.stringify({ posts: [] }), {
		headers: { "Content-Type": "application/json" },
	});
};
```

访问 `GET /api/posts` 即可。要连数据库时：

```bash
pnpm add better-sqlite3     # 或 mysql2 / pg / prisma
```

数据库密码等敏感信息请放在服务器环境变量或 `.env` 中（`.env` 已被 `.gitignore` 忽略），
**不要**写进代码提交到仓库。

## 六、上线前检查清单

- [ ] 修改 `src/config/siteConfig.ts`：站点标题、副标题、`siteUrl`、作者、导航、页脚
- [ ] 修改 `src/content/spec/about.md`：关于页内容
- [ ] 替换 `public/favicon.svg`：站点图标
- [ ] 删除 `src/content/posts/` 下的示例文章
- [ ] 确认 `pnpm build` 与 `pnpm check` 均通过
