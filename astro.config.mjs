// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";
import { siteConfig } from "./src/config/siteConfig.ts";

// https://astro.build/config
export default defineConfig({
	// 站点最终访问地址，用于生成 sitemap / canonical / RSS 等绝对链接
	site: siteConfig.siteUrl,

	// SSR：服务端渲染。构建产物为 Node 服务，由宝塔 Node 项目管理器或 pm2 启动，
	// 后续可直接新增 src/pages/api/*.ts 接口并接入数据库。
	output: "server",

	adapter: node({
		mode: "standalone",
	}),

	server: {
		host: true,
		port: 4321,
	},

	build: {
		// 全部走服务端渲染，因此不需要静态预渲染
		format: "directory",
	},

	devToolbar: {
		enabled: false,
	},
});
