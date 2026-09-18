import type { APIRoute } from "astro";
import { siteConfig } from "@/config";

/**
 * 健康检查接口：GET /api/health
 *
 * 这个文件用来演示 SSR 下如何编写后端接口。
 * 后续新增业务接口时，在 src/pages/api/ 下新建 .ts 文件即可，
 * 例如 src/pages/api/posts.ts，无需任何额外配置。
 */
export const GET: APIRoute = () => {
	return new Response(
		JSON.stringify({
			ok: true,
			site: siteConfig.title,
			mode: import.meta.env.PROD ? "production" : "development",
			time: new Date().toISOString(),
		}),
		{
			status: 200,
			headers: {
				"Content-Type": "application/json; charset=utf-8",
				"Cache-Control": "no-store",
			},
		},
	);
};
