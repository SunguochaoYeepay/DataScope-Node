# 查询服务版本控制与状态管理 - 详细任务分解

## 项目概述

实现查询服务的版本控制和状态管理功能，确保查询服务的变更可追踪、可回滚，并支持紧急禁用功能，提高系统稳定性和可靠性。

## 工作量评估

- **后端开发**：约15人天
- **前端开发**：约15人天
- **测试与联调**：约5人天
- **总计**：约35人天(7周)

## 后端开发详细任务

### 1. 数据库结构设计与实现 (3人天)

#### 1.1 查询服务主表(queries)增强
- [ ] 添加状态字段(status)，枚举类型'ENABLED'/'DISABLED'
- [ ] 添加当前版本ID字段(current_version_id)
- [ ] 添加版本数量字段(versions_count)
- [ ] 添加禁用原因字段(disabled_reason)
- [ ] 添加禁用时间字段(disabled_at)
- [ ] 创建相关索引优化查询性能

#### 1.2 查询版本表(query_versions)创建
- [ ] 设计表结构包含id、query_id、version_number等字段
- [ ] 实现版本状态枚举(DRAFT/PUBLISHED/DEPRECATED)
- [ ] 添加SQL内容、数据源ID等核心字段
- [ ] 添加时间戳字段(created_at, published_at, deprecated_at)
- [ ] 创建外键关系和必要索引

#### 1.3 查询历史表(query_history)优化
- [ ] 添加查询ID关联字段(query_id)
- [ ] 添加版本ID关联字段(version_id)
- [ ] 添加版本号字段(version_number)
- [ ] 添加执行时间统计字段(execution_time_ms)
- [ ] 添加结果行数字段(row_count)

#### 1.4 数据迁移脚本开发
- [ ] 编写现有查询迁移到版本化模型脚本
- [ ] 创建默认v1版本并设置为PUBLISHED状态
- [ ] 更新查询服务主表current_version_id字段
- [ ] 为现有历史记录关联查询服务ID(可选)
- [ ] 测试数据迁移脚本并验证结果

### 2. 服务层实现 (5人天)

#### 2.1 查询版本服务(QueryVersionService)
- [ ] 实现createVersion(queryId, content, datasourceId)方法
- [ ] 实现updateDraftVersion(versionId, content)方法
- [ ] 实现publishVersion(versionId)方法
- [ ] 实现deprecateVersion(versionId)方法
- [ ] 实现activateVersion(versionId)方法
- [ ] 实现getVersions(queryId)方法
- [ ] 实现getVersionById(versionId)方法
- [ ] 添加版本状态转换验证逻辑

#### 2.2 查询状态服务(QueryStatusService)
- [ ] 实现enableQuery(queryId)方法
- [ ] 实现disableQuery(queryId, reason)方法
- [ ] 实现getQueryStatus(queryId)方法
- [ ] 实现验证查询状态方法isQueryEnabled(queryId)

#### 2.3 查询执行服务优化(QueryExecutionService)
- [ ] 重构execute方法支持版本参数
- [ ] 添加执行前状态检查逻辑
- [ ] 修改历史记录创建逻辑，关联版本信息
- [ ] 增加执行性能统计逻辑
- [ ] 添加查询参数记录

#### 2.4 查询历史服务优化(QueryHistoryService)
- [ ] 重构getHistory方法支持按查询ID过滤
- [ ] 移除clearHistory方法
- [ ] 移除deleteHistory方法
- [ ] 优化历史记录数据结构包含版本信息
- [ ] 添加获取查询服务执行统计方法

### 3. API接口实现 (5人天)

#### 3.1 查询服务管理接口
- [ ] 重构POST /api/queries创建接口
- [ ] 优化GET /api/queries列表接口支持状态过滤
- [ ] 增强GET /api/queries/:id详情接口返回版本列表
- [ ] 修改PUT /api/queries/:id创建新版本而非更新

#### 3.2 版本管理接口
- [ ] 实现POST /api/queries/:id/versions创建版本接口
- [ ] 实现GET /api/queries/:id/versions版本列表接口
- [ ] 实现GET /api/queries/:id/versions/:versionId版本详情接口
- [ ] 实现PUT /api/queries/:id/versions/:versionId更新草稿接口
- [ ] 实现POST /api/queries/:id/versions/:versionId/publish发布接口
- [ ] 实现POST /api/queries/:id/versions/:versionId/deprecate废弃接口
- [ ] 实现POST /api/queries/:id/versions/:versionId/activate激活接口

