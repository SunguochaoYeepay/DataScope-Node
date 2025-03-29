<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useQueryStore } from '@/stores/query';
import { useMessageStore } from '@/stores/message';
import type { TableConfig, TableColumn, TableAction, PaginationConfig, ExportConfig } from '@/types/integration';
import { ColumnAlign } from '@/types/integration';

// 组件属性
const props = defineProps<{
  modelValue: TableConfig;
  queryId?: string;
}>();

// 组件事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: TableConfig): void;
}>();

// Store
const queryStore = useQueryStore();
const message = useMessageStore();

// 状态
const tableConfig = reactive<TableConfig>({
  columns: [],
  actions: [],
  pagination: {
    enabled: true,
    pageSize: 10,
    pageSizeOptions: [10, 20, 50, 100]
  },
  export: {
    enabled: true,
    formats: ['CSV', 'EXCEL'],
    maxRows: 1000
  },
  // 新增: 批量操作配置
  batchActions: [],
  // 新增: 数据聚合配置  
  aggregation: {
    enabled: false,
    groupByFields: [],
    aggregationFunctions: []
  },
  // 新增: 高级过滤配置
  advancedFilters: {
    enabled: false,
    defaultFilters: [],
    savedFilters: []
  }
});

// 编辑状态
const editingColumn = ref<TableColumn | null>(null);
const isAddingColumn = ref(false);
const isEditMode = ref(false);
const availableColumns = ref<Array<{ field: string; label: string; type: string }>>([]);
const editingAction = ref<TableAction | null>(null);
const isAddingAction = ref(false);
const isEditingAction = ref(false);

// 添加tab选择状态
const activeTab = ref('columns'); // 默认显示列配置

// 新增: 过滤条件编辑状态
const isEditingFilter = ref(false);
const editingFilter = ref<any>(null);
const filterConditionTypes = [
  { value: 'equals', label: '等于' },
  { value: 'notEquals', label: '不等于' },
  { value: 'contains', label: '包含' },
  { value: 'notContains', label: '不包含' },
  { value: 'startsWith', label: '开头是' },
  { value: 'endsWith', label: '结尾是' },
  { value: 'greaterThan', label: '大于' },
  { value: 'lessThan', label: '小于' },
  { value: 'between', label: '介于' },
  { value: 'in', label: '在列表中' },
  { value: 'isNull', label: '为空' },
  { value: 'isNotNull', label: '不为空' }
];

// 新增: 批量操作编辑状态
const isEditingBatchAction = ref(false);
const editingBatchAction = ref<any>(null);

// 新增: 聚合编辑状态
const isEditingAggregation = ref(false);
const aggregationFunctions = [
  { value: 'sum', label: '求和' },
  { value: 'avg', label: '平均值' },
  { value: 'min', label: '最小值' },
  { value: 'max', label: '最大值' },
  { value: 'count', label: '计数' },
  { value: 'countDistinct', label: '去重计数' }
];

// 选项定义
const alignOptions = [
  { value: ColumnAlign.LEFT, label: '左对齐' },
  { value: ColumnAlign.CENTER, label: '居中' },
  { value: ColumnAlign.RIGHT, label: '右对齐' }
];

const maskTypeOptions = [
  { value: 'NONE', label: '不屏蔽' },
  { value: 'FULL', label: '完全屏蔽' },
  { value: 'PARTIAL', label: '部分屏蔽' },
  { value: 'CUSTOM', label: '自定义' }
];

const actionTypeOptions = [
  { value: 'link', label: '链接' },
  { value: 'button', label: '按钮' },
  { value: 'menu', label: '菜单项' }
];

