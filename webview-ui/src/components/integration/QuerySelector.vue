<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useQueryStore } from '@/stores/query';
import { useMessageStore } from '@/stores/message';
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
  dataSourceId?: string;
}>();

// 组件事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'selected', id: string, data: any): void;
}>();

// Store
const queryStore = useQueryStore();
const message = useMessageStore();

// 状态
const queries = ref<Array<{ id: string; name: string; description?: string; queryType: string; dataSourceId?: string; }>>([]);
const loading = ref(false);
const searchText = ref('');
const selectedQueryId = ref(props.modelValue || '');

// 添加下拉状态
const isDropdownOpen = ref(false);

// 计算属性
const filteredQueries = computed(() => {
  let result = queries.value;
  
  // 先过滤数据源
  if (props.dataSourceId) {
    result = result.filter(query => query.dataSourceId === props.dataSourceId);
  }
  
  // 再过滤搜索关键词
  if (searchText.value) {
    const searchLower = searchText.value.toLowerCase();
    result = result.filter(query => {
      return query.name.toLowerCase().includes(searchLower) ||
             (query.description && query.description.toLowerCase().includes(searchLower)) ||
             query.id.toLowerCase().includes(searchLower);
    });
  }
  
  return result;
});

// 监听selectedQueryId变化
watch(selectedQueryId, (newValue) => {
  emit('update:modelValue', newValue);
  
  // 查找选中的查询数据
  const selectedQuery = queries.value.find(q => q.id === newValue);
  if (selectedQuery) {
    emit('selected', newValue, selectedQuery);
  }
});

// 监听modelValue变化
watch(() => props.modelValue, (newValue) => {
  selectedQueryId.value = newValue;
});

// 监听dataSourceId变化，重新加载查询
watch(() => props.dataSourceId, (newValue, oldValue) => {
  console.log(`数据源ID变更: ${oldValue} -> ${newValue}`);
  
  if (newValue) {
    // 如果数据源ID变更，重新加载查询列表
    loadQueries();
    
    // 如果当前选择的查询不属于新的数据源，则清空选择
    if (selectedQueryId.value) {
      const currentQuery = queries.value.find(q => q.id === selectedQueryId.value);
      if (currentQuery && currentQuery.dataSourceId !== newValue) {
        console.log(`已选择的查询(${selectedQueryId.value})不属于新数据源(${newValue})，清空选择`);
        selectedQueryId.value = '';
        emit('update:modelValue', '');
      }
    }
  }
}, { immediate: false });

// 生命周期钩子
onMounted(() => {
  document.addEventListener('click', (event) => {
    const dropdownEl = document.querySelector('.query-selector .input-with-dropdown');
    if (dropdownEl && !dropdownEl.contains(event.target as Node)) {
      isDropdownOpen.value = false;
    }
  });
  
  // 原有的加载查询
  loadQueries();
});

// 加载查询列表
const loadQueries = async () => {
  loading.value = true;
  
  try {
    console.log('开始获取查询列表数据...');
    
    // 如果指定了数据源ID，则在请求中包含该参数
    const params: QueryHistoryParams = { 
      page: 1, 
      size: 100,
      queryType: 'SQL' as QueryType
    };
    
    if (props.dataSourceId) {
      params.dataSourceId = props.dataSourceId;
      console.log(`使用数据源ID筛选查询: ${props.dataSourceId}`);
    }
    
    const result = await queryService.getQueries(params);
    
    console.log('获取到的查询列表数据:', result);
    
    if (result) {
      // 确保我们正确处理API返回的分页结果，取出items
      const queryItems = Array.isArray(result) ? result : result.items || [];
      
      queries.value = queryItems.map(query => {
        console.log('处理查询数据:', query.id, query.name, query.dataSourceId);
        return {
          id: query.id,
          name: query.name || `查询 ${query.id}`,
          description: query.description,
          queryType: query.queryType,
          dataSourceId: query.dataSourceId // 确保查询数据中包含数据源ID
        };
      });
      
      console.log('处理后的查询列表:', queries.value);
      console.log(`与数据源 ${props.dataSourceId} 关联的查询数量:`, 
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

// 切换下拉菜单状态
const toggleDropdown = () => {
  if (!props.disabled && !loading.value && !(props.dataSourceId && filteredQueries.value.length === 0)) {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
};

// 选择查询
const selectQuery = (queryId: string) => {
  selectedQueryId.value = queryId;
  isDropdownOpen.value = false;
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
          :disabled="!!props.disabled || loading || !!(props.dataSourceId && filteredQueries.length === 0)"
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
            {{ loading ? '加载中...' : props.dataSourceId ? '当前数据源没有可用查询' : '请先选择数据源' }}
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
  </div>
</template>

<style scoped>
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
</style>