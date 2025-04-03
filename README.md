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

#### 系统集成 API

系统集成API用于将现有查询转化为可复用的数据服务，支持低代码平台和外部系统集成。

##### 获取集成列表

```
GET /api/low-code/apis
```

获取所有已配置的系统集成。

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "用户列表API",
      "description": "获取系统中所有活跃用户的信息",
      "type": "TABLE",
      "status": "ACTIVE",
      "queryId": "123e4567-e89b-12d3-a456-426614174000",
      "config": {
        "params": [
          {
            "name": "status",
            "type": "STRING",
            "required": false,
            "defaultValue": "active"
          }
        ],
        "tableConfig": {
          "columns": [
            {
              "field": "id",
              "title": "用户ID",
              "dataType": "STRING"
            },
            {
              "field": "name",
              "title": "用户名",
              "dataType": "STRING"
            }
          ]
        }
      },
      "createdAt": "2023-01-15T08:30:00.000Z",
      "updatedAt": "2023-01-15T08:30:00.000Z"
    }
  ]
}
```

##### 创建集成

```
POST /api/low-code/apis
```

创建新的系统集成。

**请求头:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体:**
```json
{
  "name": "订单统计API",
  "description": "获取每日订单统计数据",
  "type": "CHART",
  "queryId": "123e4567-e89b-12d3-a456-426614174001",
  "config": {
    "params": [
      {
        "name": "startDate",
        "type": "DATE",
        "required": true
      },
      {
        "name": "endDate",
        "type": "DATE",
        "required": true,
        "defaultValue": "2023-12-31"
      }
    ],
    "chartConfig": {
      "type": "LINE",
      "xField": "date",
      "yField": "amount",
      "seriesField": "category"
    }
  }
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "订单统计API",
    "description": "获取每日订单统计数据",
    "type": "CHART",
    "status": "DRAFT",
    "queryId": "123e4567-e89b-12d3-a456-426614174001",
    "config": {
      "params": [
        {
          "name": "startDate",
          "type": "DATE",
          "required": true
        },
        {
          "name": "endDate",
          "type": "DATE",
          "required": true,
          "defaultValue": "2023-12-31"
        }
      ],
      "chartConfig": {
        "type": "LINE",
        "xField": "date",
        "yField": "amount",
        "seriesField": "category"
      }
    },
    "createdAt": "2023-01-16T10:45:00.000Z",
    "updatedAt": "2023-01-16T10:45:00.000Z"
  }
}
```

##### 更新集成

```
PUT /api/low-code/apis/:id
```

更新已有的系统集成。

**请求参数:**
- `id`: 集成ID (路径参数)

**请求头:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体:**
```json
{
  "name": "订单统计API (已更新)",
  "description": "获取每日和每月订单统计数据",
  "config": {
    "params": [
      {
        "name": "startDate",
        "type": "DATE",
        "required": true
      },
      {
        "name": "endDate",
        "type": "DATE",
        "required": true
      },
      {
        "name": "groupBy",
        "type": "STRING",
        "required": false,
        "defaultValue": "day",
        "options": ["day", "month", "year"]
      }
    ]
  }
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "订单统计API (已更新)",
    "description": "获取每日和每月订单统计数据",
    "type": "CHART",
    "status": "DRAFT",
    "queryId": "123e4567-e89b-12d3-a456-426614174001",
    "config": {
      "params": [
        {
          "name": "startDate",
          "type": "DATE",
          "required": true
        },
        {
          "name": "endDate",
          "type": "DATE",
          "required": true
        },
        {
          "name": "groupBy",
          "type": "STRING",
          "required": false,
          "defaultValue": "day",
          "options": ["day", "month", "year"]
        }
      ],
      "chartConfig": {
        "type": "LINE",
        "xField": "date",
        "yField": "amount",
        "seriesField": "category"
      }
    },
    "updatedAt": "2023-01-17T09:20:00.000Z"
  }
}
```

##### 删除集成

```
DELETE /api/low-code/apis/:id
```

删除系统集成。

**请求参数:**
- `id`: 集成ID (路径参数)

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "success": true,
  "message": "集成已成功删除"
}
```

##### 获取集成配置

```
GET /api/low-code/apis/:id/config
```

获取集成的API配置信息，包括接口路径、参数和示例。

**请求参数:**
- `id`: 集成ID (路径参数)

