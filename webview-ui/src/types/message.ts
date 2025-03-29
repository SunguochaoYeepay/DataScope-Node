// 消息类型
export type MessageType = 'success' | 'error' | 'warning' | 'info'

// 消息配置
export interface MessageConfig {
  type: MessageType;           // 消息类型
  content: string;            // 消息内容
  duration?: number;          // 显示时长（毫秒），0 表示不自动关闭
  closable?: boolean;         // 是否可手动关闭
  showIcon?: boolean;         // 是否显示图标
  onClose?: () => void;      // 关闭回调
}

// 消息实例
export interface MessageInstance {
  id: string;                // 消息唯一标识
  config: MessageConfig;     // 消息配置
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