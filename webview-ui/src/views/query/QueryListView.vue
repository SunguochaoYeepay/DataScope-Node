<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 页面标题和操作栏 -->
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">查询服务</h1>
        
        <div class="flex space-x-2">
          <button
            @click="navigateToFavorites"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-star text-yellow-500 mr-2"></i>我的收藏
          </button>
          
          <button
            @click="navigateToEditor"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-plus mr-2"></i>新建查询
          </button>
        </div>
      </div>
    </div>
    
    <!-- 过滤器 -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 搜索 -->
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
            搜索
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input 
              id="search"
              v-model="searchTerm"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="搜索查询名称或描述"
            />
          </div>
        </div>
        
        <!-- 状态过滤 -->
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">
            状态
          </label>
          <select
            id="status-filter"
            v-model="statusFilter"
            class="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">全部状态</option>
            <option value="DRAFT">草稿</option>
            <option value="PUBLISHED">已发布</option>
            <option value="DEPRECATED">已废弃</option>
          </select>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-end">
          <button 
            @click="clearFilters"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            重置筛选
          </button>
        </div>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <div class="bg-white shadow rounded-lg">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="p-10 text-center">
        <i class="fas fa-circle-notch fa-spin text-indigo-500 text-3xl mb-4"></i>
        <p class="text-gray-500">正在加载查询服务列表...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="filteredQueries.length === 0" class="p-10 text-center">
        <div class="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-search text-gray-400 text-2xl"></i>
        </div>
        <h3 class="text-sm font-medium text-gray-900">暂无查询服务</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchTerm || statusFilter ? '没有符合筛选条件的查询服务' : '开始创建您的第一个查询服务' }}
        </p>
        <div class="mt-6">
          <button 
            @click="navigateToEditor"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-plus mr-2"></i>
            新建查询
          </button>
        </div>
      </div>
      
      <!-- 数据表格 -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                数据源/类型
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="query in filteredQueries" :key="query.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                    <i class="fas fa-database"></i>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-indigo-600 hover:text-indigo-800 cursor-pointer" @click="viewQueryDetail(query)">
                      {{ query.name || '未命名查询' }}
                    </div>
                    <div v-if="query.description" class="text-sm text-gray-500 max-w-md truncate">
                      {{ query.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ query.dataSourceName || '未指定' }}</div>
                <div class="text-xs text-gray-500">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800">
                    {{ query.queryType === 'SQL' ? 'SQL' : '自然语言' }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="{
                    'bg-yellow-100 text-yellow-800': query.versionStatus === 'DRAFT',
                    'bg-green-100 text-green-800': query.versionStatus === 'PUBLISHED',
                    'bg-gray-100 text-gray-800': query.versionStatus === 'DEPRECATED'
                  }"
                >
                  {{ getStatusText(query.versionStatus) }}
                </span>
                <span
                  v-if="query.isActive"
                  class="ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800"
                >
                  活跃
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(query.createdAt) }}
                <div v-if="query.lastExecutedAt" class="text-xs text-gray-500 mt-1">
                  <span class="font-medium">上次执行:</span> {{ formatRelativeDate(query.lastExecutedAt) }}
                </div>
                <div v-if="query.resultCount" class="text-xs text-gray-500 mt-1">
                  <span class="font-medium">结果行数:</span> {{ formatNumber(query.resultCount) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="toggleFavorite(query)"
                  :class="[
                    'mx-1',
                    query.isFavorite ? 'text-yellow-500 hover:text-yellow-600' : 'text-gray-400 hover:text-yellow-500'
                  ]"
                  :title="query.isFavorite ? '取消收藏' : '收藏'"
                >
                  <i :class="[query.isFavorite ? 'fas fa-star' : 'far fa-star']"></i>
                </button>
                <button 
                  @click="viewVersions(query)"
                  class="text-blue-600 hover:text-blue-900 mx-1"
                  title="查看版本"
                >
                  <i class="fas fa-code-branch"></i>
                </button>
                <button 
                  @click="editQuery(query)"
                  class="text-indigo-600 hover:text-indigo-900 mx-1"
                  title="编辑查询"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="toggleQueryStatus(query)"
                  :class="[
                    'mx-1',
                    query.versionStatus === 'PUBLISHED' ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'
                  ]"
                  :title="query.versionStatus === 'PUBLISHED' ? '禁用' : '启用'"
                >
                  <i :class="[
                    query.versionStatus === 'PUBLISHED' ? 'fas fa-pause-circle' : 'fas fa-play-circle'
                  ]"></i>
                </button>
                <button 
                  @click="confirmDelete(query)"
                  class="text-red-600 hover:text-red-900 mx-1"
                  title="删除"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
              至
              <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredQueries.length) }}</span>
              条，共
              <span class="font-medium">{{ filteredQueries.length }}</span>
              条记录
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <!-- 上一页 -->
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                ]"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <!-- 页码 -->
              <template v-for="page in pageNumbers" :key="page">
                <button
                  v-if="page !== '...'"
                  @click="goToPage(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border',
                    page === currentPage
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-600 z-10'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
                <span
                  v-else
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm text-gray-700"
                >
                  {{ page }}
                </span>
              </template>
              
              <!-- 下一页 -->
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                ]"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 删除确认对话框 -->
  <div v-if="showDeleteConfirm" class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
              <i class="fas fa-exclamation-triangle text-red-600"></i>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                删除查询
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  确定要删除"{{ queryToDelete?.name || '未命名查询' }}"吗？此操作无法撤销。
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="deleteQueryConfirmed"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            删除
          </button>
          <button 
            @click="cancelDelete"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 状态变更确认对话框 -->
  <div v-if="showStatusConfirm" class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>
      
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
              <i class="fas fa-info-circle text-blue-600"></i>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                {{ newStatus === 'PUBLISHED' ? '启用' : '禁用' }}查询
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  确定要{{ newStatus === 'PUBLISHED' ? '启用' : '禁用' }}查询"{{ queryToToggle?.name || '未命名查询' }}"吗？
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button 
            @click="confirmStatusChange"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            确认
          </button>
          <button 
            @click="cancelStatusChange"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQueryStore } from '@/stores/query'
