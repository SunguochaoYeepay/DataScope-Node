# 更新日志

## [未发布]

### 新增功能

- **系统集成API**: 实现低代码集成API功能，支持将查询作为数据服务对外提供
  - 新增 `/api/low-code/apis` 接口获取、创建、更新和删除集成配置
  - 新增 `/api/low-code/apis/:id/config` 接口获取集成API配置
  - 新增 `/api/low-code/apis/:id/test` 接口测试集成配置
  - 新增 `/api/data-service/query` 接口执行集成查询
  - 支持表格、表单和图表三种集成类型
  - 支持参数配置和自定义字段映射
  - 集成现有查询执行引擎，复用数据源连接能力
  - 提供前端集成服务层与类型定义，支持与后端API交互
- **API文档更新**: 为系统集成API添加Swagger文档
  - 为所有集成接口添加Swagger注解，提供完整的API文档
  - 定义 Integration 模型的Swagger Schema，以便文档引用
  - 文档可在 `/api-docs` 页面查看
- **查询版本管理**: 实现查询版本的激活功能
  - 新增 `/api/queries/versions/:versionId/activate` 接口用于激活已发布的查询版本
  - 新增 `/api/queries/:queryId/versions/:versionId/activate` 接口提供完整路径格式支持
  - 实现版本激活服务方法，支持事务操作更新版本状态和查询状态
  - 为查询状态添加 `ACTIVE` 值，表示版本已被激活并可用
  - 优化了错误处理和日志记录，提供详细的操作跟踪
  - 完善了前端路由适配，支持多种格式的API调用方式
- **集成管理**: 添加从数据源加载参数功能，可自动解析SQL中的参数
  - 添加`/api/queries/:id/parameters`接口，自动解析SQL查询中的`:paramName`格式参数
  - 支持自动识别参数类型（日期、数字、布尔值、枚举等）
  - 在创建集成时，选择查询后自动尝试加载参数配置
  - 为集成生成参数的表单配置，减少手动配置工作
  - 提供用户友好的参数加载过程和结果提示
- 添加`/api/queries/:id/parameters`接口，用于解析SQL查询中的参数并返回结构化数据
- 支持自动识别参数类型，包括日期、数字、布尔值、枚举等类型
- 添加版本管理API路由：`/api/queries/versions/management/:queryId`，用于支持查询版本管理视图
- 添加版本管理发布功能：`/api/queries/versions/management/:queryId/publish/:versionId`
- 添加版本管理废弃功能：`/api/queries/versions/management/:queryId/deprecate/:versionId`
- 添加创建查询版本的API路由：`/api/queries/:id/versions`，支持为现有查询创建新版本

### 优化
- 统一Swagger API文档中的路径格式和分组标签
  - 修改API路径，确保所有Swagger路径都带有`/api`前缀
  - 修正了`datasource.routes.ts`中`/datasources/{id}/stats`路径为`/api/datasources/{id}/stats`
  - 修正了`datasource.routes.ts`中`/datasources/test`路径为`/api/datasources/test`
  - 修正了`datasource.routes.ts`中`/datasources/{id}/test`路径为`/api/datasources/{id}/test`
  - 修正了`datasource.routes.ts`中`/datasources/{id}/check-status`路径为`/api/datasources/{id}/check-status`
  - 修正了`query.routes.ts`中`/queries`路径为`/api/queries`
  - 统一了API文档中的标签分组，将单数形式的`DataSource`改为复数形式`DataSources`，确保所有数据源相关API端点都在同一分组下
  - 保持了所有API文档中路径格式一致性
  - 提高了API文档的可读性和一致性，确保文档与实际请求路径保持一致

- 统一了数据源API路径格式
  - 移除了带连字符的`/api/data-sources`路径，只保留标准格式`/api/datasources`
  - 更新了相关文档和测试脚本，确保使用统一的路径格式
  - 保持与其他API路径命名风格一致
  - 减少了冗余和混淆，提高了API路径的一致性

### 更改

- 保留了前端集成组件中的模拟数据功能，确保前端开发体验
- 删除了所有与后端 `USE_MOCK_DATA` 环境变量相关的代码
- 移除了后端模拟数据层和 `mocks` 目录
- 删除了webService配置中的 `mockDataPath` 配置项
- 集成管理页面连接到实际后端API：
  - 将前端集成Store中USE_MOCK设置为false，启用真实API调用
  - 更新API路径以匹配后端实现的端点（/api/low-code/apis/）
  - 优化查询执行数据结构，确保前后端数据一致性
  - 实现集成状态管理、URL集成点调用和表单提交功能
