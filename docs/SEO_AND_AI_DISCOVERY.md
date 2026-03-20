# 搜索引擎与 AI 可发现性（SEO / GEO）

本文说明本项目已做的站内优化，以及上线后你**仍需在站外完成**的动作。

## 站内已做

| 项目 | 说明 |
|------|------|
| **Meta / OG / Twitter** | `index.html` 默认 + `src/utils/seo.ts` 随语言更新 |
| **hreflang** | 中英文 `?lang=` 交替链接 |
| **canonical + og:url** | 路由或查询变化时由 `syncSPAUrls()` 同步 |
| **Schema.org JSON-LD** | `Organization`、`WebSite`、`WebApplication`、`FAQPage`（**已移除虚假 aggregateRating**） |
| **sitemap.xml** | 营销页 + 博客/隐私/条款/邀请等 |
| **robots.txt** | 允许常见搜索引擎；**显式 Allow** 多种 AI 爬虫（可按隐私需求改为 Disallow） |
| **llms.txt** | `/llms.txt` 供大模型/工具抓取站点摘要（非标准强制，但越来越多产品采用） |
| **文案** | `locales/zh|en/seo.json` 含月运、易经、合盘、2026 等关键词 |

## 绑定自定义域名时

全文检索替换或通过构建变量，把 `https://fortunecalendar.vercel.app` 改为你的正式域名，并更新：

- `index.html`（canonical、OG、JSON-LD）
- `public/sitemap.xml`
- `public/robots.txt` 中的 Sitemap 行
- `public/llms.txt` 中的 Production URL

## 站外必做（否则收录慢）

1. **Google Search Console**：验证域名、提交 `sitemap.xml`、查看收录与体验报告。  
2. **Bing Webmaster Tools**：同样提交站点地图（覆盖必应与国内部分通道）。  
3. **百度搜索资源平台**（若主攻国内）：验证并提交链接/sitemap。  
4. **持续内容**：博客 `/blog` 原创、长尾词文章，比堆关键词更有效。  
5. **外链与品牌词**：社交媒体、应用商店说明、GitHub README 等指向同一官方 URL。

## AI 推荐 / 摘要类场景

- **合规声明**：页面已有娱乐参考类免责；AI 引述时不易产生「医疗/投资建议」误解。  
- **llms.txt**：简要说明产品定位与主要路径，减少模型胡编。  
- **结构化数据**：帮助传统搜索富摘要；部分 AI 检索链仍会利用公开 HTML。  
- **若不希望被用于模型训练**：在 `robots.txt` 里将对应 `User-agent`（如 `GPTBot`）改为 `Disallow: /`。

## 验证工具

- [Rich Results Test](https://search.google.com/test/rich-results)（结构化数据）  
- [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/)（OG）  
- 浏览器「查看源代码」确认首屏 `title`/`description` 与 JSON-LD 存在

---

*最后更新：2026-03*
