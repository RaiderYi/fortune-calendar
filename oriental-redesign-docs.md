# 运势日历东方美学改版设计文档

**项目名称**: Fortune Calendar 东方美学改版  
**设计日期**: 2026-03-26  
**设计方向**: 现代东方美学沉浸式体验  

---

## 1. 设计概述

### 1.1 设计目标
将现有的运势日历应用从现代简约风格升级为「现代东方美学」风格，提升视觉统一性、功能丰富度和用户体验。

### 1.2 核心改进点
1. **视觉系统重构**: 建立统一的东方美学设计系统（色彩、字体、组件）
2. **运势卡片重设计**: 折叠展开式「每日运势签」结构
3. **新增趋势看板**: 数据可视化+智能洞察的「运势日记」
4. **塔罗/易经沉浸化**: 四阶段仪式流程（准备→抽牌→揭晓→解读）
5. **全局动效优化**: 水墨晕染转场+微动效

---

## 2. 视觉设计系统

### 2.1 设计哲学
「现代东方美学」—— 将传统元素提炼为现代设计语言：
- **留白哲学**: 借鉴中国画的「计白当黑」，界面呼吸感强
- **水墨流动**: 渐变、模糊、晕染效果营造意境
- **秩序与变化**: 网格系统严谨，但细节处有手写/不规则元素

### 2.2 色彩系统

| 用途 | 颜色值 | CSS变量 | 灵感来源 |
|------|--------|---------|----------|
| **主背景** | `#FAF8F3` | `--bg-paper` | 传统宣纸底色 |
| **深色背景** | `#1A1A2E` | `--bg-ink` | 深夜/占卜氛围 |
| **主强调色** | `#C45C26` | `--accent-vermilion` | 印章、吉祥 |
| **次强调色** | `#2D5A4A` | `--accent-qingdai` | 山水、青铜 |
| **金色** | `#D4A574` | `--accent-gold` | 贵气、高光 |
| **文字主色** | `#2C2C2C` | `--text-ink` | 书法墨汁 |
| **文字次要** | `#6B6B6B` | `--text-light-ink` | 辅助说明 |
| **边框** | `rgba(44,44,44,0.08)` | `--border-subtle` | 若隐若现 |

### 2.3 字体系统
- **标题字体**: Noto Serif SC（思源宋体）- 书法感
- **正文字体**: 系统默认无衬线 - 保证可读性
- **特殊装饰**: 局部使用书法体（如签文、运势关键词）

### 2.4 组件规范

#### 圆角规范
- 大卡片: `16px` (`rounded-2xl`)
- 小元素: `8px` (`rounded-lg`)
- 按钮: `9999px` (`rounded-full` 药丸形)

#### 阴影规范
```css
/* 悬浮卡片 */
--shadow-card: 0 4px 20px rgba(0,0,0,0.06);

/* 强调元素 */
--shadow-accent: 0 2px 8px rgba(196,92,38,0.2);

/* 水墨弥散 */
--shadow-ink: 0 8px 32px rgba(26,26,46,0.15);
```

#### 边框规范
- 极细线条: `0.5px solid rgba(44,44,44,0.08)`
- 强调边框: `1px solid rgba(196,92,38,0.3)`

---

## 3. 运势卡片重设计

### 3.1 结构: 折叠展开式「每日运势签」

#### 第一层: 签面（默认展示）
```
┌─────────────────────────────────┐
│                                 │
│    [水墨晕染背景动效]            │
│                                 │
│         今日运势                 │
│          🎋                      │
│                                 │
│      ┌─────────┐               │
│      │  88分   │  ← 大号数字   │
│      │  食神日 │  ← 主题标签   │
│      └─────────┘               │
│                                 │
│   "食神主事，宜享受生活"         │
│                                 │
│   [展开详情 ▼]                  │
│                                 │
└─────────────────────────────────┘
```

#### 第二层: 展开详情
- **六维雷达图**: 简化六边形，手绘风格
- **宜忌清单**: 图标 + 文字
- **八字简析**: 点击可展开完整
- **用神提示**

### 3.2 视觉细节