- 所有API接口现在直接与真实数据库交互
- 前端仍保留其独立的模拟API功能
- 增加系统集成模型，实现查询结果的低代码集成能力
- 优化了API响应格式，提供统一的成功/错误响应结构
- 进一步优化了查询版本详情页面的设计和交互
  - 参考数据源详情页面风格，统一了设计风格，提高产品设计一致性
  - 改进了页面头部和卡片设计，使用渐变背景和更精细的边框样式
  - 优化了版本状态和信息展示方式，提高可读性
  - 为执行历史标签页添加了刷新按钮，便于用户获取最新数据
  - 统一了所有卡片、边框、阴影和圆角样式，与系统其他页面保持视觉一致
  - 提高了状态指示器的视觉清晰度，更好地区分不同状态
  - 改进了空状态提示的设计，使其与数据源页面风格一致
  - 优化了组件间距和布局，提高视觉层次感

### 安全优化
- 移除了示例错误路由
  - 删除了`/api/examples/errors`系列路由，包括各种错误类型演示端点
  - 从路由注册文件中移除了`examplesRouter`的引用和注册
  - 保留了示例代码文件供开发者参考，但不再对外暴露API端点
  - 修改了示例路由文件，移除了Swagger注释，并将文件重命名为`.bak`后缀，确保不会出现在API文档中
  - 提高了系统安全性，避免暴露内部错误处理机制

### 修复

- 修复了后端服务查询版本编译错误
  - 重构了query.controller.ts控制器，替换了过时的版本管理功能
  - 删除了不兼容的query-version.service和相关文件
  - 修复了集成路由中authMiddleware的导入和使用方式
  - 修复了app.ts中对已删除模块的导入引用
  - 移除了routes目录中不存在模块的导出
  - 确保了所有查询控制器方法的实现，保持API兼容性
  - 优化了错误处理，提供友好的临时禁用提示
  
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
- 修复了API路径不一致问题
  - 移除了所有集成API路径中的v1前缀，保持与项目其他API风格一致
  - 修正了前端与后端API路径不匹配问题，确保现有功能正常工作
  - 更新了API文档和路由配置，反映正确的API路径
- 彻底修复了启用/禁用查询的问题
  - 前端修改：
    - 修改`QueryListView.vue`中的`toggleQueryStatus`方法，直接操作`serviceStatus`而非间接设置`status`
    - 更新了`updateQueryStatus`方法，现在直接接收和处理`serviceStatus`参数
    - 优化了查询状态更新流程，确保前端与后端状态字段匹配
    - 增加了`QueryServiceStatus`类型定义，明确区分查询状态和服务状态两个概念
  - 后端修改：
    - 修复`updateQuery`方法，增加对`status`和`serviceStatus`参数的支持
    - 完善状态一致性处理逻辑，确保状态变更时两个字段保持同步
    - 增强日志记录，详细跟踪状态变更过程
    - 添加参数验证，确保状态字段值符合预期

- 清理前端mock数据，确保使用真实的后端API调用
  - 修复各函数，使用后端真实数据而不是mock数据
  - 修复查询状态更新请求缺少状态参数的问题，添加status字段到请求体
  - 修复在saveQuery方法中处理serviceStatus字段，确保正确记录用于调试
  - 更新savedQuery对象创建逻辑，正确处理后端status和serviceStatus字段

- 彻底清理前端模拟数据，确保使用真实的后端API调用
- 替换 `QueryVersionDetail.vue` 中使用的模拟数据，包括版本信息、执行历史和版本激活功能
- 修复 `loadVersionData` 函数，使用 `versionService.getVersion` 获取真实数据
- 修复 `loadExecutionHistory` 函数，使用 `queryService.getQueryExecutionHistory` 获取真实数据
- 修复 `handleActivate` 函数，使用 `versionService.activateVersion` 执行真实API调用
- 修复查询列表页面的启用/禁用功能，使其调用真实的后端API而不是只修改前端状态
- 修复查询列表状态更新问题
  - 更正 `updateQueryStatus` 方法，使用 `saveQuery` 接口正确更新查询状态
  - 修复 `confirmStatusChange` 函数中对返回结果的处理逻辑，不再检查返回是否为空
  - 增强状态更新日志记录，便于调试
