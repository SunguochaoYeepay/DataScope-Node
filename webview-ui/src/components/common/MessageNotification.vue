<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';

export type MessageType = 'info' | 'success' | 'warning' | 'error';

export interface Message {
  id: number;
  type: MessageType;
  title?: string;
  content: string;
  duration: number;
}

const messages = ref<Message[]>([]);
let messageIdCounter = 0;

// 使用普通的number类型替代NodeJS.Timeout
const timers = new Map<number, number>();

// 添加消息
const addMessage = (type: MessageType, content: string, title?: string, duration = 3000) => {
  const id = ++messageIdCounter;
  const newMessage: Message = {
    id,
    type,
    title,
    content,
    duration
  };
  
  messages.value.push(newMessage);
  
  // 如果持续时间大于0，设置自动关闭
  if (duration > 0) {
    const timer = window.setTimeout(() => {
      removeMessage(id);
    }, duration);
    
    timers.set(id, timer);
  }
  
  return id;
};

// 移除消息
const removeMessage = (id: number) => {
  const index = messages.value.findIndex(msg => msg.id === id);
  if (index > -1) {
    messages.value.splice(index, 1);
  }
  
  if (timers.has(id)) {
    window.clearTimeout(timers.get(id)!);
    timers.delete(id);
  }
};

// 快捷方法: 成功消息
const success = (content: string, title?: string, duration = 3000) => {
  return addMessage('success', content, title, duration);
};

// 快捷方法: 错误消息
const error = (content: string, title?: string, duration = 5000) => {
  return addMessage('error', content, title, duration);
};

// 快捷方法: 警告消息
const warning = (content: string, title?: string, duration = 4000) => {
  return addMessage('warning', content, title, duration);
};

// 快捷方法: 信息消息
const info = (content: string, title?: string, duration = 3000) => {
  return addMessage('info', content, title, duration);
};

// 清空所有消息
const clear = () => {
  messages.value = [];
  timers.forEach(timer => window.clearTimeout(timer));
  timers.clear();
};

// 组件卸载时清理定时器
onUnmounted(() => {
  timers.forEach(timer => window.clearTimeout(timer));
  timers.clear();
});

// 对外暴露方法
defineExpose({
  addMessage,
  removeMessage,
  success,
  error,
  warning,
  info,
  clear
});
</script>

<template>
  <div>
    <TransitionGroup 
      tag="div" 
      name="message-fade" 
      class="fixed top-4 right-4 z-50 flex flex-col space-y-2 max-w-md"
    >
      <div 
        v-for="msg in messages" 
        :key="msg.id"
        :class="[
          'px-4 py-3 rounded-lg shadow-md transition-all duration-300 transform translate-x-0',
          'flex items-start',
          {
            'bg-green-50 border-l-4 border-green-400 text-green-800': msg.type === 'success',
            'bg-red-50 border-l-4 border-red-500 text-red-800': msg.type === 'error',
            'bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800': msg.type === 'warning',
            'bg-blue-50 border-l-4 border-blue-400 text-blue-800': msg.type === 'info'
          }
        ]"
      >
        <div class="flex-shrink-0 mr-3 pt-0.5">
          <i :class="[
            'fas text-lg',
            {
              'fa-check-circle text-green-500': msg.type === 'success',
              'fa-exclamation-circle text-red-500': msg.type === 'error',
              'fa-exclamation-triangle text-yellow-500': msg.type === 'warning',
              'fa-info-circle text-blue-500': msg.type === 'info'
            }
          ]"></i>
        </div>
        <div class="flex-1 pr-2">
          <div v-if="msg.title" class="text-sm font-medium mb-1">{{ msg.title }}</div>
          <div class="text-sm">{{ msg.content }}</div>
        </div>
        <button 
          @click="removeMessage(msg.id)" 
          class="flex-shrink-0 ml-1"
          :class="{
            'text-green-500 hover:text-green-700': msg.type === 'success',
            'text-red-500 hover:text-red-700': msg.type === 'error',
            'text-yellow-500 hover:text-yellow-700': msg.type === 'warning',
            'text-blue-500 hover:text-blue-700': msg.type === 'info'
          }"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}

.message-fade-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>