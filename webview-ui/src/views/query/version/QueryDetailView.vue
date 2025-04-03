<template>
  <div class="h-full flex flex-col bg-gray-100">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span class="text-gray-600">加载查询信息...</span>
      </div>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="errorMessage" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-3xl text-red-500 mb-3"></i>
        <h2 class="text-xl font-medium text-gray-800 mb-2">加载失败</h2>
        <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
        <div class="flex justify-center space-x-3">
          <button
            @click="loadQueryData"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            重试
          </button>
          <router-link
            to="/query/history"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            返回查询历史
          </router-link>
        </div>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div v-else-if="query" class="flex-1 overflow-auto">
      <div class="container mx-auto px-4 py-6">
        <!-- 顶部区域：标题、状态管理和主要操作 -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <div class="flex justify-between items-start">
            <div>
              <div class="flex items-center mb-2">
                <h1 class="text-2xl font-medium text-gray-800">{{ query.name || '未命名查询' }}</h1>
                <span 
                  v-if="query.isFavorite" 
                  class="ml-2 text-yellow-500" 
                  title="已收藏"
                >
                  <i class="fas fa-star"></i>
                </span>
              </div>
              <p class="text-gray-500 text-sm">
                {{ getDataSourceName(query.dataSourceId) }} | 
                创建于 {{ formatDate(query.createdAt) }} | 
                由 {{ query.createdBy || '系统' }} 创建
              </p>
            </div>
            
            <div class="flex items-center space-x-3">
              <!-- 状态管理组件 -->
              <query-status-manager 
                :query-id="queryId" 
                :initial-status="query.status"
              />
              
              <div class="flex space-x-2">
                <button
                  @click="handleFavorite(queryId)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i class="fas" :class="query.isFavorite ? 'fa-star text-yellow-500' : 'fa-star'" :title="query.isFavorite ? '取消收藏' : '收藏'"></i>
                </button>
                
                <button
                  @click="handleShare(queryId)"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  title="分享"
                >
                  <i class="fas fa-share-alt"></i>
                </button>
                
                <button
                  @click="executeCurrentQuery"
                  :disabled="!canExecuteQuery || query.status === 'disabled'"
                  :class="[
                    'inline-flex items-center px-4 py-1.5 border border-transparent text-sm rounded-md shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
                    canExecuteQuery && query.status !== 'disabled' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-400 cursor-not-allowed'
                  ]"
                  :title="query.status === 'disabled' ? '查询服务已禁用' : '执行查询'"
                >
                  <i class="fas fa-play mr-2"></i>
                  执行
                </button>
                
                <router-link
                  :to="{
                    path: '/query/editor',
                    query: { id: queryId }
                  }"
                  class="inline-flex items-center px-4 py-1.5 border border-transparent text-sm rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <i class="fas fa-edit mr-2"></i>
                  编辑
                </router-link>
              </div>
            </div>
          </div>
          
          <!-- 版本状态栏 -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <version-status-bar 
              :query-id="queryId"
              :current-version="currentVersion"
              @version-changed="handleVersionChanged"
            />
          </div>
        </div>
        
        <!-- 基本信息卡片 -->
        <div class="bg-white shadow rounded-lg p-6 mb-6">
          <div class="flex flex-col space-y-6">
            <!-- 查询基本信息 -->
            <div>
              <h2 class="text-lg font-medium text-gray-900 mb-4">查询信息</h2>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-2">查询名称</h3>
                  <p class="text-gray-900">{{ query.name || '未命名查询' }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-2">查询类型</h3>
                  <p class="text-gray-900">{{ query.queryType === 'SQL' ? 'SQL 查询' : '自然语言查询' }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-2">数据源</h3>
                  <p class="text-gray-900">{{ getDataSourceName(query.dataSourceId) }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-2">创建者</h3>
                  <p class="text-gray-900">{{ query.createdBy || '系统' }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-2">创建时间</h3>
                  <p class="text-gray-900">{{ formatDate(query.createdAt) }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-2">最后修改时间</h3>
                  <p class="text-gray-900">{{ formatDate(query.updatedAt) || '-' }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-2">最后执行时间</h3>
                  <p class="text-gray-900">{{ formatDate(query.lastExecutedAt) || '从未执行' }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500 mb-2">版本数量</h3>
                  <p class="text-gray-900">{{ query.versionCount || 0 }}</p>
                </div>
              </div>
            </div>
            
            <!-- 查询描述 -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">描述</h3>
              <div class="bg-gray-50 rounded-md p-3 border border-gray-200">
                <p v-if="query.description" class="text-gray-900 whitespace-pre-wrap">{{ query.description }}</p>
                <p v-else class="text-gray-500 italic">无描述</p>
              </div>
            </div>
            
            <!-- 查询内容 -->
            <div>
              <h3 class="text-sm font-medium text-gray-500 mb-2">当前查询内容</h3>
              <div class="bg-gray-50 rounded-md p-3 border border-gray-200">
                <pre class="text-gray-900 overflow-auto max-h-64">{{ currentVersion?.queryText || query.queryText }}</pre>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 版本历史部分 -->
        <div class="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div class="p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900">版本历史</h2>
              <router-link
                :to="`/query/versions/${queryId}`"
                class="text-sm text-indigo-600 hover:text-indigo-900"
              >
                查看详细版本管理
              </router-link>
            </div>
            
            <version-list
              :query-id="queryId"
              :compact="true"
              @version-selected="handleVersionSelected"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQueryStore } from '@/stores/query'
import { useDataSourceStore } from '@/stores/datasource'
import { useQueryVersionStore } from '@/stores/queryVersion'
import { useQueryStatusStore } from '@/stores/queryStatus'
import { message } from '@/services/message'
import type { Query, QueryVersion, QueryStatus } from '@/types/query'
import type { QueryVersionStatus } from '@/types/queryVersion'

// 导入组件
import QueryStatusManager from '@/components/query/status/QueryStatusManager.vue'
import VersionStatusBar from '@/components/query/version/VersionStatusBar.vue'
import VersionList from '@/components/query/version/VersionList.vue'

// Store
const queryStore = useQueryStore()
const dataSourceStore = useDataSourceStore()
const versionStore = useQueryVersionStore()
const statusStore = useQueryStatusStore()
const route = useRoute()
const router = useRouter()

// 状态变量
const isLoading = ref(true)
const errorMessage = ref('')

// 从URL参数获取查询ID
const queryId = computed(() => {
  return route.params.id as string
})

// 获取完整查询数据
const query = computed(() => {
  return queryStore.currentQuery
})

// 获取当前版本
const currentVersion = computed(() => {
  return versionStore.currentVersion
})

// 获取所有版本
const versions = computed(() => {
  return versionStore.versions
})

// 计算属性：是否可以执行查询
const canExecuteQuery = computed(() => {
  return query.value && query.value.dataSourceId && 
    ((currentVersion.value && currentVersion.value.queryText && currentVersion.value.queryText.trim().length > 0) ||
    (query.value.queryText && query.value.queryText.trim().length > 0))
})

// 初始化加载
onMounted(async () => {
  // 如果数据源列表为空，加载数据源
  if (dataSourceStore.dataSources.length === 0) {
    await dataSourceStore.fetchDataSources()
  }
  
  // 加载查询数据
  loadQueryData()
})

// 加载查询及相关数据
const loadQueryData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 加载查询详情
    await queryStore.getQuery(queryId.value)
    
    // 检查是否获取到查询数据
    if (!queryStore.currentQuery) {
      errorMessage.value = '找不到指定ID的查询，该查询可能已被删除或不存在'
      isLoading.value = false
      console.error(`查询ID ${queryId.value} 不存在`)
      return
    }
    
    // 加载查询版本信息
    await versionStore.getQueryVersions(queryId.value)
    
    // 加载当前活跃版本
    await versionStore.getCurrentVersion(queryId.value)
    
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load query data:', error)
    errorMessage.value = error instanceof Error 
      ? `无法加载查询信息: ${error.message}` 
      : '无法加载查询信息，请检查查询ID是否有效'
    isLoading.value = false
  }
}

// 处理收藏操作
const handleFavorite = async (id: string) => {
  try {
    if (query.value?.isFavorite) {
      await queryStore.unfavoriteQuery(id)
    } else {
      await queryStore.favoriteQuery(id)
    }
  } catch (error) {
    console.error('Failed to update favorite status:', error)
  }
}

// 处理分享操作
const handleShare = (id: string) => {
  // 复制查询详情页的URL到剪贴板
  const url = `${window.location.origin}/query/detail/${id}`
  navigator.clipboard.writeText(url)
    .then(() => {
      message.success('链接已复制到剪贴板')
    })
    .catch(err => {
      console.error('Failed to copy URL:', err)
      message.error('复制链接失败')
    })
}

// 执行当前查询
const executeCurrentQuery = async () => {
  if (!canExecuteQuery.value) return
  
  try {
    // 使用当前活跃版本的查询内容
    if (currentVersion.value) {
      // 导航到执行页面
      router.push({
        name: 'QueryVersionExecute',
        params: {
          id: queryId.value,
          versionId: currentVersion.value.id
        }
      })
    } else {
      message.error('没有可执行的版本')
    }
  } catch (error) {
    console.error('执行查询失败:', error)
    message.error('执行查询失败')
  }
}

// 获取数据源名称
const getDataSourceName = (dataSourceId: string) => {
  const dataSource = dataSourceStore.dataSources.find(ds => ds.id === dataSourceId)
  return dataSource ? dataSource.name : '未知数据源'
}

// 格式化日期
const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 版本选择处理
const handleVersionSelected = (versionId: string) => {
  // 导航到版本详情页
  router.push({
    name: 'QueryVersionDetails',
    params: {
      id: queryId.value,
      versionId: versionId
    }
  })
}

// 版本变更处理
const handleVersionChanged = async (versionId: string) => {
  try {
    // 加载指定版本
    await versionStore.getCurrentVersion(queryId.value, versionId)
    message.success('已切换到新版本')
  } catch (error) {
    console.error('版本切换失败:', error)
    message.error('版本切换失败')
  }
}
</script>

<style scoped>
.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}
</style>