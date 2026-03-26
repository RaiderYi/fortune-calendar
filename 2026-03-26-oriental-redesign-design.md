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