// 计算属性
const sortedColumns = computed(() => {
  return [...tableConfig.columns].sort((a, b) => a.displayOrder - b.displayOrder);
});

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    tableConfig.columns = [...newValue.columns];
    tableConfig.actions = [...newValue.actions];
    tableConfig.pagination = { ...newValue.pagination };
    tableConfig.export = { ...newValue.export };
    
    // 新增: 同步新增的配置
    tableConfig.batchActions = [...(newValue.batchActions || [])];
    tableConfig.aggregation = newValue.aggregation 
      ? { ...newValue.aggregation }
      : { enabled: false, groupByFields: [], aggregationFunctions: [] };
    tableConfig.advancedFilters = newValue.advancedFilters
      ? { ...newValue.advancedFilters }
      : { enabled: false, defaultFilters: [], savedFilters: [] };
  }
}, { deep: true });

// 监听tableConfig变化，触发更新事件
watch(tableConfig, (newValue) => {
  emit('update:modelValue', {
    columns: [...newValue.columns],
    actions: [...newValue.actions],
    pagination: { ...newValue.pagination },
    export: { ...newValue.export },
    // 新增: 加入新配置
    batchActions: [...newValue.batchActions],
    aggregation: { ...newValue.aggregation },
    advancedFilters: { ...newValue.advancedFilters }
  });
}, { deep: true });

// 监听queryId变化
watch(() => props.queryId, async (newValue) => {
  if (newValue) {
    await loadQueryColumns(newValue);
  }
});

// 生命周期钩子
onMounted(async () => {
  // 加载查询列
  if (props.queryId) {
    await loadQueryColumns(props.queryId);
  }
});

// 加载查询列
const loadQueryColumns = async (queryId: string) => {
  try {
    const query = await queryStore.fetchQueryById(queryId);
    
    if (query) {
      // 解析查询结果列 - 确保处理可能为空的查询列
      const columns = query.columns || [];
      
      // 指定column的类型
      interface QueryColumn {
        name: string;
        label?: string;
        type?: string;
      }
      
      availableColumns.value = columns.map((column: QueryColumn) => ({
        field: column.name || '',
        label: column.label || column.name || '',
        type: column.type ? mapDatabaseTypeToColumnType(column.type) : 'TEXT'
      }));
      
      // 如果没有列，自动从查询结果生成
      if (tableConfig.columns.length === 0 && availableColumns.value.length > 0) {
        autoGenerateColumns();
      }
    }
  } catch (error) {
    console.error('加载查询列失败', error);
    message.error('加载查询列失败');
  }
};

// 数据库类型映射到列类型
const mapDatabaseTypeToColumnType = (dbType: string): string => {
  const type = dbType.toLowerCase();
  
  if (type.includes('varchar') || type.includes('char') || type.includes('text')) {
    return 'TEXT';
  } else if (type.includes('int') || type.includes('decimal') || type.includes('float') || type.includes('double')) {
    return 'NUMBER';
  } else if (type.includes('date') && type.includes('time')) {
    return 'DATETIME';
  } else if (type.includes('date')) {
    return 'DATE';
  } else if (type.includes('bool')) {
    return 'BOOLEAN';
  }
  
  return 'TEXT';
};

// 自动生成表格列
const autoGenerateColumns = () => {
  // 从可用列自动生成表格列
  const columns: TableColumn[] = availableColumns.value.map((column, index) => ({
    field: column.field,
    label: column.label,
    type: column.type,
    sortable: true,
    filterable: true,
    align: ColumnAlign.LEFT,
    maskType: 'NONE',
    visible: true,
    displayOrder: index,
    // 新增: 列过滤条件
    filterConfig: {
      operators: ['equals', 'contains'],
      defaultValue: null,
      multiple: false
    }
  }));
  
  tableConfig.columns = columns;
};

// 添加列
const addColumn = () => {
  isAddingColumn.value = true;
  isEditMode.value = false;
  
  editingColumn.value = {
    field: '',
    label: '',
    type: 'TEXT',
    displayType: 'TEXT',
    sortable: true,
    filterable: true,
    align: ColumnAlign.LEFT,
    visible: true,
    displayOrder: tableConfig.columns.length,
    // 新增: 列过滤条件
    filterConfig: {
      operators: ['equals', 'contains'],
      defaultValue: null,
      multiple: false
    }
  };
};

