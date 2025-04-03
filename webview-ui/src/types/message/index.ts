/**
 * 消息类型定义
 */

// 消息类型
export type MessageType = 'success' | 'error' | 'warning' | 'info';

// 消息服务接口
export interface MessageService {
  success(content: string, duration?: number): void;
  error(content: string, duration?: number): void;
  warning(content: string, duration?: number): void;
  info(content: string, duration?: number): void;
}

// 创建默认的简单消息服务（使用console和alert）
export const createSimpleMessageService = (): MessageService => {
  return {
    success(content: string, duration?: number) {
      console.log(`Success: ${content}`);
      alert(content);
    },
    error(content: string, duration?: number) {
      console.error(`Error: ${content}`);
      alert(`错误: ${content}`);
    },
    warning(content: string, duration?: number) {
      console.warn(`Warning: ${content}`);
      alert(`警告: ${content}`);
    },
    info(content: string, duration?: number) {
      console.info(`Info: ${content}`);
      alert(content);
    }
  };
};

// 导出默认消息服务实例
export const message = createSimpleMessageService();

export default message;