import { formatRelativeTime } from '@/utils/formatters'
import { useMessageService } from '@/services/message'

// 路由和Store
const router = useRouter()
const queryStore = useQueryStore()
const messageService = useMessageService()

// 状态
const isLoading = ref(true)
const queries = ref<any[]>([])
const searchTerm = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const showDeleteConfirm = ref(false)
const queryToDelete = ref<any>(null)
// 添加状态对话框相关状态
const showStatusConfirm = ref(false)
const queryToToggle = ref<any>(null)
const newStatus = ref('')

// 计算属性：筛选后的查询列表
const filteredQueries = computed(() => {
  let result = [...queries.value]
  
  // 搜索筛选
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(q => 
      (q.name && q.name.toLowerCase().includes(term)) || 
      (q.description && q.description.toLowerCase().includes(term))
    )
  }
  
  // 状态筛选
  if (statusFilter.value) {
    result = result.filter(q => q.versionStatus === statusFilter.value)
  }
  
  return result
})

// 计算属性：总页数
const totalPages = computed(() => {
  return Math.ceil(filteredQueries.value.length / pageSize.value)
})

// 计算属性：页码数组
const pageNumbers = computed(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, i) => i + 1)
  }
  
  let pages = []
  const current = currentPage.value
  
  pages.push(1)
  
  if (current > 3) {
    pages.push('...')
  }
  
  // 当前页附近的页码
  for (let i = Math.max(2, current - 1); i <= Math.min(totalPages.value - 1, current + 1); i++) {
    pages.push(i)
  }
  
  if (current < totalPages.value - 2) {
    pages.push('...')
  }
  
  if (totalPages.value > 1) {
    pages.push(totalPages.value)
  }
  
  return pages
})

// 初始化加载数据
onMounted(async () => {
  await fetchQueries()
})

