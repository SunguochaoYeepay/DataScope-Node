# 查询服务模块版本控制与状态管理设计

## 1. 问题背景

通过系统日志分析，当前查询服务模块存在以下关键设计缺陷：

1. 缺乏版本控制机制，无法追踪变更历史
2. 没有查询服务状态管理，无法紧急禁用问题查询
3. 查询历史管理不合理，允许清空和删除记录
4. 用户与权限管理薄弱，使用anonymous用户
5. 缺乏审计与追溯能力，无法监控使用情况

## 2. 数据模型设计

### 2.1 查询服务主表(queries)增强

```sql
ALTER TABLE queries ADD COLUMN status ENUM('ENABLED', 'DISABLED') NOT NULL DEFAULT 'ENABLED';
ALTER TABLE queries ADD COLUMN current_version_id VARCHAR(36) NULL;
ALTER TABLE queries ADD COLUMN versions_count INT NOT NULL DEFAULT 0;
ALTER TABLE queries ADD COLUMN created_by VARCHAR(36) NOT NULL;
ALTER TABLE queries ADD COLUMN created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE queries ADD COLUMN updated_by VARCHAR(36) NOT NULL;
ALTER TABLE queries ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;
ALTER TABLE queries ADD COLUMN disabled_reason TEXT NULL;
ALTER TABLE queries ADD COLUMN disabled_by VARCHAR(36) NULL;
ALTER TABLE queries ADD COLUMN disabled_at TIMESTAMP NULL;
```

### 2.2 查询版本表(query_versions)新增

```sql
CREATE TABLE query_versions (
  id VARCHAR(36) PRIMARY KEY,
  query_id VARCHAR(36) NOT NULL,
  version_number INT NOT NULL,
  version_status ENUM('DRAFT', 'PUBLISHED', 'DEPRECATED') NOT NULL DEFAULT 'DRAFT',
  version_name VARCHAR(100) NULL,
  sql_content TEXT NOT NULL,
  data_source_id VARCHAR(36) NOT NULL,
  parameters JSON NULL,
  description TEXT NULL,
  created_by VARCHAR(36) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  published_by VARCHAR(36) NULL,
  published_at TIMESTAMP NULL,
  deprecated_by VARCHAR(36) NULL,
  deprecated_at TIMESTAMP NULL,
  FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE CASCADE,
  FOREIGN KEY (data_source_id) REFERENCES datasources(id)
);
```

### 2.3 查询历史表(query_history)优化

```sql
ALTER TABLE query_history ADD COLUMN query_id VARCHAR(36) NULL;
ALTER TABLE query_history ADD COLUMN version_id VARCHAR(36) NULL;
ALTER TABLE query_history ADD COLUMN version_number INT NULL;
ALTER TABLE query_history ADD COLUMN execution_time_ms INT NULL;
ALTER TABLE query_history ADD COLUMN row_count INT NULL;
ALTER TABLE query_history ADD COLUMN parameters JSON NULL;
```

### 2.4 查询服务审计日志表(query_audit_logs)新增

```sql
CREATE TABLE query_audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  query_id VARCHAR(36) NOT NULL,
  version_id VARCHAR(36) NULL,
  action ENUM('CREATE', 'UPDATE', 'PUBLISH', 'DEPRECATE', 'ENABLE', 'DISABLE', 'EXECUTE') NOT NULL,
  action_details JSON NULL,
  performed_by VARCHAR(36) NOT NULL,
  performed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (query_id) REFERENCES queries(id)
);
```

## 3. API接口设计

### 3.1 查询服务管理

- `POST /api/queries` - 创建查询服务(DRAFT状态)
- `GET /api/queries` - 获取查询服务列表(支持分页、过滤)
- `GET /api/queries/:id` - 获取查询服务详情(含版本列表)
- `PUT /api/queries/:id` - 更新查询服务基本信息
- `DELETE /api/queries/:id` - 删除查询服务(仅允许管理员)

### 3.2 版本管理

- `POST /api/queries/:id/versions` - 创建新草稿版本
- `GET /api/queries/:id/versions` - 获取版本列表
- `GET /api/queries/:id/versions/:versionId` - 获取版本详情
- `PUT /api/queries/:id/versions/:versionId` - 更新草稿版本
- `POST /api/queries/:id/versions/:versionId/publish` - 发布版本
- `POST /api/queries/:id/versions/:versionId/deprecate` - 废弃版本
- `POST /api/queries/:id/versions/:versionId/activate` - 设置为当前活跃版本

### 3.3 状态管理

- `POST /api/queries/:id/disable` - 禁用查询服务
- `POST /api/queries/:id/enable` - 启用查询服务
- `GET /api/queries/:id/status` - 获取查询服务状态

### 3.4 查询执行