| 元素 | 设计规格 |
|------|---------|
| **分数展示** | 字号 `48px`，字体 `Noto Serif SC`，金色渐变 `linear-gradient(135deg, #D4A574, #C45C26)` |
| **主题标签** | 药丸形徽章，不同主题不同配色：食神(橙)、偏财(金)、七杀(墨蓝)、桃花(粉)、正印(紫) |
| **雷达图** | 手绘风格六边形，边框 `rgba(44,44,44,0.2)`，填充半透明水墨色 |
| **展开动画** | Framer Motion `layout` 动画，高度从0到auto，300ms ease-out |

### 3.3 交互动效

```typescript
// 分数滚动动画
const scoreAnimation = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

// 数字滚动效果
// 从0滚动到实际值，持续800ms
```

---

## 4. 趋势分析看板（新增页面）

### 4.1 页面路由
`/app/fortune/trends` - 替换现有 TrendsPage

### 4.2 页面结构

#### 顶部: 时间轴总览
```
┌─────────────────────────────────────────┐
│  运势轨迹                                │
│                                         │
│  [近7日] [近30日] [近半年] [全年]        │ ← Tab切换
│                                         │
│  ═══════════════════════════════════    │
│  [水墨风格面积图：总分趋势线]            │
│  渐变填充: rgba(196,92,38,0.1) → 透明  │
│                                         │
│   ●────●────●────●────●────●────●      │
│  3/20  21   22   23   24   25   26      │
│                                         │
└─────────────────────────────────────────┘
```

#### 中部: 六维雷达对比
- 左右并排两个雷达图
- 本周平均 vs 上周平均（或本月 vs 上月）
- 六个维度：事业、财运、桃花、健康、学业、出行

#### 底部: 洞察与建议
```
┌─────────────────────────────────────────┐
│  💡 运势洞察                             │
│                                         │
│  你的「财运」本周有上升趋势，            │
│  建议把握周三、周五的投资机会。          │
│                                         │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│                                         │
│  📅 即将到来的吉日                       │
│                                         │
│  3月28日 (周六) - 综合运势 95分 ★★★★★  │
│  适合：签约、出行、社交                  │
│                                         │
└─────────────────────────────────────────┘
```

### 4.3 图表风格定制

#### 面积图（趋势）
```typescript
const areaChartConfig = {
  stroke: '#C45C26',
  strokeWidth: 2,
  fill: 'url(#inkGradient)', // 水墨渐变
  dot: { fill: '#D4A574', strokeWidth: 2, r: 4 },
  activeDot: { fill: '#C45C26', r: 6 }
};

// SVG渐变定义
<defs>
  <linearGradient id="inkGradient" x1="0" y1="0" x2="0" y2="1">
    <stop offset="5%" stopColor="rgba(196,92,38,0.2)" />
    <stop offset="95%" stopColor="rgba(196,92,38,0)" />
  </linearGradient>
</defs>
```

#### 雷达图（六维）
- 六边形边框: `stroke: rgba(44,44,44,0.15)`
- 填充区域: `fill: rgba(196,92,38,0.15)`
- 数据点: 金色圆点

### 4.4 交互设计

- **时间切换**: Tab切换时图表平滑过渡（Framer Motion）
- **节点点击**: 点击趋势图上的某一天，弹出当日运势速览 Modal
- **双指缩放**: 在面积图上双指捏合可放大查看细节
- **滑动切换**: 左右滑动切换「本周vs上周」对比

---

## 5. 塔罗/易经沉浸式体验

### 5.1 塔罗页面流程

#### 阶段一: 准备（静心）
- 深色全屏背景 `#1A1A2E`
- 中央水晶球图标 + 提示文字
- 水墨涟漪呼吸动画
- 「开始抽牌」按钮

#### 阶段二: 抽牌（神秘）
- 背景暗下来，聚光灯效果
- 5张卡牌横向排列（牌背：东方云纹）
- 左右滑动选择
- 选中高亮效果

#### 阶段三: 揭晓（惊喜）
交互流程:
1. 选中牌放大至屏幕中央
2. 水墨晕染效果从中心扩散
3. 3D翻转动画（牌背→牌面）
4. 金粉飘落粒子效果
5. 牌意渐显

