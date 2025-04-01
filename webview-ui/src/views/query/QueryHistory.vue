<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 页面标题和操作按钮 -->
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          查询历史
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
        <router-link 
          to="/query/editor"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <i class="fas fa-plus mr-2"></i>
          新建查询
        </router-link>
        <button
          @click="exportHistoryData"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-download mr-2"></i>
          导出历史
        </button>
      </div>
    </div>
    
    <!-- 筛选条件栏（上方） -->
    <div class="bg-white shadow rounded-lg p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-5 gap-4">
        <!-- 关键字搜索 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input
              type="text"
              v-model="filters.searchTerm"
              @input="debounceSearch"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="搜索查询名称或内容..."
            />
          </div>
        </div>
        
        <!-- 查询类型 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">查询类型</label>
          <select
            v-model="filters.queryType"
            @change="applyFilters"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">全部</option>
            <option value="SQL">SQL</option>
            <option value="NATURAL_LANGUAGE">自然语言</option>
          </select>
        </div>
        
        <!-- 执行状态 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">执行状态</label>
          <select
            v-model="filters.status"
            @change="applyFilters"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">全部</option>
            <option value="COMPLETED">完成</option>
            <option value="RUNNING">运行中</option>
            <option value="FAILED">失败</option>
            <option value="CANCELLED">已取消</option>
          </select>
        </div>
        
        <!-- 日期范围 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">日期范围</label>
          <select
            v-model="dateRangePresetValue"
            @change="applyFilters"
            class="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="custom">自定义范围</option>
          </select>
        </div>
        
        <!-- 清除筛选按钮 -->
        <div class="flex items-end space-x-2">
          <button
            @click="clearFilters"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-times-circle mr-2"></i>
            清除筛选
          </button>
          <button
            @click="refreshHistory"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            刷新
          </button>
        </div>
      </div>
      
      <!-- 自定义日期范围 (仅在选择自定义范围时显示) -->
      <div v-if="dateRangePresetValue === 'custom'" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">开始日期</label>
          <input
            type="date"
            v-model="filters.startDate"
            @change="applyFilters"
            class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">结束日期</label>
          <input
            type="date"
            v-model="filters.endDate"
            @change="applyFilters"
            class="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
    </div>
    
    <!-- 查询列表（下方） -->
    <div>
      <!-- 加载状态 -->
      <div v-if="isLoading" class="h-64 flex items-center justify-center">
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span class="text-gray-600">加载历史记录中...</span>
        </div>
      </div>
      
      <!-- 没有记录状态 -->
      <div v-else-if="queries.length === 0" class="flex flex-col items-center justify-center p-12 text-gray-500">
        <div class="mb-4">
          <Icon name="circle-info" class="h-12 w-12 text-gray-300" />
        </div>
        <h3 class="text-lg font-medium mb-2">没有查询历史</h3>
        <p class="text-sm">尝试修改筛选条件或创建新查询</p>
        
        <!-- 调试信息 -->
        <div class="mt-8 p-4 border border-gray-300 rounded-md bg-gray-50 w-full max-w-xl text-xs text-left">
          <h4 class="font-bold mb-2">调试信息</h4>
          <p>查询历史数量: {{ queries.length }}</p>
          <p>分页信息: {{ totalPages > 0 ? `第 ${currentPage}/${totalPages} 页，共 ${totalItems} 条记录` : '无分页数据' }}</p>
        </div>
      </div>
      
      <!-- 查询列表 -->
      <div v-else>
        <div class="grid grid-cols-1 gap-4">
          <div 
            v-for="query in queries" 
            :key="query.id"
            class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
          >
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center">
                  <h3 class="text-base font-medium text-gray-900">{{ query.name || '未命名查询' }}</h3>
                  <span
                    class="ml-2 px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(query.status)"
                  >
                    {{ getStatusDisplay(query.status) }}
                  </span>
                  <span
                    v-if="query.isFavorite"
                    class="ml-2 text-yellow-500"
                    title="收藏查询"
                  >
                    <i class="fas fa-star"></i>
                  </span>
                </div>
                
                <div class="mt-1 text-sm text-gray-500 line-clamp-2 whitespace-pre-wrap">
                  {{ query.queryText }}
                </div>
                
                <div class="mt-2 flex items-center text-xs text-gray-500">
                  <div class="mr-4">
                    <i class="fas fa-database mr-1"></i>
                    {{ query.dataSourceId }}
                  </div>
                  <div class="mr-4">
                    <i class="fas fa-code mr-1"></i>
                    {{ query.queryType === 'SQL' ? 'SQL' : '自然语言' }}
                  </div>
                  <div class="mr-4">
                    <i class="fas fa-clock mr-1"></i>
                    {{ formatDateTime(query.createdAt) }}
                  </div>
                  <div v-if="query.executionTime">
                    <i class="fas fa-stopwatch mr-1"></i>
                    {{ formatExecutionTime(query.executionTime) }}
                  </div>
                </div>
              </div>
              
              <div class="flex space-x-2">
                <button
                  @click="editQuery(query)"
                  class="p-2 text-gray-500 hover:text-indigo-600 rounded"
                  title="编辑查询"
                >
                  <i class="fas fa-edit"></i>
                </button>
                
                <button
                  @click="toggleFavorite(query)"
                  class="p-2 rounded"
                  :class="query.isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-500 hover:text-yellow-500'"
                  :title="query.isFavorite ? '从收藏中删除' : '添加到收藏'"
                >
                  <i class="fas fa-star"></i>
                </button>
                
                <button
                  @click="viewQueryDetail(query)"
                  class="p-2 text-gray-500 hover:text-indigo-600 rounded"
                  title="查看详情"
                >
                  <i class="fas fa-eye"></i>
                </button>
                
                <button
                  @click="viewQueryAnalytics(query)"
                  class="p-2 text-gray-500 hover:text-indigo-600 rounded"
                  title="查看分析"
                >
                  <i class="fas fa-chart-bar"></i>
                </button>
                
                <button
                  @click="confirmDelete(query)"
                  class="p-2 text-gray-500 hover:text-red-600 rounded"
                  title="删除查询"
                >
                  <i class="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 分页 -->
        <div class="mt-6">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              显示 <span class="font-medium">{{ (currentPage - 1) * 10 + 1 }}</span> 到 <span class="font-medium">{{ Math.min(currentPage * 10, filteredTotalItems) }}</span> 共 <span class="font-medium">{{ filteredTotalItems }}</span> 条结果
            </div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <!-- 上一页按钮 -->
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">上一页</span>
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <!-- 页码按钮 -->
              <template v-for="i in getPageNumbers()" :key="i">
                <button
                  v-if="i !== '...'"
                  @click="goToPage(Number(i))"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                  :class="Number(i) === currentPage 
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'"
                >
                  {{ i }}
                </button>
                <span
                  v-else
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  ...
                </span>
              </template>
              
              <!-- 下一页按钮 -->
              <button
                @click="nextPage"
                :disabled="currentPage >= filteredTotalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">下一页</span>
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 删除确认对话框 -->
  <div v-if="showDeleteConfirm" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 max-w-md w-full">
      <h3 class="text-lg font-medium text-gray-900 mb-4">确认删除</h3>
      <p class="text-sm text-gray-500 mb-4">
        您确定要删除查询 "{{ queryToDelete?.name || '未命名查询' }}" 吗？此操作无法撤销。
      </p>
      <div class="flex justify-end space-x-3">
        <button
          @click="showDeleteConfirm = false; queryToDelete = null"
          class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          取消
        </button>
        <button
          @click="deleteQuery"
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          删除
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useQueryStore } from '@/stores/query'
import { formatDateTime, formatDuration } from '@/utils/formatters'
import Icon from '@/components/common/Icon.vue'
import Button from '@/components/common/Button.vue'
import Modal from '@/components/common/Modal.vue'
import Pagination from '@/components/common/Pagination.vue'
import StatusBadge from '@/components/common/StatusBadge.vue'
import type { Query, QueryHistoryParams, QueryStatus } from '@/types/query'
import message from '@/types/message/index'

