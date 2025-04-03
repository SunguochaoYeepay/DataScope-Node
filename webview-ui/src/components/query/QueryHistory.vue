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
    title: '删除查询历史',
    content: '确定要删除这个查询历史记录吗？此操作不可恢复。',
    okButtonType: 'danger',
    okText: '删除',
    onOk: async () => {
      await queryStore.deleteQueryHistory(query.id)
      refresh()
    }
  })
}

// 查看版本
const viewVersions = (query: Query, event: Event) => {
  event.stopPropagation()
  
  // 使用路由导航到版本管理页面
  window.location.href = `/query/version/management/${query.id}`
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
          class="bg-white p-4 rounded-lg border hover:shadow-md cursor-pointer transition-shadow duration-200"
          @click="selectQuery(query)"
        >
          <div class="flex justify-between items-start">
            <div class="flex-grow">
              <div class="flex items-center mb-1">
                <h3 class="font-medium text-gray-900 mr-2">{{ query.name || '未命名查询' }}</h3>
                
                <!-- 版本信息 -->
                <div v-if="query.versionNumber" class="flex items-center">
                  <span 
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mr-1"
                    :class="{
                      'bg-yellow-100 text-yellow-800': query.versionStatus === 'DRAFT',
                      'bg-green-100 text-green-800': query.versionStatus === 'PUBLISHED',
                      'bg-gray-100 text-gray-800': query.versionStatus === 'DEPRECATED'
                    }"
                  >
                    v{{ query.versionNumber }}
                  </span>
                  
                  <span v-if="query.isActiveVersion" class="text-green-600" title="当前活跃版本">
                    <i class="fas fa-check-circle"></i>
                  </span>
                </div>
              </div>
              
              <div class="text-sm text-gray-500 mb-2">{{ query.description || '无描述' }}</div>
              
              <div class="flex items-center text-xs text-gray-500 mb-2 space-x-3">
                <span>
                  <i class="far fa-calendar-alt mr-1"></i>
                  {{ formatDateTime(query.createdAt) }}
                </span>
                
                <span v-if="query.updatedAt && query.updatedAt !== query.createdAt">
                  <i class="far fa-clock mr-1"></i>
                  更新于: {{ formatDateTime(query.updatedAt) }}
                </span>
                
                <span v-if="query.lastRun">
                  <i class="fas fa-play mr-1"></i>
                  上次运行: {{ formatDateTime(query.lastRun) }}
                </span>
                
                <span v-if="query.executionTime !== undefined">
                  <i class="fas fa-stopwatch mr-1"></i>
                  执行时间: {{ query.executionTime }}ms
                </span>
              </div>
              
              <div class="flex items-center text-xs">
                <span 
                  class="px-2 py-0.5 rounded-full mr-2"
                  :class="getStatusClass(query.status || 'COMPLETED')"
                >
                  {{ getStatusDisplay(query.status || 'COMPLETED') }}
                </span>
                
                <span class="text-gray-500 mr-2">
                  <i class="far fa-file-alt mr-1"></i>
                  {{ getQueryTypeDisplay(query.queryType || 'SQL') }}
                </span>
                
                <span v-if="query.resultCount !== undefined" class="text-gray-500">
                  <i class="fas fa-table mr-1"></i>
                  {{ query.resultCount }} 行结果
                </span>
              </div>
            </div>
            
            <div class="flex space-x-1">
              <button 
                @click="toggleFavorite(query, $event)" 
                class="p-1 rounded hover:bg-gray-100"
                :title="query.isFavorite ? '取消收藏' : '收藏'"
              >
                <i :class="[
                  query.isFavorite ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-400'
                ]"></i>
              </button>
              
              <button 
                @click="viewVersions(query, $event)" 
                class="p-1 rounded hover:bg-gray-100"
                title="查看版本"
              >
                <i class="fas fa-code-branch text-gray-400"></i>
              </button>
            </div>
          </div>
          
          <!-- 查询内容预览 -->
          <div class="mt-2 p-2 bg-gray-50 rounded border text-xs text-gray-600 font-mono line-clamp-2">
            {{ query.queryText }}
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