<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 标题和操作按钮区域 -->
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="flex-1 min-w-0">
        <div class="flex items-center">
          <input 
            v-model="queryName"
            class="text-2xl font-bold text-gray-900 bg-transparent border-0 focus:ring-0 focus:border-0 p-0"
            placeholder="查询名称"
            type="text"
          />
          <span class="ml-2 text-gray-500">{{ queryVersion }}</span>
        </div>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
        <button
          @click="saveQuery"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-save mr-2"></i>
          保存
        </button>
        <button
          @click="toggleFavorite"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-star mr-2" :class="{ 'text-yellow-400': isFavorite }"></i>
          收藏
        </button>
        <button
          v-if="!isExecuting"
          @click="checkAndExecuteQuery"
          :title="getExecuteButtonTooltip()"
          :class="[
            'inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
            canExecuteQuery ? 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' : 
            'bg-indigo-300 cursor-not-allowed opacity-60'
          ]"
        >
          <i class="fas fa-play mr-2"></i>
          执行
        </button>
        <button
          v-else
          @click="cancelQuery"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 relative"
        >
          <i class="fas fa-stop mr-2"></i>
          取消查询
          <span class="absolute -top-1 -right-1 flex h-3 w-3">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        </button>
      </div>
    </div>

    <!-- 内容区域：左侧数据源面板 + 右侧编辑器 -->
    <div class="grid grid-cols-12 gap-6">
      <!-- 左侧元数据浏览面板 -->
      <div class="col-span-3">
        <div class="bg-white shadow rounded-lg">
          <!-- 数据源选择区域 -->
          <div class="p-4 border-b border-gray-200">
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium text-gray-900">数据源</h3>
              <button 
                @click="refreshMetadata" 
                class="p-1 text-gray-500 hover:text-indigo-600 rounded"
                title="刷新元数据"
              >
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
            <div class="mt-2">
              <div class="relative">
                <select
                  v-model="selectedDataSourceId"
                  class="appearance-none bg-white block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option v-for="ds in dataSourceStore.dataSources" :key="ds.id" :value="ds.id">
                    {{ ds.name }}
                  </option>
                </select>
                <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 标签页头部 -->
          <div class="border-b border-gray-200">
            <nav class="-mb-px flex" aria-label="Tabs">
              <button
                @click="leftPanel = 'metadata'"
                class="w-1/2 py-3 px-1 text-center border-b-2 font-medium text-sm"
                :class="leftPanel === 'metadata' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                表和字段
              </button>
              <button
                @click="leftPanel = 'saved'"
                class="w-1/2 py-3 px-1 text-center border-b-2 font-medium text-sm"
                :class="leftPanel === 'saved' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
              >
                保存的查询
              </button>
            </nav>
          </div>
          
          <!-- 元数据浏览面板 -->
          <div v-if="leftPanel === 'metadata'" class="h-[calc(100vh-24rem)] overflow-y-auto">
            <div class="p-2">
              <!-- 元数据浏览器 -->
              <MetadataExplorer
                v-if="selectedDataSourceId"
                :data-source-id="selectedDataSourceId"
                @table-select="handleTableSelect"
                @column-select="handleColumnSelect"
                @insert-table="insertTableName"
                @insert-column="insertColumnName"
              />
              <div v-else class="p-4 text-center text-gray-500">
                请选择数据源以查看表和字段
              </div>
            </div>
          </div>
          
          <!-- 保存的查询面板 -->
          <div v-else-if="leftPanel === 'saved'" class="h-[calc(100vh-24rem)] overflow-y-auto">
            <div class="p-4 border-b border-gray-200">
              <div class="relative">
                <input
                  type="text"
                  placeholder="搜索查询..."
                  v-model="savedQuerySearch"
                  class="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                />
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fas fa-search text-gray-400"></i>
                </div>
              </div>
            </div>
            
            <!-- 已保存的查询列表 -->
            <div class="divide-y divide-gray-200">
              <div v-if="filteredSavedQueries.length === 0" class="p-4 text-center text-gray-500">
                无保存的查询
              </div>
              <div
                v-for="query in filteredSavedQueries"
                :key="query.id"
                class="p-3 hover:bg-gray-50 cursor-pointer"
                @click="loadSavedQuery(query.id)"
              >
                <div class="flex items-start">
                  <i class="fas fa-file-code mt-1 mr-2 text-gray-400"></i>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ query.name }}
                    </p>
                    <p class="text-xs text-gray-500 truncate">
                      {{ query.queryType === 'SQL' ? 'SQL' : '自然语言' }} · {{ formatDate(query.updatedAt) }}
                    </p>
                  </div>
                  <div class="ml-2 flex-shrink-0">
                    <i 
                      class="fas fa-star" 
                      :class="isQueryFavorite(query.id) ? 'text-yellow-400' : 'text-gray-300'"
                      @click.stop="toggleQueryFavorite(query.id)"
                    ></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 右侧编辑器和结果区域 -->
      <div class="col-span-9 space-y-6">
        <!-- 查询标签页 -->
        <div class="bg-white shadow rounded-lg">
          <div class="border-b border-gray-200">
            <nav aria-label="Tabs" class="-mb-px flex">
              <a
                href="#"
                @click.prevent="activeTab = 'editor'"
                :class="[
                  'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm',
                  activeTab === 'editor'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                SQL 编辑器
              </a>
              <a
                href="#"
                @click.prevent="activeTab = 'nlq'"
                :class="[
                  'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm',
                  activeTab === 'nlq'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                自然语言
              </a>
              <a
                href="#"
                @click.prevent="activeTab = 'builder'"
                :class="[
                  'whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm',
                  activeTab === 'builder'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                ]"
              >
                查询构建器
              </a>
            </nav>
          </div>
          
          <!-- 查询编辑区域 -->
          <div class="p-4">
            <!-- SQL编辑器 -->
            <div v-if="activeTab === 'editor'" class="h-64">
              <SqlEditor 
                v-model="sqlQuery" 
                :data-source-id="selectedDataSourceId" 
                @execute="(errorMsg) => errorMsg ? showError(errorMsg) : executeQuery()" 
                @save="saveQuery" 
              />
            </div>
            
            <!-- 自然语言查询 -->
            <div v-else-if="activeTab === 'nlq'" class="h-full flex flex-col">
              <NaturalLanguageQuery
                v-model="nlQuery"
                :data-source-id="selectedDataSourceId"
                @execute="executeQuery"
                @save="saveQuery"
              />
            </div>
            
            <!-- 查询构建器 -->
            <div v-else-if="activeTab === 'builder'" class="h-full">
              <QueryManager
                ref="queryManagerRef"
                :current-query="builderQuery"
                :can-save="!!selectedDataSourceId && builderQuery.trim().length > 0"
                :query-state="builderState"
                @load="handleLoadQuery"
              />
              <QueryBuilder 
                ref="queryBuilderRef"
                v-model="builderQuery" 
                :data-source-id="selectedDataSourceId" 
                @execute="executeBuilderQuery" 
                @save="saveQuery"
                @update:state="updateBuilderState"
              />
            </div>
          </div>
        </div>
        
        <!-- 仅显示错误消息 -->
        <transition name="fade">
          <div v-if="statusMessage && queryError" 
              class="fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg border-l-4 max-w-md transform transition-all duration-300 bg-red-50 border-red-500 text-red-700"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0 mr-3">
                <div class="w-8 h-8 rounded-full flex items-center justify-center bg-red-100">
                  <i class="fas fa-exclamation-circle text-lg text-red-500"></i>
                </div>
              </div>
              <div class="flex-1">
                <h3 class="text-sm font-semibold pb-0.5 text-red-800">错误提示</h3>
                <p class="text-sm">
                  {{ statusMessage }}
                </p>
              </div>
              <div class="ml-3">
                <button 
                  @click="statusMessage = null" 
                  class="inline-flex rounded-full p-1.5 text-red-500 hover:bg-red-100"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </transition>
        
        <!-- 查询结果区域 -->
        <div v-if="queryStore.hasResult || queryError" class="bg-white shadow rounded-lg">
          <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
            <div class="flex items-center justify-between">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                查询结果
              </h3>
              <div class="flex space-x-3">
                <button
                  v-if="queryStore.hasResult"
                  @click="showExportOptions = !showExportOptions"
                  class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  type="button"
                >
                  <i class="fas fa-download mr-2"></i>
                  导出
                </button>
                
                <!-- 导出选项下拉菜单 -->
                <div v-if="showExportOptions" class="absolute mt-10 right-0 w-48 bg-white shadow-lg rounded-md z-10">
                  <div class="py-1">
                    <a href="#" @click.prevent="exportResults('csv')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">导出为 CSV</a>
                    <a href="#" @click.prevent="exportResults('excel')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">导出为 Excel</a>
                    <a href="#" @click.prevent="exportResults('json')" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">导出为 JSON</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 查询结果内容 -->
          <QueryResults
            :results="queryStore.currentQueryResult"
            :is-loading="isExecuting"
            :error="queryError"
            :query-id="queryStore.currentQuery?.id"
            @export-results="exportResults"
          />
        </div>
      </div>
    </div>
    
    <!-- 保存查询对话框 -->
    <SaveQueryModal
    v-model:visible="isSaveModalVisible"
    :query="{
    id: currentQueryId || '',
    name: queryName || '未命名查询',
    queryText: activeTab === 'editor' ? sqlQuery : (activeTab === 'nlq' ? nlQuery : builderQuery),
    queryType: activeTab === 'builder' || activeTab === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE',
    dataSourceId: selectedDataSourceId
    }"
      :data-sources="dataSourceStore.dataSources"
      @save="handleSaveQuery"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useQueryStore } from '@/stores/query'
