import { createVNode, render } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// 定义加载服务类型
interface LoadingService {
  show(text?: string, options?: { showCancelButton?: boolean, onCancel?: () => void }): void
  hide(): void
}

// 加载容器和虚拟节点
let loadingContainer: HTMLDivElement | null = null
let loadingVNode: any = null
let loadingInstance: any = null

// 创建加载容器
const createLoadingContainer = () => {
  if (loadingContainer) return

  loadingContainer = document.createElement('div')
  document.body.appendChild(loadingContainer)
}

// 创建加载实例
const createLoading = (text?: string, options?: { showCancelButton?: boolean, onCancel?: () => void }) => {
  createLoadingContainer()

  // 移除现有实例
  if (loadingInstance) {
    hide()
  }

  // 准备事件处理
  const handleCancel = () => {
    if (options?.onCancel) {
      options.onCancel()
    }
    hide()
  }

  // 创建虚拟节点
  loadingVNode = createVNode(LoadingSpinner, {
    fullScreen: true,
    size: 'lg',
    color: 'white',
    text: text || '加载中...',
    showCancelButton: options?.showCancelButton || false,
    onCancel: handleCancel
  })

  render(loadingVNode, loadingContainer!)
  loadingInstance = loadingVNode.component
}

// 显示加载
const show = (text?: string, options?: { showCancelButton?: boolean, onCancel?: () => void }) => {
  createLoading(text, options)
}

// 隐藏加载
const hide = () => {
  if (loadingContainer) {
    render(null, loadingContainer)
    loadingInstance = null
  }
}

// 导出加载服务
export const loading: LoadingService = {
  show,
  hide
}

export default loading