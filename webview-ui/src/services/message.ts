import { createVNode, render } from 'vue'
import type { App } from 'vue'
import type { MessageConfig, MessageInstance, MessageService } from '@/types/message'
import MessageAlert from '@/components/common/MessageAlert.vue'

// 消息容器
let messageContainer: HTMLDivElement | null = null

// 消息实例列表
const instances: MessageInstance[] = []

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

// 创建消息实例
const createMessage = (config: MessageConfig) => {
  createMessageContainer()

  // 生成唯一ID
  const id = `message-${Date.now()}`

  // 创建消息节点
  const container = document.createElement('div')
  const vnode = createVNode(MessageAlert, {
    config,
    onClose: () => removeInstance(id)
  })

  render(vnode, container)
  messageContainer?.appendChild(container)

  // 保存实例
  const instance: MessageInstance = {
    id,
    config
  }
  instances.push(instance)

  return instance
}

// 消息服务实例
export const message: MessageService = {
  info(content: string, duration = 3000) {
    createMessage({
      type: 'info',
      content,
      duration,
      showIcon: true,
      closable: true
    })
  },

  success(content: string, duration = 3000) {
    createMessage({
      type: 'success',
      content,
      duration,
      showIcon: true,
      closable: true
    })
  },

  warning(content: string, duration = 3000) {
    createMessage({
      type: 'warning',
      content,
      duration,
      showIcon: true,
      closable: true
    })
  },

  error(content: string, duration = 3000) {
    createMessage({
      type: 'error',
      content,
      duration,
      showIcon: true,
      closable: true
    })
  },

  show(config: MessageConfig) {
    createMessage(config)
  },

  close(id: string) {
    removeInstance(id)
  },

  closeAll() {
    instances.forEach(instance => removeInstance(instance.id))
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