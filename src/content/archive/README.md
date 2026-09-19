# 归档的示例文章

这个目录**不是** Astro 的内容集合，不会被构建进网站，网页上也没有任何入口。

文章集合只扫描 `src/content/posts/`，把文件放在这里就等于「留档但不显示」。

## 里面是什么

| 文件 | 内容 |
| --- | --- |
| `hello-world.md` | 写作示例，说明 frontmatter 各字段的写法 |
| `deploy-to-server.md` | 宝塔 + PM2 + Nginx 的部署方案说明 |

## 想恢复成正式文章

把它移回 `src/content/posts/` 即可，例如：

```bash
git mv src/content/archive/hello-world.md src/content/posts/hello-world.md
```

不需要就直接删掉整个目录：

```bash
rm -rf src/content/archive
```
