/**
 * 站点全局配置。
 * 部署前请把下面的占位信息改成你自己的内容。
 */
export const siteConfig = {
	/** 站点标题，显示在导航栏与浏览器标签页 */
	title: "060147 的博客",

	/** 站点副标题 / 简介，显示在首页 */
	subtitle: "记录与分享",

	/** 站点描述，用于 SEO 与 RSS */
	description: "060147 的个人博客，记录与分享技术、学习与生活。",

	/** 站点最终访问地址（末尾不要带斜杠），用于生成绝对链接 */
	siteUrl: "https://060147.xyz",

	/** 默认语言 */
	lang: "zh-CN",

	/** 作者名 */
	author: "060147",

	/** 每页显示的文章数量 */
	postsPerPage: 10,

	/** 导航栏链接 */
	nav: [
		{ text: "首页", href: "/" },
		{ text: "归档", href: "/archive/" },
		{ text: "关于", href: "/about/" },
	],

	/** 页脚链接 */
	footer: [
		{ text: "RSS", href: "/rss.xml" },
		{ text: "GitHub", href: "https://github.com/baotnight" },
	],
} as const;

export type SiteConfig = typeof siteConfig;
