<template>
  <div 
    class="flex items-center h-10 px-4 shadow-sm"
    :class="{
      'bg-blue-50 border-b border-blue-200': versionStatus === 'DRAFT',
      'bg-green-50 border-b border-green-200': versionStatus === 'PUBLISHED' && isActive,
      'bg-indigo-50 border-b border-indigo-200': versionStatus === 'PUBLISHED' && !isActive,
      'bg-gray-50 border-b border-gray-200': versionStatus === 'DEPRECATED'
    }"
  >
    <VersionBadge
      :status="versionStatus"
      :is-active="isActive"
    />
    
    <span class="ml-2 text-sm">
      版本 v{{ versionNumber }}
      <template v-if="versionStatus === 'PUBLISHED' && isActive">
        (当前活跃版本)
      </template>
    </span>
    
    <div class="flex-grow"></div>
    
    <div class="flex items-center text-sm space-x-3">
      <button
        v-if="versionStatus === 'DRAFT'"
        @click="handlePublish"
        class="text-green-600 hover:text-green-800"
        :disabled="isLoading"
      >
        <i class="fas fa-check-circle mr-1"></i>
        发布
      </button>
      
      <span v-if="versionStatus === 'PUBLISHED'" class="text-gray-500">
        <i class="far fa-calendar-alt mr-1"></i>
        {{ publishedAtText }}
      </span>
      
      <span v-if="versionStatus === 'DEPRECATED'" class="text-gray-500">
        <i class="far fa-calendar-times mr-1"></i>
        {{ deprecatedAtText }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QueryVersionStatus } from '@/types/queryVersion';
import VersionBadge from './VersionBadge.vue';

interface Props {
  versionStatus: QueryVersionStatus;
  versionNumber: number;
  isActive?: boolean;
  isLoading?: boolean;
  publishedAt?: string;
  deprecatedAt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  isLoading: false,
  publishedAt: '',
  deprecatedAt: ''
});

const emit = defineEmits<{
  (e: 'publish'): void;
}>();

// 格式化发布时间文本
const publishedAtText = computed(() => {
  if (!props.publishedAt) return '';
  
  try {
    const date = new Date(props.publishedAt);
    return `发布于 ${date.toLocaleDateString('zh-CN')}`;
  } catch (error) {
    console.error('日期格式化错误:', error);
    return `发布于 ${props.publishedAt}`;
  }
});

// 格式化废弃时间文本
const deprecatedAtText = computed(() => {
  if (!props.deprecatedAt) return '';
  
  try {
    const date = new Date(props.deprecatedAt);
    return `废弃于 ${date.toLocaleDateString('zh-CN')}`;
  } catch (error) {
    console.error('日期格式化错误:', error);
    return `废弃于 ${props.deprecatedAt}`;
  }
});

// 处理发布操作
const handlePublish = () => {
  if (props.isLoading) return;
  emit('publish');
};
</script>