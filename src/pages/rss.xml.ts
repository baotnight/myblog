import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { siteConfig } from "@/config";
import { getSortedPosts } from "@utils/posts";
import { postUrl } from "@utils/urls";

export const GET: APIRoute = async (context) => {
	const posts = await getSortedPosts();

	return rss({
		title: siteConfig.title,
		description: siteConfig.description,
		site: context.site ?? siteConfig.siteUrl,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.description,
			pubDate: post.data.published,
			link: postUrl(post.id),
		})),
		customData: "<language>zh-cn</language>",
	});
};
