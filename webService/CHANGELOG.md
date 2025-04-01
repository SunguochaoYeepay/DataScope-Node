# 更新日志 (CHANGELOG)

## [Unreleased]

### 新增

- **表字段信息API**: 添加了获取表字段详细信息的专用接口
  - 新增 `GET /api/metadata/:dataSourceId/tables/:tableName/columns` 端点
  - 采用多种方式确保可靠获取字段信息
  - 返回包含名称、类型、可空性、默认值、主键标识等完整字段信息
  - 解决了前端无法显示表完整元数据的问题
- 添加表数据预览API，支持分页、排序和过滤功能
  - 新增 `GET /api/metadata/:dataSourceId/tables/:tableName/data` 端点
  - 新增 `GET /api/metadata/datasources/:dataSourceId/tables/:tableName/data` 端点
  - 支持page和size参数控制分页
  - 支持sort和order参数控制排序
  - 支持filter[columnName]参数进行列筛选
- SQL语法预检查功能，提高查询稳定性
- 参数类型验证及安全过滤
- 错误信息格式化增强
- 查询执行计划表结构
- 数据库关系定义优化
- **查询历史详情API**: 添加获取单个查询历史记录的API端点
  - 新增 `GET /api/queries/history/:id` 端点，用于获取单个查询历史记录的详细信息
  - 支持前端查询历史详情页面展示
  - 返回包含执行状态、SQL内容、执行时间等完整信息
- **查询历史生成策略优化**: 修改了查询历史记录生成逻辑
  - 查询执行时不再自动生成历史记录，只在符合特定条件时创建
  - 新增 `createHistory` 参数，允许客户端明确指定是否要创建历史记录
  - 当执行已保存查询(有queryId)或显式设置createHistory=true时才创建历史记录
  - 减少了大量临时查询时生成的无用历史记录，提高系统性能和数据清晰度
  - 前端可以在需要时显式请求生成历史记录，提高用户体验
- 实现查询文件夹管理API，提供标准分页格式的文件夹列表和CRUD操作：
  - `GET /api/query-folders` - 获取文件夹列表（支持分页和父文件夹筛选）
  - `GET /api/query-folders/:id` - 获取文件夹详情（包含子文件夹和查询）
  - `POST /api/query-folders` - 创建文件夹
  - `PUT /api/query-folders/:id` - 更新文件夹
  - `DELETE /api/query-folders/:id` - 删除文件夹（仅当文件夹为空时）
- 实现系统日志API，采用标准分页格式：
  - `GET /api/system/logs` - 获取系统日志（支持分页、日志级别过滤、关键词搜索和日期范围）
  - `GET /api/system/health` - 获取系统健康状态（包含内存、CPU、数据库连接状态等）

### 改进

- **查询历史API分页参数兼容性**: 增强了查询历史API的分页参数兼容性
  - 增强 `GET /api/queries/history` 端点，同时支持 `limit/offset` 和 `page/size` 两种分页参数
  - 优先使用 `limit/offset` 参数，如果未提供则尝试使用 `page/size` 参数
  - 自动将 `page/size` 转换为对应的 `limit/offset` 值
  - 提高了与前端不同分页方式的兼容性
  - 解决了分页参数不一致导致的查询结果异常问题
- **查询更新API增强**: 改进查询更新API，支持upsert（更新或插入）操作
  - 当更新不存在的查询ID时，如果提供了必要的字段（dataSourceId和name），自动创建新查询
  - 保留传入的ID作为查询的唯一标识符
  - 提供更详细的日志和错误信息，方便前端调试
  - 解决了当查询不存在时返回404错误的问题
  - 优化了错误处理流程

### 修复
- **查询不存在错误返回500问题**: 修复了尝试获取不存在的查询时错误返回500的问题
  - 修改了`getQueryById`控制器方法，正确处理404错误
  - 当查询不存在时返回404状态码，而不是内部服务器错误(500)
  - 明确设置错误代码为`RESOURCE_NOT_FOUND`，提供更具体的错误信息
  - 解决了前端在访问不存在查询时遇到的内部服务器错误
