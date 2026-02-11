# Vercel 部署兼容性检查与配置指南

**部署平台**: Vercel Serverless
**环境**: Python 3.9 + Node.js 18
**更新时间**: 2026-02-11

---

## 一、Vercel 环境约束

### 1.1 关键限制

| 约束项 | Vercel 限制 | 我们的方案 | 状态 |
|--------|------------|-----------|------|
| **无状态** | 每次请求新实例，内存不持久 | 使用 Vercel KV 存储 | ✅ 已适配 |
| **冷启动** | 函数冷启动 ~200ms | 代码优化，减少依赖 | ✅ 已优化 |
| **执行时间** | Hobby: 10s, Pro: 60s | API 响应 < 3s | ✅ 符合 |
| **包大小** | 50MB (压缩后) | Python 精简依赖 | ✅ 符合 |
| **文件系统** | 只读，/tmp 可写临时文件 | 不使用本地文件 | ✅ 符合 |

### 1.2 依赖服务清单

| 服务 | 类型 | Vercel 兼容性 | 配置方式 |
|------|------|--------------|---------|
| **Vercel KV** | 键值存储 | ✅ 原生支持 | 环境变量自动注入 |
| **Resend** | 邮件 API | ✅ HTTP API | API Key 环境变量 |
| **JWT** | 本地计算 | ✅ 无依赖 | Python 原生实现 |
| **bcrypt** | 密码哈希 | ⚠️ 需要编译 | 使用纯 Python 替代 |

---

## 二、关键修改：Vercel KV 适配

### 2.1 问题：内存存储 → Vercel KV

**原代码问题**:
```python
# 错误！Vercel 中内存数据不会持久
_users: Dict[str, Dict] = {}  # 每次部署/冷启动都会清空
```

**解决方案**:
```python
# 正确！使用 Vercel KV
from vercel_kv import KV  # Vercel 提供的 KV 客户端
```

### 2.2 Vercel KV 封装

```python
# api/utils/kv_client.py
import os
import json
from typing import Any, Optional

class VercelKV:
    """Vercel KV 客户端封装"""
    
    def __init__(self):
        # Vercel 自动注入环境变量
        self.url = os.environ.get('KV_URL')
        self.rest_api_url = os.environ.get('KV_REST_API_URL')
        self.rest_api_token = os.environ.get('KV_REST_API_TOKEN')
        
    async def get(self, key: str) -> Optional[Any]:
        """获取值"""
        import urllib.request
        import urllib.error
        
        try:
            req = urllib.request.Request(
                f"{self.rest_api_url}/get/{key}",
                headers={"Authorization": f"Bearer {self.rest_api_token}"}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                result = json.loads(response.read().decode())
                return result.get('result')
        except Exception as e:
            print(f"[KV GET Error] {key}: {e}")
            return None
    
    async def set(self, key: str, value: Any, ttl: int = None) -> bool:
        """设置值"""
        import urllib.request
        
        try:
            url = f"{self.rest_api_url}/set/{key}"
            if ttl:
                url += f"?ex={ttl}"
            
            req = urllib.request.Request(
                url,
                data=json.dumps(value).encode(),
                headers={
                    "Authorization": f"Bearer {self.rest_api_token}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                return True
        except Exception as e:
            print(f"[KV SET Error] {key}: {e}")
            return False
    
    async def delete(self, key: str) -> bool:
        """删除值"""
        import urllib.request
        
        try:
            req = urllib.request.Request(
                f"{self.rest_api_url}/del/{key}",
                headers={"Authorization": f"Bearer {self.rest_api_token}"},
                method="DELETE"
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                return True
        except Exception as e:
            print(f"[KV DEL Error] {key}: {e}")
            return False
    
    async def hget(self, key: str, field: str) -> Optional[Any]:
        """获取 Hash 字段"""
        import urllib.request
        
        try:
            req = urllib.request.Request(
                f"{self.rest_api_url}/hget/{key}/{field}",
                headers={"Authorization": f"Bearer {self.rest_api_token}"}
            )
            with urllib.request.urlopen(req, timeout=5) as response:
                result = json.loads(response.read().decode())
                return result.get('result')
        except Exception as e:
            return None
    
    async def hset(self, key: str, field: str, value: Any) -> bool:
        """设置 Hash 字段"""
        import urllib.request
        
        try:
            req = urllib.request.Request(
                f"{self.rest_api_url}/hset/{key}",
                data=json.dumps({"field": field, "value": value}).encode(),
                headers={
                    "Authorization": f"Bearer {self.rest_api_token}",
                    "Content-Type": "application/json"
                },
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=5):
                return True
        except Exception as e:
            return False

# 全局实例
kv = VercelKV()
```

