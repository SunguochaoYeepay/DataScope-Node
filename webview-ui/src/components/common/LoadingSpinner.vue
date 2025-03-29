<script setup lang="ts">
// 定义组件属性
const props = withDefaults(defineProps<{
  size?: 'sm' | 'md' | 'lg' | 'xl' // 尺寸
  color?: 'primary' | 'secondary' | 'white' // 颜色
  fullScreen?: boolean // 是否全屏显示
  text?: string // 加载文本
  showCancelButton?: boolean // 是否显示取消按钮
}>(), {
  size: 'md',
  color: 'primary',
  fullScreen: false,
  text: '',
  showCancelButton: false
})

// 定义事件
const emit = defineEmits<{
  (e: 'cancel'): void
}>()

// 取消加载
const onCancel = () => {
  emit('cancel')
}

// 计算尺寸类
const sizeClass = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16'
}

// 计算颜色类
const colorClass = {
  primary: 'text-blue-600',
  secondary: 'text-gray-600',
  white: 'text-white'
}
</script>

<template>
  <div 
    :class="[
      'flex items-center justify-center',
      { 'fixed inset-0 bg-gray-900 bg-opacity-50 z-[2000]': fullScreen }
    ]"
  >
    <div class="flex flex-col items-center">
      <svg
        :class="[sizeClass[size], colorClass[color], 'animate-spin']"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      <span 
        v-if="text" 
        class="mt-2 text-sm" 
        :class="colorClass[color]"
      >
        {{ text }}
      </span>
      
      <!-- 取消按钮 -->
      <button
        v-if="showCancelButton && fullScreen"
        @click="onCancel"
        class="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
      >
        <i class="fas fa-times-circle mr-1.5"></i>
        取消查询
      </button>
    </div>
  </div>
</template>