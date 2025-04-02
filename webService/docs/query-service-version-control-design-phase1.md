# 查询服务模块版本控制与状态管理设计 (一期)

## 1. 核心问题识别

通过系统日志分析，当前查询服务模块存在以下核心问题：

1. **版本控制缺失**：修改查询服务会直接覆盖现有实现，无法追踪变更历史
2. **状态管理缺失**：无法快速禁用有问题的查询服务
3. **查询历史管理不合理**：允许清空和删除历史记录，破坏审计链

## 2. 一期变更范围

一期重点解决版本控制和状态管理问题，具体包括：

1. **核心功能**:
   - 查询服务版本管理
   - 查询服务状态控制(启用/禁用)
   - 查询历史关联到服务和版本

2. **暂不实现**:
   - 用户角色与权限管理 (二期)
   - 完整审计日志功能 (二期)
   - 高级监控与告警 (二期)

## 3. 数据模型变更

### 3.1 查询服务主表(queries)增强

```sql
ALTER TABLE queries ADD COLUMN status ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED';
ALTER TABLE queries ADD COLUMN current_version_id VARCHAR(36) NULL;
ALTER TABLE queries ADD COLUMN versions_count INT NOT NULL DEFAULT 0;
ALTER TABLE queries ADD COLUMN disabled_reason TEXT NULL;
ALTER TABLE queries ADD COLUMN disabled_at TIMESTAMP NULL;
```

### 3.2 查询版本表(query_versions)新增

```sql
CREATE TABLE query_versions (
  id VARCHAR(36) PRIMARY KEY,
  query_id VARCHAR(36) NOT NULL,
  version_number INT NOT NULL,
  version_status ENUM('DRAFT', 'PUBLISHED', 'DEPRECATED') NOT NULL DEFAULT 'DRAFT',
  sql_content TEXT NOT NULL,
  data_source_id VARCHAR(36) NOT NULL,
  parameters JSON NULL,
  description TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP NULL,
  deprecated_at TIMESTAMP NULL,
  FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE CASCADE,
  FOREIGN KEY (data_source_id) REFERENCES datasources(id)
);
```

### 3.3 查询历史表(query_history)优化

```sql
ALTER TABLE query_history ADD COLUMN query_id VARCHAR(36) NULL;
ALTER TABLE query_history ADD COLUMN version_id VARCHAR(36) NULL;
ALTER TABLE query_history ADD COLUMN version_number INT NULL;
ALTER TABLE query_history ADD COLUMN execution_time_ms INT NULL;
ALTER TABLE query_history ADD COLUMN row_count INT NULL;
```

## 4. API接口变更

### 4.1 查询服务管理

- `POST /api/queries` - 创建查询服务(DRAFT状态)
- `GET /api/queries` - 获取查询服务列表(增加状态过滤)
- `GET /api/queries/:id` - 获取查询服务详情(增加版本列表)
- `PUT /api/queries/:id` - 更新查询服务基本信息(创建新版本)

### 4.2 版本管理

- `POST /api/queries/:id/versions` - 创建新草稿版本
- `GET /api/queries/:id/versions` - 获取版本列表
- `GET /api/queries/:id/versions/:versionId` - 获取版本详情
- `PUT /api/queries/:id/versions/:versionId` - 更新草稿版本
- `POST /api/queries/:id/versions/:versionId/publish` - 发布版本
- `POST /api/queries/:id/versions/:versionId/deprecate` - 废弃版本
- `POST /api/queries/:id/versions/:versionId/activate` - 设置为当前活跃版本

### 4.3 状态管理

- `POST /api/queries/:id/disable` - 禁用查询服务
- `POST /api/queries/:id/enable` - 启用查询服务

### 4.4 查询执行

- `POST /api/queries/:id/execute` - 执行当前活跃版本
- `POST /api/queries/:id/versions/:versionId/execute` - 执行指定版本

### 4.5 查询历史

- `GET /api/queries/:id/history` - 获取查询服务执行历史
- `GET /api/queries/history` - 获取全局查询历史(移除清空和删除接口)

## 5. 核心工作流变更

### 5.1 创建查询服务流程

1. 新建查询
   - 创建查询服务记录
   - 创建DRAFT状态v1版本
   - 保存SQL内容和数据源信息

