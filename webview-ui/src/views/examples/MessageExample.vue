<script setup lang="ts">
import { message } from '@/services/message'
import { useResponseHandler } from '@/utils/api'

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

// API响应处理示例
const { handleResponse, handle } = useResponseHandler()

// 模拟API响应
const mockSuccessResponse = {
  success: true,
  data: { id: 1, name: '测试数据' }
}

const mockErrorResponse = {
  success: false,
  error: {
    statusCode: 400,
    code: 'BAD_REQUEST',
    message: '输入参数不正确',
    details: '用户名不能为空'
  }
}

const handleSuccessResponse = () => {
  try {
    const data = handleResponse(mockSuccessResponse, {
      showSuccessMessage: true,
      successMessage: '获取数据成功'
    })
    console.log('处理的数据:', data)
  } catch (error) {
    console.error('不应该到达这里:', error)
  }
}

const handleErrorResponse = () => {
  try {
    handleResponse(mockErrorResponse, {
      errorMessage: '获取数据失败'
    })
  } catch (error) {
    console.log('预期的错误:', error)
  }
}

const handleCustomResponse = () => {
  // 模拟非标准响应
  const nonStandardResponse = {
    code: 200,
    result: { items: [1, 2, 3] }
  }
  
  try {
    const data = handleResponse(nonStandardResponse, {
      showSuccessMessage: true,
      successMessage: '处理自定义响应成功'
    })
    console.log('自定义响应数据:', data)
  } catch (error) {
    console.error('不应该到达这里:', error)
  }
}

// 响应处理器预设
const useSilentHandler = () => {
  try {
    // 成功处理 - 不显示任何消息
    const data = handle.silent(mockSuccessResponse)
    console.log('静默成功处理:', data)
    
    // 错误处理 - 不显示任何消息
    handle.silent(mockErrorResponse)
  } catch (error) {
    console.log('静默错误处理:', error)
  }
}

const useErrorOnlyHandler = () => {
  try {
    // 成功处理 - 不显示消息
    const data = handle.errorOnly(mockSuccessResponse)
    console.log('仅错误处理-成功:', data)
    
    // 错误处理 - 显示错误消息
    handle.errorOnly(mockErrorResponse)
  } catch (error) {
    console.log('仅错误处理-错误:', error)
  }
}

const useAllHandler = () => {
  try {
    // 成功处理 - 显示成功消息
    const data = handle.all(mockSuccessResponse, {
      successMessage: '预设处理成功'
    })
    console.log('全部处理-成功:', data)
    
    // 错误处理 - 显示错误消息
    handle.all(mockErrorResponse, {
      errorMessage: '预设处理失败'
    })
  } catch (error) {
    console.log('全部处理-错误:', error)
  }
}
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <h1 class="text-2xl font-bold mb-4">消息提示示例</h1>
    
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">基础消息</h2>
      <div class="flex flex-wrap gap-4">
        <button class="btn-primary" @click="showInfo">信息</button>
        <button class="btn-success" @click="showSuccess">成功</button>
        <button class="btn-warning" @click="showWarning">警告</button>
        <button class="btn-danger" @click="showError">错误</button>
        <button class="btn-primary" @click="showCustom">自定义</button>
      </div>
    </section>
    
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">API响应处理示例</h2>
      <div class="flex flex-wrap gap-4">
        <button class="btn-success" @click="handleSuccessResponse">成功响应</button>
        <button class="btn-danger" @click="handleErrorResponse">错误响应</button>
        <button class="btn-warning" @click="handleCustomResponse">自定义响应</button>
      </div>
    </section>
    
    <section class="mb-8">
      <h2 class="text-xl font-semibold mb-4">响应处理器预设</h2>
      <div class="flex flex-wrap gap-4">
        <button class="btn-primary" @click="useSilentHandler">静默处理</button>
        <button class="btn-primary" @click="useErrorOnlyHandler">仅错误处理</button>
        <button class="btn-primary" @click="useAllHandler">全部处理</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.btn-primary {
  @apply px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition;
}
.btn-success {
  @apply px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition;
}
.btn-warning {
  @apply px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition;
}
.btn-danger {
  @apply px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition;
}
</style>