#### 阶段四: 解读（沉浸）
- 大图展示 + 牌名
- 正位/逆位含义
- 「对你问题的启示」个性化解读
- [保存到日记] [分享签文] 按钮

### 5.2 动效规格

#### 3D翻牌动画
```typescript
const flipAnimation = {
  initial: { rotateY: 0 },
  animate: { 
    rotateY: 180,
    transition: { duration: 0.8, ease: "easeInOut" }
  }
};

// 需要 perspective: 1000px 容器
```

#### 水墨晕染扩散
```typescript
const inkSpread = {
  initial: { scale: 0, opacity: 0.8 },
  animate: { 
    scale: 3,
    opacity: 0,
    transition: { duration: 1, ease: "easeOut" }
  }
};
```

#### 金粉飘落
- 使用 Canvas 或 CSS 动画
- 20-30个粒子
- 随机下落路径
- 持续2秒后淡出

### 5.3 易经页面差异

| 维度 | 塔罗 | 易经 |
|------|------|------|
| 视觉风格 | 西方神秘学 | 东方古典 |
| 选择方式 | 78张卡牌滑动 | 三枚铜钱摇卦 |
| 揭晓动画 | 3D翻转 | 铜钱旋转落地 |
| 结果呈现 | 牌面+牌意 | 卦象+爻辞 |

**摇卦交互细节**:
1. 双手合十动画提示
2. 点击「摇卦」按钮
3. 三枚铜钱旋转动画（3D transform）
4. 落地定格（显示正/反面）
5. 重复六次
6. 六爻自下而上逐个生成
7. 显示卦象与爻辞解读

---

## 6. 全局动效系统

### 6.1 页面切换转场

```typescript
// 水墨晕染转场
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    transition: { duration: 0.3 }
  }
};
```

### 6.2 列表项 Stagger 动画

```typescript
const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.05 // 50ms 间隔
    }
  }
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.3 }
  }
};
```

### 6.3 按钮微动效

```typescript
const buttonHover = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

const buttonTap = {
  scale: 0.98
};
```

### 6.4 加载状态

#### 水墨旋转
```css
@keyframes inkRotate {
  0% { transform: rotate(0deg); opacity: 0.6; }
  50% { opacity: 1; }
  100% { transform: rotate(360deg); opacity: 0.6; }
}

.ink-loader {
  animation: inkRotate 2s linear infinite;
}
```

#### 呼吸涟漪
```css
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.6; }
}
```

### 6.5 手势交互

| 手势 | 触发 | 效果 |
|------|------|------|
| 右滑 | 屏幕左侧边缘 | 返回上一页 |
| 下拉 | 运势页顶部 | 重新测算 + 刷新动画 |
| 长按 | 日期卡片 | 预览当日运势速览 |
| 左右滑 | 趋势图 | 切换时间范围对比 |

---

## 7. 技术实现要点

### 7.1 依赖库

```json
{
  "dependencies": {
    "framer-motion": "^12.x", // 已存在，升级至最新
    "recharts": "^3.x", // 已存在
    "@fontsource/noto-serif-sc": "^5.x" // 新增：思源宋体
  }
}
```

### 7.2 性能优化

- 使用 `will-change: transform` 提示浏览器优化
- 复杂动画使用 CSS 而非 JS
- 支持 `prefers-reduced-motion` 媒体查询
- 图片懒加载 + 骨架屏

### 7.3 CSS变量定义

```css
:root {
  /* 背景 */
  --bg-paper: #FAF8F3;
  --bg-ink: #1A1A2E;
  
  /* 强调色 */
  --accent-vermilion: #C45C26;
  --accent-qingdai: #2D5A4A;
  --accent-gold: #D4A574;
  
  /* 文字 */
  --text-ink: #2C2C2C;
  --text-light-ink: #6B6B6B;
  
  /* 边框 */
  --border-subtle: rgba(44,44,44,0.08);
  
  /* 阴影 */
  --shadow-card: 0 4px 20px rgba(0,0,0,0.06);
  --shadow-accent: 0 2px 8px rgba(196,92,38,0.2);
  
  /* 字体 */
  --font-serif: 'Noto Serif SC', serif;
  --font-sans: system-ui, -apple-system, sans-serif;
}
```

