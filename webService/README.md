# DataScope Web Service

DataScope是一个强大的数据库性能分析和优化工具，帮助开发人员和数据库管理员理解和改进查询性能。

## 主要功能

- 数据库连接管理：支持MySQL、PostgreSQL等多种数据库系统
- 查询执行和历史记录：跟踪SQL查询历史和执行结果
- 查询计划分析：
  - 可视化查询执行计划
  - 识别查询性能瓶颈
  - 提供优化建议
  - 比较查询计划变更效果
- 元数据管理：浏览数据库结构、表和列信息
- 数据分析：生成表关系图和依赖分析

## 新增功能：查询计划分析与优化

最新版本增加了强大的查询计划分析与优化功能，主要包括：

1. **查询计划转换**
   - 支持MySQL传统EXPLAIN和JSON格式EXPLAIN结果
   - 将不同格式的执行计划转换为标准格式，便于统一处理

2. **性能分析**
   - 自动识别全表扫描、文件排序、临时表使用等常见性能问题
   - 分析索引使用情况，找出低效或缺失的索引
   - 识别连接操作中的优化机会

3. **优化建议**
   - 基于执行计划生成具体优化建议
   - 提供SQL重写建议，如替换通配符LIKE、优化子查询等
   - 根据查询特点推荐索引创建策略

4. **计划比较**
   - 对比优化前后的查询计划
   - 计算性能改进百分比
   - 提供详细的比较报告，突出关键改进点

## 技术栈

- **后端**: Node.js, Express, TypeScript
- **数据库**: MySQL/PostgreSQL (使用Prisma ORM)
- **前端**: React, TypeScript, TailwindCSS
- **API文档**: Swagger

## 安装

```bash
# 克隆仓库
git clone https://github.com/yourorg/datascope.git
cd datascope/webService

# 安装依赖
npm install

# 创建.env文件
cp .env.example .env

# 编辑.env文件，设置数据库连接和其他配置

# 运行数据库迁移
npx prisma migrate dev

# 启动服务器
npm run dev
```

## API接口

主要API端点：

- `/api/datasources` - 数据源管理
- `/api/queries` - 查询执行和历史
- `/api/query-plans` - 查询计划分析和优化
- `/api/metadata` - 数据库元数据

详细API文档请参考 `/api-docs` 路径下的Swagger文档。

## 贡献

欢迎提交PR和Issue！请查看[贡献指南](CONTRIBUTING.md)了解更多信息。

## 许可证

MIT