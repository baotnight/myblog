import { getCollection, type CollectionEntry } from "astro:content";

export type Post = CollectionEntry<"posts">;

/**
 * 取出全部文章，过滤草稿，并按发布日期倒序排列。
 * 生产环境不返回草稿；开发环境返回草稿以便预览。
 */
export async function getSortedPosts(): Promise<Post[]> {
	const posts = await getCollection("posts", ({ data }) => {
		return import.meta.env.PROD ? data.draft !== true : true;
	});

	return posts.sort(
		(a, b) => b.data.published.getTime() - a.data.published.getTime(),
	);
}

/** 取上一篇 / 下一篇（基于已排序的列表） */
export function getAdjacentPosts(posts: Post[], id: string) {
	const index = posts.findIndex((post) => post.id === id);
	return {
		prev: index > 0 ? posts[index - 1] : undefined,
		next: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
	};
}
