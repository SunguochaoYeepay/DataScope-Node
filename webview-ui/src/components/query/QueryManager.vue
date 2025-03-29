<template>
  <div>
    <!-- 简化的查询管理界面 -->
    <div class="bg-white p-4 border border-gray-300 rounded-lg mb-4">
      <!-- 管理界面标题和操作按钮 -->
      <div class="flex items-center justify-between mb-3">
        <h3 class="text-lg font-medium text-gray-900">临时查询</h3>
        <div class="flex space-x-2">
          <button
            @click="saveCurrentQuery"
            class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="!canSave"
          >
            <i class="fas fa-save mr-2"></i> 暂存查询
          </button>
        </div>
      </div>

      <!-- 最近查询快捷访问 -->
      <div v-if="queryHistory.length > 0" class="flex items-center space-x-1 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <span class="text-xs text-gray-500 whitespace-nowrap mr-2">最近查询:</span>
        <button 
          v-for="(item, index) in queryHistory.slice(0, 5)" 
          :key="`history-${index}`"
          @click="loadQuery(item)"
          class="px-2 py-1 text-xs rounded border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 whitespace-nowrap overflow-hidden text-ellipsis max-w-[160px]"
          :title="item.sql"
        >
          {{ shortenSql(item.sql) }}
        </button>
        <button 
          v-if="queryHistory.length > 0"
          @click="clearHistory" 
          class="ml-2 px-2 py-1 text-xs rounded border border-gray-200 bg-white hover:bg-gray-100 text-gray-700">
          <i class="fas fa-trash-alt"></i> 清空
        </button>
      </div>
      <div v-else class="text-sm text-gray-500">
        暂无查询记录
      </div>
    </div>

    <!-- 简化的保存查询弹窗 -->
    <div v-if="showSaveDialog" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">暂存查询</h3>
        </div>
        
        <div class="p-6">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">备注名称 (可选)</label>
            <input
              v-model="queryName"
              type="text"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="输入备注名称..."
            />
          </div>
        </div>
        
        <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            @click="closeSaveDialog"
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            取消
          </button>
          <button
            @click="confirmSave"
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            暂存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { QueryBuilderState } from '@/types/builder'

// 属性定义
const props = defineProps<{
  currentQuery?: string  // 当前查询的SQL
  canSave: boolean       // 是否可以保存当前查询
  queryState?: QueryBuilderState // 查询构建器状态
}>()

// 事件
const emit = defineEmits<{
  (e: 'load', query: { sql: string, state?: QueryBuilderState }): void
}>()

// 状态
const showSaveDialog = ref(false)
const queryName = ref('')

// 本地存储的查询历史
const queryHistory = ref<Array<{
  sql: string
  name?: string
  timestamp: number
  state?: QueryBuilderState
}>>([])

// 初始化
onMounted(() => {
  loadQueriesFromLocalStorage()
})

// 从本地存储加载查询
const loadQueriesFromLocalStorage = () => {
  try {
    // 加载查询历史
    const historyStr = localStorage.getItem('queryHistory')
    if (historyStr) {
      queryHistory.value = JSON.parse(historyStr)
    }
  } catch (error) {
    console.error('加载查询失败', error)
  }
}

// 保存查询到本地存储
const saveQueriesToLocalStorage = () => {
  try {
    localStorage.setItem('queryHistory', JSON.stringify(queryHistory.value))
  } catch (error) {
    console.error('保存查询失败', error)
  }
}

// 方法
// 格式化时间
const formatTime = (timestamp: number): string => {
  const date = new Date(timestamp)
  return date.toLocaleString()
}

// 缩短SQL显示
const shortenSql = (sql: string, length = 15): string => {
  sql = sql.trim()
  if (sql.length <= length) return sql
  return sql.substring(0, length) + '...'
}

// 保存当前查询
const saveCurrentQuery = () => {
  if (!props.currentQuery) return
  
  // 打开保存对话框
  queryName.value = ''
  showSaveDialog.value = true
}

// 确认保存
const confirmSave = () => {
  if (!props.currentQuery) {
    return
  }
  
  // 添加到历史记录
  addToHistory(props.currentQuery, queryName.value, props.queryState)
  
  // 关闭对话框
  closeSaveDialog()
}

// 关闭保存对话框
const closeSaveDialog = () => {
  showSaveDialog.value = false
  queryName.value = ''
}

// 加载查询
const loadQuery = (item: any) => {
  emit('load', { 
    sql: item.sql,
    state: item.state
  })
}

// 添加到历史记录
const addToHistory = (sql: string, name?: string, state?: QueryBuilderState) => {
  // 添加到历史记录
  const historyItem = {
    sql,
    name: name || undefined,
    timestamp: Date.now(),
    state
  }
  
  // 检查是否已存在相同的SQL
  const existingIndex = queryHistory.value.findIndex(item => item.sql === sql)
  if (existingIndex >= 0) {
    // 如果存在，则更新时间戳和名称
    queryHistory.value.splice(existingIndex, 1)
  }
  
  // 添加到历史记录的开头
  queryHistory.value.unshift(historyItem)
  
  // 限制历史记录数量为10条
  if (queryHistory.value.length > 10) {
    queryHistory.value = queryHistory.value.slice(0, 10)
  }
  
  // 保存到本地存储
  saveQueriesToLocalStorage()
}

// 清空历史记录
const clearHistory = () => {
  if (confirm('确定要清空所有查询历史吗？')) {
    queryHistory.value = []
    saveQueriesToLocalStorage()
  }
}

// 向外暴露方法
defineExpose({
  addToHistory
})
</script>