# 命运日历 - 世界级改版测试计划

> **测试目标**: 确保 9 周改版后的产品质量达到世界一流的稳定性和用户体验
> **测试范围**: 功能、性能、可访问性、视觉、兼容性
> **测试方法**: 自动化测试 + 手动测试 + 用户测试

---

## 🧪 测试策略总览

```
┌─────────────────────────────────────────────────────────────────┐
│                      测试金字塔                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                    ▲ 端到端测试 (E2E)                           │
│                   ╱ ╲    10% - 关键用户流程                      │
│                  ╱   ╲                                         │
│                 ╱─────╲  集成测试                               │
│                ╱         ╲  20% - 组件交互                       │
│               ╱───────────╲                                     │
│              ╱   单元测试   ╲  70% - 工具函数、 hooks            │
│             ╱─────────────────╲                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: 设计系统测试 (Week 1-2)

### Week 1 测试任务

#### T1.1: 颜色系统测试
```typescript
// tests/designTokens/colors.test.ts
describe('Color Design Tokens', () => {
  it('所有颜色令牌应有正确的 hex 格式', () => {
    // 验证颜色格式
  });
  
  it('深色模式颜色应有足够的对比度', () => {
    // WCAG 对比度检查
  });
  
  it('运势等级颜色应符合设计规范', () => {
    // 验证四种运势等级的渐变色
  });
});
```

**测试清单**:
- [ ] 验证所有颜色令牌存在
- [ ] 验证颜色格式正确 (hex/rgb/hsl)
- [ ] 验证深色模式颜色对比度 ≥ 4.5:1
- [ ] 验证运势颜色映射正确

#### T1.2: 间距与排版测试
**测试清单**:
- [ ] 验证间距令牌一致性
- [ ] 验证字体层级正确应用
- [ ] 验证圆角系统一致性
- [ ] 验证阴影层级一致性

#### T1.3: 组件视觉回归测试
**工具**: Storybook + Chromatic / Loki

**测试清单**:
- [ ] Button 各状态截图对比
- [ ] Card 组件截图对比
- [ ] Input 组件截图对比
- [ ] Modal 组件截图对比

### Week 2 测试任务

#### T1.4: 导航功能测试
```typescript
// tests/navigation/routing.test.tsx
describe('Navigation System', () => {
  it('应正确高亮当前导航项', () => {
    render(<TopSubNav category="fortune" />);
    expect(screen.getByText('今日')).toHaveClass('active');
  });
  
  it('点击导航应正确跳转', () => {
    // 验证路由跳转
  });
  
  it('移动端手势返回应正常工作', () => {
    // 验证手势导航
  });
});
```

**测试清单**:
- [ ] 顶部导航高亮正确
- [ ] 底部导航切换正常
- [ ] 子导航项显示正确
- [ ] 移动端手势导航正常

#### T1.5: 布局响应式测试
**测试设备矩阵**:
| 设备 | 分辨率 | 测试重点 |
|------|--------|----------|
| iPhone SE | 375×667 | 最小屏幕适配 |
| iPhone 14 | 390×844 | 标准移动端 |
| iPad Mini | 768×1024 | 平板适配 |
| Desktop | 1440×900 | 桌面端布局 |
| Desktop XL | 1920×1080 | 大屏适配 |

**测试清单**:
- [ ] 各断点布局正确
- [ ] 内容不溢出
- [ ] 文字大小适中
- [ ] 触摸目标 ≥ 44px

---

## Phase 2: 交互体验测试 (Week 3-4)

### Week 3 测试任务

#### T2.1: 手势交互测试
```typescript
// tests/interactions/gestures.test.tsx
describe('Gesture Interactions', () => {
  it('左滑应切换到明天', async () => {
    const { container } = render(<TodayPage />);
    await swipeLeft(container);
    expect(screen.getByText('明天')).toBeInTheDocument();
  });
  
  it('右滑应切换到昨天', async () => {
    // 测试右滑
  });
  
  it('滑动手势应有触觉反馈', () => {
    // 验证 haptics 被调用
  });
});
```

**测试清单**:
- [ ] 日期切换手势正常
- [ ] 页面返回手势正常
- [ ] 下拉刷新动画正常
- [ ] 手势冲突处理正确

#### T2.2: 加载状态测试
**测试清单**:
- [ ] 骨架屏正确显示
- [ ] 加载动画不卡顿
- [ ] 加载失败显示重试
- [ ] 弱网状态处理正确

### Week 4 测试任务

#### T2.3: 触觉反馈测试
```typescript
// tests/interactions/haptics.test.ts
describe('Haptics', () => {
  it('按钮点击应触发轻触觉', () => {
    const vibrateSpy = jest.spyOn(navigator, 'vibrate');
    clickButton();
    expect(vibrateSpy).toHaveBeenCalledWith(10);
  });
  
  it('保存成功应触发成功触觉', () => {
    // 验证 [10, 50, 10] 模式
  });
});
```

**测试清单**:
- [ ] iOS 触觉正常
- [ ] Android 触觉正常
- [ ] 触觉模式正确
- [ ] 可关闭触觉偏好

#### T2.4: Toast 通知测试
**测试清单**:
- [ ] Toast 正确显示
- [ ] Toast 动画流畅
- [ ] 多条 Toast 排队正常
- [ ] Toast 可手动关闭

---

## Phase 3: 动效测试 (Week 5-6)

### Week 5 测试任务

#### T3.1: 页面转场性能测试
```typescript
// tests/animations/performance.test.ts
describe('Animation Performance', () => {
  it('页面转场应保持 60fps', async () => {
    const fps = await measureFPS(() => navigate('/app/fortune/trends'));
    expect(fps).toBeGreaterThanOrEqual(55);
  });
  
  it('不应触发强制同步布局', () => {
    // 使用 Chrome DevTools Protocol 检测
  });
});
```

**性能指标**:
| 指标 | 目标值 | 测试方法 |
|------|--------|----------|
| 动画帧率 | ≥ 55fps | Chrome DevTools FPS meter |
| 转场时长 | 200-400ms | 录屏分析 |
| 布局抖动 | 0 | Chrome DevTools |

**测试清单**:
- [ ] 页面转场流畅
- [ ] 共享元素过渡正常
- [ ] 动画不阻塞交互
- [ ] 低电量模式降级正常

#### T3.2: 列表动画测试
**测试清单**:
- [ ] 列表项进入动画流畅
- [ ] 列表重排动画正常
- [ ] 删除动画完整
- [ ] 长列表性能正常

### Week 6 测试任务

#### T3.3: 微交互测试
```typescript
// tests/interactions/micro-interactions.test.tsx
describe('Micro-interactions', () => {
  it('按钮点击应有波纹效果', () => {
    render(<Button>点击</Button>);
    fireEvent.click(screen.getByText('点击'));
    expect(document.querySelector('.ripple')).toBeInTheDocument();
  });
  
  it('数字变化应有计数动画', async () => {
    // 测试数字动画
  });
});
```

**测试清单**:
- [ ] 按钮点击反馈正常
- [ ] 卡片悬停效果正常
- [ ] 数字变化动画正常
- [ ] 图标动画正常

#### T3.4: 滚动效果测试
**测试清单**:
- [ ] 滚动渐变效果正常
- [ ] 视差滚动流畅
- [ ] 滚动触发动画正常
- [ ] 滚动性能无卡顿

---

## Phase 4: 内容呈现测试 (Week 7-8)

### Week 7 测试任务

#### T4.1: 运势卡片功能测试
```typescript
// tests/components/FortuneCard.test.tsx
describe('Fortune Card', () => {
  it('应正确显示分数和主题', () => {
    render(<FortuneCard score={88} theme="顺势而行" />);
    expect(screen.getByText('88')).toBeInTheDocument();
    expect(screen.getByText('顺势而行')).toBeInTheDocument();
  });
  
  it('分数环应根据分数显示正确颜色', () => {
    // 验证颜色映射
  });
  
  it('六维数据应正确渲染雷达图', () => {
    // 验证雷达图渲染
  });
});
```

**测试清单**:
- [ ] 卡片布局正确
- [ ] 分数显示正确
- [ ] 玻璃拟态效果正常
- [ ] 环形进度条正确

#### T4.2: 六维雷达图测试
**测试清单**:
- [ ] 雷达图正确渲染
- [ ] 数据点位置正确
- [ ] 交互提示正常
- [ ] 动画流畅

### Week 8 测试任务

#### T4.3: 空状态测试
```typescript
// tests/components/EmptyState.test.tsx
describe('Empty States', () => {
  it('无数据时应显示空状态', () => {
    render(<FortuneList data={[]} />);
    expect(screen.getByText('暂无运势数据')).toBeInTheDocument();
  });
  
  it('网络错误应显示重试按钮', () => {
    render(<ErrorState type="network" />);
    expect(screen.getByText('重新加载')).toBeInTheDocument();
  });
});
```

**测试清单**:
- [ ] 无数据空状态显示
- [ ] 网络错误空状态显示
- [ ] 搜索无结果空状态显示
- [ ] 空状态交互正常

#### T4.4: 错误处理测试
**测试清单**:
- [ ] API 错误显示友好提示
- [ ] 重试机制工作正常
- [ ] 错误边界捕获异常
- [ ] 错误日志上报正常

---

## Phase 5: 性能与可访问性测试 (Week 9)

### Week 9 测试任务

#### T5.1: Lighthouse 性能测试
```bash
# 自动化 Lighthouse 测试
lighthouse https://fortune-calendar.vercel.app \
  --output=json \
  --output-path=./reports/lighthouse.json \
  --preset=desktop
