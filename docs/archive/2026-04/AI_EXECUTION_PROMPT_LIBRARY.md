# AI 执行指令模板库（不含付费功能）

> 适用对象：Claude / Codex / GPT 等代码与内容 AI
> 
> 项目目标：先完成免费产品 + 引流 + 个人 IP 基建，不接入任何支付或付费流程。

---

## 0. 全局约束（每次执行前必须附带）

请严格遵守以下约束：

1. 本次任务**不允许**实现任何付费相关功能（Payment/Checkout/Pricing/Booking）。
2. 本次任务仅面向免费增长闭环：Landing → Calculator → Result → Share/Subscribe。
3. 不新增与目标无关功能，不做大范围重构。
4. 所有改动必须可验证，给出测试步骤。
5. 输出格式必须包含：
   - Scope
   - Files
   - Steps
   - Validation
   - Rollback

---

## 1. 通用执行模板（代码任务）

将以下模板直接发给 AI：

```text
你是该项目的高级工程师。请按以下要求执行：

## Scope
- 仅完成：<填写本次任务目标>
- 禁止实现：任何支付、订阅、预约、商品销售相关逻辑

## Files
- 仅允许修改：
  - <文件1>
  - <文件2>
  - <文件3>

## Steps
1) 先阅读相关文件并总结当前行为（简要）
2) 基于现有模式进行最小改动实现目标
3) 补充必要埋点（如有）
4) 保持样式与现有设计系统一致

## Validation
- 列出手动验证路径（桌面+移动）
- 列出关键断言（预期结果）

## Rollback
- 说明如何回退本次改动

最后输出：
1. 变更摘要（按文件）
2. 验证结果
3. 未完成项（若有）
```

---

## 2. 页面改造模板（Landing/Calculator/Result）

```text
请改造 MysticEast 的免费用户路径，目标是提升完成率和分享率。

## Scope
- 优化路径：Landing -> Calculator -> Result
- 不允许加入任何付费 CTA、价格、购买按钮

## Files
- mysticeast/app/(marketing)/page.tsx
- mysticeast/app/(marketing)/calculator/page.tsx
- mysticeast/app/(marketing)/result/page.tsx

## Requirements
1) Landing 主 CTA 统一指向 /calculator
2) Calculator 保持最小字段，减少认知负担
3) Result 首屏必须包含：
   - 1句核心结论
   - 3条可执行建议
   - 下一步按钮（阅读文章/订阅）
4) 加入分享模块：复制摘要文案 + 分享入口
5) 保持现有品牌视觉风格一致

## Analytics Events
- landing_cta_clicked
- calculator_started
- calculator_submitted
- result_viewed
- share_clicked

## Validation
- 首页到结果页 <= 3 步
- Result 首屏不滚动可见核心内容
- 分享入口在移动端可用
```

---

## 3. 邮件捕获模板（仅订阅，不营销变现）

```text
请实现免费内容订阅流程（double opt-in），不涉及任何付费转化。

## Scope
- 仅实现邮箱收集 + 邮箱确认 + 成功提示
- 禁止出现购买/咨询付费文案

## Files
- mysticeast/app/api/email/route.ts
- mysticeast/app/(marketing)/page.tsx
- mysticeast/app/(marketing)/result/page.tsx
- <footer组件文件>

## Requirements
1) API 支持邮箱格式校验、去重、状态记录（pending/confirmed）
2) 支持确认 token 流程（GET confirm）
3) 三处入口接入：Landing / Result / Footer
4) 前端状态完整：loading/success/error
5) 成功文案强调“每周免费洞察”

## Analytics Events
- email_submitted
- email_confirmed

## Validation
- 提交邮箱 -> 收到确认 -> 点击确认 -> 状态更新成功
- 重复邮箱提交有明确提示
```

---

## 4. SEO 执行模板（免费增长）

```text
请完善 MysticEast 的 SEO 基础，目标是提升免费流量。

## Scope
- 仅 SEO 与可发现性优化
- 不涉及付费页面优化

## Requirements
1) 每个营销页补齐 title/description/canonical
2) 检查并更新 sitemap.xml 与 robots.txt
3) 补充基础 JSON-LD（WebSite / WebApplication / FAQ）
4) 页面文案包含自然关键词，不堆砌
5) 保持英文表达自然可读

## Deliverables
- 变更文件清单
- 每页 meta 预览摘要
- GSC 提交建议清单（手动执行项）
```

---

## 5. 博客系统模板（MDX）

