# DataScope-Node

数据分析与可视化平台后端服务

### API文档

#### 元数据管理

元数据API用于获取和管理数据源的元数据信息，包括表结构、统计信息等。

##### 获取数据源的表列表

```
GET /api/metadata/datasources/:dataSourceId/tables
```

返回指定数据源的所有表列表，每个表包含名称、类型和所属的schema信息。

**请求参数:**
- `dataSourceId`: 数据源ID (路径参数)

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "name": "users",
      "type": "TABLE",
      "schema": "public"
    },
    {
      "name": "orders",
      "type": "TABLE",
      "schema": "public"
    }
  ]
}
```

##### 获取表的列信息

```
GET /api/metadata/datasources/:dataSourceId/tables/:tableName/columns
```

获取指定数据源中某个表的所有列信息。

**请求参数:**
- `dataSourceId`: 数据源ID (路径参数)
- `tableName`: 表名 (路径参数)

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "name": "id",
      "type": "INTEGER",
      "nullable": false,
      "defaultValue": null,
      "isPrimaryKey": true
    },
    {
      "name": "name",
      "type": "VARCHAR",
      "nullable": false,
      "defaultValue": null,
      "isPrimaryKey": false
    }
  ]
}
```

##### 获取数据源结构

```
GET /api/metadata/datasources/:dataSourceId/structure
```

获取数据源的完整结构信息，包括所有表和列。

**请求参数:**
- `dataSourceId`: 数据源ID (路径参数)

**响应示例:**
```json
{
  "success": true,
  "data": {
    "databaseName": "example_db",
    "tables": [
      {
        "name": "users",
        "columns": [
          {
            "name": "id",
            "type": "INTEGER",
            "nullable": false,
            "defaultValue": null,
            "isPrimaryKey": true
          },
          {
            "name": "name",
            "type": "VARCHAR",
            "nullable": false,
            "defaultValue": null,
            "isPrimaryKey": false
          }
        ]
      }
    ]
  }
}
```

##### 同步数据源元数据

```
POST /api/metadata/datasources/:dataSourceId/sync
```

同步并更新数据源的元数据信息。

**请求参数:**
- `dataSourceId`: 数据源ID (路径参数)

**响应示例:**
```json
{
  "success": true,
  "data": {
    "dataSourceId": "550e8400-e29b-41d4-a716-446655440000",
    "tablesCount": 25,
    "updatedAt": "2023-03-31T14:30:00.000Z"
  }
}
```

##### 获取数据源统计信息

```
GET /api/metadata/datasources/:dataSourceId/stats
```

获取数据源的统计信息，包括表数量、行数等。

**请求参数:**
- `dataSourceId`: 数据源ID (路径参数)

**响应示例:**
```json
{
  "success": true,
  "data": {
    "tableCount": 25,
    "tables": [
      {
        "name": "users",
        "rowCount": 1500,
        "columnCount": 8
      },
      {
        "name": "orders",
        "rowCount": 5280,
        "columnCount": 10
      }
    ],
    "databaseSize": {
      "pretty": "25 MB",
      "bytes": 26214400
    },
    "lastUpdated": "2023-03-31T12:30:00.000Z"
  }
}
```

#### 数据源管理

数据源API用于创建、更新、删除和查询数据源配置。

##### 测试数据库连接

```
POST /api/datasources/test-connection
```

测试数据库连接是否成功。

**请求体示例:**
```json
{
  "type": "mysql",
  "host": "localhost",
  "port": 3306,
  "username": "user",
  "password": "password",
  "databaseName": "testdb"
}
```

**响应示例:**
```json
{
  "success": true,
  "message": "连接成功",
  "data": {
    "tablesCount": 15,
    "tables": ["users", "orders", "products", "categories", "customers"]
  }
}
```

## 功能特点

- **数据源管理**：创建、编辑和管理多种类型的数据库连接
- **SQL查询**：执行SQL查询并以表格形式查看结果
- **查询历史**：自动保存查询历史记录
- **元数据浏览**：浏览数据库表结构、关系和字段信息
- **查询保存**：保存常用查询以便快速访问
- **数据可视化**：将查询结果转换为直观的图表（待实现）
- **查询执行计划**：分析和可视化SQL查询执行计划，提供性能优化建议
- **错误处理**：统一的错误处理机制，提供友好的错误信息

