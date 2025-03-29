<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import type { Query } from '@/types/query'
import { confirmModal } from '@/services/modal'
import { useQueryStore } from '@/stores/query'

// 加载查询存储
const queryStore = useQueryStore()

// 定义组件事件
const emit = defineEmits<{
  (e: 'select', query: Query): void
  (e: 'refresh'): void
}>()

// 搜索关键字
const searchKeyword = ref('')

// 查询类型筛选
const queryTypeFilter = ref('')

// 查询状态筛选
const statusFilter = ref('')

// 时间范围筛选
const dateRange = ref({
  start: '',
  end: ''
})

// 加载更多
const loadMore = async () => {
  await queryStore.fetchQueryHistory({
    page: queryStore.pagination.page + 1,
    size: queryStore.pagination.size,
    queryType: queryTypeFilter.value ? (queryTypeFilter.value as any) : undefined,
    status: statusFilter.value ? (statusFilter.value as any) : undefined,
    startDate: dateRange.value.start,
    endDate: dateRange.value.end
  })
}

// 筛选查询历史
const filteredHistory = computed(() => {
  if (!searchKeyword.value) return queryStore.queryHistory
  
  const keyword = searchKeyword.value.toLowerCase()
  return queryStore.queryHistory.filter(query => 
    (query.name || '').toLowerCase().includes(keyword) || 
    query.queryText.toLowerCase().includes(keyword)
  )
})

// 重新加载
const refresh = async () => {
  await queryStore.fetchQueryHistory({
    queryType: queryTypeFilter.value ? (queryTypeFilter.value as any) : undefined,
    status: statusFilter.value ? (statusFilter.value as any) : undefined,
    startDate: dateRange.value.start,
    endDate: dateRange.value.end
  })
  
  emit('refresh')
}

// 应用筛选
const applyFilters = async () => {
  await queryStore.fetchQueryHistory({
    queryType: queryTypeFilter.value ? (queryTypeFilter.value as any) : undefined,
    status: statusFilter.value ? (statusFilter.value as any) : undefined,
    startDate: dateRange.value.start,
    endDate: dateRange.value.end
  })
}

// 清除筛选
const clearFilters = () => {
  queryTypeFilter.value = ''
  statusFilter.value = ''
  dateRange.value = { start: '', end: '' }
  searchKeyword.value = ''
  
  refresh()
}

// 选择查询
const selectQuery = (query: Query) => {
  emit('select', query)
}

// 收藏/取消收藏查询
const toggleFavorite = async (query: Query, event: Event) => {
  event.stopPropagation()
  
  if (query.isFavorite) {
    await queryStore.unfavoriteQuery(query.id)
  } else {
    await queryStore.favoriteQuery(query.id)
  }
}

// 删除查询
const deleteQuery = async (query: Query, event: Event) => {
  event.stopPropagation()
  
  confirmModal.confirm({
    title: '删除查询',
    content: '确定要删除这个查询吗？此操作不可恢复。',
    okButtonType: 'danger',
    okText: '删除',
    onOk: async () => {
      await queryStore.deleteQuery(query.id)
      refresh()
    }
  })
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleString()
}

// 获取查询类型显示名称
const getQueryTypeDisplay = (type: string) => {
  switch (type) {
    case 'SQL':
      return 'SQL'
    case 'NATURAL_LANGUAGE':
      return '自然语言'
    default:
      return type
  }
}

// 获取查询状态样式类
const getStatusClass = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'RUNNING':
      return 'bg-blue-100 text-blue-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// 获取查询状态显示名称
const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'COMPLETED':
      return '完成'
    case 'RUNNING':
      return '运行中'
    case 'FAILED':
      return '失败'
    case 'CANCELLED':
      return '已取消'
    default:
      return status
  }
}

// 组件挂载时加载查询历史
onMounted(async () => {
  await queryStore.fetchQueryHistory()
  await queryStore.getFavorites()
})
</script>

