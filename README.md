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
