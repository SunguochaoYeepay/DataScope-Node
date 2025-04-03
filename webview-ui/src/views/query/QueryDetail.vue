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
    <div v-else-if="query" class="flex-1 overflow-auto p-6">
      <div class="container mx-auto px-4">
        <!-- 标题和按钮 -->
        <div class="flex justify-between items-center mb-6">
          <h1 class="text-2xl font-medium text-gray-800">{{ query.name || '未命名查询' }} - 详情</h1>
          <div class="flex items-center space-x-4">
            <!-- 编辑按钮 -->
            <button
              @click="editQuery"
              class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-edit mr-1.5"></i>
              编辑查询
            </button>
            
            <!-- 返回按钮 -->
            <router-link
              to="/query/history"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              返回列表
            </router-link>
          </div>
        </div>
        
        <!-- 查询基本信息 -->
        <div class="mb-6">
          <div class="bg-white shadow rounded-lg">
            <!-- 基本信息标题 -->
            <div class="px-6 py-4 border-b border-gray-200">
              <h2 class="text-lg font-medium text-gray-900">基本信息</h2>
            </div>
            
            <!-- 基本信息内容 -->
            <div class="p-6">
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <h3 class="text-sm font-medium text-gray-500">查询名称</h3>
                  <p class="mt-1 text-sm text-gray-900">{{ query.name || '未命名查询' }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500">数据源</h3>
                  <p class="mt-1 text-sm text-gray-900">{{ getDataSourceName(query.dataSourceId) }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500">查询类型</h3>
                  <p class="mt-1 text-sm text-gray-900">{{ query.queryType === 'SQL' ? 'SQL' : '自然语言' }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500">创建时间</h3>
                  <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(query.createdAt) }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500">最后执行</h3>
                  <p class="mt-1 text-sm text-gray-900">{{ query.lastExecutedAt ? formatDateTime(query.lastExecutedAt) : '-' }}</p>
                </div>
                
                <div>
                  <h3 class="text-sm font-medium text-gray-500">执行次数</h3>
                  <p class="mt-1 text-sm text-gray-900">{{ query.executionCount || 0 }}</p>
                </div>
              </div>
              
              <div class="mt-6">
                <h3 class="text-sm font-medium text-gray-500">查询内容</h3>
                <div class="mt-2 p-4 bg-gray-50 rounded border border-gray-200 overflow-auto max-h-40">
                  <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ query.queryText }}</pre>
                </div>
              </div>

              <div v-if="query.description" class="mt-6">
                <h3 class="text-sm font-medium text-gray-500">描述</h3>
                <p class="mt-2 text-sm text-gray-900">{{ query.description }}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 版本历史部分 -->
        <div class="bg-white shadow rounded-lg">
          <!-- 版本历史标题 -->
          <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 class="text-lg font-medium text-gray-900">版本历史</h2>
            <button
              @click="createNewVersion"
              class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-plus mr-1.5"></i>
              新增版本
            </button>
          </div>
          
          <!-- 版本历史内容 -->
          <div class="p-6">
            <div v-if="isLoading" class="py-6 flex justify-center">
              <div class="flex flex-col items-center">
                <div class="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div>
                <span class="text-gray-600">加载版本历史...</span>
              </div>
            </div>
            <div v-else>
              <QueryVersionsTab 
                :query-id="queryId || ''" 
                :current-version="activeVersionNumber"
                class="rounded-lg border border-gray-200"
              />
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
import type { Query, QueryStatus, QueryVisualization, QueryExecutionPlan, QuerySuggestion, QueryVersion } from '@/types/query'

// 导入组件
import QueryDetailHeader from '@/components/query/detail/QueryDetailHeader.vue'
import QueryDetailTabs from '@/components/query/detail/QueryDetailTabs.vue'
import QueryResults from '@/components/query/QueryResults.vue'
import QueryVersionsTab from '@/components/query/detail/QueryVersionsTab.vue'

const router = useRouter()
const route = useRoute()
const queryStore = useQueryStore()
const dataSourceStore = useDataSourceStore()