**请求头:**
```
Authorization: Bearer {token}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "apiEndpoint": "/api/data-service/query",
    "method": "POST",
    "contentType": "application/json",
    "params": {
      "integrationId": "550e8400-e29b-41d4-a716-446655440001",
      "params": {
        "startDate": "2023-01-01",
        "endDate": "2023-12-31",
        "groupBy": "month"
      }
    },
    "exampleCode": {
      "curl": "curl -X POST -H \"Content-Type: application/json\" -d '{\"integrationId\":\"550e8400-e29b-41d4-a716-446655440001\",\"params\":{\"startDate\":\"2023-01-01\",\"endDate\":\"2023-12-31\",\"groupBy\":\"month\"}}' http://api.example.com/api/data-service/query",
      "javascript": "fetch('/api/data-service/query', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    integrationId: '550e8400-e29b-41d4-a716-446655440001',\n    params: {\n      startDate: '2023-01-01',\n      endDate: '2023-12-31',\n      groupBy: 'month'\n    }\n  })\n})\n.then(response => response.json())\n.then(data => console.log(data));"
    }
  }
}
```

##### 测试集成

```
POST /api/low-code/apis/:id/test
```

使用测试参数执行集成，用于验证集成配置是否正确。

**请求参数:**
- `id`: 集成ID (路径参数)

**请求头:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体:**
```json
{
  "params": {
    "startDate": "2023-01-01",
    "endDate": "2023-01-31",
    "groupBy": "day"
  }
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "date": "2023-01-01",
        "amount": 12500,
        "category": "online"
      },
      {
        "date": "2023-01-01",
        "amount": 8700,
        "category": "store"
      },
      {
        "date": "2023-01-02",
        "amount": 14300,
        "category": "online"
      },
      {
        "date": "2023-01-02",
        "amount": 9200,
        "category": "store"
      }
    ],
    "metadata": {
      "totalRows": 62,
      "executionTime": "0.25 seconds",
      "message": "查询执行成功"
    }
  }
}
```

##### 执行集成查询

```
POST /api/data-service/query
```

执行集成查询，获取数据结果。此接口可以公开给外部系统调用，无需认证。

**请求头:**
```
Content-Type: application/json
```

**请求体:**
```json
{
  "integrationId": "550e8400-e29b-41d4-a716-446655440001",
  "params": {
    "startDate": "2023-01-01",
    "endDate": "2023-03-31",
    "groupBy": "month"
  },
  "pagination": {
    "page": 1,
    "pageSize": 20
  },
  "sorting": {
    "field": "amount",
    "order": "desc"
  }
}
```

