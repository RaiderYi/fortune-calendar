# 增长核心漏斗定义（G-001）

> 与 [GROWTH_BACKLOG.md](./GROWTH_BACKLOG.md) 配套，用于埋点命名与看板对齐。

---

## 漏斗 1：激活（访问 → 档案 → 今日运势）

```
访问任意页面
  → 保存完整档案（出生日期 + 出生时间，城市可选）
    → 今日运势 API 成功返回（/app/fortune/today 场景）
```

| 步骤 | 建议事件名 | 说明 |
|------|------------|------|
| 访问 | `page_view` | `page_path` 含路径与 query |
| 档案完成 | `profile_complete_save` | 本地保存且含 `birthDate` + `birthTime` |
| 运势成功 | `fortune_load_success` | 含 `date`（YYYY-MM-DD） |
| 运势失败 | `fortune_load_error` | 含 `error_message`（截断） |

**转化率**：步骤 2 / 步骤 1（需定义「访问」为落地会话）；步骤 3 / 步骤 2。

---

## 漏斗 2：注册 / 登录

```
访问 /login 或打开登录弹窗
  → 登录成功 或 注册成功
    → 进入 /app/fortune/today（或 redirect）
```

| 步骤 | 建议事件名 | 说明 |
|------|------------|------|
| 登录成功 | `auth_login_success` | 可带 `method: password` |
| 注册成功 | `auth_register_success` | 可带是否带 `invite` |

---

## 漏斗 3：分享 / 邀请

```
用户点击分享或复制邀请
  → 系统分享 / 复制成功 / 打开外链
```

| 步骤 | 建议事件名 | 说明 |
|------|------------|------|
| 分享点击 | `share_click` | `source`: fortune_report / daily_sign / fortune_stick_* / invite 等 |
| 邀请复制 | `invite_copy_link` / `invite_copy_code` | Invite 页 |
| 邀请系统分享 | `invite_native_share` | Web Share API |
| 日签图生成 | `daily_sign_image_generated` | 主应用内生成 PNG 成功 |
| 引导完成 | `onboarding_flow_completed` | 三步档案保存并关闭引导 |
| 引导跳过 | `onboarding_flow_skipped` | 用户点跳过 |

---

## 自定义事件监听（不接 GA 时）

前端会派发 `window` 事件：`CustomEvent('fc_analytics', { detail })`，`detail.type` 为 `page_view` 或 `event`。

---

*版本：2026-03-04*