import { useDataSourceStore } from '@/stores/datasource'
import { useDark, useToggle } from '@vueuse/core'
import type { Query, SaveQueryParams } from '@/types/query'
import type { QueryBuilderState } from '@/types/builder'
import { message } from 'ant-design-vue'
import type { QueryType } from '@/types/query'

// 导入组件
import MetadataExplorer from '@/components/query/MetadataExplorer.vue'
import SqlEditor from '@/components/query/SqlEditor.vue'
import QueryResults from '@/components/query/QueryResults.vue'
import SaveQueryModal from '@/components/query/SaveQueryModal.vue'
import NaturalLanguageQuery from '@/components/query/NaturalLanguageQuery.vue'
import QueryBuilder from '@/components/query/QueryBuilder.vue'
import QueryManager from '@/components/query/QueryManager.vue'

// 路由
const route = useRoute()

// 暗黑模式
const isDark = useDark()
const toggleDark = useToggle(isDark)

// Store
const queryStore = useQueryStore()
const dataSourceStore = useDataSourceStore()

// 状态
const activeTab = ref<'editor' | 'nlq' | 'builder'>('editor')
const selectedDataSourceId = ref('')
const sqlQuery = ref('')
const nlQuery = ref('')
const builderQuery = ref('')
const isExecuting = ref(false)
const queryError = ref<string | null>(null)
const statusMessage = ref<string | null>(null)
const currentQueryId = ref<string | null>(null)
const isSaveModalVisible = ref(false)
const isLoadingQuery = ref(false)
const queryName = ref('')
const queryVersion = ref('v1.0')
const isFavorite = ref(false)
const showExportOptions = ref(false)
const leftPanel = ref<'metadata' | 'saved'>('metadata')
const savedQuerySearch = ref('')
const executionTime = ref(0)
const executionTimer = ref<number | null>(null)
const builderState = ref<QueryBuilderState>({
  selectedDataSourceId: '',
  tables: [],
  selectedTables: [],
  joins: [],
  fieldSelections: [],
  whereConditions: {
    id: '',
    conditions: [],
    groups: [],
    logicalOperator: 'AND'
  },
  groupByFields: [],
  sortDefinitions: []
})
const queryBuilderRef = ref(null)
const queryManagerRef = ref(null)