- **错误处理中间件状态码问题**: 修复了错误处理中间件中的状态码问题，防止非法HTTP状态码导致的"Invalid status code"错误
  - 添加状态码验证，确保返回的是有效的HTTP状态码(100-599)
  - 统一错误响应格式，包含error对象结构(code, message, details)
  - 增强系统稳定性，避免内部错误导致的HTML格式错误页面
  - 确保所有API错误都返回一致的JSON格式响应
- **SQL LIMIT语法错误**: 修复了MariaDB中"LIMIT x, y"语法不兼容的问题
  - 将MySQL风格的`LIMIT offset, limit`语法更改为标准SQL的`LIMIT limit OFFSET offset`语法
  - 修改`isSpecialCommand`函数，将包含LIMIT关键字的SQL查询视为特殊命令，避免自动添加额外的分页参数
  - 解决了"check the manual that corresponds to your MariaDB server version for the right syntax to use near 'LIMIT 0, 50'"错误
  - 提升了与MariaDB数据库的兼容性
- **查询计划列表接口404错误**: 修复了访问`/api/queries/plans`时返回"查询不存在"错误的问题
  - 调整了路由定义的顺序，确保特定路径(如`/plans`)在通用路径(`/:id`)之前定义
  - 重构了路由定义结构，分类整理所有路由以避免顺序问题
  - 解决了Express路由匹配顺序导致的路径解析错误
- **查询收藏功能SQL错误**: 修复查询收藏列表获取时出现的"Unknown column 'query_id' in 'SELECT'"错误
  - 更新了原始SQL查询中的列名，从下划线格式改为驼峰命名法格式
  - 将 `query_id` 更正为 `queryId`，将 `user_id` 更正为 `userId`，将 `created_at` 更正为 `createdAt`
  - 确保了SQL查询与数据库表结构保持一致
- **数据源密码解密故障**: 修复了数据源密码解密时出现的"Invalid initialization vector"错误
  - 统一了加密密钥配置，确保加密和解密使用相同的密钥
  - 增强了解密函数的错误处理，添加详细的错误日志
  - 实现了备用解密方案，提高解密兼容性
  - 添加开发环境下的默认密码机制，避免开发阶段的连接失败
- 添加密码重置脚本 `reset-datasource-passwords.ts`，修复已存在数据源的加密密码问题
- **数据源测试连接API路由错误**: 修复前端找不到 `/api/datasources/test` 路由的问题
  - 添加 `/api/datasources/test` 别名路由，指向与 `/api/datasources/test-connection` 相同的控制器方法
  - 在两个路由上使用相同的参数验证规则
  - 确保前端调用测试连接API时能正确响应