// 编辑列
const editColumn = (column: TableColumn) => {
  isAddingColumn.value = false;
  isEditMode.value = true;
  
  // 创建副本进行编辑
  editingColumn.value = { ...column };
  
  // 确保有过滤配置
  if (!editingColumn.value.filterConfig) {
    editingColumn.value.filterConfig = {
      operators: ['equals', 'contains'],
      defaultValue: null,
      multiple: false
    };
  }
};

// 保存列
const saveColumn = () => {
  if (!editingColumn.value) return;
  
  // 验证
  if (!editingColumn.value.field) {
    message.error('请选择字段');
    return;
  }
  
  if (!editingColumn.value.label) {
    message.error('请输入标签名称');
    return;
  }
  
  if (isEditMode.value) {
    // 更新现有列
    const index = tableConfig.columns.findIndex(c => c.field === editingColumn.value!.field);
    if (index !== -1) {
      tableConfig.columns[index] = { ...editingColumn.value };
    }
  } else {
    // 添加新列
    tableConfig.columns.push({ ...editingColumn.value });
  }
  
  // 重置编辑状态
  editingColumn.value = null;
  isAddingColumn.value = false;
  isEditMode.value = false;
};

// 取消编辑列
const cancelEditColumn = () => {
  editingColumn.value = null;
  isAddingColumn.value = false;
  isEditMode.value = false;
};

// 删除列
const deleteColumn = (column: any) => {
  const index = tableConfig.columns.findIndex(c => c.field === column.field);
  if (index !== -1) {
    tableConfig.columns.splice(index, 1);
    // 重新调整顺序
    tableConfig.columns.forEach((col, idx) => {
      col.displayOrder = idx;
    });
  }
};

// 移动列
const moveColumn = (field: string, direction: 'up' | 'down') => {
  const index = tableConfig.columns.findIndex(c => c.field === field);
  if (index === -1) return;
  
  if (direction === 'up' && index > 0) {
    // 向上移动
    const temp = tableConfig.columns[index].displayOrder;
    tableConfig.columns[index].displayOrder = tableConfig.columns[index - 1].displayOrder;
    tableConfig.columns[index - 1].displayOrder = temp;
  } else if (direction === 'down' && index < tableConfig.columns.length - 1) {
    // 向下移动
    const temp = tableConfig.columns[index].displayOrder;
    tableConfig.columns[index].displayOrder = tableConfig.columns[index + 1].displayOrder;
    tableConfig.columns[index + 1].displayOrder = temp;
  }
};

// 选择字段改变
const handleColumnFieldChange = (event: Event) => {
  if (!editingColumn.value) return;
  
  const target = event.target as HTMLSelectElement;
  const field = target?.value;
  
  // 查找对应的字段信息
  const columnInfo = availableColumns.value.find(f => f.field === field);
  if (columnInfo) {
    editingColumn.value.field = columnInfo.field;
    editingColumn.value.label = columnInfo.label;
    editingColumn.value.type = columnInfo.type;
    editingColumn.value.displayType = editingColumn.value.displayType || 'TEXT';
  }
};

// 添加操作
const addAction = () => {
  isAddingAction.value = true;
  isEditingAction.value = false;
  
  editingAction.value = {
    type: 'button',
    label: '',
    handler: '',
    icon: 'fas fa-external-link-alt'
  };
};

// 编辑操作
const editAction = (index: number) => {
  isAddingAction.value = false;
  isEditingAction.value = true;
  
  // 创建副本进行编辑
  editingAction.value = { ...tableConfig.actions[index] };
};

