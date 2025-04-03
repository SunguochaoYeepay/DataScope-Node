<template>
  <div class="flex flex-col h-full">
    <!-- 整合版本状态和操作区域 -->
    <div class="bg-gray-100 border-b border-gray-200 p-2">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <!-- 版本状态标识 -->
          <span 
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2"
            :class="{
              'bg-yellow-100 text-yellow-800': versionStatus === 'DRAFT',
              'bg-green-100 text-green-800': versionStatus === 'PUBLISHED',
              'bg-gray-100 text-gray-800': versionStatus === 'DEPRECATED'
            }"
          >
            {{ getVersionStatusText(versionStatus) }}
          </span>
          
          <!-- 版本号和活跃标记 -->
          <span class="text-sm text-gray-700">
            版本 {{ versionNumber }}
            <span v-if="isActiveVersion" class="ml-1 text-green-600" title="当前活跃版本">
              <i class="fas fa-check-circle"></i>
            </span>
          </span>
          
          <!-- 版本时间信息 -->
          <span v-if="publishedAt" class="ml-3 text-xs text-gray-500">
            发布: {{ formatDateTime(publishedAt) }}
          </span>
          <span v-if="deprecatedAt" class="ml-3 text-xs text-gray-500">
            废弃: {{ formatDateTime(deprecatedAt) }}
          </span>
        </div>
        
        <!-- 操作按钮区域 - 整合所有按钮到顶部 -->
        <div class="flex items-center space-x-2">
          <!-- 草稿模式下的按钮 -->
          <template v-if="versionStatus === 'DRAFT'">
            <button
              @click="handleSaveDraft"
              :disabled="isLoading || !hasChanges"
              class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading || !hasChanges }"
            >
              <i class="far fa-save mr-1"></i>
              保存草稿
            </button>
            
            <button
              @click="handlePublish"
              :disabled="isLoading"
              class="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              <i class="fas fa-check-circle mr-1"></i>
              发布
            </button>
            
            <button
              @click="handleExecute"
              :disabled="isLoading"
              class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              <i class="fas fa-play mr-1"></i>
              执行
            </button>
          </template>
          
          <!-- 已发布但非活跃模式下的按钮 -->
          <template v-else-if="versionStatus === 'PUBLISHED' && !isActiveVersion">
            <button
              @click="handleSetActive"
              :disabled="isLoading"
              class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              <i class="fas fa-play mr-1"></i>
              设为当前版本
            </button>
            
            <button
              @click="handleExecute"
              :disabled="isLoading"
              class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              <i class="fas fa-play-circle mr-1"></i>
              执行
            </button>
          </template>
          
          <!-- 已发布且当前活跃的版本 -->
          <template v-else-if="versionStatus === 'PUBLISHED' && isActiveVersion">
            <button
              @click="handleCreateNewVersion"
              :disabled="isLoading"
              class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              <i class="fas fa-code-branch mr-1"></i>
              创建新版本
            </button>
            
            <button
              @click="handleExecute"
              :disabled="isLoading"
              class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              <i class="fas fa-play-circle mr-1"></i>
              执行
            </button>
          </template>
          
          <!-- 已废弃版本 -->
          <template v-else-if="versionStatus === 'DEPRECATED'">
            <button
              @click="handleExecute"
              :disabled="isLoading"
              class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center"
              :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
            >
              <i class="fas fa-play-circle mr-1"></i>
              执行
            </button>
          </template>
        </div>
      </div>
    </div>
    
    <!-- SQL编辑器 -->
    <div class="flex-grow overflow-hidden relative">
      <SqlEditor
        v-model="sqlContent"
        :data-source-id="dataSourceId"
        :read-only="isReadOnly"
        @execute="handleExecute"
        @save="handleSaveDraft"
      />
      
      <!-- 只读模式覆盖层 -->
      <div
        v-if="isReadOnly"
        class="absolute inset-0 bg-gray-100 bg-opacity-10 flex items-center justify-center z-10 pointer-events-none"
      >
        <div class="bg-white bg-opacity-90 px-4 py-2 rounded-md shadow-sm">
          <span class="text-gray-600">
            <i class="fas fa-lock mr-1"></i>
            此版本为{{ versionStatus === 'PUBLISHED' ? '已发布' : '已废弃' }}状态，不可编辑
          </span>
        </div>
      </div>
    </div>
    
    <!-- 版本信息底部提示，简化保留必要信息 -->
    <div class="py-2 px-4 bg-white border-t border-gray-200 text-sm text-gray-500 flex items-center">
      <span class="mr-4">
        <i class="fas fa-database mr-1"></i>
        数据源: {{ dataSourceName }}
      </span>
      
      <span v-if="lastSavedTime" class="mr-4">
        <i class="far fa-save mr-1"></i>
        {{ lastSavedTimeText }}
      </span>
      
      <span v-if="hasChanges && versionStatus === 'DRAFT'" class="text-yellow-600">
        <i class="fas fa-exclamation-circle mr-1"></i>
        有未保存的更改
      </span>
    </div>
    
    <!-- 发布确认对话框 -->
    <div 
      v-if="showPublishDialog" 
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">发布确认</h3>
        
        <p class="text-sm text-gray-600 mb-4">
          确定要发布此版本吗？发布后，该版本将不能再编辑。
        </p>
        
        <div class="mb-4">
          <label class="flex items-center">
            <input type="checkbox" v-model="setAsActive" class="h-4 w-4 text-indigo-600 border-gray-300 rounded">
            <span class="ml-2 text-sm text-gray-700">发布后设为当前活跃版本</span>
          </label>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="cancelPublish" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            取消
          </button>
          <button 
            @click="confirmPublish" 
            :disabled="isLoading"
            class="px-4 py-2 bg-green-600 text-white rounded-md text-sm hover:bg-green-700"
            :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
          >
            {{ isLoading ? '发布中...' : '确认发布' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import SqlEditor from './SqlEditor.vue';
import type { QueryVersionStatus } from '@/types/queryVersion';
import { formatDateTime } from '@/utils/formatters';
import { useQueryVersionStore } from '@/stores/queryVersion';

interface Props {
  queryId: string;
  versionId: string;
  versionStatus: QueryVersionStatus;
  versionNumber: number;
  sqlContent: string;
  dataSourceId: string;
  dataSourceName?: string;
  isActiveVersion?: boolean;
  isLoading?: boolean;
  publishedAt?: string;
  deprecatedAt?: string;
  lastSavedTime?: string;
}

const props = withDefaults(defineProps<Props>(), {
  dataSourceName: '未知数据源',
  isActiveVersion: false,
  isLoading: false,
  publishedAt: '',
  deprecatedAt: '',
  lastSavedTime: ''
});

const emit = defineEmits<{
  (e: 'update:sqlContent', value: string): void;
  (e: 'save-draft'): void;
  (e: 'publish', setActive: boolean): void;
  (e: 'set-active'): void;
  (e: 'create-new-version'): void;
  (e: 'execute', sql: string): void;
}>();

// 内部状态
const sqlContent = ref(props.sqlContent);
const originalSqlContent = ref(props.sqlContent);
const showPublishDialog = ref(false);
const setAsActive = ref(true);

// 获取版本管理 store
const versionStore = useQueryVersionStore();

// 监听外部SQL内容变化
watch(() => props.sqlContent, (newValue) => {
  sqlContent.value = newValue;
  originalSqlContent.value = newValue;
});

// 监听内部SQL内容变化，向上传递
watch(sqlContent, (newValue) => {
  emit('update:sqlContent', newValue);
});

// 计算属性：是否为只读模式
const isReadOnly = computed(() => {
  return props.versionStatus !== 'DRAFT';
});

// 计算属性：是否有未保存的更改
const hasChanges = computed(() => {
  return sqlContent.value !== originalSqlContent.value;
});

// 计算属性：最后保存时间文本
const lastSavedTimeText = computed(() => {
  if (!props.lastSavedTime) return '';
  
  try {
    const lastSavedDate = new Date(props.lastSavedTime);
    const now = new Date();
    const diffMs = now.getTime() - lastSavedDate.getTime();
    
    // 如果是30分钟内保存的，显示"几分钟前"
    if (diffMs < 30 * 60 * 1000) {
      const minutes = Math.floor(diffMs / (60 * 1000));
      return minutes <= 0 ? '刚刚保存' : `${minutes}分钟前保存`;
    }
    
    // 否则显示完整时间
    return `保存于 ${formatDateTime(props.lastSavedTime)}`;
  } catch (e) {
    return `保存于 ${props.lastSavedTime}`;
  }
});

// 获取版本状态文本
const getVersionStatusText = (status: QueryVersionStatus) => {
  switch (status) {
    case 'DRAFT':
      return '草稿';
    case 'PUBLISHED':
      return '已发布';
    case 'DEPRECATED':
      return '已废弃';
    default:
      return status;
  }
};

// 保存草稿
const handleSaveDraft = () => {
  if (props.isLoading) return;
  
  originalSqlContent.value = sqlContent.value;
  emit('save-draft');
};

// 准备发布
const handlePublish = () => {
  showPublishDialog.value = true;
};

// 取消发布
const cancelPublish = () => {
  showPublishDialog.value = false;
};

// 确认发布
const confirmPublish = () => {
  showPublishDialog.value = false;
  emit('publish', setAsActive.value);
};

// 设为当前版本
const handleSetActive = () => {
  emit('set-active');
};

// 创建新版本
const handleCreateNewVersion = () => {
  emit('create-new-version');
};

// 执行查询
const handleExecute = () => {
  emit('execute', sqlContent.value);
};
</script>