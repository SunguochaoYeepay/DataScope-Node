#### 运行测试

##### 单元测试

单元测试不依赖实际数据库连接，可以直接运行：

```bash
cd webService
npm test                                    # 运行所有单元测试
npm test tests/unit/controllers             # 运行所有控制器测试
npm test tests/unit/controllers/datasource.controller.test.js  # 运行特定控制器测试
```

##### 集成测试

集成测试需要启动一个测试数据库环境：

```bash
cd webService
npm run test:integration                    # 运行所有集成测试
```

#### 测试覆盖率

查看测试覆盖率报告：

```bash
cd webService
npm run test:coverage
```

覆盖率报告将生成在`webService/coverage`目录中。

## 最近更新

### 查询版本控制与状态管理 (未发布)

最新版本实现了全新的查询版本控制和状态管理功能：

1. **版本比较**：支持不同版本的SQL、元数据和参数比较
2. **版本历史**：展示查询的版本历史和变更记录
3. **版本标记**：支持为查询版本添加标签和备注
4. **状态管理**：管理查询版本的工作流状态
5. **版本创建**：提供版本创建和参数配置界面

### 密码加密方案优化 (1.0.3)

在1.0.3版本中，我们对数据源密码的加密方案进行了重要优化：

1. **加密方式变更**：从单向哈希加密改为AES-256-CBC可逆加密
2. **密码迁移工具**：提供迁移脚本，自动将旧格式密码转换为新格式
3. **API修复**：修复了更新数据源和执行查询API

#### 迁移旧数据

如果您的系统中有使用旧版加密方式的数据源，请执行以下命令进行迁移：

```bash
cd webService
npm run migrate-passwords
```

注意：迁移过程会将所有现有数据源密码重置为默认密码 "password"，请在迁移后修改为您自己的密码。

## 开发指南

## 系统架构

DataScope-Node 采用模块化的架构设计，主要包括以下几个核心模块：

1. **API层**：提供RESTful API接口，处理客户端请求
2. **服务层**：实现业务逻辑，包括数据源管理、查询执行、元数据同步等
3. **数据库适配层**：通过适配器模式支持不同类型的数据库连接和操作
4. **查询计划分析器**：解析和分析查询执行计划，识别性能瓶颈
5. **持久化层**：使用Prisma ORM进行数据持久化操作

## 功能介绍

### 数据源管理
- 支持添加、修改、删除数据源
- 支持连接测试功能
- 一期支持MySQL数据库，系统架构已预留PostgreSQL、Oracle等数据库扩展能力
- 支持手动和自动检查数据源连接状态，确保数据源状态显示准确
- 支持明文密码存储（仅用于开发环境），简化开发测试流程
- 自动记录数据源同步时间，便于监控同步状态

### 查询执行
- 支持SQL查询语句执行
- 支持查询结果导出 (CSV, JSON)
- 提供查询历史记录

### 查询执行计划分析
- 支持获取和分析MySQL查询的执行计划
- 提供性能瓶颈识别和优化建议
- 支持执行计划可视化展示
- 可比较不同查询执行计划的性能差异
- 自动生成优化后的SQL查询建议

### 元数据管理
- 自动同步数据库表结构
- 支持浏览表、列、索引等信息
- 显示表关系和依赖关系

### 查询版本控制
- 支持查询的版本历史记录
- 提供版本比较功能，识别SQL和参数变化
- 支持版本标记和分类
- 实现完整的查询版本状态管理工作流

## 示例数据

### 数据源示例

系统内置了四个MySQL示例数据源，用于测试和开发：

1. **本地MySQL开发数据库** (ID: ds001)
   - 用途：本地开发环境使用的数据库连接
   - 连接信息：localhost:3306/datascope

2. **测试环境MySQL数据库** (ID: ds002)
   - 用途：用于功能测试的数据库连接
   - 连接信息：localhost:3306/datascope

3. **生产MySQL数据库（只读）** (ID: ds004)
   - 用途：模拟生产环境的只读数据库连接
   - 连接信息：localhost:3306/datascope

4. **员工信息查询系统**
   - 用途：用于人力资源部门查询员工信息的专用数据库连接
   - 连接信息：localhost:3306/datascope

