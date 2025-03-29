# DataScope UI组件设计

## 基础组件库

使用 Tailwind CSS 作为样式框架，FontAwesome 作为图标库。

### 输入组件

#### 文本输入 (TextInput)
```html
<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2">
    标签文本
  </label>
  <input type="text" 
         class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
         placeholder="请输入...">
</div>
```

#### 数字输入 (NumberInput)
```html
<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2">
    数字输入
  </label>
  <input type="number" 
         class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
         min="0" step="1">
</div>
```

#### 日期选择器 (DatePicker)
```html
<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2">
    日期选择
  </label>
  <input type="date" 
         class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
</div>
```

#### 下拉选择 (Select)
```html
<div class="mb-4">
  <label class="block text-gray-700 text-sm font-bold mb-2">
    下拉选择
  </label>
  <select class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
    <option value="">请选择...</option>
    <option value="1">选项1</option>
    <option value="2">选项2</option>
  </select>
</div>
```

### 展示组件

#### 数据表格 (Table)
```html
<div class="overflow-x-auto">
  <table class="min-w-full bg-white">
    <thead>
      <tr class="bg-gray-100">
        <th class="px-6 py-3 border-b-2 border-gray-200 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          列标题
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="px-6 py-4 whitespace-nowrap border-b border-gray-200">
          单元格内容
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

#### 分页器 (Pagination)
```html
<div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
  <div class="flex justify-between flex-1 sm:hidden">
    <button class="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
      上一页
    </button>
    <button class="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
      下一页
    </button>
  </div>
</div>
```

### 功能组件

#### 搜索框 (SearchInput)
```html
<div class="relative">
  <input type="search" 
         class="w-full pl-10 pr-4 py-2 border rounded-lg shadow focus:outline-none focus:shadow-outline"
         placeholder="搜索...">
  <div class="absolute left-3 top-2">
    <i class="fas fa-search text-gray-400"></i>
  </div>
</div>
```

#### 范围输入 (RangeInput)
```html
<div class="flex space-x-2">
  <input type="text" 
         class="w-1/2 px-3 py-2 border rounded shadow focus:outline-none focus:shadow-outline"
         placeholder="最小值">
  <span class="text-gray-500 self-center">-</span>
  <input type="text" 
         class="w-1/2 px-3 py-2 border rounded shadow focus:outline-none focus:shadow-outline"
         placeholder="最大值">
</div>
```

## 数据类型映射

### 基础类型映射

| 数据库类型 | UI组件 | 验证规则 |
|------------|--------|----------|
| varchar    | TextInput | maxLength |
| char       | TextInput | length |
| text       | TextArea | maxLength |
| int        | NumberInput | min, max |
| bigint     | NumberInput | min, max |
| decimal    | NumberInput | precision, scale |
| datetime   | DateTimePicker | min, max |
| date       | DatePicker | min, max |
| time       | TimePicker | - |
| boolean    | Switch | - |
| enum       | Select | options |

### 特殊类型映射

| 业务类型 | UI组件 | 掩码规则 |
|----------|--------|----------|
| 手机号   | TextInput | \*\*\*\*\*\*\*\*\*\*\* |
| 身份证   | TextInput | \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* |
| 银行卡   | TextInput | \*\*\*\*\*\*\*\*\*\*\*\*\*\*\*\* |
| 邮箱     | TextInput | \*\*\*@domain.com |
| 密码     | PasswordInput | \*\*\*\*\*\*\*\* |

## 布局模板

### 查询表单
```html
<div class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
  <div class="grid grid-cols-3 gap-4">
    <!-- 查询条件 -->
    <div class="col-span-3 sm:col-span-1">
      <!-- 输入组件 -->
    </div>
  </div>
  
  <div class="flex items-center justify-end mt-4">
    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2">
      查询
    </button>
    <button class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
      重置
    </button>
  </div>
</div>
```

### 数据列表
```html
<div class="bg-white shadow-md rounded">
  <div class="px-4 py-3 border-b border-gray-200">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-medium text-gray-900">数据列表</h3>
      <div class="flex space-x-2">
        <!-- 操作按钮 -->
      </div>
    </div>
  </div>
  
  <!-- 数据表格 -->
  
  <!-- 分页器 -->
</div>
```

## 响应式设计

### 断点定义
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### 响应式类
- 隐藏元素: hidden sm:block
- 栅格列数: grid-cols-1 sm:grid-cols-2 md:grid-cols-3
- 宽度适配: w-full sm:w-auto
- 边距调整: m-2 sm:m-4
- 字体大小: text-sm sm:text-base

## 主题定制

### 颜色系统
```css
:root {
  --primary: #3B82F6;    /* 主色 */
  --success: #10B981;    /* 成功 */
  --warning: #F59E0B;    /* 警告 */
  --danger: #EF4444;     /* 危险 */
  --info: #60A5FA;       /* 信息 */
  --text: #1F2937;       /* 文本 */
  --border: #E5E7EB;     /* 边框 */
  --background: #F3F4F6; /* 背景 */
}
```

### 间距系统
```css
:root {
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
}
```

### 字体系统
```css
:root {
  --font-sans: ui-sans-serif, system-ui, -apple-system;
  --font-serif: ui-serif, Georgia;
  --font-mono: ui-monospace, monospace;
}