```text
请搭建最小可用博客系统（MDX），用于免费流量引入。

## Scope
- 实现博客列表页 + 详情页 + 内容读取
- 不做 CMS 后台，不做付费墙

## Files (建议)
- mysticeast/content/blog/*.mdx
- mysticeast/lib/blog.ts
- mysticeast/app/(blog)/blog/page.tsx
- mysticeast/app/(blog)/blog/[slug]/page.tsx

## Requirements
1) frontmatter 字段：title, description, date, tags, author
2) 列表页支持按日期排序
3) 详情页底部固定 CTA：
   - Try Free Calculator
   - Subscribe Weekly Insights
4) 添加相关文章推荐（至少3条）

## Validation
- 新增文章后无需改代码即可展示
- 博客详情页可被索引（含完整 meta）
```

---

## 6. 英文博客生成模板（内容生产）

```text
你是英文内容策略编辑。请为 BaZi 独立站写一篇 SEO 友好文章。

## Topic
<填写主题>

## Audience
US/UK/CA/AU 对东方命理感兴趣的新手用户

## Tone
- 清晰、可信、实用
- 不夸大，不神化，不做绝对承诺
- 强调 self-reflection 和 decision support

## Structure
1) Hook（问题开场）
2) Concept（概念解释）
3) Practical Advice（3-5条）
4) Common Mistakes（误区）
5) Next Action（引导体验免费工具）

## SEO
- 主关键词：<填写>
- 次关键词：<填写2-3个>
- 字数：1200-1800
- 输出包含：
  - SEO title（<=60 chars）
  - Meta description（<=155 chars）
  - H2/H3结构
  - 结尾CTA文案
```

---

## 7. 社媒内容生成模板（IG + Pinterest）

```text
请基于以下博客内容生成社媒素材。

输入：<文章链接或摘要>
输出：

1) Instagram 帖子 x3
- 1条教育向 carousel（6-8页）
- 1条互动向（提问/投票文案）
- 1条短洞察文案（100-150词）
- 每条附：CTA + 10个hashtags

2) Pinterest Pin x3
- 每个Pin包含：
  - Title（<=100 chars）
  - Description（200-400 chars）
  - Overlay text（图上短句）
  - Link CTA

要求：
- 风格统一
- 明确导流到免费工具或博客
- 不出现购买导向文案
```

---

## 8. 周复盘模板（数据驱动）

```text
请基于本周数据生成增长复盘。

## Input Data
- Landing visits
- Calculator starts
- Calculator submits
- Result views
- Share clicks
- Email submits
- Email confirms
- Blog visits
- Top traffic sources

## Output Format
1) 本周关键结论（3条）
2) 漏斗转化率（逐步）
3) 流失最大环节（1-2个）
4) 下周优先动作（最多3项）
5) 立即停止动作（若有）

要求：
- 结论必须基于数据
- 建议必须可执行且可验证
```

---

## 9. QA 模板（发布前检查）

```text
请对本次改动执行发布前 QA。

## Checklist
- [ ] 桌面端关键路径可用
- [ ] 移动端关键路径可用
- [ ] 表单校验与报错正常
- [ ] 埋点事件触发正常
- [ ] 页面 meta 信息完整
- [ ] 无付费入口/价格文案泄漏
- [ ] 无明显样式错位
- [ ] 无 console error

请输出：
1) 通过项
2) 失败项（附复现步骤）
3) 修复建议优先级（P0/P1/P2）
```

---

## 10. 任务拆解模板（给 AI 自动排程）

```text
请把以下目标拆解为可执行任务：<填写目标>

要求：
1) 输出 10-20 个任务
2) 每个任务包含：
   - 任务名
   - 目标
   - 涉及文件
   - 依赖关系
   - 验收标准
3) 按优先级排序（P0/P1/P2）
4) 先做影响最大且工作量最小的任务
5) 不包含任何付费相关开发
```

---

## 11. 建议的首轮执行顺序（直接照做）

1. 页面路径优化（Landing→Calculator→Result）
2. Result 分享与可执行建议模块
3. 邮件捕获三入口 + double opt-in
4. 埋点标准化
5. SEO 基础加固
6. 博客系统 + 6篇基础文章
7. IG + Pinterest 内容流水线
8. 每周复盘机制

---

## 12. 使用说明

- 每次只选一个模板执行，避免指令过宽。
- 若任务跨多个模板，先用“任务拆解模板”生成任务单，再逐个执行。
- 所有 AI 输出都必须带 Validation 和 Rollback。
- 每周至少一次复盘，防止“做了很多但没增长”。