- 修复查询执行中的500错误问题
- 修复查询/可视化接口的404错误
- 修复错误码定义一致性问题
- 改进查询管理接口(POST /api/queries, PUT /api/queries/{id}, DELETE /api/queries/{id})的错误处理，提供更详细的错误信息
- 改进查询收藏相关接口(POST /api/queries/{id}/favorite, DELETE /api/queries/{id}/favorite)的错误处理
- 修复查询收藏功能无法正常工作的问题，使用Prisma ORM替代原始SQL操作
- 修复查询计划可视化接口问题(GET /api/plan-visualization/{planId})，解决"this.transformToVisualizationFormat is not a function"错误
- 增强查询执行计划获取逻辑，支持从多个表中查找执行计划数据
- 修复查询执行计划获取接口(GET /api/queries/{id}/execution-plan)，支持从测试文件获取数据以便开发和测试
- **数据库连接问题**: 修复了数据库连接器在容器环境和本地环境中的主机名解析问题，现在系统会根据环境变量 `CONTAINER_ENV` 自动将容器名称解析为 localhost 或实际容器名
- **元数据同步问题**: 修复了元数据同步接口中使用原始 SQL 查询导致的语法错误问题，改用 Prisma ORM API
- **元数据表丢失问题**: 使用 `prisma db push` 同步了数据库架构，确保元数据表 `tbl_metadata` 存在
- **特殊SQL命令处理问题**: 优化了特殊命令(如SHOW TABLES)的执行方式，将isSpecialCommand从类方法改为全局函数，避免this绑定问题，现在控制器可以直接使用连接器执行特殊命令
- **错误处理兼容性问题**: 增强了QueryExecutionError错误类的参数处理，提供更好的参数顺序兼容性，防止dataSourceId和sql参数传递错误
- **元数据同步请求兼容性**: 增强了元数据同步接口，支持前端发送的filters格式请求体，实现与前端应用的无缝集成
- **API路径兼容性问题**: 修复了前后端API路径不一致导致的元数据同步请求失败问题
  - 添加了兼容路由 `/api/metadata/sync/:dataSourceId`，与现有的 `/api/metadata/datasources/:dataSourceId/sync` 保持功能一致
  - 确保前端应用可以正常进行元数据同步操作
  - 统一了API路径命名规范，同时保持向后兼容
- **查询ID验证问题**: 修复了自定义ID格式无法通过验证的问题
  - 更新查询ID验证逻辑，允许非UUID格式的自定义ID
  - 增强了 `saveQuery` 和 `updateQuery` 方法，支持自定义ID参数
  - 更新 `SaveQueryParams` 接口定义，添加可选的 `id` 字段
  - 解决了使用自定义ID保存查询时返回400错误的问题
- 改进查询管理接口(POST /api/queries, PUT /api/queries/{id}, DELETE /api/queries/{id})的错误处理，提供更详细的错误信息
- 修复了metadata.controller.ts中表列表日志记录的潜在问题，添加对items属性的空值检查，避免在标准化API响应格式下可能的空引用错误
- 标准化了query.controller.ts中的错误响应格式，确保所有错误响应使用统一的error对象格式，符合API标准
- 修复了查询执行计划API (GET /api/queries/{id}/execution-plan)，添加对explainQuery参数的支持，允许请求执行计划并改进了日志记录和错误处理
- **执行查询历史记录问题**: 修复了执行已保存查询时历史记录未生成的问题
  - 改进了`queryController.executeQuery`方法，自动从请求中获取`id`或`queryId`参数
  - 当提供了查询ID时，默认启用查询历史记录功能，确保执行已保存的查询时能正确生成历史记录
  - 优化了查询选项的传递机制，确保`queryId`参数能正确传递给查询服务
  - 增强了日志记录，便于排查历史记录生成相关问题
  - 更新了README.md中的API文档，明确说明执行已保存查询时的正确参数用法
- **执行计划参数兼容性问题**: 修复了查询执行计划API中参数不一致的问题
  - 解决了使用`explainQuery=true`参数执行查询时返回500错误的问题
  - 增强了`queryPlanService.getQueryPlan`方法的参数处理，使其能正确适配多种调用方式
  - 改进了错误处理和日志记录，更准确地定位和报告执行计划相关错误
  - 让`POST /api/queries/execute`端点在`explainQuery=true`模式下能可靠获取执行计划
- **测试环境执行计划支持**: 修复了使用test-ds数据源ID获取执行计划的问题
  - 优化了test-ds数据源的处理逻辑，通过智能回退到第一个可用数据源
  - 在query.service.ts中增加了专门的测试数据源逻辑，直接返回模拟执行计划
  - 解决了测试环境无需真实数据库连接即可获取执行计划的需求
  - 确保测试脚本和CI/CD环境可以正常运行查询执行计划API
