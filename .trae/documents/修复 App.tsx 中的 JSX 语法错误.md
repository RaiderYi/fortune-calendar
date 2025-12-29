# 修复 JSX 语法错误

## 问题描述
在 [src/App.tsx](file:///d:/财富/my-fortune-calendar/src/App.tsx#L547) 第547行存在 JSX 语法错误：

**错误代码：**
```jsx
<Sparkles size={14} 今日神煞
```

**问题：**
- `<Sparkles>` 组件标签没有正确闭合
- 缺少 `/>` 自闭合标签

## 修复方案

将第547行修改为：
```jsx
<Sparkles size={14} /> 今日神煞
```

## 影响
- 修复后前端可以正常渲染神煞信息卡片
- 不会影响其他功能