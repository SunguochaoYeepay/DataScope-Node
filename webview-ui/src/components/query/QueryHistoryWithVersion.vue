<template>
  <div class="flex flex-col h-full">
    <div class="flex justify-between items-center p-4 border-b border-gray-200">
      <h3 class="text-lg font-medium text-gray-800">查询历史</h3>
      
      <div class="flex space-x-2">
        <!-- 查询服务筛选 -->
        <select
          v-if="showQueryFilter"
          v-model="selectedQueryId"
          class="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">所有查询</option>
          <option v-for="query in queryList" :key="query.id" :value="query.id">
            {{ query.name }}
          </option>
        </select>
        
        <!-- 刷新按钮 -->
        <button
          @click="handleRefresh"
          class="p-1 text-gray-600 hover:text-gray-800 focus:outline-none"
          :disabled="isLoading"
        >
          <i class="fas fa-sync-alt" :class="{ 'animate-spin': isLoading }"></i>
        </button>
      </div>
    </div>
    
    <!-- 过滤器 -->
    <div class="px-4 py-2 bg-gray-50 border-b border-gray-200">
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <!-- 状态过滤 -->
        <select
          v-model="filterStatus"
          class="text-xs border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">所有状态</option>
          <option value="COMPLETED">已完成</option>
          <option value="FAILED">失败</option>
          <option value="CANCELLED">已取消</option>
        </select>
        
        <!-- 版本筛选 -->
        <select
          v-if="selectedQueryId"
          v-model="filterVersionId"
          class="text-xs border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">所有版本</option>
          <option v-for="version in versionOptions" :key="version.id" :value="version.id">
            v{{ version.number }}{{ version.isActive ? ' (当前)' : '' }}
          </option>
        </select>
        
        <!-- 日期筛选 -->
        <select
          v-model="filterDateRange"
          class="text-xs border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="all">所有时间</option>
          <option value="today">今天</option>
          <option value="week">本周</option>
          <option value="month">本月</option>
        </select>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex-grow flex items-center justify-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>
    
    <!-- 无数据状态 -->
    <div v-else-if="historyItems.length === 0" class="flex-grow flex flex-col items-center justify-center text-gray-500">
      <div class="text-3xl mb-2">
        <i class="far fa-clipboard"></i>
      </div>
      <p>暂无查询历史记录</p>
    </div>
    
    <!-- 历史列表 -->
    <div v-else class="flex-grow overflow-y-auto">
      <div v-for="(item, index) in historyItems" :key="index" class="border-b border-gray-200 hover:bg-gray-50">
        <div 
          class="p-3 cursor-pointer"
          @click="toggleExpandItem(item.id)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <!-- 状态和SQL预览 -->
              <div class="flex items-center">
                <!-- 执行状态标识 -->
                <span 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-2"
                  :class="{
                    'bg-green-100 text-green-800': item.status === 'COMPLETED',
                    'bg-red-100 text-red-800': item.status === 'FAILED',
                    'bg-gray-100 text-gray-800': item.status === 'CANCELLED'
                  }"
                >
                  {{ statusText(item.status) }}
                </span>
                
                <!-- 版本标识 (如果有) -->
                <span 
                  v-if="item.versionNumber" 
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mr-2"
                >
                  v{{ item.versionNumber }}
                  <span v-if="item.isActiveVersion" class="ml-1">
                    <i class="fas fa-check-circle"></i>
                  </span>
                </span>
                
                <!-- SQL内容预览 -->
                <span class="text-sm text-gray-900 font-medium truncate">
                  {{ sqlPreview(item.queryText) }}
                </span>
              </div>
              
              <!-- 执行信息 -->
              <div class="mt-1 flex items-center text-xs text-gray-500 space-x-3">
                <span>
                  <i class="far fa-clock mr-1"></i>
                  {{ formatDateTime(item.createdAt) }}
                </span>
                
                <span v-if="item.executionTime">
                  <i class="fas fa-stopwatch mr-1"></i>
                  {{ formatExecutionTime(item.executionTime) }}
                </span>
                
                <span v-if="item.resultCount !== undefined">
                  <i class="fas fa-table mr-1"></i>
                  {{ item.resultCount }} 行
                </span>
                
                <span v-if="item.queryName">
                  <i class="far fa-file-alt mr-1"></i>
                  {{ item.queryName }}
                </span>
              </div>
            </div>
            
            <div class="flex items-center">
              <!-- 查询服务链接 -->
              <button
                v-if="item.queryId"
                @click.stop="navigateToQuery(item.queryId)"
                class="p-1 text-gray-400 hover:text-indigo-600"
                title="查看查询服务"
              >
                <i class="fas fa-external-link-alt"></i>
              </button>
              
              <!-- 加载查询按钮 -->
              <button
                @click.stop="loadQuery(item)"
                class="p-1 text-gray-400 hover:text-indigo-600 ml-1"
                title="加载此查询"
              >
                <i class="fas fa-file-import"></i>
              </button>
              
              <!-- 展开/折叠图标 -->
              <button class="p-1 text-gray-400 hover:text-gray-600 ml-1">
                <i :class="expandedItems.has(item.id) ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </button>
            </div>
          </div>
          
          <!-- 错误信息显示 -->
          <div v-if="item.error" class="mt-2 p-2 bg-red-50 text-xs text-red-700 rounded">
            <i class="fas fa-exclamation-circle mr-1"></i>
            {{ item.error }}
          </div>
        </div>
        
        <!-- 展开的详细信息 -->
        <div v-if="expandedItems.has(item.id)" class="px-3 pb-3 text-xs">
          <div class="bg-gray-50 p-2 rounded border border-gray-200 overflow-auto max-h-48">
            <pre class="text-gray-700">{{ item.queryText }}</pre>
          </div>
          
          <div class="mt-2 grid grid-cols-2 gap-2 text-gray-600">
            <div v-if="item.dataSourceId">
              <span class="font-medium">数据源:</span> {{ item.dataSourceName || item.dataSourceId }}
            </div>
            
            <div v-if="item.versionId">
              <span class="font-medium">版本ID:</span> {{ item.versionId }}
            </div>
            
            <div v-if="item.parameters">
              <span class="font-medium">参数:</span> {{ JSON.stringify(item.parameters) }}
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分页控件 -->
    <div v-if="totalPages > 1" class="p-3 border-t border-gray-200 flex justify-center">
      <div class="flex space-x-1">
        <button
          @click="handlePageChange(currentPage - 1)"
          :disabled="currentPage <= 1 || isLoading"
          class="px-3 py-1 border rounded text-sm"
          :class="currentPage <= 1 || isLoading ? 'text-gray-400 border-gray-200' : 'text-gray-600 border-gray-300 hover:bg-gray-50'"
        >
          上一页
        </button>
        
        <div class="px-3 py-1 text-sm text-gray-600">
          {{ currentPage }} / {{ totalPages }}
        </div>
        
        <button
          @click="handlePageChange(currentPage + 1)"
          :disabled="currentPage >= totalPages || isLoading"
          class="px-3 py-1 border rounded text-sm"
          :class="currentPage >= totalPages || isLoading ? 'text-gray-400 border-gray-200' : 'text-gray-600 border-gray-300 hover:bg-gray-50'"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Query, QueryStatus } from '@/types/query';