// 获取查询列表数据
const fetchQueries = async () => {
  try {
    isLoading.value = true
    // 实际项目中应从API获取数据
    const response = await queryStore.fetchQueries()
    queries.value = response || []
  } catch (error) {
    console.error('获取查询列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 清除筛选条件
const clearFilters = () => {
  searchTerm.value = ''
  statusFilter.value = ''
  
  // 添加操作提示
  messageService.info('已重置所有筛选条件')
}

// 前往创建新查询
const navigateToEditor = () => {
  router.push('/query/editor')
}

// 编辑查询
const editQuery = (query: any) => {
  router.push({
    path: '/query/editor',
    query: { id: query.id }
  })
}

// 执行查询
const executeQuery = (query: any) => {
  router.push(`/query/detail/${query.id}`)
}

// 查看版本历史
const viewVersions = (query: any) => {
  router.push(`/query/version/management/${query.id}`)
}

// 查看执行历史
const viewExecutionHistory = (query: any) => {
  router.push(`/query/history/${query.id}`)
}

// 收藏/取消收藏
const toggleFavorite = async (query: any) => {
  try {
    if (query.isFavorite) {
      await queryStore.unfavoriteQuery(query.id)
      messageService.info(`已取消收藏"${query.name || '未命名查询'}"`)
    } else {
      await queryStore.favoriteQuery(query.id)
      messageService.success(`已收藏"${query.name || '未命名查询'}"`)
    }
    query.isFavorite = !query.isFavorite
  } catch (error) {
    console.error('操作收藏失败:', error)
    messageService.error('更新收藏状态失败')
  }
}

// 修改切换查询状态处理函数，使用确认对话框
const toggleQueryStatus = async (query: any) => {
  // 根据当前状态确定新状态
  newStatus.value = query.versionStatus === 'PUBLISHED' ? 'DEPRECATED' : 'PUBLISHED'
  queryToToggle.value = query
  showStatusConfirm.value = true
}

// 确认状态变更
const confirmStatusChange = async () => {
  if (!queryToToggle.value) return;
  
  try {
    // 在实际项目中，应该调用API来更新状态
    // await queryStore.updateQueryStatus(queryToToggle.value.id, newStatus.value);
    
    // 这里只是模拟状态更新
    queryToToggle.value.versionStatus = newStatus.value;
    
    // 使用全局消息服务显示成功消息
    messageService.success(
      `查询状态已${newStatus.value === 'PUBLISHED' ? '启用' : '禁用'}`
    );
    
    // 关闭确认对话框
    showStatusConfirm.value = false;
    queryToToggle.value = null;
  } catch (error) {
    console.error('更新查询状态失败:', error);
    messageService.error('更新查询状态失败');
  }
};

// 取消状态变更
const cancelStatusChange = () => {
  showStatusConfirm.value = false
  queryToToggle.value = null
}

// 删除确认
const confirmDelete = (query: any) => {
  queryToDelete.value = query
  showDeleteConfirm.value = true
}

// 取消删除
const cancelDelete = () => {
  showDeleteConfirm.value = false
  queryToDelete.value = null
}

// 确认删除
const deleteQueryConfirmed = async () => {
  if (!queryToDelete.value) return;
  
  try {
    // 调用store中的deleteQuery方法
    await queryStore.deleteQuery(queryToDelete.value.id);
    
    // 从列表中移除该项
    queries.value = queries.value.filter(q => q.id !== queryToDelete.value!.id);
    
    // 关闭确认对话框
    showDeleteConfirm.value = false;
    queryToDelete.value = null;
    
    // 不需要显示消息，因为store的deleteQuery方法已经通过全局消息服务显示了提示
  } catch (error) {
    console.error('删除查询失败:', error);
    // 不需要显示消息，因为store的deleteQuery方法已经通过全局消息服务显示了提示
  }
}

// 前一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 跳转到指定页
const goToPage = (page: number | string) => {
  if (typeof page === 'string') return;
  currentPage.value = page;
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'DRAFT':
      return '草稿'
    case 'PUBLISHED':
      return '已发布'
    case 'DEPRECATED':
      return '已废弃'
    default:
      return status || '未知'
  }
}

// 格式化日期
const formatDate = (dateString: string) => {
  if (!dateString) return '未知'
  
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 查看查询详情
const viewQueryDetail = (query: any) => {
  router.push(`/query/detail/${query.id}`)
}

// 添加格式化相对日期和数字的方法
// 格式化相对日期时间（如"2天前"）
const formatRelativeDate = (dateString: string) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.round(diffMs / 1000);
    const diffMin = Math.round(diffSec / 60);
    const diffHour = Math.round(diffMin / 60);
    const diffDay = Math.round(diffHour / 24);
    
    if (diffSec < 60) {
      return '刚刚';
    }
    if (diffMin < 60) {
      return `${diffMin}分钟前`;
    }
    if (diffHour < 24) {
      return `${diffHour}小时前`;
    }
    if (diffDay < 30) {
      return `${diffDay}天前`;
    }
    
    // 超过30天显示完整日期
    return formatDate(dateString);
  } catch (e) {
    return dateString;
  }
};

// 格式化数字（添加千位分隔符）
const formatNumber = (num: number) => {
  if (num === undefined || num === null) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// 前往收藏列表
const navigateToFavorites = () => {
  router.push('/query/favorites')
}
</script>

<style scoped>
/* 可能需要的其他样式 */
</style>