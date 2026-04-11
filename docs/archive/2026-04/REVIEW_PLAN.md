# MysticEast 转型计划审查

> **原始计划书**: ai-website-spec.md
> **审查日期**: 2026-04-08
> **审查目标**: 从"命运日历"转型为面向西方市场的 BaZi/Feng Shui 品牌展示型独立站

---

## 执行摘要

### 核心转型

| 维度 | 现状 | 目标状态 |
|------|------|----------|
| **品牌** | 命运日历 (Fortune Calendar) | MysticEast / EasternWisdom Co. |
| **市场** | 中文用户 | 西方英语用户 (US/UK/CA/AU) |
| **模式** | 免费运势查询工具 | 品牌展示型独立站 + 获客漏斗 |
| **核心产品** | 每日运势 | Destiny Map ($99命盘解读服务) |
| **收入** | 捐赠/打赏 | 服务预约 + 联盟营销 + 数字产品 |

### 技术策略 (已确认)

- **实施方式**: 渐进式重构
- **电商需求**: ❌ 无需完整电商，仅展示型独立站
- **核心功能**: 八字计算器(获客) + 产品/服务展示 + 品牌故事
- **交易流程**: 引导至邮件咨询/外部预约系统

---

## 产品架构 (来自计划书)

### 三层产品金字塔

```
┌─────────────────────────────────────────┐
│  TIER 3: $300-$1000+                   │
│  • 1:1 Destiny Coaching                │
│  • Annual Feng Shui Audit              │
│  • BaZi Practitioner Certification     │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│  TIER 2: $75-$250 (核心收入)             │
│  • Complete Destiny Map ($99)          │
│  • Personalized Crystal Collection     │
│  • Home Energy Assessment              │
│  • Relationship Compatibility          │
└──────────────────┬──────────────────────┘
                   │
┌──────────────────┴──────────────────────┐
│  FREE → TIER 1: $15-$50                │
│  • Free Element Assessment (获客)       │
│  • Five Elements Starter Set           │
│  • Zodiac Crystal Candle               │
│  • Element Balancing Bracelet          │
└─────────────────────────────────────────┘
```

### 用户旅程

```
LANDING PAGE
    │
    ▼
┌─────────────────────────────────────────┐
│  Hero: "Discover Your Elemental Nature" │
│  CTA: "Calculate Your Chart (Free)"     │
└─────────────────────────────────────────┘
    │
    ▼
BIRTH DATA INPUT → Email Capture
    │
    ▼
FREE MINI-RESULTS (Day Master + 1 Insight)
    │
    ▼
CTA: "Unlock Full 30-Page Reading ($99)"
    │
    ├── Yes → 邮件咨询/预约流程
    │
    └── No → 培育邮件序列
```

---

## 网站架构

```
HOME
├── DISCOVER
│   ├── Free BaZi Calculator (核心获客工具)
│   ├── What is BaZi? (教育内容)
│   ├── Five Elements Guide
│   └── Feng Shui Basics
├── READINGS (服务展示)
│   ├── Complete Destiny Map ($99)
│   ├── Annual Forecast ($79)
│   ├── Relationship Reading ($89)
│   └── Business Reading ($350)
├── SHOP (产品展示，无购物车)
│   ├── Crystals (By Element/Intention)
│   ├── Feng Shui Items
│   └── Gift Sets
├── MEMBERSHIP
│   └── The Flow Box (订阅盒展示)
├── LEARN
│   ├── Blog (SEO内容)
│   ├── Free Guides
│   └── Video Library
└── ABOUT
    ├── Our Story
    ├── How It Works
    ├── Reviews
    └── FAQ
```

---

## 设计系统 (来自计划书)

### 色彩方案

| 用途 | 颜色 | 意义 |
|------|------|------|
| Primary | `#2D1B4E` (深靛蓝) | 灵性、信任 |
| Secondary | `#C9A227` (金色) | 繁荣、高端 |
| Accent | `#00A86B` (翠绿) | 成长、疗愈 |
| Background | `#F5F1E8` (奶油色) | 温暖、自然 |
| Text | `#2C2C2C` (炭灰) | 可读性 |

### 字体

- **Headlines**: Serif - Cormorant Garamond (优雅、可信)
- **Body**: Sans-serif - Inter/Open Sans (可读)

