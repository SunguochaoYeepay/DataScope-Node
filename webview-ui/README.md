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

## 功能模块

### 查询模块
- 支持SQL查询编辑和执行
- 查询结果展示和导出
- 查询历史记录管理
- 查询模板保存和复用

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

通过适配层，无论后端API如何变化，前端组件都能获得一致的数据接口，降低前后端耦合度。

## 开发指南

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

### 开发环境启动
```bash
npm run dev
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