# DataScope-Node 变更日志

## [未发布]

### 更改

- 保留了前端集成组件中的模拟数据功能，确保前端开发体验
- 删除了所有与后端 `USE_MOCK_DATA` 环境变量相关的代码
- 移除了后端模拟数据层和 `mocks` 目录
- 删除了webService配置中的 `mockDataPath` 配置项

### 架构变更

- 所有API接口现在直接与真实数据库交互
- 前端仍保留其独立的模拟API功能

### 改进

- 简化了代码库，消除了多余的条件判断
- 增强了代码一致性和可维护性
- 明确了后端和前端的职责边界
- 添加了针对服务和控制器的单元测试
  - 为 `query.service.ts` 添加了完整测试
  - 为 `metadata.controller.ts` 添加了测试
  - 添加了配置文件测试，确保移除了模拟数据相关配置

### 修复

- 修复了TypeScript编译错误
  - 修复了metadata.controller.ts中重复定义的previewTableData方法（重命名为getTablePreviewInternal）
  - 修正了query-plan.routes.ts中的方法绑定问题
  - 更新了query.routes.ts中的类型定义和方法引用
  - 确保所有被移除的模拟数据引用都被妥善处理
- 修复了单元测试错误
  - 恢复了误删的JavaScript版本控制器测试文件
  - 修复了query-plan.controller.test.js中的期望状态码问题
  - 修复了demonstrateValidationError方法中的错误响应格式
  - 确保所有控制器测试用例使用正确的错误处理方式

## [1.0.1] - 2023-07-07

### 架构变更

- 移除后端模拟数据模式，确保所有API直接使用数据库
  - 删除了所有与USE_MOCK_DATA环境变量相关的代码
  - 删除了mock数据层和mocks目录
  - 前端仍然有独立的模拟API功能，不受影响
- 修复TypeScript编译错误
  - 修复了QueryResult接口不兼容的问题
  - 修复了DatabaseConnector接口方法使用错误
  - 重构了metadata.controller.ts中的表预览功能

## [Unreleased]

### Fixes
- 修复数据源状态显示不正确的问题，增加了手动触发检查数据源状态的API接口（`POST /api/datasource/:id/check-status`）
- 修复数据源同步时间显示"never synced"的问题，确保同步后正确更新lastSyncTime
- 改进数据源密码解密逻辑，增加对明文密码存储的支持（开发环境），解决连接解密失败问题
- 修复数据源连接测试API (`POST /api/datasources/:id/test`) 解密失败的问题
- 修复表数据预览API路由缺失问题，增加了表数据预览功能

### Added
- 添加查询计划控制器(QueryPlanController)的单元测试
- 添加查询控制器(QueryController)的单元测试
- 新增数据源统计信息API接口 `/api/metadata/datasources/{dataSourceId}/stats` 和 `/api/metadata/{dataSourceId}/stats`，提供表数量、视图数量、数据库大小和最后同步时间等统计数据
- 为数据库连接器添加 `getDatabaseSize()` 方法，支持MySQL和PostgreSQL数据库大小的获取
- 添加DataSourceMonitorService服务，用于定期检查所有数据源的连接状态
- 添加手动触发数据源状态检查的API接口 `/api/datasources/{id}/check-status`
- 改进元数据同步服务，确保同步后正确更新lastSyncTime字段
- 添加四个MySQL示例数据源（本地开发、测试环境、生产环境和业务系统），支持开发和测试场景
- 为所有示例数据源配置了正确的连接信息和同步状态

### Fixed
- 修复API文档无法访问的问题，集成Swagger UI到Express应用中，现在可以通过 `/api-docs` 访问API文档

### Changed

### Deprecated

### Removed

### Security

## [1.0.3] - 2025-03-30

### 修复

- 修复了数据源密码加密/解密不一致问题
- 添加了密码迁移脚本，可将旧的哈希加密密码转换为AES加密
- 修复了更新数据源API错误
- 修复了查询执行API无法解密密码的问题

### 新功能
- 添加了API状态监控报告
- 添加了自动化测试改进

## [1.0.2] - 2025-03-28

## 更新日志

### 1.0.8 (2023-03-31)

#### 新增特性
- **元数据API**: 实现元数据管理API，统一了数据源元数据获取接口
  - 新增 `/api/metadata/datasources/:dataSourceId/tables` 接口获取数据源表列表
  - 新增 `/api/metadata/datasources/:dataSourceId/tables/:tableName/columns` 接口获取表列信息
  - 新增 `/api/metadata/datasources/:dataSourceId/structure` 接口获取数据源结构
  - 新增 `/api/metadata/datasources/:dataSourceId/sync` 接口同步元数据
  - 新增 `/api/metadata/datasources/:dataSourceId/stats` 接口获取数据源统计信息
- **数据库连接**: 优化数据库连接器，支持MySQL和PostgreSQL连接测试
  - 修复了数据库连接测试API中连接参数不一致的问题
  - 实现了更健壮的数据库连接和错误处理机制

#### 优化
- 统一了API路径前缀，遵循 `/api/metadata` 格式
- 改进了返回的错误信息格式和内容
- 优化了数据库连接的性能和资源利用

#### 修复
- 修复了数据库连接测试时主机名映射问题

### 1.0.7 (2023-03-30)

#### 新增特性
- **查询收藏**: 实现查询收藏功能，包括查看、添加和删除收藏
  - 新增 `/api/queries/favorites` 接口获取用户收藏查询
  - 新增 `/api/queries/:queryId/favorite` 接口添加查询到收藏
  - 新增 `/api/queries/:queryId/unfavorite` 接口从收藏中移除查询

#### 优化
- 增加了前端集成文档和API使用示例

### 1.0.5 (2023-03-27)

#### 新增特性
- **连接测试**: 修复并优化数据源连接测试功能
- **元数据API**: 初步实现元数据管理API

#### 优化
- 统一了API参数命名和规范
- 改进了错误处理和日志记录

### 新增功能 
- 添加数据源在线状态监控功能
- 增加表数据预览功能
- 添加新的API端点用于数据源状态检查

### 改进
- 优化密码解密逻辑，支持明文存储方式
- 改进了数据源连接测试功能
- 前端显示数据源状态信息

### 修复
- 修复了密码解密问题，支持明文存储密码
- 修复数据源状态显示不正确的问题
- 修复MySQL连接权限问题，添加了对远程连接的支持
- 修复前端无法获取数据源列表的问题
- 修复API路由匹配问题，支持前端表数据查询请求格式

### 安全性
- 改进了密码存储方式，支持明文模式（仅用于开发环境）

## [1.0.0] - 2023-06-01

### 新增功能
- 实现基础数据源管理功能
- 添加元数据浏览功能
- 支持MySQL和PostgreSQL连接