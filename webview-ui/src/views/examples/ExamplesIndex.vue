<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

// 获取路由实例
const router = useRouter()

// 示例列表
const examples = ref([
  {
    name: '数据表格组件',
    path: '/examples/table',
    description: '用于展示表格数据，支持排序、筛选和分页'
  },
  {
    name: '表单组件',
    path: '/examples/form',
    description: '用于创建表单，支持各种表单项和验证'
  },
  {
    name: '消息提示组件',
    path: '/examples/message',
    description: '用于显示操作反馈信息，支持不同类型的消息提示'
  },
  {
    name: '加载动画组件',
    path: '/examples/loading',
    description: '用于显示加载状态，支持不同尺寸和全屏显示'
  },
  {
    name: '确认对话框组件',
    path: '/examples/modal',
    description: '用于显示确认对话框，支持不同类型和自定义配置'
  },
  {
    name: '消息服务演示',
    path: '/examples/message-demo',
    description: '消息服务的去重、合并和队列管理功能演示',
    highlight: true
  }
])

// 导航到示例页面
const navigateToExample = (path: string) => {
  router.push(path)
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">组件示例</h1>
    
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="example in examples" 
        :key="example.path"
        class="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
        :class="{'border-blue-300 ring-1 ring-blue-300': example.highlight}"
      >
        <div class="p-4 bg-gray-50 border-b" :class="{'bg-blue-50': example.highlight}">
          <h2 class="text-lg font-semibold">{{ example.name }}</h2>
          <span v-if="example.highlight" class="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded mt-1">新增</span>
        </div>
        
        <div class="p-4">
          <p class="text-gray-600 mb-4">{{ example.description }}</p>
          
          <button
            class="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
            :class="{'bg-blue-600 hover:bg-blue-700': example.highlight}"
            @click="navigateToExample(example.path)"
          >
            查看示例
          </button>
        </div>
      </div>
    </div>
  </div>
</template>