- 修复 `queryService.updateQuery is not a function` 错误
  - 添加 `updateQuery` 方法作为 `saveQuery` 的别名，确保 API 兼容性
  - 保证查询启用/禁用功能可以正常工作
- 修复查询状态更新请求丢失状态参数问题
  - 在 `saveQuery` 方法中添加 `status` 字段到请求体中
  - 修复 `savedQuery` 对象的创建，正确处理后端返回的 `status` 和 `serviceStatus` 字段
  - 确保禁用查询时正确传递 `DEPRECATED` 状态
- 修复查询启用/禁用功能不生效问题
  - 发现前端和后端概念不匹配：`status`(DRAFT/PUBLISHED/DEPRECATED)控制生命周期，`serviceStatus`(ENABLED/DISABLED)控制可用性
  - 修改 `saveQuery` 方法，同时设置 `serviceStatus` 参数
  - 更新 `updateQueryStatus` 方法，直接发送明确的服务状态
  - 修正 `SaveQueryParams` 接口，添加 `serviceStatus` 字段

- 修复了版本详情页处理SQL内容为null的问题
  - 增强了数据映射函数的健壮性，正确处理API返回中sqlContent为null的情况
  - 修复了getVersion方法中的数据提取逻辑，不再假设API返回结果包含在data字段中
  - 改进了版本详情页面展示逻辑，当版本没有查询内容时显示友好提示信息
  - 添加了缺少SQL内容的错误提示，解释可能的原因并提供解决建议
  - 完善了执行查询功能，在SQL内容为空时禁用执行按钮并显示提示

- 简化了代码库，消除了多余的条件判断
- 增强了代码一致性和可维护性
- 明确了后端和前端的职责边界
- 添加了针对服务和控制器的单元测试
  - 为 `query.service.ts` 添加了完整测试
  - 为 `metadata.controller.ts` 添加了测试
  - 添加了配置文件测试，确保移除了模拟数据相关配置
- 增强了参数验证，使用express-validator进行请求参数校验
- 完善了API错误处理机制，提供更友好的错误提示

- 修复了新增查询场景的问题
  - 修正了新增查询时错误使用PUT方法的问题
  - 确保新增场景不传入id字段
  - 只在更新场景下使用路由中的queryId

- 修复了查询编辑功能问题
  - 修复了编辑页面无法正确加载已有查询的问题
  - 确保URL中的查询ID能正确传递到组件中
  - 优化了查询加载逻辑，改进错误处理和提示
  - 修复了查询内容无法正确回显的问题

- 修复了查询保存界面的问题，调整请求体格式以符合后端API要求

- 修复版本管理API路由不存在的问题，将前端调用路径从`/api/query/version/management`统一更改为`/api/queries/versions/management`

### 功能增强
- 增强了查询版本详情页的用户体验
  - 改进了页面整体布局和视觉设计，使用现代化UI元素
  - 优化了版本信息卡片，增加图标、分组和视觉层次
  - 增强了空状态显示，提供更友好的引导和错误提示
  - 添加了查询内容复制功能，便于用户快速使用
  - 优化了标签页导航，添加过渡动画和明显的选中状态
  - 改进了交互元素的反馈效果，如按钮悬停和点击状态
  - 优化了执行历史和执行计划的空状态，添加执行按钮便于用户操作
- 优化了查询版本的操作流程
  - 增加版本发布后自动跳转到查询列表页面功能，提高操作连贯性
  - 增加版本激活后自动跳转到查询列表页面功能，减少用户手动导航步骤
  - 在操作成功后添加延迟跳转，确保用户能看到成功消息
  - 统一了版本操作的用户体验流程，确保交互一致性
- 增强了版本操作的错误处理和兼容性
  - 改进了版本激活功能的响应数据格式适配能力，支持多种后端返回格式
  - 添加了更详细的错误日志记录，方便追踪问题
  - 增强了异常状态下的用户友好提示，提高用户体验
  - 统一了错误消息处理，避免出现格式不一致的提示

## 2024-03-26

### 修改

- 移除了查询相关的标签功能
  - 从Query类型定义中移除了tags字段
  - 从SaveQueryParams类型定义中移除了tags字段
  - 从保存查询对话框中移除了标签输入部分

