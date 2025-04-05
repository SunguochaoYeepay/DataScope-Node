# DataScope 前端项目

## 项目简介
DataScope 是一个用于数据库查询和分析的工具，本项目是其前端部分，基于Vue 3和TypeScript开发。

## 技术栈
- Vue 3.3.4
- TypeScript 5.0.2
- Vite 4.4.5
- Vue Router
- Pinia (状态管理)
- Ant Design Vue (UI组件)
- TailwindCSS (样式)
- ECharts (图表可视化)

## 项目结构
```
src/
  ├── assets/        # 静态资源
  ├── components/    # 组件
  │   ├── common/    # 通用组件
  │   ├── datasource/# 数据源相关组件
  │   ├── integration/# 集成相关组件
  │   ├── layout/    # 布局组件
  │   └── query/     # 查询相关组件
  ├── router/        # 路由配置
  ├── services/      # API服务
  ├── stores/        # 状态管理
  ├── types/         # 类型定义
  ├── utils/         # 工具函数
  └── views/         # 页面视图
      ├── datasource/# 数据源相关页面
      ├── integration/# 集成相关页面
      └── query/     # 查询相关页面
```

## API文档

项目根目录下提供了基于前端功能和Mock数据生成的完整Swagger API文档：
- `swagger-updated-full.json`: 包含所有当前实现的API端点和数据模型定义

文档包含以下主要模块：
- 查询管理 API - 涵盖查询的创建、执行、收藏和历史
- 数据源管理 API - 包括数据源连接、测试和同步
- 元数据管理 API - 专注于元数据的提取和查询
- 集成管理 API - 包含集成的创建、配置和预览
- 查询版本管理 API - 包括版本的创建、发布、废弃和激活

可以使用Swagger UI或其他Swagger文档查看工具查看此文档。该文档可用于：
1. 比较当前前端API与新后端架构设计的差异
2. 作为前端适配新后端架构的参考
3. 作为团队成员开发文档

## 功能模块

### 查询模块
- 支持SQL查询编辑和执行
- 查询结果展示和导出
- 查询历史记录管理
- 查询模板保存和复用
- 查询版本管理

### 数据源模块
- 数据源连接管理
- 数据源类型支持(MySQL, PostgreSQL等)
- 数据源测试和监控
- 数据源权限控制

### 集成模块
- 支持多种集成类型：
  - 简单表格(SIMPLE_TABLE)：用于展示简单列表数据
  - 高级表格(TABLE)：支持分页、筛选、排序的复杂表格
  - 图表(CHART)：支持柱状图、折线图、饼图等多种图表类型
- 集成配置和管理
- 与外部系统的API集成
- 数据可视化和分析

## 通用组件
项目中包含以下通用组件：
- `Icon`: 图标组件，支持自定义图标名称、大小和颜色
- `Button`: 按钮组件，支持多种样式、尺寸和状态
- `Modal`: 模态框组件，支持自定义标题、尺寸和关闭方式
- `Pagination`: 分页组件，支持自定义页码显示和页面跳转
- `StatusBadge`: 状态徽章组件，用于显示不同状态
- `DateRangePicker`: 日期范围选择器，支持预设时间段和自定义日期范围
- `ChartView`: 图表展示组件，支持多种图表类型和配置

## API响应格式
所有后端API响应都遵循统一的格式：
```typescript
{
  success: boolean; // 操作是否成功
  data: {           // 返回的数据
    items?: any[];  // 返回的数据列表（如果是列表类型的请求）
    pagination?: {  // 分页信息（如果是分页请求）
      page: number;      // 当前页码
      size: number;      // 每页大小
      total: number;     // 总记录数
      totalPages: number;// 总页数
    }
    // 其他特定API的返回字段
  };
  error?: {         // 错误信息（如果操作失败）
    statusCode: number; // HTTP状态码
    code: string;   // 错误代码
    message: string;// 错误消息
    details?: any;  // 错误详情
  }
}
```

## API适配层
本项目实现了一个API适配层，用于处理前端和后端之间可能存在的数据格式差异。适配层主要包括：

1. **数据类型转换**：确保前后端数据类型一致，例如将枚举类型从大写转换为小写（如'mysql'而非'MYSQL'）。

2. **响应格式适配**：统一处理不同的API响应格式，确保前端组件始终收到一致的数据结构。

3. **分页格式处理**：处理不同的分页响应格式，提供统一的分页接口。

4. **错误处理**：统一错误响应格式，便于全局错误处理和显示。

适配层主要在以下文件中实现：
- `src/services/datasource.ts`：数据源服务适配
- `src/services/query.ts`：查询服务适配
- `src/services/integration.ts`：集成服务适配
- `src/services/queryVersion.ts`：查询版本服务适配

通过适配层，无论后端API如何变化，前端组件都能获得一致的数据接口，降低前后端耦合度。

## 开发指南

### 运行开发服务器

有以下几种方式启动开发服务器（所有方式均使用固定端口8080）：

1. 标准方式:
```bash
npm run dev
```

2. 有需要连接其它设备访问时:
```bash
npm run dev:network
```

以上命令会自动检测并释放端口8080，确保开发服务器能够正常启动。

### 开发工具

在开发过程中，你可以使用以下命令：

```bash
# 清理可能被占用的8080端口
npm run clean:ports

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

### PM2进程管理优势

- 自动管理端口：在启动前自动检测并关闭占用端口的进程
- 进程监控：服务崩溃时自动重启
- 性能监控：监控CPU和内存使用情况
- 日志管理：提供详细的运行日志
- 负载均衡：可配置为集群模式

### 查看PM2运行状态

```bash
# 查看所有PM2管理的进程
npx pm2 list
# 或
npx pm2 ls

