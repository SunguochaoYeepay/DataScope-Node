<script setup lang="ts">
import { ref, computed } from 'vue'

// 组件属性
const props = defineProps<{
  results: {
    tables: { 
      dataSourceId: string, 
      dataSourceName: string, 
      tables: { name: string, type: string, schema: string }[] 
    }[],
    columns: { 
      dataSourceId: string, 
      dataSourceName: string, 
      columns: { table: string, column: string, type: string }[] 
    }[],
    views: {
      dataSourceId: string,
      dataSourceName: string,
      views: { name: string, schema: string }[]
    }[],
    total: number
  },
  searchParams: {
    keyword: string,
    dataSourceIds: string[],
    entityTypes: ('table' | 'column' | 'view')[],
    useRegex?: boolean,
    caseSensitive?: boolean
  }
}>()

// 组件事件
const emit = defineEmits<{
  (e: 'viewTable', dataSourceId: string, tableName: string): void
  (e: 'viewColumn', dataSourceId: string, tableName: string, columnName: string): void
  (e: 'newSearch'): void
  (e: 'exportResults'): void
}>()

// 活动标签页
const activeTab = ref<'all' | 'tables' | 'columns' | 'views'>('all')

// 计算总表数
const totalTables = computed(() => {
  return props.results.tables.reduce((sum, ds) => sum + ds.tables.length, 0)
})

// 计算总列数
const totalColumns = computed(() => {
  return props.results.columns.reduce((sum, ds) => sum + ds.columns.length, 0)
})

// 计算总视图数
const totalViews = computed(() => {
  return props.results.views.reduce((sum, ds) => sum + ds.views.length, 0)
})

// 分页状态
const tablePagination = ref({
  page: 1,
  size: 10
})

const columnPagination = ref({
  page: 1,
  size: 10
})

const viewPagination = ref({
  page: 1,
  size: 10
})

// 计算表格总页数
const tablePages = computed(() => {
  return Math.ceil(totalTables.value / tablePagination.value.size)
})

// 计算列总页数
const columnPages = computed(() => {
  return Math.ceil(totalColumns.value / columnPagination.value.size)
})

// 计算视图总页数
const viewPages = computed(() => {
  return Math.ceil(totalViews.value / viewPagination.value.size)
})

// 详细统计信息
const dataSourceStats = computed(() => {
  const stats = {
    totalDataSources: 0,
    dataSourcesWithTables: 0,
    dataSourcesWithColumns: 0,
    dataSourcesWithViews: 0,
    avgTablesPerDataSource: 0,
    avgColumnsPerDataSource: 0,
    avgViewsPerDataSource: 0
  }
  
  stats.totalDataSources = new Set([
    ...props.results.tables.map(ds => ds.dataSourceId),
    ...props.results.columns.map(ds => ds.dataSourceId),
    ...props.results.views.map(ds => ds.dataSourceId)
  ]).size
  
  stats.dataSourcesWithTables = props.results.tables.length
  stats.dataSourcesWithColumns = props.results.columns.length
  stats.dataSourcesWithViews = props.results.views.length
  
  stats.avgTablesPerDataSource = stats.dataSourcesWithTables ? 
    Math.round(totalTables.value / stats.dataSourcesWithTables * 10) / 10 : 0
    
  stats.avgColumnsPerDataSource = stats.dataSourcesWithColumns ? 
    Math.round(totalColumns.value / stats.dataSourcesWithColumns * 10) / 10 : 0
    
  stats.avgViewsPerDataSource = stats.dataSourcesWithViews ? 
    Math.round(totalViews.value / stats.dataSourcesWithViews * 10) / 10 : 0
    
  return stats
})

// 分页表数据
const paginatedTables = computed(() => {
  return props.results.tables.map(dsTable => {
    const start = (tablePagination.value.page - 1) * tablePagination.value.size
    const end = start + tablePagination.value.size
    return {
      ...dsTable,
      tables: dsTable.tables.slice(start, end)
    }
  }).filter(dsTable => dsTable.tables.length > 0)
})

