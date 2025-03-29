<script setup lang="ts">
import { useMessageStore } from '@/stores/message';
import { computed } from 'vue';

const messageStore = useMessageStore();
const messages = computed(() => messageStore.messages);

const getIconClass = (type: string): string => {
  switch (type) {
    case 'success':
      return 'fas fa-check-circle text-green-500';
    case 'error':
      return 'fas fa-times-circle text-red-500';
    case 'warning':
      return 'fas fa-exclamation-circle text-yellow-500';
    case 'info':
    default:
      return 'fas fa-info-circle text-blue-500';
  }
};

const getBgClass = (type: string): string => {
  switch (type) {
    case 'success':
      return 'bg-green-50 border-green-200';
    case 'error':
      return 'bg-red-50 border-red-200';
    case 'warning':
      return 'bg-yellow-50 border-yellow-200';
    case 'info':
    default:
      return 'bg-blue-50 border-blue-200';
  }
};

const getTextClass = (type: string): string => {
  switch (type) {
    case 'success':
      return 'text-green-800';
    case 'error':
      return 'text-red-800';
    case 'warning':
      return 'text-yellow-800';
    case 'info':
    default:
      return 'text-blue-800';
  }
};

const closeMessage = (id: string) => {
  messageStore.removeMessage(id);
};
</script>

<template>
  <div class="fixed top-4 right-4 z-50 flex flex-col items-end space-y-2 max-w-sm">
    <transition-group name="message">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'w-full rounded-md border px-4 py-3 shadow-md flex items-start',
          getBgClass(message.type)
        ]"
      >
        <div class="flex-shrink-0 mr-3 mt-0.5">
          <i :class="getIconClass(message.type)"></i>
        </div>
        <div class="flex-1">
          <p :class="getTextClass(message.type)">{{ message.content }}</p>
        </div>
        <button
          @click="closeMessage(message.id)"
          class="ml-4 -mt-1 -mr-1 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <i class="fas fa-times"></i>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style scoped>
.message-enter-active,
.message-leave-active {
  transition: all 0.3s ease;
}
.message-enter-from {
  opacity: 0;
  transform: translateX(30px);
}
.message-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>