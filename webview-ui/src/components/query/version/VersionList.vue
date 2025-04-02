<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-800">版本管理</h3>
      
      <div class="flex space-x-2">
        <!-- 版本筛选 -->
        <select
          v-model="filterStatus"
          class="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">所有状态</option>
          <option value="DRAFT">草稿</option>
          <option value="PUBLISHED">已发布</option>
          <option value="DEPRECATED">已废弃</option>
        </select>
        
        <!-- 创建新版本按钮 -->
        <button
          @click="handleCreateVersion"
          class="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isLoading"
        >
          <i class="fas fa-plus mr-1"></i>
          新建版本
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
    </div>
    
    <!-- 无数据状态 -->
    <div v-else-if="filteredVersions.length === 0" class="py-8 text-center text-gray-500">
      <div class="text-3xl mb-2">
        <i class="far fa-file-alt"></i>
      </div>
      <p v-if="filterStatus">没有{{ filterStatusText }}的版本</p>
      <p v-else>该查询服务还没有版本记录</p>
      <button 
        @click="handleCreateVersion" 
        class="mt-3 text-indigo-600 hover:text-indigo-800 text-sm"
      >
        创建第一个版本
      </button>
    </div>
    
    <!-- 版本列表 -->
    <div v-else>
      <VersionListItem
        v-for="version in filteredVersions"
        :key="version.id"
        :version="version"
        :is-active="version.id === currentVersionId"
        :is-loading="isLoading"
        @action="handleVersionAction"
      />
      
      <!-- 分页控件 -->
      <div v-if="totalPages > 1" class="flex justify-center mt-4">
        <div class="flex space-x-1">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="px-3 py-1 border rounded text-sm"
            :class="currentPage <= 1 ? 'text-gray-400 border-gray-200' : 'text-gray-600 border-gray-300 hover:bg-gray-50'"
          >
            上一页
          </button>
          
          <button
            v-for="page in paginationArray"
            :key="page"
            @click="handlePageChange(page)"
            class="px-3 py-1 border rounded text-sm"
            :class="page === currentPage ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 'text-gray-600 border-gray-300 hover:bg-gray-50'"
          >
            {{ page }}
          </button>
          
          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="currentPage >= totalPages"
            class="px-3 py-1 border rounded text-sm"
            :class="currentPage >= totalPages ? 'text-gray-400 border-gray-200' : 'text-gray-600 border-gray-300 hover:bg-gray-50'"
          >
            下一页
          </button>
        </div>
      </div>
    </div>
    
    <!-- 创建版本对话框 -->
    <div 
      v-if="showCreateDialog" 
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">创建新版本</h3>
        
        <div class="mb-4">
          <p class="text-sm text-gray-600 mb-4">
            将基于当前活跃版本创建一个新的草稿版本。如果没有活跃版本，将创建第一个版本。
          </p>
          
          <div v-if="currentActiveVersion" class="bg-gray-50 p-3 rounded-md text-sm">
            <div>基于: v{{ currentActiveVersion.versionNumber }}</div>
            <div class="mt-1 text-xs text-gray-500">{{ currentActiveVersion.sqlContent.substring(0, 100) }}...</div>
          </div>
        </div>
        
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">版本描述 (可选)</label>
          <textarea 
            v-model="newVersionDescription" 
            class="w-full border border-gray-300 rounded-md p-2 text-sm" 
            rows="3"
            placeholder="输入此版本的描述信息..."
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="cancelCreateVersion" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            取消
          </button>
          <button 
            @click="confirmCreateVersion" 
            :disabled="isLoading"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
          >
            {{ isLoading ? '创建中...' : '创建' }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- 版本操作确认对话框 -->
    <div 
      v-if="showActionDialog" 
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ actionDialogTitle }}
        </h3>
        
        <p class="mb-4 text-sm text-gray-600">
          {{ actionDialogMessage }}
        </p>
        
        <div v-if="pendingAction === 'PUBLISH'" class="mb-4">
          <div class="bg-gray-50 p-3 rounded-md text-sm">
            <div>版本: v{{ selectedVersion?.versionNumber }}</div>
            <div class="mt-1 text-xs text-gray-500">{{ selectedVersion?.sqlContent.substring(0, 100) }}...</div>
          </div>
          
          <div class="mt-3">
            <label class="flex items-center">
              <input type="checkbox" v-model="setAsActive" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
              <span class="ml-2 text-sm text-gray-700">发布后设为当前活跃版本</span>
            </label>
          </div>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="cancelActionDialog" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            取消
          </button>
          <button 
            @click="confirmActionDialog" 
            :disabled="isLoading"
            class="px-4 py-2 text-white rounded-md text-sm"
            :class="[
              isLoading ? 'opacity-50 cursor-not-allowed' : '',
              pendingAction === 'PUBLISH' ? 'bg-green-600 hover:bg-green-700' :
              pendingAction === 'ACTIVATE' ? 'bg-indigo-600 hover:bg-indigo-700' :
              pendingAction === 'DEPRECATE' ? 'bg-gray-600 hover:bg-gray-700' :
              'bg-indigo-600 hover:bg-indigo-700'
            ]"
          >
            {{ isLoading ? '处理中...' : '确认' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { QueryVersion, VersionAction, QueryVersionStatus } from '@/types/queryVersion';
import VersionListItem from './VersionListItem.vue';

interface Props {
  queryId: string;
  versions?: QueryVersion[];
  currentVersionId?: string;
  isLoading?: boolean;
  currentPage?: number;
  totalPages?: number;
  pageSize?: number;
}

const props = withDefaults(defineProps<Props>(), {
  versions: () => [],
  currentVersionId: '',
  isLoading: false,
  currentPage: 1,
  totalPages: 1,
  pageSize: 10
});

const emit = defineEmits<{
  (e: 'create', description: string): void;
  (e: 'publish', version: QueryVersion, setActive: boolean): void;
  (e: 'deprecate', version: QueryVersion): void;
  (e: 'activate', version: QueryVersion): void;
  (e: 'edit', version: QueryVersion): void;
  (e: 'page-change', page: number): void;
  (e: 'filter-change', status: QueryVersionStatus | ''): void;
}>();

// 状态过滤
const filterStatus = ref<QueryVersionStatus | ''>('');

// 对话框状态
const showCreateDialog = ref(false);
const showActionDialog = ref(false);
const newVersionDescription = ref('');
const pendingAction = ref<VersionAction | null>(null);
const selectedVersion = ref<QueryVersion | null>(null);
const setAsActive = ref(true);

// 根据过滤条件筛选版本列表
const filteredVersions = computed(() => {
  if (!filterStatus.value) return props.versions;
  return props.versions.filter(v => v.versionStatus === filterStatus.value);
});

// 当前活跃版本
const currentActiveVersion = computed(() => {
  return props.versions.find(v => v.id === props.currentVersionId) || null;
});

// 过滤状态文本
const filterStatusText = computed(() => {
  switch (filterStatus.value) {
    case 'DRAFT': return '草稿';
    case 'PUBLISHED': return '已发布';
    case 'DEPRECATED': return '已废弃';
    default: return '';
  }
});

// 生成分页数组
const paginationArray = computed(() => {
  const pages = [];
  const maxVisible = 5;
  
  if (props.totalPages <= maxVisible) {
    // 总页数少于最大可见数，显示所有页码
    for (let i = 1; i <= props.totalPages; i++) {
      pages.push(i);
    }
  } else {
    // 总页数多于最大可见数，显示部分页码
    let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(props.totalPages, start + maxVisible - 1);
    
    // 调整起始页码，确保显示最大可见数的页码
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

// 操作对话框标题
const actionDialogTitle = computed(() => {
  switch (pendingAction.value) {
    case 'PUBLISH': return '发布版本';
    case 'DEPRECATE': return '废弃版本';
    case 'ACTIVATE': return '设为当前版本';
    default: return '确认操作';
  }
});

// 操作对话框消息
const actionDialogMessage = computed(() => {
  switch (pendingAction.value) {
    case 'PUBLISH':
      return `确定要发布版本 v${selectedVersion.value?.versionNumber} 吗？发布后，该版本将不能再编辑。`;
    case 'DEPRECATE':
      return `确定要废弃版本 v${selectedVersion.value?.versionNumber} 吗？废弃后，该版本将不能再被使用。`;
    case 'ACTIVATE':
      return `确定要将版本 v${selectedVersion.value?.versionNumber} 设为当前活跃版本吗？这将影响查询服务的执行结果。`;
    default:
      return '确定要执行此操作吗？';
  }
});

// 监听过滤器变化
watch(filterStatus, (newValue) => {
  emit('filter-change', newValue);
});

// 处理版本操作
const handleVersionAction = (action: VersionAction, version: QueryVersion) => {
  selectedVersion.value = version;
  
  if (action === 'EDIT') {
    // 编辑操作直接触发，不需要确认
    emit('edit', version);
    return;
  }
  
  // 其他操作需要确认
  pendingAction.value = action;
  showActionDialog.value = true;
  
  // 发布操作默认设置为活跃版本
  if (action === 'PUBLISH') {
    setAsActive.value = true;
  }
};

// 处理创建版本
const handleCreateVersion = () => {
  showCreateDialog.value = true;
  newVersionDescription.value = '';
};

// 取消创建版本
const cancelCreateVersion = () => {
  showCreateDialog.value = false;
  newVersionDescription.value = '';
};

// 确认创建版本
const confirmCreateVersion = () => {
  emit('create', newVersionDescription.value);
  showCreateDialog.value = false;
  newVersionDescription.value = '';
};

// 取消操作对话框
const cancelActionDialog = () => {
  showActionDialog.value = false;
  pendingAction.value = null;
  selectedVersion.value = null;
};

// 确认操作对话框
const confirmActionDialog = () => {
  if (!selectedVersion.value || !pendingAction.value) return;
  
  switch (pendingAction.value) {
    case 'PUBLISH':
      emit('publish', selectedVersion.value, setAsActive.value);
      break;
    case 'DEPRECATE':
      emit('deprecate', selectedVersion.value);
      break;
    case 'ACTIVATE':
      emit('activate', selectedVersion.value);
      break;
  }
  
  showActionDialog.value = false;
  pendingAction.value = null;
  selectedVersion.value = null;
};

// 处理页码变更
const handlePageChange = (page: number) => {
  if (page < 1 || page > props.totalPages || page === props.currentPage) return;
  emit('page-change', page);
};
</script>