// 加载状态
onMounted(async () => {
  // 加载数据源
  if (dataSourceStore.dataSources.length === 0) {
    await dataSourceStore.fetchDataSources()
  }
  
  // 设置默认数据源
  if (dataSourceStore.dataSources.length > 0 && !selectedDataSourceId.value) {
    selectedDataSourceId.value = dataSourceStore.dataSources[0].id
  }
  
  // 检查URL参数是否包含查询ID
  const queryId = route.query.id as string
  if (queryId) {
    await loadQueryById(queryId)
  }
  
  // 加载查询历史和收藏
  await queryStore.fetchQueryHistory()
  await queryStore.getFavorites()
})

// 刷新元数据
const refreshMetadata = async () => {
  if (!selectedDataSourceId.value) return
  
  try {
    // 使用更通用的方式获取元数据
    // 如果dataSourceStore没有直接的refreshMetadata方法，我们可以尝试重新获取数据源信息
    await dataSourceStore.fetchDataSources()
  } catch (error) {
    console.error('刷新元数据失败:', error)
    queryError.value = '刷新元数据失败'
    statusMessage.value = '刷新元数据失败'
    setTimeout(() => {
      statusMessage.value = null
      queryError.value = null
    }, 5000)
  }
}

// 计算属性：选中的数据源
const selectedDataSource = computed(() => {
  return dataSourceStore.dataSources.find(ds => ds.id === selectedDataSourceId.value) || null
})