这些数据源都已配置为使用本地MySQL数据库，确保开发环境可直接使用。所有数据源状态为ACTIVE，且已同步元数据。

### 使用示例数据

通过以下API可以与样例数据源交互：

- 获取数据源列表：`GET /api/datasources`
- 获取特定数据源信息：`GET /api/datasources/{id}`
- 检查数据源状态：`POST /api/datasources/{id}/check-status`
- 同步数据源元数据：`POST /api/metadata/{id}/sync`
- 获取表数据预览：`GET /api/metadata/{id}/tables/{tableName}/data`

## API路由规范

后端服务提供以下主要API路由组：

### 数据源管理 API

- `GET /api/datasources`: 获取所有数据源列表
- `GET /api/datasources/:id`: 获取单个数据源详情
- `POST /api/datasources`: 创建新数据源
- `PUT /api/datasources/:id`: 更新数据源
- `DELETE /api/datasources/:id`: 删除数据源
- `POST /api/datasources/:id/test`: 测试数据源连接
- `POST /api/datasources/:id/check-status`: 检查数据源状态

### 元数据 API

- `POST /api/metadata/:dataSourceId/sync`: 同步数据源元数据
- `GET /api/metadata/:dataSourceId/structure`: 获取数据源结构
- `GET /api/metadata/:dataSourceId/tables`: 获取表列表
- `GET /api/metadata/:dataSourceId/tables/:tableName`: 获取表结构
- `GET /api/metadata/:dataSourceId/tables/:tableName/data`: 获取表数据预览（支持分页、排序和筛选）
- `GET /api/metadata/:dataSourceId/stats`: 获取数据源统计信息

### 查询 API

- `GET /api/queries`: 获取保存的查询列表
- `GET /api/queries/:id`: 获取单个查询详情
- `POST /api/queries`: 创建新查询
- `PUT /api/queries/:id`: 更新查询
- `DELETE /api/queries/:id`: 删除查询
- `POST /api/queries/execute`: 执行临时查询
- `POST /api/queries/:id/execute`: 执行已保存的查询

### 查询版本管理 API

- `GET /api/queries/:queryId/versions`: 获取查询的所有版本
- `GET /api/queries/:queryId/versions/:versionId`: 获取特定版本详情
- `POST /api/queries/:queryId/versions`: 创建新版本
- `POST /api/queries/:queryId/versions/:versionId/create-from`: 基于现有版本创建新版本
- `PUT /api/queries/:queryId/versions/:versionId`: 更新版本
- `GET /api/queries/:queryId/versions/compare`: 比较两个版本
- `POST /api/queries/:queryId/versions/:versionId/set-latest`: 将版本设为最新
- `GET /api/queries/:queryId/versions/:versionId/tags`: 获取版本标签
- `POST /api/queries/:queryId/versions/:versionId/tags`: 创建版本标签
- `DELETE /api/queries/:queryId/tags/:tagId`: 删除版本标签
- `POST /api/queries/:queryId/versions/:versionId/status`: 更改版本状态
- `GET /api/queries/:queryId/versions/:versionId/status-history`: 获取状态历史

## 前端API访问说明

前端应用通过以下方式访问API：

1. **开发模式**：前端可以通过环境变量`VITE_USE_MOCK_API=true`使用模拟API数据
2. **生产模式**：前端直接访问后端API

## 表数据预览API说明

表数据预览API支持以下参数：

- `page`: 页码，从1开始
- `size`: 每页记录数
- `sort`: 排序字段名
- `order`: 排序方向，可选值为`asc`或`desc`
- `filter[columnName]`: 按列筛选，如`filter[id]=1`

示例请求：
```
GET /api/metadata/5da82d17-7b65-4a1f-a009-6e14a751bfc6/tables/tbl_saved_query/data?page=1&size=10&sort=id&order=desc
```

## 数据库配置

应用程序使用MySQL数据库存储配置和元数据信息。系统支持以下密码存储模式：

1. **加密模式**：生产环境中密码使用AES加密存储（默认）
2. **明文模式**：开发环境中支持明文存储密码，通过配置`passwordEncrypted`和`passwordSalt`字段为相同值启用

## 许可证

[MIT](LICENSE)