// 分页列数据
const paginatedColumns = computed(() => {
  return props.results.columns.map(dsColumn => {
    const start = (columnPagination.value.page - 1) * columnPagination.value.size
    const end = start + columnPagination.value.size
    return {
      ...dsColumn,
      columns: dsColumn.columns.slice(start, end)
    }
  }).filter(dsColumn => dsColumn.columns.length > 0)
})

// 分页视图数据
const paginatedViews = computed(() => {
  return props.results.views.map(dsView => {
    const start = (viewPagination.value.page - 1) * viewPagination.value.size
    const end = start + viewPagination.value.size
    return {
      ...dsView,
      views: dsView.views.slice(start, end)
    }
  }).filter(dsView => dsView.views.length > 0)
})

// 处理表分页
const handleTablePageChange = (page: number): void => {
  tablePagination.value.page = page
}

// 处理列分页
const handleColumnPageChange = (page: number): void => {
  columnPagination.value.page = page
}

// 处理视图分页
const handleViewPageChange = (page: number): void => {
  viewPagination.value.page = page
}

// 导出搜索结果
const exportResults = (): void => {
  emit('exportResults')
}

// 组装CSV内容并导出
const exportToCsv = (): void => {
  try {
    let csvContent = 'data:text/csv;charset=utf-8,'
    
    // 添加标题
    csvContent += `"搜索结果: ${props.searchParams.keyword}"\n\n`
    
    // 添加表格数据
    if (totalTables.value > 0) {
      csvContent += `"表 (${totalTables.value})"\n`
      csvContent += '"数据源","表名","架构","类型"\n'
      
      props.results.tables.forEach(dsTable => {
        dsTable.tables.forEach(table => {
          csvContent += `"${dsTable.dataSourceName}","${table.name}","${table.schema}","${table.type}"\n`
        })
      })
      
      csvContent += '\n'
    }
    
    // 添加列数据
    if (totalColumns.value > 0) {
      csvContent += `"列 (${totalColumns.value})"\n`
      csvContent += '"数据源","表名","列名","数据类型"\n'
      
      props.results.columns.forEach(dsColumn => {
        dsColumn.columns.forEach(column => {
          csvContent += `"${dsColumn.dataSourceName}","${column.table}","${column.column}","${column.type}"\n`
        })
      })
      
      csvContent += '\n'
    }
    
    // 添加视图数据
    if (totalViews.value > 0) {
      csvContent += `"视图 (${totalViews.value})"\n`
      csvContent += '"数据源","视图名","架构"\n'
      
      props.results.views.forEach(dsView => {
        dsView.views.forEach(view => {
          csvContent += `"${dsView.dataSourceName}","${view.name}","${view.schema}"\n`
        })
      })
    }
    
    // 创建下载链接
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `search_results_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  } catch (error) {
    console.error('Failed to export results:', error)
  }
}

// 查看表
const handleViewTable = (dataSourceId: string, tableName: string): void => {
  emit('viewTable', dataSourceId, tableName)
}

// 查看列
const handleViewColumn = (dataSourceId: string, tableName: string, columnName: string): void => {
  emit('viewColumn', dataSourceId, tableName, columnName)
}

// 新搜索
const handleNewSearch = (): void => {
  emit('newSearch')
}
</script>

<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden">
    <!-- 搜索结果标题 -->
    <div class="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
      <div class="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h3 class="text-lg font-medium text-indigo-800">
            搜索结果: "{{ searchParams.keyword }}"
            <span v-if="searchParams.useRegex" class="text-sm text-indigo-600 ml-2">(正则表达式)</span>
            <span v-if="searchParams.caseSensitive" class="text-sm text-indigo-600 ml-2">(区分大小写)</span>
          </h3>
          <p class="mt-1 text-sm text-gray-600">
            共找到 <span class="font-medium">{{ results.total }}</span> 个匹配项
          </p>
        </div>
        <div class="mt-3 md:mt-0 flex space-x-2">
          <button
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="exportToCsv"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            导出
          </button>
          
          <button
            class="inline-flex items-center px-3 py-1.5 border border-indigo-500 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="handleNewSearch"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            新搜索
          </button>
        </div>
      </div>
    </div>
    
    <!-- 统计信息摘要 -->
    <div v-if="results.total > 0" class="p-4 bg-gray-50 border-b border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="bg-white p-3 rounded-md shadow-sm">
          <div class="text-sm font-medium text-gray-500">表</div>
          <div class="text-2xl font-semibold text-indigo-600">{{ totalTables }}</div>
          <div class="text-xs text-gray-500">在 {{ dataSourceStats.dataSourcesWithTables }} 个数据源中找到</div>
        </div>
        
        <div class="bg-white p-3 rounded-md shadow-sm">
          <div class="text-sm font-medium text-gray-500">列</div>
          <div class="text-2xl font-semibold text-indigo-600">{{ totalColumns }}</div>
          <div class="text-xs text-gray-500">在 {{ dataSourceStats.dataSourcesWithColumns }} 个数据源中找到</div>
        </div>
        
        <div class="bg-white p-3 rounded-md shadow-sm">
          <div class="text-sm font-medium text-gray-500">视图</div>
          <div class="text-2xl font-semibold text-indigo-600">{{ totalViews }}</div>
          <div class="text-xs text-gray-500">在 {{ dataSourceStats.dataSourcesWithViews }} 个数据源中找到</div>
        </div>
      </div>
    </div>
    
    <!-- 空结果状态 -->
    <div v-if="results.total === 0" class="py-12 flex flex-col items-center justify-center px-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      <h3 class="text-lg font-medium text-gray-900">无搜索结果</h3>
      <p class="mt-1 text-sm text-gray-500 text-center max-w-md">
        未找到与"{{ searchParams.keyword }}"匹配的数据库对象。请尝试使用不同的关键词或搜索条件。
      </p>
    </div>
    
    <!-- 标签页导航 -->
    <div v-else class="border-b border-gray-200">
      <nav class="flex -mb-px">
        <button
          class="py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap"
          :class="activeTab === 'all' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          @click="activeTab = 'all'"
        >
          全部 ({{ results.total }})
        </button>
        <button
          v-if="totalTables > 0"
          class="py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap"
          :class="activeTab === 'tables' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          @click="activeTab = 'tables'"
        >
          表 ({{ totalTables }})
        </button>
        <button
          v-if="totalColumns > 0"
          class="py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap"
          :class="activeTab === 'columns' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          @click="activeTab = 'columns'"
        >
          列 ({{ totalColumns }})
        </button>
        <button
          v-if="totalViews > 0"
          class="py-4 px-6 text-sm font-medium border-b-2 whitespace-nowrap"
          :class="activeTab === 'views' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          @click="activeTab = 'views'"
        >
          视图 ({{ totalViews }})
        </button>
      </nav>
    </div>
    
    <!-- 搜索结果内容 -->
    <div v-if="results.total > 0" class="p-6">
      <!-- 表结果 -->
      <div v-if="(activeTab === 'all' || activeTab === 'tables') && totalTables > 0" class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h4 v-if="activeTab === 'all'" class="text-lg font-medium text-gray-900">表</h4>
          <div class="flex items-center" v-if="tablePages > 1">
            <span class="text-sm text-gray-500 mr-2">页码:</span>
            <div class="flex space-x-1">
              <button
                v-for="page in tablePages"
                :key="page"
                class="px-3 py-1 text-sm border rounded-md"
                :class="page === tablePagination.page ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
                @click="handleTablePageChange(page)"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-for="dsTable in paginatedTables" :key="dsTable.dataSourceId" class="mb-6">
          <h5 class="text-md font-medium text-gray-700 mb-2 flex items-center">
            <span
              class="inline-block h-3 w-3 rounded-full bg-green-400 mr-2"
              title="数据源在线"
            ></span>
            {{ dsTable.dataSourceName }}
          </h5>
          
          <div class="bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    表名
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    架构
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    类型
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="table in dsTable.tables" :key="`${dsTable.dataSourceId}-${table.name}`" class="hover:bg-gray-50">
                  <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ table.name }}
                  </td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    {{ table.schema }}
                  </td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    {{ table.type }}
                  </td>
                  <td class="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      class="text-indigo-600 hover:text-indigo-900"
                      @click="handleViewTable(dsTable.dataSourceId, table.name)"
                    >
                      查看
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- 列结果 -->
      <div v-if="(activeTab === 'all' || activeTab === 'columns') && totalColumns > 0" class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h4 v-if="activeTab === 'all'" class="text-lg font-medium text-gray-900">列</h4>
          <div class="flex items-center" v-if="columnPages > 1">
            <span class="text-sm text-gray-500 mr-2">页码:</span>
            <div class="flex space-x-1">
              <button
                v-for="page in columnPages"
                :key="page"
                class="px-3 py-1 text-sm border rounded-md"
                :class="page === columnPagination.page ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
                @click="handleColumnPageChange(page)"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-for="dsColumn in paginatedColumns" :key="dsColumn.dataSourceId" class="mb-6">
          <h5 class="text-md font-medium text-gray-700 mb-2 flex items-center">
            <span
              class="inline-block h-3 w-3 rounded-full bg-green-400 mr-2"
              title="数据源在线"
            ></span>
            {{ dsColumn.dataSourceName }}
          </h5>
          
          <div class="bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    表名
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    列名
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    数据类型
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr 
                  v-for="column in dsColumn.columns" 
                  :key="`${dsColumn.dataSourceId}-${column.table}-${column.column}`" 
                  class="hover:bg-gray-50"
                >
                  <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    {{ column.table }}
                  </td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ column.column }}
                  </td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    {{ column.type }}
                  </td>
                  <td class="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      class="text-indigo-600 hover:text-indigo-900"
                      @click="handleViewColumn(dsColumn.dataSourceId, column.table, column.column)"
                    >
                      查看
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- 视图结果 -->
      <div v-if="(activeTab === 'all' || activeTab === 'views') && totalViews > 0" class="mb-8">
        <div class="flex justify-between items-center mb-4">
          <h4 v-if="activeTab === 'all'" class="text-lg font-medium text-gray-900">视图</h4>
          <div class="flex items-center" v-if="viewPages > 1">
            <span class="text-sm text-gray-500 mr-2">页码:</span>
            <div class="flex space-x-1">
              <button
                v-for="page in viewPages"
                :key="page"
                class="px-3 py-1 text-sm border rounded-md"
                :class="page === viewPagination.page ? 'bg-indigo-100 border-indigo-300 text-indigo-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'"
                @click="handleViewPageChange(page)"
              >
                {{ page }}
              </button>
            </div>
          </div>
        </div>
        
        <div v-for="dsView in paginatedViews" :key="dsView.dataSourceId" class="mb-6">
          <h5 class="text-md font-medium text-gray-700 mb-2 flex items-center">
            <span
              class="inline-block h-3 w-3 rounded-full bg-green-400 mr-2"
              title="数据源在线"
            ></span>
            {{ dsView.dataSourceName }}
          </h5>
          
          <div class="bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-100">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    视图名
                  </th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    架构
                  </th>
                  <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="view in dsView.views" :key="`${dsView.dataSourceId}-${view.name}`" class="hover:bg-gray-50">
                  <td class="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ view.name }}
                  </td>
                  <td class="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                    {{ view.schema }}
                  </td>
                  <td class="px-6 py-3 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      class="text-indigo-600 hover:text-indigo-900"
                      @click="handleViewTable(dsView.dataSourceId, view.name)"
                    >
                      查看
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>