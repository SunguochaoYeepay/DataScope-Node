// 消息类型
export type MessageType = 'info' | 'success' | 'warning' | 'error';

// 消息配置
export interface MessageConfig {
  type: MessageType;
  content: string;
  duration?: number;
  showIcon?: boolean;
  closable?: boolean;
}

// 消息实例
export interface MessageInstance {
  id: string;
  config: MessageConfig;
}

// 消息服务
export interface MessageService {
  info(content: string, duration?: number): void;
  success(content: string, duration?: number): void;
  warning(content: string, duration?: number): void;
  error(content: string, duration?: number): void;
  show(config: MessageConfig): void;
  close(id: string): void;
  closeAll(): void;
}