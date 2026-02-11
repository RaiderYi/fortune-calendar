# AGENTS.md - 命运日历 (Fortune Calendar)

本文件为 AI 编程助手提供项目背景、架构和开发指南。

---

## 项目概述

**命运日历** 是一款基于八字（Bazi）命理的运势查询 Web 应用，支持每日运势预测、流年分析、AI 命理咨询等功能。

- **项目名称**: 命运日历 / Fortune Calendar
- **项目类型**: 全栈 Web 应用（PWA 渐进式 Web 应用）
- **部署平台**: Vercel
- **目标用户**: 对八字命理感兴趣的中文用户，同时支持英文界面

### 核心功能

1. **八字运势计算** - 基于用户出生日期时间计算八字，提供每日运势评分
2. **六维运势分析** - 事业、财运、桃花、健康、学业、出行六个维度
3. **AI 命理咨询** - 集成 DeepSeek API 提供智能命理解答
4. **十年大运趋势** - 展示用户十年运势变化趋势
5. **日签生成** - 生成精美运势日签图片供分享
6. **多语言支持** - 中文（简体）和英文界面切换
7. **PWA 支持** - 可安装为桌面/移动应用，支持离线缓存

---

## 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| React | ^19.2.0 | UI 框架 |
| TypeScript | ~5.9.3 | 类型安全 |
| Vite (rolldown-vite) | 7.2.5 | 构建工具 |
| Tailwind CSS | ^4.1.18 | CSS 框架 |
| Framer Motion | ^12.29.2 | 动画效果 |
| React Router | ^7.4.0 | 路由管理 |
| i18next | ^25.8.0 | 国际化 |
| Recharts | ^3.6.0 | 图表组件 |
| html-to-image | ^1.11.13 | 图片生成 |

### 后端

| 技术 | 用途 |
|------|------|
| Python 3 | 服务端语言 |
| Vercel Serverless Functions | 无服务器部署 |
| http.server (本地开发) | 本地开发服务器 |
| DeepSeek API | AI 聊天功能 |
| Vercel KV | 数据存储 (Redis 兼容) |
| Resend API | 邮件发送服务 |

---

## 项目结构

```
my-fortune-calendar/
├── api/                          # 后端 API（Vercel Serverless）
│   ├── index.py                  # API 入口处理器
│   ├── core/                     # 核心计算引擎
│   │   ├── bazi_engine.py        # 八字分析引擎
│   │   ├── fortune_engine.py     # 运势评分算法
│   │   └── lunar.py              # 农历/干支计算
│   ├── services/                 # 业务服务层
│   │   ├── fortune_service.py    # 运势服务
│   │   ├── ai_service.py         # AI 服务
│   │   └── auth_service.py       # 认证服务
│   └── utils/                    # 工具模块
│
├── src/                          # 前端源码
│   ├── components/               # React 组件
│   │   ├── ui/                   # 通用 UI 组件
│   │   └── layout/               # 布局组件
│   ├── pages/                    # 页面组件
│   │   ├── app/                  # 应用内功能页
│   │   └── *.tsx                 # 营销/静态页面
│   ├── contexts/                 # React Context
│   ├── hooks/                    # 自定义 Hooks
│   ├── services/                 # 前端 API 服务
│   ├── utils/                    # 工具函数
│   ├── types/                    # TypeScript 类型
│   ├── locales/                  # i18n 翻译文件
│   │   ├── zh/                   # 中文翻译
│   │   └── en/                   # 英文翻译
│   └── i18n/config.ts            # i18n 配置
│
├── tests/                        # 测试套件
│   ├── test_api_endpoints.py     # API 测试
│   ├── test_integration.py       # 集成测试
│   └── test_performance.py       # 性能测试
│
├── public/                       # 静态资源
├── dist/                         # 构建输出（Vite）
├── index.html                    # HTML 模板（含 SEO 优化）
├── vite.config.ts                # Vite 配置
├── tailwind.config.js            # Tailwind 配置
├── vercel.json                   # Vercel 部署配置
└── package.json                  # Node.js 依赖
```

---

## 开发命令

### 前端开发

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview

# 代码检查
npm run lint
```

### 后端/测试

```bash
# 运行所有测试
python run_tests.py --all

# 运行特定测试
python run_tests.py --api           # API 端点测试
python run_tests.py --integration   # 集成测试
python run_tests.py --performance   # 性能测试

