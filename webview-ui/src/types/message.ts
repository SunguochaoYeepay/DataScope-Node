// 消息类型
export type MessageType = 'info' | 'success' | 'warning' | 'error';

// 消息配置
export interface MessageConfig {
  type: MessageType;
  content: string;
  duration?: number;
  showIcon?: boolean;
  closable?: boolean;
  // 用于去重的key，默认使用content作为key
  key?: string;
  // 是否允许合并相同消息 (默认为true)
  allowDuplicate?: boolean;
  // 计数标记，对于合并的消息显示出现次数
  count?: number;
}

// 消息实例
export interface MessageInstance {
  id: string;
  config: MessageConfig;
  // 添加创建时间，用于检测短时间内的重复消息
  createdAt: number;
}

// 消息队列配置
export interface MessageQueueConfig {
  // 判断为重复消息的时间窗口(ms)
  deduplicationTimeWindow?: number;
  // 最大显示数量
  maxCount?: number;
  // 默认关闭时间
  defaultDuration?: number;
}

// 消息服务
export interface MessageService {
  info(content: string, duration?: number, allowDuplicate?: boolean): void;
  success(content: string, duration?: number, allowDuplicate?: boolean): void;
  warning(content: string, duration?: number, allowDuplicate?: boolean): void;
  error(content: string, duration?: number, allowDuplicate?: boolean): void;
  show(config: MessageConfig): void;
  close(id: string): void;
  closeAll(): void;
  // 更新队列配置
  setQueueConfig(config: Partial<MessageQueueConfig>): void;
}