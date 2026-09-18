/** 文章详情页地址。集中在此处便于以后调整 URL 规则。 */
export function postUrl(id: string): string {
	return `/posts/${id}/`;
}

/** 归档分页地址：第 1 页为 /archive/，其余为 /archive/page/N/ */
export const ARCHIVE_BASE = "/archive";

export function archiveUrl(page: number): string {
	return page <= 1 ? `${ARCHIVE_BASE}/` : `${ARCHIVE_BASE}/page/${page}/`;
}
