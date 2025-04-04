<script setup lang="ts">
import { ref, watch } from 'vue'
import type { ConfirmModalConfig } from '@/types/modal'

// 定义组件属性
const props = withDefaults(defineProps<{
  open: boolean
  config: ConfirmModalConfig
}>(), {
  open: false
})

// 定义组件事件
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'ok'): void
  (e: 'cancel'): void
}>()

// 显示状态
const localVisible = ref(props.open)

// 监听open属性变化
watch(() => props.open, (newVal) => {
  localVisible.value = newVal
})

// 监听内部状态变化，同步到父组件
watch(localVisible, (newVal) => {
  emit('update:open', newVal)
})

// 图标配置
const iconConfig = {
  info: {
    class: 'text-blue-500',
    path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  success: {
    class: 'text-green-500',
    path: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  warning: {
    class: 'text-yellow-500',
    path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  },
  error: {
    class: 'text-red-500',
    path: 'M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  },
  confirm: {
    class: 'text-blue-500',
    path: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

// 按钮类型映射
const buttonTypeMap = {
  primary: 'bg-blue-500 hover:bg-blue-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  warning: 'bg-yellow-500 hover:bg-yellow-600 text-white',
  default: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
}

// 处理确认
const handleOk = async () => {
  if (props.config.onOk) {
    try {
      await props.config.onOk()
    } catch (error) {
      console.error('Error in onOk callback:', error)
    }
  }
  
  emit('ok')
  closeModal()
}

// 处理取消
const handleCancel = () => {
  if (props.config.onCancel) {
    props.config.onCancel()
  }
  
  emit('cancel')
  closeModal()
}

// 关闭对话框
const closeModal = () => {
  localVisible.value = false
}

// 点击遮罩
const handleMaskClick = () => {
  if (props.config.maskClosable !== false) {
    handleCancel()
  }
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="localVisible"
        class="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        :class="[config.centered ? 'items-center' : 'items-start pt-16']"
      >
        <!-- 背景遮罩 -->
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          @click="handleMaskClick"
        ></div>
        
        <!-- 对话框内容 -->
        <Transition
          enter-active-class="ease-out duration-300"
          enter-from-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          enter-to-class="opacity-100 translate-y-0 sm:scale-100"
          leave-active-class="ease-in duration-200"
          leave-from-class="opacity-100 translate-y-0 sm:scale-100"
          leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        >
          <div 
            class="relative bg-white rounded-lg overflow-hidden shadow-xl transform transition-all w-full sm:max-w-lg"
            :style="{ width: config.width ? `${config.width}px` : 'auto' }"
          >
            <!-- 标题和关闭按钮 -->
            <div class="px-4 py-3 border-b flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">{{ config.title }}</h3>
              
              <button 
                v-if="config.closable !== false" 
                type="button" 
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
                @click="handleCancel"
              >
                <span class="sr-only">关闭</span>
                <svg 
                  class="h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <!-- 内容 -->
            <div class="px-4 py-4">
              <div class="flex items-start">
                <!-- 图标 -->
                <div v-if="config.type" class="flex-shrink-0 mr-3">
                  <svg 
                    class="h-6 w-6"
                    :class="iconConfig[config.type].class"
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      :d="iconConfig[config.type].path" 
                    />
                  </svg>
                </div>
                
                <!-- 文本内容 -->
                <div class="mt-0.5 text-gray-600">
                  {{ config.content }}
                </div>
              </div>
            </div>
            
            <!-- 按钮 -->
            <div class="px-4 py-3 bg-gray-50 sm:px-6 flex justify-end space-x-2">
              <button
                v-if="config.showCancel !== false"
                type="button"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none"
                :class="buttonTypeMap[config.cancelButtonType || 'default']"
                @click="handleCancel"
              >
                {{ config.cancelText || '取消' }}
              </button>
              
              <button
                type="button"
                class="px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none"
                :class="buttonTypeMap[config.okButtonType || 'primary']"
                @click="handleOk"
              >
                {{ config.okText || '确定' }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>