<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 页面标题和操作栏 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">查询服务</h1>
      
      <div class="flex space-x-4">
        <div class="relative">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="搜索查询名称或描述..."
            class="pl-9 pr-4 py-2 w-64 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <span class="absolute left-3 top-2.5 text-gray-400">
            <i class="fas fa-search"></i>
          </span>
        </div>
        
        <div>
          <select
            v-model="statusFilter"
            class="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">全部状态</option>
            <option value="DRAFT">草稿</option>
            <option value="PUBLISHED">已发布</option>
            <option value="DEPRECATED">已废弃</option>
          </select>
        </div>
        
        <button
          @click="navigateToEditor"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <i class="fas fa-plus mr-2"></i>新建查询
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      <span class="ml-3 text-lg text-gray-600">加载查询列表中...</span>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="filteredQueries.length === 0" class="flex flex-col items-center justify-center py-20 bg-gray-50 rounded-lg border border-gray-200">
      <i class="fas fa-file-alt text-4xl text-gray-400 mb-4"></i>
      
      <h3 class="text-xl font-medium text-gray-800 mb-2">暂无查询</h3>
      
      <p class="text-gray-600 mb-6 text-center max-w-md">
        {{ 
          searchTerm || statusFilter 
            ? '没有符合筛选条件的查询，请尝试清除筛选条件' 
            : '您还没有创建任何查询，点击"新建查询"按钮开始创建'
        }}
      </p>
      
      <div class="flex space-x-4">
        <button
          v-if="searchTerm || statusFilter"
          @click="clearFilters"
          class="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          清除筛选
        </button>
        
        <button
          @click="navigateToEditor"
          class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <i class="fas fa-plus mr-2"></i>新建查询
        </button>
      </div>
    </div>
    
    <!-- 查询列表 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="query in filteredQueries" 
        :key="query.id" 
        class="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
      >
        <!-- 查询卡片头部 -->
        <div class="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
          <h3 class="font-medium text-gray-900 truncate" :title="query.name">
            {{ query.name || '未命名查询' }}
          </h3>
          
          <div class="flex space-x-1">
            <span
              v-if="query.versionStatus"
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
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
              class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              title="当前活跃版本"
            >
              <i class="fas fa-check-circle mr-1"></i>活跃
            </span>
          </div>
        </div>
        
        <!-- 查询卡片内容 -->
        <div class="p-4">
          <div class="text-sm text-gray-500 mb-4 line-clamp-2" :title="query.description">
            {{ query.description || '无描述' }}
          </div>
          
          <div class="flex flex-col space-y-2 text-xs text-gray-500 mb-4">
            <div class="flex items-center">
              <i class="fas fa-database w-4 mr-2"></i>
              <span>数据源: {{ query.dataSourceName || '未指定' }}</span>
            </div>
            
            <div class="flex items-center">
              <i class="fas fa-code-branch w-4 mr-2"></i>
              <span>版本: {{ query.versionNumber || '0' }}</span>
            </div>
            
            <div class="flex items-center">
              <i class="far fa-calendar w-4 mr-2"></i>
              <span>创建于: {{ formatDate(query.createdAt) }}</span>
            </div>
            
            <div class="flex items-center">
              <i class="far fa-clock w-4 mr-2"></i>
              <span>最后更新: {{ formatDate(query.updatedAt) }}</span>
            </div>
          </div>
          
          <!-- 操作按钮组 -->
          <div class="flex justify-between items-center pt-3 border-t border-gray-100">
            <button
              @click="toggleFavorite(query)"
              class="text-gray-400 hover:text-yellow-500 focus:outline-none"
              :class="{ 'text-yellow-500': query.isFavorite }"
              :title="query.isFavorite ? '取消收藏' : '收藏'"
            >
              <i :class="[query.isFavorite ? 'fas fa-star' : 'far fa-star']"></i>
            </button>
            
            <div class="flex space-x-2">
              <button
                @click="viewVersions(query)"
                class="px-2 py-1 text-xs text-indigo-600 hover:text-indigo-700 focus:outline-none"
                title="查看版本"
              >
                <i class="fas fa-code-branch mr-1"></i>版本
              </button>
              
              <button
                @click="editQuery(query)"
                class="px-2 py-1 text-xs text-indigo-600 hover:text-indigo-700 focus:outline-none"
                title="编辑查询"
              >
                <i class="fas fa-pencil-alt mr-1"></i>编辑
              </button>
              
              <button
                @click="executeQuery(query)"
                class="px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700 focus:outline-none"
                title="执行查询"
              >
                <i class="fas fa-play mr-1"></i>执行
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 分页控件 -->
    <div v-if="totalPages > 1" class="flex justify-center mt-8">
      <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
        <button
          @click="prevPage"
          :disabled="currentPage <= 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage <= 1 }"
        >
          <span class="sr-only">上一页</span>
          <i class="fas fa-chevron-left"></i>
        </button>
        
        <span 
          v-for="page in pageNumbers" 
          :key="page" 
          :class="[
            page === currentPage 
              ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
            'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
          ]"
        >
          <button v-if="page !== '...'" @click="goToPage(page)">{{ page }}</button>
          <span v-else>{{ page }}</span>
        </span>
        
        <button
          @click="nextPage"
          :disabled="currentPage >= totalPages"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
          :class="{ 'opacity-50 cursor-not-allowed': currentPage >= totalPages }"
        >
          <span class="sr-only">下一页</span>
          <i class="fas fa-chevron-right"></i>
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQueryStore } from '@/stores/query'
import { formatRelativeTime } from '@/utils/formatters'