---

## 8. 文件结构规划

```
src/
├── styles/
│   └── oriental-theme.css      # 东方美学CSS变量和工具类
├── components/
│   ├── oriental/               # 新组件
│   │   ├── FortuneCard/        # 运势签卡片
│   │   │   ├── index.tsx
│   │   │   ├── ScoreDisplay.tsx
│   │   │   ├── RadarChart.tsx
│   │   │   └── styles.css
│   │   ├── TrendDashboard/     # 趋势看板
│   │   │   ├── index.tsx
│   │   │   ├── TrendChart.tsx
│   │   │   ├── RadarCompare.tsx
│   │   │   └── InsightCard.tsx
│   │   ├── Tarot/              # 塔罗沉浸式体验
│   │   │   ├── DrawPhase.tsx
│   │   │   ├── RevealPhase.tsx
│   │   │   ├── Card3D.tsx
│   │   │   └── InkSpread.tsx
│   │   └── Yijing/             # 易经沉浸式体验
│   │       ├── CoinToss.tsx
│   │       ├── Hexagram.tsx
│   │       └── GuaDisplay.tsx
│   └── animations/             # 动画组件
│       ├── PageTransition.tsx
│       ├── StaggerContainer.tsx
│       └── InkLoader.tsx
├── hooks/
│   └── useOrientalTheme.ts     # 主题钩子
└── pages/
    └── app/
        └── TrendsPage.tsx      # 重写趋势页
```

---

## 9. 验收标准

### 9.1 视觉验收
- [ ] 所有页面使用新色彩系统，无硬编码颜色
- [ ] 字体正确加载，标题使用 Noto Serif SC
- [ ] 卡片、按钮、输入框符合组件规范
- [ ] 无视觉错位、重叠、截断问题

### 9.2 动效验收
- [ ] 页面切换有流畅转场动画
- [ ] 列表加载有 stagger 效果
- [ ] 按钮有悬停/点击反馈
- [ ] 塔罗抽牌有完整的四阶段动画
- [ ] 趋势图表加载有过渡动画

### 9.3 功能验收
- [ ] 运势卡片可展开/折叠
- [ ] 趋势看板可切换时间范围
- [ ] 雷达图正确显示六维数据
- [ ] 塔罗抽牌流程完整可用
- [ ] 手势交互（滑动、长按）响应正常

### 9.4 性能验收
- [ ] 首屏加载时间 < 2s
- [ ] 动画帧率 > 55fps
- [ ] 支持 reduced-motion 偏好设置

---

**设计文档完成，等待实现计划。**
# 运势日历东方美学改版实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将运势日历应用升级为东方美学风格，包括视觉系统重构、运势卡片重设计、新增趋势看板、塔罗/易经沉浸化体验

**Architecture:** 
1. 建立CSS变量系统统一管理东方美学色彩/字体/阴影
2. 拆分大型组件为聚焦单一职责的小组件
3. 使用Framer Motion实现所有动效
4. 新增TrendsDashboard页面替换现有TrendsPage

**Tech Stack:** React 19 + TypeScript + Tailwind CSS 4 + Framer Motion + Recharts + Noto Serif SC字体

**设计文档:** `docs/superpowers/specs/2026-03-26-oriental-redesign-design.md`

---

## 文件结构规划

```
src/
├── styles/
│   ├── oriental-theme.css       # CSS变量系统
│   └── fonts.css                # 字体加载
├── components/oriental/
│   ├── FortuneCard/
│   │   ├── index.tsx            # 主组件
│   │   ├── ScoreDisplay.tsx     # 分数展示动画
│   │   ├── RadarChart.tsx       # 六维雷达图
│   │   ├── TodoList.tsx         # 宜忌清单
│   │   └── BaziSection.tsx      # 八字折叠区
│   ├── TrendDashboard/
│   │   ├── index.tsx            # 趋势看板主组件
│   │   ├── TrendChart.tsx       # 面积趋势图
│   │   ├── RadarCompare.tsx     # 雷达对比图
│   │   ├── InsightCard.tsx      # 洞察卡片
│   │   └── TimeRangeTabs.tsx    # 时间范围切换
│   ├── Tarot/
│   │   ├── DrawPhase.tsx        # 准备/抽牌阶段
│   │   ├── RevealPhase.tsx      # 揭晓阶段
│   │   ├── Card3D.tsx           # 3D翻转卡牌
│   │   └── InkSpread.tsx        # 水墨扩散效果
│   └── animations/
│       ├── PageTransition.tsx   # 页面转场
│       ├── StaggerContainer.tsx # 列表stagger
│       └── InkLoader.tsx        # 水墨加载动画
├── hooks/
│   └── useOrientalTheme.ts      # 主题钩子
└── pages/app/
    └── TrendsPage.tsx           # 重写趋势页
```

