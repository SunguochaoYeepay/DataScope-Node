<template>
  <span 
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
    :class="badgeClass"
  >
    <span 
      v-if="showIcon" 
      class="w-2 h-2 rounded-full mr-1.5"
      :class="iconClass"
    ></span>
    {{ badgeText }}
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { QueryVersionStatus } from '@/types/queryVersion';

interface Props {
  status: QueryVersionStatus;
  isActive?: boolean;
  showIcon?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isActive: false,
  showIcon: true
});

// 徽章文本
const badgeText = computed(() => {
  if (props.status === 'DRAFT') {
    return '草稿';
  } else if (props.status === 'PUBLISHED') {
    return props.isActive ? '当前版本' : '已发布';
  } else if (props.status === 'DEPRECATED') {
    return '已废弃';
  }
  return props.status; // 默认返回原始状态值
});

// 徽章样式类
const badgeClass = computed(() => {
  if (props.status === 'DRAFT') {
    return 'bg-blue-100 text-blue-800';
  } else if (props.status === 'PUBLISHED') {
    return props.isActive
      ? 'bg-green-100 text-green-800'
      : 'bg-indigo-100 text-indigo-800';
  } else if (props.status === 'DEPRECATED') {
    return 'bg-gray-100 text-gray-800';
  }
  return 'bg-gray-100 text-gray-800'; // 默认样式
});

// 图标样式类
const iconClass = computed(() => {
  if (props.status === 'DRAFT') {
    return 'bg-blue-400';
  } else if (props.status === 'PUBLISHED') {
    return props.isActive
      ? 'bg-green-400'
      : 'bg-indigo-400';
  } else if (props.status === 'DEPRECATED') {
    return 'bg-gray-400';
  }
  return 'bg-gray-400'; // 默认样式
});
</script>