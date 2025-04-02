<template>
  <div class="flex flex-col h-full">
    <!-- 版本状态显示区域 -->
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
          
          <!-- 版本号 -->
          <span class="text-sm text-gray-700">
            版本 {{ versionNumber }}
            <span v-if="isActiveVersion" class="ml-1 text-green-600" title="当前活跃版本">
              <i class="fas fa-check-circle"></i>
            </span>
          </span>
        </div>
        
        <!-- 版本操作区 -->
        <div class="flex items-center space-x-2">
          <span v-if="publishedAt" class="text-xs text-gray-500 mr-2">
            发布于: {{ formatDateTime(publishedAt) }}
          </span>
          <span v-if="deprecatedAt" class="text-xs text-gray-500 mr-2">
            废弃于: {{ formatDateTime(deprecatedAt) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- 版本状态栏 -->
    <VersionStatusBar
      :version-status="versionStatus"
      :version-number="versionNumber"
      :is-active="isActiveVersion"
      :is-loading="isLoading"
      :published-at="publishedAt"
      :deprecated-at="deprecatedAt"
      @publish="handlePublish"
    />
    
    <!-- SQL编辑器 -->
    <div class="flex-grow overflow-hidden relative">
      <SqlEditor
        v-model="sqlContent"
        :data-source-id="dataSourceId"
        :read-only="isReadOnly"
        @execute="handleExecute"
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
    
    <!-- 编辑器底部工具栏 -->
    <div class="h-12 bg-white border-t border-gray-200 flex items-center justify-between px-4">
      <div class="flex items-center space-x-3 text-sm">
        <span class="text-gray-500">
          <i class="fas fa-database mr-1"></i>
          数据源: {{ dataSourceName }}
        </span>
        
        <span v-if="lastSavedTime" class="text-gray-500">
          <i class="far fa-save mr-1"></i>
          {{ lastSavedTimeText }}
        </span>
      </div>
      
      <div v-if="versionStatus === 'DRAFT'" class="flex items-center space-x-2">
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
      </div>
      
      <div v-else-if="versionStatus === 'PUBLISHED' && !isActiveVersion" class="flex items-center space-x-2">
        <button
          @click="handleSetActive"
          :disabled="isLoading"
          class="px-3 py-1 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
        >
          <i class="fas fa-play mr-1"></i>
          设为当前版本
        </button>
      </div>
      
      <div v-else-if="versionStatus === 'PUBLISHED' && isActiveVersion" class="flex items-center space-x-2">
        <button
          @click="handleCreateNewVersion"
          :disabled="isLoading"
          class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          :class="{ 'opacity-50 cursor-not-allowed': isLoading }"
        >
          <i class="fas fa-code-branch mr-1"></i>
          创建新版本
        </button>
      </div>
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
import VersionStatusBar from './version/VersionStatusBar.vue';
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
    const date = new Date(props.lastSavedTime);
    return `上次保存: ${date.toLocaleString('zh-CN')}`;
  } catch (error) {
    console.error('日期格式化错误:', error);
    return `上次保存: ${props.lastSavedTime}`;
  }
});

// 获取版本状态文本
const getVersionStatusText = (status: QueryVersionStatus): string => {
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

// 处理保存草稿
const handleSaveDraft = async () => {
  if (isReadOnly.value || props.isLoading || !hasChanges.value) return;
  
  try {
    // 保存草稿版本
    await versionStore.saveDraft(props.queryId, {
      versionId: props.versionId,
      queryText: sqlContent.value
    });
    
    // 更新本地状态，记录保存后的内容
    originalSqlContent.value = sqlContent.value;
    
    // 通知父组件
    emit('save-draft');
  } catch (error) {
    console.error('保存草稿失败:', error);
  }
};

// 处理发布操作
const handlePublish = () => {
  if (props.isLoading) return;
  
  // 如果有未保存的更改，先保存
  if (hasChanges.value) {
    handleSaveDraft();
  }
  
  showPublishDialog.value = true;
};

// 取消发布
const cancelPublish = () => {
  showPublishDialog.value = false;
};

// 确认发布
const confirmPublish = async () => {
  try {
    // 执行发布操作
    await versionStore.publishVersion(props.queryId, props.versionId, setAsActive.value);
    
    // 隐藏对话框
    showPublishDialog.value = false;
    
    // 通知父组件
    emit('publish', setAsActive.value);
  } catch (error) {
    console.error('发布版本失败:', error);
  }
};

// 处理查询执行
const handleExecute = (errorMessage?: string) => {
  if (errorMessage) {
    // 有错误信息，不执行查询
    return;
  }
  
  // 没有错误信息，正常执行
  emit('execute', sqlContent.value);
};

// 设为当前版本
const handleSetActive = async () => {
  if (props.isLoading) return;
  
  try {
    // 设置为活跃版本
    await versionStore.setActiveVersion(props.queryId, props.versionId);
    
    // 通知父组件
    emit('set-active');
  } catch (error) {
    console.error('设置活跃版本失败:', error);
  }
};

// 创建新版本
const handleCreateNewVersion = async () => {
  if (props.isLoading) return;
  
  try {
    // 创建新版本
    const newVersion = await versionStore.createNewVersion(props.queryId, props.versionId);
    
    // 通知父组件
    emit('create-new-version');
  } catch (error) {
    console.error('创建新版本失败:', error);
  }
};
</script>