---

## Task 1: 建立东方美学CSS变量系统

**Files:**
- Create: `src/styles/oriental-theme.css`
- Create: `src/styles/fonts.css`
- Modify: `src/index.css` (添加导入)

### Step 1: 创建CSS变量文件

```css
/* src/styles/oriental-theme.css */

:root {
  /* ========== 背景色 ========== */
  --bg-paper: #FAF8F3;
  --bg-paper-dark: #F0EDE6;
  --bg-ink: #1A1A2E;
  --bg-ink-light: #2A2A3E;
  
  /* ========== 强调色 ========== */
  --accent-vermilion: #C45C26;
  --accent-vermilion-light: #D97B45;
  --accent-vermilion-dark: #A34A1C;
  --accent-qingdai: #2D5A4A;
  --accent-qingdai-light: #3D7A64;
  --accent-gold: #D4A574;
  --accent-gold-light: #E4C59A;
  --accent-gold-dark: #B4855A;
  
  /* ========== 文字色 ========== */
  --text-ink: #2C2C2C;
  --text-ink-light: #4A4A4A;
  --text-light-ink: #6B6B6B;
  --text-muted: #9A9A9A;
  
  /* ========== 边框 ========== */
  --border-subtle: rgba(44, 44, 44, 0.08);
  --border-light: rgba(44, 44, 44, 0.15);
  --border-accent: rgba(196, 92, 38, 0.3);
  
  /* ========== 阴影 ========== */
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.06);
  --shadow-card-hover: 0 8px 30px rgba(0, 0, 0, 0.1);
  --shadow-accent: 0 2px 8px rgba(196, 92, 38, 0.2);
  --shadow-ink: 0 8px 32px rgba(26, 26, 46, 0.15);
  
  /* ========== 字体 ========== */
  --font-serif: 'Noto Serif SC', 'STSong', 'SimSun', serif;
  --font-sans: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  
  /* ========== 圆角 ========== */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-full: 9999px;
  
  /* ========== 过渡 ========== */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}

/* 暗黑模式 */
.dark {
  --bg-paper: #1A1A2E;
  --bg-paper-dark: #2A2A3E;
  --text-ink: #F0EDE6;
  --text-ink-light: #D4D0C8;
  --text-light-ink: #A0A0A0;
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-light: rgba(255, 255, 255, 0.15);
  --shadow-card: 0 4px 20px rgba(0, 0, 0, 0.3);
}

/* ========== 工具类 ========== */

/* 背景 */
.bg-paper { background-color: var(--bg-paper); }
.bg-paper-dark { background-color: var(--bg-paper-dark); }
.bg-ink { background-color: var(--bg-ink); }

/* 文字 */
.text-ink { color: var(--text-ink); }
.text-ink-light { color: var(--text-ink-light); }
.text-light-ink { color: var(--text-light-ink); }
.text-vermilion { color: var(--accent-vermilion); }
.text-gold { color: var(--accent-gold); }

/* 字体 */
.font-serif { font-family: var(--font-serif); }
.font-sans { font-family: var(--font-sans); }

/* 渐变 */
.gradient-gold {
  background: linear-gradient(135deg, var(--accent-gold-light), var(--accent-gold));
}

.gradient-vermilion {
  background: linear-gradient(135deg, var(--accent-vermilion-light), var(--accent-vermilion));
}

/* 水墨纹理背景 */
.ink-wash-bg {
  background: 
    radial-gradient(ellipse at 20% 30%, rgba(196, 92, 38, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 70%, rgba(45, 90, 74, 0.05) 0%, transparent 50%),
    var(--bg-paper);
}

/* 动画 */
@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.3; }
  50% { transform: scale(1.1); opacity: 0.6; }
}

@keyframes inkSpread {
  0% { transform: scale(0); opacity: 0.8; }
  100% { transform: scale(3); opacity: 0; }
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

.animate-breathe {
  animation: breathe 4s ease-in-out infinite;
}

.animate-ink-spread {
  animation: inkSpread 1s ease-out forwards;
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}

/* 减少动画 */
@media (prefers-reduced-motion: reduce) {
  .animate-breathe,
  .animate-ink-spread,
  .animate-float {
    animation: none;
  }
}
```

