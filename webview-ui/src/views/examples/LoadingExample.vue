<script setup lang="ts">
import { ref } from 'vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import { loading } from '@/services/loading'
import { message } from '@/services/message'

// 控制内联加载组件是否显示
const isLoading = ref(false)

// 模拟异步加载
const simulateLoading = () => {
  isLoading.value = true
  
  setTimeout(() => {
    isLoading.value = false
    message.success('加载完成！')
  }, 2000)
}

// 模拟全屏加载
const simulateFullScreenLoading = (text = '数据加载中...') => {
  loading.show(text)
  
  setTimeout(() => {
    loading.hide()
    message.success('全屏加载完成！')
  }, 2000)
}

// 模拟网络请求
const simulateRequest = async () => {
  loading.show('处理请求中...')
  
  try {
    // 模拟网络请求
    await new Promise(resolve => setTimeout(resolve, 3000))
    message.success('请求成功！')
  } catch (error) {
    message.error('请求失败！')
  } finally {
    loading.hide()
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">加载动画示例</h1>
    
    <div class="space-y-8">
      <!-- 内联加载组件 -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">内联加载组件</h2>
        
        <div class="flex flex-wrap gap-6">
          <div class="p-4 border rounded-md flex flex-col items-center">
            <LoadingSpinner size="sm" />
            <span class="mt-2 text-sm">小尺寸</span>
          </div>
          
          <div class="p-4 border rounded-md flex flex-col items-center">
            <LoadingSpinner size="md" />
            <span class="mt-2 text-sm">中尺寸</span>
          </div>
          
          <div class="p-4 border rounded-md flex flex-col items-center">
            <LoadingSpinner size="lg" />
            <span class="mt-2 text-sm">大尺寸</span>
          </div>
          
          <div class="p-4 border rounded-md flex flex-col items-center">
            <LoadingSpinner size="xl" />
            <span class="mt-2 text-sm">超大尺寸</span>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-6">
          <div class="p-4 border rounded-md flex flex-col items-center">
            <LoadingSpinner color="primary" />
            <span class="mt-2 text-sm">主要颜色</span>
          </div>
          
          <div class="p-4 border rounded-md flex flex-col items-center">
            <LoadingSpinner color="secondary" />
            <span class="mt-2 text-sm">次要颜色</span>
          </div>
          
          <div class="p-4 border rounded-md bg-gray-800 flex flex-col items-center">
            <LoadingSpinner color="white" />
            <span class="mt-2 text-sm text-white">白色</span>
          </div>
        </div>
      </div>
      
      <!-- 加载组件示例 -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">组件加载示例</h2>
        
        <div class="p-4 border rounded-md h-60">
          <div v-if="isLoading" class="w-full h-full flex items-center justify-center">
            <LoadingSpinner size="lg" text="加载中..." />
          </div>
          <div v-else class="w-full h-full flex items-center justify-center">
            <p class="text-lg text-gray-500">内容已加载</p>
          </div>
        </div>
        
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="simulateLoading"
        >
          模拟加载
        </button>
      </div>
      
      <!-- 全屏加载示例 -->
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">全屏加载示例</h2>
        
        <div class="space-x-4">
          <button
            class="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            @click="simulateFullScreenLoading()"
          >
            显示全屏加载
          </button>
          
          <button
            class="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            @click="simulateFullScreenLoading('导入数据中，请稍候...')"
          >
            自定义加载文本
          </button>
          
          <button
            class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            @click="simulateRequest"
          >
            模拟网络请求
          </button>
        </div>
      </div>
    </div>
  </div>
</template>