# DataScope Node 查询服务

DataScope Node 是一个强大的数据查询和管理平台，允许用户创建、管理和执行数据库查询，同时提供丰富的版本控制和状态管理功能。

## 主要功能

- **数据源管理**：连接和管理各种数据库数据源
- **查询服务**：创建和执行SQL查询
- **版本控制**：支持查询的版本管理，包括草稿、发布和废弃流程
- **状态管理**：控制查询服务的运行状态
- **历史记录**：追踪和分析查询执行历史
- **用户管理**：用户认证和权限控制

## 新增功能: 查询服务版本控制与状态管理

最新版本增加了强大的查询服务版本控制和状态管理功能：

### 版本控制特性
- **版本生命周期管理**：支持草稿、发布和废弃等版本状态
- **版本历史记录**：完整追踪每个查询的所有历史版本
- **活跃版本控制**：可以指定特定版本为活跃版本
- **草稿编辑功能**：支持草稿版本的编辑和更新

### 状态管理特性
- **服务状态控制**：支持启用和禁用查询服务
- **状态追踪**：记录状态变更的原因和时间
- **执行控制**：根据服务状态控制查询执行权限

### 执行和历史特性
- **版本化执行**：支持执行特定版本的查询
- **执行历史**：按版本追踪查询执行历史
- **性能分析**：记录和分析查询执行时间和资源使用

### 最近更新

最近对代码库进行了重构和优化：

- **错误处理优化**：统一使用 ApiError 类和 ErrorCode 枚举处理所有错误
- **中间件重构**：将认证中间件重构为更清晰的职责分离模式
- **类型安全增强**：优化 TypeScript 类型定义，提高代码安全性
- **API路由优化**：规范化API路由的导入和使用方式
- **模块导出规范**：修复和优化模块导出，确保跨模块一致性

## 技术栈

- **后端**：Node.js, Express, TypeScript
- **数据库访问**：Prisma ORM
- **API文档**：OpenAPI (Swagger)
- **测试**：Mocha, Chai, SuperTest
- **安全性**：JWT认证，参数化查询

## 安装和运行

1. 克隆仓库
```bash
git clone https://github.com/your-org/DataScope-Node.git
cd DataScope-Node/webService
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建`.env`文件，设置必要的环境变量:
```
DATABASE_URL="mysql://user:password@localhost:3306/datascope"
JWT_SECRET="your-jwt-secret"
PORT=3000
```

4. 运行数据库迁移
```bash
npx prisma migrate dev
```

5. 启动服务
```bash
npm run dev
```

## API 文档

启动服务后，API文档可在以下地址访问:
```
http://localhost:5000/api-docs
```

## 开发

### 数据库迁移

创建新的数据库迁移:
```bash
npx prisma migrate dev --name migration-name
```

应用迁移到数据库:
```bash
npx prisma migrate deploy
```

### 构建项目

```bash
npm run build
```

### 运行测试

```bash
npm test
```

## 许可证

本项目采用 MIT 许可证