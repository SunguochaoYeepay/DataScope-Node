# DataScope-Node 后端服务

DataScope-Node 是一个强大的数据库可视化查询工具后端服务，提供了数据源管理、查询执行、元数据分析和低代码导出等功能。

## 功能特性

- **数据源管理**：添加、编辑、删除和测试各种数据库连接
- **SQL查询执行**：执行SQL查询并获取结果，支持参数化查询
- **查询管理**：保存、共享和重用SQL查询
- **元数据分析**：探索数据库架构、表结构和关系
- **元数据同步**：自动同步数据源中的表结构和关系到系统中
- **数据预览**：直接在界面中预览表数据
- **低代码导出**：将表结构导出为低代码平台可用的JSON格式

## 技术栈

- Node.js + TypeScript
- Express.js：Web 框架
- Prisma ORM：数据库ORM
- MySQL：支持MySQL数据源连接
- Winston：日志记录
- Swagger：API文档

## 快速开始

### 环境要求

- Node.js 16+
- MySQL 5.7+

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件，配置必要的环境变量：

```
# 服务配置
PORT=3000
NODE_ENV=development

# 数据库配置
DATABASE_URL="mysql://用户名:密码@localhost:3306/datascope_dev"

# 日志配置
LOG_LEVEL=debug

# API配置
API_PREFIX=/api/v1

# 安全配置
ENCRYPTION_KEY="datascope-secure-encryption-key-2023"
```

### 数据库初始化

方法一：使用初始化脚本（推荐）
```bash
# 运行数据库初始化脚本
npm run init:db
```

方法二：手动初始化
```bash
# 创建数据库
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS datascope_dev CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 推送Prisma模型
npx prisma db push

# 生成Prisma客户端
npx prisma generate
```

### 加载示例数据（可选）

```bash
# 运行数据种子脚本，加载示例数据源和示例查询
npx ts-node scripts/seed.ts
```

### 启动服务

开发模式：
```bash
npm run dev
```

生产模式：
```bash
npm run build
npm start
```

## API文档

启动服务后，访问 `http://localhost:3000/api-docs` 查看API文档。

## 项目结构

```
webService/
├── prisma/               # Prisma 数据库模型
│   └── schema.prisma     # 数据库模型定义
├── scripts/              # 脚本文件
│   ├── init-db.ts        # 数据库初始化脚本
│   └── seed.ts           # 示例数据种子脚本
├── src/                  # 源代码
│   ├── api/              # API相关代码
│   │   ├── controllers/  # 控制器
│   │   ├── middlewares/  # 中间件
│   │   └── routes/       # 路由
│   ├── config/           # 配置文件
│   ├── services/         # 服务层
│   │   └── database/     # 数据库服务
│   ├── types/            # 类型定义
│   └── utils/            # 工具函数
├── .env                  # 环境变量
├── package.json          # 项目依赖
└── tsconfig.json         # TypeScript配置
```

## 核心模块

### 数据源管理

- 支持添加、编辑、删除数据源
- 支持测试数据源连接
- 支持查看数据源详情和列表

### 查询执行

- 支持执行SQL查询，返回结果集
- 支持查询参数化
- 查询执行历史记录

### 元数据分析

- 获取数据库架构列表
- 获取表列表
- 获取表结构（列、主键、外键、索引）
- 预览表数据

### 元数据同步

- 支持全量和增量同步数据源结构
- 自动识别表、视图、列、主键和外键关系
- 同步历史记录和状态跟踪
- 支持过滤特定的架构或表

### 低代码导出

- 将表结构导出为JSON格式，适用于低代码平台

## 支持的数据库类型

目前支持的数据库类型：
- MySQL

计划支持的数据库类型：
- PostgreSQL
- SQL Server
- Oracle

## 许可证

MIT