#### 3.3 状态管理接口
- [ ] 实现POST /api/queries/:id/disable禁用接口
- [ ] 实现POST /api/queries/:id/enable启用接口
- [ ] 实现GET /api/queries/:id/status状态查询接口

#### 3.4 查询执行接口
- [ ] 优化POST /api/queries/:id/execute执行当前版本接口
- [ ] 实现POST /api/queries/:id/versions/:versionId/execute执行特定版本接口

#### 3.5 查询历史接口
- [ ] 实现GET /api/queries/:id/history查询服务历史接口
- [ ] 修改GET /api/queries/history移除删除功能
- [ ] 优化历史记录返回格式包含版本信息

### 4. 测试与验证 (2人天)

#### 4.1 单元测试
- [ ] 编写查询版本服务单元测试
- [ ] 编写查询状态服务单元测试
- [ ] 编写查询执行服务单元测试
- [ ] 编写查询历史服务单元测试

#### 4.2 API测试
- [ ] 编写版本管理API测试用例
- [ ] 编写状态管理API测试用例
- [ ] 编写查询执行API测试用例
- [ ] 验证查询历史API返回结果

#### 4.3 集成测试
- [ ] 验证查询服务创建到执行完整流程
- [ ] 测试版本发布和切换功能
- [ ] 测试禁用服务对执行的影响
- [ ] 验证历史记录关联和查询功能

## 前端开发详细任务

### 1. 组件设计与实现 (6人天)

#### 1.1 查询服务状态组件
- [ ] 设计并实现StatusIndicator组件显示状态标识
- [ ] 创建StatusToggle组件实现启用/禁用切换
- [ ] 实现DisableReasonForm组件收集禁用原因
- [ ] 编写状态相关组件单元测试

#### 1.2 版本管理组件
- [ ] 设计并实现VersionList组件展示版本列表
- [ ] 创建VersionBadge组件显示版本状态
- [ ] 实现VersionActions组件提供版本操作按钮
- [ ] 设计ActiveVersionIndicator组件标识当前活跃版本
- [ ] 编写版本组件单元测试

#### 1.3 查询编辑器组件优化
- [ ] 增加版本状态显示区域
- [ ] 根据版本状态调整编辑器权限(草稿可编辑/已发布只读)
- [ ] 添加保存草稿和发布按钮
- [ ] 集成版本切换功能
- [ ] 重构编辑器状态管理

#### 1.4 查询历史组件优化
- [ ] 增加版本号和状态显示
- [ ] 添加执行时间和结果行数展示
- [ ] 移除删除按钮和清空功能
- [ ] 增加按查询服务筛选功能
- [ ] 重构历史记录数据加载逻辑

### 2. 页面优化 (5人天)

#### 2.1 查询服务列表页优化
- [ ] 添加状态列显示服务启用状态
- [ ] 增加当前版本号显示
- [ ] 添加版本数量统计列
- [ ] 实现按状态筛选功能
- [ ] 优化列表页操作按钮和交互

#### 2.2 查询服务详情页重构
- [ ] 设计页面布局包含版本管理区域
- [ ] 实现服务信息区包含状态管理
- [ ] 创建版本列表区域
- [ ] 重构查询编辑区适配版本控制
- [ ] 优化查询历史区关联到当前服务
- [ ] 增加版本选择和切换UI

#### 2.3 新增版本管理页面
- [ ] 设计版本管理专用页面布局
- [ ] 实现版本列表视图包含全部版本
- [ ] 创建版本详情查看功能
- [ ] 添加版本对比功能(可选)
- [ ] 实现版本操作(发布/废弃/激活)界面

### 3. 状态管理与API集成 (2人天)

#### 3.1 查询服务状态管理
- [ ] 集成查询服务状态API
- [ ] 实现状态变更操作和确认流程
- [ ] 处理状态变更错误情况
- [ ] 优化状态展示和切换体验

#### 3.2 版本管理状态
- [ ] 集成版本列表和详情API
- [ ] 实现版本操作API调用逻辑
- [ ]
- [ ] 处理版本编辑状态和权限控制
- [ ] 优化版本切换和激活流程

#### 3.3 查询执行状态
- [ ] 集成版本执行API
- [ ] 处理执行结果和错误情况
- [ ] 优化执行状态显示和反馈
- [ ] 实现执行历史记录关联显示

### 4. 用户体验优化 (1人天)

#### 4.1 操作指引设计
- [ ] 创建版本管理操作指引信息
- [ ] 设计状态变更确认和提示文案
- [ ] 编写错误处理提示信息
- [ ] 创建首次使用引导提示

