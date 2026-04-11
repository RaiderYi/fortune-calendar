# MysticEast Implementation Plan

> **项目**: MysticEast - Western-facing BaZi Brand Website  
> **技术栈**: Next.js 14 + TypeScript + Tailwind CSS + Python API  
> **时间线**: 4-6周  
> **版本**: 1.0

---

## Part 1: 项目结构

### 目录架构

```
mysticeast/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # 营销页面组
│   │   ├── page.tsx              # Landing Page (首页)
│   │   ├── calculator/
│   │   │   └── page.tsx          # 免费八字计算器
│   │   ├── result/
│   │   │   └── page.tsx          # 迷你结果页
│   │   ├── services/
│   │   │   └── page.tsx          # 服务展示
│   │   ├── destiny-map/
│   │   │   └── page.tsx          # Destiny Map 产品详情
│   │   ├── about/
│   │   │   └── page.tsx          # 关于我们
│   │   └── layout.tsx            # 营销布局 (含导航)
│   ├── (blog)/                   # 博客系统
│   │   ├── blog/
│   │   │   ├── page.tsx          # 博客列表
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 博客详情
│   │   └── layout.tsx
│   ├── api/                      # API Routes
│   │   ├── calculate/
│   │   │   └── route.ts          # 八字计算API
│   │   └── email/
│   │       └── route.ts          # 邮件捕获API
│   ├── layout.tsx                # 根布局
│   └── globals.css               # 全局样式
├── components/                   # React组件
│   ├── ui/                       # 基础UI组件
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   └── Loading.tsx
│   ├── calculator/               # 计算器相关
│   │   ├── BirthForm.tsx
│   │   ├── ElementReveal.tsx
│   │   └── InsightCard.tsx
│   ├── layout/                   # 布局组件
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── marketing/                # 营销页面组件
│       ├── Hero.tsx
│       ├── Features.tsx
│       ├── Testimonials.tsx
│       └── PricingCard.tsx
├── lib/                          # 工具库
│   ├── bazi/                     # 八字计算相关
│   │   ├── calculator.ts         # 前端计算辅助
│   │   └── elements.ts           # 五行数据
│   ├── email/                    # 邮件服务
│   │   └── resend.ts
│   └── utils.ts                  # 通用工具
├── styles/                       # 样式文件
│   └── design-tokens.ts          # 设计令牌
├── content/                      # 内容 (MDX)
│   └── blog/
├── public/                       # 静态资源
│   ├── images/
│   └── fonts/
├── types/                        # TypeScript类型
│   └── index.ts
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Part 2: 融合风格设计系统

### 设计理念

**"东方极简 + 西方灵性"**

- 保留东方美学的留白哲学和意境
- 融入西方Wellness市场的水晶、自然元素
- 现代极简排版，避免传统东方元素堆砌

### 色彩系统

```typescript
// styles/design-tokens.ts
export const colors = {
  // Primary - 深靛蓝 (灵性、信任)
  primary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2D1B4E',  // 品牌主色
  },
  
  // Secondary - 金色 (繁荣、高端)
  gold: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
    950: '#C9A227',  // 品牌金色
  },
  
  // Accent - 翠绿 (成长、疗愈)
  jade: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#00A86B',  // 品牌翠绿
  },
  
  // Neutral - 暖灰 (自然、温暖)
  neutral: {
    50: '#F5F1E8',   // 奶油背景
    100: '#ebe7dd',
    200: '#ddd9cf',
    300: '#c4c0b5',
    400: '#a29e93',
    500: '#858175',
    600: '#6b675d',
    700: '#56524a',
    800: '#49463f',
    900: '#2C2C2C',  // 主文字
    950: '#1a1917',
  },
  
  // 五行色彩 (用于结果展示)
  elements: {
    wood: '#228B22',   // 木 - 森林绿
    fire: '#DC143C',   // 火 - 深红
    earth: '#D2691E',  // 土 - 巧克力色
    metal: '#C0C0C0',  // 金 - 银灰
    water: '#1E3A5F',  // 水 - 深海蓝
  }
}
```

### 字体系统

```typescript
// styles/design-tokens.ts
export const typography = {
  // 标题字体 - 优雅衬线
  fontFamily: {
    serif: ['Cormorant Garamond', 'Georgia', 'serif'],
    sans: ['Inter', 'system-ui', 'sans-serif'],
    display: ['Cormorant Garamond', 'serif'],
  },
  
  // 字号比例 (Major Third 1.25)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },
  
  // 字重
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // 行高
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  }
}
```

### 间距系统

```typescript
export const spacing = {
  // 8px 基础单位
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem',     // 96px
}
```

### 阴影与效果

```typescript
export const effects = {
  // 柔和阴影 (水晶感)
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    // 特殊：金色光晕
    gold: '0 0 20px rgba(201, 162, 39, 0.3)',
    // 特殊：水晶光泽
    crystal: '0 8px 32px rgba(45, 27, 78, 0.1)',
  },
  
  // 圆角
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    DEFAULT: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    '2xl': '2rem',
    full: '9999px',
  },
  
  // 过渡
  transition: {
    fast: '150ms ease',
    normal: '300ms ease',
    slow: '500ms ease',
  }
}
```

---

## Part 3: 开发任务分解

### Week 1: 项目初始化与设计系统

#### Day 1-2: 项目初始化
- [ ] 创建 Next.js 项目 (App Router)
- [ ] 配置 Tailwind CSS
- [ ] 安装依赖 (shadcn/ui, framer-motion, resend)
- [ ] 设置字体 (Cormorant Garamond, Inter)
- [ ] 配置路径别名
- [ ] 创建基础目录结构

#### Day 3-4: 设计系统
- [ ] 创建设计令牌文件
- [ ] 配置 Tailwind 主题扩展
- [ ] 创建基础UI组件 (Button, Card, Input)
- [ ] 创建加载状态组件 (水晶风格)
- [ ] 创建动画工具 (Framer Motion配置)

#### Day 5: 布局组件
- [ ] Header 组件 (导航)
- [ ] Footer 组件
- [ ] 页面布局骨架
- [ ] 移动端菜单

### Week 2: 核心页面开发

#### Day 1-2: Landing Page
- [ ] Hero Section
- [ ] Features Grid
- [ ] How It Works
- [ ] Social Proof
- [ ] CTA Section

#### Day 3-4: Calculator Page
- [ ] 出生信息表单 (日期/时间/地点)
- [ ] 表单验证
- [ ] 提交逻辑
- [ ] 加载状态
- [ ] 错误处理

#### Day 5: Mini Results Page
- [ ] Day Master 展示
- [ ] 元素性格描述
- [ ] 关键洞察卡片
- [ ] 邮件捕获表单
- [ ] CTA到Destiny Map

### Week 3: 服务页面与集成

#### Day 1-2: Services Page
- [ ] 服务列表展示
- [ ] Destiny Map 详情页
- [ ] 定价卡片
- [ ] FAQ 组件

#### Day 3-4: Resend 邮件集成
- [ ] API Route 创建
- [ ] 邮件模板
- [ ] 双重确认流程
- [ ] GDPR 合规

#### Day 5: About Page
- [ ] 品牌故事
- [ ] 团队介绍
- [ ] 联系方式
- [ ] 信任标识

### Week 4: 博客与SEO

#### Day 1-2: 博客系统
- [ ] MDX 配置
- [ ] 博客列表页
- [ ] 博客详情页
- [ ] 相关文章

#### Day 3-4: SEO优化
- [ ] Meta标签
- [ ] Open Graph
- [ ] Structured Data
- [ ] Sitemap
- [ ] Robots.txt

#### Day 5: 性能优化
- [ ] 图片优化
- [ ] 代码分割
- [ ] 字体优化
- [ ] 缓存策略

### Week 5: 测试与完善

#### Day 1-2: 测试
- [ ] 单元测试
- [ ] E2E测试 (Playwright)
- [ ] 响应式测试
- [ ] 性能测试

#### Day 3-4: 内容填充
- [ ] 文案优化
- [ ] 图片素材
- [ ] 示例数据

#### Day 5: Bug修复
- [ ] 修复发现的问题
- [ ] 优化体验细节

### Week 6: 部署与上线

#### Day 1-2: 部署准备
- [ ] 生产环境配置
- [ ] 环境变量设置
- [ ] 域名配置

#### Day 3-4: 上线
- [ ] Vercel部署
- [ ] 分析工具配置 (GA4)
- [ ] 监控设置

#### Day 5: 上线检查
- [ ] 功能验证
- [ ] 性能检查
- [ ] SEO验证

---

## Part 4: API集成规范

### 八字计算API

```typescript
// 请求
POST /api/calculate
{
  "birthDate": "1990-05-15",
  "birthTime": "14:30",
  "timezone": "America/New_York",
  "location": "New York, USA"
}

