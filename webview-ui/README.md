# DataScope 前端项目

## 项目简介
DataScope 是一个用于数据库查询和分析的工具，本项目是其前端部分，基于Vue 3和TypeScript开发。

## 技术栈
- Vue 3.3.4
- TypeScript 5.0.2
- Vite 4.4.5
- Vue Router
- Pinia (状态管理)
- TailwindCSS (样式)

## 项目结构
```
src/
  ├── assets/        # 静态资源
  ├── components/    # 组件
  │   ├── common/    # 通用组件
  │   ├── datasource/# 数据源相关组件
  │   ├── layout/    # 布局组件
  │   └── query/     # 查询相关组件
  ├── router/        # 路由配置
  ├── services/      # API服务
  ├── stores/        # 状态管理
  ├── types/         # 类型定义
  ├── utils/         # 工具函数
  └── views/         # 页面视图
      ├── datasource/# 数据源相关页面
      └── query/     # 查询相关页面
```

## 通用组件
项目中包含以下通用组件：
- `Icon`: 图标组件，支持自定义图标名称、大小和颜色
- `Button`: 按钮组件，支持多种样式、尺寸和状态
- `Modal`: 模态框组件，支持自定义标题、尺寸和关闭方式
- `Pagination`: 分页组件，支持自定义页码显示和页面跳转
- `StatusBadge`: 状态徽章组件，用于显示不同状态
- `DateRangePicker`: 日期范围选择器，支持预设时间段和自定义日期范围

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
    code: string;   // 错误代码
    message: string;// 错误消息
  }
}
```

## 开发规范

### 命名规范
- 组件文件名：使用PascalCase，如`DataTable.vue`
- 页面文件名：使用PascalCase，如`QueryHistory.vue`
- 工具文件名：使用camelCase，如`formatters.ts`
- CSS类名：使用kebab-case，如`query-list`
- 变量名：使用camelCase，如`queryResult`
- 常量名：使用UPPER_SNAKE_CASE，如`API_BASE_URL`
- 接口名：使用PascalCase，前缀为I，如`IQueryResult`
- 类型名：使用PascalCase，如`QueryResult`

### TypeScript规范
- 所有代码必须使用TypeScript编写
- 所有函数都要有返回类型声明
- 所有变量都要有类型声明
- 避免使用`any`类型，尽量使用具体类型或泛型
- 使用接口（interface）定义对象结构
- 使用类型别名（type）定义联合类型或交叉类型

### 组件规范
- 使用Vue 3的Composition API
- 组件的props必须定义类型和默认值
- 组件的emits必须声明
- 组件的方法和计算属性应该有明确的命名
- 组件的样式应该使用scoped或module模式
- 组件应该有必要的注释说明其功能和用法

### 提交规范
- 提交信息应该清晰表明本次修改的内容
- 提交前应该运行linter确保代码质量
- 每次提交应该专注于一个功能或修复
- 提交信息格式：`类型(范围): 描述`，如`fix(query): 修复查询历史不显示的问题`

## 开发与构建

### 安装依赖
```bash
npm install
```

### 开发环境启动
```bash
npm run dev
```

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