interface QueryVersion {
  id: string;
  number: number;
  isActive: boolean;
}

interface HistoryItem {
  id: string;
  queryId?: string;
  queryName?: string;
  versionId?: string;
  versionNumber?: number;
  isActiveVersion?: boolean;
  dataSourceId: string;
  dataSourceName?: string;
  queryText: string;
  status: QueryStatus;
  executionTime?: number;
  resultCount?: number;
  createdAt: string;
  error?: string;
  parameters?: any;
}

interface Props {
  historyItems: HistoryItem[];
  queryList?: Query[];
  versionOptions?: QueryVersion[];
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  showQueryFilter?: boolean;
  currentQueryId?: string;
}

const props = withDefaults(defineProps<Props>(), {
  historyItems: () => [],
  queryList: () => [],
  versionOptions: () => [],
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  showQueryFilter: true,
  currentQueryId: ''
});

const emit = defineEmits<{
  (e: 'refresh'): void;
  (e: 'load-query', item: HistoryItem): void;
  (e: 'navigate-to-query', queryId: string): void;
  (e: 'filter-change', filters: { queryId?: string; versionId?: string; status?: string; dateRange: string }): void;
  (e: 'page-change', page: number): void;
}>();

// 筛选状态
const selectedQueryId = ref(props.currentQueryId || '');
const filterVersionId = ref('');
const filterStatus = ref('');
const filterDateRange = ref('all');

// 展开的项目
const expandedItems = ref(new Set<string>());

// 监听筛选条件变化
watch([selectedQueryId, filterVersionId, filterStatus, filterDateRange], () => {
  emit('filter-change', {
    queryId: selectedQueryId.value || undefined,
    versionId: filterVersionId.value || undefined,
    status: filterStatus.value || undefined,
    dateRange: filterDateRange.value
  });
});

// 监听当前查询ID变化
watch(() => props.currentQueryId, (newValue) => {
  if (newValue) {
    selectedQueryId.value = newValue;
  }
});

// 切换展开/折叠状态
const toggleExpandItem = (id: string) => {
  if (expandedItems.value.has(id)) {
    expandedItems.value.delete(id);
  } else {
    expandedItems.value.add(id);
  }
};

// 刷新历史记录
const handleRefresh = () => {
  emit('refresh');
};

// 加载查询
const loadQuery = (item: HistoryItem) => {
  emit('load-query', item);
};

// 导航到查询服务
const navigateToQuery = (queryId: string) => {
  emit('navigate-to-query', queryId);
};

// 处理页码变更
const handlePageChange = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage || props.isLoading) return;
  emit('page-change', page);
};

// SQL预览文本
const sqlPreview = (sql: string) => {
  if (!sql) return '空查询';
  return sql.length > 60 ? sql.substring(0, 60) + '...' : sql;
};

// 状态文本
const statusText = (status: QueryStatus) => {
  switch (status) {
    case 'COMPLETED': return '已完成';
    case 'FAILED': return '失败';
    case 'RUNNING': return '运行中';
    case 'CANCELLED': return '已取消';
    default: return status;
  }
};

// 格式化日期时间
const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    console.error('日期格式化错误:', error);
    return dateTimeString;
  }
};

// 格式化执行时间
const formatExecutionTime = (time: number): string => {
  if (time < 1000) {
    return `${time}ms`;
  } else {
    return `${(time / 1000).toFixed(2)}s`;
  }
};

// 组件加载时，如果有当前查询ID，则自动选择
onMounted(() => {
  if (props.currentQueryId) {
    selectedQueryId.value = props.currentQueryId;
  }
});
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>