### Step 2: 创建字体加载文件

```css
/* src/styles/fonts.css */

/* Noto Serif SC - 从 Google Fonts 加载 */
@import url('https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;600;700&display=swap');

/* 字体回退栈 */
.font-serif-zh {
  font-family: 
    'Noto Serif SC',      /* 首选 */
    'STSong',             /* Windows 宋体 */
    'SimSun',             /* Windows 备选 */
    'Source Han Serif SC', /* Adobe 思源宋体 */
    'PingFang SC',        /* macOS 苹方 */
    'Microsoft YaHei',    /* Windows 雅黑 */
    serif;
}
```

### Step 3: 修改主CSS文件

```css
/* src/index.css - 在文件顶部添加 */

@import './styles/fonts.css';
@import './styles/oriental-theme.css';

/* 原有内容保持不变... */
```

### Step 4: 测试CSS变量

创建测试页面验证变量生效：

```tsx
// 临时测试代码
<div className="bg-paper p-8">
  <h1 className="font-serif text-3xl text-ink">测试标题</h1>
  <p className="text-vermilion">朱砂红文字</p>
  <div className="gradient-gold h-20 w-20 rounded-lg" />
</div>
```

### Step 5: Commit

```bash
git add src/styles/
git commit -m "feat: add oriental theme CSS variables system"
```

---

## Task 2: 创建基础动画组件

**Files:**
- Create: `src/components/oriental/animations/PageTransition.tsx`
- Create: `src/components/oriental/animations/StaggerContainer.tsx`
- Create: `src/components/oriental/animations/InkLoader.tsx`
- Create: `src/components/oriental/animations/index.ts`

### Step 1: PageTransition 页面转场

```tsx
// src/components/oriental/animations/PageTransition.tsx
import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    filter: 'blur(4px)'
  },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: { 
      duration: 0.4, 
      ease: [0.22, 1, 0.36, 1] 
    }
  },
  exit: { 
    opacity: 0, 
    y: -20,
    filter: 'blur(4px)',
    transition: { duration: 0.3 }
  }
};

export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={className}
    >
      {children}
    </motion.div>
  );
}

// 带水墨晕染效果的转场
export function InkPageTransition({ children, className }: PageTransitionProps) {
  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 0.3, 0], scale: [0.8, 1.5, 2] }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="absolute inset-0 bg-gradient-radial from-vermilion/20 to-transparent pointer-events-none"
      />
      <PageTransition className={className}>
        {children}
      </PageTransition>
    </div>
  );
}
```

### Step 2: StaggerContainer 列表 stagger 动画

```tsx
// src/components/oriental/animations/StaggerContainer.tsx
import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface StaggerContainerProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

export function StaggerContainer({ 
  children, 
  className,
  staggerDelay = 0.05 
}: StaggerContainerProps) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay,
            delayChildren: 0.1
          }
        }
      }}
      initial="hidden"
      animate="show"
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ 
  children, 
  className 
}: { 
  children: ReactNode; 
  className?: string 
}) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
```

### Step 3: InkLoader 水墨加载动画

