<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useDataSourceStore } from '@/stores/datasource'
import { message } from '@/services/message'

// 组件属性
const props = defineProps<{
  dataSourceId: string
  tableName: string
  initialPageSize?: number
}>()

// 数据源存储
const dataSourceStore = useDataSourceStore()

// 数据预览状态
const isLoading = ref(false)
const tableData = ref<any[]>([])
const columns = ref<{ name: string, type: string }[]>([])
const pagination = ref({
  page: 1,
  size: props.initialPageSize || 10,
  total: 0,
  totalPages: 0
})
const sortConfig = ref<{ field: string, order: 'asc' | 'desc' } | null>(null)
const filters = ref<Record<string, any>>({})
const showFilterPanel = ref(false)
const activeFilter = ref<string | null>(null)
const filterValues = ref<Record<string, any>>({})
const currentStats = ref<{
  uniqueValues: number,
  nullValues: number,
  minValue?: any,
  maxValue?: any
} | null>(null)

// 加载表数据
const loadTableData = async () => {
  if (!props.dataSourceId || !props.tableName) return
  
  console.log('开始加载表数据预览', {
    dataSourceId: props.dataSourceId,
    tableName: props.tableName,
    page: pagination.value.page,
    size: pagination.value.size,
    sort: sortConfig.value?.field,
    order: sortConfig.value?.order,
    filters: filters.value
  });
  
  isLoading.value = true
  
  try {
    const result = await dataSourceStore.getTableDataPreview(
      props.dataSourceId,
      props.tableName,
      {
        page: pagination.value.page,
        size: pagination.value.size,
        sort: sortConfig.value?.field,
        order: sortConfig.value?.order,
        filters: filters.value
      }
    )
    
    console.log('表数据预览结果:', result);
    
    // 处理返回的数据
    if (result) {
      tableData.value = Array.isArray(result.data) ? result.data : [];
      
      // 处理列信息
      if (Array.isArray(result.columns)) {
        columns.value = result.columns.map(col => {
          // 确保每一列都有正确的name和type属性
          const colAny = col as any; // 将列转为any类型以处理任意属性
          return {
            name: colAny.name || colAny.Field || 'unknown',
            type: colAny.type || colAny.Type || 'VARCHAR'
          };
        });
      } else {
        columns.value = [];
      }
      
      // 更新分页信息
      pagination.value = {
        page: result.page || pagination.value.page,
        size: result.size || pagination.value.size,
        total: result.total || 0,
        totalPages: result.totalPages || 0
      }
    } else {
      // 如果结果为null或undefined
      tableData.value = [];
      columns.value = [];
    }
    
    console.log('表数据已加载', {
      rows: tableData.value.length,
      columns: columns.value.length,
      pagination: pagination.value
    });
  } catch (error) {
    console.error('加载表数据预览失败:', error)
    message.error('加载表数据预览失败: ' + (error instanceof Error ? error.message : String(error)))
    tableData.value = []
    columns.value = []
  } finally {
    isLoading.value = false
  }
}

// 处理页码变化
const handlePageChange = (page: number) => {
  pagination.value.page = page
  loadTableData()
}

// 处理排序
const handleSort = (columnName: string) => {
  if (!sortConfig.value || sortConfig.value.field !== columnName) {
    sortConfig.value = { field: columnName, order: 'asc' }
  } else if (sortConfig.value.order === 'asc') {
    sortConfig.value = { field: columnName, order: 'desc' }
  } else {
    sortConfig.value = null
  }
  
  loadTableData()
}

// 显示过滤面板
const showFilter = (columnName: string) => {
  activeFilter.value = columnName
  showFilterPanel.value = true
  
  // 加载列统计信息
  calculateColumnStats(columnName)
}

