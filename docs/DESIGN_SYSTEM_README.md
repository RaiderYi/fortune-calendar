# 设计系统 v1.0 文档

> 命运日历 - 世界级改版第一阶段完成

---

## ✅ 已完成内容

### Phase 1 Week 1: 设计系统建立

| 文件 | 功能 | 大小 |
|------|------|------|
| `src/designTokens/colors.ts` | 颜色系统 | 6.1KB |
| `src/designTokens/spacing.ts` | 间距/阴影/尺寸 | 5.3KB |
| `src/designTokens/typography.ts` | 排版系统 | 7.1KB |
| `src/designTokens/breakpoints.ts` | 响应式断点 | 2.7KB |
| `src/components/ui/Button.tsx` | 按钮组件 | 5.2KB |
| `src/components/ui/Card.tsx` | 卡片组件 | 5.7KB |

### Phase 1 Week 2: 导航与布局

| 文件 | 功能 |
|------|------|
| `src/components/layout/PageContainer.tsx` | 统一页面容器 |
| `src/components/TopSubNav.tsx` | 修复高亮逻辑 |
| `src/App.tsx` | 添加 /app/achievements 路由 |

### Phase 4: 运势卡片重构 (核心)

| 文件 | 功能 | 大小 |
|------|------|------|
| `src/components/FortuneCardV2.tsx` | 玻璃拟态运势卡片 | 11.5KB |
| `src/components/SixDimensionRadar.tsx` | 六维雷达图 | 8.7KB |
| `src/components/YiJiDisplay.tsx` | 宜忌展示组件 | 5.6KB |
| `src/types/fortune.ts` | 类型定义 | 1.5KB |

---

## 🎨 设计令牌使用指南

### 颜色
```typescript
import { colors, getFortuneColor } from './designTokens';

// 主色
colors.primary[500];  // #8b5cf6

// 运势颜色 (根据分数自动获取)
const fortuneColor = getFortuneColor(88);  // 大吉 -> 金色
```

### 间距
```typescript
import { space, radius, shadows } from './designTokens';

// 使用
padding: space.md,      // 16px
borderRadius: radius.xl, // 20px
boxShadow: shadows.glass, // 玻璃拟态阴影
```

### 响应式
```typescript
import { useBreakpoint } from './designTokens';

function MyComponent() {
  const { isMobile, isDesktop } = useBreakpoint();
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

---

## 🃏 新运势卡片使用

```tsx
import { FortuneCardV2 } from './components/FortuneCardV2';
import { YiJiDisplay } from './components/YiJiDisplay';

// 完整运势卡片
<FortuneCardV2 
  fortune={fortuneData} 
  isLoading={false}
/>

// 单独宜忌展示
<YiJiDisplay 
  yi={["签约", "会友", "学习"]} 
  ji={["冲动", "冒险"]} 
/>
```

---

## 📐 布局容器使用

```tsx
import { PageContainer } from './components/layout/PageContainer';

<PageContainer maxWidth="xl" padding="md">
  {/* 页面内容 */}
</PageContainer>
```

---

## 🎯 下一步建议

1. **替换旧卡片**: 在 TodayPage 中使用 FortuneCardV2 替换旧卡片
2. **更新 Tailwind 配置**: 将设计令牌同步到 tailwind.config.js
3. **视觉回归测试**: 验证新组件在不同设备上的显示效果

---

*完成日期: 2026-03-04*