```tsx
// src/components/oriental/animations/InkLoader.tsx
import { motion } from 'framer-motion';

interface InkLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
}

export function InkLoader({ size = 'md', text }: InkLoaderProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={`relative ${sizeClasses[size]}`}>
        {/* 外圈 - 缓慢旋转 */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-2 border-dashed border-vermilion/30"
        />
        {/* 内圈 - 反向旋转 */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-2 border-dotted border-qingdai/30"
        />
        {/* 中心点 - 呼吸效果 */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 m-auto w-3 h-3 rounded-full bg-vermilion/60"
        />
      </div>
      {text && (
        <motion.p 
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-sm text-light-ink font-serif"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
}

// 全屏加载覆盖层
export function FullScreenLoader({ text }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-paper/90 backdrop-blur-sm flex items-center justify-center z-50">
      <InkLoader size="lg" text={text} />
    </div>
  );
}
```

### Step 4: 创建索引文件

```tsx
// src/components/oriental/animations/index.ts
export { PageTransition, InkPageTransition } from './PageTransition';
export { StaggerContainer, StaggerItem } from './StaggerContainer';
export { InkLoader, FullScreenLoader } from './InkLoader';
```

### Step 5: Commit

```bash
git add src/components/oriental/animations/
git commit -m "feat: add oriental animation components"
```

---

## Task 3: 运势卡片重设计 - ScoreDisplay

**Files:**
- Create: `src/components/oriental/FortuneCard/ScoreDisplay.tsx`

### Step 1: 创建分数展示组件

```tsx
// src/components/oriental/FortuneCard/ScoreDisplay.tsx
import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

interface ScoreDisplayProps {
  score: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export function ScoreDisplay({ 
  score, 
  label,
  size = 'md',
  animate = true 
}: ScoreDisplayProps) {
  const springScore = useSpring(0, { 
    stiffness: 50, 
    damping: 20,
    duration: 1.5 
  });
  
  const roundedScore = useTransform(springScore, (latest) => 
    Math.round(latest)
  );

  useEffect(() => {
    if (animate) {
      springScore.set(score);
    }
  }, [score, springScore, animate]);

  const sizeClasses = {
    sm: {
      container: 'w-16 h-16',
      score: 'text-2xl',
      label: 'text-xs'
    },
    md: {
      container: 'w-24 h-24',
      score: 'text-4xl',
      label: 'text-sm'
    },
    lg: {
      container: 'w-32 h-32',
      score: 'text-6xl',
      label: 'text-base'
    }
  };

  // 根据分数决定颜色
  const getScoreColor = (s: number) => {
    if (s >= 85) return 'text-vermilion';
    if (s >= 70) return 'text-gold';
    if (s >= 60) return 'text-qingdai';
    return 'text-light-ink';
  };

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col items-center justify-center ${sizeClasses[size].container}`}
    >
      {/* 背景圆环 */}
      <svg className="absolute inset-0 w-full h-full -rotate-90">
        <circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="rgba(196, 92, 38, 0.1)"
          strokeWidth="3"
        />
        <motion.circle
          cx="50%"
          cy="50%"
          r="45%"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: score / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#D4A574" />
            <stop offset="100%" stopColor="#C45C26" />
          </linearGradient>
        </defs>
      </svg>

      {/* 分数数字 */}
      <motion.span 
        className={`font-serif font-bold ${sizeClasses[size].score} ${getScoreColor(score)}`}
      >
        {animate ? (
          <motion.span>{roundedScore}</motion.span>
        ) : (
          score
        )}
      </motion.span>
      
      {/* 标签 */}
      {label && (
        <span className={`${sizeClasses[size].label} text-light-ink font-serif mt-1`}>
          {label}
        </span>
      )}
    </motion.div>
  );
}
```

### Step 2: Commit

```bash
git add src/components/oriental/FortuneCard/ScoreDisplay.tsx
git commit -m "feat: add ScoreDisplay component with animated ring"
```

---

## Task 4: 运势卡片重设计 - RadarChart

**Files:**
- Create: `src/components/oriental/FortuneCard/RadarChart.tsx`

### Step 1: 创建雷达图组件

```tsx
// src/components/oriental/FortuneCard/RadarChart.tsx
import { motion } from 'framer-motion';

interface DimensionData {
  career: number;
  wealth: number;
  romance: number;
  health: number;
  academic: number;
  travel: number;
}

