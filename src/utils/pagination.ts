export interface Pagination {
	page: number;
	totalPages: number;
	totalItems: number;
}

/** 根据条目总数与每页数量计算总页数（至少 1 页） */
export function paginate(
	totalItems: number,
	perPage: number,
	current: number,
): Pagination {
	const safePerPage = perPage > 0 ? perPage : 10;
	const totalPages = Math.max(1, Math.ceil(totalItems / safePerPage));
	return { page: current, totalPages, totalItems };
}

/** 截取当前页的数据 */
export function pageSlice<T>(items: T[], perPage: number, page: number): T[] {
	const safePerPage = perPage > 0 ? perPage : 10;
	const start = (page - 1) * safePerPage;
	return items.slice(start, start + safePerPage);
}