// 保存操作
const saveAction = () => {
  if (!editingAction.value) return;
  
  // 验证
  if (!editingAction.value.label) {
    message.error('请输入操作名称');
    return;
  }
  
  if (!editingAction.value.handler) {
    message.error('请输入处理函数名称');
    return;
  }
  
  if (isEditingAction.value) {
    // 更新现有操作
    const index = tableConfig.actions.findIndex(a => a.label === editingAction.value!.label);
    if (index !== -1) {
      tableConfig.actions[index] = { ...editingAction.value };
    }
  } else {
    // 添加新操作
    tableConfig.actions.push({ ...editingAction.value });
  }
  
  // 重置编辑状态
  editingAction.value = null;
  isAddingAction.value = false;
  isEditingAction.value = false;
};

// 取消编辑操作
const cancelEditAction = () => {
  editingAction.value = null;
  isAddingAction.value = false;
  isEditingAction.value = false;
};

// 删除操作
const deleteAction = (index: number) => {
  tableConfig.actions.splice(index, 1);
};

// 获取列对齐方式名称
const getAlignName = (align: ColumnAlign): string => {
  const option = alignOptions.find(opt => opt.value === align);
  return option ? option.label : align;
};

// 获取屏蔽类型名称
const getMaskTypeName = (type: string): string => {
  const option = maskTypeOptions.find(opt => opt.value === type);
  return option ? option.label : type;
};

// 新增: 添加批量操作
const addBatchAction = () => {
  isEditingBatchAction.value = true;
  editingBatchAction.value = {
    id: `batch_${Date.now()}`,
    label: '',
    icon: 'fas fa-tasks',
    type: 'button',
    handler: '',
    requiresSelection: true,
    confirmationRequired: false,
    confirmationMessage: ''
  };
};

// 新增: 保存批量操作
const saveBatchAction = () => {
  if (!editingBatchAction.value) return;
  
  // 验证
  if (!editingBatchAction.value.label) {
    message.error('请输入批量操作名称');
    return;
  }
  
  if (!editingBatchAction.value.handler) {
    message.error('请输入处理函数名称');
    return;
  }
  
  const existingIndex = tableConfig.batchActions.findIndex(a => a.id === editingBatchAction.value.id);
  if (existingIndex !== -1) {
    // 更新现有批量操作
    tableConfig.batchActions[existingIndex] = { ...editingBatchAction.value };
  } else {
    // 添加新批量操作
    tableConfig.batchActions.push({ ...editingBatchAction.value });
  }
  
  // 重置编辑状态
  editingBatchAction.value = null;
  isEditingBatchAction.value = false;
};

// 新增: 删除批量操作
const deleteBatchAction = (id: string) => {
  const index = tableConfig.batchActions.findIndex(a => a.id === id);
  if (index !== -1) {
    tableConfig.batchActions.splice(index, 1);
  }
};

// 新增: 添加数据聚合配置
const editAggregationSettings = () => {
  isEditingAggregation.value = true;
};

// 新增: 保存数据聚合配置
const saveAggregationSettings = () => {
  // 验证配置
  if (tableConfig.aggregation.enabled && tableConfig.aggregation.groupByFields.length === 0) {
    message.error('请至少选择一个分组字段');
    return;
  }
  
  isEditingAggregation.value = false;
};

// 新增: 添加高级筛选条件
const addAdvancedFilter = () => {
  isEditingFilter.value = true;
  editingFilter.value = {
    id: `filter_${Date.now()}`,
    name: '',
    conditions: [
      {
        field: '',
        operator: 'equals',
        value: null,
        logic: 'AND'
      }
    ],
    isDefault: false
  };
};

// 新增: 添加条件到当前筛选器
const addConditionToFilter = () => {
  if (editingFilter.value) {
    editingFilter.value.conditions.push({
      field: '',
      operator: 'equals',
      value: null,
      logic: 'AND'
    });
  }
};

// 新增: 删除筛选器中的条件
const removeConditionFromFilter = (index: number) => {
  if (editingFilter.value && editingFilter.value.conditions.length > 1) {
    editingFilter.value.conditions.splice(index, 1);
  }
};

