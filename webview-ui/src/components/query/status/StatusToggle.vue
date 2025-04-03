<template>
  <div>
    <!-- 状态切换开关 -->
    <div class="flex items-center">
      <span class="mr-2 text-sm text-gray-700">{{ status === 'ENABLED' ? '已启用' : '已禁用' }}</span>
      <button 
        @click="confirmStatusChange" 
        :disabled="isLoading"
        class="relative inline-flex h-6 w-11 items-center rounded-full"
        :class="{
          'bg-green-500': status === 'ENABLED',
          'bg-gray-300': status === 'DISABLED',
          'opacity-50 cursor-not-allowed': isLoading
        }"
      >
        <span 
          class="inline-block h-4 w-4 transform rounded-full bg-white transition"
          :class="{
            'translate-x-6': status === 'ENABLED',
            'translate-x-1': status === 'DISABLED'
          }"
        ></span>
      </button>
    </div>

    <!-- 确认对话框 -->
    <div 
      v-if="showConfirmDialog" 
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold mb-4">
          {{ status === 'ENABLED' ? '禁用确认' : '启用确认' }}
        </h3>
        
        <p class="mb-4">
          {{ status === 'ENABLED' 
            ? '确定要禁用此查询服务吗？禁用后，该服务将无法执行。' 
            : '确定要启用此查询服务吗？' 
          }}
        </p>
        
        <!-- 禁用原因表单 -->
        <div v-if="status === 'ENABLED'" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">禁用原因</label>
          <textarea 
            v-model="disableReason" 
            class="w-full border border-gray-300 rounded-md p-2 text-sm" 
            rows="3"
            placeholder="请输入禁用此查询服务的原因..."
          ></textarea>
        </div>
        
        <div class="flex justify-end space-x-2">
          <button 
            @click="cancelStatusChange" 
            class="px-4 py-2 border border-gray-300 rounded-md text-sm"
          >
            取消
          </button>
          <button 
            @click="confirmAndChangeStatus" 
            :disabled="isLoading || (status === 'ENABLED' && !disableReason.trim())"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm"
            :class="{
              'opacity-50 cursor-not-allowed': isLoading || (status === 'ENABLED' && !disableReason.trim())
            }"
          >
            {{ isLoading ? '处理中...' : '确认' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  status: 'ENABLED' | 'DISABLED';
  queryId: string;
  isLoading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  status: 'ENABLED',
  isLoading: false
});

const emit = defineEmits<{
  (e: 'enable', queryId: string): void;
  (e: 'disable', queryId: string, reason: string): void;
}>();

const showConfirmDialog = ref(false);
const disableReason = ref('');

// 打开确认对话框
const confirmStatusChange = () => {
  showConfirmDialog.value = true;
  // 如果是启用操作，不需要填写原因
  if (props.status === 'DISABLED') {
    disableReason.value = '';
  }
};

// 取消状态变更
const cancelStatusChange = () => {
  showConfirmDialog.value = false;
  disableReason.value = '';
};

// 确认并执行状态变更
const confirmAndChangeStatus = () => {
  if (props.isLoading) return;
  
  if (props.status === 'ENABLED') {
    // 当前启用状态，将执行禁用操作
    if (!disableReason.value.trim()) return;
    emit('disable', props.queryId, disableReason.value);
  } else {
    // 当前禁用状态，将执行启用操作
    emit('enable', props.queryId);
  }
  
  showConfirmDialog.value = false;
};
</script>