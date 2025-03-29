<script setup lang="ts">
import { ref, watch } from 'vue'
import type { DataSource } from '@/types/datasource'

// 定义组件属性
const props = defineProps<{
  modelValue: string
  dataSourceId?: string | null
  placeholder?: string
}>()

// 定义组件事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'execute'): void
  (e: 'save'): void
}>()

// 查询内容
const content = ref(props.modelValue)

// 示例问题列表
const exampleQuestions = [
  '显示销售额最高的前 5 个产品',
  '计算每个部门的平均工资',
  '统计过去 30 天的新用户数量',
  '哪些客户的总购买金额超过 1000 元',
  '显示各区域的销售额并按降序排列'
]

// 监听 modelValue 变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== content.value) {
    content.value = newValue
  }
})

// 监听内容变化，更新 modelValue
watch(content, (newValue) => {
  emit('update:modelValue', newValue)
})

// 处理键盘事件
const handleKeyDown = (event: KeyboardEvent) => {
  // Ctrl/Cmd + Enter 执行查询
  if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    emit('execute')
  }
  
  // Ctrl/Cmd + S 保存查询
  if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
    event.preventDefault()
    emit('save')
  }
}

// 执行查询
const execute = () => {
  emit('execute')
}

// 保存查询
const save = () => {
  emit('save')
}

// 使用示例问题
const useExampleQuestion = (example: string) => {
  content.value = example
}

// 清空问题
const clearQuestion = () => {
  content.value = ''
}
</script>

<template>
  <div class="flex flex-col h-full">
    <!-- 主要区域：查询输入和示例问题 -->
    <div class="flex-grow flex flex-col overflow-hidden">
      <!-- 查询输入区域 -->
      <div class="border rounded overflow-hidden flex-grow flex flex-col mb-4">
        <div class="p-3 bg-gray-50 border-b flex justify-between items-center">
          <div>
            <h3 class="font-medium text-gray-700">自然语言查询</h3>
            <p class="text-sm text-gray-500 mt-1">使用自然语言描述您想要查询的数据</p>
          </div>
          <div class="text-xs text-gray-500 hidden md:block">
            <span class="mr-2">Ctrl+Enter: 执行</span>
            <span>Ctrl+S: 保存</span>
          </div>
        </div>
        
        <div class="p-4 flex-grow relative">
          <textarea
            v-model="content"
            class="w-full h-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            :placeholder="placeholder || '例如：显示销售额最高的前 5 个产品'"
            :disabled="!dataSourceId"
            @keydown="handleKeyDown"
            style="min-height: 120px; resize: none;"
          ></textarea>
        </div>
        
        <!-- 底部工具栏 -->
        <div class="bg-gray-100 border-t p-2 flex justify-between">
          <div class="flex items-center">
            <span class="text-xs text-gray-500">{{ content.length }} 字符</span>
          </div>
          
          <div class="flex space-x-2">
            <button
              class="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
              @click="save"
            >
              保存
            </button>
            
            <button
              :class="[
                'px-3 py-1 rounded text-sm text-white',
                dataSourceId && content.trim() ? 
                'bg-blue-500 hover:bg-blue-600' : 
                'bg-blue-300 opacity-60 cursor-not-allowed'
              ]"
              @click="execute"
              :title="!dataSourceId ? '请选择数据源' : !content.trim() ? '请输入查询问题' : '执行查询'"
            >
              执行
            </button>
          </div>
        </div>
      </div>
      
      <!-- 示例问题区域 -->
      <div class="border rounded overflow-hidden mb-4 max-h-[30%] flex flex-col">
        <div class="p-3 bg-gray-50 border-b">
          <h3 class="font-medium text-gray-700">示例问题</h3>
        </div>
        
        <div class="p-4 overflow-y-auto">
          <ul class="space-y-2">
            <li v-for="(example, index) in exampleQuestions" :key="index" class="flex">
              <button
                class="text-left text-blue-600 hover:text-blue-800 hover:underline text-sm"
                @click="useExampleQuestion(example)"
              >
                {{ example }}
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <!-- 无数据源提示 -->
      <div v-if="!dataSourceId" class="p-4 bg-yellow-50 text-yellow-700 rounded border border-yellow-200 mb-4">
        请先选择一个数据源以使用自然语言查询功能。
      </div>
    </div>
  </div>
</template>