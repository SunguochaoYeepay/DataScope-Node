<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useQueryStore } from '@/stores/query';
import { useMessageStore } from '@/stores/message';
import QueryParamsConfig from './QueryParamsConfig.vue';
import QueryPreview from './QueryPreview.vue';
import { queryService } from '@/services/query';

// 组件属性
const props = defineProps<{
  modelValue: string;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  showPreview?: boolean; // 是否显示预览功能
}>();

// 组件事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'selected', id: string, data: any): void;
  (e: 'paramsChange', params: Record<string, any>): void;
}>();

// Store
const queryStore = useQueryStore();
const message = useMessageStore();

// 状态
const queries = ref<Array<{ id: string; name: string; description?: string; type?: string; }>>([]);
const loading = ref(false);
const searchText = ref('');
const selectedQueryId = ref(props.modelValue || '');

// 参数配置相关
const showParamsConfig = ref(false);
const paramValues = ref<Record<string, any>>({});
const paramsValid = ref(true);

// 预览相关
const showPreview = ref(false);
const previewPageSize = ref(10);

// 计算属性
const filteredQueries = computed(() => {
  if (!searchText.value) {
    // 无需过滤名称，因为我们已经在加载时确保所有查询都有名称
    return queries.value;
  }
  
  const searchLower = searchText.value.toLowerCase();
  return queries.value.filter(query => {
    return query.name.toLowerCase().includes(searchLower) ||
           (query.description && query.description.toLowerCase().includes(searchLower)) ||
           query.id.toLowerCase().includes(searchLower);
  });
});

// 监听selectedQueryId变化
watch(selectedQueryId, (newValue) => {
  emit('update:modelValue', newValue);
  
  // 查找选中的查询数据
  const selectedQuery = queries.value.find(q => q.id === newValue);
  if (selectedQuery) {
    emit('selected', newValue, selectedQuery);
  }
  
  // 重置参数值
  if (newValue) {
    paramValues.value = {};
  }
});

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  selectedQueryId.value = newValue;
});

// 生命周期钩子
onMounted(async () => {
  await loadQueries();
});

// 加载查询列表
const loadQueries = async () => {
  loading.value = true;
  
  try {
    console.log('QuerySelectorEnhanced: 开始获取查询列表数据...');
    // 直接使用queryService而不是queryStore
    const result = await queryService.getQueries({ queryType: 'DATA' });
    
    console.log('QuerySelectorEnhanced: 获取到的查询列表数据:', result);
    
    if (result) {
      queries.value = result.map(query => {
        console.log('QuerySelectorEnhanced: 处理查询数据:', query.id, query.name);
        return {
          id: query.id,
          name: query.name || `查询 ${query.id}`, // 确保始终有名称
          description: query.description,
          type: query.queryType
        };
      });
      
      console.log('QuerySelectorEnhanced: 处理后的查询列表:', queries.value);
    }
  } catch (error) {
    console.error('加载查询列表失败', error);
    message.error('加载查询列表失败');
  } finally {
    loading.value = false;
  }
};

// 刷新查询列表
const refreshQueries = async () => {
  await loadQueries();
};

// 查询选择变更处理
const handleQueryChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  selectedQueryId.value = target.value;
};

// 处理参数变化
const handleParamsChange = (values: Record<string, any>) => {
  paramValues.value = values;
  emit('paramsChange', values);
};

// 处理参数验证状态变化
const handleParamsValidChange = (valid: boolean) => {
  paramsValid.value = valid;
};

// 切换预览显示
const togglePreview = () => {
  showPreview.value = !showPreview.value;
};
</script>

<template>
  <div class="query-selector">
    <label v-if="props.label" :for="'query-selector-' + (Math.random().toString(36).substring(2))" class="block text-sm font-medium text-gray-700 mb-1">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <select
        :value="selectedQueryId"
        @change="handleQueryChange"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'pr-10': loading, 'border-red-300': props.error }"
        :placeholder="props.placeholder || '请选择数据查询'"
        :disabled="props.disabled || loading"
      >
        <option value="">请选择数据查询</option>
        <option 
          v-for="query in filteredQueries" 
          :key="query.id" 
          :value="query.id"
        >
          {{ query.name }}
        </option>
      </select>
      
      <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <i class="fas fa-circle-notch fa-spin text-gray-400"></i>
      </div>
    </div>
    
    <div v-if="props.error" class="mt-1 text-sm text-red-600">
      {{ props.error }}
    </div>
    
    <!-- 参数配置面板 -->
    <div v-if="showParamsConfig && selectedQueryId" class="mt-4">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            查询参数配置
          </h3>
          <div class="mt-4">
            <QueryParamsConfig
              :query-id="selectedQueryId"
              v-model="paramValues"
              @valid="handleParamsValidChange"
            />
          </div>
        </div>
      </div>
    </div>
    
    <!-- 预览面板 -->
    <div v-if="showPreview && selectedQueryId" class="mt-4">
      <div class="bg-white shadow sm:rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              数据预览
            </h3>
            <button
              type="button"
              @click="togglePreview"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <i class="fas fa-times mr-1"></i>
              关闭预览
            </button>
          </div>
          
          <div class="mt-4">
            <QueryPreview
              :query-id="selectedQueryId"
              :params="paramValues"
              :page-size="previewPageSize"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 查询选择器样式 */
.query-selector select {
  min-height: 38px;
  line-height: 1.5;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
}

.query-selector select:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.25);
}

.query-selector .relative {
  position: relative;
}

/* 确保下拉框正确显示 */
option, optgroup {
  font-size: 0.875rem;
  line-height: 1.25rem;
  padding: 0.5rem;
}

/* 选项样式 */
option {
  padding: 0.5rem;
  margin: 0.25rem 0;
}
</style>