## 查询执行计划功能

查询执行计划分析是DataScope的核心功能之一，它提供了以下能力：

- **获取执行计划**：支持获取MySQL、PostgreSQL等各种数据库的查询执行计划
- **执行计划可视化**：将复杂的执行计划转换为直观的可视化图表
- **性能瓶颈识别**：自动识别查询中的性能瓶颈，如全表扫描、索引使用不当等
- **优化建议**：根据执行计划提供针对性的优化建议，支持单独获取优化建议列表
- **计划比较**：支持比较两个查询执行计划的差异，帮助评估优化效果
- **历史记录**：保存执行计划历史，便于分析查询性能变化趋势
- **安全处理**：对节点数据进行可靠的安全检查，确保系统的稳定性与可靠性
- **索引推荐**：基于查询分析结果提供索引优化建议，包括针对列基数的不同优化策略

### 使用方法

#### 获取查询执行计划

```bash
POST /api/query-plans/analyze
{
  "dataSourceId": "your-datasource-id",
  "sql": "SELECT * FROM users WHERE status = 'active'"
}
```

响应示例：
```json
{
  "success": true,
  "data": {
    "plan": {
      "planNodes": [
        {
          "id": 1,
          "selectType": "SIMPLE",
          "table": "users",
          "type": "ALL",
          "possibleKeys": null,
          "key": null,
          "rows": 1000,
          "filtered": 100,
          "extra": null
        }
      ],
      "warnings": [
        "表 users 正在进行全表扫描，扫描了 1000 行"
      ],
      "optimizationTips": [
        "考虑为表 users 添加索引，覆盖常用的查询条件"
      ],
      "estimatedCost": 1000
    },
    "id": "plan-id-123"
  }
}
```

#### 保存执行计划

```bash
POST /api/query-plans/save
{
  "dataSourceId": "your-datasource-id",
  "name": "用户查询计划",
  "sql": "SELECT * FROM users WHERE status = 'active'",
  "planData": {...} // 执行计划数据
}
```

#### 比较执行计划

```bash
POST /api/query-plans/compare
{
  "planAId": "first-plan-id",
  "planBId": "second-plan-id"
}
```

响应示例：
```json
{
  "success": true,
  "data": {
    "costDifference": -500,
    "costImprovement": 50,
    "accessTypeChanges": [
      {
        "table": "users",
        "from": "ALL",
        "to": "range",
        "improvement": true
      }
    ]
  }
}
```

### 技术实现

- 模块化的查询计划转换器，支持不同数据库的执行计划格式
- 专用的MySQL计划分析器，深度解析MySQL执行计划的各个方面
- 基于多维度的性能评估算法，提供全面的性能分析
- 直观的可视化界面，突出显示关键性能指标和潜在问题
- 支持保存和比较不同时间点的执行计划

## 技术栈

### 前端

前端基于Vue 3，详情查看 [webview-ui](webview-ui/README.md)

- Vue 3 + TypeScript
- Element Plus
- Monaco Editor
- ECharts（待集成）

### 后端

后端基于Node.js + Express + Prisma，详情查看 [webService](webService/README.md)

- Node.js + TypeScript
- Express.js
- Prisma ORM
- MySQL (数据库)
- Swagger (API文档)
- 严格的类型安全设计，统一的接口定义
- 模块化数据库连接器，支持多种数据库类型
- 完整的错误处理和日志记录
- 全面的错误处理系统，支持统一的错误格式和多种错误类型
  - 基础错误类 (AppError)
  - API错误 (ApiError) 
  - 数据库错误 (DatabaseError)
  - 数据源错误 (DataSourceError)
  - 查询错误 (QueryError)
  - 验证错误 (ValidationError)

### 测试体系

- 完整的测试架构，包括单元测试和集成测试
- 使用Jest测试框架进行自动化测试
- 所有核心控制器已完成测试用例并全部通过：
  - datasource.controller.test.js (17个测试通过)
  - query.controller.test.js (16个测试通过)
  - query-plan.controller.test.js (10个测试通过)
- 使用Docker容器创建隔离的测试数据库环境
- 测试中使用mock对象替代真实依赖，确保单元测试的隔离性和可靠性
- 支持测试覆盖率分析，确保代码质量

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
