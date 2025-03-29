# DataScope-Node

数据库连接和查询可视化工具，支持多种数据库的连接、查询和元数据管理。

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
- **优化建议**：根据执行计划提供针对性的优化建议
- **计划比较**：支持比较两个查询执行计划的差异，帮助评估优化效果
- **历史记录**：保存执行计划历史，便于分析查询性能变化趋势

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

## 快速开始

### 安装依赖

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
- 支持MySQL、PostgreSQL、Oracle等多种数据库类型

### 查询执行
- 支持SQL查询语句执行
- 支持查询结果导出 (CSV, JSON)
- 提供查询历史记录

### 查询执行计划分析
- 支持获取和分析SQL查询的执行计划
- 提供性能瓶颈识别和优化建议
- 支持执行计划可视化展示
- 可比较不同查询执行计划的性能差异
- 自动生成优化后的SQL查询建议

### 元数据管理
- 自动同步数据库表结构
- 支持浏览表、列、索引等信息
- 显示表关系和依赖关系
