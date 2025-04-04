# Changelog

## [Unreleased]

### Added
- 项目基础结构
- 首页模块（HomePage）
- 布局组件（Layout）
- 开发计划文档
- 查询版本管理页面
- 查询详情页面
- 查询编辑器组件增强
- 查询历史组件优化
- 查询服务列表页面
- 查询服务列表页面增加删除和启用/禁用功能
- 查询编辑器交互优化：分离执行与保存按钮、未保存更改提示、离开页面确认机制
- 全局消息通知组件：统一右上角显示操作结果，支持成功、错误、警告等不同类型的消息提示

### Changed
- 更新了项目配置文件，优化了构建性能
- 调整了 Tailwind CSS 配置，新增自定义颜色变量
- 完善了 TypeScript 类型定义，提高了代码可维护性
- 移除查询子导航组件，简化用户界面
- 根据版本状态调整编辑器权限
- 优化查询服务列表页面样式，采用表格布局代替卡片布局，与系统集成页面风格保持一致
- 增强查询服务列表页面功能：添加可点击的查询名称、显示更丰富的信息（查询类型、结果行数等）、增加执行历史查看入口
- 统一了确认对话框设计风格，提升用户体验一致性
- 改进保存查询对话框，提供更明确的操作说明与视觉区分
- 统一操作结果展示：所有操作结果提示统一使用右上角消息通知形式展示，避免使用alert等打断用户操作流程

### Fixed
- 开发服务器启动问题
- 路由配置冲突
- 资源引用路径问题
- 完善类型定义 