// 新增: 保存高级筛选条件
const saveAdvancedFilter = () => {
  if (!editingFilter.value) return;
  
  // 验证
  if (!editingFilter.value.name) {
    message.error('请输入筛选器名称');
    return;
  }
  
  for (const condition of editingFilter.value.conditions) {
    if (!condition.field) {
      message.error('请为所有条件选择字段');
      return;
    }
  }
  
  const existingIndex = tableConfig.advancedFilters.savedFilters.findIndex(
    f => f.id === editingFilter.value.id
  );
  
  if (existingIndex !== -1) {
    // 更新现有筛选器
    tableConfig.advancedFilters.savedFilters[existingIndex] = { ...editingFilter.value };
  } else {
    // 添加新筛选器
    tableConfig.advancedFilters.savedFilters.push({ ...editingFilter.value });
  }
  
  // 如果是默认筛选器，更新默认筛选器列表
  if (editingFilter.value.isDefault) {
    // 如果不在默认筛选器列表中，添加进去
    const inDefaultList = tableConfig.advancedFilters.defaultFilters.some(
      f => f.id === editingFilter.value.id
    );
    
    if (!inDefaultList) {
      tableConfig.advancedFilters.defaultFilters.push(editingFilter.value.id);
    }
  } else {
    // 从默认筛选器列表中移除
    tableConfig.advancedFilters.defaultFilters = tableConfig.advancedFilters.defaultFilters.filter(
      id => id !== editingFilter.value.id
    );
  }
  
  // 重置编辑状态
  editingFilter.value = null;
  isEditingFilter.value = false;
};

// 新增: 删除高级筛选条件
const deleteAdvancedFilter = (id: string) => {
  // 从保存的筛选器列表中删除
  tableConfig.advancedFilters.savedFilters = tableConfig.advancedFilters.savedFilters.filter(
    f => f.id !== id
  );
  
  // 从默认筛选器列表中删除
  tableConfig.advancedFilters.defaultFilters = tableConfig.advancedFilters.defaultFilters.filter(
    filterId => filterId !== id
  );
};

// 新增: 获取操作类型名称
const getFilterOperatorName = (operator: string): string => {
  const option = filterConditionTypes.find(opt => opt.value === operator);
  return option ? option.label : operator;
};

// 在script部分添加toggleBatchActions方法
// 在methods或常规函数部分添加
const toggleBatchActions = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.checked && tableConfig.batchActions.length === 0) {
    // 如果启用但没有批量操作，添加一个默认的批量操作
    addBatchAction();
  } else if (!target.checked && tableConfig.batchActions.length > 0) {
    // 如果禁用但有批量操作，清空批量操作
    tableConfig.batchActions = [];
  }
};

// 添加高级设置展开/折叠状态
const showAdvancedSettings = ref(false);

// 切换高级设置显示状态
const toggleAdvancedSettings = () => {
  showAdvancedSettings.value = !showAdvancedSettings.value;
};

// 添加上移和下移列的函数
const moveColumnUp = (column: any) => {
  if (column.displayOrder > 0) {
    // 找到要交换的上一个元素
    const upperColumn = tableConfig.columns.find(c => c.displayOrder === column.displayOrder - 1);
    if (upperColumn) {
      upperColumn.displayOrder += 1;
      column.displayOrder -= 1;
    }
  }
};

const moveColumnDown = (column: any) => {
  if (column.displayOrder < tableConfig.columns.length - 1) {
    // 找到要交换的下一个元素
    const lowerColumn = tableConfig.columns.find(c => c.displayOrder === column.displayOrder + 1);
    if (lowerColumn) {
      lowerColumn.displayOrder -= 1;
      column.displayOrder += 1;
    }
  }
};

// 打开高级设置
const openAdvancedSettings = (column: any) => {
  editingColumn.value = { ...column };
  isEditMode.value = true;
  isAddingColumn.value = false;
};
</script>

