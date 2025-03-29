import { defineStore } from 'pinia';
import { ref } from 'vue';

export interface Message {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  content: string;
  duration?: number;
}

export const useMessageStore = defineStore('message', () => {
  // 状态
  const messages = ref<Message[]>([]);

  // 添加消息
  const addMessage = (message: Omit<Message, 'id'>) => {
    const id = `msg-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const newMessage: Message = {
      id,
      ...message,
      duration: message.duration || 3000,
    };
    
    messages.value.push(newMessage);
    
    // 自动移除
    if (newMessage.duration > 0) {
      setTimeout(() => {
        removeMessage(id);
      }, newMessage.duration);
    }
    
    return id;
  };
  
  // 移除消息
  const removeMessage = (id: string) => {
    const index = messages.value.findIndex(msg => msg.id === id);
    if (index !== -1) {
      messages.value.splice(index, 1);
    }
  };
  
  // 清空所有消息
  const clearAllMessages = () => {
    messages.value = [];
  };
  
  // 快捷方法
  const success = (content: string, duration = 3000) => {
    return addMessage({ type: 'success', content, duration });
  };
  
  const error = (content: string, duration = 3000) => {
    return addMessage({ type: 'error', content, duration });
  };
  
  const info = (content: string, duration = 3000) => {
    return addMessage({ type: 'info', content, duration });
  };
  
  const warning = (content: string, duration = 3000) => {
    return addMessage({ type: 'warning', content, duration });
  };
  
  return {
    messages,
    addMessage,
    removeMessage,
    clearAllMessages,
    success,
    error,
    info,
    warning
  };
});