- **查询执行计划获取404问题**: 修复了获取查询执行计划时遇到的404错误
  - 增强了`getQueryPlanById`方法，支持更全面的ID查找机制
  - 改进了对非标准UUID格式的计划ID的处理
  - 增强了计划数据解析功能，更好地适配不同数据源的计划格式
  - 修正了使用explainQuery=true参数执行查询后获取计划的流程

### 提升服务稳定性

- 增强了数据库连接器的日志输出，方便故障排查
- 在多个数据库连接点统一使用主机名解析逻辑
- 修复 `createConnectorFromDataSourceId` 和 `createConnector` 方法中的容器名称处理逻辑
- 改进了MySQL连接器中对SQL查询的处理，包括更精确的排序和分页应用条件
- 简化了MySQL连接器的executeQuery方法，优化特殊命令执行逻辑

### Changed
- 改进SQL执行错误处理
- 增强日志记录功能
- 查询执行计划功能增强
- 数据模型优化
- 移除了查询计划API的认证需求，使所有计划分析API无需授权即可访问
- 修复了metadata.controller.ts中关于表列表的日志记录，以适应新的标准化API响应格式

### Fixed
- 改进查询管理接口(POST /api/queries, PUT /api/queries/{id}, DELETE /api/queries/{id})的错误处理，提供更详细的错误信息
- 修复了metadata.controller.ts中表列表日志记录的潜在问题，添加对items属性的空值检查，避免在标准化API响应格式下可能的空引用错误
- 标准化了query.controller.ts中的错误响应格式，确保所有错误响应使用统一的error对象格式，符合API标准
- 修复了查询执行计划API (GET /api/queries/{id}/execution-plan)，添加对explainQuery参数的支持，允许请求执行计划并改进了日志记录和错误处理

### 变更
- **API响应格式标准化**：统一分页列表API的响应格式
  - 所有分页数据统一使用 `items` 字段返回数据项（原先部分API使用 `rows` 或 `history`）
  - 所有分页信息统一封装在 `pagination` 对象中
  - 分页信息包含: `page`, `pageSize`, `total`, `totalPages`, `hasMore`
  - 受影响的API:
    - `GET /api/queries/history` - 查询历史列表（将 `history` 改为 `items`）
    - `GET /api/queries/plans` - 查询计划历史（将 `history` 改为 `items`）
    - `GET /api/metadata/:dataSourceId/tables/:tableName/data` - 表数据预览（将 `rows` 改为 `items`）
  - 创建了工具函数统一处理分页响应格式
  - 注意：此变更需要前端对应修改，以适应新的数据结构

## [1.0.9] - 2024-05-07

### 修复
- 修复数据源连接测试API接口 `/api/datasources/:id/test`
- 修复元数据路由，统一为 `/api/metadata/datasources/:dataSourceId/tables`
- 确保API服务监听5000端口
- 优化主机名解析，自动将容器名转换为localhost
- 修复Swagger API文档配置

### 改进
- 简化认证中间件，支持开发环境跳过验证
- 优化错误处理，提供更详细的错误信息
- 优化数据源连接参数处理
- 改进SQL执行错误处理
- 增强日志记录功能
- 查询执行计划功能增强
- 数据模型优化
- 移除了查询计划API的认证需求，使所有计划分析API无需授权即可访问

## [1.0.8] - 2024-05-07

### 改进
- 从Git仓库中移除dist编译目录，优化代码仓库大小和结构
- 完善.gitignore规则，忽略编译输出目录
- 提升代码仓库的维护性，降低不必要的文件追踪

## [1.0.0] - 2023-03-29

### 新功能 (New Features)

- 实现数据源管理功能
  - 创建、查询、更新和删除数据源
  - 数据源连接测试
  - 支持MySQL数据库类型
- 实现查询执行功能
  - SQL查询执行
  - 查询结果展示
  - 查询历史记录
- 实现元数据查询功能
  - 数据库表结构查询
  - 数据库字段信息查询
  - 数据库关系查询
