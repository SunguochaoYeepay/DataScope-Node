# DataScope-Node Web Service

DataScope是一个数据库查询分析和优化工具，帮助开发人员和数据库管理员提高SQL查询性能。

## 功能特点

- 支持多种数据库连接（MySQL, PostgreSQL）
- SQL查询执行与历史记录
- 查询计划分析和可视化
- 性能优化建议
- 查询保存和分享
- 数据库结构分析

## 安装与设置

### 环境要求

- Node.js v16+
- npm 或 yarn
- TypeScript v4.5+
- 支持的数据库: MySQL 5.7+, PostgreSQL 12+

### 安装依赖

```bash
npm install
```

### 配置

1. 复制 `.env.example` 到 `.env`
2. 根据环境需求修改相关配置

### 开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 生产环境运行

```bash
npm start
```

## 项目结构

```
src/
├── api/              # API路由和控制器
├── config/           # 配置文件
├── db/               # 数据库连接和模型
├── services/         # 业务逻辑服务
├── types/            # TypeScript类型定义
├── utils/            # 工具函数
├── app.ts            # Express应用
└── index.ts          # 入口文件
```

## 测试

项目使用Jest进行单元测试和集成测试。

### 运行所有测试

```bash
npm test
```

### 运行特定测试

```bash
npx jest tests/unit/controllers/query.controller.test.ts
```

### 测试覆盖率

```bash
npm run test:coverage
```

### 测试结构

项目的测试文件组织如下：

```
tests/
├── unit/             # 单元测试
│   ├── controllers/  # 控制器测试
│   ├── services/     # 服务测试
│   └── utils/        # 工具函数测试
├── integration/      # 集成测试
├── e2e/              # 端到端测试
└── mocks/            # 测试模拟数据
```

### 编写测试

- 单元测试应关注单个函数或组件的行为，使用mock隔离依赖
- 集成测试验证多个组件一起工作的情况
- 所有API端点都应有相应的测试
- 使用测试覆盖率报告找出未测试的代码路径

## API文档

API文档使用Swagger生成，访问 `/api-docs` 路径可查看完整API文档。

## 错误处理

系统采用统一的错误处理机制：

- 所有错误通过 `ApiError` 类处理
- 错误代码定义在 `errors.ts` 文件中
- API响应包含状态码、错误消息和详细信息

## 许可证

MIT