interface RadarChartProps {
  data: DimensionData;
  size?: number;
  animate?: boolean;
}

const dimensions = [
  { key: 'career', label: '事业', angle: -90 },
  { key: 'wealth', label: '财运', angle: -30 },
  { key: 'romance', label: '桃花', angle: 30 },
  { key: 'health', label: '健康', angle: 90 },
  { key: 'academic', label: '学业', angle: 150 },
  { key: 'travel', label: '出行', angle: 210 }
] as const;

export function RadarChart({ data, size = 200, animate = true }: RadarChartProps) {
  const center = size / 2;
  const radius = size * 0.35;
  const levels = 4;

  // 计算多边形顶点
  const getPoint = (value: number, angle: number) => {
    const rad = (angle * Math.PI) / 180;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(rad),
      y: center + r * Math.sin(rad)
    };
  };

  // 生成数据多边形路径
  const dataPoints = dimensions.map(d => 
    getPoint(data[d.key as keyof DimensionData], d.angle)
  );
  const pathData = dataPoints.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`
  ).join(' ') + ' Z';

  return (
    <svg width={size} height={size} className="overflow-visible">
      {/* 背景网格 - 手绘风格 */}
      {Array.from({ length: levels }).map((_, i) => {
        const levelRadius = ((i + 1) / levels) * radius;
        const points = dimensions.map(d => {
          const rad = (d.angle * Math.PI) / 180;
          return `${center + levelRadius * Math.cos(rad)},${center + levelRadius * Math.sin(rad)}`;
        }).join(' ');
        
        return (
          <polygon
            key={i}
            points={points}
            fill="none"
            stroke="rgba(44, 44, 44, 0.08)"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        );
      })}

      {/* 轴线 */}
      {dimensions.map((d, i) => {
        const end = getPoint(100, d.angle);
        return (
          <line
            key={i}
            x1={center}
            y1={center}
            x2={end.x}
            y2={end.y}
            stroke="rgba(44, 44, 44, 0.06)"
            strokeWidth="0.5"
          />
        );
      })}

      {/* 数据区域 */}
      <motion.path
        d={pathData}
        fill="rgba(196, 92, 38, 0.15)"
        stroke="#C45C26"
        strokeWidth="1.5"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0 } : false}
        animate={animate ? { pathLength: 1, opacity: 1 } : false}
        transition={{ duration: 1, ease: "easeOut" }}
      />

      {/* 数据点 */}
      {dataPoints.map((p, i) => (
        <motion.circle
          key={i}
          cx={p.x}
          cy={p.y}
          r="4"
          fill="#D4A574"
          stroke="#FAF8F3"
          strokeWidth="2"
          initial={animate ? { scale: 0 } : false}
          animate={animate ? { scale: 1 } : false}
          transition={{ delay: i * 0.1, duration: 0.3 }}
        />
      ))}

      {/* 维度标签 */}
      {dimensions.map((d, i) => {
        const labelPos = getPoint(115, d.angle);
        return (
          <text
            key={i}
            x={labelPos.x}
            y={labelPos.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-light-ink font-serif"
          >
            {d.label}
          </text>
        );
      })}
    </svg>
  );
}
```

### Step 2: Commit

```bash
git add src/components/oriental/FortuneCard/RadarChart.tsx
git commit -m "feat: add hand-drawn style RadarChart component"
```

---

（由于篇幅限制，以下任务将简化展示核心要点，实际执行时需要展开完整代码）

## Task 5-10: 继续完成其他组件...

后续任务包括：
- Task 5: FortuneCard 主组件
- Task 6: TrendDashboard 趋势看板
- Task 7: 塔罗沉浸式体验
- Task 8: 易经沉浸式体验
- Task 9: 整合到现有页面
- Task 10: 最终测试与优化

每个任务都遵循相同模式：写代码 → 测试 → Commit

---

**执行选择：**

1. **Subagent-Driven (推荐)** - 我派遣子代理逐个执行任务，每个任务后审查
2. **Inline Execution** - 在当前会话批量执行任务

**建议**: 选择 Subagent-Driven，因为这个改版涉及大量组件和样式，分步骤执行更容易保证质量。

你想用哪种方式开始执行？
