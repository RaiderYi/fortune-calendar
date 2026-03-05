# 用户登录系统配置指南

本文档介绍如何配置和部署命运日历的用户登录系统。

## 核心原则

- **免登录可用**：八字运势计算、每日运势、基础 AI 咨询等核心功能无需登录
- **登录增值**：数据云同步、更多 AI 次数、高级功能、社交分享
- **渐进引导**：不强制登录，在关键节点温和引导用户注册

## 环境变量配置

### 必需的环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `JWT_SECRET` | JWT 签名密钥（至少32位字符） | 随机生成，如 `openssl rand -base64 32` |
| `KV_REST_API_URL` | Vercel KV REST API URL | Vercel Dashboard > Storage > KV > REST API |
| `KV_REST_API_TOKEN` | Vercel KV REST API Token | Vercel Dashboard > Storage > KV > REST API |

### 可选的环境变量

| 变量名 | 说明 | 获取方式 |
|--------|------|----------|
| `RESEND_API_KEY` | Resend 邮件服务 API 密钥 | https://resend.com > API Keys |
| `VERCEL_ENV` | 环境标识 | 自动设置 (`production` 或 `development`) |

## Vercel KV 设置步骤

1. **创建 KV 数据库**
   ```
   Vercel Dashboard > Storage > Create Database > KV
   ```

2. **连接到项目**
   ```
   选择项目 > Connect
   ```

3. **获取连接信息**
   ```
   KV Database > REST API > Quickstart
   复制 KV_REST_API_URL 和 KV_REST_API_TOKEN
   ```

4. **添加到环境变量**
   ```
   Project Settings > Environment Variables
   添加 KV_REST_API_URL 和 KV_REST_API_TOKEN
   ```

## JWT_SECRET 生成

```bash
# 方法1: 使用 openssl
openssl rand -base64 32

# 方法2: 使用 node
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# 方法3: 使用 Python
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

## Resend 邮件服务配置（可选）

1. 注册 Resend 账号：https://resend.com
2. 获取 API Key
3. 验证域名（生产环境必需）

**开发环境**：不配置 `RESEND_API_KEY` 时，验证码会直接输出到控制台

## 本地开发配置

创建 `.env.local` 文件：

```env
# 必需
JWT_SECRET=your-generated-jwt-secret-here

# Vercel KV（可选，不配置则使用内存存储）
KV_REST_API_URL=https://your-kv-url.upstash.io
KV_REST_API_TOKEN=your-kv-token

# 邮件服务（可选）
RESEND_API_KEY=re_xxxxxxxx
```

## 部署检查清单

### 部署前检查

- [ ] `JWT_SECRET` 已设置且长度 >= 32
- [ ] `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 已配置（生产环境必需）
- [ ] 后端 API 文件已提交（`api/` 目录）

### 部署后验证

1. **测试注册流程**
   ```
   POST /api/auth/send-code
   POST /api/auth/register
   ```

2. **测试登录流程**
   ```
   POST /api/auth/login
   ```

3. **测试数据同步**
   ```
   POST /api/sync/upload
   GET /api/sync/download
   ```

## 功能权限对照

### 免登录功能（本地存储）

| 功能 | 限制 |
|------|------|
| 八字运势计算 | 无限制 |
| 每日运势查看 | 无限制 |
| 基础 AI 咨询 | 3次/日 |
| 历史记录 | 最近10条 |
| 日签生成 | 基础模板 |

### 登录用户功能（云端同步）

| 功能 | 权益 |
|------|------|
| AI 咨询 | 15次/日（邀请好友可增加） |
| 历史记录 | 无限条，永久保存 |
| 数据同步 | 多设备同步 |
| 高级模板 | 全部解锁 |
| 邀请系统 | 邀请好友获奖励 |

## 常见问题

### Q: 验证码邮件发送失败？

**A**: 开发环境默认不发送邮件，验证码会输出到控制台。生产环境需要配置 `RESEND_API_KEY`。

### Q: 登录后数据没有同步？

**A**: 
1. 检查 `KV_REST_API_URL` 和 `KV_REST_API_TOKEN` 是否正确配置
2. 检查浏览器控制台是否有 API 错误
3. 确保用户已开启同步开关

### Q: 如何重置用户密码？

**A**: 使用密码重置 API：
```
POST /api/auth/reset-password-request
POST /api/auth/reset-password-verify
POST /api/auth/reset-password
```

### Q: 用户数据存储在哪里？

**A**: 
- 游客数据：`localStorage` / `IndexedDB`
- 登录用户数据：Vercel KV（云端）+ 本地缓存

## 安全注意事项

1. **JWT_SECRET** 必须保密，不要提交到代码仓库
2. **KV_REST_API_TOKEN** 具有完全访问权限，妥善保管
3. 生产环境必须配置 HTTPS
4. 敏感操作（修改密码、注销账户）需要验证当前密码

## 技术支持

如有问题，请检查：
1. Vercel Functions 日志（Dashboard > Functions）
2. 浏览器控制台错误信息
3. 网络请求的响应状态