# 生成测试报告
python run_tests.py --all --report test_results.txt
```

### 本地开发代理配置

Vite 开发服务器已配置代理，将 `/api/*` 请求转发到本地 Python 服务器（端口 5000）：

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://127.0.0.1:5000',
      changeOrigin: true,
    }
  }
}
```

---

## 代码规范

### TypeScript/React 规范

1. **类型安全**: 启用 `strict: true`，所有函数参数和返回值需明确类型
2. **命名规范**:
   - 组件: PascalCase (如 `FortuneCard.tsx`)
   - 工具函数: camelCase (如 `useFortuneData.ts`)
   - 常量: UPPER_SNAKE_CASE
3. **组件结构**:
   - 使用函数组件 + Hooks
   - Props 需定义接口
   - 复杂组件使用懒加载 (`React.lazy`)

### Python 规范

1. **文件编码**: 所有文件使用 UTF-8，文件头添加 `# -*- coding: utf-8 -*-
2. **导入处理**: Vercel 环境使用 try-except 处理相对导入
3. **日志记录**: 使用 `print()` 进行调试日志输出（Vercel 限制）

### 多语言开发

1. **翻译文件位置**: `src/locales/{zh,en}/*.json`
2. **命名空间**:
   - `common` - 通用文本
   - `ui` - 界面元素
   - `fortune` - 运势相关
   - `bazi` - 八字术语
   - `seo` - SEO 元数据
   - `knowledge` - 知识库内容
3. **使用方式**: 
   ```typescript
   const { t } = useTranslation(['common', 'ui']);
   t('ui:buttons.save')
   ```

---

## 测试策略

### 测试类型

| 类型 | 文件 | 说明 |
|------|------|------|
| API 测试 | `tests/test_api_endpoints.py` | 测试后端 API 端点 |
| 集成测试 | `tests/test_integration.py` | 测试完整用户流程 |
| 性能测试 | `tests/test_performance.py` | 测试响应时间和并发 |
| 手动测试 | `tests/frontend_test_checklist*.md` | 前端功能检查清单 |

### 测试要求

- API 响应时间 < 3 秒（运势计算）
- 支持并发请求处理
- 数据验证和错误处理完整

---

## 部署流程

### Vercel 部署配置

```json
// vercel.json
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
        "distDir": "dist",
        "buildCommand": "npm run build"
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
  ]
}
```

### 环境变量

Vercel 部署需要配置以下环境变量：

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `DEEPSEEK_API_KEY` | DeepSeek AI API 密钥 | 是 (AI功能) |
| `JWT_SECRET` | JWT 签名密钥 (32+字符) | 是 (认证) |
| `KV_REST_API_URL` | Vercel KV REST API URL | 是 (数据存储) |
| `KV_REST_API_TOKEN` | Vercel KV REST API Token | 是 (数据存储) |
| `RESEND_API_KEY` | Resend 邮件服务 API 密钥 | 否 (邮件功能) |

---

## 关键架构决策

### 1. 运势计算流程

```
用户输入 → 八字计算 → 用神分析 → 流年流月计算 → 运势评分 → 维度分析 → 主题生成
```

- **八字计算**: `api/core/lunar.py` - 真太阳时校准，330+ 城市支持
- **用神分析**: `api/core/bazi_engine.py` - 日主强弱分析，喜用神计算
- **运势评分**: `api/core/fortune_engine.py` - V5.0 算法，综合多因素评分

### 2. API 入口设计

Vercel Python Serverless Functions 使用 `handler(event, context)` 格式：

```python
def handler(event, context):
    # event: { 'httpMethod', 'path', 'headers', 'body', ... }
    # context: Lambda context
    return {
        'statusCode': 200,
        'headers': {...},
        'body': json.dumps({...})
    }
```

### 3. 同步 vs 异步

由于 Vercel Python 运行时的限制，所有服务层使用**同步实现**：

```python
# 服务层: 同步方法
class AuthService:
    @classmethod
    def login(cls, email, password):  # 同步
        user = cls._run_async(kv.get(key))  # 内部处理异步 KV 操作
        ...

# 路由层: 同步调用
def handle_auth_request(path, method, body, headers):
    result = AuthService.login(email, password)  # 直接调用
    return make_response(result)
```

KV 客户端保持异步（使用 `async/await`），但通过 `_run_async()` 辅助函数在同步上下文中执行。

### 2. 数据存储策略

| 数据类型 | 存储位置 | 说明 |
|----------|----------|------|
| 用户档案 | localStorage | 姓名、出生日期、城市 |
| 历史记录 | localStorage | 运势查询历史 |
| 自定义用神 | localStorage | 用户调整的用神设置 |
| 用户账号 | Vercel KV | 登录凭证、同步数据 |
| 统计数据 | Vercel KV | 使用统计、分析数据 |

### 3. 缓存策略

- **API 响应**: 5 分钟内存缓存（`fetchWithRetryAndCache`）
- **PWA 资源**: Workbox 缓存策略，离线可用
- **字体资源**: 1 年长期缓存

### 4. 响应式设计

- **移动端**: 单列布局，底部导航栏
- **PC 端**: 三栏布局（个人信息 | 核心内容 | 快捷操作）
- **断点**: lg (1024px) 作为主要分界

---

## 安全注意事项

1. **API 密钥**: 仅在服务端使用，禁止暴露到前端
2. **用户数据**: 敏感信息（出生日期）本地存储，不上传服务器
3. **CORS**: API 端点配置跨域允许，但限制请求方法
4. **输入验证**: 所有 API 入参需验证，防止注入攻击
5. **Rate Limiting**: AI 聊天接口有客户端限流保护

---

## 常用开发任务

### 添加新页面

1. 在 `src/pages/app/` 创建页面组件
2. 在 `App.tsx` 添加路由映射（搜索 `FEATURE_PATHS`）
3. 在 `BottomNav` 或 `QuickActionsSidebar` 添加入口

### 添加 API 端点

1. 在 `api/services/` 创建或修改服务类
2. 在 `api/index.py` 的 `do_POST` 中添加路由
3. 添加对应的 `_handle_*_route` 方法
4. 更新 `tests/test_api_endpoints.py` 添加测试

### 添加翻译

1. 在 `src/locales/zh/` 和 `src/locales/en/` 对应的 JSON 文件中添加键值
2. 使用 `t('namespace:key')` 在组件中引用
3. 确保 key 使用小写和驼峰命名

---

## 故障排查

### 常见问题

1. **API 404**: 检查 `vercel.json` 路由配置，确保 `/api/*` 指向正确
2. **FUNCTION_INVOCATION_FAILED**: 
   - 检查 `requirements.txt` 只包含必要依赖（PyJWT 等）
   - 确保没有与 Python 标准库冲突的文件名（如 `email.py`）
   - 检查导入路径使用绝对导入（`from utils.xxx import ...`）
3. **导入错误**: Python 模块使用 try-except 处理 Vercel 相对导入
   - 相对导入 (`..module`) 在 Vercel 会失败，使用绝对导入
   - 每个模块顶部添加路径处理代码
4. **事件循环错误**: Vercel Python 运行时已有事件循环
   - 避免在 handler 中使用 `asyncio.run()`
   - 服务层使用同步方法，通过 `_run_async()` 内部处理异步 KV 操作
5. **构建失败**: 检查 TypeScript 类型错误，运行 `npm run lint`
6. **缓存问题**: PWA 更新后清除浏览器缓存或等待 Service Worker 更新

### 调试技巧

- 使用 `console.log('[DEBUG] ...')` 进行前端调试
- Python 端使用 `print(f"[DEBUG] ...")` 输出日志（Vercel Functions 日志在控制台查看）
- 开启 Vite 开发服务器的详细日志：`vite --debug`

---

## 文件模板

### 新组件模板

```typescript
import React from 'react';
import { useTranslation } from 'react-i18next';

interface Props {
  // 定义 props
}

export const ComponentName: React.FC<Props> = ({ /* props */ }) => {
  const { t } = useTranslation(['ui']);
  
  return (
    <div className="">
      {/* 组件内容 */}
    </div>
  );
};

export default ComponentName;
```

### 新 API 服务模板

```python
# -*- coding: utf-8 -*-
"""
服务描述
"""

import os
import sys

# 处理相对导入
try:
    from ..utils.json_utils import safe_json_dumps
except ImportError:
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    from utils.json_utils import safe_json_dumps

class ServiceName:
    @staticmethod
    def method_name(data):
        """方法描述"""
        try:
            # 业务逻辑
            return {'success': True, 'data': {}, 'code': 200}
        except Exception as e:
            import traceback
            return {'success': False, 'error': str(e), 'code': 500}
```

---

*本文档最后更新: 2026-02-11*
*项目仓库: https://github.com/your-username/my-fortune-calendar*