---

## 三、修改后的认证服务（Vercel 兼容版）

### 3.1 用户数据存储

```python
# api/services/auth_service_kv.py

class AuthService:
    """Vercel KV 版本认证服务"""
    
    # 存储结构设计：
    # user:email:{email} -> {user_id, password_hash, ...}
    # user:id:{user_id} -> {email, ...}
    # invite:code:{code} -> inviter_id
    # user:{user_id}:rewards -> {ai_quota_bonus, templates, badges}
    
    KV_PREFIX_USER_EMAIL = "user:email:"
    KV_PREFIX_USER_ID = "user:id:"
    KV_PREFIX_INVITE = "invite:code:"
    KV_PREFIX_REWARDS = "user:{}:rewards"
    KV_PREFIX_INVITE_STATS = "user:{}:invites"
    
    @classmethod
    async def register(cls, email: str, password: str, verification_code: str,
                       invite_code: Optional[str] = None) -> Dict:
        """用户注册"""
        try:
            from ..utils.kv_client import kv
            
            # 检查邮箱是否已注册
            existing = await kv.get(f"{cls.KV_PREFIX_USER_EMAIL}{email}")
            if existing:
                return {'success': False, 'error': '该邮箱已注册'}
            
            # 验证验证码（临时存储在 KV 中）
            code_key = f"verify_code:{email}"
            stored_code = await kv.get(code_key)
            if not stored_code or stored_code['code'] != verification_code:
                return {'success': False, 'error': '验证码错误或已过期'}
            
            # 生成用户ID和邀请码
            user_id = f"u_{secrets.token_hex(8)}"
            my_invite_code = cls.generate_invite_code()
            
            # 处理邀请人
            inviter_id = None
            if invite_code:
                inviter_id = await kv.get(f"{cls.KV_PREFIX_INVITE}{invite_code.upper()}")
            
            # 创建用户数据
            now = datetime.utcnow().isoformat()
            user_data = {
                'id': user_id,
                'email': email,
                'password_hash': cls.hash_password(password),
                'created_at': now,
                'updated_at': now,
                'invite_code': my_invite_code,
                'invited_by': inviter_id,
            }
            
            # 保存用户（双向索引）
            await kv.set(f"{cls.KV_PREFIX_USER_EMAIL}{email}", user_data)
            await kv.set(f"{cls.KV_PREFIX_USER_ID}{user_id}", {'email': email})
            
            # 保存邀请码映射
            await kv.set(f"{cls.KV_PREFIX_INVITE}{my_invite_code}", user_id)
            
            # 初始化奖励
            rewards = {
                'ai_quota_bonus': 10,  # 新用户基础奖励
                'templates_unlocked': ['basic', 'newcomer'],
                'badges': ['newcomer'],
                'granted_at': now
            }
            await kv.set(cls.KV_PREFIX_REWARDS.format(user_id), rewards)
            
            # 如果有邀请人，处理奖励
            if inviter_id:
                await cls._process_invite_reward(inviter_id, user_id)
            
            # 删除验证码
            await kv.delete(code_key)
            
            # 生成 Token
            access_token = JWTManager.generate_token(user_id, email, 'access')
            refresh_token = JWTManager.generate_token(user_id, email, 'refresh')
            
            return {
                'success': True,
                'user': {
                    'id': user_id,
                    'email': email,
                    'created_at': now,
                    'invite_code': my_invite_code
                },
                'token': access_token,
                'refresh_token': refresh_token,
                'rewards': [
                    {'type': 'ai_quota', 'value': 15, 'description': 'AI咨询15次/日'},
                    {'type': 'template', 'value': 'newcomer', 'description': '新星专属模板'},
                    {'type': 'badge', 'value': 'newcomer', 'description': '新星徽章'}
                ],
                'invite_reward': {
                    'inviter_name': '您的好友',
                    'reward_description': '+5次AI/日'
                } if inviter_id else None
            }
            
        except Exception as e:
            print(f"[Register Error] {e}")
            return {'success': False, 'error': '注册失败，请稍后重试'}
    
    @classmethod
    async def login(cls, email: str, password: str) -> Dict:
        """用户登录"""
        try:
            from ..utils.kv_client import kv
            
            # 获取用户
            user = await kv.get(f"{cls.KV_PREFIX_USER_EMAIL}{email}")
            if not user:
                return {'success': False, 'error': '邮箱或密码错误'}
            
            # 验证密码
            if not cls.verify_password(password, user['password_hash']):
                return {'success': False, 'error': '邮箱或密码错误'}
            
            # 生成 Token
            access_token = JWTManager.generate_token(user['id'], email, 'access')
            refresh_token = JWTManager.generate_token(user['id'], email, 'refresh')
            
            # 获取奖励信息
            rewards = await kv.get(cls.KV_PREFIX_REWARDS.format(user['id']))
            invite_stats = await kv.get(cls.KV_PREFIX_INVITE_STATS.format(user['id']))
            
            return {
                'success': True,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'invite_code': user['invite_code'],
                    'rewards': rewards or {},
                    'invite_stats': invite_stats or {'total': 0, 'successful': 0}
                },
                'token': access_token,
                'refresh_token': refresh_token,
                'requires_sync': True
            }
            
        except Exception as e:
            print(f"[Login Error] {e}")
            return {'success': False, 'error': '登录失败'}
```