- `POST /api/queries/:id/execute` - 执行当前活跃版本
- `POST /api/queries/:id/versions/:versionId/execute` - 执行指定版本

### 3.5 查询历史

- `GET /api/queries/:id/history` - 获取查询服务执行历史
- `GET /api/queries/history` - 获取全局查询历史(移除清空和删除接口)

### 3.6 审计日志

- `GET /api/queries/:id/audit-logs` - 获取查询服务审计日志
- `GET /api/queries/audit-logs` - 获取全局审计日志(管理员)

## 4. 工作流设计

### 4.1 创建与发布流程

1. 创建查询服务
   - 新建查询默认为DRAFT状态v1版本
   - 填写查询名称、描述、选择数据源
   - 编写SQL并保存草稿

2. 发布流程
   - 测试查询可正常执行
   - 发布草稿(DRAFT → PUBLISHED)
   - 系统自动将其设为当前活跃版本

### 4.2 编辑流程

1. 编辑已发布查询
   - 创建新草稿版本(自动递增版本号)
   - 修改SQL内容并保存
   - 测试后发布新版本

2. 版本切换
   - 查看历史版本列表
   - 将任意PUBLISHED版本设为当前活跃版本

### 4.3 禁用流程

1. 紧急禁用
   - 管理员禁用查询服务(所有版本)
   - 输入禁用原因
   - 系统记录禁用者和时间

2. 重新启用
   - 修复问题后重新启用
   - 系统记录启用者和时间

## 5. 权限与安全设计

### 5.1 用户角色

- 管理员(Admin): 全部权限
- 开发者(Developer): 创建、编辑、发布查询
- 分析师(Analyst): 执行查询、查看历史
- 访客(Guest): 只读权限

### 5.2 权限矩阵

| 操作 | 管理员 | 开发者 | 分析师 | 访客 |
|------|--------|--------|--------|------|
| 创建查询 | ✓ | ✓ | ✗ | ✗ |
| 编辑查询 | ✓ | ✓ | ✗ | ✗ |
| 发布版本 | ✓ | ✓ | ✗ | ✗ |
| 执行查询 | ✓ | ✓ | ✓ | ✗ |
| 禁用查询 | ✓ | ✗ | ✗ | ✗ |
| 删除查询 | ✓ | ✗ | ✗ | ✗ |
| 查看历史 | ✓ | ✓ | ✓ | ✓ |
| 查看审计 | ✓ | ✗ | ✗ | ✗ |

### 5.3 安全控制

- 敏感操作需二次确认
- 查询SQL自动检查危险操作(如DROP)
- 数据源权限检查
- 参数化查询预防SQL注入

## 6. 前端界面设计

### 6.1 查询服务列表页

- 查询服务状态标识(启用/禁用)
- 当前活跃版本号
- 版本总数统计
- 最近执行时间
- 创建人与创建时间

### 6.2 查询服务详情页

- 服务基本信息区
  - 名称、描述、数据源
  - 状态开关(启用/禁用)
  - 禁用原因(如有)

- 版本管理区
  - 版本列表(含状态、创建人、发布时间)
  - 当前活跃版本标识
  - 版本切换按钮

- 查询编辑区
  - 显示当前版本状态
  - SQL编辑器
  - 参数化查询表单
  - 保存草稿/发布按钮

- 执行结果区
  - 执行状态与时间
  - 结果数据表格
  - 执行耗时统计
  - 导出结果功能

- 查询历史区
  - 该查询服务的执行历史
  - 执行者、执行时间、耗时
  - 执行参数记录

- 审计日志区(管理员)
  - 查询服务变更记录
  - 版本发布/废弃记录
  - 状态变更记录

## 7. 监控与告警

### 7.1 性能监控

- 查询执行时间监控
- 结果行数统计
- 资源使用情况跟踪

### 7.2 异常检测

- 长时间运行查询告警
- 大结果集告警
- 失败查询分析

### 7.3 使用统计

- 查询执行频率统计
- 各查询服务使用热度
- 用户活跃度统计

## 8. 实施计划

### 8.1 数据迁移

1. 为现有查询创建v1版本
2. 设置为PUBLISHED状态
3. 建立查询与历史记录间关联

### 8.2 开发阶段

1. 数据库结构升级
2. 后端API实现
3. 前端界面改造

### 8.3 测试与验证

1. 功能测试
2. 性能测试
3. 安全测试

### 8.4 发布策略

1. 数据库变更
2. 后端服务升级
3. 前端应用部署

## 9. 风险评估

1. 数据迁移风险
   - 现有查询服务无法自动关联到历史记录
   - 缓解措施: 预先备份历史数据

2. 用户适应风险
   - 用户需适应新的版本管理流程
   - 缓解措施: 提供详细使用文档和培训

3. 性能影响
   - 版本控制可能增加系统负担
   - 缓解措施: 合理设计数据库索引和缓存