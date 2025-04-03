<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useQueryStore } from '@/stores/query';
import { useMessageStore } from '@/stores/message';
import { queryService } from '@/services/query';

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

// 监听dataSourceId变化，重置选择的查询
watch(() => props.dataSourceId, (newValue) => {
  if (newValue && selectedQueryId.value) {
    // 检查当前选择的查询是否属于新的数据源
    const currentQuery = queries.value.find(q => q.id === selectedQueryId.value);
    if (currentQuery && currentQuery.dataSourceId !== newValue) {
      // 如果不属于，则清空选择
      selectedQueryId.value = '';
      emit('update:modelValue', '');
    }
  }
});

// 生命周期钩子
onMounted(async () => {
  await loadQueries();
});

// 加载查询列表
const loadQueries = async () => {
  loading.value = true;
  
  try {
    console.log('开始获取查询列表数据...');
    const result = await queryService.getQueries({ queryType: 'DATA' });
    
    console.log('获取到的查询列表数据:', result);
    
    if (result) {
      // 确保我们正确处理API返回的分页结果，取出items
      const queryItems = Array.isArray(result) ? result : result.items || [];
      
      queries.value = queryItems.map(query => {
        console.log('处理查询数据:', query.id, query.name);
        return {
          id: query.id,
          name: query.name || `查询 ${query.id}`,
          description: query.description,
          queryType: query.queryType,
          dataSourceId: query.dataSourceId // 确保查询数据中包含数据源ID
        };
      });
      
      console.log('处理后的查询列表:', queries.value);
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
</script>

<template>
  <div class="query-selector">
    <label v-if="props.label" :for="'query-selector-' + (Math.random().toString(36).substring(2))" class="block text-sm font-medium text-gray-700 mb-1">
      {{ props.label }}
      <span v-if="props.required" class="text-red-500">*</span>
    </label>
    
    <div class="relative">
      <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <i class="fas fa-circle-notch fa-spin text-gray-400"></i>
      </div>
      
      <select
        :value="selectedQueryId"
        @change="handleQueryChange"
        class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        :class="{ 'pr-10': loading, 'border-red-300': props.error }"
        :placeholder="props.placeholder || '请选择数据查询'"
        :disabled="!!props.disabled || loading || !!(props.dataSourceId && filteredQueries.length === 0)"
      >
        <option value="">{{ props.dataSourceId && filteredQueries.length === 0 ? '当前数据源没有可用查询' : '请选择数据查询' }}</option>
        <option 
          v-for="query in filteredQueries" 
          :key="query.id" 
          :value="query.id"
        >
          {{ query.name }}
        </option>
      </select>
      
      <div v-if="!loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
        <button 
          type="button" 
          @click="refreshQueries"
          class="text-gray-400 hover:text-gray-500 focus:outline-none"
          title="刷新查询列表"
        >
          <i class="fas fa-sync-alt"></i>
        </button>
      </div>
    </div>
    
    <div v-if="props.error" class="mt-1 text-sm text-red-600">
      {{ props.error }}
    </div>
    
    <div v-if="selectedQueryId && queries.length > 0" class="mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
      <div v-if="filteredQueries.find(q => q.id === selectedQueryId)" class="text-sm">
        <div class="font-medium text-gray-700">
          {{ filteredQueries.find(q => q.id === selectedQueryId)?.name }}
        </div>
        <div v-if="filteredQueries.find(q => q.id === selectedQueryId)?.description" class="text-gray-500 mt-1">
          {{ filteredQueries.find(q => q.id === selectedQueryId)?.description }}
        </div>
        <div class="text-xs text-gray-500 mt-2">
          ID: {{ selectedQueryId }}
        </div>
      </div>
    </div>
  </div>
</template>