// 计算属性：是否可以执行查询
const canExecuteQuery = computed(() => {
  if (!selectedDataSourceId.value) {
    return false
  }
  
  if (activeTab.value === 'editor' && (!sqlQuery.value || !sqlQuery.value.trim())) {
    return false
  }
  
  if (activeTab.value === 'nlq' && (!nlQuery.value || !nlQuery.value.trim())) {
    return false
  }
  
  if (activeTab.value === 'builder') {
    // 检查builder状态
    if (!builderState.value.selectedTables || builderState.value.selectedTables.length === 0) {
      return false
    }
  }
  
  return true
})

// 从ID加载查询
const loadQueryById = async (queryId: string) => {
  isLoadingQuery.value = true
  statusMessage.value = '正在加载查询...'
  
  try {
    // 尝试直接获取查询详情
    let query = await queryStore.getQuery(queryId)
    
    // 如果没有通过getQuery获取到，尝试从历史列表中查找
    if (!query) {
      console.log('从direct API未找到查询，尝试从历史列表查找')
      
      // 确保历史列表已加载
      if (queryStore.queryHistory.length === 0) {
        await queryStore.fetchQueryHistory()
      }
      
      // 从历史列表查找
      query = queryStore.queryHistory.find(q => q.id === queryId) || null
      
      if (!query) {
        console.log('从历史列表也未找到查询，尝试获取查询列表')
        
        // 尝试从查询列表查找
        const queries = await queryStore.fetchQueries()
        query = queries.find(q => q.id === queryId) || null
        
        if (!query) {
          throw new Error(`未找到ID为 ${queryId} 的查询`)
        }
      }
    }
    
    console.log('成功加载查询:', query)
    
    // 设置查询详情
    currentQueryId.value = query.id
    selectedDataSourceId.value = query.dataSourceId
    queryName.value = query.name || '未命名查询'
    
    // 检查是否是收藏的查询
    isFavorite.value = queryStore.favorites.some(fav => fav.queryId === queryId)
    
    // 根据查询类型设置对应的查询内容
    if (query.queryType === 'SQL' || !query.queryType) {
      activeTab.value = 'editor'
      sqlQuery.value = query.queryText
    } else if (query.queryType === 'NATURAL_LANGUAGE') {
      activeTab.value = 'nlq'
      nlQuery.value = query.queryText
    }
    
    statusMessage.value = '查询加载成功'
    setTimeout(() => {
      statusMessage.value = null
    }, 3000)
    
    // 如果查询有执行结果，获取结果
    if (query.status === 'COMPLETED' && query.resultCount) {
      // 如果需要，可以通过executeQuery重新执行查询
      // await executeQuery(query.queryType)
    }
  } catch (error) {
    console.error('加载查询失败:', error)
    queryError.value = error instanceof Error ? error.message : '加载查询失败'
    statusMessage.value = '加载查询失败'
    setTimeout(() => {
      statusMessage.value = null
    }, 5000)
  } finally {
    isLoadingQuery.value = false
  }
}

