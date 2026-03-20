# 邀请与追踪参数（G-031）

## 邀请码（已实现）

- 注册页支持 URL 查询参数：**`invite`**  
  - 示例：`https://你的域名/login?invite=XXXX`  
  - 前端：`LoginPage` 读取 `invite`，随 `register()` 提交给后端。

## 建议扩展（可选）

| 参数 | 用途 |
|------|------|
| `utm_source` | 渠道（wechat / xiaohongshu / email） |
| `utm_medium` | 类型（social / cpc） |
| `utm_campaign` | 活动名 |

可在 `trackEvent('auth_register_success', { utm_source: ... })` 中一并上报（需从 `URLSearchParams` 读取并持久化到 session，避免跳转丢失）。

---

*版本：2026-03-04*
