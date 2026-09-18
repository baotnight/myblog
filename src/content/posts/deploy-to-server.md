---
title: 部署到云服务器
published: 2026-01-15
description: 把本站部署到已安装宝塔面板的云服务器上的完整步骤。
tags: ["部署", "宝塔"]
category: 运维
---

本文记录本站的部署方案，环境是**安装了宝塔面板的阿里云 ECS**。

## 整体流程

1. 本地开发，推到 GitHub
2. 服务器拉取代码
3. 服务器安装依赖并构建
4. 用 Node 服务常驻运行
5. Nginx 反向代理到该服务

## 为什么需要 Node 常驻进程

本站使用 SSR（服务端渲染），构建产物不是一堆静态 HTML，
而是一个 Node 服务：

```
dist/
├── client/            # 静态资源，由 Nginx 直接返回
└── server/entry.mjs   # Node 服务入口
```

因此不能用「纯静态站点」的方式部署，需要让 Node 进程常驻，
再由 Nginx 反向代理，静态资源则由 Nginx 直接读取 `dist/client/`。

## 环境要求

- Node.js **>= 22.12**（Astro 7 的硬性要求）
- pnpm
- PM2（进程守护）

## 常用命令

```bash
pnpm install --frozen-lockfile
pnpm build
PORT=4321 HOST=127.0.0.1 NODE_ENV=production pm2 start ./dist/server/entry.mjs --name myblog
```

> 端口等运行参数通过环境变量配置，例如 `PORT=4321`、`HOST=127.0.0.1`。
> 监听地址用 `127.0.0.1` 而非 `0.0.0.0`，避免 Node 服务直接暴露到公网。

## 更新流程

```bash
cd /www/wwwroot/myblog
git pull && pnpm install --frozen-lockfile && pnpm build && pm2 restart myblog
```
