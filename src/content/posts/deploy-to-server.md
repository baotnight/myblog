---
title: 部署到云服务器
published: 2026-01-15
description: 把本站部署到已安装宝塔面板的云服务器上的思路概览。
tags: ["部署", "宝塔"]
category: 运维
---

本文是部署思路的示例文章，完整步骤见项目根目录的 `README.md`。

## 整体流程

1. 本地开发，推到 GitHub
2. 服务器拉取代码
3. 服务器安装依赖并构建
4. 用 Node 服务常驻运行

## 为什么需要 Node 常驻进程

本项目使用 SSR（服务端渲染），构建产物不是一堆静态 HTML，
而是一个 Node 服务：

```
dist/
├── client/          # 静态资源，由 Nginx 直接返回
└── server/entry.mjs # Node 服务入口
```

因此不能用「纯静态站点」的方式部署，需要让 Node 进程常驻，
再由宝塔的 Nginx 反向代理到该进程。

## 常用命令

```bash
pnpm install --frozen-lockfile
pnpm build
node ./dist/server/entry.mjs
```

> 端口等运行参数通过环境变量配置，例如 `PORT=4321`、`HOST=127.0.0.1`。