// 响应
{
  "dayMaster": {
    "element": "Metal",
    "stem": "Geng",
    "yinYang": "Yang",
    "animal": "Horse"
  },
  "chart": {
    "year": { "stem": "...", "branch": "..." },
    "month": { "stem": "...", "branch": "..." },
    "day": { "stem": "...", "branch": "..." },
    "hour": { "stem": "...", "branch": "..." }
  },
  "elements": {
    "wood": 15,
    "fire": 25,
    "earth": 20,
    "metal": 30,
    "water": 10
  },
  "insight": {
    "title": "Your Natural Authority",
    "description": "..."
  }
}
```

### 邮件捕获API

```typescript
// 请求
POST /api/email
{
  "email": "user@example.com",
  "dayMaster": "Metal",
  "consent": true,
  "source": "mini-result"
}

// 响应
{
  "success": true,
  "message": "Please check your email to confirm"
}
```

---

## Part 5: 关键依赖

```json
{
  "dependencies": {
    "next": "^14.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "typescript": "^5.x",
    "tailwindcss": "^3.x",
    "@tailwindcss/typography": "^0.5.x",
    "framer-motion": "^11.x",
    "resend": "^3.x",
    "next-mdx-remote": "^4.x",
    "gray-matter": "^4.x",
    "lucide-react": "^0.x",
    "clsx": "^2.x",
    "tailwind-merge": "^2.x"
  },
  "devDependencies": {
    "@types/node": "^20.x",
    "@types/react": "^18.x",
    "@types/react-dom": "^18.x",
    "eslint": "^8.x",
    "eslint-config-next": "^14.x",
    "@playwright/test": "^1.x",
    "vitest": "^1.x"
  }
}
```

---

## Appendix: 内容日历 (Month 1-3)

### 博客文章计划

**Week 1-2: 基础概念**
1. "What is BaZi? A Complete Guide for Beginners"
2. "The Five Elements: Understanding Your Elemental Nature"
3. "BaZi vs Western Astrology: What's the Difference?"

**Week 3-4: 应用指南**
4. "How to Use Your Day Master for Career Success"
5. "Feng Shui Basics: Aligning Your Space with Your Element"
6. "Crystals for Your Element: A Complete Guide"

**Week 5-6: 深度内容**
7. "Understanding Your 10-Year Luck Cycles"
8. "Relationships and Compatibility in BaZi"
9. "Timing Your Decisions: Annual and Monthly Luck"

---

**计划创建完成 - 准备开始实施** 🚀