// 执行查询
const executeQuery = async (queryType: QueryType = 'SQL') => {
  if (!selectedDataSourceId.value) {
    message.error('请先选择数据源');
    return;
  }
  
  let queryText = '';
  if (queryType === 'SQL') {
    queryText = sqlQuery.value;
  } else if (queryType === 'NATURAL_LANGUAGE') {
    queryText = nlQuery.value;
  } else {
    queryText = builderQuery.value;
  }
  
  if (!queryText.trim()) {
    message.error('请输入查询语句');
    return;
  }
  
  // 验证SQL语法的基本完整性
  if (queryType === 'SQL') {
    const trimmedSQL = queryText.trim().toLowerCase();
    
    // 检查是否是简单的SELECT *
    if (trimmedSQL === 'select *') {
      message.error('不完整的SQL语句，请指定表名');
      return;
    }
    
    // 检查SELECT * FROM 后是否有表名
    if (trimmedSQL.startsWith('select * from') && trimmedSQL.split(' ').length <= 3) {
      message.error('请在FROM子句后指定表名');
      return;
    }
    
    // 检查SQL语句是否有基本有效性
    if (!trimmedSQL.includes('select') || !trimmedSQL.includes('from')) {
      if (!confirm('您的SQL语句可能不完整或格式不正确。确定要执行吗？')) {
        return;
      }
    }
  }
  
  if (isExecuting.value) return
  
  // 重置错误状态
  queryError.value = null;
  statusMessage.value = null;
  
  // 重置并启动执行时间计时器
  executionTime.value = 0
  if (executionTimer.value) {
    clearInterval(executionTimer.value)
  }
  executionTimer.value = window.setInterval(() => {
    executionTime.value += 1
  }, 1000)
  
  try {
    let result;
    
    // 根据查询类型执行不同的查询
    if (queryType === 'SQL') {
      result = await queryStore.executeQuery({
        dataSourceId: selectedDataSourceId.value,
        queryText: queryText,
        queryType: 'SQL'
      });
    } else {
      result = await queryStore.executeNaturalLanguageQuery({
        dataSourceId: selectedDataSourceId.value,
        question: queryText
      });
    }
    
    // 更新当前查询ID
    currentQueryId.value = queryStore.currentQueryResult?.id || null
  } catch (error) {
    queryError.value = error instanceof Error ? error.message : '执行查询时出错'
    statusMessage.value = '查询执行失败'
    setTimeout(() => {
      statusMessage.value = null
    }, 5000)
  } finally {
    // 清除执行时间计时器
    if (executionTimer.value) {
      clearInterval(executionTimer.value)
      executionTimer.value = null
    }
    isExecuting.value = false
  }
}

// 获取执行按钮提示信息
const getExecuteButtonTooltip = () => {
  if (!selectedDataSourceId.value) {
    return '请在左侧面板中选择一个数据源';
  }
  
  if (activeTab.value === 'editor' && sqlQuery.value.trim().length === 0) {
    return '请在SQL编辑器中输入查询语句';
  } else if (activeTab.value === 'builder' && builderQuery.value.trim().length === 0) {
    return '查询构建器未生成有效的查询语句';
  } else if (activeTab.value === 'nlq' && nlQuery.value.trim().length === 0) {
    return '请在自然语言查询输入框中输入问题';
  }
  
  return '执行查询';
}

