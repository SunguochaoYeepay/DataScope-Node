<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 页面标题和操作栏 -->
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">收藏的查询</h1>
        
        <div class="flex space-x-2">
          <button
            @click="navigateToList"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-arrow-left mr-2"></i>返回列表
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
    
    <!-- 收藏查询列表 -->
    <div class="bg-white shadow rounded-lg">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="p-10 text-center">
        <i class="fas fa-circle-notch fa-spin text-indigo-500 text-3xl mb-4"></i>
        <p class="text-gray-500">正在加载收藏的查询...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="favoriteQueries.length === 0" class="p-10 text-center">
        <div class="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <i class="far fa-star text-gray-400 text-2xl"></i>
        </div>
        <h3 class="text-sm font-medium text-gray-900">暂无收藏的查询</h3>
        <p class="mt-1 text-sm text-gray-500">
          您还没有收藏任何查询，在查询列表中点击星标图标收藏查询
        </p>
        <div class="mt-6">
          <button 
            @click="navigateToList"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-list mr-2"></i>
            查看所有查询
          </button>
        </div>
      </div>
      
      <!-- 收藏查询列表 -->
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
                收藏时间
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="query in favoriteQueries" :key="query.id">
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
                {{ formatDate(query.favoriteAt || query.createdAt) }}
                <div v-if="query.lastExecutedAt" class="text-xs text-gray-500 mt-1">
                  <span class="font-medium">上次执行:</span> {{ formatRelativeDate(query.lastExecutedAt) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="unfavoriteQuery(query)"
                  class="text-yellow-500 hover:text-yellow-600 mx-1"
                  title="取消收藏"
                >
                  <i class="fas fa-star"></i>
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
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQueryStore } from '@/stores/query'
import { useMessageService } from '@/services/message'

// 路由和Store
const router = useRouter()
const queryStore = useQueryStore()
const messageService = useMessageService()

// 状态
const isLoading = ref(true)
const queryToDelete = ref<any>(null)
const showDeleteConfirm = ref(false)

// 计算属性：获取收藏的查询
const favoriteQueries = computed(() => {
  return queryStore.favoriteQueries || []
})

// 初始化加载数据
onMounted(async () => {
  await loadFavorites()
})

// 加载收藏的查询
const loadFavorites = async () => {
  try {
    isLoading.value = true
    await queryStore.getFavorites()
  } catch (error) {
    console.error('获取收藏查询失败:', error)
    messageService.error('加载收藏查询失败')
  } finally {
    isLoading.value = false
  }
}

// 取消收藏
const unfavoriteQuery = async (query: any) => {
  try {
    await queryStore.unfavoriteQuery(query.id)
    messageService.info(`已取消收藏"${query.name || '未命名查询'}"`)
  } catch (error) {
    console.error('取消收藏失败:', error)
    messageService.error('取消收藏失败')
  }
}

// 前往创建新查询
const navigateToEditor = () => {
  router.push('/query/editor')
}

// 返回查询列表
const navigateToList = () => {
  router.push('/query/list')
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

// 查看查询详情
const viewQueryDetail = (query: any) => {
  router.push(`/query/detail/${query.id}`)
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
    if (diffHour <
24) {
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

// 切换查询状态
const toggleQueryStatus = async (query: any) => {
  try {
    await queryStore.toggleQueryStatus(query.id)
    messageService.info(`已${query.versionStatus === 'PUBLISHED' ? '禁用' : '启用'}"${query.name || '未命名查询'}"`)
  } catch (error) {
    console.error('切换查询状态失败:', error)
    messageService.error('切换查询状态失败')
  }
}

// 确认删除查询
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
    
    // 关闭确认对话框
    showDeleteConfirm.value = false;
    queryToDelete.value = null;
    
    // 显示成功消息
    messageService.success('查询已成功删除');
    
    // 重新加载收藏列表
    await loadFavorites();
  } catch (error) {
    console.error('删除查询失败:', error);
    messageService.error('删除查询失败');
  }
}
</script>

<style scoped>
/* 可能需要的其他样式 */
</style>