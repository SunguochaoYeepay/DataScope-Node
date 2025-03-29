<script setup lang="ts">
import { message } from '@/services/message'

// 显示不同类型的消息
const showInfo = () => {
  message.info('这是一条信息提示')
}

const showSuccess = () => {
  message.success('操作成功！')
}

const showWarning = () => {
  message.warning('请注意这个警告信息')
}

const showError = () => {
  message.error('出错了！请重试')
}

// 显示自定义配置的消息
const showCustom = () => {
  message.show({
    type: 'info',
    content: '这是一条不会自动关闭的消息',
    duration: 0,
    showIcon: true,
    closable: true
  })
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">消息提示示例</h1>
    
    <div class="space-y-4">
      <div class="space-x-4">
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="showInfo"
        >
          显示信息
        </button>
        
        <button
          class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          @click="showSuccess"
        >
          显示成功
        </button>
        
        <button
          class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          @click="showWarning"
        >
          显示警告
        </button>
        
        <button
          class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          @click="showError"
        >
          显示错误
        </button>
      </div>

      <div>
        <button
          class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          @click="showCustom"
        >
          显示自定义消息
        </button>
      </div>
    </div>
  </div>
</template>