// 基础变量
const isLoading = ref(true)
const errorMessage = ref('')
const showExportOptions = ref(false) // 是否显示导出选项

// 加载状态变量
const isLoadingExecutionPlan = ref(false)
const isLoadingSuggestions = ref(false)
const isLoadingResults = ref(false)
const isLoadingVisualization = ref(false)

// 版本信息变量
const activeVersionNumber = ref<number | null>(null)
const activeVersionStatus = ref<string>('DRAFT')
const activeVersionPublishedAt = ref<string>('')
const activeVersionUpdatedAt = ref<string>('')

// 保留以下变量，避免重复声明
// const query = ref<Query | null>(null)
// const queryId = ref<string | null>(null)
// const isError = ref(false)

// 添加之前移除但还在被引用的变量
const activeTab = ref('versions')

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

// 扩展QueryExecutionPlan接口以支持旧版本格式
interface ExtendedExecutionPlan extends QueryExecutionPlan {
  planDetails?: {
    totalCost: number;
    estimatedRows: number;
    steps: Array<{
      type: string;
      table?: string;
      condition?: string;
      cost: number;
      rows: number;
    }>;
  };
}

// 检查执行计划是否有效
const hasValidExecutionPlan = computed(() => {
  if (!executionPlan.value) return false;
  
  const plan = executionPlan.value as ExtendedExecutionPlan;
  
  // 兼容两种可能的执行计划格式
  return (
    // 检查是否有planDetails结构（旧格式）
    (plan.planDetails && 
     typeof plan.planDetails === 'object' && 
     plan.planDetails.steps && 
     Array.isArray(plan.planDetails.steps)) ||
    // 或者检查是否有plan结构（新格式）
    (plan.plan && 
     typeof plan.plan === 'object')
  );
})

// 获取计划步骤数组，兼容不同格式
const planSteps = computed(() => {
  if (!executionPlan.value) return [];
  
  const plan = executionPlan.value as ExtendedExecutionPlan;
  
  // 如果有planDetails格式（旧格式）
  if (plan.planDetails && 
      typeof plan.planDetails === 'object' &&
      plan.planDetails.steps && 
      Array.isArray(plan.planDetails.steps)) {
    return plan.planDetails.steps;
  }
  
  // 如果有plan格式（标准格式）
  if (plan.plan) {
    const planData = plan.plan;
    
    // 提取steps（根据API返回的实际数据结构调整）
    if (planData.steps && Array.isArray(planData.steps)) {
      return planData.steps;
    }
    
    // 如果没有明确的steps字段，尝试将plan自身转换为步骤数组
    if (typeof planData === 'object' && !Array.isArray(planData)) {
      // 将plan对象转换为步骤数组
      const steps = [];
      for (const key in planData) {
        if (typeof planData[key] === 'object') {
          steps.push({
            type: key,
            ...planData[key],
            cost: planData[key].cost || 0,
            rows: planData[key].rows || 0
          });
        }
      }
      return steps;
    }
  }
  
  return []; // 默认返回空数组
})

