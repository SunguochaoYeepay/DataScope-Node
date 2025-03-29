# DataScope-Node

数据库连接和查询可视化工具，支持多种数据库的连接、查询和元数据管理。

## 功能特点

- **数据源管理**：创建、编辑和管理多种类型的数据库连接
- **SQL查询**：执行SQL查询并以表格形式查看结果
- **查询历史**：自动保存查询历史记录
- **元数据浏览**：浏览数据库表结构、关系和字段信息
- **查询保存**：保存常用查询以便快速访问
- **数据可视化**：将查询结果转换为直观的图表（待实现）

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

## 快速开始

### 安装依赖

```bash
# 后端依赖
cd webService
npm install

# 前端依赖
cd ../webview-ui
npm install
```

### 启动开发环境

```bash
# 后端服务
cd webService
npm run dev

# 前端开发服务器
cd ../webview-ui
npm run dev
```

### 构建生产版本

```bash
# 后端构建
cd webService
npm run build

# 前端构建
cd ../webview-ui
npm run build
```

## API文档

启动后端服务后，可以通过以下地址访问API文档：

```
http://localhost:3000/api-docs
```

## 数据库初始化

首次运行需要初始化数据库，可以使用以下两种方式：

### 方式一：使用Prisma CLI（推荐用于开发环境）

```bash
cd webService
npx prisma migrate dev
```

### 方式二：使用初始化脚本（适用于生产环境）

```bash
cd webService
npm run init:db
```

这个脚本会自动进行以下操作：
- 检查数据库连接
- 运行Prisma迁移
- 生成Prisma客户端
- 创建必要的目录结构

## 许可证

MIT
