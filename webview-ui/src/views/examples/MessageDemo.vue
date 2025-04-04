<script setup lang="ts">
import { ref } from 'vue'
import { message } from '@/services/message'
import { responseHandler } from '@/utils/api'

// 模拟API响应数据
const successResponse = {
  success: true,
  data: { id: 1, name: 'Test' },
  error: {
    statusCode: 200,
    code: 'OK',
    message: '操作成功'
  }
}

const errorResponse = {
  success: false,
  data: null,
  error: {
    statusCode: 400,
    code: 'BAD_REQUEST',
    message: '请求参数错误'
  }
}

// 发送消息
const sendMessage = (type: 'info' | 'success' | 'warning' | 'error', allowDuplicate = true) => {
  const content = `这是一条${type}消息 - ${new Date().toLocaleTimeString()}`
  message[type](content, undefined, allowDuplicate)
}

// 发送重复消息
const sendDuplicateMessage = (type: 'info' | 'success' | 'warning' | 'error') => {
  const content = `重复的${type}消息`
  // 快速发送3条相同消息
  message[type](content, undefined, false)
  setTimeout(() => message[type](content, undefined, false), 100)
  setTimeout(() => message[type](content, undefined, false), 200)
}

// 使用API响应处理器
const handleSuccessResponse = () => {
  responseHandler.all(successResponse)
}

const handleErrorResponse = () => {
  try {
    responseHandler.errorOnly(errorResponse)
  } catch (error) {
    console.log('错误已处理')
  }
}

const handleMultipleResponses = () => {
  try {
    responseHandler.unique(successResponse)
    responseHandler.unique(successResponse)
    responseHandler.unique(errorResponse)
    responseHandler.unique(errorResponse)
  } catch (error) {
    console.log('错误已处理')
  }
}

// 批量发送大量消息
const sendManyMessages = () => {
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const type = ['info', 'success', 'warning', 'error'][i % 4] as 'info' | 'success' | 'warning' | 'error'
      message[type](`消息 #${i+1}`, undefined, true)
    }, i * 100)
  }
}

// 更新队列配置
const updateQueueConfig = () => {
  message.setQueueConfig({
    maxCount: 5,
    deduplicationTimeWindow: 5000,
    defaultDuration: 3000
  })
  message.info('队列配置已更新：最多显示5条消息，5秒内去重', undefined, true)
}
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">消息组件示例</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">基本消息类型</h2>
        <div class="flex flex-wrap gap-2">
          <button
            @click="sendMessage('info')"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            信息
          </button>
          <button
            @click="sendMessage('success')"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            成功
          </button>
          <button
            @click="sendMessage('warning')"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            警告
          </button>
          <button
            @click="sendMessage('error')"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            错误
          </button>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">消息去重</h2>
        <div class="flex flex-wrap gap-2">
          <button
            @click="sendDuplicateMessage('info')"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            信息(去重)
          </button>
          <button
            @click="sendDuplicateMessage('success')"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            成功(去重)
          </button>
          <button
            @click="sendDuplicateMessage('warning')"
            class="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            警告(去重)
          </button>
          <button
            @click="sendDuplicateMessage('error')"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            错误(去重)
          </button>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">API响应处理</h2>
        <div class="flex flex-wrap gap-2">
          <button
            @click="handleSuccessResponse"
            class="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            模拟成功响应
          </button>
          <button
            @click="handleErrorResponse"
            class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            模拟错误响应
          </button>
          <button
            @click="handleMultipleResponses"
            class="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            模拟多次响应(去重)
          </button>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded shadow">
        <h2 class="text-xl font-semibold mb-4">高级功能</h2>
        <div class="flex flex-wrap gap-2">
          <button
            @click="sendManyMessages"
            class="px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600"
          >
            发送大量消息
          </button>
          <button
            @click="message.closeAll()"
            class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            关闭所有消息
          </button>
          <button
            @click="updateQueueConfig"
            class="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600"
          >
            更新队列配置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>