- 实现查询管理功能
  - 保存查询
  - 管理查询历史
- 添加API文档 (Swagger)
- 健康检查接口
- 基础数据源连接管理
- SQL查询执行功能
- 查询历史记录
- 元数据浏览
- 基本的性能分析
- 用户验证系统

### 修复 (Fixes)

- 修复了错误处理中间件类型问题
- 修复了数据源服务中的类型错误
- 修复了Swagger文档配置问题
- 修复了数据库databaseName与database字段不一致问题
- 密码加密存储问题的修复

### 变更 (Changes)

- 改进了数据源密码的安全处理
- 更新了API错误处理机制
- 改进了查询执行服务的性能
- 调整了中间件结构
- 初始版本

### 安全 (Security)

- 增强了错误处理机制，防止敏感信息泄露
- 实现了数据源密码的加密存储
- 添加了请求验证和参数校验

## [1.0.1] - 2023-03-30

### 新功能 (New Features)

- 实现元数据同步功能
  - 支持全量和增量同步
  - 可配置同步的schema和表范围
  - 记录同步历史
  - 同步表、视图、列和关系信息
- 实现元数据结构查询功能
  - 获取完整的数据源元数据结构
  - 支持表数据预览
  - 查询同步历史
- 优化元数据API路由设计
  - 简化路由结构
  - 添加详细参数验证

### 修复 (Fixes)

- 修复了元数据控制器中的类型错误
- 修复了元数据路由中的验证问题
- 修复了数据源连接器接口不一致问题

### 变更 (Changes)

- 重构了元数据服务的API设计
- 优化了同步性能和错误处理
- 改进了元数据存储结构

## [1.0.2] - 2024-03-30

### 修复
- 修复了datasource控制器测试，重写了测试代码以正确模拟模块和依赖关系
- 修复了测试中的服务层模拟问题，确保控制器能够正确调用和处理服务层方法
- 优化了测试覆盖率，所有测试现在都可以正常通过
- 修复了query控制器测试，使用JavaScript编写并正确模拟了所有依赖项

## [1.0.3] - 2024-04-17

### 修复 (Fixes)
- 修复了MySQL连接器（mysql.connector.ts）中的问题：
  - 删除了无效的execute方法，该方法使用了不存在的connection对象
  - 使用正确的executeQuery方法代替，确保所有数据库操作都能正常工作
- 修复了query-plan.controller.test.js测试文件中的模拟问题：
  - 修正了PrismaClient模拟实现，使其返回合适的查询计划数据
  - 补全了getQueryPlanHistory和getQueryPlanById测试中缺失的模拟方法调用
  - 完善了comparePlans测试，添加了正确的数据模拟和验证逻辑
  - 解决了所有测试断言失败问题
- 全部修复关键控制器的测试，包括：
  - datasource.controller.test.js - 17个测试全部通过
  - query.controller.test.js - 16个测试全部通过
  - query-plan.controller.test.js - 10个测试全部通过
- 增强了测试文件的鲁棒性，使用更严格的验证逻辑

### 变更 (Changes)
- 优化了测试代码组织，确保每个测试函数独立设置依赖并清理模拟状态
- 添加了更详细的测试覆盖，确保所有控制器方法都有成功和失败场景的测试
- 改进了模拟对象结构，更准确地反映实际应用程序行为

## [1.0.5] - 2024-05-01

### 修复 (Fixes)
- 解决了元数据同步接口问题：
  - 改进了数据源连接中的主机名解析，支持更多容器名称解析为localhost
  - 增加空主机名检测和默认值(127.0.0.1)处理
  - 添加IP地址格式检测，避免对已是IP地址的主机名进行不必要的解析
- 增强了数据源连接测试机制：
  - 添加连接失败重试功能，默认重试3次
  - 实现了退避策略，每次重试增加延迟时间
  - 添加了详细的连接尝试日志记录
