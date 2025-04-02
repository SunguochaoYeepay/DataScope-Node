# DataScope-Node

数据分析与可视化平台后端服务

## 功能特点

- **数据源管理**：创建、编辑和管理多种类型的数据库连接
- **SQL查询**：执行SQL查询并以表格形式查看结果
- **查询历史**：自动保存查询历史记录
- **元数据浏览**：浏览数据库表结构、关系和字段信息
- **查询保存**：保存常用查询以便快速访问
- **查询版本控制**：全面的查询版本管理，支持版本比较、标记和状态管理
- **版本工作流**：支持草稿、审核、批准、发布的完整工作流
- **数据可视化**：将查询结果转换为直观的图表（待实现）
- **查询执行计划**：分析和可视化SQL查询执行计划，提供性能优化建议
- **错误处理**：统一的错误处理机制，提供友好的错误信息
- **数据源监控**：定期自动检查数据源连接状态，确保状态显示的准确性

## 查询版本控制和状态管理

版本控制和状态管理是DataScope的核心功能，提供以下能力：

- **版本历史**：记录查询的所有历史版本，包括变更时间、作者和变更内容
- **版本比较**：直观比较不同版本之间的SQL差异、参数变化和元数据变更
- **版本标记**：为重要版本添加标签和注释，便于后续查找和管理
- **状态管理**：支持查询版本的完整生命周期管理
  - 草稿（Draft）：初始创建或修改的版本
  - 审核中（Review）：已提交等待审核的版本
  - 已批准（Approved）：通过审核的版本
  - 已发布（Published）：正式发布到生产环境的版本
  - 已弃用（Deprecated）：不再推荐使用的版本
  - 已归档（Archived）：已归档不可修改的版本
- **历史记录**：完整记录状态变更历史，包括操作人、时间和备注
- **权限控制**：基于角色的细粒度操作权限控制

### 版本控制组件

系统提供以下版本控制相关组件：

- **VersionCompare**：版本比较组件，支持SQL差异、元数据和参数比较
- **VersionHistory**：版本历史列表，展示所有历史版本及其详细信息
- **VersionTagging**：版本标记组件，支持添加、编辑和删除标签
- **VersionStatusManager**：版本状态管理组件，支持状态转换和历史查看
- **StatusHelpTips**：状态管理帮助提示组件，提供状态工作流的详细说明和使用指南
- **CreateVersionDialog**：版本创建对话框，支持版本信息编辑和参数配置
- **QueryDetailView**：查询详情页，集成版本控制和状态管理功能
- **QueryListView**：查询版本列表页，提供版本筛选、搜索和管理功能

#### 版本状态流转图
版本状态管理支持以下流转路径：

- **草稿** → **审核中**：提交查询到审核流程
- **审核中** → **已批准**：批准通过此查询（需要审核权限）
- **审核中** → **草稿**：退回查询到草稿状态进行修改
- **已批准** → **已发布**：将批准的查询发布到生产环境
- **已批准** → **草稿**：退回已批准的查询到草稿状态
- **已发布** → **已弃用**：将此查询标记为已弃用
- **已弃用** → **已发布**：重新激活已弃用的查询
- **已弃用** → **已归档**：将此查询归档（不可恢复）

### 使用方法

#### 创建新版本

基于现有查询创建新版本：

1. 在查询详情页点击"创建新版本"按钮
2. 填写版本名称、说明和变更记录
3. 修改SQL语句和参数配置
4. 提交创建新版本

#### 比较版本

比较两个版本之间的差异：

1. 在版本历史列表中选择两个要比较的版本
2. 点击"比较版本"按钮
3. 在比较界面查看SQL差异、元数据变更和参数变化

#### 管理版本状态

变更版本状态：

1. 在查询详情页打开"状态管理"面板
2. 选择目标状态（如从"草稿"提交到"审核中"）
3. 添加状态变更说明（可选）
4. 确认状态变更

## 查询执行计划功能

查询执行计划分析是DataScope的核心功能之一，它提供了以下能力：

- **获取执行计划**：支持获取MySQL、PostgreSQL等各种数据库的查询执行计划
- **执行计划可视化**：将复杂的执行计划转换为直观的可视化图表
- **性能瓶颈识别**：自动识别查询中的性能瓶颈，如全表扫描、索引使用不当等
- **优化建议**：根据执行计划提供针对性的优化建议，支持单独获取优化建议列表
- **计划比较**：支持比较两个查询执行计划的差异，帮助评估优化效果
- **历史记录**：保存执行计划历史，便于分析查询性能变化趋势
- **安全处理**：对节点数据进行可靠的安全检查，确保系统的稳定性与可靠性
- **索引推荐**：基于查询分析结果提供索引优化建议，包括针对列基数的不同优化策略

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

### 测试体系

- 完整的测试架构，包括单元测试和集成测试
- 使用Jest测试框架进行自动化测试
- 所有核心控制器已完成测试用例并全部通过：
  - datasource.controller.test.js (17个测试通过)
  - query.controller.test.js (16个测试通过)
  - query-plan.controller.test.js (10个测试通过)
- 使用Docker容器创建隔离的测试数据库环境
- 测试中使用mock对象替代真实依赖，确保单元测试的隔离性和可靠性
- 支持测试覆盖率分析，确保代码质量