<template>
  <div class="space-y-4">
    <!-- 筛选面板 -->
    <div class="bg-gray-50 p-4 rounded border">
      <h3 class="font-medium text-gray-700 mb-3">筛选条件</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
        <div class="space-y-1">
          <label class="block text-xs text-gray-600">关键字</label>
          <input
            v-model="searchKeyword"
            type="text"
            class="w-full px-2 py-1 border rounded text-sm"
            placeholder="搜索查询名称或内容"
          />
        </div>
        
        <div class="space-y-1">
          <label class="block text-xs text-gray-600">查询类型</label>
          <select
            v-model="queryTypeFilter"
            class="w-full px-2 py-1 border rounded text-sm"
          >
            <option value="">全部</option>
            <option value="SQL">SQL</option>
            <option value="NATURAL_LANGUAGE">自然语言</option>
          </select>
        </div>
        
        <div class="space-y-1">
          <label class="block text-xs text-gray-600">开始日期</label>
          <input
            v-model="dateRange.start"
            type="date"
            class="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
        
        <div class="space-y-1">
          <label class="block text-xs text-gray-600">结束日期</label>
          <input
            v-model="dateRange.end"
            type="date"
            class="w-full px-2 py-1 border rounded text-sm"
          />
        </div>
        
        <div class="space-y-1">
          <label class="block text-xs text-gray-600">状态</label>
          <select
            v-model="statusFilter"
            class="w-full px-2 py-1 border rounded text-sm"
          >
            <option value="">全部</option>
            <option value="COMPLETED">完成</option>
            <option value="RUNNING">运行中</option>
            <option value="FAILED">失败</option>
            <option value="CANCELLED">已取消</option>
          </select>
        </div>
        
        <div class="flex items-end space-x-2">
          <button
            class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
            @click="applyFilters"
          >
            应用筛选
          </button>
          
          <button
            class="px-3 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            @click="clearFilters"
          >
            清除
          </button>
        </div>
      </div>
    </div>
    
    <!-- 查询历史列表 -->
    <div class="space-y-2">
      <div class="flex justify-between items-center">
        <h3 class="font-medium text-gray-700">查询历史</h3>
        
        <button
          class="px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
          @click="refresh"
        >
          刷新
        </button>
      </div>
      
      <!-- 查询列表 -->
      <div v-if="filteredHistory.length > 0" class="space-y-2">
        <div
          v-for="query in filteredHistory"
          :key="query.id"
          class="border rounded p-3 hover:bg-gray-50 cursor-pointer"
          @click="selectQuery(query)"
        >
          <div class="flex justify-between">
            <div class="flex items-center space-x-2">
              <h4 class="font-medium">
                {{ query.name || '未命名查询' }}
              </h4>
              
              <span
                class="px-2 py-0.5 rounded-full text-xs font-medium"
                :class="getStatusClass(query.status)"
              >
                {{ getStatusDisplay(query.status) }}
              </span>
            </div>
            
            <div class="flex space-x-1">
              <button
                class="p-1 text-gray-500 hover:text-yellow-500"
                :class="{ 'text-yellow-500': query.isFavorite }"
                :title="query.isFavorite ? '从收藏夹中移除' : '添加到收藏夹'"
                @click="toggleFavorite(query, $event)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
              
              <button
                class="p-1 text-gray-500 hover:text-red-500"
                title="删除"
                @click="deleteQuery(query, $event)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="text-xs text-gray-500 mt-1">
            <div class="flex items-center space-x-4 mb-1">
              <span>类型: {{ getQueryTypeDisplay(query.queryType) }}</span>
              <span>执行时间: {{ query.executionTime || '—' }}ms</span>
              <span>结果数: {{ query.resultCount || '—' }}</span>
            </div>
            
            <div class="flex justify-between">
              <div class="truncate max-w-xs">{{ query.queryText }}</div>
              <div>{{ formatDateTime(query.createdAt) }}</div>
            </div>
          </div>
        </div>
        
        <!-- 加载更多 -->
        <div v-if="queryStore.pagination.page < queryStore.pagination.totalPages" class="text-center">
          <button
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded text-sm hover:bg-gray-300"
            @click="loadMore"
          >
            加载更多
          </button>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else class="p-6 text-center text-gray-500 border rounded">
        <p>暂无查询历史</p>
      </div>
    </div>
  </div>
</template>