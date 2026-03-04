# FortuneCardV2 使用指南

## 基本用法

```tsx
import { FortuneCardV2 } from './components/ui';
import type { FortuneData } from './types/fortune';

const fortuneData: FortuneData = {
  dateStr: '2026-03-04',
  weekDay: '星期二',
  lunarStr: '农历二月十五',
  totalScore: 88,
  mainTheme: '顺势而为，静待花开',
  yi: ['签约', '会友', '学习', '理财'],
  ji: ['冲动', '冒险', '争执'],
  dimensions: {
    career: 85,
    wealth: 92,
    love: 78,
    health: 88,
    study: 90,
    travel: 75,
  },
};

// 完整运势卡片
<FortuneCardV2 fortune={fortuneData} />
```

## 六维展示组件单独使用

```tsx
import { SixDimensionDisplay } from './components/ui';

// 带切换功能（雷达图/条形图）
<SixDimensionDisplay 
  dimensions={{
    career: 85,
    wealth: 92,
    love: 78,
    health: 88,
    study: 90,
    travel: 75,
  }}
  size={240}
  defaultView="radar"   // 默认视图: 'radar' | 'bars'
  allowToggle={true}    // 允许切换视图
/>

// 仅雷达图（不显示切换按钮）
<SixDimensionDisplay 
  dimensions={dimensions}
  defaultView="radar"
  allowToggle={false}
/>

// 仅条形图（不显示切换按钮）
<SixDimensionDisplay 
  dimensions={dimensions}
  defaultView="bars"
  allowToggle={false}
/>
```

## 宜忌展示组件单独使用

```tsx
import { YiJiDisplay } from './components/ui';

<YiJiDisplay 
  yi={["签约", "会友", "学习", "理财"]}
  ji={["冲动", "冒险"]}
  maxItems={4}
/>
```

## 视图切换说明

新设计的 `SixDimensionDisplay` 组件支持两种视图模式：

| 视图 | 特点 | 适用场景 |
|------|------|----------|
| **雷达图** | 直观展示六维平衡，美观 | 首页展示、截图分享 |
| **条形图** | 精确对比分数，排序显示 | 详细分析、快速查看 |

### 切换按钮位置
在六维展示卡片右上角，用户可以点击切换：

```
┌─────────────────────────────┐
│ 六维分析        [雷达|条形] │ ← 切换按钮
│                             │
│    ◆                        │
│   /  \     或   💼 事业 ███│
│  ◆    ◆        💰 财运 ████│
│   \  /         ❤️ 桃花 ██  │
│    ◆           ...         │
└─────────────────────────────┘
```

## 样式定制

所有新组件都使用设计令牌，颜色会自动适配运势分数：

- **大吉 (90-100分)**: 金色渐变
- **吉 (70-89分)**: 绿色渐变  
- **平 (40-69分)**: 蓝色渐变
- **凶 (0-39分)**: 红色渐变

---

*创建日期: 2026-03-04*