// 获取计划总成本，兼容不同格式
const planTotalCost = computed(() => {
  if (!executionPlan.value) return 0;
  
  const plan = executionPlan.value as ExtendedExecutionPlan;
  
  // 如果有planDetails格式（旧格式）
  if (plan.planDetails && 
      typeof plan.planDetails === 'object' &&
      plan.planDetails.totalCost !== undefined) {
    return plan.planDetails.totalCost;
  }
  
  // 如果有estimatedCost字段（标准字段）
  if (plan.estimatedCost !== undefined) {
    return plan.estimatedCost;
  }
  
  // 如果有plan格式，尝试从中提取总成本
  if (plan.plan) {
    // 如果plan对象有totalCost字段
    if (plan.plan.totalCost !== undefined) {
      return plan.plan.totalCost;
    }
    
    // 如果没有totalCost字段，尝试累加所有步骤的成本
    return planSteps.value.reduce((total: number, step: any) => total + (step.cost || 0), 0);
  }
  
  return 0; // 默认返回0
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
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    // 加载查询详情
    const result = await queryStore.getQuery(queryId.value);
    
    // 检查是否获取到查询数据
    if (!result || !queryStore.currentQuery) {
      errorMessage.value = '找不到指定ID的查询，该查询可能已被删除或不存在';
      isLoading.value = false;
      console.error(`查询ID ${queryId.value} 不存在`);
      return;
    }
    
    // 加载版本数据
    await loadVersionsData();
    
    // 根据选中的标签页加载其他数据
    await loadTabData(activeTab.value);
    
    // 确保查询内容被正确加载
    if (query.value && !query.value.queryText && result.queryText) {
      // 如果查询结果中有查询文本但store中没有，手动设置
      console.log('设置查询文本:', result.queryText);
      if (queryStore.currentQuery) {
        queryStore.currentQuery.queryText = result.queryText;
      }
    }
    
    isLoading.value = false;
  } catch (error) {
    console.error('Failed to load query data:', error);
    errorMessage.value = error instanceof Error 
      ? `无法加载查询信息: ${error.message}` 
      : '无法加载查询信息，请检查查询ID是否有效';
    isLoading.value = false;
  }
};

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
  } else if (tabId === 'versions') {
    // 加载版本信息
    await loadVersionsData()
  }
}

// 处理标签页变化
const handleTabChange = (tabId: string) => {
  activeTab.value = tabId;
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

// 格式化版本号，确保使用真实版本ID
const formatVersionNumber = (version: QueryVersion | null): string => {
  if (!version) return '无版本';
  return version.versionNumber?.toString() || '1';
};

// 判断版本是否为活跃版本
const isActiveVersion = (version: QueryVersion | null): boolean => {
  if (!version || !activeVersionNumber.value) return false;
  return version.versionNumber === activeVersionNumber.value;
};

// 加载版本相关信息
const loadVersionsData = async () => {
  try {
    if (!queryId.value) return;
    
    // 使用已有的 getQuery 方法获取查询详情
    await queryStore.getQuery(queryId.value);
    
    // 使用当前查询数据，避免访问可能不存在的属性
    if (query.value) {
      console.log('查询详情数据:', query.value);
      
      // 设置版本信息，使用安全的方式访问属性
      activeVersionNumber.value = query.value.currentVersion ? 
        parseInt(query.value.currentVersion.toString()) : null;
      activeVersionStatus.value = query.value.status || 'DRAFT';
      
      // 使用更新时间作为发布时间和更新时间
      const updatedTime = query.value.updatedAt || new Date().toISOString();
      activeVersionPublishedAt.value = updatedTime;
      activeVersionUpdatedAt.value = updatedTime;
      
      console.log('设置版本信息:', {
        version: activeVersionNumber.value,
        status: activeVersionStatus.value,
        updatedAt: activeVersionUpdatedAt.value
      });
    }
  } catch (error) {
    console.error('获取版本数据失败:', error);
  }
};

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
    console.log('正在加载查询执行历史...');
    
    // 实现尚未提供API接口，仅使用模拟数据
    // 在真实环境中，这里应该调用查询服务的API
    
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
const getStatusClass = (status: QueryStatus | undefined) => {
  if (!status) return 'bg-gray-100 text-gray-800'
  
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
const getStatusDisplay = (status: QueryStatus | undefined) => {
  if (!status) return '未知'
  
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

// 添加获取数据源名称的方法
const getDataSourceName = (dataSourceId?: string): string => {
  if (!dataSourceId) return '未指定数据源'
  
  const dataSource = dataSourceStore.dataSources.find(ds => ds.id === dataSourceId)
  return dataSource ? dataSource.name : dataSourceId
}

// 格式化版本状态显示
const formatVersionStatus = (status: string): string => {
  const statusMap: Record<string, string> = {
    'DRAFT': '草稿',
    'PUBLISHED': '已发布',
    'DEPRECATED': '已废弃'
  };
  return statusMap[status] || status;
};

// 格式化日期简短显示
const formatDate = (dateString: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// 添加新版本创建方法
const createNewVersion = () => {
  router.push({
    path: '/query/editor',
    query: { 
      id: queryId.value,
      createVersion: 'true'
    }
  })
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