// 模拟延时函数
const simulateDelay = (min: number, max: number) => {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// 取消查询
const cancelQuery = async () => {
  if (!isExecuting.value) return
  
  try {
    statusMessage.value = '正在取消查询...'
    
    // 模拟网络延迟
    await simulateDelay(800, 1500)
    
    // 如果有查询ID，尝试通过store取消
    if (currentQueryId.value) {
      await queryStore.cancelQuery(currentQueryId.value)
    }
    
    // 即使没有currentQueryId，也要强制取消当前执行状态
    isExecuting.value = false
    
    // 清除执行时间计时器
    if (executionTimer.value) {
      clearInterval(executionTimer.value)
      executionTimer.value = null
    }
    
    // 更新状态信息
    statusMessage.value = '查询已取消'
    
    // 添加模拟的错误消息
    queryError.value = '查询已被用户取消'
    
    setTimeout(() => {
      statusMessage.value = null
    }, 3000)
  } catch (error) {
    console.error('取消查询失败:', error)
    statusMessage.value = '取消查询失败'
    
    // 即使取消失败，也要强制取消执行状态
    isExecuting.value = false
    
    // 清除执行时间计时器
    if (executionTimer.value) {
      clearInterval(executionTimer.value)
      executionTimer.value = null
    }
    
    setTimeout(() => {
      statusMessage.value = null
    }, 5000)
  }
}

// 切换收藏状态
const toggleFavorite = async () => {
  if (!currentQueryId.value) return
  
  try {
    if (isFavorite.value) {
      await queryStore.unfavoriteQuery(currentQueryId.value)
      statusMessage.value = '已从收藏中移除'
    } else {
      await queryStore.favoriteQuery(currentQueryId.value)
      statusMessage.value = '已添加到收藏'
    }
    isFavorite.value = !isFavorite.value
    setTimeout(() => {
      statusMessage.value = null
    }, 3000)
  } catch (error) {
    console.error('切换收藏状态失败:', error)
    statusMessage.value = '操作失败'
    setTimeout(() => {
      statusMessage.value = null
    }, 5000)
  }
}

// 保存查询
const saveQuery = () => {
  isSaveModalVisible.value = true
}

// 执行构建器查询
const executeBuilderQuery = () => {
  executeQuery()
}

// 处理保存查询
const handleSaveQuery = async (saveData: Partial<Query>) => {
  try {
    statusMessage.value = '正在保存查询...'
    
    // 确保必要的字段存在
    if (!saveData.name || !saveData.dataSourceId || !saveData.queryText || !saveData.queryType) {
      statusMessage.value = '保存查询失败：缺少必要信息'
      setTimeout(() => {
        statusMessage.value = null
      }, 5000)
      return
    }
    
    // 构造符合SaveQueryParams的对象
    const queryData: SaveQueryParams = {
      id: saveData.id,
      name: saveData.name,
      dataSourceId: saveData.dataSourceId,
      queryText: saveData.queryText,
      queryType: saveData.queryType,
      description: saveData.description,
      tags: saveData.tags
    }
    
    // 使用传入的保存数据
    const savedQuery = await queryStore.saveQuery(queryData)
    
    // 更新查询名称和ID
    if (savedQuery) {
      queryName.value = savedQuery.name || ''
      currentQueryId.value = savedQuery.id
      statusMessage.value = '查询保存成功'
    }
    
    setTimeout(() => {
      statusMessage.value = null
    }, 3000)
  } catch (error) {
    console.error('保存查询失败:', error)
    statusMessage.value = '保存查询失败'
    setTimeout(() => {
      statusMessage.value = null
    }, 5000)
  }
}

// 导出查询结果
const exportResults = (format: 'csv' | 'excel' | 'json') => {
  if (!queryStore.currentQueryResult) return
  
  showExportOptions.value = false
  queryStore.exportQueryResults(queryStore.currentQueryResult.id, format)
  statusMessage.value = `正在导出为${format.toUpperCase()}...`
  setTimeout(() => {
    statusMessage.value = null
  }, 3000)
}

// 处理元数据浏览器中的表格选择
const handleTableSelect = (table: any) => {
  console.log('选中表格:', table.name)
}

// 处理元数据浏览器中的列选择
const handleColumnSelect = (column: any, table: any) => {
  console.log('选中列:', column.name, '表格:', table.name)
}

// 向SQL编辑器插入表名
const insertTableName = (tableName: string) => {
  if (activeTab.value !== 'editor') return
  
  sqlQuery.value += ` ${tableName}`
}

// 向SQL编辑器插入列名
const insertColumnName = (columnName: string) => {
  if (activeTab.value !== 'editor') return
  
  sqlQuery.value += ` ${columnName}`
}

// 过滤保存的查询
const filteredSavedQueries = computed(() => {
  const search = savedQuerySearch.value.toLowerCase()
  return queryStore.queryHistory.filter(query => 
    !search || (query.name && query.name.toLowerCase().includes(search))
  )
})

// 格式化日期
const formatDate = (dateString: string | number | Date | undefined) => {
  if (!dateString) return '未知时间'
  const date = new Date(dateString)
  return date.toLocaleDateString()
}

// 检查查询是否在收藏中
const isQueryFavorite = (queryId: string) => {
  return queryStore.favorites.some(fav => fav.queryId === queryId)
}

// 切换查询收藏状态
const toggleQueryFavorite = async (queryId: string) => {
  try {
    if (isQueryFavorite(queryId)) {
      await queryStore.unfavoriteQuery(queryId)
      statusMessage.value = '已从收藏中移除'
    } else {
      await queryStore.favoriteQuery(queryId)
      statusMessage.value = '已添加到收藏'
    }
    setTimeout(() => {
      statusMessage.value = null
    }, 3000)
  } catch (error) {
    console.error('切换收藏状态失败:', error)
    statusMessage.value = '操作失败'
    setTimeout(() => {
      statusMessage.value = null
    }, 5000)
  }
}

// 加载保存的查询
const loadSavedQuery = async (queryId: string) => {
  await loadQueryById(queryId)
}

// 处理查询构建器加载
const handleLoadQuery = (query: { sql: string, state?: QueryBuilderState }) => {
  builderQuery.value = query.sql
  if (query.state && queryBuilderRef.value && 'loadState' in queryBuilderRef.value) {
    // 调用QueryBuilder组件的loadState方法 (如果存在)
    (queryBuilderRef.value as any).loadState(query.state)
  }
}

// 更新查询构建器状态
const updateBuilderState = (state: QueryBuilderState) => {
  builderState.value = state
}

// 计算属性：已格式化的执行时间
const formattedExecutionTime = computed(() => {
  const minutes = Math.floor(executionTime.value / 60)
  const seconds = executionTime.value % 60
  
  if (minutes > 0) {
    return `${minutes}分 ${seconds}秒`
  } else {
    return `${seconds}秒`
  }
})

// 显示错误消息
const showError = (message: string) => {
  queryError.value = message;
  statusMessage.value = message;
  setTimeout(() => {
    statusMessage.value = null;
    queryError.value = null;
  }, 5000);
}

// 检查条件并执行查询
const checkAndExecuteQuery = () => {
  // 检查条件
  if (!canExecuteQuery.value) {
    // 确定错误原因
    if (!selectedDataSourceId.value) {
      showError('请在左侧面板中选择一个数据源');
      return;
    }
    
    if (activeTab.value === 'editor' && !sqlQuery.value.trim()) {
      showError('请在SQL编辑器中输入查询语句');
      return;
    } else if (activeTab.value === 'builder' && !builderQuery.value.trim()) {
      showError('查询构建器未生成有效的查询语句');
      return;
    } else if (activeTab.value === 'nlq' && !nlQuery.value.trim()) {
      showError('请在自然语言查询输入框中输入问题');
      return;
    }
    
    return;
  }
  
  // 如果条件满足，执行查询
  executeQuery();
}
</script>

<style scoped>
.loading-spinner {
  border: 3px solid rgba(156, 163, 175, 0.3);
  border-radius: 50%;
  border-top: 3px solid #6366f1;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 消息渐变动画 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}

/* 调整滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>