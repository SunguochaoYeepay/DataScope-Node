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

本项目包含全面的测试套件，以确保代码质量和功能正确性：

### 单元测试

```bash
# 运行所有测试
npm test

# 运行特定测试文件
npm test -- tests/unit/services/metadata.service.test.js

# 运行带有特定名称的测试
npm test -- --testNamePattern="应当同步元数据并返回结果"

# 生成测试覆盖率报告
npm test -- --coverage

# 仅运行控制器测试
npm test -- --testPathPattern='controllers'

# 指定运行某几个控制器测试
npm test -- --testPathPattern='(datasource|query|query-plan)\.controller\.test\.js'
```

### 接口测试状态

已完成的接口测试：

- 控制器测试（所有核心控制器测试已修复并通过）
  - datasource.controller.test.js - 数据源控制器测试 (17个测试用例)
  - query.controller.test.js - 查询控制器测试 (16个测试用例)
  - query-plan.controller.test.js - 查询计划控制器测试 (10个测试用例)

- 服务测试
  - metadata.service.test.js - 元数据服务测试（syncMetadata, getMetadataStructure等）
  - metadata/relationship-detector.test.ts - 关系检测器测试
  - metadata/column-analyzer.test.ts - 列分析器测试

测试中的注意事项：
- 所有测试需要正确引用错误类型，例如从`../../../src/utils/errors/types/api-error`导入`ApiError`
- 为避免TypeScript类型冲突，核心控制器测试已使用JavaScript重写
- 测试中使用mock代替实际数据库连接，确保单元测试独立性
- 每个测试函数需要独立设置mock和断言，避免测试间相互影响

### 数据库测试环境

针对集成测试和手动测试，推荐使用Docker环境：

```bash
# 启动MySQL测试容器
docker run -d \
  --name datascope-mysql \
  -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=datascope \
  -e MYSQL_DATABASE=datascope \
  mysql:8

# 配置环境变量
DATABASE_URL="mysql://root:datascope@localhost:3306/datascope"

# 运行Prisma迁移
npx prisma migrate dev
```

## API文档

API文档使用Swagger生成，访问 `/api-docs` 路径可查看完整API文档。

## 特殊命令支持

系统支持执行多种特殊的SQL命令，这些命令在处理时不会追加LIMIT子句：

- `SHOW` 类命令（如 `SHOW DATABASES`、`SHOW TABLES`、`SHOW COLUMNS` 等）
- `DESCRIBE`/`DESC` 命令
- `SET` 类命令
- `USE` 命令

这些特殊命令可以带或不带分号结尾，系统均可正确识别并处理。

## 错误处理

系统采用统一的错误处理机制：

- 所有错误通过 `ApiError` 类处理
- 错误代码定义在 `errors.ts` 文件中
- API响应包含状态码、错误消息和详细信息

## 许可证

MIT