---

## 技术现状

### 现有技术栈
- React 19 + TypeScript
- Tailwind CSS 4
- Vite (rolldown-vite)
- Framer Motion
- Python API (Vercel Serverless)

### 现有组件资产
- 129+ React 组件
- 东方美学组件目录 (`src/components/oriental/`)
- 八字计算引擎 (Python)
- PWA 配置

### 需新增/修改
- [ ] 西方市场品牌视觉系统
- [ ] 英文内容国际化
- [ ] 邮件捕获集成 (Klaviyo/Mailchimp)
- [ ] 产品/服务展示页面
- [ ] 博客/内容系统
- [ ] SEO优化 (英文关键词)

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Codex Review | `/codex review` | Independent 2nd opinion | 0 | — | — |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 0 | — | — |
| Design Review | `/plan-design-review` | UI/UX gaps | 0 | — | — |

**VERDICT:** NO REVIEWS YET — Autoplan in progress.

---

## CEO DUAL VOICES — CONSENSUS TABLE

═══════════════════════════════════════════════════════════════
  Dimension                           Claude  Codex  Consensus
  ──────────────────────────────────── ─────── ─────── ─────────
  1. Premises valid?                   ⚠️      N/A    部分质疑
  2. Right problem to solve?           ⚠️      N/A    需验证需求
  3. Scope calibration correct?        ✅      N/A    确认
  4. Alternatives sufficiently explored?⚠️      N/A    需考虑B2B等
  5. Competitive/market risks covered? ❌      N/A    严重不足
  6. 6-month trajectory sound?         ⚠️      N/A    过于乐观
═══════════════════════════════════════════════════════════════

**状态**: Single-model review (Codex unavailable) - Claude subagent only

### CEO Review 关键发现汇总

**Critical Issues (需立即处理)**:
1. **市场需求未验证** - 西方用户是否想要BaZi？建议先$500广告测试
2. **竞争风险** - Co-Star/The Pattern若入场将碾压
3. **定价尴尬** - $99处于竞争最激烈的价格带

**High Issues (需关注)**:
1. 学习曲线过高（8字符 vs 12星座）
2. 差异化不清晰（"更精确" vs "不同框架"）
3. 文化挪用风险

**战略建议**:
- 考虑B2B路径（wellness coach工具）
- 或先做内容媒体验证需求
- MVP应缩减至单页面验证

## Decision Audit Trail

| # | Phase | Decision | Principle | Rationale | Rejected |
|---|-------|----------|-----------|-----------|----------|
| 1 | CEO | 保持渐进式重构 | P5 (Explicit) | 子代理建议Shopify验证，但现有代码资产值得保留 | Shopify快速验证 |
| 2 | CEO | 扩展MVP范围包含博客 | P2 (Boil Lake) | SEO是核心获客，MVP阶段就需布局 | 纯单页验证 |
| 3 | CEO | 增加需求验证步骤 | P1 (Complete) | 子代理强烈建议先验证需求，这是关键缺口 | 直接开发 |
| 4 | CEO | 保留$99定价但准备A/B测试 | P3 (Pragmatic) | 子代理质疑定价，但计划书已设定，可测试后调整 | 改为$500+高端或免费 |

## DESIGN DUAL VOICES — CONSENSUS TABLE

═══════════════════════════════════════════════════════════════
  Dimension                           Claude  Codex  Consensus
  ──────────────────────────────────── ─────── ─────── ─────────
  1. Information Architecture          5/10    N/A    导航过复杂
  2. Interaction States                6/10    N/A    部分缺失
  3. Visual Design                     4/10    N/A    方向偏离
  4. User Journey                      5/10    N/A    转化断裂
  5. AI Slop Risk                      7/10    N/A    相对安全
  6. Responsive                        7/10    N/A    基本可用
  7. Accessibility                     5/10    N/A    待完善
═══════════════════════════════════════════════════════════════

**平均分**: 5.6/10

**状态**: Single-model review (Codex unavailable)

### Design Review 关键发现汇总

**P0 - 需立即处理**:
1. **视觉设计方向偏离** - 当前"水墨东方"风格与MysticEast计划书的"Crystal+Earth+Indigo"西方wellness风格冲突
2. **缺少Email Capture节点** - 转化漏斗关键断裂

