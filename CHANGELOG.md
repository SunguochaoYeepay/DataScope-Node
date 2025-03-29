# DataScope-Node 变更日志

## [未发布]

### 架构变更

- 移除了后端模拟数据模式
  - 删除了所有与 `USE_MOCK_DATA` 环境变量相关的代码
  - 移除了模拟数据层和 `mocks` 目录
  - 所有API接口现在直接与真实数据库交互
  - 前端仍保留其独立的模拟API功能

### 改进

- 简化了代码库，消除了多余的条件判断
- 增强了代码一致性和可维护性
- 明确了后端和前端的职责边界

### 修复

- 修复了TypeScript编译错误
  - 修复了metadata.controller.ts中重复定义的previewTableData方法（重命名为getTablePreviewInternal）
  - 修正了query-plan.routes.ts中的方法绑定问题
  - 更新了query.routes.ts中的类型定义和方法引用
  - 确保所有被移除的模拟数据引用都被妥善处理

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

### 修复
- 添加错误演示API入口点，修复测试用例失败的问题
- 实现`/api/examples/errors`路由，修复之前404的问题
- 完善error-examples.controller.ts中的错误类型示例