# 部署说明（实际架构）

本站为 **Astro 7 + SSR**，后端运行在阿里云 ECS（大陆），
对外通过 **Cloudflare Tunnel** 暴露，**不依赖服务器入站端口**。

## 为什么用 Tunnel 而不是直接解析 A 记录

服务器 IP 是**中国大陆**阿里云节点，域名 `060147.xyz` **未完成 ICP 备案**。
实测结论：

| 访问方式 | 结果 |
| --- | --- |
| 域名走 80 端口直连 | ❌ 阿里云返回 `Non-compliance ICP Filing` 拦截页 |
| 域名走 443 直连（带 SNI） | ❌ TLS 握手被 `ECONNRESET` 重置 |
| 换成无关 SNI（如 example.com） | ✅ 正常 —— 证明是**按域名 SNI 精确拦截** |
| **经 Cloudflare Tunnel** | ✅ **正常** —— 回源无入站连接，拦截规则打不到 |

> 注意：即使套了 Cloudflare 的普通代理（橙云）也会失败（报 525），
> 因为那仍然由 Cloudflare **主动入站**连接服务器 443，SNI 依然被拦。
> 只有 Tunnel（服务器主动出站长连接）能绕过。

**备案仍然是长期正规方案**，Tunnel 属于技术绕行。

## 当前链路

```
用户 → Cloudflare 边缘（自动 HTTPS）
         ↓ 已建立的出站隧道（QUIC，无需入站端口）
       cloudflared (systemd，开机自启)
         ↓ http://localhost:80
       Nginx ──► Node 127.0.0.1:4321 (PM2，SSR)
```

## 关键文件与命令

| 项目 | 位置 / 命令 |
| --- | --- |
| 站点代码 | `/www/wwwroot/myblog` |
| Node 服务 | PM2 进程 `myblog`，监听 `127.0.0.1:4321` |
| Nginx 配置 | `/www/server/panel/vhost/nginx/myblog.conf` |
| 隧道服务 | `systemctl status cloudflared`（token 存于 `/etc/cloudflared/token`）|
| 隧道日志 | `journalctl -u cloudflared -f` |
| Nginx 日志 | `/www/wwwlogs/myblog.log`（含真实访客 IP） |
| 配置备份 | `/root/tunnel-backup/` |

## 更新网站

```bash
cd /www/wwwroot/myblog
git pull && pnpm install --frozen-lockfile && pnpm build && pm2 restart myblog
```

隧道与 Nginx 无需改动。

## 常用排查

```bash
pm2 list                      # Node 服务是否在线
systemctl status cloudflared  # 隧道是否连接
curl -s http://127.0.0.1:4321/api/health   # 本机后端是否正常
tail -20 /www/wwwlogs/myblog.log           # 最近访问
nginx -t && nginx -s reload                 # 改 Nginx 后重载
```

## 环境要点（踩过的坑）

1. **Node 用 nvm 装在 `/root/.nvm`**，`/www/server/nvm` 是宝塔的空目录，别用。
   已把 `node/npm/pnpm/pm2` 软链到 `/usr/local/bin`，任何 shell 可用。
2. **`~/.npmrc` 里的 `prefix`/`cache` 必须删除**（指向宝塔 Node 目录会与 nvm 冲突）。
3. **`package.json` 不要钉 `packageManager`**：pnpm 会去下载 `@pnpm/exe` 的损坏构建，
   报 `ERR_PNPM_BROKEN_PNPM_RELEASE`。
4. **cloudflared 从 GitHub 直连下载会截断**（约 2MB 就断），
   用 `https://ghfast.top/https://github.com/...` 前缀，或校验文件大小应约 38MB。
5. 服务器直连 GitHub 不稳定，`git pull` 失败多试几次即可。
