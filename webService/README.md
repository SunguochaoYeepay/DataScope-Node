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

## 设计文档

项目的设计规范和开发指南文档位于 `design-docs` 目录中：

- [API响应格式规范](./design-docs/api-response-format.md) - 定义了统一的API响应格式标准

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

### 数据源管理

- `GET /api/datasources`: 获取数据源列表
- `GET /api/datasources/:id`: 获取单个数据源信息
- `POST /api/datasources`: 创建新数据源
- `PUT /api/datasources/:id`: 更新数据源
- `DELETE /api/datasources/:id`: 删除数据源
- `POST /api/datasources/test-connection`: 测试数据源连接
- `GET /api/datasources/:id/stats`: 获取数据源统计信息（表数量、行数等）

### 元数据管理

- `GET /api/metadata/datasources/:dataSourceId/tables`: 获取数据源的表列表
- `GET /api/metadata/datasources/:dataSourceId/tables/:tableName/columns`: 获取表的列信息
- `GET /api/metadata/datasources/:dataSourceId/structure`: 获取数据源的元数据结构
- `POST /api/metadata/datasources/:dataSourceId/sync`: 同步数据源的元数据

### 查询管理

- `POST /api/queries/execute`: 执行SQL查询
  - 支持`createHistory`参数，控制是否生成查询历史记录
  - 当`createHistory=true`或执行已保存查询时，会创建历史记录
  - 默认不创建历史记录，减少系统负担
- `GET /api/queries/history`: 获取查询历史
- `GET /api/queries/history/:id`: 获取单个查询历史记录详情
- `GET /api/queries/saved`: 获取已保存的查询
- `POST /api/queries`: 保存查询
  - 支持传入自定义`id`参数，允许创建使用非UUID格式的查询ID
  - 如果不提供`id`，系统将自动生成UUID格式的ID
  - 自定义ID必须是有效的字符串，不能包含特殊字符
- `PUT /api/queries/:id`: 更新查询
  - 支持使用自定义ID格式的查询
  - ID可以是UUID格式或任何其他自定义格式
  - 支持upsert操作：如果查询不存在且提供了必要参数(dataSourceId, name)，会自动创建查询
  - 保留原始ID作为新创建查询的ID
  - 极大简化了前端操作流程，无需区分创建/更新操作
- `GET /api/queries/favorites`: 获取收藏的查询
- `POST /api/queries/:id/favorite`: 收藏查询
- `DELETE /api/queries/:id/favorite`: 取消收藏查询

## 特殊命令支持

系统支持执行多种特殊的SQL命令，这些命令在处理时不会追加LIMIT子句：

- `SHOW` 类命令（如 `SHOW DATABASES`、`SHOW TABLES`、`SHOW COLUMNS` 等）
- `DESCRIBE`/`DESC` 命令
- `SET` 类命令
- `USE` 命令

这些特殊命令可以带或不带分号结尾，系统均可正确识别并处理。

## 连接机制

系统采用增强的数据库连接机制：

- 智能主机名解析：自动将容器名称转换为正确的主机地址
  - 支持的容器名称：`datascope-mysql`, `mysql`, `mariadb`, `database`, `db`
  - 在非容器环境中自动映射到 `localhost`
  - 自动处理空主机名，转换为 `127.0.0.1`
- 连接重试机制：
  - 默认重试次数：3次
  - 退避策略：首次失败后等待500ms，后续每次失败等待时间翻倍，最太等待时间为5000ms
  - 详细日志记录每次连接尝试
  
## 数据源ID允许格式

系统对数据源ID格式采用灵活的验证标准：

- 创建数据源时自动生成UUID格式的ID
- 查询、更新、删除等操作支持任意非空字符串作为ID
- 所有API接口都使用统一的ID验证机制

## 错误处理

系统采用统一的错误处理机制：

- 所有错误通过 `ApiError` 类处理
- 错误代码定义在 `errors.ts` 文件中
- API响应包含状态码、错误消息和详细信息

## 许可证

MIT

## 容器环境配置

项目支持在容器环境和本地环境中运行，通过环境变量 `CONTAINER_ENV` 来区分:

- `CONTAINER_ENV=true`: 表示服务运行在容器环境中，使用容器名称（如 `datascope-mysql`）连接数据库
- `CONTAINER_ENV=false`: 表示服务运行在本地环境中，会自动将容器名称解析为 `localhost`

示例启动命令:
```bash
# 本地环境启动
export CONTAINER_ENV=false && node dist/app.js

# 容器环境启动
export CONTAINER_ENV=true && node dist/app.js
```

## 环境要求