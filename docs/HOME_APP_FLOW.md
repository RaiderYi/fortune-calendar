# 首页 ↔ 应用衔接（已落地）

## 目标

- **单一主路径**：营销站主按钮与顶栏统一为「进入今日运势」，文案与 i18n 键一致：`ui.homeToApp.primaryCta`。
- **可追踪入口**：外链使用 `?from=<来源>&intent=today`，便于分析与承接。
- **进入后承接**：在 `/app/fortune/today` 顶部展示可关闭说明条，关闭时用 `replace` 去掉 query，避免 URL 长期带参。

## 工具函数

- `src/utils/appEntry.ts`  
  - `buildTodayEntryLink(from)`：`internal` 不带参数；其余来源带 `from` + `intent`。  
  - `shouldShowEntryBridge(from, intent)`：是否显示承接条。

## 来源枚举（`from`）

| 值 | 使用位置 |
|----|----------|
| `home` | 落地页首屏主 CTA |
| `home_bottom` | 落地页底部 CTA |
| `siteheader` | 营销页 `SiteHeader` 进入应用（非 `/app` 时） |
| `sitefooter` | 页脚「今日运势」 |
| `features` | 功能页 CTA |
| `pricing` | 定价页免费版 CTA |
| （无参数） | 应用内 `SiteHeader`、`BottomNav` 等 |

## 页脚路径修正

- 日历：`/app/plan/calendar`  
- 我的 / 反馈：`/app/profile`  

## 埋点

- `entry_bridge_dismiss`：关闭承接条时，`from` 为当前 query。

## 后续可做（未实现）

- 落地页次要 CTA 再收敛为文字链。  
- `from` 与 A/B 文案关联实验。  
- 免责声明与引导的时序 A/B。

---

*版本：2026-03-04*
