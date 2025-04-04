import { createVNode, render } from 'vue'
import type { App } from 'vue'
import type { MessageConfig, MessageInstance, MessageService, MessageQueueConfig } from '@/types/message'
import MessageAlert from '@/components/common/MessageAlert.vue'

// 消息容器
let messageContainer: HTMLDivElement | null = null

// 消息实例列表
const instances: MessageInstance[] = []

// 消息队列配置
const queueConfig: MessageQueueConfig = {
  deduplicationTimeWindow: 3000, // 3秒内的相同消息将被合并
  maxCount: 10, // 最多显示10条消息
  defaultDuration: 3000 // 默认显示3秒
}

// 创建消息容器
const createMessageContainer = () => {
  if (messageContainer) return

  messageContainer = document.createElement('div')
  messageContainer.className = 'fixed top-4 right-4 z-50 flex flex-col gap-2'
  document.body.appendChild(messageContainer)
}

// 移除消息实例
const removeInstance = (id: string) => {
  const index = instances.findIndex(instance => instance.id === id)
  if (index !== -1) {
    instances.splice(index, 1)
    if (instances.length === 0 && messageContainer) {
      document.body.removeChild(messageContainer)
      messageContainer = null
    }
  }
}

// 检查是否为重复消息
const isDuplicateMessage = (config: MessageConfig): MessageInstance | null => {
  // 如果明确允许重复，则不检查
  if (config.allowDuplicate === true) {
    return null
  }
  
  const now = Date.now()
  const key = config.key || config.content // 使用key或content作为去重依据
  
  // 查找时间窗口内相同类型和内容的消息
  const duplicate = instances.find(instance => {
    const sameType = instance.config.type === config.type
    const sameContent = (instance.config.key || instance.config.content) === key
    const withinTimeWindow = now - instance.createdAt < queueConfig.deduplicationTimeWindow!
    return sameType && sameContent && withinTimeWindow
  })
  
  return duplicate || null
}

// 更新重复消息
const updateDuplicateMessage = (duplicate: MessageInstance) => {
  // 将旧消息移到队列顶部
  const container = document.getElementById(duplicate.id)
  if (container && container.parentNode) {
    container.parentNode.appendChild(container) // 移到末尾显示
  }
  
  // 更新计数
  const count = (duplicate.config.count || 1) + 1
  duplicate.config.count = count
  
  // 创建或更新消息内容
  if (container) {
    const contentEl = container.querySelector('.message-content') as HTMLElement | null
    if (contentEl) {
      const baseContent = duplicate.config.content.replace(/ \(\d+\)$/, '') // 移除已有的计数
      contentEl.textContent = `${baseContent} (${count})`
    }
    
    // 重新设置自动关闭计时器
    const closeButton = container.querySelector('.message-close-btn') as HTMLElement | null
    if (closeButton && typeof closeButton.click === 'function') {
      // 先移除旧的计时器
      const oldTimerId = parseInt((closeButton as any).dataset.timerId || '0')
      if (oldTimerId) {
        clearTimeout(oldTimerId)
      }
      
      // 设置新的计时器
      const duration = duplicate.config.duration || queueConfig.defaultDuration
      if (duration && duration > 0) {
        // 创建新的定时器，确保类型正确
        const newTimerId = window.setTimeout(() => {
          closeButton.click() // 触发关闭
        }, Number(duration))
        
        // 存储timer ID
        (closeButton as any).dataset.timerId = String(newTimerId)
      }
    }
  }
  
  return duplicate
}

// 限制消息数量
const limitMessageCount = () => {
  const maxCount = queueConfig.maxCount || 10
  if (instances.length > maxCount) {
    // 移除最早的消息，直到数量符合限制
    const removeCount = instances.length - maxCount
    const earliestInstances = [...instances]
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(0, removeCount)
    
    earliestInstances.forEach(instance => {
      removeInstance(instance.id)
      
      // 移除DOM元素
      const container = document.getElementById(instance.id)
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
    })
  }
}

// 创建消息实例
const createMessage = (config: MessageConfig) => {
  createMessageContainer()
  
  // 检查重复消息
  const duplicate = isDuplicateMessage(config)
  if (duplicate) {
    return updateDuplicateMessage(duplicate)
  }
  
  // 限制消息数量
  limitMessageCount()

  // 生成唯一ID - 添加随机数避免时间戳相同导致的ID重复
  const id = `message-${Date.now()}-${Math.floor(Math.random() * 1000)}`
  
  // 创建容器
  const container = document.createElement('div')
  container.id = id
  
  // 如果是合并消息，添加计数
  if (!config.allowDuplicate && config.count === undefined) {
    config.count = 1
  }

  // 创建消息节点
  const vnode = createVNode(MessageAlert, {
    config,
    onClose: () => removeInstance(id)
  })

  render(vnode, container)
  messageContainer?.appendChild(container)

  // 保存实例
  const instance: MessageInstance = {
    id,
    config,
    createdAt: Date.now()
  }
  instances.push(instance)

  return instance
}

// 消息服务实例
export const message: MessageService = {
  info(content: string, duration = queueConfig.defaultDuration, allowDuplicate = false) {
    // 为每个消息生成唯一key防止重复
    const key = `info-${content}-${Date.now()}`
    createMessage({
      type: 'info',
      content,
      duration,
      showIcon: true,
      closable: true,
      allowDuplicate,
      key: allowDuplicate ? key : undefined
    })
  },

  success(content: string, duration = queueConfig.defaultDuration, allowDuplicate = false) {
    // 为每个消息生成唯一key防止重复
    const key = `success-${content}-${Date.now()}`
    createMessage({
      type: 'success',
      content,
      duration,
      showIcon: true,
      closable: true,
      allowDuplicate,
      key: allowDuplicate ? key : undefined
    })
  },

  warning(content: string, duration = queueConfig.defaultDuration, allowDuplicate = false) {
    // 为每个消息生成唯一key防止重复
    const key = `warning-${content}-${Date.now()}`
    createMessage({
      type: 'warning',
      content,
      duration,
      showIcon: true,
      closable: true,
      allowDuplicate,
      key: allowDuplicate ? key : undefined
    })
  },

  error(content: string, duration = queueConfig.defaultDuration, allowDuplicate = false) {
    // 为每个消息生成唯一key防止重复
    const key = `error-${content}-${Date.now()}`
    createMessage({
      type: 'error',
      content,
      duration,
      showIcon: true,
      closable: true,
      allowDuplicate,
      key: allowDuplicate ? key : undefined
    })
  },

  show(config: MessageConfig) {
    createMessage({
      ...config,
      duration: config.duration || queueConfig.defaultDuration
    })
  },

  close(id: string) {
    removeInstance(id)
  },

  closeAll() {
    instances.forEach(instance => removeInstance(instance.id))
  },
  
  setQueueConfig(config: Partial<MessageQueueConfig>) {
    Object.assign(queueConfig, config)
  }
}

/**
 * 消息服务插件，用于在Vue 3中通过插件机制安装消息服务
 */
export const installMessageService = {
  /**
   * 安装插件方法
   * @param app Vue应用实例
   */
  install(app: App): void {
    // 将消息服务添加到全局属性中
    app.config.globalProperties.$message = message;
    
    // 提供消息服务供组件通过inject使用
    app.provide('messageService', message);
  }
};

/**
 * 获取消息服务的Hook函数
 * @returns 消息服务实例
 */
export function useMessageService(): MessageService {
  return message;
}

export default message