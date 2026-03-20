# App 内页面 UI 一致性

## 组件

- **`AppSubPageShell`**（`src/components/layout/AppSubPageShell.tsx`）  
  - **浅色 `variant="light"`**：`--bg-primary` 背景 + 圆角渐变顶栏；`lightTone`: `brand` | `spectrum` | `rose`。  
  - **深色 `variant="dark"`**：沉浸式渐变底 + 毛玻璃顶栏；`darkTone`: `slate` | `amber` | `red` | `purple`。  
  - 统一：返回链接（≥44px 点击区）、标题与图标、`headerBottom` 工具行、**底部 `pb-24`** 避让 `BottomNav`。

## 样式片段

- **`src/constants/appUiClasses.ts`**：`appLightPanelClass`、深色表单/按钮/结果区等，新功能页优先复用。

## Shell API 补充

- **`scrollable={false}`**：整页不滚动，内容区为 `flex min-h-0 flex-1 flex-col`（适合虚拟列表、聊天、人生地图等内部再滚动）。
- **`subtitle`**：顶栏标题下灰色说明（浅色顶栏为 `text-white/90`）。
- **`backTo`**：默认 `/app/fortune/today`；规划类（如签到）可改为 `/app/plan/calendar`，成就可改为 `/app/profile`。

## 已接入 Shell 的页面（持续扩充）

月运、趋势、学堂、合盘、易经、解梦、塔罗、2026 年运、**历史记录**、**AI 咨询**、**签到**、**成就**、**人生地图** 等。抽签页（`FortuneStickPage`）保留独立科幻场景顶栏，暂不套 Shell。

新增 `/app/*` 子页请优先套 Shell，再写业务内容。