<template>
  <div class="table-config-editor">
    <!-- 标签页导航 -->
    <div class="mb-6 border-b border-gray-200">
      <nav class="-mb-px flex space-x-8">
        <button
          @click="activeTab = 'columns'"
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === 'columns' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          <i class="fas fa-columns mr-2"></i>
          列配置
        </button>
        <button
          @click="activeTab = 'actions'"
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === 'actions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          <i class="fas fa-mouse-pointer mr-2"></i>
          操作按钮
        </button>
        <button
          @click="activeTab = 'batch-actions'"
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === 'batch-actions' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          <i class="fas fa-tasks mr-2"></i>
          批量操作
        </button>
        <button
          @click="activeTab = 'advanced-filters'"
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === 'advanced-filters' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          <i class="fas fa-filter mr-2"></i>
          高级筛选
        </button>
        <button
          @click="activeTab = 'settings'"
          class="py-2 px-1 border-b-2 font-medium text-sm"
          :class="activeTab === 'settings' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
        >
          <i class="fas fa-cog mr-2"></i>
          基础设置
        </button>
      </nav>
    </div>

    <!-- 表格列配置 -->
    <div v-if="activeTab === 'columns'">
      <div class="mb-4 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">表格列配置</h3>
        <button
          type="button"
          @click="addColumn"
          class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          <i class="fas fa-plus mr-1"></i> 添加列
        </button>
      </div>

      <!-- 表格列列表 -->
      <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg mb-4">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">字段名称</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">列标题</th>
              <th scope="col" class="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">宽度</th>
              <th scope="col" class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">可见</th>
              <th scope="col" class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">排序</th>
              <th scope="col" class="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">过滤</th>
              <th scope="col" class="relative py-3 pl-3 pr-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(column, index) in sortedColumns" :key="column.field" class="hover:bg-gray-50">
              <td class="py-2 pl-4 pr-3 text-sm font-medium text-gray-900 whitespace-nowrap">{{ column.field }}</td>
              <td class="px-3 py-2 text-sm text-gray-500">
                <input
                  v-model="column.label"
                  type="text"
                  class="block w-full border-0 p-0 text-gray-500 focus:ring-0 sm:text-sm"
                />
              </td>
              <td class="px-3 py-2 text-sm text-gray-500">
                <input
                  v-model="column.width"
                  type="text"
                  placeholder="自适应"
                  class="block w-full border-0 p-0 text-gray-500 focus:ring-0 sm:text-sm"
                />
              </td>
              <td class="px-3 py-2 text-sm text-gray-500 text-center">
                <input
                  v-model="column.visible"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </td>
              <td class="px-3 py-2 text-sm text-gray-500 text-center">
                <input
                  v-model="column.sortable"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </td>
              <td class="px-3 py-2 text-sm text-gray-500 text-center">
                <input
                  v-model="column.filterable"
                  type="checkbox"
                  class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
              </td>
              <td class="py-2 pl-3 pr-4 text-right text-sm font-medium whitespace-nowrap">
                <button
                  @click="openAdvancedSettings(column)"
                  class="text-indigo-600 hover:text-indigo-900 mr-2"
                  title="更多设置"
                >
                  <i class="fas fa-cog mr-1"></i>更多设置
                </button>
                <button
                  @click="deleteColumn(column)"
                  class="text-red-600 hover:text-red-900"
                  title="删除"
                >
                  <i class="fas fa-trash-alt mr-1"></i>删除
                </button>
              </td>
            </tr>
            <!-- 没有列的情况 -->
            <tr v-if="tableConfig.columns.length === 0">
              <td colspan="8" class="px-6 py-4 text-center text-sm text-gray-500">
                暂无列配置，请先添加列
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 添加列对话框 -->
      <div v-if="isAddingColumn" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full">
          <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <h3 class="text-lg leading-6 font-medium text-gray-900">添加列</h3>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <form @submit.prevent="saveColumn">
              <div class="space-y-4">
                <!-- 字段选择 -->
                <div>
                  <label for="column-field" class="block text-sm font-medium text-gray-700 mb-1">
                    字段 <span class="text-red-500">*</span>
                  </label>
                  <select
                    id="column-field"
                    v-model="editingColumn.field"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    @change="handleColumnFieldChange($event)"
                  >
                    <option value="">请选择字段</option>
                    <option v-for="column in availableColumns" :key="column.field" :value="column.field">
                      {{ column.label }} ({{ column.field }})
                    </option>
                  </select>
                </div>
                
                <!-- 显示类型 -->
                <div>
                  <label for="column-display-type" class="block text-sm font-medium text-gray-700 mb-1">
                    显示类型
                  </label>
                  <select
                    id="column-display-type"
                    v-model="editingColumn.displayType"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="TEXT">普通文本</option>
                    <option value="TAG">标签</option>
                    <option value="STATUS">状态</option>
                    <option value="SENSITIVE">敏感数据</option>
                    <option value="LINK">链接</option>
                    <option value="IMAGE">图片</option>
                    <option value="DATE">日期</option>
                    <option value="NUMBER">数字</option>
                    <option value="BADGE">徽章</option>
                  </select>
                </div>
                
                <!-- 基本设置 -->
                <div class="space-y-4" v-if="editingColumn">
                  <!-- 列标题 -->
                  <div>
                    <label for="column-label" class="block text-sm font-medium text-gray-700 mb-1">
                      列标题 <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="column-label"
                      v-model="editingColumn.label"
                      type="text"
                      class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              <!-- 按钮组 -->
              <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  class="sm:col-start-2 inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:text-sm"
                >
                  添加
                </button>
                <button
                  type="button"
                  @click="cancelEditColumn"
                  class="mt-3 sm:mt-0 sm:col-start-1 inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
                >
                  取消
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 高级设置对话框 -->
      <div v-if="isEditMode" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg overflow-hidden shadow-xl max-w-lg w-full">
          <div class="px-4 py-5 sm:px-6 bg-gray-50 border-b border-gray-200">
            <div class="flex justify-between items-center">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                高级设置 - {{ editingColumn?.label }}
              </h3>
              <button @click="cancelEditColumn" class="text-gray-400 hover:text-gray-500">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <div class="space-y-4" v-if="editingColumn">
              <!-- 对齐方式 -->
              <div>
                <label for="column-align" class="block text-sm font-medium text-gray-700 mb-1">
                  对齐方式
                </label>
                <select
                  id="column-align"
                  v-model="editingColumn.align"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option v-for="option in alignOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              
              <!-- 屏蔽类型 -->
              <div>
                <label for="column-mask" class="block text-sm font-medium text-gray-700 mb-1">
                  数据屏蔽
                </label>
                <select
                  id="column-mask"
                  v-model="editingColumn.maskType"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option v-for="option in maskTypeOptions" :key="option.value" :value="option.value">
                    {{ option.label }}
                  </option>
                </select>
              </div>
              
              <!-- 格式化 -->
              <div>
                <label for="column-format" class="block text-sm font-medium text-gray-700 mb-1">
                  格式化
                </label>
                <input
                  id="column-format"
                  v-model="editingColumn.format"
                  type="text"
                  placeholder="例如日期: YYYY-MM-DD"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              
              <!-- 显示顺序 -->
              <div>
                <label for="column-order" class="block text-sm font-medium text-gray-700 mb-1">
                  显示顺序
                </label>
                <div class="flex items-center space-x-2">
                  <button
                    @click="moveColumnUp(editingColumn)"
                    class="px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <i class="fas fa-arrow-up"></i> 上移
                  </button>
                  <button
                    @click="moveColumnDown(editingColumn)"
                    class="px-2 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    <i class="fas fa-arrow-down"></i> 下移
                  </button>
                  <input
                    v-model.number="editingColumn.displayOrder"
                    type="number"
                    min="0"
                    class="w-20 border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <!-- 按钮组 -->
            <div class="mt-5 flex justify-end space-x-3">
              <button
                type="button"
                @click="cancelEditColumn"
                class="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:text-sm"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 其他标签页内容保持不变 -->
    <!-- ... -->
  </div>
</template>