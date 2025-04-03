<template>
  <div class="p-4 bg-white border border-gray-200 rounded-md shadow-sm">
    <h3 class="text-lg font-medium text-gray-800 mb-4">查询服务状态</h3>
    
    <div class="flex justify-between items-center mb-4">
      <div class="flex items-center">
        <StatusIndicator
          :status="status"
          :disabled-reason="disabledReason"
        />
      </div>
      
      <StatusToggle
        :status="status"
        :query-id="queryId"
        :is-loading="isLoading"
        @enable="handleEnable"
        @disable="handleDisable"
      />
    </div>
    
    <!-- 禁用详情 -->
    <div v-if="status === 'DISABLED'" class="mt-2 p-3 bg-red-50 border border-red-100 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-circle text-red-400"></i>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">此查询服务已被禁用</h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ disabledReason || '未提供禁用原因' }}</p>
          </div>
          <div class="mt-1 text-xs text-red-500" v-if="disabledAt">
            禁用时间: {{ formatDateTime(disabledAt) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import StatusIndicator from './StatusIndicator.vue';
import StatusToggle from './StatusToggle.vue';

interface Props {
  queryId: string;
  initialStatus?: 'ENABLED' | 'DISABLED';
  disabledReason?: string;
  disabledAt?: string;
}

const props = withDefaults(defineProps<Props>(), {
  initialStatus: 'ENABLED',
  disabledReason: '',
  disabledAt: ''
});

const emit = defineEmits<{
  (e: 'status-change', status: 'ENABLED' | 'DISABLED', reason?: string): void;
}>();

// 组件状态
const status = ref<'ENABLED' | 'DISABLED'>(props.initialStatus);
const disabledReason = ref(props.disabledReason);
const disabledAt = ref(props.disabledAt);
const isLoading = ref(false);

// 启用查询服务
const handleEnable = async (queryId: string) => {
  try {
    isLoading.value = true;
    
    // 这里将来会调用API
    console.log(`启用查询服务: ${queryId}`);
    
    // 更新本地状态
    status.value = 'ENABLED';
    disabledReason.value = '';
    disabledAt.value = '';
    
    // 通知父组件状态变更
    emit('status-change', 'ENABLED');
  } catch (error) {
    console.error('启用查询服务失败:', error);
    // 这里可以添加错误提示
  } finally {
    isLoading.value = false;
  }
};

// 禁用查询服务
const handleDisable = async (queryId: string, reason: string) => {
  try {
    isLoading.value = true;
    
    // 这里将来会调用API
    console.log(`禁用查询服务: ${queryId}, 原因: ${reason}`);
    
    // 更新本地状态
    status.value = 'DISABLED';
    disabledReason.value = reason;
    disabledAt.value = new Date().toISOString();
    
    // 通知父组件状态变更
    emit('status-change', 'DISABLED', reason);
  } catch (error) {
    console.error('禁用查询服务失败:', error);
    // 这里可以添加错误提示
  } finally {
    isLoading.value = false;
  }
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
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (error) {
    console.error('日期格式化错误:', error);
    return dateTimeString;
  }
};
</script>