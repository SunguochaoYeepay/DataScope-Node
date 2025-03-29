// 确认对话框配置
export interface ConfirmModalConfig {
  title: string                // 标题
  content: string              // 内容
  okText?: string              // 确认按钮文本
  cancelText?: string          // 取消按钮文本
  type?: 'info' | 'success' | 'warning' | 'error' | 'confirm'  // 类型
  closable?: boolean           // 是否可关闭
  maskClosable?: boolean       // 点击遮罩是否可关闭
  okButtonType?: 'primary' | 'danger' | 'warning' | 'default'  // 确认按钮类型
  cancelButtonType?: 'primary' | 'danger' | 'warning' | 'default'  // 取消按钮类型
  showCancel?: boolean         // 是否显示取消按钮
  width?: string | number      // 宽度
  centered?: boolean           // 是否居中
  icon?: string                // 图标
  onOk?: () => void | Promise<void>  // 确认回调
  onCancel?: () => void        // 取消回调
}

// 确认对话框服务
export interface ConfirmModalService {
  info(config: ConfirmModalConfig): void
  success(config: ConfirmModalConfig): void
  warning(config: ConfirmModalConfig): void
  error(config: ConfirmModalConfig): void
  confirm(config: ConfirmModalConfig): void
}

// 通用对话框配置
export interface ModalConfig {
  title: string                // 标题
  content?: string             // 内容
  footer?: boolean             // 是否显示底部
  closable?: boolean           // 是否可关闭
  maskClosable?: boolean       // 点击遮罩是否可关闭
  centered?: boolean           // 是否居中
  width?: string | number      // 宽度
  destroyOnClose?: boolean     // 关闭时是否销毁子元素
  zIndex?: number              // z-index
  okText?: string              // 确认按钮文本
  cancelText?: string          // 取消按钮文本
  okButtonType?: 'primary' | 'danger' | 'warning' | 'default'  // 确认按钮类型
  cancelButtonType?: 'primary' | 'danger' | 'warning' | 'default'  // 取消按钮类型
  showCancel?: boolean         // 是否显示取消按钮
  onOk?: () => void | Promise<void>  // 确认回调
  onCancel?: () => void        // 取消回调
}

// 对话框实例
export interface ModalInstance {
  id: string                   // 唯一标识
  visible: boolean             // 是否可见
  config: ModalConfig          // 配置
  show: () => void             // 显示
  hide: () => void             // 隐藏
  destroy: () => void          // 销毁
  update: (config: Partial<ModalConfig>) => void  // 更新配置
}

// 对话框服务
export interface ModalService {
  create(config: ModalConfig): ModalInstance
  show(id: string): void
  hide(id: string): void
  destroyAll(): void
  confirm(config: ConfirmModalConfig): void
  info(config: ConfirmModalConfig): void
  success(config: ConfirmModalConfig): void
  warning(config: ConfirmModalConfig): void
  error(config: ConfirmModalConfig): void
}