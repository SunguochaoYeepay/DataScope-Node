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
        
        <!-- 标签页导航 -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="border-b border-gray-200">
            <nav class="flex -mb-px">
              <button
                v-for="tab in tabs"
                :key="tab.id"
                @click="activeTab = tab.id"
                :class="[
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                  'py-4 px-6 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200'
                ]"
              >
                <i :class="['fas mr-2', tab.icon]"></i>
                {{ tab.label }}
              </button>
            </nav>
          </div>
        </div>
        
        <!-- 版本列表标签页 -->
        <div v-if="activeTab === 'versions'" class="bg-white shadow rounded-lg overflow-hidden mb-6">
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
        
        <!-- 查询详情标签页 -->
        <div v-if="activeTab === 'details'" class="bg-white shadow rounded-lg p-6 mb-6">
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
        
        <!-- 执行历史标签页 -->
        <div v-if="activeTab === 'history'" class="bg-white shadow rounded-lg mb-6 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">执行历史</h2>
            <div class="flex space-x-2">
              <select
                v-model="historyVersionFilter"
                class="border border-gray-300 rounded-md text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                <option value="all">所有版本</option>
                <option v-for="version in versions" :key="version.versionNumber" :value="version.versionNumber">
                  版本 {{ version.versionNumber }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- 查询历史列表 -->
          <query-history-with-version
            :query-id="queryId"
            :version-filter="historyVersionFilter"
          />
        </div>
        
        <!-- 结果标签页 -->
        <div v-if="activeTab === 'results'" class="bg-white shadow rounded-lg p-6 mb-6">
          <query-results
            :query-id="queryId"
            :results="queryResults"
            :is-loading="isLoadingResults"
            :error="errorMessage"
            @cancel="handleCancelQuery"
            @export="exportResults"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
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
import QueryHistoryWithVersion from '@/components/query/QueryHistoryWithVersion.vue'
import QueryResults from '@/components/query/QueryResults.vue'

// Store
const queryStore = useQueryStore()
const dataSourceStore = useDataSourceStore()
const versionStore = useQueryVersionStore()
const statusStore = useQueryStatusStore()
const route = useRoute()
const router = useRouter()

// 标签页定义
const tabs = [
  { id: 'details', label: '查询详情', icon: 'fa-info-circle' },
  { id: 'versions', label: '版本历史', icon: 'fa-code-branch' },
  { id: 'history', label: '执行历史', icon: 'fa-history' },
  { id: 'results', label: '查询结果', icon: 'fa-table' }
]

// 状态变量
const isLoading = ref(true)
const isLoadingResults = ref(false)
const isLoadingVersions = ref(false)
const errorMessage = ref('')
const activeTab = ref('details')
const historyVersionFilter = ref('all')

// SQL编辑器内容
const currentSql = ref('')

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

// 获取查询结果
const queryResults = computed(() => {
  return queryStore.currentQueryResult
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

// 监听标签页变化
watch(activeTab, (newTabId) => {
  loadTabData(newTabId)
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
    
    // 加载查询服务状态
    await statusStore.getQueryStatus(queryId.value)
    
    // 加载查询版本信息
    await versionStore.getQueryVersions(queryId.value)
    
    // 加载当前活跃版本
    await versionStore.getCurrentVersion(queryId.value)
    
    // 根据选中的标签页加载其他数据
    await loadTabData(activeTab.value)
    
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load query data:', error)
    errorMessage.value = error instanceof Error 
      ? `无法加载查询信息: ${error.message}` 
      : '无法加载查询信息，请检查查询ID是否有效'
    isLoading.value = false
  }
}

// 根据标签页加载相应数据
const loadTabData = async (tabId: string) => {
  if (!queryId.value) return
  
  if (tabId === 'history') {
    // 在历史标签页中加载执行历史
    await loadExecutionHistory()
  } else if (tabId === 'results') {
    // 在结果标签页中加载最近一次执行结果
    await loadResultsData()
  } else if (tabId === 'versions') {
    // 在版本标签页中加载版本信息
    await loadVersionsData()
  }
}

// 加载执行历史
const loadExecutionHistory = async () => {
  try {
    await queryStore.getQueryHistory(queryId.value)
  } catch (error) {
    console.error('Failed to load execution history:', error)
  }
}

// 加载查询结果
const loadResultsData = async () => {
  if (isLoadingResults.value) return
  
  isLoadingResults.value = true
  
  try {
    // 加载最近一次执行的结果
    await queryStore.getLastQueryResult(queryId.value)
  } catch (error) {
    console.error('Failed to load query results:', error)
  } finally {
    isLoadingResults.value = false
  }
}

// 加载版本信息
const loadVersionsData = async () => {
  if (isLoadingVersions.value) return
  
  isLoadingVersions.value = true
  
  try {
    await versionStore.getQueryVersions(queryId.value)
  } catch (error) {
    console.error('Failed to load query versions:', error)
  } finally {
    isLoadingVersions.value = false
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
      // TODO: 显示分享成功提示
      console.log('URL copied to clipboard')
    })
    .catch(err => {
      console.error('Failed to copy URL:', err)
    })
}

// 执行当前查询
const executeCurrentQuery = async () => {
  if (!canExecuteQuery.value) return
  
  let queryText = ''
  let queryType = ''
  
  // 优先使用当前活跃版本的查询内容
  if (currentVersion.value) {
    queryText = currentVersion.value.queryText
    queryType = currentVersion.value.queryType
  } else if (query.value) {
    queryText = query.value.queryText
    queryType = query.value.queryType
  } else {
    return
  }
  
  isLoadingResults.value = true
  errorMessage.value = ''
  
  try {
    // 执行查询
    if (queryType === 'SQL') {
      await queryStore.executeQuery({
        dataSourceId: query.value!.dataSourceId,
        queryText,
        queryType: 'SQL',
        version: currentVersion.value?.versionNumber
      })
    } else {
      await queryStore.executeNaturalLanguageQuery({
        dataSourceId: query.value!.dataSourceId,
        question: queryText,
        version: currentVersion.value?.versionNumber
      })
    }
    
    // 如果执行成功，自动切换到结果标签页
    activeTab.value = 'results'
    await loadResultsData()
    
  } catch (error) {
    console.error('查询执行失败:', error)
    errorMessage.value = error instanceof Error ? error.message : '执行查询时出错'
  } finally {
    isLoadingResults.value = false
  }
}

// 导出结果
const exportResults = (format: 'csv' | 'excel' | 'json') => {
  if (!queryResults.value) return
  
  queryStore.exportQueryResults(queryId.value, format)
    .then(() => {
      console.log(`Results exported successfully as ${format}`)
    })
    .catch(error => {
      console.error('Failed to export results:', error)
    })
}

// 取消当前执行的查询
const handleCancelQuery = async (execId: string) => {
  try {
    await queryStore.cancelQuery(execId)
    
    // 更新状态并重新加载执行历史
    isLoadingResults.value = false
    if (activeTab.value === 'history') {
      loadExecutionHistory()
    }
    
  } catch (error) {
    console.error('取消查询失败:', error)
    errorMessage.value = error instanceof Error ? error.message : '取消查询时出错'
  }
}

// 处理版本选择
const handleVersionSelected = (version: QueryVersion) => {
  versionStore.setCurrentVersion(version)
}

// 处理版本变更
const handleVersionChanged = async (versionNumber: number) => {
  try {
    await versionStore.getVersion(queryId.value, versionNumber)
  } catch (error) {
    console.error('Failed to load version:', error)
  }
}

// 获取数据源名称
const getDataSourceName = (dataSourceId: string) => {
  const dataSource = dataSourceStore.dataSources.find(ds => ds.id === dataSourceId)
  return dataSource ? dataSource.name : '未知数据源'
}

// 格式化日期
const formatDate = (dateString: string | undefined) => {
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

// 加载查询版本列表
const loadVersions = async () => {
  try {
    isLoadingVersions.value = true
    await versionStore.fetchVersions(queryId.value)
  } catch (err) {
    console.error('加载版本列表失败:', err)
    errorMessage.value = '无法加载版本列表，请稍后重试'
  } finally {
    isLoadingVersions.value = false
  }
}

// 加载指定版本详情
const loadVersion = async (versionId: string) => {
  try {
    isLoading.value = true
    const version = await versionStore.getVersion(queryId.value, versionId)
    
    // 更新当前选中的SQL版本
    if (version) {
      currentSql.value = version.queryText || ''
    }
  } catch (error) {
    console.error('加载版本详情失败:', error)
    errorMessage.value = '无法加载版本详情，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

// 切换版本处理函数
const handleVersionChange = async (versionId: string) => {
  try {
    await loadVersion(versionId)
    
    // 如果当前是编辑器页面，需要更新编辑器内容
    if (activeTab.value === 'editor') {
      // 更新SQL内容和版本状态等信息
      currentSql.value = versionStore.currentVersion?.queryText || ''
    }
    
    message.success('已切换到版本 ' + (versionStore.currentVersion?.versionNumber || ''))
  } catch (error) {
    console.error('版本切换失败:', error)
    message.error('版本切换失败')
  }
}

// 保存草稿版本
const handleSaveDraft = async () => {
  try {
    isLoading.value = true
    
    // 保存当前版本
    await versionStore.saveDraft(queryId.value, {
      versionId: versionStore.currentVersion?.id,
      queryText: currentSql.value
    })
    
    message.success('草稿已保存')
    
    // 重新加载版本列表
    await loadVersions()
  } catch (error) {
    console.error('保存草稿失败:', error)
    message.error('保存草稿失败')
  } finally {
    isLoading.value = false
  }
}

// 发布版本
const handlePublishVersion = async (setActive: boolean = false) => {
  try {
    if (!versionStore.currentVersion) {
      message.error('没有选择要发布的版本')
      return
    }
    
    isLoading.value = true
    
    // 发布当前版本
    await versionStore.publishVersion(
      queryId.value, 
      versionStore.currentVersion.id,
      setActive
    )
    
    message.success(`版本已发布${setActive ? '并设为当前活跃版本' : ''}`)
    
    // 重新加载版本列表
    await loadVersions()
  } catch (error) {
    console.error('发布版本失败:', error)
    message.error('发布版本失败')
  } finally {
    isLoading.value = false
  }
}

// 设置活跃版本
const handleSetActiveVersion = async (versionId: string) => {
  try {
    isLoading.value = true
    
    // 设置为活跃版本
    await versionStore.setActiveVersion(queryId.value, versionId)
    
    message.success('已设为当前活跃版本')
    
    // 重新加载版本列表
    await loadVersions()
  } catch (error) {
    console.error('设置活跃版本失败:', error)
    message.error('设置活跃版本失败')
  } finally {
    isLoading.value = false
  }
}

// 创建新版本
const handleCreateNewVersion = async () => {
  try {
    if (!versionStore.currentVersion) {
      message.error('无法创建新版本，当前没有选择基础版本')
      return
    }
    
    isLoading.value = true
    
    // 创建新版本
    const newVersion = await versionStore.createNewVersion(
      queryId.value,
      versionStore.currentVersion.id
    )
    
    message.success('新版本已创建')
    
    // 加载新创建的版本
    await loadVersion(newVersion.id)
    
    // 重新加载版本列表
    await loadVersions()
    
    // 切换到编辑器标签
    activeTab.value = 'editor'
  } catch (error) {
    console.error('创建新版本失败:', error)
    message.error('创建新版本失败')
  } finally {
    isLoading.value = false
  }
}

// 废弃版本
const handleDeprecateVersion = async (versionId: string) => {
  try {
    isLoading.value = true
    
    // 废弃版本
    await versionStore.deprecateVersion(queryId.value, versionId)
    
    message.success('版本已废弃')
    
    // 重新加载版本列表
    await loadVersions()
  } catch (error) {
    console.error('废弃版本失败:', error)
    message.error('废弃版本失败')
  } finally {
    isLoading.value = false
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