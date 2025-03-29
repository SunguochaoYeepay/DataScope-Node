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
        <button
          @click="loadQueryData"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-sync-alt mr-2"></i>
          重试
        </button>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div v-else-if="query" class="flex-1 overflow-auto p-6">
      <div class="container mx-auto px-4">
        <!-- 标题和返回按钮 -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-medium text-gray-800">{{ query.name || '未命名查询' }} - 详情</h1>
          <div class="flex space-x-3">
            <router-link
              to="/query/history"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              返回
            </router-link>
          </div>
        </div>
        
        <!-- 查询基本信息 -->
        <QueryDetailHeader 
          :query="query" 
          @favorite="handleFavorite"
          @share="handleShare"
          @edit="editQuery"
          @execute="executeCurrentQuery"
        />
        
        <!-- 标签页导航 -->
        <QueryDetailTabs
          :active-tab="activeTab"
          @tab-change="handleTabChange"
        />
        
        <!-- 执行历史区域 -->
        <div class="bg-white shadow rounded-lg mb-6 p-6">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">执行历史</h2>
            <span class="text-sm text-gray-500">显示最近5次执行记录</span>
          </div>
          
          <div v-if="isLoadingHistory" class="py-6 flex justify-center">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span class="text-gray-600">加载执行历史...</span>
            </div>
          </div>
          
          <div v-else-if="!executionHistory.length" class="py-6 text-center">
            <i class="fas fa-history text-3xl text-gray-400 mb-3"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">暂无执行历史</h3>
            <p class="text-gray-500">此查询还没有执行记录</p>
          </div>
          
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-300">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">执行时间</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">耗时</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">结果</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(history, index) in executionHistory" :key="index">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ history.id.substring(0, 8) }}...</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDateTime(history.executedAt) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatExecutionTime(history.executionTime) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="getStatusClass(history.status)">
                      {{ getStatusDisplay(history.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <span v-if="history.status === 'COMPLETED'" class="text-gray-700">
                      {{ history.rowCount || 0 }} 行
                    </span>
                    <span v-else-if="history.status === 'FAILED'" class="text-red-600">
                      {{ history.errorMessage || '未知错误' }}
                    </span>
                    <span v-else>-</span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      v-if="history.status === 'COMPLETED'"
                      @click="viewExecutionResults(history.id)"
                      class="text-indigo-600 hover:text-indigo-900 mr-3"
                    >
                      查看结果
                    </button>
                    <button
                      v-if="history.status === 'FAILED'"
                      @click="viewExecutionError(history.id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      查看错误
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- 各个标签页内容 -->
        <!-- 可视化标签页 -->
        <div v-if="activeTab === 'visualization'" class="bg-white shadow rounded-lg p-6">
          <div v-if="isLoadingVisualization" class="py-12 flex justify-center">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span class="text-gray-600">加载可视化数据...</span>
            </div>
          </div>
          
          <div v-else-if="!visualization && !isLoadingVisualization" class="py-12 text-center">
            <i class="fas fa-chart-bar text-3xl text-gray-400 mb-3"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">尚未创建可视化</h3>
            <p class="text-gray-500 mb-4">为此查询创建可视化图表以更好地分析结果</p>
            <button
              @click="editQuery"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-plus mr-2"></i>
              创建可视化
            </button>
          </div>
          
          <div v-else-if="visualization" class="visualization-container">
            <div class="mb-4 flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">{{ visualization.title || '查询可视化' }}</h3>
              <button
                @click="editQuery"
                class="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <i class="fas fa-pencil-alt mr-1"></i>
                编辑
              </button>
            </div>
            
            <!-- 这里将渲染可视化图表组件 -->
            <div class="h-96 bg-gray-50 rounded border border-gray-200 flex items-center justify-center">
              <p class="text-gray-500">可视化图表将在此渲染</p>
              <!-- <visualization-chart 
                :type="visualization.chartType"
                :data="queryResults"
                :config="visualization.config"
              /> -->
            </div>
          </div>
        </div>
        
        <!-- 执行计划标签页 -->
        <div v-if="activeTab === 'execution-plan'" class="bg-white shadow rounded-lg p-6">
          <div v-if="isLoadingExecutionPlan" class="py-12 flex justify-center">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span class="text-gray-600">加载执行计划...</span>
            </div>
          </div>
          
          <div v-else-if="!executionPlan && !isLoadingExecutionPlan" class="py-12 text-center">
            <i class="fas fa-sitemap text-3xl text-gray-400 mb-3"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">执行计划不可用</h3>
            <p class="text-gray-500 mb-4">
              {{ 
                query.status === 'COMPLETED' 
                  ? '此查询没有可用的执行计划信息' 
                  : '查询需要成功执行才能查看其执行计划' 
              }}
            </p>
            <button
              v-if="query.status !== 'COMPLETED'"
              @click="editQuery"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-play mr-2"></i>
              重新执行查询
            </button>
          </div>
          
          <div v-else-if="executionPlan" class="execution-plan-container">
            <h3 class="text-lg font-medium text-gray-900 mb-4">查询执行计划</h3>
            
            <!-- 执行计划内容 -->
            <div class="mb-6">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div class="bg-gray-100 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">总成本</h4>
                  <p class="text-lg font-semibold text-gray-900">{{ executionPlan.planDetails.totalCost.toFixed(2) }}</p>
                </div>
                <div class="bg-gray-100 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">估计行数</h4>
                  <p class="text-lg font-semibold text-gray-900">{{ executionPlan.planDetails.estimatedRows }}</p>
                </div>
                <div class="bg-gray-100 rounded-lg p-4">
                  <h4 class="text-sm font-medium text-gray-500 mb-1">步骤数</h4>
                  <p class="text-lg font-semibold text-gray-900">{{ executionPlan.planDetails.steps.length }}</p>
                </div>
              </div>
            </div>
            
            <div class="bg-gray-50 p-4 rounded border border-gray-200 overflow-auto max-h-96">
              <div v-for="(step, index) in executionPlan.planDetails.steps" :key="index" class="mb-4 p-4 bg-white border border-gray-200 rounded-md">
                <div class="flex items-start">
                  <div class="mr-3 mt-1">
                    <i class="fas fa-cog text-gray-500"></i>
                  </div>
                  <div class="flex-1">
                    <div class="flex justify-between">
                      <h5 class="text-sm font-medium text-gray-900">{{ step.type }}</h5>
                      <span class="text-xs bg-blue-100 text-blue-800 py-0.5 px-2 rounded-full">成本: {{ step.cost.toFixed(2) }}</span>
                    </div>
                    <div class="mt-1">
                      <p class="text-sm text-gray-600">{{ step.table ? `表: ${step.table}` : '' }}</p>
                      <p v-if="step.condition" class="text-sm text-gray-600">条件: {{ step.condition }}</p>
                      <p class="text-sm text-gray-600">估计行数: {{ step.rows }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 优化建议标签页 -->
        <div v-if="activeTab === 'suggestions'" class="bg-white shadow rounded-lg p-6">
          <div v-if="isLoadingSuggestions" class="py-12 flex justify-center">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span class="text-gray-600">加载优化建议...</span>
            </div>
          </div>
          
          <div v-else-if="!suggestions.length && !isLoadingSuggestions" class="py-12 text-center">
            <i class="fas fa-lightbulb text-3xl text-gray-400 mb-3"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">暂无优化建议</h3>
            <p class="text-gray-500 mb-4">
              {{ 
                query.status === 'COMPLETED' 
                  ? '系统未检测到任何优化机会' 
                  : '查询需要成功执行才能获取优化建议' 
              }}
            </p>
            <button
              v-if="query.status !== 'COMPLETED'"
              @click="editQuery"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-play mr-2"></i>
              重新执行查询
            </button>
          </div>
          
          <div v-else-if="suggestions.length" class="suggestions-container">
            <h3 class="text-lg font-medium text-gray-900 mb-4">查询优化建议</h3>
            
            <div class="space-y-4">
              <div 
                v-for="(suggestion, index) in suggestions" 
                :key="index"
                class="bg-yellow-50 p-4 rounded-lg border border-yellow-200"
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <i class="fas fa-lightbulb text-yellow-400"></i>
                  </div>
                  <div class="ml-3">
                    <div class="flex items-center">
                      <h4 class="text-sm font-medium text-yellow-800">{{ suggestion.title }}</h4>
                      <span 
                        v-if="suggestion.impact" 
                        class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="{
                          'bg-red-100 text-red-800': suggestion.impact === 'HIGH',
                          'bg-yellow-100 text-yellow-800': suggestion.impact === 'MEDIUM',
                          'bg-green-100 text-green-800': suggestion.impact === 'LOW',
                        }"
                      >
                        {{ suggestion.impact === 'HIGH' ? '高' : suggestion.impact === 'MEDIUM' ? '中' : '低' }}影响
                      </span>
                    </div>
                    <div class="mt-2 text-sm text-yellow-700">
                      <p>{{ suggestion.description }}</p>
                    </div>
                    <div v-if="suggestion.suggestedQuery" class="mt-3">
                      <p class="text-xs font-medium text-yellow-800 mb-1">建议的查询:</p>
                      <div class="bg-white p-3 rounded border border-yellow-200 overflow-auto max-h-32">
                        <pre class="text-xs text-gray-800 whitespace-pre-wrap">{{ suggestion.suggestedQuery }}</pre>
                      </div>
                      <button
                        @click="applyQuerySuggestion(suggestion.suggestedQuery)"
                        class="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        应用此建议
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 结果标签页 -->
        <div v-if="activeTab === 'results'" class="bg-white shadow rounded-lg p-6">
          <QueryResults
            :query-id="queryId"
            :results="queryResults"
            :isLoading="isLoadingResults"
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
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQueryStore } from '@/stores/query'
import { useDataSourceStore } from '@/stores/datasource'
import type { Query, QueryStatus, QueryVisualization } from '@/types/query'

// 导入组件
import QueryDetailHeader from '@/components/query/detail/QueryDetailHeader.vue'
import QueryDetailTabs from '@/components/query/detail/QueryDetailTabs.vue'
import QueryResults from '@/components/query/QueryResults.vue'

const router = useRouter()
const route = useRoute()
const queryStore = useQueryStore()
const dataSourceStore = useDataSourceStore()

// 状态变量
const isLoading = ref(true)
const isLoadingVisualization = ref(false)
const isLoadingExecutionPlan = ref(false)
const isLoadingSuggestions = ref(false)
const isLoadingResults = ref(false)
const errorMessage = ref('')
const activeTab = ref('visualization')
const showExportOptions = ref(false) // 是否显示导出选项

// 保存来源路径用于返回按钮
const previousPath = ref('')

// 执行历史数据
const executionHistory = ref<Array<{
  id: string;
  executedAt: string;
  executionTime: number;
  status: QueryStatus;
  rowCount?: number;
  errorMessage?: string;
}>>([])
const isLoadingHistory = ref(false)

// 从URL参数获取查询ID
const queryId = computed(() => {
  return route.params.id as string
})

// 获取完整查询数据
const query = computed(() => {
  return queryStore.currentQuery
})

// 获取可视化配置
const visualization = computed(() => {
  return queryStore.visualization
})

// 获取执行计划
const executionPlan = computed(() => {
  return queryStore.executionPlan
})

// 获取优化建议
const suggestions = computed(() => {
  return queryStore.suggestions
})

// 获取查询结果
const queryResults = computed(() => {
  return queryStore.currentQueryResult
})

// 初始化加载
onMounted(() => {
  // 如果数据源列表为空，加载数据源
  if (dataSourceStore.dataSources.length === 0) {
    dataSourceStore.fetchDataSources()
  }
  
  // 保存来源路径用于返回按钮
  previousPath.value = document.referrer ? document.referrer : (route.query.from as string || '/query/history')
  
  // 加载查询数据
  loadQueryData()
  
  // 点击外部时关闭导出选项下拉菜单
  document.addEventListener('click', (e) => {
    if (showExportOptions.value) {
      showExportOptions.value = false
    }
  })
  
  // 加载执行历史
  loadExecutionHistory()
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
    const result = await queryStore.getQuery(queryId.value)
    
    // 检查是否获取到查询数据
    if (!result || !queryStore.currentQuery) {
      errorMessage.value = '找不到指定ID的查询，请返回查询历史页面重新选择'
      isLoading.value = false
      return
    }
    
    // 根据选中的标签页加载其他数据
    await loadTabData(activeTab.value)
    
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load query data:', error)
    errorMessage.value = '无法加载查询信息，请检查查询ID是否有效'
    isLoading.value = false
  }
}

// 根据标签页加载相应数据
const loadTabData = async (tabId: string) => {
  if (!queryId.value) return
  
  if (tabId === 'visualization') {
    // 加载可视化配置
    await loadVisualizationData()
  } else if (tabId === 'execution-plan') {
    // 加载执行计划
    await loadExecutionPlanData()
  } else if (tabId === 'suggestions') {
    // 加载优化建议
    await loadSuggestionsData()
  } else if (tabId === 'results') {
    // 加载查询结果
    await loadResultsData()
  }
}

// 处理标签页变化
const handleTabChange = (tabId: string) => {
  activeTab.value = tabId
}

// 加载可视化配置
const loadVisualizationData = async () => {
  if (isLoadingVisualization.value) return
  
  isLoadingVisualization.value = true
  
  try {
    await queryStore.getQueryVisualization(queryId.value)
  } catch (error) {
    console.error('Failed to load visualization data:', error)
  } finally {
    isLoadingVisualization.value = false
  }
}

// 加载执行计划
const loadExecutionPlanData = async () => {
  if (isLoadingExecutionPlan.value) return
  
  isLoadingExecutionPlan.value = true
  
  try {
    await queryStore.getQueryExecutionPlan(queryId.value)
  } catch (error) {
    console.error('Failed to load execution plan:', error)
  } finally {
    isLoadingExecutionPlan.value = false
  }
}

// 加载优化建议
const loadSuggestionsData = async () => {
  if (isLoadingSuggestions.value) return
  
  isLoadingSuggestions.value = true
  
  try {
    await queryStore.getQuerySuggestions(queryId.value)
  } catch (error) {
    console.error('Failed to load query suggestions:', error)
  } finally {
    isLoadingSuggestions.value = false
  }
}

// 加载查询结果
const loadResultsData = async () => {
  if (isLoadingResults.value) return
  
  isLoadingResults.value = true
  
  try {
    // 这里假设查询结果已经保存在store中或者通过API获取
    // 模拟加载过程
    await new Promise(resolve => setTimeout(resolve, 1000))
  } catch (error) {
    console.error('Failed to load query results:', error)
  } finally {
    isLoadingResults.value = false
  }
}

// 编辑查询
const editQuery = () => {
  router.push({
    path: '/query/editor',
    query: { id: queryId.value }
  })
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

// 应用查询建议
const applyQuerySuggestion = (suggestedQuery: string) => {
  if (!suggestedQuery) return
  
  router.push({
    path: '/query/editor',
    query: { 
      id: queryId.value,
      applyQuery: encodeURIComponent(suggestedQuery)
    }
  })
}

// 导出结果
const exportResults = (format: 'csv' | 'excel' | 'json') => {
  if (!queryResults.value) return
  
  showExportOptions.value = false
  
  // 这里应该调用queryStore中的导出方法
  queryStore.exportQueryResults(queryId.value, format)
    .then(() => {
      console.log(`Results exported successfully as ${format}`)
    })
    .catch(error => {
      console.error('Failed to export results:', error)
    })
}

// 加载执行历史
const loadExecutionHistory = async () => {
  if (!queryId.value) return
  
  isLoadingHistory.value = true
  
  try {
    // 使用模拟数据
    const now = Date.now()
    if (query.value) {
      // 生成模拟的执行历史数据
      executionHistory.value = [
        {
          id: `exec-${queryId.value}-1`,
          executedAt: new Date(now - 3600000).toISOString(),
          executionTime: 1250,
          status: 'COMPLETED' as QueryStatus,
          rowCount: 128
        },
        {
          id: `exec-${queryId.value}-2`,
          executedAt: new Date(now - 7200000).toISOString(),
          executionTime: 2100,
          status: 'COMPLETED' as QueryStatus,
          rowCount: 256
        },
        {
          id: `exec-${queryId.value}-3`,
          executedAt: new Date(now - 14400000).toISOString(),
          executionTime: 890,
          status: 'FAILED' as QueryStatus,
          errorMessage: '查询超时或语法错误'
        },
        {
          id: `exec-${queryId.value}-4`,
          executedAt: new Date(now - 86400000).toISOString(),
          executionTime: 1500,
          status: 'COMPLETED' as QueryStatus,
          rowCount: 64
        },
        {
          id: `exec-${queryId.value}-5`,
          executedAt: new Date(now - 172800000).toISOString(),
          executionTime: 3200,
          status: 'CANCELLED' as QueryStatus
        }
      ]
    }
  } catch (error) {
    console.error('Failed to load execution history:', error)
  } finally {
    isLoadingHistory.value = false
  }
}

// 查看执行结果
const viewExecutionResults = (executionId: string) => {
  // 这里应该跳转到执行结果页面或者显示执行结果
  activeTab.value = 'results'
  // 使用特定执行ID加载结果
  loadExecutionResults(executionId)
}

// 查看执行错误
const viewExecutionError = (executionId: string) => {
  // 这里应该显示执行错误信息
  // 可以考虑使用对话框或者跳转到错误详情页面
  // 由于store中可能没有此方法，我们使用alert显示错误
  alert(`执行ID ${executionId} 失败，错误信息：查询超时或语法错误`);
  
  // 正常情况下的调用方式
  // queryStore.getExecutionError(executionId)
  //   .then((errorInfo: any) => {
  //     // 显示错误信息
  //     console.log('Error info:', errorInfo)
  //     // TODO: 显示错误信息对话框
  //   })
  //   .catch((error: Error) => {
  //     console.error('Failed to get execution error:', error)
  //   })
}

// 加载特定执行的结果
const loadExecutionResults = async (executionId: string) => {
  isLoadingResults.value = true
  
  try {
    // 由于store中可能没有此方法，我们直接使用当前结果
    // await queryStore.getExecutionResults(executionId)
    console.log(`加载执行ID为 ${executionId} 的结果`)
    // 这里应该是加载特定执行ID的结果
    // 但是由于我们没有实际的API，我们只是使用当前结果
  } catch (error) {
    console.error('Failed to load execution results:', error)
  } finally {
    isLoadingResults.value = false
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
const formatDateTime = (dateString: string | undefined) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 格式化执行时间
const formatExecutionTime = (ms: number | undefined) => {
  if (!ms) return '-'
  
  if (ms < 1000) {
    return `${ms} 毫秒`
  } else if (ms < 60000) {
    return `${(ms / 1000).toFixed(2)} 秒`
  } else {
    const minutes = Math.floor(ms / 60000)
    const seconds = ((ms % 60000) / 1000).toFixed(2)
    return `${minutes} 分 ${seconds} 秒`
  }
}

// 执行当前查询
const executeCurrentQuery = async () => {
  console.log('执行查询，查询对象:', query.value);
  
  if (!query.value) {
    console.error('查询对象为空');
    errorMessage.value = '查询对象为空，无法执行';
    return;
  }
  
  if (!query.value.dataSourceId) {
    console.error('数据源ID为空');
    errorMessage.value = '请选择数据源后再执行查询';
    return;
  }
  
  if (!query.value.queryText || query.value.queryText.trim() === '') {
    console.error('查询内容为空');
    errorMessage.value = '查询内容为空，无法执行';
    return;
  }
  
  try {
    isLoading.value = true;
    console.log('开始执行查询，类型:', query.value.queryType);
    
    // 执行查询
    if (query.value.queryType === 'SQL') {
      console.log('执行SQL查询:', query.value.queryText);
      await queryStore.executeQuery({
        dataSourceId: query.value.dataSourceId,
        queryText: query.value.queryText,
        queryType: 'SQL'
      });
    } else {
      console.log('执行自然语言查询:', query.value.queryText);
      await queryStore.executeNaturalLanguageQuery({
        dataSourceId: query.value.dataSourceId,
        question: query.value.queryText
      });
    }
    
    console.log('查询执行成功');
    
    // 如果执行成功，自动切换到结果标签页
    activeTab.value = 'results';
    await loadResultsData();
    
  } catch (error) {
    console.error('查询执行失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '执行查询时出错';
  } finally {
    isLoading.value = false;
  }
}

// 计算属性：是否可以执行查询
const canExecuteQuery = computed(() => {
  return query.value && query.value.dataSourceId && query.value.queryText && query.value.queryText.trim().length > 0
})

// 取消当前执行的查询
const handleCancelQuery = async (execId: string) => {
  try {
    console.log('正在取消查询执行:', execId);
    await queryStore.cancelQuery(execId);
    console.log('查询已成功取消');
    
    // 更新状态并重新加载执行历史
    isLoadingResults.value = false;
    loadExecutionHistory();
    
  } catch (error) {
    console.error('取消查询失败:', error);
    errorMessage.value = error instanceof Error ? error.message : '取消查询时出错';
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