// 路由和Store
const router = useRouter()
const queryStore = useQueryStore()

// 状态
const isLoading = ref(true)
const queries = ref<any[]>([])
const searchTerm = ref('')
const statusFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

// 计算属性：筛选后的查询列表
const filteredQueries = computed(() => {
  let result = [...queries.value]
  
  // 搜索筛选
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(q => 
      (q.name || '').toLowerCase().includes(term) || 
      (q.description || '').toLowerCase().includes(term)
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

// 计算属性：当前页数据
const paginatedQueries = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredQueries.value.slice(start, end)
})

// 计算属性：分页页码
const pageNumbers = computed(() => {
  const pages = []
  const maxPageButtons = 5 // 最多显示的页码按钮数
  
  if (totalPages.value <= maxPageButtons) {
    // 总页数少于最大显示数，显示所有页码
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    // 总页数多于最大显示数，显示部分页码
    // 总是显示第一页
    pages.push(1)
    
    // 确定中间页码范围
    let startPage = Math.max(2, currentPage.value - 1)
    let endPage = Math.min(totalPages.value - 1, startPage + 2)
    
    // 调整以确保显示足够的页码
    if (endPage - startPage < 2) {
      if (startPage === 2) {
        endPage = Math.min(totalPages.value - 1, 4)
      } else {
        startPage = Math.max(2, totalPages.value - 3)
      }
    }
    
    // 添加省略号和中间页码
    if (startPage > 2) {
      pages.push('...')
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    if (endPage < totalPages.value - 1) {
      pages.push('...')
    }
    
    // 总是显示最后一页
    pages.push(totalPages.value)
  }
  
  return pages
})

// 生命周期钩子：组件挂载时加载数据
onMounted(async () => {
  await loadQueries()
})

// 监听筛选条件变化，重置页码
watch([searchTerm, statusFilter], () => {
  currentPage.value = 1
})

// 方法：加载查询列表
async function loadQueries() {
  try {
    isLoading.value = true
    
    // 调用store方法获取查询列表
    const fetchedQueries = await queryStore.fetchQueries({
      page: 1,
      size: 100 // 一次加载较多数据，前端进行分页
    })
    
    queries.value = fetchedQueries
  } catch (error) {
    console.error('加载查询列表失败:', error)
  } finally {
    isLoading.value = false
  }
}

// 方法：清除筛选条件
function clearFilters() {
  searchTerm.value = ''
  statusFilter.value = ''
}

// 方法：格式化日期
function formatDate(dateString?: string) {
  if (!dateString) return '未知'
  
  try {
    return formatRelativeTime(new Date(dateString))
  } catch (error) {
    return dateString
  }
}

// 方法：获取状态文本
function getStatusText(status: string) {
  const statusMap: Record<string, string> = {
    'DRAFT': '草稿',
    'PUBLISHED': '已发布',
    'DEPRECATED': '已废弃'
  }
  
  return statusMap[status] || status
}

// 方法：收藏/取消收藏
async function toggleFavorite(query: any) {
  try {
    if (query.isFavorite) {
      await queryStore.unfavoriteQuery(query.id)
    } else {
      await queryStore.favoriteQuery(query.id)
    }
    
    query.isFavorite = !query.isFavorite
  } catch (error) {
    console.error('收藏操作失败:', error)
  }
}

// 导航方法
function navigateToEditor() {
  router.push('/query/editor')
}

function editQuery(query: any) {
  router.push(`/query/editor/${query.id}`)
}

function viewVersions(query: any) {
  router.push(`/query/version/management/${query.id}`)
}

function executeQuery(query: any) {
  router.push(`/query/detail/${query.id}`)
}

// 分页方法
function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

function goToPage(page: number) {
  currentPage.value = page
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>