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

### 修复
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

### Fixed
- 改进查询管理接口(POST /api/queries, PUT /api/queries/{id}, DELETE /api/queries/{id})的错误处理，提供更详细的错误信息

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

## 更新日志 (2025-03-31)

### 新增功能

- 添加简化版元数据API路径: `/api/metadata/{dataSourceId}/tables` 和 `/api/metadata/{dataSourceId}/tables/{tableName}`，支持前端兼容性
- 添加元数据同步兼容路径: `/api/metadata/sync/{dataSourceId}` 和 `/api/metadata/{dataSourceId}/sync`，完善与前端的集成

### 修复问题

- **数据库连接问题**: 修复了数据库连接器在容器环境和本地环境中的主机名解析问题，现在系统会根据环境变量 `CONTAINER_ENV` 自动将容器名称解析为 localhost 或实际容器名
- **元数据同步问题**: 修复了元数据同步接口中使用原始 SQL 查询导致的语法错误问题，改用 Prisma ORM API
- **元数据表丢失问题**: 使用 `prisma db push`