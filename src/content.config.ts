import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

/**
 * 博客文章集合，对应 src/content/posts 下的 .md 文件。
 * frontmatter 字段可按需增删。
 */
const posts = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
	schema: z.object({
		/** 文章标题（必填） */
		title: z.string(),
		/** 发布日期（必填） */
		published: z.coerce.date(),
		/** 最后更新日期（可选） */
		updated: z.coerce.date().optional(),
		/** 摘要，显示在列表页 */
		description: z.string().optional().default(""),
		/** 标签 */
		tags: z.array(z.string()).optional().default([]),
		/** 分类 */
		category: z.string().optional().default(""),
		/** 设为草稿后在列表中隐藏 */
		draft: z.boolean().optional().default(false),
		/** 封面图路径（可选） */
		image: z.string().optional().default(""),
		/** 作者，留空则使用站点默认作者 */
		author: z.string().optional().default(""),
	}),
});

/**
 * 固定页面集合，对应 src/content/spec 下需要自定义正文的页面（如关于页）。
 */
const spec = defineCollection({
	loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/spec" }),
	schema: z.object({
		title: z.string(),
		description: z.string().optional().default(""),
	}),
});

export const collections = { posts, spec };