// 计算列统计信息
const calculateColumnStats = (columnName: string) => {
  if (!tableData.value.length) {
    currentStats.value = {
      uniqueValues: 0,
      nullValues: 0
    }
    return
  }
  
  // 获取列数据
  const values = tableData.value.map(row => row[columnName])
  
  // 计算唯一值数量
  const uniqueValues = new Set(values.filter(v => v !== null && v !== undefined)).size
  
  // 计算空值数量
  const nullValues = values.filter(v => v === null || v === undefined).length
  
  // 计算最小和最大值（对于数值型数据）
  const columnType = columns.value.find(c => c.name === columnName)?.type || ''
  const simpleType = getSimpleType(columnType)
  
  let minValue, maxValue
  
  if (simpleType === 'number') {
    const numValues = values.filter(v => v !== null && v !== undefined && !isNaN(Number(v))).map(Number)
    minValue = numValues.length ? Math.min(...numValues) : undefined
    maxValue = numValues.length ? Math.max(...numValues) : undefined
  } else if (simpleType === 'datetime') {
    const dateValues = values.filter(v => v !== null && v !== undefined).map(v => new Date(v))
    minValue = dateValues.length ? new Date(Math.min(...dateValues.map(d => d.getTime()))).toLocaleString() : undefined
    maxValue = dateValues.length ? new Date(Math.max(...dateValues.map(d => d.getTime()))).toLocaleString() : undefined
  }
  
  currentStats.value = {
    uniqueValues,
    nullValues,
    minValue,
    maxValue
  }
}

// 关闭过滤面板
const closeFilterPanel = () => {
  showFilterPanel.value = false
  activeFilter.value = null
  currentStats.value = null
}

// 应用过滤
const applyFilter = () => {
  if (activeFilter.value && filterValues.value[activeFilter.value]) {
    filters.value[activeFilter.value] = filterValues.value[activeFilter.value]
  }
  
  closeFilterPanel()
  pagination.value.page = 1
  loadTableData()
}

// 清除当前过滤
const clearCurrentFilter = () => {
  if (activeFilter.value) {
    delete filters.value[activeFilter.value]
    delete filterValues.value[activeFilter.value]
  }
  
  closeFilterPanel()
  pagination.value.page = 1
  loadTableData()
}

// 清除所有过滤器
const clearAllFilters = () => {
  filters.value = {}
  filterValues.value = {}
  pagination.value.page = 1
  loadTableData()
}