// 内联定义DateRange接口，避免类型冲突
interface DateRange {
  startDate: string;
  endDate: string;
  preset?: string;
}

export default defineComponent({
  components: {
    Icon,
    Button,
    Modal,
    Pagination,
    StatusBadge,
  },
  setup() {
    const router = useRouter()
    const queryStore = useQueryStore()
    
    // 查询参数
    const searchTerm = ref('')
    const selectedQueryType = ref<string>('')
    const selectedStatus = ref<string>('')
    const dateRange = ref<DateRange | null>(null)
    const customDateRange = ref(false)
    const page = ref(1)
    const pageSize = ref(10)
    const isLoading = ref(false)
    const showDeleteConfirm = ref(false)
    const queryToDelete = ref<Query | null>(null)
    
    // 组件挂载时，自动加载查询历史
    onMounted(async () => {
      console.log('QueryHistory组件已挂载，开始加载查询历史');
      await loadQueryHistory();
    });
    
    // 防抖搜索
    let searchTimeout: number | null = null
    const debounceSearch = () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
      searchTimeout = setTimeout(() => {
        applyFilters()
      }, 500) as unknown as number
    }
    
    // 计算属性: 当前页
    const currentPage = computed({
      get: () => page.value,
      set: (val: number) => { page.value = val }
    })
    
    // 计算属性: 总页数
    const totalPages = computed(() => {
      return queryStore.pagination?.totalPages || 0
    })
    
    // 计算属性: 总记录数
    const totalItems = computed(() => {
      return queryStore.pagination?.total || 0
    })
    
    // 计算属性: 当前页查询列表
    const queries = computed(() => {
      // 检查是否有查询记录
      console.log(`查询历史数量: ${queryStore.queryHistory?.length || 0}`);
      
      // 直接返回所有查询记录，不做过滤
      return queryStore.queryHistory || [];
    })
    
    // 计算属性: 是否可以查看上一页
    const canGoToPrevPage = computed(() => {
      return currentPage.value > 1
    })
    
    // 计算属性: 是否可以查看下一页
    const canGoToNextPage = computed(() => {
      return currentPage.value < totalPages.value
    })

    // 筛选条件
    const filters = reactive({
      searchTerm: '',
      queryType: '',
      status: '',
      startDate: '',
      endDate: ''
    })

    // 日期范围预设
    const dateRangePresetValue = ref<string>('24h')

    // 监听日期范围预设变化
    watch(dateRangePresetValue, (newValue) => {
      if (newValue !== 'custom') {
        const now = new Date()
        const endDate = now.toISOString().split('T')[0]
        let startDate = ''
        
        switch (newValue) {
          case '24h':
            now.setDate(now.getDate() - 1)
            startDate = now.toISOString().split('T')[0]
            break
          case '7d':
            now.setDate(now.getDate() - 7)
            startDate = now.toISOString().split('T')[0]
            break
          case '30d':
            now.setDate(now.getDate() - 30)
            startDate = now.toISOString().split('T')[0]
            break
        }
        
        filters.startDate = startDate
        filters.endDate = endDate
      }
    })

    // 加载查询历史
    const loadQueryHistory = async () => {
      try {
        isLoading.value = true
        
        // 构建查询参数对象
        const params = {
          page: currentPage.value,
          size: 10,
          queryType: filters.queryType ? (filters.queryType as any) : undefined,
          status: filters.status ? (filters.status as any) : undefined,
          startDate: filters.startDate,
          endDate: filters.endDate,
          searchTerm: filters.searchTerm
        };
        
        console.log('开始查询历史，使用参数:', params);
        
        // 调用store方法获取查询历史
        await queryStore.fetchQueryHistory(params);
        
        console.log('查询结果:', {
          结果长度: queryStore.queryHistory.length,
          分页信息: queryStore.pagination,
          是否有内容: queryStore.queryHistory.length > 0 ? '有' : '无'
        });
        
        // 获取收藏夹，以便标记已收藏的查询
        await queryStore.getFavorites();
      } catch (error) {
        console.error('加载查询历史失败:', error);
      } finally {
        isLoading.value = false;
      }
    }

    // 刷新历史
    const refreshHistory = async () => {
      isLoading.value = true
      await loadQueryHistory()
      isLoading.value = false
    }

    // 应用筛选条件
    const applyFilters = async () => {
      isLoading.value = true
      await loadQueryHistory()
      isLoading.value = false
    }

    // 清除筛选条件
    const clearFilters = () => {
      filters.searchTerm = ''
      filters.queryType = ''
      filters.status = ''
      filters.startDate = ''
      filters.endDate = ''
      dateRangePresetValue.value = '24h'
      applyFilters()
    }

    // 前一页
    const prevPage = async () => {
      if (currentPage.value <= 1) return;
      
      page.value -= 1;
      await loadQueryHistory();
    }

    // 下一页
    const nextPage = async () => {
      if (currentPage.value >= totalPages.value) return;
      
      page.value += 1;
      await loadQueryHistory();
    }

    // 导出历史数据
    const exportHistoryData = () => {
      // 创建CSV内容
      const csvContent = [
        // 表头
        ['查询名称', '查询类型', '状态', '创建时间', '执行时间(ms)', '数据源', '查询文本'].join(','),
        // 数据行
        ...queries.value.map(query => [
          (query.name || '未命名查询').replace(/,/g, ' '), // 避免逗号干扰CSV
          query.queryType === 'SQL' ? 'SQL' : '自然语言',
          getStatusDisplay(query.status),
          formatDateTime(query.createdAt),
          query.executionTime || 0,
          query.dataSourceId,
          `"${query.queryText.replace(/"/g, '""')}"` // 避免引号干扰，并用双引号包围
        ].join(','))
      ].join('\n')
      
      // 创建下载链接
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `查询历史_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      message.success('查询历史已导出为CSV文件')
    }

    // 编辑查询
    const editQuery = (query: Query) => {
      router.push({
        path: '/query/editor',
        query: { id: query.id }
      })
    }

    // 收藏/取消收藏
    const toggleFavorite = async (query: Query) => {
      try {
        if (query.isFavorite) {
          await queryStore.unfavoriteQuery(query.id)
        } else {
          await queryStore.favoriteQuery(query.id)
        }
        
        // 更新本地状态
        query.isFavorite = !query.isFavorite
      } catch (error) {
        console.error('收藏操作失败:', error)
      }
    }

    // 查看查询详情
    const viewQueryDetail = (query: Query) => {
      router.push(`/query/detail/${query.id}`)
    }

    // 查看查询分析
    const viewQueryAnalytics = (query: Query) => {
      router.push(`/query/analytics/${query.id}`)
    }

    // 确认删除查询
    const confirmDelete = (query: Query) => {
      queryToDelete.value = query
      showDeleteConfirm.value = true
    }

    // 删除查询
    const deleteQuery = async () => {
      if (!queryToDelete.value) return
      
      try {
        await queryStore.deleteQuery(queryToDelete.value.id)
        showDeleteConfirm.value = false
        queryToDelete.value = null
        
        // 刷新列表
        await refreshHistory()
      } catch (error) {
        console.error('删除查询失败:', error)
      }
    }

    // 获取查询状态样式类
    const getStatusClass = (status: QueryStatus) => {
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

    // 获取查询状态显示文本
    const getStatusDisplay = (status: QueryStatus) => {
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

    // 格式化日期时间
    const formatDateTime = (dateString: string) => {
      if (!dateString) return ''
      
      const date = new Date(dateString)
      return date.toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    // 格式化执行时间
    const formatExecutionTime = (ms: number | undefined) => {
      if (!ms) return '0 ms'
      
      if (ms < 1000) {
        return `${ms} ms`
      } else if (ms < 60000) {
        return `${(ms / 1000).toFixed(2)} 秒`
      } else {
        const minutes = Math.floor(ms / 60000)
        const seconds = ((ms % 60000) / 1000).toFixed(2)
        return `${minutes} 分 ${seconds} 秒`
      }
    }

    // 获取页码按钮
    const getPageNumbers = () => {
      const total = filteredTotalPages.value
      const current = currentPage.value
      
      // 如果总页数较少，全部显示
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => (i + 1).toString())
      }
      
      // 否则显示部分页码，带省略号
      const result = []
      
      // 总是显示第一页
      result.push('1')
      
      // 如果当前页靠近开始
      if (current <= 4) {
        for (let i = 2; i <= 5; i++) {
          if (i <= total) {
            result.push(i.toString())
          }
        }
        if (total > 6) {
          result.push('...')
        }
        if (total > 5) {
          result.push(total.toString())
        }
      } 
      // 如果当前页靠近结束
      else if (current >= total - 3) {
        result.push('...')
        for (let i = total - 4; i < total; i++) {
          if (i > 1) {
            result.push(i.toString())
          }
        }
      } 
      // 如果当前页在中间
      else {
        result.push('...')
        for (let i = current - 1; i <= current + 1; i++) {
          if (i > 1 && i < total) {
            result.push(i.toString())
          }
        }
        result.push('...')
        result.push(total.toString())
      }
      
      return result
    }

    // 跳转到指定页码
    const goToPage = async (pageNum: number) => {
      if (pageNum < 1 || pageNum > totalPages.value) return;
      
      page.value = pageNum;
      await loadQueryHistory();
    }

    // 添加筛选后的计算属性
    const filteredTotalItems = computed<number>(() => {
      return totalItems.value;
    })
    
    // 添加筛选后的总页数计算属性
    const filteredTotalPages = computed<number>(() => {
      // 如果没有分页信息，返回默认值1
      if (!queryStore.pagination) return 1;
      
      // 如果值不存在或为0，返回1，否则返回实际值
      return Math.ceil(filteredTotalItems.value / pageSize.value) || 1;
    })

    return {
      isLoading,
      showDeleteConfirm,
      queryToDelete,
      currentPage,
      totalPages,
      totalItems,
      queries,
      canGoToPrevPage,
      canGoToNextPage,
      hasMorePages: computed(() => {
        return queryStore.pagination && queryStore.pagination.page < queryStore.pagination.totalPages
      }),
      getStatusClass,
      getStatusDisplay,
      formatDateTime,
      formatExecutionTime,
      getPageNumbers,
      goToPage,
      refreshHistory,
      exportHistoryData,
      editQuery,
      toggleFavorite,
      viewQueryDetail,
      viewQueryAnalytics,
      confirmDelete,
      deleteQuery,
      clearFilters,
      prevPage,
      nextPage,
      applyFilters,
      loadQueryHistory,
      filters,
      dateRangePresetValue,
      debounceSearch,
      message,
      filteredTotalItems,
      filteredTotalPages
    }
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>