#### 4.2 交互流程优化
- [ ] 优化版本创建和发布流程
- [ ] 设计禁用确认对话框和流程
- [ ] 简化版本切换和管理操作
- [ ] 增强表单验证和错误反馈

#### 4.3 UI设计与实现
- [ ] 设计状态和版本相关图标和颜色
- [ ] 实现版本标签和状态标识样式
- [ ] 优化操作按钮和交互元素设计
- [ ] 确保整体界面一致性和可用性

### 5. 测试与验证 (1人天)

#### 5.1 组件测试
- [ ] 测试状态组件功能
- [ ] 验证版本管理组件
- [ ] 测试编辑器组件版本集成
- [ ] 验证历史组件版本显示

#### 5.2 页面集成测试
- [ ] 测试列表页状态展示和筛选
- [ ] 验证详情页版本管理功能
- [ ] 测试版本管理页面功能
- [ ] 验证页面间导航和状态保持

#### 5.3 端到端测试
- [ ] 测试完整查询创建和版本发布流程
- [ ] 验证查询禁用和启用流程
- [ ] 测试版本编辑和切换流程
- [ ] 验证历史记录关联显示

## 协作事项

### 1. 接口协议定义

#### 1.1 查询服务响应格式
```typescript
interface QueryService {
  id: string;
  name: string;
  description: string;
  status: 'ENABLED' | 'DISABLED';
  current_version_id: string;
  versions_count: number;
  disabled_reason?: string;
  disabled_at?: string;
  created_at: string;
  updated_at: string;
}
```

#### 1.2 查询版本响应格式
```typescript
interface QueryVersion {
  id: string;
  query_id: string;
  version_number: number;
  version_status: 'DRAFT' | 'PUBLISHED' | 'DEPRECATED';
  sql_content: string;
  data_source_id: string;
  parameters?: any;
  description?: string;
  created_at: string;
  published_at?: string;
  deprecated_at?: string;
}
```

#### 1.3 查询历史响应格式
```typescript
interface QueryHistory {
  id: string;
  query_id?: string;
  version_id?: string;
  version_number?: number;
  sql: string;
  data_source_id: string;
  parameters?: any;
  status: string;
  execution_time_ms?: number;
  row_count?: number;
  created_at: string;
}
```

### 2. 联调计划

#### 2.1 基础API联调(1天)
- [ ] 后端完成基础API实现
- [ ] 前端集成API并验证数据格式
- [ ] 解决数据格式和接口问题

#### 2.2 版本管理功能联调(1天)
- [ ] 后端完成版本管理API
- [ ] 前端实现版本管理UI
- [ ] 测试版本创建、发布、切换流程

#### 2.3 状态管理功能联调(1天)
- [ ] 后端完成状态管理API
- [ ] 前端实现状态管理UI
- [ ] 测试查询服务禁用和启用功能

#### 2.4 查询执行功能联调(1天)
- [ ] 后端完成查询执行API优化
- [ ] 前端集成执行功能
- [ ] 测试不同状态和版本的执行情况

#### 2.5 历史记录功能联调(1天)
- [ ] 后端完成历史记录API
- [ ] 前端实现历史记录展示
- [ ] 测试历史关联和显示功能

### 3. 上线计划

#### 3.1 测试环境部署
- [ ] 数据库结构变更脚本执行
- [ ] 后端服务部署和验证
- [ ] 前端应用部署和测试
- [ ] 系统集成测试

#### 3.2 生产环境准备
- [ ] 数据备份计划制定
- [ ] 回滚脚本准备
- [ ] 变更影响评估
- [ ] 用户通知准备

#### 3.3 分阶段上线
- [ ] 执行数据库变更
- [ ] 部署后端服务
- [ ] 部署前端应用
- [ ] 验证系统功能
- [ ] 监控系统稳定性

## 风险与应对策略

### 1. 数据迁移风险
- **风险**: 现有查询服务数据迁移不完整
- **应对**: 准备详细的数据校验和修复脚本

### 2. 性能影响风险
- **风险**: 版本控制增加查询复杂度影响性能
- **应对**: 优化数据库索引和查询，实施性能测试

### 3. 用户适应风险
- **风险**: 用户不适应新的版本管理流程
- **应对**: 提供清晰的操作指引和帮助文档

### 4. 系统兼容性风险
- **风险**: 现有集成系统不兼容新API
- **应对**: 保留兼容层，提供平滑迁移路径