// 导出当前数据为CSV
const exportToCSV = () => {
  try {
    // 获取列名
    const header = columns.value.map(column => column.name).join(',')
    
    // 获取数据行
    const rows = tableData.value.map(row => {
      return columns.value.map(column => {
        const value = row[column.name]
        if (value === null || value === undefined) {
          return ''
        }
        // 处理包含逗号的字段，添加引号
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value.replace(/"/g, '""')}"`
        }
        return value
      }).join(',')
    })
    
    // 组合CSV内容
    const csvContent = [header, ...rows].join('\n')
    
    // 创建Blob对象
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    
    // 创建下载链接并触发下载
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${props.tableName}_data.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    message.success('数据已成功导出为CSV文件')
  } catch (error) {
    console.error('Failed to export data:', error)
    message.error('导出数据失败: ' + (error instanceof Error ? error.message : String(error)))
  }
}

// 监听属性变化
watch(
  () => [props.dataSourceId, props.tableName],
  () => {
    pagination.value.page = 1
    sortConfig.value = null
    filters.value = {}
    filterValues.value = {}
    loadTableData()
  }
)

// 组件挂载
onMounted(() => {
  console.log('TableDataPreview组件已挂载，准备加载数据', {
    dataSourceId: props.dataSourceId,
    tableName: props.tableName
  });
  loadTableData()
})

// 格式化字段值显示
const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '<null>'
  }
  
  if (typeof value === 'object') {
    if (value instanceof Date) {
      return value.toLocaleString()
    }
    return JSON.stringify(value)
  }
  
  if (typeof value === 'boolean') {
    return value ? 'true' : 'false'
  }
  
  return String(value)
}

// 处理列类型，返回简化的类型
const getSimpleType = (columnType: string): string => {
  columnType = columnType.toLowerCase()
  
  if (columnType.includes('int') || columnType.includes('float') || columnType.includes('double') || 
      columnType.includes('decimal') || columnType.includes('numeric')) {
    return 'number'
  } else if (columnType.includes('date') || columnType.includes('time')) {
    return 'datetime'
  } else if (columnType.includes('boolean') || columnType.includes('bool')) {
    return 'boolean'
  } else {
    return 'string'
  }
}

// 获取排序图标类
const getSortIconClass = (columnName: string) => {
  if (!sortConfig.value || sortConfig.value.field !== columnName) {
    return 'text-gray-400'
  }
  
  return sortConfig.value.order === 'asc' ? 'text-blue-500' : 'text-blue-700'
}

// 检查列是否有过滤器
const hasFilter = (columnName: string) => {
  return !!filters.value[columnName]
}

// 获取当前已应用的过滤器数量
const activeFiltersCount = computed(() => {
  return Object.keys(filters.value).length
})
</script>

<template>
  <div class="overflow-hidden bg-white shadow sm:rounded-lg">
    <!-- 标题和搜索 -->
    <div class="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
      <div>
        <h3 class="text-lg font-medium leading-6 text-gray-900">{{ tableName }} 数据预览</h3>
        <p class="mt-1 max-w-2xl text-sm text-gray-500">显示前 {{ pagination.total }} 条记录</p>
      </div>
      
      <div class="flex items-center space-x-4">
        <!-- 过滤器指示器 -->
        <div v-if="activeFiltersCount > 0" class="mr-2">
          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            已过滤: {{ activeFiltersCount }}
            <button 
              class="ml-1.5 text-blue-500 hover:text-blue-700" 
              @click="clearAllFilters"
              title="清除所有过滤器"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </span>
        </div>
        
        <!-- 导出按钮 -->
        <button
          class="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
          @click="exportToCSV"
          title="导出为CSV"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </button>
        
        <!-- 刷新按钮 -->
        <button
          class="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
          @click="loadTableData"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
        
        <!-- 每页条数选择 -->
        <div class="flex items-center">
          <span class="text-sm text-gray-500 mr-2">每页显示:</span>
          <select
            v-model="pagination.size"
            class="form-select text-sm border border-gray-300 rounded py-1 pl-2 pr-8"
            @change="pagination.page = 1; loadTableData()"
          >
            <option :value="5">5</option>
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
        </div>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- 无数据显示 -->
    <div v-else-if="!tableData.length" class="py-12 flex flex-col items-center justify-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <p class="text-gray-500 text-lg">无数据可显示</p>
    </div>
    
    <!-- 数据表格 -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.name"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              <div class="flex items-center group">
                <button
                  class="flex-1 flex items-center cursor-pointer hover:text-gray-700"
                  @click="handleSort(column.name)"
                >
                  <span>{{ column.name }}</span>
                  <span class="ml-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-4 w-4"
                      :class="getSortIconClass(column.name)"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </span>
                </button>
                
                <!-- 过滤按钮 -->
                <button
                  class="ml-2 p-1 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  @click.stop="showFilter(column.name)"
                  :class="{ 'text-indigo-600 opacity-100': hasFilter(column.name) }"
                  title="过滤"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                </button>
              </div>
              <div class="text-xs text-gray-400 mt-1">{{ column.type }}</div>
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(row, rowIndex) in tableData" :key="rowIndex" class="hover:bg-gray-50">
            <td
              v-for="column in columns"
              :key="column.name"
              class="px-6 py-4 whitespace-nowrap text-sm"
              :class="{
                'text-gray-900': row[column.name] !== null && row[column.name] !== undefined,
                'text-gray-400 italic': row[column.name] === null || row[column.name] === undefined,
                'text-right': getSimpleType(column.type) === 'number'
              }"
            >
              {{ formatValue(row[column.name]) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页控件 -->
    <div v-if="tableData.length && pagination.totalPages > 1" class="px-6 py-3 flex items-center justify-between border-t border-gray-200">
      <div>
        <p class="text-sm text-gray-700">
          显示 <span class="font-medium">{{ (pagination.page - 1) * pagination.size + 1 }}</span> 到 
          <span class="font-medium">{{ Math.min(pagination.page * pagination.size, pagination.total) }}</span> 条，
          共 <span class="font-medium">{{ pagination.total }}</span> 条
        </p>
      </div>
      <div class="flex-1 flex justify-end">
        <nav class="flex items-center">
          <button
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="pagination.page === 1"
            @click="handlePageChange(pagination.page - 1)"
          >
            上一页
          </button>
          <div class="mx-2 flex items-center">
            <input
              v-model.number="pagination.page"
              type="number"
              min="1"
              :max="pagination.totalPages"
              class="w-12 text-center border border-gray-300 rounded-md px-1 py-1 text-sm"
              @change="handlePageChange(Math.max(1, Math.min(pagination.totalPages, pagination.page)))"
            />
            <span class="mx-1 text-gray-500 text-sm">/ {{ pagination.totalPages }}</span>
          </div>
          <button
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            :disabled="pagination.page === pagination.totalPages"
            @click="handlePageChange(pagination.page + 1)"
          >
            下一页
          </button>
        </nav>
      </div>
    </div>
    
    <!-- 过滤面板 -->
    <div
      v-if="showFilterPanel && activeFilter"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      @click.self="closeFilterPanel"
    >
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            过滤: {{ activeFilter }}
          </h3>
          <button
            class="text-gray-400 hover:text-gray-500"
            @click="closeFilterPanel"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <!-- 列统计信息 -->
        <div v-if="currentStats" class="mb-4 p-3 bg-gray-50 rounded-md text-sm">
          <div class="flex justify-between">
            <div class="text-gray-600">
              唯一值: <span class="font-medium">{{ currentStats.uniqueValues }}</span>
            </div>
            <div class="text-gray-600">
              空值: <span class="font-medium">{{ currentStats.nullValues }}</span>
            </div>
          </div>
          <div v-if="currentStats.minValue !== undefined" class="flex justify-between mt-2">
            <div class="text-gray-600">
              最小值: <span class="font-medium">{{ currentStats.minValue }}</span>
            </div>
            <div class="text-gray-600">
              最大值: <span class="font-medium">{{ currentStats.maxValue }}</span>
            </div>
          </div>
        </div>
        
        <!-- 过滤条件输入 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            过滤条件
          </label>
          
          <!-- 根据列类型显示不同的过滤条件 -->
          <template v-if="activeFilter && columns.find(c => c.name === activeFilter)">
            <div v-if="getSimpleType(columns.find(c => c.name === activeFilter)!.type) === 'text'">
              <input
                type="text"
                v-model="filterValues[activeFilter]"
                placeholder="包含..."
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
            
            <div v-else-if="getSimpleType(columns.find(c => c.name === activeFilter)!.type) === 'number'">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">最小值</label>
                  <input
                    type="number"
                    v-model="filterValues[activeFilter]"
                    placeholder="最小值..."
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">最大值</label>
                  <input
                    type="number"
                    v-model="filterValues[activeFilter + '_max']"
                    placeholder="最大值..."
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div v-else-if="getSimpleType(columns.find(c => c.name === activeFilter)!.type) === 'datetime'">
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">起始日期</label>
                  <input
                    type="date"
                    v-model="filterValues[activeFilter]"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">结束日期</label>
                  <input
                    type="date"
                    v-model="filterValues[activeFilter + '_end']"
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            
            <div v-else-if="getSimpleType(columns.find(c => c.name === activeFilter)!.type) === 'boolean'">
              <select
                v-model="filterValues[activeFilter]"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">全部</option>
                <option value="true">是</option>
                <option value="false">否</option>
              </select>
            </div>
          </template>
        </div>
        
        <div class="flex justify-end space-x-3">
          <button
            class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="clearCurrentFilter"
          >
            清除
          </button>
          <button
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="applyFilter"
          >
            应用
          </button>
        </div>
      </div>
    </div>
  </div>
</template>