### 修复

- 修复了保存查询接口的问题
  - 修正了请求体中的字段名（将queryText改为sql）
  - 确保正确传递dataSourceId
  - 移除了不必要的字段（queryType）
  - 优化了类型定义，使其与后端API保持一致
  - 修复了数据源ID未正确传递的问题
  - 确保返回的Query对象包含所有必需字段
  - 优化了错误处理，对查询不存在的情况提供更友好的错误提示
  - 添加了必填字段的前端验证
  - 优化了错误消息的显示，提供更具体的错误信息
  - 修复了服务层saveQuery方法字段名不匹配的问题

- 修复了新增查询场景的问题
  - 修正了新增查询时错误使用PUT方法的问题
  - 确保新增场景不传入id字段
  - 只在更新场景下使用路由中的queryId

- 修复了查询编辑功能问题
  - 修复了编辑页面无法正确加载已有查询的问题
  - 确保URL中的查询ID能正确传递到组件中
  - 优化了查询加载逻辑，改进错误处理和提示
  - 修复了查询内容无法正确回显的问题

- 修复了查询保存界面的问题，调整请求体格式以符合后端API要求

- 修复版本管理API路由不存在的问题，将前端调用路径从`/api/query/version/management`统一更改为`/api/queries/versions/management`

- 修复查询历史API在数据库连接失败时返回500错误的问题，现在会优雅地返回空结果

- 修复创建查询版本API路由不存在的问题，增加了`/api/queries/:id/versions`路由

## 更新日志

### [1.6.0] - 2023-08-10

#### 新增功能
- 实现查询版本发布功能
- 添加查询版本激活后自动跳转到查询列表页面
- 为元数据服务添加健康检查接口
- 为集成服务添加健康检查接口
- 增强元数据API的稳定性和错误处理
- 添加/api/queries/:id/execute路由，支持通过ID执行保存的查询

#### 优化
- 优化API路由注册机制，修复路由路径前缀重复导致路由未找到的问题
  - 修复了元数据API (`/api/metadata`) 路由无法访问的问题
  - 修复了低代码集成API (`/api/low-code/apis`) 路由无法访问的问题
  - 统一路由注册方式，避免路径前缀重复
- 规范化路由定义，统一使用相对路径方式：
  - 清理查询版本路由中的冗余定义
  - 添加路由注册规范说明
  - 优化路由日志输出
  - 统一集成模块Swagger文档路径
- 改进查询执行性能
- 优化数据加载状态显示

#### 变更
- 更新API文档，完善接口描述和示例
- 调整查询版本详情页布局

#### 安全性改进
- 增强API错误处理
- 改进错误日志记录

#### 修复
- 修复查询更新功能中ID处理逻辑
- 修复查询版本API中无法获取单个版本详情的问题
- 修复元数据API路由无法访问的问题
- 修复查询执行过程中的错误处理
- 修复查询执行API路由缺失问题

## 最新更新

### 新增功能
- **集成管理**: 添加从数据源加载参数功能，可自动解析SQL中的参数
  - 添加`/api/queries/:id/parameters`接口，自动解析SQL查询中的`:paramName`格式参数
  - 支持自动识别参数类型（日期、数字、布尔值、枚举等）
  - 在创建集成时，选择查询后自动尝试加载参数配置
  - 为集成生成参数的表单配置，减少手动配置工作
  - 提供用户友好的参数加载过程和结果提示

### 优化
- **集成创建/编辑页面**: 改进数据源与查询的联动关系
  - 选择数据源后，查询选择器会自动筛选显示该数据源的可用查询
  - 切换数据源时会清空当前选择的查询，避免数据不一致
  - 提供友好的用户提示，说明当前筛选状态
  - 改进空状态显示，当数据源没有可用查询时提供明确的引导信息

### 修复
- 修复查询历史API在数据库连接失败时返回500错误的问题，现在会优雅地返回空结果

### 优化
- 改进了查询历史API的错误处理，当数据库连接失败时不再返回500错误，而是返回空结果，提高了系统容错性
- 统一了版本管理API路径，使用规范的RESTful风格：
  - 将`/api/query/version/*`更改为`/api/queries/versions/*`
  - 将`/api/query/version/management/:queryId`更改为`/api/queries/versions/management/:queryId`
  - 增加了前端versionService对新路径的支持，确保API调用与后端一致

