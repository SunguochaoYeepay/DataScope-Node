<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { DataSource, DataSourceType, DataSourceStatus } from '@/types/datasource'
import { confirmModal } from '@/services/modal'
import { useDataSourceStore } from '@/stores/datasource'

// 组件属性
const props = defineProps<{
  dataSources: DataSource[]
  loading?: boolean
  showActions?: boolean
}>()

// 组件事件
const emit = defineEmits<{
  (e: 'refresh'): void
  (e: 'edit', dataSource: DataSource): void
  (e: 'delete', dataSource: DataSource): void
  (e: 'view', dataSource: DataSource): void
  (e: 'select', dataSource: DataSource): void
  (e: 'add'): void
  (e: 'test-connection', dataSource: DataSource): void
  (e: 'sync-metadata', dataSource: DataSource): void
}>()

// 路由
const router = useRouter()

// 数据源存储
const dataSourceStore = useDataSourceStore()

// 搜索和过滤
const searchKeyword = ref('')
const typeFilter = ref<DataSourceType | ''>('')
const statusFilter = ref<DataSourceStatus | ''>('')

// 分页
const currentPage = ref(1)
const pageSize = ref(10)

// 跟踪每个数据源的下拉菜单状态
const menuState = ref<Record<string, boolean>>({})

// 切换下拉菜单
const toggleMenu = (dataSourceId: string, event: Event) => {
  event.stopPropagation() // 阻止事件冒泡
  menuState.value[dataSourceId] = !menuState.value[dataSourceId]
}

// 关闭菜单
const closeMenu = (dataSourceId: string) => {
  menuState.value[dataSourceId] = false
}

// 计算属性：过滤后的数据源列表
const filteredDataSources = computed(() => {
  let result = [...(props.dataSources || [])]
  
  // 搜索关键字过滤
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(ds => 
      ds.name.toLowerCase().includes(keyword) || 
      ds.description.toLowerCase().includes(keyword) || 
      ds.host.toLowerCase().includes(keyword) ||
      ds.databaseName.toLowerCase().includes(keyword)
    )
  }
  
  // 类型过滤
  if (typeFilter.value) {
    result = result.filter(ds => ds.type === typeFilter.value)
  }
  
  // 状态过滤
  if (statusFilter.value) {
    result = result.filter(ds => ds.status === statusFilter.value)
  }
  
  return result
})

// 计算属性：当前页的数据源
const paginatedDataSources = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredDataSources.value.slice(start, end)
})

// 计算属性：总页数
const totalPages = computed(() => {
  return Math.ceil(filteredDataSources.value.length / pageSize.value)
})

// 计算属性：显示哪些页码按钮
const displayedPageNumbers = computed(() => {
  const numbers: (number | string)[] = []
  const maxVisiblePages = 5
  
  if (totalPages.value <= maxVisiblePages) {
    // 总页数不多，全部显示
    for (let i = 1; i <= totalPages.value; i++) {
      numbers.push(i)
    }
  } else {
    // 总页数较多，显示部分并用省略号表示
    numbers.push(1) // 始终显示第一页
    
    if (currentPage.value > 3) {
      numbers.push('...') // 当前页前面还有很多页，用省略号表示
    }
    
    // 显示当前页附近的页码
    const startPage = Math.max(2, currentPage.value - 1)
    const endPage = Math.min(totalPages.value - 1, currentPage.value + 1)
    
    for (let i = startPage; i <= endPage; i++) {
      numbers.push(i)
    }
    
    if (currentPage.value < totalPages.value - 2) {
      numbers.push('...') // 当前页后面还有很多页，用省略号表示
    }
    
    numbers.push(totalPages.value) // 始终显示最后一页
  }
  
  return numbers
})

// 处理页码变化
const handlePageChange = (page: number | string) => {
  // 如果是省略号，不做任何操作
  if (page === '...') return
  
  // 确保页码是数字
  currentPage.value = Number(page)
}

// 处理编辑数据源
const handleEdit = (dataSource: DataSource) => {
  emit('edit', dataSource)
}

// 处理删除数据源
const handleDelete = (dataSource: DataSource) => {
  confirmModal.confirm({
    title: '删除数据源',
    content: `确定要删除数据源"${dataSource.name}"吗？此操作不可恢复。`,
    okText: '删除',
    cancelText: '取消',
    okButtonType: 'danger',
    onOk: () => {
      emit('delete', dataSource)
    }
  })
}

// 处理查看数据源详情
const handleView = (dataSource: DataSource) => {
  emit('view', dataSource)
  emit('select', dataSource)
}

// 处理测试连接
const handleTestConnection = (dataSource: DataSource) => {
  emit('test-connection', dataSource)
}