# 查看详细日志
npx pm2 logs

# 查看特定应用的日志
npx pm2 logs datascope-ui-dev

# 监控进程状态
npx pm2 monit

# 完全停止PM2守护进程
npx pm2 kill
```

### 模拟数据开发
项目支持使用模拟数据进行开发和测试。模拟数据配置在以下文件：
- `src/services/mockData.ts`: 定义了各种模拟数据对象
- `src/services/api.ts`: 实现了模拟API响应处理

修改模拟数据时注意保持数据结构的一致性，特别是：
1. 集成类型(SIMPLE_TABLE、TABLE、CHART)需要配置相应的字段
2. 图表类型集成需要提供有效的chartConfig配置
3. 查询接口需要返回正确的数据格式

要启用模拟数据，请在`src/stores`中相关store文件中将`USE_MOCK`设置为`true`。

### 使用真实API数据
默认情况下，前端项目配置为使用模拟数据（mock data）。如果要使用真实的后端API数据，需要修改配置：

1. 打开`.env.development`文件
2. 将`VITE_USE_MOCK_API`设置为`false`
3. 确保`VITE_API_BASE_URL`指向正确的后端API地址（默认为`http://localhost:8080`）
4. 重启开发服务器

```bash
# .env.development示例
VITE_API_BASE_URL=http://localhost:8080
VITE_USE_MOCK_API=false
```

如果在开发过程中遇到API请求问题，可以查看浏览器控制台的日志输出，获取详细的请求和响应信息以便调试。

## 开发与构建

### 安装依赖
```bash
npm install
```

### 构建生产版本
```bash
npm run build
```

### 代码检查
```bash
npm run lint
```

## 贡献指南
1. 克隆仓库并创建新分支
2. 安装依赖并启动开发服务器
3. 进行修改并确保通过代码检查
4. 提交代码并创建Pull Request
5. 等待代码审查和合并

## 许可证
[MIT License](LICENSE)

# DataScope UI

DataScope是一个数据分析与可视化平台，用于连接、查询和分析各种数据源。

## 快速开始

```bash
# 安装依赖
npm install

# 开发环境启动
npm run dev

# 构建生产版本
npm run build
```

## 项目架构

```
webview-ui/              # 前端项目根目录
├── public/              # 静态资源
├── src/                 # 源代码
│   ├── assets/          # 资源文件
│   ├── components/      # 通用组件
│   ├── config/          # 配置文件
│   ├── mock/            # Mock服务（新）
│   ├── plugins/         # 插件
│   ├── router/          # 路由配置
│   ├── services/        # API服务
│   ├── stores/          # 状态管理
│   ├── types/           # 类型定义
│   ├── utils/           # 工具函数
│   ├── views/           # 页面组件
│   ├── App.vue          # 主应用组件
│   └── main.ts          # 入口文件
├── .env                 # 环境变量
├── .env.development     # 开发环境变量
├── vite.config.ts       # Vite配置
└── package.json         # 项目依赖
```

## Mock服务重构计划

由于项目历史原因，当前的Mock服务分散在多个文件中，导致管理困难且容易引起冲突。我们计划进行重构，但需要保证现有功能不受影响。

### 现有Mock系统的分布

Mock相关代码主要分布在以下位置：

1. `src/services/api.ts` - 提供了Mock API服务及setupMock函数
2. `src/plugins/serverMock.ts` - 提供Vite服务器中间件实现
3. `src/services/datasource.ts` - 包含数据源模拟数据和处理逻辑
4. `src/utils/http.ts` - 包含HTTP请求的Mock处理
5. `src/services/mockData.ts` - 包含各种模拟数据
6. `src/plugins/fetch-interceptor.ts` - 拦截fetch请求

### 重构策略 (谨慎渐进式)

为确保不破坏现有功能，我们采用以下策略：

1. **创建统一的Mock模块**
   - 在`src/mock/`目录下建立新的模块化结构
   - 不立即删除现有代码，而是逐步迁移功能

2. **确保兼容性**
   - 创建兼容层，保证旧Mock代码可以在需要时正常工作
   - 保留关键变量如`USE_MOCK`，确保开关逻辑一致  

3. **分阶段迁移**
   - 第一阶段：建立基础架构，创建统一配置
   - 第二阶段：迁移数据模型和服务到新结构
   - 第三阶段：迁移拦截器和中间件
   - 第四阶段：切换入口点，启用新系统
   - 最终阶段：移除旧代码（仅当确认新系统完全可用）

4. **测试保证**
   - 每个迁移步骤都需要进行功能测试
   - 确保新旧系统可以并存运行

### Mock数据保留策略

在迁移过程中，确保以下数据不会丢失：

1. `mockDataSources` - 数据源模拟数据
2. Mock处理逻辑（路由、响应格式等）
3. `setupMock`函数的核心功能
4. 中间件响应处理逻辑
5. 请求拦截和响应处理机制

### 注意事项

- **不要直接删除**旧的Mock代码，直到新系统完全验证通过
- 确保环境变量和开关保持一致，避免配置冲突
- 保持API响应格式一致，避免前端组件出现兼容性问题

## 环境变量

- `VITE_API_BASE_URL` - API基础路径
- `VITE_USE_MOCK_API` - 是否启用Mock服务