## 新功能

- 实现查询版本发布功能，通过API `/api/queries/versions/:id/publish` 支持版本发布
- 在版本激活时添加重定向功能，激活成功后自动导航到查询列表页面
- 新增路由 `/api/queries/:id/execute` 用于通过ID执行已保存的查询
- 新增路由 `/api/queries/versions/:id` 用于获取单个版本详情
- 新增路由 `/api/queries/:id/versions` 用于分页获取查询的所有版本，支持page和size参数
- 完善版本创建API，支持通过POST请求到 `/api/queries/:queryId/versions` 创建新版本

## 优化

- 优化查询执行功能，对特殊命令如 `SHOW TABLES` 等增加识别，不再自动添加LIMIT子句
- 优化SQL查询执行逻辑，避免对特殊命令如SHOW, DESCRIBE等添加分页条件
- 提升查询执行过程的错误处理和日志记录
- 改进查询编辑器中的错误反馈，提供更清晰的错误提示
- 修复 API 路由注册中的重复前缀问题，确保路由正确响应
- 优化查询版本管理接口，确保前端与后端API路径一致
- 改进查询执行服务，提供结构化的查询结果，便于前端处理
- 完善查询版本API，支持分页获取版本列表，增强前端兼容性
- 优化版本管理API的错误处理，提供更清晰的错误提示和状态码

## 更改

- 版本激活后自动跳转到查询列表页面，优化用户体验
- 修改查询执行API的响应格式，提供更完整的元数据信息
- 将Swagger文档中的API路径与实际路径对齐，删除多余的 `/api` 前缀
- 调整查询执行模块，使用独立的连接处理工具提升代码组织性
- 改进版本管理API的结构，支持通过查询ID直接获取版本列表
- 统一版本管理API的路由格式，使用REST风格的URL路径设计

## 安全性改进

- 加强API参数验证，防止SQL注入
- 优化错误处理，避免在API响应中暴露敏感信息
- 增强日志记录，改进问题诊断能力，同时保护敏感数据
- 增加请求参数验证，确保必要字段不为空，提高API安全性

## 修复

- 修复查询版本API路由不一致问题，确保前后端交互正常
- 修复集成API路由前缀重复问题，解决API路由无法找到的错误
- 修复特殊SQL命令执行失败的问题，现支持SHOW TABLES等管理命令
- 修复执行查询时的类型错误，确保正确处理结果集
- 改进查询历史记录创建逻辑，确保统计数据准确
- 修复分页获取查询版本列表的API路由缺失问题
- 添加查询版本创建API，解决前端创建版本请求404的问题

## [0.6.0] - 2023-06-XX

### 修复
- 修复数据库连接用户名字段处理问题，增强了连接器的字段名兼容性
  - 修复了EnhancedMySQLConnector中executeQuery方法未正确使用连接器config信息的问题
  - 修复数据库连接工厂中user与username字段映射问题
  - 在MySQL连接器中优先使用username字段，并兼容user字段
  - 增加了数据库连接配置的详细日志，方便排查连接问题
  - 优化了错误信息，提供更详细的连接失败原因
- 增加详细的连接错误日志，便于排查连接失败问题
- 改进SQL查询执行中用户名和数据库名的处理机制
- 修复数据源连接器用户名为空导致连接失败的问题

## [Unreleased]

### Added

### Changed

### Fixed
- 修复数据库连接问题，通过直接创建连接而不是依赖连接池，确保用户名和数据库名正确传递
- 改进了executeQuery方法，添加了回退机制，当直接连接失败时尝试使用连接池
- 增强了数据库连接日志，便于诊断连接问题

## Changelog

### 2025-04-03
- 修复了数据库连接问题
  - 恢复使用原有的连接池机制，但加强了执行查询阶段的日志记录和诊断能力
  - 修改 EnhancedMySQLConnector 类的 executeQuery 方法，确保正确显示和记录配置中的用户名和密码
  - 在 DataSourceService 的 getConnector 方法中增强了连接参数处理，确保用户名和数据库名始终正确传递
  - 增强了数据库连接相关的日志记录，便于问题诊断
  - 修改 DatabaseConnectorFactory，确保user和username字段保持一致

### 2025-04-02
// ... existing code ...