- 统一了数据源ID验证机制：
  - 修改了所有API接口的数据源ID验证，从严格UUID格式改为简单的非空字符串验证
  - 更新了metadata.controller.ts中的验证方法
  - 更新了plan-visualization.routes.ts中的查询计划ID验证
  - 更新了datasource.validator.ts中的所有ID验证规则

### 性能优化
- 改进了数据源连接测试性能，通过重试机制提高了不稳定环境下的连接成功率
- 优化了主机名解析逻辑，减少了DNS查询需求

### 变更 (Changes)
- 统一了API接口验证标准，提高了系统对各种ID格式的兼容性
- 增强了系统在不同网络环境下的适应性

## [1.0.4] - 2024-04-30

### 修复 (Fixes)
- 修复了MySQL连接器对特殊命令的处理问题：
  - 扩展isSpecialCommand方法，增加了更多特殊命令的识别，如SHOW DATABASES、SHOW TABLES等
  - 添加对无分号结尾的命令的支持
  - 完善了特殊命令集合，增加了SHOW COLUMNS、SHOW INDEX、SET、USE等命令
- 修复了控制器处理查询的问题：
  - 在query.controller.ts中增加了特殊命令检测，避免特殊命令添加分页参数
  - 优化了查询执行方法中的参数处理逻辑
- 修复了数据源ID验证问题：
  - 删除了路由中对dataSourceId的UUID格式验证，改为简单的非空验证
  - 使系统能够支持非UUID格式的数据源ID

### 性能优化
- 优化了查询执行过程，避免对特殊命令添加不必要的处理
- 减少了特殊命令执行时的数据库负荷

### 变更 (Changes)
- 改进了API接口的异常处理，提供更明确的错误信息
- 提高了系统对非标准命令的容错性

### 待实现功能

- 用户认证和授权
- 数据可视化功能
- 数据导出功能
- 定时查询功能
- 完整的测试用例

## [1.0.7] - 2024-05-03

### 新增
- 为前端开发人员全面升级《前端开发对接指南》文档
- 添加完整快速开始代码示例，覆盖常见使用场景
- 新增数据源连接规则详细说明文档
- 添加查询模块API详解文档，包含完整的请求/响应示例
- 添加查询收藏功能的API接口实现
- 添加标准表元数据API路径(/api/metadata/{dataSourceId}/tables)

### 改进
- 完善前端错误处理指南，添加错误码列表和处理建议
- 细化数据源ID规则说明，增强API使用灵活性
- 改进文档结构和示例代码格式
- 增强查询API文档，添加JavaScript使用示例
- 修复获取查询收藏列表API返回500错误的问题
- 修复数据源连接测试功能中容器名称解析问题
- 修复数据库名称字段不一致问题，统一使用database参数

### 文档
- 新增主机名解析机制详细说明
- 添加连接重试机制和超时处理文档
- 优化API使用示例，增加实际应用场景
- 完善查询执行、历史记录和保存查询API文档
- 添加查询收藏功能的API接口文档和使用示例
- 更新API路径说明，确保前后端接口匹配
- 添加元数据API接口路径说明，明确/api/metadata/{dataSourceId}/tables为获取表列表的标准路径

### API路径修复
- `/api/metadata/{dataSourceId}/tables`: 标准路径获取表列表
- `/api/metadata/{dataSourceId}/tables/{tableName}`: 标准路径获取表结构
- `/api/queries/favorites`: 收藏查询列表
- `/api/queries/{id}/favorite`: 添加/移除收藏

## 2023-05-02

### API路径修复
- 修复了前端与后端API路径不一致的问题：
  - 前端使用 `/api/metadata/sync/:dataSourceId` 
  - 后端实际路径为 `/api/metadata/datasources/:dataSourceId/sync`
  - 需确保前后端API调用路径一致

