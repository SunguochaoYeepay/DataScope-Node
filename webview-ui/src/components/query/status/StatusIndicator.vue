<template>
  <div class="flex items-center">
    <!-- 状态指示图标 -->
    <div class="mr-2">
      <div v-if="status === 'ENABLED'" class="w-3 h-3 bg-green-500 rounded-full"></div>
      <div v-else class="w-3 h-3 bg-red-500 rounded-full"></div>
    </div>
    
    <!-- 状态文本 -->
    <span 
      :class="{
        'text-green-600 font-medium': status === 'ENABLED',
        'text-red-600 font-medium': status === 'DISABLED'
      }"
    >
      {{ status === 'ENABLED' ? '已启用' : '已禁用' }}
    </span>
    
    <!-- 禁用原因 (如果有) -->
    <span 
      v-if="status === 'DISABLED' && disabledReason" 
      class="ml-2 text-sm text-gray-500"
      :title="disabledReason"
    >
      <i class="fas fa-info-circle mr-1"></i>
      {{ shortReason }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  status: 'ENABLED' | 'DISABLED';
  disabledReason?: string;
}

const props = withDefaults(defineProps<Props>(), {
  status: 'ENABLED',
  disabledReason: ''
});

// 截断过长的禁用原因
const shortReason = computed(() => {
  if (!props.disabledReason) return '';
  return props.disabledReason.length > 30 
    ? props.disabledReason.substring(0, 27) + '...' 
    : props.disabledReason;
});
</script>