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
      <div class="max-w-7xl mx-auto">
        <!-- 标题和返回按钮 -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-medium text-gray-800">{{ query.name || '未命名查询' }} - 分析</h1>
          <router-link
            to="/query/history"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            返回列表
          </router-link>
        </div>
        
        <!-- 查询基本信息 -->
        <div class="bg-white shadow rounded-lg mb-6">
          <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">基本信息</h2>
            <button
              v-if="query"
              @click="editQuery"
              class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-edit mr-1.5"></i>
              编辑查询
            </button>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 class="text-sm font-medium text-gray-500">查询名称</h3>
                <p class="mt-1 text-sm text-gray-900">{{ query.name || '未命名查询' }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500">查询类型</h3>
                <p class="mt-1 text-sm text-gray-900">{{ query.queryType === 'SQL' ? 'SQL' : '自然语言' }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500">数据源</h3>
                <p class="mt-1 text-sm text-gray-900">{{ dataSourceName }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500">状态</h3>
                <div class="mt-1">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="getStatusClass(query.status)"
                  >
                    {{ getStatusDisplay(query.status) }}
                  </span>
                </div>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500">创建时间</h3>
                <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(query.createdAt) }}</p>
              </div>
              
              <div>
                <h3 class="text-sm font-medium text-gray-500">执行时间</h3>
                <p class="mt-1 text-sm text-gray-900">{{ formatExecutionTime(query.executionTime) }}</p>
              </div>
            </div>
            
            <div class="mt-4">
              <h3 class="text-sm font-medium text-gray-500">查询内容</h3>
              <div class="mt-1 p-3 bg-gray-50 rounded border border-gray-200 overflow-auto max-h-32">
                <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ query.queryText }}</pre>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 标签页导航 -->
        <div class="mb-6">
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex">
              <button 
                v-for="tab in tabs" 
                :key="tab.id"
                @click="activeTab = tab.id"
                class="py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap"
                :class="[
                  activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                <i :class="[tab.icon, 'mr-2']"></i>
                {{ tab.label }}
              </button>
            </nav>
          </div>
        </div>
        
        <!-- 可视化标签页 -->
        <div v-if="activeTab === 'visualization'" class="bg-white shadow rounded-lg p-6">
          <div v-if="isLoadingVisualization" class="py-12 flex justify-center">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span class="text-gray-600">加载可视化数据...</span>
            </div>
          </div>
          
          <div v-else-if="!visualizationConfig && !isLoadingVisualization" class="py-12 text-center">
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
          
          <div v-else-if="visualizationConfig" class="visualization-container">
            <div class="mb-4 flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">{{ visualizationConfig.title || '查询可视化' }}</h3>
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
                :type="visualizationConfig.chartType"
                :data="queryResults"
                :config="visualizationConfig"
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
            <div class="bg-gray-50 p-4 rounded border border-gray-200 overflow-auto max-h-96">
              <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ JSON.stringify(executionPlan, null, 2) }}</pre>
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
                    <h4 class="text-sm font-medium text-yellow-800">{{ suggestion.title }}</h4>
                    <div class="mt-2 text-sm text-yellow-700">
                      <p>{{ suggestion.description }}</p>
                    </div>
                    <div v-if="suggestion.suggestedQuery" class="mt-3">
                      <p class="text-xs font-medium text-yellow-800 mb-1">建议的查询:</p>
                      <div class="bg-white p-3 rounded border border-yellow-200 overflow-auto max-h-32">
                        <pre class="text-xs text-gray-800 whitespace-pre-wrap">{{ suggestion.suggestedQuery }}</pre>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 结果标签页 -->
        <div v-if="activeTab === 'results'" class="bg-white shadow rounded-lg p-6">
          <div v-if="isLoadingResults" class="py-12 flex justify-center">
            <div class="flex flex-col items-center">
              <div class="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
              <span class="text-gray-600">加载查询结果...</span>
            </div>
          </div>
          
          <div v-else-if="!queryResults && !isLoadingResults" class="py-12 text-center">
            <i class="fas fa-table text-3xl text-gray-400 mb-3"></i>
            <h3 class="text-lg font-medium text-gray-900 mb-2">查询结果不可用</h3>
            <p class="text-gray-500 mb-4">
              {{ 
                query.status === 'COMPLETED' 
                  ? '没有找到此查询的结果数据' 
                  : '查询需要成功执行才能查看结果' 
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
          
          <div v-else-if="queryResults" class="results-container">
            <div class="mb-4 flex justify-between items-center">
              <h3 class="text-lg font-medium text-gray-900">查询结果</h3>
              <div class="flex items-center space-x-2">
                <span class="text-sm text-gray-500">
                  {{ queryResults.rows.length }} 行 × {{ queryResults.columns.length }} 列
                </span>
                <button
                  @click="exportResults"
                  class="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i class="fas fa-download mr-1"></i>
                  导出
                </button>
              </div>
            </div>
            
            <!-- 结果表格 -->
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th
                      v-for="(column, index) in queryResults.columns"
                      :key="index"
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {{ column }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(row, rowIndex) in queryResults.rows" :key="rowIndex">
                    <td
                      v-for="(column, colIndex) in queryResults.columns"
                      :key="colIndex"
                      class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {{ row[column] }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
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
import type { Query, QueryStatus, QueryResult, QueryVisualization, QueryExecutionPlan, QuerySuggestion } from '@/types/query'

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

// 保存来源路径用于返回按钮
const previousPath = ref('')

// 标签定义
const tabs = [
  { id: 'visualization', label: '可视化', icon: 'fas fa-chart-bar' },
  { id: 'execution-plan', label: '执行计划', icon: 'fas fa-sitemap' },
  { id: 'suggestions', label: '优化建议', icon: 'fas fa-lightbulb' },
  { id: 'results', label: '查询结果', icon: 'fas fa-table' },
]

// 从URL参数获取查询ID
const queryId = computed(() => {
  return route.params.id as string
})

// 获取完整查询数据
const query = computed(() => {
  return queryStore.currentQuery
})

// 获取可视化配置
const visualizationConfig = computed(() => {
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

// 计算当前数据源名称
const dataSourceName = computed(() => {
  if (!queryStore.currentQuery || !queryStore.currentQuery.dataSourceId) {
    return '未指定';
  }
  
  const dataSource = dataSourceStore.dataSources.find(ds => ds.id === queryStore.currentQuery?.dataSourceId);
  return dataSource ? dataSource.name : queryStore.currentQuery.dataSourceId;
})

// 初始化加载
onMounted(async () => {
  // 保存来源路径用于返回按钮
  previousPath.value = document.referrer ? document.referrer : (route.query.from as string || '/query/history')
  
  console.log('开始加载分析页面数据，查询ID:', queryId.value)
  
  // 加载数据源信息
  if (dataSourceStore.dataSources.length === 0) {
    await dataSourceStore.fetchDataSources()
    console.log('加载的数据源:', dataSourceStore.dataSources)
  }
  
  // 加载查询数据
  loadQueryData()
})

// 监听标签页切换
watch(activeTab, (newTabId) => {
  console.log('标签页切换到:', newTabId)
  loadTabData(newTabId)
})

// 加载查询及相关数据
const loadQueryData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    // 加载查询详情 - 使用API实际路径，确保不会使用模拟数据
    console.log('开始加载查询数据，查询ID:', queryId.value)
    const result = await queryStore.getQuery(queryId.value)
    
    // 检查是否获取到查询数据
    if (!result || !queryStore.currentQuery) {
      console.error('未找到查询数据:', queryId.value)
      errorMessage.value = '找不到指定ID的查询，请返回查询历史页面重新选择'
      isLoading.value = false
      return
    }
    
    console.log('成功加载查询数据:', queryStore.currentQuery)
    
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

// 加载可视化配置
const loadVisualizationData = async () => {
  if (isLoadingVisualization.value) return
  
  isLoadingVisualization.value = true
  
  try {
    console.log('加载可视化数据，查询ID:', queryId.value)
    await queryStore.getQueryVisualization(queryId.value)
    console.log('可视化数据:', queryStore.visualization)
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
    console.log('加载执行计划数据，查询ID:', queryId.value)
    await queryStore.getQueryExecutionPlan(queryId.value)
    console.log('执行计划数据:', queryStore.executionPlan)
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
    console.log('加载优化建议数据，查询ID:', queryId.value)
    await queryStore.getQuerySuggestions(queryId.value)
    console.log('优化建议数据:', queryStore.suggestions)
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
    console.log('加载查询结果数据，查询ID:', queryId.value)
    // 尝试从store获取结果，如果不存在，则重新加载
    if (!queryStore.currentQueryResult) {
      try {
        // 这里应该有一个获取查询结果的API
        const result = await queryStore.getQuery(queryId.value)
        console.log('查询结果数据:', queryStore.currentQueryResult)
      } catch (err) {
        console.error('获取查询结果失败:', err)
      }
    }
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

// 导出结果
const exportResults = () => {
  if (!queryResults.value) return
  
  // 这里应该调用queryStore中的导出方法
  queryStore.exportQueryResults(queryId.value, 'csv')
    .then(() => {
      console.log('Results exported successfully')
    })
    .catch(error => {
      console.error('Failed to export results:', error)
    })
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
</script>

<style scoped>
.tab-content {
  display: none;
}

.tab-content.active {
  display: block;
}
</style>