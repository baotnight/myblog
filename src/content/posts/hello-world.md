---
title: 欢迎来到我的博客
published: 2026-01-01
description: 这是第一篇示例文章，说明本博客的基本用法。
tags: ["Astro", "教程"]
category: 随笔
---

这是本站的第一篇示例文章。它同时用来说明写作与部署的基本流程。

## 如何写一篇新文章

在 `src/content/posts/` 目录下新建一个 `.md` 文件，文件名就是文章的 URL：

```
src/content/posts/my-first-post.md  →  /posts/my-first-post/
```

文件开头是 frontmatter，用来填写文章信息：

```yaml
---
title: 文章标题
published: 2026-01-01
description: 一句话摘要，会显示在列表页
tags: ["标签1", "标签2"]
category: 分类名
draft: false
---
```

## 可用的 frontmatter 字段

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `title` | 是 | 文章标题 |
| `published` | 是 | 发布日期，如 `2026-01-01` |
| `updated` | 否 | 更新日期 |
| `description` | 否 | 摘要，用于列表页和 SEO |
| `tags` | 否 | 标签数组 |
| `category` | 否 | 分类 |
| `draft` | 否 | 设为 `true` 后生产环境不显示 |
| `image` | 否 | 封面图路径 |
| `author` | 否 | 作者，留空则用站点默认值 |

## 关于草稿

`draft: true` 的文章在本地开发时可以看到，但**构建后不会出现**在网站上，可以放心提交。

> 提示：想改站点标题、导航栏、页脚等内容，编辑 `src/config/siteConfig.ts` 即可。

## 代码块示例

```js
export function greet(name) {
	return `你好，${name}！`;
}
```

## 下一步

- 把 `src/config/siteConfig.ts` 里的占位信息改成你自己的
- 修改 `src/content/spec/about.md` 写关于页
- 查看项目根目录的 `README.md` 了解部署方法
