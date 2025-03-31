<script setup lang="ts">
import { ref, onMounted, watch, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DataSourceList from '@/components/datasource/DataSourceList.vue'
import DataSourceForm from '@/components/datasource/DataSourceForm.vue'
import DataSourceDetail from '@/components/datasource/DataSourceDetail.vue'
import AdvancedSearch from '@/components/datasource/AdvancedSearch.vue'
import SearchResultsView from '@/components/datasource/SearchResultsView.vue'
import type { DataSource, CreateDataSourceParams, ConnectionTestResult, DataSourceQueryParams, TestConnectionParams } from '@/types/datasource'
import { useDataSourceStore } from '@/stores/datasource'
import { message } from '@/services/message'

// 路由相关
const route = useRoute()
const router = useRouter()

// 视图状态管理
interface ViewState {
  isLoading: boolean
  isSearchOpen: boolean
  searchKeyword: string
  searchResults: {
    tables: Array<{
      dataSourceId: string
      dataSourceName: string
      tables: Array<{
        name: string
        type: string
        schema: string
      }>
    }>
    columns: Array<{
      dataSourceId: string
      dataSourceName: string
      columns: Array<{
        table: string
        column: string
        type: string
      }>
    }>
    views: Array<{
      dataSourceId: string
      dataSourceName: string
      views: Array<{
        name: string
        type: string
        schema: string
      }>
    }>
    total: number
  } | null
  searchParams: {
    keyword: string
    dataSourceIds: string[]
    entityTypes: Array<'table' | 'column' | 'view'>
    useRegex?: boolean
    caseSensitive?: boolean
  }
  selectedDataSource: DataSource | null
}

const viewState = reactive<ViewState>({
  isLoading: false,
  isSearchOpen: false,
  searchKeyword: '',
  searchResults: null,
  searchParams: {
    keyword: '',
    dataSourceIds: [],
    entityTypes: ['table', 'column', 'view']
  },
  selectedDataSource: null
})

// 视图状态
const currentView = ref<'list' | 'detail' | 'form' | 'search' | 'searchResults'>('list')

// 监听路由和搜索状态变化
watch([() => route.name, () => viewState.isSearchOpen, () => viewState.searchResults], () => {
  if (viewState.isSearchOpen) {
    currentView.value = viewState.searchResults ? 'searchResults' : 'search'
    return
  }
  
  switch (route.name) {
    case 'datasource-create':
    case 'datasource-edit':
      currentView.value = 'form'
      break
    case 'datasource-detail':
      currentView.value = 'detail'
      break
    default:
      currentView.value = 'list'
  }
}, { immediate: true })

// 计算编辑模式
const isEditMode = computed(() => route.name === 'datasource-edit')

// 数据源状态管理
const dataSourceStore = useDataSourceStore()

// 导航方法
const showListView = () => router.push({ name: 'datasource-list' })
const showDetailView = (dataSource: DataSource) => router.push({ name: 'datasource-detail', params: { id: dataSource.id } })
const showAddForm = () => router.push({ name: 'datasource-create' })
const showEditForm = (dataSource: DataSource) => router.push({ name: 'datasource-edit', params: { id: dataSource.id } })

// 根据路由参数初始化视图
const initializeView = async () => {
  const { name, params } = route

  switch (name) {
    case 'datasource-create':
      showAddForm()
      break
    case 'datasource-edit':
      if (params.id) {
        const dataSource = await dataSourceStore.getDataSourceById(params.id as string)
        if (dataSource) {
          showEditForm(dataSource)
        } else {
          message.error('未找到数据源')
          router.push({ name: 'datasource-list' })
        }
      }
      break
    case 'datasource-detail':
      if (params.id) {
        const dataSource = await dataSourceStore.getDataSourceById(params.id as string)
        if (dataSource) {
          showDetailView(dataSource)
        } else {
          message.error('未找到数据源')
          router.push({ name: 'datasource-list' })
        }
      }
      break
    default:
      showListView()
  }
}

// 监听路由变化
watch(() => route.name, initializeView, { immediate: true })

// 根据路由获取当前数据源
const getCurrentDataSource = async () => {
  const id = route.params.id as string
  if (id) {
    return await dataSourceStore.getDataSourceById(id)
  }
  return null
}

// 更新选中的数据源
watch(() => route.params.id, async () => {
  viewState.selectedDataSource = await getCurrentDataSource()
}, { immediate: true })

// 显示高级搜索面板
const showAdvancedSearch = () => {
  viewState.isSearchOpen = true
  router.push({ name: 'datasource-search', query: { search: 'advanced' } })
}

// 关闭高级搜索面板
const closeAdvancedSearch = () => {
  viewState.isSearchOpen = false
  router.push({ name: 'datasource-list' })
}

// 执行高级搜索
const performAdvancedSearch = async (params: {
  keyword: string
  dataSourceIds: string[]
  entityTypes: Array<'table' | 'column' | 'view'>
  useRegex?: boolean
  caseSensitive?: boolean
}) => {
  viewState.isLoading = true
  
  try {
    const results = await dataSourceStore.advancedSearch(params)
    viewState.searchResults = results
    viewState.searchParams = {
      keyword: params.keyword,
      dataSourceIds: params.dataSourceIds,
      entityTypes: params.entityTypes,
      useRegex: params.useRegex,
      caseSensitive: params.caseSensitive
    }
  } catch (error) {
    console.error('搜索失败:', error)
    message.error('搜索失败: ' + (error instanceof Error ? error.message : '未知错误'))
    viewState.searchResults = null
    viewState.searchParams = {
      keyword: '',
      dataSourceIds: [],
      entityTypes: ['table', 'column', 'view']
    }
  } finally {
    viewState.isLoading = false
  }
}

// 查看搜索结果中的表
const handleViewSearchResultTable = (dataSourceId: string, tableName: string) => {
  // 首先获取数据源信息
  const dataSource = dataSourceStore.dataSources.find(ds => ds.id === dataSourceId)
  
  if (dataSource) {
    viewState.selectedDataSource = dataSource
    currentView.value = 'detail'
    
    // 这里可以添加逻辑，让详情页面直接定位到指定表并展开
    setTimeout(() => {
      const event = new CustomEvent('view-table', { 
        detail: { tableName } 
      })
      window.dispatchEvent(event)
    }, 100)
  } else {
    message.error('未找到数据源信息')
  }
}

// 同步元数据
const syncDataSourceMetadata = async (dataSource: DataSource) => {
  try {
    await dataSourceStore.syncDataSourceMetadata(dataSource.id)
  } catch (error) {
    console.error('同步元数据失败:', error)
  }
}

// 测试数据源连接
const testDataSourceConnection = async (params: TestConnectionParams, callback: (success: boolean) => void): Promise<void> => {
  try {
    // 构造符合 TestConnectionParams 的参数
    const testParams: TestConnectionParams = {
      id: params.id, // 确保保留id参数
      type: params.type,
      host: params.host,
      port: params.port,
      database: params.database || params.databaseName, // 兼容两种参数名
      username: params.username,
      password: params.password || '',
      connectionParams: params.connectionParams || {}
    }

    const result = await dataSourceStore.testDataSourceConnection(testParams)
    console.log('测试连接响应:', result)
    
    // 调用回调函数
    callback(result.success)
  } catch (error) {
    console.error('测试连接出错:', error)
    // 发生错误时也要调用回调函数
    callback(false)
  }
}

// 保存数据源
const saveDataSource = async (dataSource: CreateDataSourceParams) => {
  viewState.isLoading = true
  
  try {
    if (isEditMode.value && viewState.selectedDataSource) {
      // 编辑现有数据源
      await dataSourceStore.updateDataSource({
        ...dataSource,
        id: viewState.selectedDataSource.id
      })
    } else {
      // 创建新数据源
      await dataSourceStore.createDataSource(dataSource)
    }
    
    // 返回到列表视图
    showListView()
    
    // 刷新数据源列表
    await dataSourceStore.fetchDataSources()
    
  } catch (error) {
    console.error('保存数据源失败:', error)
    message.error('保存数据源失败: ' + (error instanceof Error ? error.message : '未知错误'))
  } finally {
    viewState.isLoading = false
  }
}

// 删除数据源
const deleteDataSource = async (dataSource: DataSource) => {
  viewState.isLoading = true
  
  try {
    await dataSourceStore.deleteDataSource(dataSource.id)
    message.success('数据源删除成功')
    
    // 返回到列表视图
    showListView()
    
    // 刷新数据源列表
    await dataSourceStore.fetchDataSources()
    
  } catch (error) {
    console.error('删除数据源失败:', error)
    message.error('删除数据源失败: ' + (error instanceof Error ? error.message : '未知错误'))
  } finally {
    viewState.isLoading = false
  }
}

// 刷新数据源列表
const refreshDataSources = async () => {
  await dataSourceStore.fetchDataSources()
}

// 组件挂载
onMounted(async () => {
  viewState.isLoading = true
  try {
    await dataSourceStore.fetchDataSources()
    await initializeView()
  } catch (error) {
    console.error('加载数据源列表失败:', error)
    message.error('加载数据源列表失败')
  } finally {
    viewState.isLoading = false
  }
})
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 页面标题和操作按钮 -->
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          <template v-if="currentView === 'list'">数据源管理</template>
          <template v-else-if="currentView === 'detail' && viewState.selectedDataSource">{{ viewState.selectedDataSource.name }} - 详情</template>
          <template v-else-if="currentView === 'form'">{{ isEditMode ? '编辑数据源' : '添加数据源' }}</template>
          <template v-else-if="currentView === 'search'">高级搜索</template>
          <template v-else-if="currentView === 'searchResults'">搜索结果</template>
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <template v-if="currentView === 'list'">
          <button 
            type="button" 
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="showAddForm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            添加数据源
          </button>
        </template>
        
        <template v-else>
          <button 
            type="button" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="showListView"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回列表
          </button>
        </template>
      </div>
    </div>
    
    <!-- 主要内容区域 -->
    <div class="bg-white shadow rounded-lg">
      <!-- 列表视图 -->
      <template v-if="currentView === 'list'">
        <DataSourceList
          :dataSources="dataSourceStore.dataSources"
          :loading="viewState.isLoading"
          :showActions="true"
          @refresh="refreshDataSources"
          @edit="showEditForm"
          @delete="deleteDataSource"
          @view="showDetailView"
          @select="showDetailView"
          @add="showAddForm"
          @test-connection="testDataSourceConnection"
          @sync-metadata="syncDataSourceMetadata"
        />
      </template>
      
      <!-- 详情视图 -->
      <div v-else-if="currentView === 'detail' && viewState.selectedDataSource">
        <DataSourceDetail 
          :data-source-id="viewState.selectedDataSource.id"
          @edit="showEditForm"
          @delete="deleteDataSource"
          @refresh="refreshDataSources"
          @test-connection="testDataSourceConnection"
          @sync-metadata="syncDataSourceMetadata"
        />
      </div>
      
      <!-- 表单视图 -->
      <div v-else-if="currentView === 'form'">
        <DataSourceForm
          :data-source="viewState.selectedDataSource"
          :is-edit="isEditMode"
          @save="saveDataSource"
          @cancel="showListView"
          @test-connection="testDataSourceConnection"
        />
      </div>
      
      <!-- 高级搜索视图 -->
      <div v-else-if="currentView === 'search'">
        <AdvancedSearch
          :initial-keyword="viewState.searchKeyword"
          :selected-data-source-id="viewState.selectedDataSource?.id"
          @search="performAdvancedSearch"
          @close="closeAdvancedSearch"
        />
      </div>
      
      <!-- 搜索结果视图 -->
      <div v-else-if="currentView === 'searchResults' && viewState.searchResults">
        <SearchResultsView
          :results="viewState.searchResults"
          :search-params="viewState.searchParams"
          :is-loading="viewState.isLoading"
          @back="closeAdvancedSearch"
          @retry="performAdvancedSearch(viewState.searchParams)"
        />
      </div>
    </div>
    
    <!-- 加载指示器 -->
    <div
      v-if="viewState.isLoading"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl flex items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
        <span class="text-gray-700">加载中...</span>
      </div>
    </div>
  </div>
</template>