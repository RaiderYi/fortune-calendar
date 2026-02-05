# 测试文档

本文档说明如何运行和使用测试套件。

## 测试结构

```
tests/
├── test_utils.py              # 测试工具模块
├── test_api_endpoints.py      # 后端API测试
├── test_integration.py         # 集成测试
├── test_performance.py        # 性能测试
├── frontend_test_checklist.md  # 前端手动测试清单
└── README.md                  # 本文档
```

## 运行测试

### 运行所有测试

```bash
python run_tests.py --all
```

### 运行特定测试套件

```bash
# 只运行API端点测试
python run_tests.py --api

# 只运行集成测试
python run_tests.py --integration

# 只运行性能测试
python run_tests.py --performance
```

### 生成测试报告

```bash
# 自动生成带时间戳的报告文件
python run_tests.py --all

# 指定报告文件路径
python run_tests.py --all --report test_results.txt
```

## 测试说明

### 1. 后端API测试 (`test_api_endpoints.py`)

测试所有后端API端点的功能：

- **运势API** (`/api/fortune`)
  - 基本请求
  - 不同日期返回不同结果
  - 参数验证
  - 响应数据结构

- **认证API** (`/api/auth/*`)
  - 用户注册
  - 用户登录
  - Token验证
  - 错误处理

- **同步API** (`/api/sync/*`)
  - 数据上传
  - 数据下载
  - 数据合并

- **统计API** (`/api/analytics/*`)
  - 事件追踪
  - 数据查询

- **AI聊天API** (`/api/ai-chat`)
  - 基本对话

### 2. 集成测试 (`test_integration.py`)

测试完整的用户流程：

- 用户注册登录流程
- 数据同步流程
- 运势计算流程
- 任务完成流程

### 3. 性能测试 (`test_performance.py`)

测试API响应时间：

- 运势API响应时间 < 3秒
- 认证API响应时间 < 1秒
- 同步API响应时间 < 2秒
- 并发请求性能

### 4. 前端测试清单 (`frontend_test_checklist.md`)

手动测试步骤和检查清单，包括：

- 通知功能
- 任务系统
- 报告功能
- 日记功能
- 开发者仪表板

## 注意事项

1. **环境要求**：确保Python环境已安装所有依赖
2. **测试数据**：测试使用模拟数据，不会影响生产环境
3. **网络依赖**：部分测试可能需要网络连接（如AI API）
4. **KV存储**：统计API测试可能因KV存储限制返回空数据

## 故障排除

### 导入错误

如果遇到模块导入错误，确保：
1. 在项目根目录运行测试
2. Python路径包含项目目录

### 测试失败

如果测试失败：
1. 查看测试输出中的详细错误信息
2. 检查API服务是否正常运行
3. 验证测试数据格式是否正确

## 持续集成

可以将测试集成到CI/CD流程中：

```yaml
# 示例 GitHub Actions
- name: Run Tests
  run: python run_tests.py --all --report test_report.txt
```
