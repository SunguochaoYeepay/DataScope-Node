<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import type { MessageConfig } from '@/types/message'

// 定义组件属性
const props = withDefaults(defineProps<{
  config: MessageConfig
  onClose?: () => void
}>(), {
  onClose: () => {}
})

// 是否显示消息
const visible = ref(true)

// 定时器
let timer: number | null = null

// 图标配置
const iconConfig = {
  success: {
    class: 'text-green-400',
    path: 'M20 6L9 17l-5-5'
  },
  error: {
    class: 'text-red-400',
    path: 'M6 18L18 6M6 6l12 12'
  },
  warning: {
    class: 'text-yellow-400',
    path: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  },
  info: {
    class: 'text-blue-400',
    path: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}

// 背景颜色配置
const bgConfig = {
  success: 'bg-green-50 border-green-200',
  error: 'bg-red-50 border-red-200',
  warning: 'bg-yellow-50 border-yellow-200',
  info: 'bg-blue-50 border-blue-200'
}

// 文字颜色配置
const textConfig = {
  success: 'text-green-700',
  error: 'text-red-700',
  warning: 'text-yellow-700',
  info: 'text-blue-700'
}

// 关闭消息
const close = () => {
  visible.value = false
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  props.onClose?.()
}

// 组件挂载时设置自动关闭
onMounted(() => {
  if (props.config.duration && props.config.duration > 0) {
    timer = window.setTimeout(() => {
      close()
    }, props.config.duration)
  }
})

// 组件卸载前清除定时器
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
})
</script>

<template>
  <Transition
    enter-active-class="transform ease-out duration-300 transition"
    enter-from-class="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
    enter-to-class="translate-y-0 opacity-100 sm:translate-x-0"
    leave-active-class="transition ease-in duration-100"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      class="rounded-md p-4 shadow-sm border"
      :class="[bgConfig[config.type]]"
    >
      <div class="flex">
        <!-- 图标 -->
        <div v-if="config.showIcon" class="flex-shrink-0">
          <svg
            class="h-5 w-5"
            :class="[iconConfig[config.type].class]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              :d="iconConfig[config.type].path"
            />
          </svg>
        </div>

        <!-- 内容 -->
        <div class="ml-3 flex-1">
          <p
            class="text-sm font-medium"
            :class="[textConfig[config.type]]"
          >
            {{ config.content }}
          </p>
        </div>

        <!-- 关闭按钮 -->
        <div v-if="config.closable" class="ml-4 flex-shrink-0">
          <button
            type="button"
            class="inline-flex rounded-md focus:outline-none"
            :class="[textConfig[config.type]]"
            @click="close"
          >
            <span class="sr-only">关闭</span>
            <svg
              class="h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>