# 🎋 命运日历 (Fortune Calendar)

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind-4.1-06B6D4?logo=tailwindcss" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/PWA-Supported-5A0FC8?logo=pwa" alt="PWA" />
</p>

<p align="center">
  <b>现代东方美学 × 八字命理</b><br/>
  一款融合传统东方美学与现代交互设计的运势查询应用
</p>

<p align="center">
  <a href="#功能特性">功能特性</a> •
  <a href="#技术栈">技术栈</a> •
  <a href="#快速开始">快速开始</a> •
  <a href="#项目结构">项目结构</a> •
  <a href="#贡献指南">贡献指南</a>
</p>

---

## ✨ 功能特性

### 🔮 核心功能

| 功能 | 描述 |
|------|------|
| **八字运势计算** | 基于出生日期时间计算八字，提供每日运势评分 |
| **六维运势分析** | 事业、财运、桃花、健康、学业、出行六个维度分析 |
| **运势轨迹** | 追踪运势变化趋势，水墨风格数据可视化 |
| **AI 命理咨询** | 集成 DeepSeek API 提供智能命理解答 |
| **塔罗占卜** | 四阶段沉浸式塔罗体验（准备→抽牌→揭晓→解读） |
| **易经问卦** | 铜钱摇卦，六爻生成，传统卦象解读 |
| **日签生成** | 生成精美运势日签图片供分享 |

### 🎨 设计特色

- **现代东方美学** - 宣纸底色、朱砂红、青黛色的和谐配色
- **水墨动效** - 水墨晕染转场、呼吸涟漪、金粉粒子效果
- **流畅动画** - Framer Motion 驱动的页面转场和微交互
- **响应式设计** - 完美适配移动端和桌面端
- **PWA 支持** - 可安装为桌面/移动应用，支持离线使用

### 🌍 国际化

- 支持中文（简体）和英文界面切换
- 完整的 i18n 国际化解决方案

---

## 🛠 技术栈

### 前端