// 处理同步元数据
const handleSyncMetadata = (dataSource: DataSource) => {
  emit('sync-metadata', dataSource)
}

// 获取数据源类型显示
const getDataSourceTypeDisplay = (type: DataSourceType) => {
  const typeMap: Record<DataSourceType, string> = {
    'MYSQL': 'MySQL',
    'POSTGRESQL': 'PostgreSQL',
    'ORACLE': 'Oracle',
    'SQLSERVER': 'SQL Server',
    'MONGODB': 'MongoDB',
    'ELASTICSEARCH': 'Elasticsearch'
  }
  return typeMap[type] || type
}

// 获取数据源状态显示
const getStatusDisplay = (status: DataSourceStatus) => {
  const statusMap: Record<DataSourceStatus, { text: string, color: string }> = {
    'ACTIVE': { text: '活跃', color: 'text-green-600' },
    'INACTIVE': { text: '不活跃', color: 'text-gray-500' },
    'ERROR': { text: '错误', color: 'text-red-600' },
    'SYNCING': { text: '同步中', color: 'text-blue-600' }
  }
  return statusMap[status] || { text: status, color: 'text-gray-600' }
}

// 格式化日期时间
const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return '-'
  
  const date = new Date(dateTimeString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 清除所有过滤器
const clearFilters = () => {
  searchKeyword.value = ''
  typeFilter.value = ''
  statusFilter.value = ''
  currentPage.value = 1
}

// 监听过滤条件变化，重置页码
watch([searchKeyword, typeFilter, statusFilter], () => {
  currentPage.value = 1
})

// 点击外部时关闭所有菜单
onMounted(() => {
  document.addEventListener('click', () => {
    // 重置所有菜单状态
    menuState.value = {}
  })
})
</script>

<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <!-- 过滤工具栏 -->
    <div class="p-4 border-b flex flex-wrap items-center justify-between gap-4">
      <!-- 搜索框 -->
      <div class="relative">
        <input
          v-model="searchKeyword"
          type="text"
          class="pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
          placeholder="搜索数据源..."
        />
        <div class="absolute left-3 top-2.5 text-gray-400">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- 类型过滤 -->
        <div>
          <select
            v-model="typeFilter"
            class="border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">所有类型</option>
            <option value="MYSQL">MySQL</option>
            <option value="POSTGRESQL">PostgreSQL</option>
            <option value="ORACLE">Oracle</option>
            <option value="SQLSERVER">SQL Server</option>
            <option value="MONGODB">MongoDB</option>
            <option value="ELASTICSEARCH">Elasticsearch</option>
          </select>
        </div>
        
        <!-- 状态过滤 -->
        <div>
          <select
            v-model="statusFilter"
            class="border border-gray-300 rounded-md py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">所有状态</option>
            <option value="ACTIVE">活跃</option>
            <option value="INACTIVE">不活跃</option>
            <option value="ERROR">错误</option>
            <option value="SYNCING">同步中</option>
          </select>
        </div>
        
        <!-- 清除过滤器按钮 -->
        <button
          v-if="searchKeyword || typeFilter || statusFilter"
          class="text-blue-600 hover:text-blue-800"
          @click="clearFilters"
        >
          清除过滤器
        </button>
        
        <!-- 刷新按钮 -->
        <button
          class="p-2 rounded-md hover:bg-gray-100"
          title="刷新"
          @click="emit('refresh')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="flex justify-center items-center py-16">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="filteredDataSources.length === 0" class="flex flex-col items-center justify-center py-16">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mb-4" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v7h-2l-1 2H8l-1-2H5V5z" clip-rule="evenodd" />
      </svg>
      <p class="text-lg text-gray-500 mb-2">暂无数据源</p>
      <p class="text-sm text-gray-400 mb-4" v-if="searchKeyword || typeFilter || statusFilter">
        尝试清除筛选条件或使用其他搜索关键词
      </p>
      <button
        v-if="showActions"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click="emit('add')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        添加数据源
      </button>
    </div>
    
    <!-- 数据源列表 -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              名称
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              类型
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              连接信息
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              状态
            </th>
            <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              上次同步
            </th>
            <th v-if="showActions" scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              操作
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="dataSource in paginatedDataSources" :key="dataSource.id" class="hover:bg-gray-50">
            <!-- 名称列 -->
            <td class="px-6 py-4">
              <div class="flex items-start">
                <div>
                  <div class="text-sm font-medium text-gray-900">
                    {{ dataSource.name }}
                  </div>
                  <div class="text-sm text-gray-500 truncate max-w-xs" :title="dataSource.description">
                    {{ dataSource.description || '无描述' }}
                  </div>
                </div>
              </div>
            </td>
            
            <!-- 类型列 -->
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                {{ getDataSourceTypeDisplay(dataSource.type) }}
              </div>
            </td>
            
            <!-- 连接信息列 -->
            <td class="px-6 py-4">
              <div class="text-sm text-gray-900">
                {{ dataSource.host }}:{{ dataSource.port }}
              </div>
              <div class="text-sm text-gray-500">
                {{ dataSource.databaseName }}
              </div>
            </td>
            
            <!-- 状态列 -->
            <td class="px-6 py-4">
              <span 
                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                :class="[
                  getStatusDisplay(dataSource.status).color,
                  dataSource.status === 'ERROR' ? 'bg-red-100' : 
                  dataSource.status === 'ACTIVE' ? 'bg-green-100' : 
                  dataSource.status === 'SYNCING' ? 'bg-blue-100' : 'bg-gray-100'
                ]"
              >
                {{ getStatusDisplay(dataSource.status).text }}
              </span>
              <div v-if="dataSource.status === 'ERROR'" class="text-xs text-red-500 mt-1 max-w-xs truncate" :title="dataSource.errorMessage">
                {{ dataSource.errorMessage || '未知错误' }}
              </div>
            </td>
            
            <!-- 上次同步时间列 -->
            <td class="px-6 py-4 text-sm text-gray-500">
              {{ dataSource.lastSyncTime ? formatDateTime(dataSource.lastSyncTime) : '从未同步' }}
            </td>
            
            <!-- 操作列 -->
            <td v-if="showActions" class="px-6 py-4 text-right text-sm font-medium space-x-2 whitespace-nowrap">
              <div class="flex items-center justify-end space-x-2">
                <button
                  @click="handleView(dataSource)"
                  class="p-2 rounded-full hover:bg-gray-100"
                  title="查看详情"
                >
                  <i class="fas fa-eye text-indigo-600"></i>
                </button>
                <button
                  @click="handleEdit(dataSource)"
                  class="p-2 rounded-full hover:bg-gray-100"
                  title="编辑"
                >
                  <i class="fas fa-edit text-indigo-600"></i>
                </button>
                <button
                  @click="handleDelete(dataSource)"
                  class="p-2 rounded-full hover:bg-gray-100"
                  title="删除"
                >
                  <i class="fas fa-trash text-red-600"></i>
                </button>
                
                <!-- 更多操作下拉菜单 -->
                <div class="relative inline-block text-left">
                  <div>
                    <button 
                      @click="toggleMenu(dataSource.id, $event)"
                      type="button" 
                      class="p-2 rounded-full hover:bg-gray-100"
                      title="更多操作"
                    >
                      <i class="fas fa-ellipsis-v text-gray-600"></i>
                    </button>
                  </div>
                  <div 
                    v-if="menuState[dataSource.id]" 
                    class="origin-top-right absolute right-0 mt-2 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  >
                    <div class="py-1" role="menu">
                      <button
                        @click="handleTestConnection(dataSource);closeMenu(dataSource.id)"
                        class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        <i class="fas fa-plug mr-2 text-green-600"></i> 测试连接
                      </button>
                      <button
                        @click="handleSyncMetadata(dataSource);closeMenu(dataSource.id)"
                        class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                        :disabled="dataSource.status === 'SYNCING'"
                      >
                        <i class="fas fa-sync-alt mr-2 text-purple-600"></i> 同步元数据
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页控件 -->
    <div v-if="totalPages > 1" class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
      <div>
        <p class="text-sm text-gray-700">
          显示 <span class="font-medium">{{ paginatedDataSources.length }}</span> 条，共 <span class="font-medium">{{ filteredDataSources.length }}</span> 条
        </p>
      </div>
      <div>
        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
          <!-- 上一页按钮 -->
          <button
            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
          >
            <span class="sr-only">上一页</span>
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <!-- 页码按钮 -->
          <template v-for="pageNum in displayedPageNumbers" :key="pageNum">
            <button
              v-if="pageNum !== '...'"
              @click="handlePageChange(pageNum)"
              class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
              :class="pageNum === currentPage 
                ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                : 'bg-white text-gray-700 hover:bg-gray-50'"
            >
              {{ pageNum }}
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
            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="currentPage === totalPages"
            @click="handlePageChange(currentPage + 1)"
          >
            <span class="sr-only">下一页</span>
            <i class="fas fa-chevron-right"></i>
          </button>
        </nav>
      </div>
    </div>
    
    <!-- 添加按钮 (数据源存在时) -->
    <div v-if="filteredDataSources.length > 0 && showActions" class="px-6 py-4 flex justify-center border-t">
      <button
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        @click="emit('add')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        添加数据源
      </button>
    </div>
  </div>
</template>