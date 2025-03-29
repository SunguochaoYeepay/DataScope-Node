<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useQueryStore } from '@/stores/query';
import { useMessageStore } from '@/stores/message';
import type { FormConfig, FormCondition, FormLayoutType, FormButton } from '@/types/integration';
import { FormComponentType } from '@/types/integration';
import QuerySelectorEnhanced from './QuerySelectorEnhanced.vue';

// 组件属性
const props = defineProps<{
  modelValue: FormConfig;
  queryId?: string;
}>();

// 组件事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: FormConfig): void;
}>();

// Store
const queryStore = useQueryStore();
const message = useMessageStore();

// 状态
const formConfig = reactive<FormConfig>({
  layout: props.modelValue.layout || 'horizontal',
  conditions: [],
  buttons: []
});

// 正在编辑的条件
const editingCondition = ref<FormCondition | null>(null);
const isAddingCondition = ref(false);
const isEditMode = ref(false);
const availableFields = ref<Array<{ field: string; label: string; type: string }>>([]);

// 新增：选中的查询
const selectedQuery = ref('');

// 组件类型选项
const componentTypeOptions = [
  { value: FormComponentType.INPUT, label: '文本输入框' },
  { value: FormComponentType.NUMBER, label: '数字输入框' },
  { value: FormComponentType.DATE, label: '日期选择器' },
  { value: FormComponentType.DATETIME, label: '日期时间选择器' },
  { value: FormComponentType.SELECT, label: '下拉选择框' },
  { value: FormComponentType.MULTISELECT, label: '多选框' },
  { value: FormComponentType.CHECKBOX, label: '复选框' },
  { value: FormComponentType.RADIO, label: '单选框' },
  { value: FormComponentType.TEXTAREA, label: '多行文本框' }
];

// 表单布局选项
const layoutOptions = [
  { value: 'horizontal', label: '水平布局' },
  { value: 'vertical', label: '垂直布局' },
  { value: 'grid', label: '网格布局' }
];

// 计算属性
const sortedConditions = computed(() => {
  return [...formConfig.conditions].sort((a, b) => a.displayOrder - b.displayOrder);
});

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    formConfig.layout = newValue.layout;
    formConfig.conditions = [...newValue.conditions];
    formConfig.buttons = [...newValue.buttons];
  }
}, { deep: true });

// 监听formConfig变化，触发更新事件
watch(formConfig, (newValue) => {
  emit('update:modelValue', {
    layout: newValue.layout,
    conditions: [...newValue.conditions],
    buttons: [...newValue.buttons]
  });
}, { deep: true });

// 监听queryId变化
watch(() => props.queryId, async (newValue) => {
  if (newValue) {
    await loadQueryFields(newValue);
  }
});

// 生命周期钩子
onMounted(async () => {
  // 如果没有按钮，添加默认按钮
  if (!formConfig.buttons || formConfig.buttons.length === 0) {
    formConfig.buttons = [
      {
        type: 'submit',
        label: '查询',
        style: 'primary',
        icon: 'fas fa-search'
      },
      {
        type: 'reset',
        label: '重置',
        style: 'secondary'
      }
    ];
  }
  
  // 加载查询字段
  if (props.queryId) {
    await loadQueryFields(props.queryId);
  }
});

// 加载查询字段
const loadQueryFields = async (queryId: string) => {
  try {
    const query = await queryStore.fetchQueryById(queryId);
    
    if (query) {
      // 解析查询参数，获取可用字段
      const fields = query.parameters || [];
      
      availableFields.value = fields.map(field => ({
        field: field.name,
        label: field.label || field.name,
        type: mapDatabaseTypeToComponentType(field.type)
      }));
      
      // 如果没有条件，自动从查询参数生成
      if (formConfig.conditions.length === 0 && availableFields.value.length > 0) {
        autoGenerateConditions();
      }
    }
  } catch (error) {
    console.error('加载查询字段失败', error);
    message.error('加载查询字段失败');
  }
};

// 数据库类型映射到组件类型
const mapDatabaseTypeToComponentType = (dbType: string): string => {
  const type = dbType.toLowerCase();
  
  if (type.includes('varchar') || type.includes('char') || type.includes('text')) {
    return FormComponentType.INPUT;
  } else if (type.includes('int') || type.includes('decimal') || type.includes('float') || type.includes('double')) {
    return FormComponentType.NUMBER;
  } else if (type.includes('date') && type.includes('time')) {
    return FormComponentType.DATETIME;
  } else if (type.includes('date')) {
    return FormComponentType.DATE;
  } else if (type.includes('bool')) {
    return FormComponentType.CHECKBOX;
  } else if (type.includes('enum')) {
    return FormComponentType.SELECT;
  }
  
  return FormComponentType.INPUT;
};

