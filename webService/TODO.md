# 数据库查询计划功能问题修复清单

## 已解决问题
1. 修复了QueryPlan类型定义中planNodes、warnings和optimizationTips属性为可选的问题
2. 添加了getQueryPlan方法和isJsonExplainSupported属性，提高类型兼容性
3. 修复了ApiError构造函数参数类型不一致问题
4. 修复了查询计划可视化控制器中的类型问题，增加null检查
5. 改进了MySQL连接器的初始化和错误处理逻辑
6. 统一了数据库接口类型定义

## 待解决问题
1. Prisma模型问题：
   - 需要添加QueryPlan与Query的显式关系定义
   - 需要修改字段名不一致问题(sql vs sqlContent)

2. API路由和控制器问题：
   - 路由文件中的方法名与控制器实现不匹配
   - 需要统一命名并更新引用

3. 类型转换问题：
   - mysql-query-plan-converter中需要修复类型转换
   - 需要统一ExplainRow[]与QueryPlan的转换机制

4. 性能分析问题：
   - 查询计划分析器中的性能关注点类型不匹配
   - 需要统一PerformanceConcern相关接口

5. Prisma生成问题：
   - 需要重新生成Prisma客户端以匹配更新后的模型定义

## 后续工作
1. 完成上述修复后运行全面测试
2. 更新文档说明新增功能的使用方法
3. 考虑添加更多数据库类型的查询计划支持
4. 改进查询计划可视化和比较功能的用户体验