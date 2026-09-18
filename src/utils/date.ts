/** 把日期格式化为 YYYY-MM-DD */
export function formatDate(date: Date): string {
	const y = date.getFullYear();
	const m = String(date.getMonth() + 1).padStart(2, "0");
	const d = String(date.getDate()).padStart(2, "0");
	return `${y}-${m}-${d}`;
}

/** 把日期格式化为 datetime 属性所需的 ISO 字符串 */
export function toISODate(date: Date): string {
	return date.toISOString();
}