```

**性能预算**:
| 指标 | 预算 | 优先级 |
|------|------|--------|
| Performance | ≥ 90 | P0 |
| Accessibility | ≥ 95 | P0 |
| Best Practices | ≥ 90 | P1 |
| SEO | ≥ 90 | P1 |
| FCP | ≤ 1.8s | P0 |
| LCP | ≤ 2.5s | P0 |
| TTI | ≤ 3.8s | P0 |
| CLS | ≤ 0.1 | P0 |

#### T5.2: 可访问性测试
```typescript
// tests/a11y/axe.test.ts
import { axe } from 'jest-axe';

describe('Accessibility', () => {
  it('页面应无可访问性违规', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**测试清单**:
- [ ] ARIA 标签正确
- [ ] 键盘导航完整
- [ ] 颜色对比度 ≥ 4.5:1
- [ ] 屏幕阅读器测试通过

#### T5.3: 跨浏览器测试
**浏览器矩阵**:
| 浏览器 | 版本 | 平台 | 优先级 |
|--------|------|------|--------|
| Chrome | 最新 | Desktop | P0 |
| Safari | 最新 | macOS | P0 |
| Safari | 最新 | iOS | P0 |
| Firefox | 最新 | Desktop | P1 |
| Edge | 最新 | Desktop | P1 |
| Chrome | 最新 | Android | P1 |

#### T5.4: 真机测试
**测试设备**:
- [ ] iPhone 14 Pro (iOS 17)
- [ ] iPhone SE (iOS 17)
- [ ] Samsung Galaxy S23 (Android 14)
- [ ] iPad Air (iPadOS 17)
- [ ] Pixel 7 (Android 14)

---

## 📊 测试自动化 CI/CD

### GitHub Actions 工作流
```yaml
# .github/workflows/test.yml
name: Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run unit tests
        run: npm run test:unit
        
      - name: Run component tests
        run: npm run test:component
        
      - name: Run visual regression tests
        run: npm run test:visual
        
      - name: Run Lighthouse CI
        run: npm run lighthouse
        
      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

---

## 📋 手动测试检查清单

### 每日构建检查
- [ ] 应用正常启动
- [ ] 导航工作正常
- [ ] 运势计算正常
- [ ] 无控制台错误

### 发布前检查
- [ ] 所有自动化测试通过
- [ ] Lighthouse 分数达标
- [ ] 手动功能测试完成
- [ ] 视觉回归测试通过
- [ ] 性能测试达标
- [ ] 可访问性测试通过

---

## 🐛 Bug 分级与响应

| 级别 | 定义 | 响应时间 | 修复时间 |
|------|------|----------|----------|
| P0 - 阻断 | 应用崩溃、核心功能不可用 | 立即 | 4小时内 |
| P1 - 严重 | 主要功能异常、数据错误 | 2小时内 | 24小时内 |
| P2 - 中等 | 次要功能异常、UI问题 | 24小时内 | 本周内 |
| P3 - 轻微 | 视觉瑕疵、建议优化 | 排期处理 | 酌情处理 |

---

## 📈 测试报告模板

```markdown
## 测试报告 - [日期]

### 测试范围
- [ ] Phase X 功能

### 测试结果
| 类别 | 用例数 | 通过 | 失败 | 跳过 |
|------|--------|------|------|------|
| 单元测试 | 100 | 98 | 0 | 2 |
| 集成测试 | 50 | 48 | 2 | 0 |
| E2E 测试 | 30 | 28 | 1 | 1 |

### 性能指标
- Lighthouse Performance: 92/100
- FCP: 1.2s
- LCP: 2.1s

### 发现的问题
1. [问题描述] - [级别] - [负责人]

### 下一步行动
- [ ]
```

---

*测试计划创建日期: 2026-03-03*
*测试负责人: QA Team + 开发团队*
*状态: 待执行*
