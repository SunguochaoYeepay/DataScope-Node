<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataSourceList from '@/components/datasource/DataSourceList.vue'
import DataSourceForm from '@/components/datasource/DataSourceForm.vue'
import DataSourceDetail from '@/components/datasource/DataSourceDetail.vue'
import AdvancedSearch from '@/components/datasource/AdvancedSearch.vue'
import SearchResultsView from '@/components/datasource/SearchResultsView.vue'
import type { DataSource, CreateDataSourceParams, ConnectionTestResult } from '@/types/datasource'
import { useDataSourceStore } from '@/stores/datasource'
import { message } from '@/services/message'

// 视图状态
const currentView = ref<'list' | 'detail' | 'form' | 'search' | 'searchResults'>('list')
const isLoading = ref(false)
const selectedDataSource = ref<DataSource | null>(null)
const isEditMode = ref(false)
const searchKeyword = ref('')
const isSearchOpen = ref(false)
const searchResults = ref<any>(null)
const searchParams = ref<any>(null)

// 数据源状态管理
const dataSourceStore = useDataSourceStore()

// 切换到列表视图
const showListView = () => {
  currentView.value = 'list'
  selectedDataSource.value = null
}

// 切换到详情视图
const showDetailView = (dataSource: DataSource) => {
  selectedDataSource.value = dataSource
  currentView.value = 'detail'
}

// 切换到表单视图（新增）
const showAddForm = () => {
  selectedDataSource.value = null
  isEditMode.value = false
  currentView.value = 'form'
}

// 切换到表单视图（编辑）
const showEditForm = (dataSource: DataSource) => {
  selectedDataSource.value = dataSource
  isEditMode.value = true
  currentView.value = 'form'
}

// 显示高级搜索面板
const showAdvancedSearch = () => {
  isSearchOpen.value = true
  currentView.value = 'search'
}

// 关闭高级搜索面板
const closeAdvancedSearch = () => {
  isSearchOpen.value = false
  currentView.value = 'list'
}

// 执行高级搜索
const performAdvancedSearch = async (params: any) => {
  isLoading.value = true
  searchParams.value = params
  
  try {
    searchResults.value = await dataSourceStore.advancedSearch({
      keyword: params.keyword,
      dataSourceIds: params.dataSourceIds,
      entityTypes: params.entityTypes,
      caseSensitive: params.caseSensitive
    })
    
    currentView.value = 'searchResults'
  } catch (error) {
    console.error('搜索失败:', error)
    message.error('搜索失败: ' + (error instanceof Error ? error.message : '未知错误'))
  } finally {
    isLoading.value = false
  }
}

// 查看搜索结果中的表
const handleViewSearchResultTable = (dataSourceId: string, tableName: string) => {
  // 首先获取数据源信息
  const dataSource = dataSourceStore.dataSources.find(ds => ds.id === dataSourceId)
  
  if (dataSource) {
    selectedDataSource.value = dataSource
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
const testDataSourceConnection = async (params: any, callback?: (result: ConnectionTestResult) => void) => {
  try {
    const result = await dataSourceStore.testDataSourceConnection(params)
    
    // 如果传入了回调函数，调用回调
    if (callback) {
      callback(result)
    } else {
      // 没有回调函数时，直接显示结果消息
      if (result.success) {
        message.success('连接成功')
      } else {
        message.error(`连接失败: ${result.message}`)
      }
    }
    
    return result
  } catch (error) {
    console.error('测试连接出错:', error)
    
    const errorResult = {
      success: false,
      message: error instanceof Error ? error.message : '连接测试失败',
    }
    
    // 如果传入了回调函数，调用回调
    if (callback) {
      callback(errorResult)
    } else {
      message.error(`连接失败: ${errorResult.message}`)
    }
    
    return errorResult
  }
}

// 保存数据源
const saveDataSource = async (dataSource: CreateDataSourceParams) => {
  isLoading.value = true
  
  try {
    if (isEditMode.value && selectedDataSource.value) {
      // 编辑现有数据源
      await dataSourceStore.updateDataSource({
        ...dataSource,
        id: selectedDataSource.value.id
      })
      message.success('数据源更新成功')
    } else {
      // 创建新数据源
      await dataSourceStore.createDataSource(dataSource)
      message.success('数据源创建成功')
    }
    
    // 返回到列表视图
    showListView()
    
    // 刷新数据源列表
    await dataSourceStore.fetchDataSources()
    
  } catch (error) {
    console.error('保存数据源失败:', error)
    message.error('保存数据源失败: ' + (error instanceof Error ? error.message : '未知错误'))
  } finally {
    isLoading.value = false
  }
}

// 删除数据源
const deleteDataSource = async (dataSource: DataSource) => {
  isLoading.value = true
  
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
    isLoading.value = false
  }
}

// 刷新数据源列表
const refreshDataSources = async () => {
  await dataSourceStore.fetchDataSources()
}

// 组件挂载
onMounted(async () => {
  isLoading.value = true
  
  try {
    console.log('开始获取数据源列表...')
    await dataSourceStore.fetchDataSources()
    console.log('获取数据源列表完成, 数据源数量:', dataSourceStore.dataSources.length)
    console.log('数据源数据:', dataSourceStore.dataSources)
  } catch (error) {
    console.error('加载数据源列表失败:', error)
    message.error('加载数据源列表失败')
  } finally {
    isLoading.value = false
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
          <template v-else-if="currentView === 'detail' && selectedDataSource">{{ selectedDataSource.name }} - 详情</template>
          <template v-else-if="currentView === 'form'">{{ isEditMode ? '编辑数据源' : '添加数据源' }}</template>
          <template v-else-if="currentView === 'search'">高级搜索</template>
          <template v-else-if="currentView === 'searchResults'">搜索结果</template>
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4">
        <template v-if="currentView === 'list'">
          <button 
            type="button" 
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
            @click="showAdvancedSearch"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            高级搜索
          </button>
          
          <button 
            type="button" 
            class="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
    <div>
      <!-- 列表视图 -->
      <div v-if="currentView === 'list'">
        <DataSourceList 
          :data-sources="dataSourceStore.dataSources"
          :loading="isLoading"
          :show-actions="true"
          @select="showDetailView"
          @edit="showEditForm"
          @delete="deleteDataSource"
          @add="showAddForm"
          @refresh="refreshDataSources"
        />
      </div>
      
      <!-- 详情视图 -->
      <div v-else-if="currentView === 'detail' && selectedDataSource">
        <DataSourceDetail 
          :data-source-id="selectedDataSource.id"
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
          :data-source="selectedDataSource"
          :is-edit="isEditMode"
          @save="saveDataSource"
          @cancel="showListView"
          @test-connection="testDataSourceConnection"
        />
      </div>
      
      <!-- 高级搜索视图 -->
      <div v-else-if="currentView === 'search'">
        <AdvancedSearch
          :initial-keyword="searchKeyword"
          :selected-data-source-id="selectedDataSource?.id"
          @search="performAdvancedSearch"
          @close="closeAdvancedSearch"
        />
      </div>
      
      <!-- 搜索结果视图 -->
      <div v-else-if="currentView === 'searchResults' && searchResults">
        <SearchResultsView
          :results="searchResults"
          :search-params="searchParams"
          @view-table="handleViewSearchResultTable"
          @view-column="handleViewSearchResultTable"
          @new-search="showAdvancedSearch"
        />
      </div>
    </div>
    
    <!-- 加载指示器 -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
    >
      <div class="bg-white p-6 rounded-lg shadow-xl flex items-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mr-3"></div>
        <span class="text-gray-700">加载中...</span>
      </div>
    </div>
  </div>
</template>