**响应示例:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "date": "2023-03-01",
        "amount": 520000,
        "category": "online"
      },
      {
        "date": "2023-02-01",
        "amount": 495000,
        "category": "online"
      },
      {
        "date": "2023-01-01",
        "amount": 470000,
        "category": "online"
      },
      {
        "date": "2023-03-01",
        "amount": 380000,
        "category": "store"
      },
      {
        "date": "2023-02-01",
        "amount": 365000,
        "category": "store"
      },
      {
        "date": "2023-01-01",
        "amount": 350000,
        "category": "store"
      }
    ],
    "pagination": {
      "total": 6,
      "page": 1,
      "pageSize": 20,
      "totalPages": 1
    }
  }
}
```

## 功能特点

- **数据源管理**：创建、编辑和管理多种类型的数据库连接
- **SQL查询**：执行SQL查询并以表格形式查看结果
- **查询历史**：自动保存查询历史记录
- **元数据浏览**：浏览数据库表结构、关系和字段信息
- **查询保存**：保存常用查询以便快速访问
- **查询版本控制**：全面的查询版本管理，支持版本比较、标记和状态管理
- **版本工作流**：支持草稿、审核、批准、发布的完整工作流
- **统一消息通知**：使用全局消息服务提供一致的操作反馈体验
- **精简的用户界面**：优化SQL编辑器和查询列表操作，提升用户体验
- **数据可视化**：将查询结果转换为直观的图表（待实现）
- **查询执行计划**：分析和可视化SQL查询执行计划，提供性能优化建议
- **错误处理**：统一的错误处理机制，提供友好的错误信息
- **数据源监控**：定期自动检查数据源连接状态，确保状态显示的准确性

## SQL编辑器优化

SQL编辑器是DataScope平台的核心组件，经过优化提供以下用户体验改进：

- **简化的用户界面**：整合操作按钮到顶部工具栏，减少视觉干扰
- **突出主要功能**：将执行和保存按钮设置为最明显的操作，提高易用性
- **智能时间显示**：最后保存时间采用相对时间格式（如"几分钟前"），增强用户体验
- **版本管理优化**：将版本状态和操作集成到顶部区域，简化版本信息显示
- **状态指示器**：通过颜色和图标直观显示查询和版本状态
- **键盘快捷键**：支持常用操作的键盘快捷键，提高效率
- **实时反馈**：操作结果通过统一的消息通知机制即时反馈

## 查询版本控制和状态管理

版本控制和状态管理是DataScope的核心功能，提供以下能力：

- **版本历史**：记录查询的所有历史版本，包括变更时间、作者和变更内容
- **版本比较**：直观比较不同版本之间的SQL差异、参数变化和元数据变更
- **版本标记**：为重要版本添加标签和注释，便于后续查找和管理
- **状态管理**：支持查询版本的完整生命周期管理
  - 草稿（Draft）：初始创建或修改的版本
  - 审核中（Review）：已提交等待审核的版本
  - 已批准（Approved）：通过审核的版本
  - 已发布（Published）：正式发布到生产环境的版本
  - 已弃用（Deprecated）：不再推荐使用的版本
  - 已归档（Archived）：已归档不可修改的版本
- **历史记录**：完整记录状态变更历史，包括操作人、时间和备注
- **权限控制**：基于角色的细粒度操作权限控制

### 版本控制组件

系统提供以下版本控制相关组件：

- **VersionCompare**：版本比较组件，支持SQL差异、元数据和参数比较
- **VersionHistory**：版本历史列表，展示所有历史版本及其详细信息
- **VersionTagging**：版本标记组件，支持添加、编辑和删除标签
- **VersionStatusManager**：版本状态管理组件，支持状态转换和历史查看
- **StatusHelpTips**：状态管理帮助提示组件，提供状态工作流的详细说明和使用指南
- **CreateVersionDialog**：版本创建对话框，支持版本信息编辑和参数配置
- **QueryDetailView**：查询详情页，集成版本控制和状态管理功能
- **QueryListView**：查询版本列表页，提供版本筛选、搜索和管理功能

#### 版本状态流转图
版本状态管理支持以下流转路径：

- **草稿** → **审核中**：提交查询到审核流程
- **审核中** → **已批准**：批准通过此查询（需要审核权限）
- **审核中** → **草稿**：退回查询到草稿状态进行修改
- **已批准** → **已发布**：将批准的查询发布到生产环境
- **已批准** → **草稿**：退回已批准的查询到草稿状态
- **已发布** → **已弃用**：将此查询标记为已弃用
- **已弃用** → **已发布**：重新激活已弃用的查询
- **已弃用** → **已归档**：将此查询归档（不可恢复）

### 使用方法

#### 创建新版本

基于现有查询创建新版本：

1. 在查询详情页点击"创建新版本"按钮
2. 填写版本名称、说明和变更记录
3. 修改SQL语句和参数配置
4. 提交创建新版本

#### 比较版本

比较两个版本之间的差异：

1. 在版本历史列表中选择两个要比较的版本
2. 点击"比较版本"按钮
3. 在比较界面查看SQL差异、元数据变更和参数变化

#### 管理版本状态

变更版本状态：

1. 在查询详情页打开"状态管理"面板
2. 选择目标状态（如从"草稿"提交到"审核中"）
3. 添加状态变更说明（可选）
4. 确认状态变更

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

## 功能说明

### 查询管理
DataScope提供了强大的SQL查询编辑和执行功能，支持多种数据源的连接和查询。

### 查询版本管理
- 支持查询版本的创建、发布和废弃
- 在查询详情页中通过"版本"标签页查看所有历史版本
- 可以将已发布的版本设置为活跃版本
- 支持版本状态管理：草稿、已发布、已废弃
- 在查询列表中显示当前使用的版本号
- 编辑查询时自动回显当前活跃版本的内容
- 当版本为草稿状态时，才可编辑并创建新版本

### 收藏功能
用户可以收藏常用查询，方便快速访问。

### 历史记录
系统会记录查询的执行历史，便于追踪和复用。

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

## 系统集成API功能

DataScope-Node现在支持系统集成API功能，允许将查询作为数据服务对外提供。

### 主要功能

- **低代码API集成**: 将查询转化为可重用的API端点
- **多种集成类型**: 支持表格、表单和图表三种集成类型
- **参数配置**: 支持动态参数传递和验证
- **权限控制**: 基于API密钥的访问控制
- **测试与调试**: 内置测试工具和调试功能

### API端点

- `GET /api/low-code/apis` - 获取所有集成配置
- `GET /api/low-code/apis/:id` - 获取指定集成配置
- `POST /api/low-code/apis` - 创建新的集成配置
- `PUT /api/low-code/apis/:id` - 更新集成配置
- `DELETE /api/low-code/apis/:id` - 删除集成配置
- `GET /api/low-code/apis/:id/config` - 获取集成API配置
- `POST /api/low-code/apis/:id/test` - 测试集成配置
- `POST /api/data-service/query` - 执行集成查询

### 使用方法

1. 在集成管理页面创建新的集成配置
2. 选择要转化为API的查询
3. 配置参数、输出字段和权限
4. 发布集成
5. 使用生成的API文档集成到外部系统

### 可视化
支持查询结果的可视化展示，包括图表等多种形式。
