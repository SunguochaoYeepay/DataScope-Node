<template>
  <div 
    class="p-4 border border-gray-200 rounded-md mb-3 hover:shadow-sm transition-shadow"
    :class="{
      'bg-white': !isActive,
      'bg-green-50 border-green-200': isActive
    }"
  >
    <div class="flex items-center justify-between">
      <div class="flex items-center">
        <!-- 版本号和状态 -->
        <div class="mr-4">
          <h3 class="text-lg font-semibold text-gray-900">
            v{{ version.versionNumber }}
            <span v-if="version.versionName" class="ml-1 text-sm font-normal text-gray-500">
              {{ version.versionName }}
            </span>
          </h3>
          <div class="flex items-center mt-1">
            <VersionBadge
              :status="version.versionStatus"
              :is-active="isActive"
            />
            <span v-if="isActive" class="ml-2 text-xs text-green-600">
              <i class="fas fa-check-circle mr-1"></i>
              当前活跃版本
            </span>
          </div>
        </div>
      </div>
      
      <!-- 操作按钮组 -->
      <div class="flex items-center space-x-2">
        <button
          v-if="version.versionStatus === 'DRAFT'"
          @click="handleAction('PUBLISH')"
          class="px-2 py-1 text-xs text-green-700 bg-green-100 hover:bg-green-200 rounded"
          :disabled="isLoading"
        >
          <i class="fas fa-check mr-1"></i>
          发布
        </button>
        
        <button
          v-if="version.versionStatus === 'PUBLISHED' && !isActive"
          @click="handleAction('ACTIVATE')"
          class="px-2 py-1 text-xs text-indigo-700 bg-indigo-100 hover:bg-indigo-200 rounded"
          :disabled="isLoading"
        >
          <i class="fas fa-play mr-1"></i>
          设为当前版本
        </button>
        
        <button
          v-if="version.versionStatus === 'PUBLISHED' && !isActive"
          @click="handleAction('DEPRECATE')"
          class="px-2 py-1 text-xs text-gray-700 bg-gray-100 hover:bg-gray-200 rounded"
          :disabled="isLoading"
        >
          <i class="fas fa-archive mr-1"></i>
          废弃
        </button>
        
        <button
          v-if="version.versionStatus === 'DRAFT'"
          @click="handleAction('EDIT')"
          class="px-2 py-1 text-xs text-blue-700 bg-blue-100 hover:bg-blue-200 rounded"
          :disabled="isLoading"
        >
          <i class="fas fa-edit mr-1"></i>
          编辑
        </button>
      </div>
    </div>
    
    <!-- 版本详情 -->
    <div class="mt-3 text-sm text-gray-500 flex items-center justify-between">
      <div>
        <span>创建于 {{ formatDateTime(version.createdAt) }}</span>
        <span v-if="version.publishedAt" class="ml-3">
          发布于 {{ formatDateTime(version.publishedAt) }}
        </span>
      </div>
      
      <button 
        @click="toggleDetails" 
        class="text-xs text-indigo-600 hover:text-indigo-800"
      >
        {{ showDetails ? '收起详情' : '查看详情' }}
      </button>
    </div>
    
    <!-- 展开的详情内容 -->
    <div v-if="showDetails" class="mt-3 pt-3 border-t border-gray-200">
      <div v-if="version.description" class="mb-3">
        <h4 class="text-sm font-medium text-gray-700 mb-1">版本描述</h4>
        <p class="text-sm text-gray-600">{{ version.description }}</p>
      </div>
      
      <div class="mb-3">
        <h4 class="text-sm font-medium text-gray-700 mb-1">SQL内容预览</h4>
        <div class="bg-gray-50 p-2 rounded border border-gray-200 overflow-auto max-h-32">
          <pre class="text-xs text-gray-700">{{ version.sqlContent }}</pre>
        </div>
      </div>
      
      <div class="text-xs text-gray-500 grid grid-cols-2 gap-2">
        <div>
          <span class="font-medium">版本ID:</span> {{ version.id }}
        </div>
        <div>
          <span class="font-medium">数据源ID:</span> {{ version.dataSourceId }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { QueryVersion, VersionAction } from '@/types/queryVersion';
import VersionBadge from './VersionBadge.vue';

interface Props {
  version: QueryVersion;
  isActive?: boolean;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  isLoading: false
});

const emit = defineEmits<{
  (e: 'action', action: VersionAction, version: QueryVersion): void;
}>();

// 展开详情状态
const showDetails = ref(false);

// 切换详情显示
const toggleDetails = () => {
  showDetails.value = !showDetails.value;
};

// 处理版本操作
const handleAction = (action: VersionAction) => {
  if (props.isLoading) return;
  emit('action', action, props.version);
};

// 格式化日期时间
const formatDateTime = (dateTimeString: string): string => {
  if (!dateTimeString) return '';
  
  try {
    const date = new Date(dateTimeString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('日期格式化错误:', error);
    return dateTimeString;
  }
};
</script>