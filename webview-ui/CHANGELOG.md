# 变更日志 (Changelog)

## [未发布]

### 新增
- 为数据源服务添加检查状态端点 (`/api/datasources/{id}/check-status`)
- 新增元数据同步端点 (`/api/metadata/datasources/{dataSourceId}/sync`)
- 增加数据源统计端点 (`/api/datasources/{id}/stats`)
- 添加数据源服务适配测试

### 变更
- 将数据源类型枚举从大写改为小写 (例如 'MYSQL' -> 'mysql')
- 将数据源状态类型枚举从大写改为小写 (例如 'ACTIVE' -> 'active')
- 调整数据源模型，添加isActive字段
- 更新Mock数据以符合后端API格式
- 改进API响应格式，使用统一的success/data/error结构
- 更新数据源服务适配层，兼容后端API格式

### 修复
- 修复分页响应格式不统一的问题
- 修复mock服务器中间件配置，解决API请求返回HTML而非JSON的问题
- 统一API错误处理机制，确保一致的错误响应格式
- 修复Vite代理配置，确保Mock模式下API请求能被正确处理

## [0.0.1] - 2023-06-15

### 新增
- 项目初始结构搭建
- 基础组件库实现
- 数据源管理模块
- 查询管理模块 
- 集成管理模块
- 模拟数据和接口