**P1 - 重要**:
1. 导航简化 (6个→4个一级项)
2. 新增 Free Mini-Results 中间页
3. Loading状态品牌感不足

**关键决策建议**:
- 品牌视觉重做：放弃水墨，转向Crystal+Earth tones
- 术语国际化：八字→BaZi/Destiny Map, 大运→Life Trends
- 功能简化：MVP砍掉合盘/解梦/成就，聚焦核心Destiny Map


## ENG DUAL VOICES — CONSENSUS TABLE

═══════════════════════════════════════════════════════════════
  Dimension                           Claude  Codex  Consensus
  ──────────────────────────────────── ─────── ─────── ─────────
  1. Architecture sound?               ⚠️      N/A    路由需解耦
  2. Test coverage sufficient?         ❌      N/A    完全缺失前端测试
  3. Performance risks addressed?      ⚠️      N/A    冷启动+计算瓶颈
  4. Security threats covered?         ❌      N/A    GDPR未规划
  5. Error paths handled?              ⚠️      N/A    部分考虑
  6. Deployment risk manageable?       ✅      N/A    Vercel可控
═══════════════════════════════════════════════════════════════

**状态**: Single-model review (Codex unavailable)

### Eng Review 关键发现汇总

**P0 - 需立即决策**:
1. **数据存储方案** - Vercel KV vs PostgreSQL for 邮箱存储
2. **前端测试债务** - 129+组件零测试，重构风险高
3. **GDPR合规缺口** - 邮箱捕获需同意机制