// 自动生成表单条件
const autoGenerateConditions = () => {
  // 从可用字段自动生成条件
  const conditions: FormCondition[] = availableFields.value.map((field, index) => ({
    field: field.field,
    label: field.label,
    type: field.type as FormComponentType,
    required: false,
    displayOrder: index,
    visibility: 'visible',
    componentProps: {}
  }));
  
  formConfig.conditions = conditions;
};

// 添加条件
const addCondition = () => {
  isAddingCondition.value = true;
  isEditMode.value = false;
  
  editingCondition.value = {
    field: '',
    label: '',
    type: FormComponentType.INPUT,
    required: false,
    displayOrder: formConfig.conditions.length,
    visibility: 'visible',
    componentProps: {}
  };
};

// 编辑条件
const editCondition = (condition: FormCondition) => {
  isAddingCondition.value = false;
  isEditMode.value = true;
  
  // 创建副本进行编辑
  editingCondition.value = { ...condition };
};

// 保存条件
const saveCondition = () => {
  if (!editingCondition.value) return;
  
  // 验证
  if (!editingCondition.value.field) {
    message.error('请选择字段');
    return;
  }
  
  if (!editingCondition.value.label) {
    message.error('请输入标签名称');
    return;
  }
  
  if (isEditMode.value) {
    // 更新现有条件
    const index = formConfig.conditions.findIndex(c => c.field === editingCondition.value!.field);
    if (index !== -1) {
      formConfig.conditions[index] = { ...editingCondition.value };
    }
  } else {
    // 添加新条件
    formConfig.conditions.push({ ...editingCondition.value });
  }
  
  // 重置编辑状态
  editingCondition.value = null;
  isAddingCondition.value = false;
  isEditMode.value = false;
};

// 取消编辑
const cancelEdit = () => {
  editingCondition.value = null;
  isAddingCondition.value = false;
  isEditMode.value = false;
};

// 删除条件
const deleteCondition = (field: string) => {
  const index = formConfig.conditions.findIndex(c => c.field === field);
  if (index !== -1) {
    formConfig.conditions.splice(index, 1);
  }
};

// 移动条件
const moveCondition = (field: string, direction: 'up' | 'down') => {
  const index = formConfig.conditions.findIndex(c => c.field === field);
  if (index === -1) return;
  
  if (direction === 'up' && index > 0) {
    // 向上移动
    const temp = formConfig.conditions[index].displayOrder;
    formConfig.conditions[index].displayOrder = formConfig.conditions[index - 1].displayOrder;
    formConfig.conditions[index - 1].displayOrder = temp;
  } else if (direction === 'down' && index < formConfig.conditions.length - 1) {
    // 向下移动
    const temp = formConfig.conditions[index].displayOrder;
    formConfig.conditions[index].displayOrder = formConfig.conditions[index + 1].displayOrder;
    formConfig.conditions[index + 1].displayOrder = temp;
  }
};

// 选择字段改变
const handleFieldChange = (field: string) => {
  if (!editingCondition.value) return;
  
  // 查找对应的字段信息
  const fieldInfo = availableFields.value.find(f => f.field === field);
  if (fieldInfo) {
    editingCondition.value.field = fieldInfo.field;
    editingCondition.value.label = fieldInfo.label;
    editingCondition.value.type = fieldInfo.type as FormComponentType;
  }
};

// 更改表单布局
const changeLayout = (layout: FormLayoutType) => {
  formConfig.layout = layout;
};

// 获取组件类型显示名称
const getComponentTypeName = (type: string): string => {
  const option = componentTypeOptions.find(opt => opt.value === type);
  return option ? option.label : type;
};

// 新增：处理查询变更
const handleQueryChange = async (queryId: string) => {
  if (queryId) {
    await loadQueryFields(queryId);
  }
};
</script>

