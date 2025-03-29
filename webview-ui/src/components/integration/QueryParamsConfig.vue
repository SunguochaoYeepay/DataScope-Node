<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useQueryStore } from '@/stores/query';
import { useMessageStore } from '@/stores/message';

interface QueryParam {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: any;
  description?: string;
}

interface Props {
  queryId: string;
  modelValue: Record<string, any>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'valid', value: boolean): void;
}>();

const queryStore = useQueryStore();
const message = useMessageStore();

const loading = ref(false);
const params = ref<QueryParam[]>([]);
const paramValues = ref<Record<string, any>>({});
const validationErrors = ref<Record<string, string>>({});

// 模拟参数数据
const mockParams: QueryParam[] = [
  {
    name: 'startDate',
    type: 'string',
    required: true,
    defaultValue: '2023-01-01',
    description: '查询开始日期（格式：YYYY-MM-DD）'
  },
  {
    name: 'endDate',
    type: 'string',
    required: true,
    defaultValue: '2023-12-31',
    description: '查询结束日期（格式：YYYY-MM-DD）'
  },
  {
    name: 'productCategory',
    type: 'string',
    required: false,
    defaultValue: '电子产品',
    description: '产品类别，不填则查询所有类别'
  },
  {
    name: 'minSalesAmount',
    type: 'number',
    required: false,
    defaultValue: 1000,
    description: '最低销售金额'
  },
  {
    name: 'includeInactive',
    type: 'boolean',
    required: false,
    defaultValue: false,
    description: '是否包含已下架产品'
  }
];

// 加载查询参数
const loadQueryParams = async () => {
  if (!props.queryId) {
    // 如果没有queryId，使用模拟数据
    params.value = mockParams;
    const newParamValues = { ...props.modelValue };
    mockParams.forEach(param => {
      if (!(param.name in newParamValues) && param.defaultValue !== undefined) {
        newParamValues[param.name] = param.defaultValue;
      }
    });
    paramValues.value = newParamValues;
    emit('update:modelValue', newParamValues);
    return;
  }
  
  loading.value = true;
  try {
    const query = await queryStore.fetchQueryById(props.queryId);
    if (query && query.parameters) {
      params.value = query.parameters;
      // 初始化参数值
      const newParamValues = { ...props.modelValue };
      query.parameters.forEach(param => {
        if (!(param.name in newParamValues) && param.defaultValue !== undefined) {
          newParamValues[param.name] = param.defaultValue;
        }
      });
      paramValues.value = newParamValues;
      emit('update:modelValue', newParamValues);
    }
  } catch (error) {
    console.error('加载查询参数失败', error);
    message.error('加载查询参数失败');
  } finally {
    loading.value = false;
  }
};

// 验证参数值
const validateParams = () => {
  const errors: Record<string, string> = {};
  let isValid = true;
  
  params.value.forEach(param => {
    const value = paramValues.value[param.name];
    if (param.required && (value === undefined || value === '')) {
      errors[param.name] = `${param.name} 是必填项`;
      isValid = false;
    }
    
    // 类型验证
    if (value !== undefined && value !== '') {
      switch (param.type) {
        case 'number':
          if (isNaN(Number(value))) {
            errors[param.name] = `${param.name} 必须是数字`;
            isValid = false;
          }
          break;
        case 'boolean':
          if (typeof value !== 'boolean' && !['true', 'false'].includes(String(value).toLowerCase())) {
            errors[param.name] = `${param.name} 必须是布尔值`;
            isValid = false;
          }
          break;
        // 可以添加更多类型验证
      }
    }
  });
  
  validationErrors.value = errors;
  emit('valid', isValid);
  return isValid;
};

// 处理参数值变化
const handleParamChange = (param: QueryParam, event: Event) => {
  const target = event.target as HTMLInputElement;
  let value: any = target.value;
  
  // 类型转换
  switch (param.type) {
    case 'number':
      value = value === '' ? '' : Number(value);
      break;
    case 'boolean':
      value = value === 'true';
      break;
  }
  
  paramValues.value = {
    ...paramValues.value,
    [param.name]: value
  };
  
  emit('update:modelValue', paramValues.value);
  validateParams();
};

// 监听查询ID变化
watch(() => props.queryId, () => {
  loadQueryParams();
});

// 监听外部参数值变化
watch(() => props.modelValue, (newValue) => {
  paramValues.value = { ...newValue };
  validateParams();
}, { deep: true });

// 初始加载
onMounted(() => {
  loadQueryParams();
});
</script>

<template>
  <div class="query-params-config">
    <div v-if="loading" class="flex items-center justify-center py-4">
      <i class="fas fa-circle-notch fa-spin text-gray-400 mr-2"></i>
      <span class="text-gray-500">加载参数配置...</span>
    </div>
    
    <div v-else-if="params.length === 0" class="text-center py-4 text-gray-500">
      该查询没有需要配置的参数
    </div>
    
    <div v-else class="space-y-4">
      <div v-for="param in params" :key="param.name" class="param-item">
        <label :for="param.name" class="block text-sm font-medium text-gray-700 mb-1">
          {{ param.name }}
          <span v-if="param.required" class="text-red-500">*</span>
        </label>
        
        <div class="mt-1">
          <!-- 布尔类型参数 -->
          <div v-if="param.type === 'boolean'" class="flex items-center">
            <input
              :id="param.name"
              type="checkbox"
              :checked="paramValues[param.name]"
              @change="(e) => handleParamChange(param, e)"
              class="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <label :for="param.name" class="ml-2 text-sm text-gray-900">
              {{ param.description || param.name }}
            </label>
          </div>
          
          <!-- 其他类型参数 -->
          <template v-else>
            <input
              :id="param.name"
              :type="param.type === 'number' ? 'number' : 'text'"
              :value="paramValues[param.name]"
              @input="(e) => handleParamChange(param, e)"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': validationErrors[param.name] }"
              :placeholder="param.description || `请输入${param.name}`"
            />
          </template>
          
          <!-- 验证错误提示 -->
          <p v-if="validationErrors[param.name]" class="mt-1 text-sm text-red-600">
            {{ validationErrors[param.name] }}
          </p>
          
          <!-- 参数说明 -->
          <p v-if="param.description && param.type !== 'boolean'" class="mt-1 text-xs text-gray-500">
            {{ param.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>