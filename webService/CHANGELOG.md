# Changelog

所有项目的重要变更都将记录在此文件中。

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，
并且本项目遵循 [语义化版本](https://semver.org/spec/v2.0.0.html)。

## [Unreleased]

### 新增
- 新增统一错误处理系统，包括：
  - AppError 基类用于所有应用错误
  - ApiError 类处理 API 请求错误，支持不同 HTTP 状态码
  - DatabaseError 类处理数据库错误
  - DataSourceError 类处理数据源错误
  - ValidationError 类处理参数验证错误
  - QueryError 类处理查询执行错误
- 新增全局错误处理中间件
- 新增请求日志中间件，为每个请求生成唯一 ID 并记录请求和响应信息
- 添加错误代码系统，统一错误码定义和错误消息
- 新增错误处理单元测试

### 优化
- 优化应用启动流程，统一错误处理
- 改进日志系统，支持请求 ID 跟踪
- 标准化 API 响应格式

### 修复
- 修复健康检查 API 的单元测试适配新的错误处理机制