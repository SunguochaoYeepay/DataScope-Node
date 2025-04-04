import { createVNode, render, ref } from 'vue'
import type { ConfirmModalConfig, ConfirmModalService } from '@/types/modal'
import ConfirmModal from '@/components/common/ConfirmModal.vue'

// 当前激活的确认框
let currentConfirmInstance: any = null

// 创建确认框方法
const createConfirm = (config: ConfirmModalConfig, type: string) => {
  // 如果已经有实例，先移除
  if (currentConfirmInstance) {
    removeConfirm()
  }
  
  // 创建容器
  const container = document.createElement('div')
  
  // 创建可响应的visible状态
  const visible = ref(true)
  
  // 配置类型
  const modalConfig = {
    ...config,
    type: type as any
  }
  
  // 创建组件
  const vnode = createVNode(ConfirmModal, {
    open: visible.value,
    'onUpdate:open': (value: boolean) => {
      visible.value = value
      if (!value) {
        setTimeout(() => {
          removeConfirm()
        }, 300)
      }
    },
    config: modalConfig,
    onOk: () => {
      if (config.onOk) {
        config.onOk()
      }
    },
    onCancel: () => {
      if (config.onCancel) {
        config.onCancel()
      }
    }
  })
  
  // 渲染组件
  render(vnode, container)
  document.body.appendChild(container)
  
  // 保存实例
  currentConfirmInstance = {
    container,
    vnode
  }
}

// 移除确认框
const removeConfirm = () => {
  if (currentConfirmInstance) {
    render(null, currentConfirmInstance.container)
    document.body.removeChild(currentConfirmInstance.container)
    currentConfirmInstance = null
  }
}

// 导出确认对话框服务
export const confirmModal: ConfirmModalService = {
  info(config: ConfirmModalConfig) {
    createConfirm(config, 'info')
  },
  
  success(config: ConfirmModalConfig) {
    createConfirm(config, 'success')
  },
  
  warning(config: ConfirmModalConfig) {
    createConfirm(config, 'warning')
  },
  
  error(config: ConfirmModalConfig) {
    createConfirm(config, 'error')
  },
  
  confirm(config: ConfirmModalConfig) {
    createConfirm(config, 'confirm')
  }
}

export default confirmModal