| 技术 | 版本 | 用途 |
|------|------|------|
| [React](https://react.dev/) | ^19.2.0 | UI 框架 |
| [TypeScript](https://www.typescriptlang.org/) | ~5.9.3 | 类型安全 |
| [Vite (rolldown-vite)](https://vitejs.cn/) | 7.2.5 | 构建工具 |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.1.18 | CSS 框架 |
| [Framer Motion](https://www.framer.com/motion/) | ^12.29.2 | 动画效果 |
| [React Router](https://reactrouter.com/) | ^7.4.0 | 路由管理 |
| [Recharts](https://recharts.org/) | ^3.6.0 | 图表组件 |
| [i18next](https://www.i18next.com/) | ^25.8.0 | 国际化 |

### 后端

| 技术 | 用途 |
|------|------|
| Python 3 | 服务端语言 |
| Vercel Serverless Functions | 无服务器部署 |
| DeepSeek API | AI 聊天功能 |
| Vercel KV | 数据存储 (Redis 兼容) |

---

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9
- Python 3.9+ (后端开发)

### 安装依赖

```bash
# 克隆仓库
git clone https://github.com/RaiderYi/fortune-calendar.git
cd fortune-calendar

# 安装前端依赖
npm install

# 安装后端依赖（如需要本地开发后端）
cd api
pip install -r requirements.txt
cd ..
```

### 开发环境配置

创建 `.env` 文件：

```env
# API 配置
VITE_API_BASE_URL=http://localhost:5000

# 可选：AI 功能配置
DEEPSEEK_API_KEY=your_api_key_here
```

### 启动开发服务器

```bash
# 启动前端开发服务器
npm run dev

# 启动后端服务器（新终端）
cd api
python index.py
```

访问 http://localhost:5173 查看应用

### 构建生产版本

```bash
npm run build
```

构建产物位于 `dist/` 目录

---

## 📁 项目结构

```
my-fortune-calendar/
├── api/                          # 后端 API（Vercel Serverless）
│   ├── index.py                  # API 入口处理器
│   ├── core/                     # 核心计算引擎
│   │   ├── bazi_engine.py        # 八字分析引擎
│   │   ├── fortune_engine.py     # 运势评分算法
│   │   └── lunar.py              # 农历/干支计算
│   └── services/                 # 业务服务层
│
├── src/                          # 前端源码
│   ├── components/               # React 组件
│   │   ├── oriental/             # 🎋 东方美学组件
│   │   │   ├── animations/       # 动画组件
│   │   │   ├── FortuneCard/      # 运势签卡片
│   │   │   ├── TrendDashboard/   # 趋势看板
│   │   │   ├── Tarot/            # 塔罗沉浸式体验
│   │   │   └── Yijing/           # 易经沉浸式体验
│   │   └── ...                   # 其他组件
│   ├── pages/                    # 页面组件
│   ├── contexts/                 # React Context
│   ├── hooks/                    # 自定义 Hooks
│   ├── services/                 # 前端 API 服务
│   ├── locales/                  # i18n 翻译文件
│   └── styles/                   # 样式文件
│       ├── oriental-theme.css    # 东方美学CSS变量
│       └── fonts.css             # 字体加载
│
├── public/                       # 静态资源
├── tests/                        # 测试套件
└── docs/                         # 文档
```

---

## 🎨 东方美学设计系统

### 色彩系统

| 用途 | 颜色值 | CSS变量 |
|------|--------|---------|
| 主背景 | `#FAF8F3` | `--bg-paper` |
| 深色背景 | `#1A1A2E` | `--bg-ink` |
| 主强调色（朱砂红） | `#C45C26` | `--accent-vermilion` |
| 次强调色（青黛） | `#2D5A4A` | `--accent-qingdai` |
| 金色 | `#D4A574` | `--accent-gold` |
| 文字主色 | `#2C2C2C` | `--text-ink` |

### 字体系统

- **标题字体**: Noto Serif SC（思源宋体）- 书法感
- **正文字体**: 系统默认无衬线 - 保证可读性

---

## 📱 主要页面

| 页面 | 路径 | 描述 |
|------|------|------|
| 今日运势 | `/app/fortune/today` | 查看当日运势详情 |
| 运势轨迹 | `/app/fortune/trends` | 趋势分析和历史对比 |
| 塔罗占卜 | `/app/divination/tarot` | 沉浸式塔罗体验 |
| 易经问卦 | `/app/divination/yijing` | 铜钱摇卦占问 |
| 月运分析 | `/app/fortune/monthly` | 月度运势总览 |
| 命盘分析 | `/app/fortune/hepan` | 八字命盘详解 |
| AI 咨询 | `/app/ai` | 智能命理问答 |

---

## 🤝 贡献指南

我们欢迎所有形式的贡献！

### 提交 Issue

- 使用清晰的标题描述问题
- 提供复现步骤和环境信息
- 如有错误截图请附上

### 提交 Pull Request

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

### 代码规范

- 使用 TypeScript 严格模式
- 组件使用函数组件 + Hooks
- Props 需定义接口
- 遵循 ESLint 配置

---

## 📝 更新日志

### [0.1.0] - 2026-03-26

#### 新增
- ✨ 全新东方美学设计系统
- ✨ 运势签卡片（折叠展开式）
- ✨ 趋势看板（水墨风格图表）
- ✨ 塔罗沉浸式体验（四阶段流程）
- ✨ 易经铜钱摇卦（六爻生成）
- ✨ 水墨动效系统（转场、加载、粒子）

#### 改进
- 🎨 重构视觉系统，统一东方美学风格
- ⚡ 优化动画性能，支持 reduced-motion
- 🌍 完善国际化支持

---

## 📄 许可证

本项目采用 [MIT](LICENSE) 许可证

---

## 🙏 致谢

- [Noto Serif SC](https://fonts.google.com/noto/specimen/Noto+Serif+SC) - 思源宋体
- [Lucide Icons](https://lucide.dev/) - 图标库
- [Framer Motion](https://www.framer.com/motion/) - 动画库

---

<p align="center">
  Made with ❤️ and ☯️
</p>