### 查询ID验证修复
- 修复了查询API中的ID格式验证问题：
  - 将所有路由中的ID验证从`isUUID()`改为`not().isEmpty()`
  - 路径包括：
    - PUT `/api/queries/:id` - 更新查询
    - DELETE `/api/queries/:id` - 删除查询 
    - POST `/api/queries/:id/cancel` - 取消查询
    - GET `/api/queries/:queryId/execution-plan` - 获取执行计划
    - GET `/api/queries/:queryId/visualization` - 获取可视化数据
  - 允许使用非UUID格式的查询ID
  - 解决了前端使用自定义ID如`k9zadwa69y8`时返回400错误的问题
  - 优化了查询服务updateQuery方法，添加更详细的日志输出

## 更新日志 (2025-03-31)

### 新增功能

- 添加简化版元数据API路径: `/api/metadata/{dataSourceId}/tables` 和 `/api/metadata/{dataSourceId}/tables/{tableName}`，支持前端兼容性
- 添加元数据同步兼容路径: `/api/metadata/sync/{dataSourceId}` 和 `/api/metadata/{dataSourceId}/sync`，完善与前端的集成

### 修复问题

- **数据库连接问题**: 修复了数据库连接器在容器环境和本地环境中的主机名解析问题，现在系统会根据环境变量 `CONTAINER_ENV` 自动将容器名称解析为 localhost 或实际容器名
- **元数据同步问题**: 修复了元数据同步接口中使用原始 SQL 查询导致的语法错误问题，改用 Prisma ORM API
- **元数据表丢失问题**: 使用 `prisma db push`

### 数据维护

- **查询模块数据清理**: 清理了测试和无效查询数据
  - 删除了所有格式为"查询 [id]"的无效测试数据
  - 创建了5个业务场景示例查询：
    - 用户订单统计分析
    - 产品销售排行榜 
    - 库存预警分析
    - 客户活跃度分析
    - 地区销售业绩比较
  - 每个示例查询都包含完整的描述和标签
  - 添加了业务分析场景的SQL示例，可直接用于演示和测试

## 计划中的变更
1. API分页参数标准化 (2024-Q4)
   - 统一所有分页API使用`page`和`size`作为入参
   - 统一分页响应格式为`{ success, data: { items, pagination } }`
   - 优先标准化: 查询列表、数据源列表、收藏列表
   - 详细标准见: `design-docs/api-pagination-standard.md`

## 已完成的变更
1. API分页参数标准化 (2024-本次)
   - 统一了5个核心API的分页参数和响应格式:
     - 查询列表API (`GET /api/queries`)
     - 数据源列表API (`GET /api/datasources`)
     - 收藏列表API (`GET /api/queries/favorites`)
     - 元数据表列表API (`GET /api/metadata/:dataSourceId/tables`)
     - 元数据同步历史API (`GET /api/metadata/:dataSourceId/sync-history`)
   - 所有API均支持`page`和`size`参数，同时兼容`offset`和`limit`参数
   - 所有API返回标准分页格式: `{ success, data: { items, pagination } }`
   - 详细标准见: `design-docs/api-pagination-standard.md`

### 修复
- 修复了查询执行计划API的500错误，当查询不存在时现在正确返回404状态码
- 修复了查询执行计划API的404错误，增强了getQueryPlanById方法对ID的查找机制和数据解析能力
- 修复了查询历史记录创建功能，通过使用原生MySQL直接写入历史记录
- 优化了查询历史记录的获取方式，不再依赖Prisma模型，改为直接使用MySQL查询，提高了性能和稳定性

### 新功能
- 添加了explainQuery参数支持，允许获取查询计划而不执行实际查询
- 增强了数据源连接器的错误处理能力，提供更详细的错误信息
- 改进了查询管理界面的日志记录功能

### 变更
- 更新了README.md文件，新增了查询文件夹管理和系统管理API的文档
- 添加了explainQuery参数使用说明，帮助用户更方便地获取执行计划