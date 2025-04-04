<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useQueryStore } from '@/stores/query';
import { useMessageStore } from '@/stores/message';
import QueryParamsConfig from './QueryParamsConfig.vue';
import QueryPreview from './QueryPreview.vue';
import { queryService } from '@/services/query';
import type { QueryHistoryParams, QueryType } from '@/types/query';

// 组件属性
const props = defineProps<{
  modelValue: string;
  label?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  showPreview?: boolean; // 是否显示预览功能
  dataSourceId?: string; // 新增数据源ID属性，用于级联查询
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
const queries = ref<Array<{ id: string; name: string; description?: string; type?: string; dataSourceId?: string; }>>([]);
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
  let result = queries.value;
  
  // 先过滤数据源
  if (props.dataSourceId) {
    result = result.filter(query => query.dataSourceId === props.dataSourceId);
  }
  
  if (!searchText.value) {
    // 无需过滤名称，因为我们已经在加载时确保所有查询都有名称
    return result;
  }
  
  const searchLower = searchText.value.toLowerCase();
  return result.filter(query => {
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

// 监听dataSourceId变化，重新加载查询
watch(() => props.dataSourceId, (newValue, oldValue) => {
  console.log(`QuerySelectorEnhanced: 数据源ID变更: ${oldValue} -> ${newValue}`);
  
  if (newValue) {
    // 如果数据源ID变更，重新加载查询列表
    loadQueries();
    
    // 如果当前选择的查询不属于新的数据源，则清空选择
    if (selectedQueryId.value) {
      const currentQuery = queries.value.find(q => q.id === selectedQueryId.value);
      if (currentQuery && currentQuery.dataSourceId !== newValue) {
        console.log(`QuerySelectorEnhanced: 已选择的查询(${selectedQueryId.value})不属于新数据源(${newValue})，清空选择`);
        selectedQueryId.value = '';
        emit('update:modelValue', '');
      }
    }
  }
}, { immediate: false });

// 生命周期钩子
onMounted(async () => {
  await loadQueries();
});

// 加载查询列表
const loadQueries = async () => {
  loading.value = true;
  
  try {
    console.log('QuerySelectorEnhanced: 开始获取查询列表数据...');
    
    // 构造查询参数，如果有数据源ID则包含
    const params: QueryHistoryParams = { 
      page: 1,
      size: 100,
      queryType: 'SQL' as QueryType 
    };
    
    if (props.dataSourceId) {
      params.dataSourceId = props.dataSourceId;
      console.log(`QuerySelectorEnhanced: 使用数据源ID筛选查询: ${props.dataSourceId}`);
    }
    
    // 直接使用queryService而不是queryStore
    const result = await queryService.getQueries(params);
    
    console.log('QuerySelectorEnhanced: 获取到的查询列表数据:', result);
    
    if (result) {
      // 确保我们正确处理API返回的分页结果，取出items
      const queryItems = Array.isArray(result) ? result : result.items || [];
      
      queries.value = queryItems.map(query => {
        console.log('QuerySelectorEnhanced: 处理查询数据:', query.id, query.name, query.dataSourceId);
        return {
          id: query.id,
          name: query.name || `查询 ${query.id}`, // 确保始终有名称
          description: query.description,
          type: query.queryType || query.type,
          dataSourceId: query.dataSourceId // 添加数据源ID以支持过滤
        };
      });
      
      console.log('QuerySelectorEnhanced: 处理后的查询列表:', queries.value);
      console.log(`QuerySelectorEnhanced: 与数据源 ${props.dataSourceId} 关联的查询数量:`, 
        props.dataSourceId ? queries.value.filter(q => q.dataSourceId === props.dataSourceId).length : queries.value.length);
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

// 切换下拉菜单状态
const isDropdownOpen = ref(false);

const toggleDropdown = () => {
  if (!props.disabled && !loading.value && !(props.dataSourceId && filteredQueries.length === 0)) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

// 选择查询
const selectQuery = (queryId: string) => {
  selectedQueryId.value = queryId;
  isDropdownOpen.value = false;
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
      <div class="input-with-dropdown">
        <input
          :value="filteredQueries.find(q => q.id === selectedQueryId)?.name || ''"
          type="text"
          readonly
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm cursor-pointer"
          :class="{ 'border-red-300': props.error }"
          :placeholder="props.placeholder || '请选择数据查询'"
          :disabled="props.disabled || loading || !!(props.dataSourceId && filteredQueries.length === 0)"
          @click="toggleDropdown"
        />
        <div class="absolute inset-y-0 right-2 flex items-center">
          <div v-if="loading" class="pointer-events-none">
            <i class="fas fa-circle-notch fa-spin text-gray-400"></i>
          </div>
          <button 
            v-else
            type="button" 
            class="text-gray-400 hover:text-gray-500 focus:outline-none mr-1"
            @click="refreshQueries"
            title="刷新查询列表"
          >
            <i class="fas fa-sync-alt"></i>
          </button>
          <i class="fas fa-chevron-down text-gray-400"></i>
        </div>
        
        <div v-if="isDropdownOpen" class="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-auto">
          <div v-if="filteredQueries.length === 0" class="p-3 text-sm text-gray-500 text-center">
            <template v-if="loading">
              加载中...
            </template>
            <template v-else-if="props.dataSourceId && queries.length > 0">
              当前数据源没有可用查询，请选择其他数据源或先为该数据源创建查询
            </template>
            <template v-else>
              没有可用的查询
            </template>
          </div>
          <ul v-else class="py-1">
            <li
              v-for="query in filteredQueries"
              :key="query.id"
              class="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
              :class="{ 'bg-indigo-50': query.id === selectedQueryId }"
              @click="selectQuery(query.id)"
            >
              {{ query.name }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    
    <div v-if="props.error" class="mt-1 text-sm text-red-600">
      {{ props.error }}
    </div>
    
    <!-- 数据源提示 -->
    <div v-if="props.dataSourceId && !selectedQueryId && filteredQueries.length === 0 && !loading" class="mt-2 text-sm text-amber-600">
      <i class="fas fa-info-circle mr-1"></i> 当前数据源下没有可用的查询，请先为该数据源创建查询
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
.query-selector {
  margin-bottom: 0;
  position: relative;
}

.input-with-dropdown {
  position: relative;
}

input[readonly] {
  cursor: pointer;
  background-color: #fff;
}

input[readonly]:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

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