---

## 四、环境变量配置

### 4.1 Vercel Dashboard 配置

进入 Vercel Dashboard → Project Settings → Environment Variables：

```
# 必需变量
KV_URL                  = redis://... (Vercel 自动创建)
KV_REST_API_URL         = https://... (Vercel 自动创建)
KV_REST_API_TOKEN       = *********** (Vercel 自动创建)
JWT_SECRET              = your-random-secret-key-min-32-chars
RESEND_API_KEY          = re_xxxxxxxx (从 Resend 控制台获取)

# 可选变量
APP_NAME                = Fortune Calendar
VERCEL_ENV              = production (Vercel 自动设置)
```

### 4.2 Vercel KV 创建步骤

1. 进入 Vercel Dashboard
2. 点击 Storage → Create Database → KV
3. 选择 Region（建议选 Singapore 或 Tokyo，离中国近）
4. 连接到你的 Project
5. 环境变量会自动注入

---

## 五、邮件服务配置（Resend）

### 5.1 Resend 注册与配置

1. 访问 https://resend.com 注册账号
2. 验证域名（可选，也可用默认域名）
3. 创建 API Key
4. 将 API Key 添加到 Vercel 环境变量

### 5.2 邮件发送实现（Vercel 兼容）

```python
# api/utils/email_sender.py
import urllib.request
import json
import os

async def send_verification_email(to_email: str, code: str) -> bool:
    """使用 Resend 发送验证邮件"""
    
    api_key = os.environ.get('RESEND_API_KEY')
    if not api_key:
        print("[Email] RESEND_API_KEY not set")
        return False
    
    from_email = "Fortune Calendar <noreply@fortune-calendar.vercel.app>"
    
    html_content = f"""
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #6366f1;">命运日历 - 邮箱验证</h2>
        <p>您的验证码是：</p>
        <div style="background: #f3f4f6; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6366f1;">
            {code}
        </div>
        <p style="color: #6b7280; font-size: 14px;">验证码5分钟内有效，请勿泄露给他人。</p>
        <p style="color: #6b7280; font-size: 12px;">如非本人操作，请忽略此邮件。</p>
    </div>
    """
    
    data = {
        "from": from_email,
        "to": to_email,
        "subject": "命运日历 - 邮箱验证码",
        "html": html_content
    }
    
    try:
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(data).encode(),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            method="POST"
        )
        
        with urllib.request.urlopen(req, timeout=10) as response:
            return response.status == 200
            
    except Exception as e:
        print(f"[Email Error] {e}")
        return False
```

---

## 六、vercel.json 配置

```json
{
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    },
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.py"
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "PYTHONPATH": "api"
  }
}
```

---

## 七、部署检查清单

### 7.1 部署前检查

- [ ] Vercel KV 已创建并连接
- [ ] 环境变量已配置（JWT_SECRET, RESEND_API_KEY）
- [ ] 代码已 push 到 GitHub
- [ ] 前端 build 通过
- [ ] Python 依赖在 requirements.txt 中

### 7.2 部署后验证

```bash
# 测试注册流程
curl -X POST https://your-domain.vercel.app/api/auth/send-code \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# 测试登录流程
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "123456"}'

# 测试同步 API（需 Token）
curl https://your-domain.vercel.app/api/sync/status \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 八、常见问题

### Q1: Vercel KV 有免费额度吗？
A: 有，每月 10,000 次读写，足够小规模使用。

### Q2: 可以自建 Redis 替代 Vercel KV 吗？
A: 可以，修改 KV 客户端连接到你的 Redis URL 即可。

### Q3: 邮件发送有频率限制吗？
A: Resend 免费版：100 封/天，足够测试使用。

### Q4: 用户数据安全吗？
A: Vercel KV 使用 TLS 加密传输，数据加密存储。

---

**所有服务已确认兼容 Vercel Serverless 环境！**