2. 发布流程
   - 测试查询可正常执行
   - 发布草稿(DRAFT → PUBLISHED)
   - 设为当前活跃版本

### 5.2 编辑查询服务流程

1. 编辑已发布查询
   - 基于当前活跃版本创建新草稿
   - 自动递增版本号
   - 修改SQL内容

2. 发布新版本
   - 测试新版本正常执行
   - 发布新版本(DRAFT → PUBLISHED)
   - 自动设为当前活跃版本

3. 版本切换
   - 选择任意PUBLISHED版本
   - 设为当前活跃版本
   - 更新current_version_id

### 5.3 禁用查询服务流程

1. 紧急禁用
   - 将查询服务状态设为DISABLED
   - 记录禁用原因和时间
   - 所有版本均不可执行

2. 重新启用
   - 将查询服务状态设为ENABLED
   - 恢复正常执行功能

## 6. 前端界面变更

### 6.1 查询服务列表页变更

- 增加状态指示器(启用/禁用)
- 显示当前活跃版本号
- 显示最近执行时间
- 增加版本数量显示

### 6.2 查询服务详情页变更

- 服务状态区域
  - 状态开关(启用/禁用)
  - 禁用原因输入框
  - 服务基本信息

- 版本管理区域
  - 版本列表(状态、创建时间)
  - 当前活跃版本标识
  - 版本操作按钮(发布、废弃、激活)

- 查询编辑区域
  - 显示当前版本状态(草稿/已发布/已废弃)
  - SQL编辑器
  - 保存草稿/发布按钮

- 查询历史区域
  - 关联到当前查询服务的执行记录
  - 增加版本信息显示
  - 执行时间、结果行数

## 7. 风险评估与应对策略

### 7.1 兼容性风险

**风险**:
- 现有查询服务数据结构变更可能导致兼容性问题
- 现有API调用方式改变影响已集成系统

**应对策略**:
- 数据迁移脚本自动为现有查询创建v1版本并设为PUBLISHED
- 保留原有API端点但内部实现重定向到新版本API
- 添加版本兼容层处理历史调用

### 7.2 性能风险

**风险**:
- 版本控制增加数据库查询复杂度
- 可能影响查询执行速度

**应对策略**:
- 优化数据库索引设计
- 合理设计查询缓存策略
- 对版本表进行分区以提高查询效率

### 7.3 数据迁移风险

**风险**:
- 现有查询历史无法关联到具体版本
- 版本数据迁移可能不完整

**应对策略**:
- 只为新执行的查询记录版本信息
- 历史记录保持原状但关联到查询服务
- 提供管理界面手动关联历史记录

### 7.4 用户体验风险

**风险**:
- 新增版本控制增加用户操作复杂度
- 可能导致用户混淆或抵触

**应对策略**:
- 设计直观的用户界面
- 提供清晰的操作指引
- 默认自动执行最常见操作路径

## 8. 实施计划

### 8.1 数据迁移方案

1. 创建新表结构和字段
2. 为每个现有查询创建v1版本:
   ```sql
   INSERT INTO query_versions (id, query_id, version_number, version_status, sql_content, data_source_id, created_at, published_at)
   SELECT UUID(), id, 1, 'PUBLISHED', sql_content, data_source_id, created_at, created_at
   FROM queries;
   ```

3. 更新查询服务主表:
   ```sql
   UPDATE queries q
   JOIN query_versions qv ON q.id = qv.query_id
   SET q.current_version_id = qv.id, q.versions_count = 1;
   ```

### 8.2 开发计划

1. 数据库结构变更实现 (1周)
2. 后端API实现 (2周)
3. 前端界面改造 (2周)
4. 集成测试与修复 (1周)

### 8.3 回滚计划

1. 准备回滚脚本恢复数据库结构
2. 保留旧版API实现
3. 提前设置特性开关控制新功能启用

## 9. 后续规划 (二期)

1. 用户角色与权限管理
   - 基于角色的访问控制
   - 操作权限精细化管理
   - 权限审批流程

2. 完整审计日志
   - 操作审计跟踪
   - 变更历史记录
   - 审计报告生成

3. 高级监控与告警
   - 查询性能监控
   - 异常执行告警
   - 资源使用分析