<template>
  <div class="form-config-editor">
    <!-- 查询选择器部分 -->
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-900 mb-2">数据查询配置</h3>
      <div class="bg-gray-50 p-4 rounded-lg">
        <QuerySelectorEnhanced
          v-model="selectedQuery"
          :show-preview="true"
          @update:modelValue="handleQueryChange"
        />
      </div>
    </div>

    <!-- 表单布局配置 -->
    <div class="mb-4">
      <h3 class="text-lg font-medium text-gray-900 mb-2">表单布局</h3>
      <select
        v-model="formConfig.layout"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      >
        <option v-for="option in layoutOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>
    
    <!-- 条件列表 -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-sm font-medium text-gray-700">表单条件配置</h3>
        <button 
          @click="addCondition"
          class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-plus mr-1"></i> 添加条件
        </button>
      </div>
      
      <!-- 空状态 -->
      <div v-if="formConfig.conditions.length === 0 && !isAddingCondition" class="bg-gray-50 border border-dashed border-gray-300 rounded-md p-6 text-center">
        <i class="fas fa-list-ul text-gray-400 text-3xl mb-2"></i>
        <p class="text-sm text-gray-500 mb-2">暂无表单条件</p>
        <button 
          @click="addCondition"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
        >
          <i class="fas fa-plus mr-1"></i> 添加条件
        </button>
      </div>
      
      <!-- 条件编辑表单 -->
      <div v-if="editingCondition" class="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
        <h4 class="text-sm font-medium text-gray-700 mb-3">
          {{ isEditMode ? '编辑条件' : '添加条件' }}
        </h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <!-- 字段选择 -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              字段名称 <span class="text-red-500">*</span>
            </label>
            <select
              v-model="editingCondition.field"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              @change="handleFieldChange($event.target.value)"
              :disabled="isEditMode"
            >
              <option value="">请选择字段</option>
              <option 
                v-for="field in availableFields" 
                :key="field.field" 
                :value="field.field"
              >
                {{ field.label }} ({{ field.field }})
              </option>
            </select>
          </div>
          
          <!-- 标签名称 -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              标签文本 <span class="text-red-500">*</span>
            </label>
            <input 
              v-model="editingCondition.label"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="请输入标签文本"
            />
          </div>
          
          <!-- 组件类型 -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              组件类型
            </label>
            <select
              v-model="editingCondition.type"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option 
                v-for="type in componentTypeOptions" 
                :key="type.value" 
                :value="type.value"
              >
                {{ type.label }}
              </option>
            </select>
          </div>
          
          <!-- 必填选项 -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              必填选项
            </label>
            <div class="flex items-center mt-2">
              <input 
                v-model="editingCondition.required"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span class="ml-2 text-sm text-gray-500">设为必填项</span>
            </div>
          </div>
          
          <!-- 默认值 -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              默认值
            </label>
            <input 
              v-model="editingCondition.defaultValue"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="请输入默认值"
            />
          </div>
          
          <!-- 显示顺序 -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              显示顺序
            </label>
            <input 
              v-model="editingCondition.displayOrder"
              type="number"
              min="0"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex justify-end space-x-2">
          <button 
            @click="cancelEdit"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            取消
          </button>
          <button 
            @click="saveCondition"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            保存
          </button>
        </div>
      </div>
      
      <!-- 条件列表 -->
      <div v-if="formConfig.conditions.length > 0" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                字段名称
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                标签
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                组件类型
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                必填
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                显示顺序
              </th>
              <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="condition in sortedConditions" :key="condition.field">
              <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ condition.field }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                {{ condition.label }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                {{ getComponentTypeName(condition.type) }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                <span 
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    condition.required ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  ]"
                >
                  {{ condition.required ? '是' : '否' }}
                </span>
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                {{ condition.displayOrder }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="moveCondition(condition.field, 'up')"
                  class="text-gray-500 hover:text-gray-700 mx-1"
                  title="上移"
                >
                  <i class="fas fa-arrow-up"></i>
                </button>
                <button 
                  @click="moveCondition(condition.field, 'down')"
                  class="text-gray-500 hover:text-gray-700 mx-1"
                  title="下移"
                >
                  <i class="fas fa-arrow-down"></i>
                </button>
                <button 
                  @click="editCondition(condition)"
                  class="text-indigo-600 hover:text-indigo-900 mx-1"
                  title="编辑"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="deleteCondition(condition.field)"
                  class="text-red-600 hover:text-red-900 mx-1"
                  title="删除"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    
    <!-- 按钮配置 -->
    <div>
      <h3 class="text-sm font-medium text-gray-700 mb-2">按钮配置</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            提交按钮文本
          </label>
          <input 
            v-model="formConfig.buttons[0].label"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            重置按钮文本
          </label>
          <input 
            v-model="formConfig.buttons[1].label"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
  </div>
</template>