**P1 - 重要**:
1. 路由结构重构 - 分离营销页(/marketing/*)与应用页(/app/*)
2. 八字计算性能 - 月度计算30次循环需缓存
3. 邮件服务选型 - Klaviyo vs Mailchimp vs Resend自建

**关键决策建议**:
- **Phase 1**: 邮件捕获(MVP) → 用Resend+KV快速验证
- **Phase 2**: 集成Klaviyo(验证后) → 营销自动化
- **测试**: 立即添加Vitest + Playwright基础设施

---

## Cross-Phase Themes

**跨阶段共同关注的问题**:

1. **需求验证优先于开发** (CEO+Eng)
   - CEO子代理: "$500广告测试先验证需求"
   - Eng子代理: "分离Phase 1/2，先验证再投入"

2. **数据/合规基础需早期决策** (CEO+Design+Eng)
   - CEO: 邮箱捕获时机质疑
   - Design: Email Gate UX可能产生阻力
   - Eng: GDPR+存储方案未定

3. **视觉与定位的冲突** (CEO+Design)
   - CEO: "东方主义风险"
   - Design: "当前水墨风格与Crystal+Earth目标冲突"

---

## NOT in Scope (明确延后)

| 项目 | 理由 | 何时添加 |
|------|------|----------|
| 完整电商功能 | 独立站模式，交易通过邮件引导 | 验证需求后 |
| 会员订阅系统 | The Flow Box订阅盒 | MRR达到$5K后 |
| 多语言支持 | 专注英语市场 | 美国市场验证后 |
| 合盘/解梦/成就 | 功能过于复杂 | 核心Destiny Map验证后 |
| 数据库迁移 | 先用KV验证，再评估规模 | 用户数>10K |
| 完整Klaviyo集成 | Phase 1先用Resend验证 | 邮件量>100/月后 |

---

## What Already Exists (可重用资产)

| 资产 | 位置 | 重用方式 |
|------|------|----------|
| 八字计算引擎 | `api/core/bazi_engine.py` | 100%重用，API封装 |
| 农历/干支计算 | `api/core/lunar.py` | 100%重用 |
| 日期/时间选择器 | `src/components/Date*.tsx` | 重用+新样式 |
| i18n系统 | `src/i18n/` | 扩展英文文案 |
| PWA框架 | `vite.config.ts` | 配置调整 |
| 分析埋点 | `src/utils/analytics.ts` | 重用+GA4迁移 |

---

## Decision Audit Trail (Complete)

| # | Phase | Decision | Principle | Rationale | Rejected |
|---|-------|----------|-----------|-----------|----------|
| 1 | CEO | 保持渐进式重构 | P5 (Explicit) | 代码资产值得保留 | Shopify快速验证 |
| 2 | CEO | 扩展MVP范围包含博客 | P2 (Boil Lake) | SEO是核心获客 | 纯单页验证 |
| 3 | CEO | 增加需求验证步骤 | P1 (Complete) | 子代理一致建议 | 直接开发 |
| 4 | CEO | 保留$99定价 | P3 (Pragmatic) | 可测试后调整 | 改为$500+或免费 |
| 5 | Design | 简化导航至4项 | P5 | 6项认知负荷高 | 保持6项 |
| 6 | Design | 新增Free Mini-Results页 | P1 | 转化漏斗关键 | 直接展示完整 |
| 7 | Design | 视觉系统完全替换 | P1 | 风格与目标冲突 | 混合风格 |
| 8 | Eng | Phase 1用Resend+KV | P3 | 快速验证 | 直接Klaviyo |
| 9 | Eng | 立即添加前端测试 | P1 | 零测试风险高 | 延后测试 |
| 10 | Eng | 路由分离marketing/app | P5 | 清晰边界 | 保持混合路由 |

---

## Completion Summary

### Phase 1: CEO Review
- **Status**: 完成 (单模型 - Codex不可用)
- **发现**: 6个维度，主要关注市场需求验证和竞争风险
- **关键决策**: 增加$500广告验证步骤

### Phase 2: Design Review
- **Status**: 完成 (单模型)
- **平均分**: 5.6/10
- **关键问题**: 视觉方向偏离、转化漏斗断裂

### Phase 3: Eng Review
- **Status**: 完成 (单模型)
- **关键问题**: 测试债务、GDPR合规、性能瓶颈

### 跨阶段主题
- 需求验证优先
- 数据/合规基础
- 视觉定位冲突

### 测试计划
- 已写入: `.gstack/test-plan-mysticeast.md`

---

## FINAL APPROVAL GATE - 决策已确认

### 用户决策汇总

| 决策 | 选择 | 理由 |
|------|------|------|
| 市场验证 | **直接开发MVP** | 系统性颠覆改造，需要完整设计展示 |
| 视觉系统 | **创造融合风格** | 东方底蕴+西方审美，极简水墨+水晶质感 |
| 邮件服务 | **Resend快速启动** | 利用现有配置，1天上线 |
| 技术架构 | **Next.js全新架构** | SSR优化SEO，长期可维护性最佳 |

### 最终范围确认

**MVP范围 (4-6周)**:
1. ✅ Next.js 全新架构
2. ✅ 融合风格视觉系统 (极简水墨+水晶+现代排版)
3. ✅ 核心页面: Landing + Calculator + Mini-Result + Services + About
4. ✅ Resend 邮件捕获
5. ✅ 八字计算API集成 (保留现有Python后端)
6. ✅ 博客系统 (SEO内容)

**延后 (后续Phase)**:
- Klaviyo 营销自动化
- 会员订阅系统
- 完整电商功能
- 多语言支持

### 关键风险接受

用户已知晓并接受以下风险:
- ⚠️ 市场需求未经验证 (选择直接开发而非广告测试)
- ⚠️ 4-6周开发投入，若需求不存在则成本沉没
- ⚠️ Next.js重写工作量较大，但长期收益认可

### 批准状态: ✅ APPROVED

**审查完成** - 计划已获批准，可进入实施阶段。

建议下一步: 创建详细实施计划 (Implementation Plan)

---

## Updated GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 1 | ✅ CLEARED | 6维度评估，需求验证建议 |
| Eng Review | `/plan-eng-review` | Architecture & tests | 1 | ✅ CLEARED | 技术方案确认 |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | ✅ CLEARED | 5.6/10，融合风格确认 |

**VERDICT:** ALL REVIEWS CLEARED — Ready to implement.

### 实施的决策记录

| 决策 | 最终选择 | 一致性 |
|------|----------|--------|
| 技术架构 | Next.js全新架构 | 用户选择，与Eng建议不同但可接受 |
| 视觉风格 | 融合风格 | 用户选择，平衡CEO/Design关注 |
| 邮件服务 | Resend | 用户选择与Eng建议一致 |
| 验证方式 | 直接MVP | 用户选择，接受风险 |

