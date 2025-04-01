<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { QueryResult, QueryStatus } from '@/types/query'
import QueryVisualization from './QueryVisualization.vue'
import QueryAnalysis from './QueryAnalysis.vue'

// 定义组件属性
const props = defineProps<{
  results: QueryResult | null
  isLoading: boolean
  error: string | null
  queryId?: string // 添加queryId属性
}>()

// 定义组件事件
const emit = defineEmits<{
  (e: 'export-results', format: 'csv' | 'excel' | 'json'): void
  (e: 'apply-suggestion', query: string): void // 添加应用建议事件
  (e: 'cancel', queryId: string): void
}>()

// 分页状态
const currentPage = ref(1)
const pageSize = ref(10)
const pageSizeOptions = [10, 20, 50, 100]

// 是否显示表格列配置
const showColumnConfig = ref(false)

// 是否显示导出菜单
const showExportMenu = ref(false)

// 跟踪隐藏的列
const hiddenColumns = ref<string[]>([])

// 跟踪展示给用户的错误消息
const userFriendlyError = ref('')

// 当前激活的视图 (table、visualization 或 analysis)
const activeView = ref<'table' | 'visualization' | 'analysis'>('table')

// 查询开始运行时间计时器
const executionTime = ref(0)
let executionTimer: number | null = null

// 格式化运行时间
const formatRunningTime = (ms: number) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  if (minutes > 0) {
    return `${minutes}分钟 ${seconds % 60}秒`
  }
  return `${seconds}秒`
}

// 取消查询执行
const cancelQuery = () => {
  if (!props.queryId) return
  
  emit('cancel', props.queryId)
  stopTimer()
}

// 开始计时器
const startTimer = () => {
  if (executionTimer) return
  
  const startTime = Date.now()
  executionTimer = window.setInterval(() => {
    executionTime.value = Date.now() - startTime
  }, 1000)
}

// 停止计时器
const stopTimer = () => {
  if (executionTimer) {
    window.clearInterval(executionTimer)
    executionTimer = null
  }
  executionTime.value = 0
}

// 监听加载状态，开始或停止计时器
watch(() => props.isLoading, (newValue) => {
  if (newValue) {
    startTimer()
  } else {
    stopTimer()
  }
})

// 组件卸载时清理计时器
onUnmounted(() => {
  stopTimer()
})

// 计算属性：可见的列
const visibleColumns = computed(() => {
  if (!props.results) return []
  
  // 先处理API返回的data.fields结构
  if (props.results.data && props.results.data.fields && Array.isArray(props.results.data.fields)) {
    console.log('Using data.fields from API response')
    const columnsFromApiFields = props.results.data.fields.map(field => {
      return typeof field === 'string' ? field : (field.name || '未知字段')
    });
    return columnsFromApiFields.filter(col => !hiddenColumns.value.includes(col));
  }
  
  // 确保计算列时考虑不同的数据格式
  if (props.results.columns && Array.isArray(props.results.columns)) {
    return props.results.columns.filter(col => !hiddenColumns.value.includes(col))
  }
  
  // 如果找不到columns字段，尝试从fields获取
  if (props.results.fields && Array.isArray(props.results.fields)) {
    const columnsFromFields = props.results.fields.map(field => {
      return typeof field === 'string' ? field : (field.name || '未知字段')
    });
    return columnsFromFields.filter(col => !hiddenColumns.value.includes(col));
  }
  
  // 最后尝试从rows的第一行获取列名
  if (props.results.rows && props.results.rows.length > 0) {
    const firstRow = props.results.rows[0];
    if (typeof firstRow === 'object' && firstRow !== null) {
      const keysFromFirstRow = Object.keys(firstRow);
      return keysFromFirstRow.filter(col => !hiddenColumns.value.includes(col));
    }
  }
  
  // 如果都找不到，返回空数组
  return []
})

// 计算属性：总页数
const totalPages = computed(() => {
  if (!props.results || !props.results.rows) return 0
  
  return Math.ceil(props.results.rows.length / pageSize.value)
})

// 计算属性：当前页的行数据
const paginatedRows = computed(() => {
  if (!props.results) return []
  
  // 检查是否有数据
  console.log('Computing paginatedRows with results:', props.results)
  
  // 处理rows为null的情况
  if (!props.results.rows) {
    console.warn('No rows in query results')
    return []
  }
  
  // 特殊处理API返回的data结构
  if (props.results.data && props.results.data.rows) {
    console.log('Using data.rows from API response')
    return props.results.data.rows.slice(
      (currentPage.value - 1) * pageSize.value,
      currentPage.value * pageSize.value
    )
  }
  
  // 尝试从API返回的结果中提取rows数据
  let rows: Array<Record<string, any>> = Array.isArray(props.results.rows) 
    ? props.results.rows 
    : [];
  
  // 如果rows不是数组，尝试转换
  if (!Array.isArray(props.results.rows)) {
    console.warn('Rows is not an array, type:', typeof props.results.rows)
    
    // 如果rows是一个对象，尝试从中提取数据
    if (typeof props.results.rows === 'object' && props.results.rows !== null) {
      const rowsObj = props.results.rows as Record<string, any>;
      if ('data' in rowsObj && Array.isArray(rowsObj.data)) {
        console.log('Using data property from rows')
        rows = rowsObj.data
      } else if ('items' in rowsObj && Array.isArray(rowsObj.items)) {
        console.log('Using items property from rows')
        rows = rowsObj.items
      } else if ('COUNT(*)' in rowsObj) {
        // 处理特殊情况：COUNT(*) 查询
        console.log('Special case: COUNT(*) query result')
        rows = [rowsObj]
      } else {
        // 尝试将对象转换为数组
        try {
          console.log('Converting object to array', Object.keys(rowsObj))
          const convertedRows: Array<Record<string, any>> = []
          for (const key in rowsObj) {
            if (Object.prototype.hasOwnProperty.call(rowsObj, key)) {
              convertedRows.push(rowsObj[key])
            }
          }
          rows = convertedRows
        } catch (e) {
          console.error('Failed to convert rows object to array:', e)
          rows = []
        }
      }
    } else {
      console.error('Unhandled rows type:', typeof props.results.rows)
      rows = []
    }
  }
  
  // 进行分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  
  console.log(`Pagination: showing rows ${start}-${end} of ${rows.length}`)
  return rows.slice(start, end)
})

// 切换列可见性
const toggleColumnVisibility = (column: string) => {
  if (hiddenColumns.value.includes(column)) {
    hiddenColumns.value = hiddenColumns.value.filter(col => col !== column)
  } else {
    hiddenColumns.value.push(column)
  }
}

// 显示所有列
const showAllColumns = () => {
  hiddenColumns.value = []
}

// 切换到指定页
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return
  currentPage.value = page
}

// 更新每页显示数量
const updatePageSize = (size: number) => {
  pageSize.value = size
  currentPage.value = 1 // 重置为第一页
}

// 导出数据
const exportData = (format: 'csv' | 'excel' | 'json') => {
  emit('export-results', format)
}

// 处理优化建议应用
const handleApplySuggestion = (query: string) => {
  emit('apply-suggestion', query)
}

// 格式化单元格内容
const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) {
    return 'NULL'
  }
  
  // 处理字符串类型的值
  if (typeof value === 'string') {
    // 检测是否是JSON字符串
    if ((value.startsWith('{') && value.endsWith('}')) || 
        (value.startsWith('[') && value.endsWith(']'))) {
      try {
        // 尝试解析JSON字符串
        const jsonObj = JSON.parse(value);
        
        // 如果解析成功，将对象格式化为更易读的形式
        if (typeof jsonObj === 'object' && jsonObj !== null) {
          // 处理状态计数格式
          if ('status' in jsonObj && 'count' in jsonObj) {
            return `${jsonObj.status}: ${jsonObj.count}`
          }
          
          // 处理特殊字段 - status_count
          if (value.includes('status_count')) {
            try {
              // 可能是多层嵌套的JSON
              let formattedString = '';
              
              if (Array.isArray(jsonObj)) {
                // 数组格式，每行一个状态
                return jsonObj.map(item => {
                  if (item && typeof item === 'object' && 'status' in item && 'count' in item) {
                    return `${item.status}: ${item.count}`;
                  }
                  return JSON.stringify(item);
                }).join(', ');
              } else {
                // 对象格式，提取内容
                Object.keys(jsonObj).forEach(key => {
                  formattedString += `${key}: ${jsonObj[key]}, `;
                });
                return formattedString.slice(0, -2); // 移除最后的逗号和空格
              }
            } catch (e) {
              console.warn('Status count 格式处理失败:', e);
            }
          }
          
          // 一般情况下将JSON对象转换为字符串表示
          return JSON.stringify(jsonObj, null, 2)
            .replace(/[{}\[\]"]/g, '') // 去除括号和引号
            .replace(/,\n/g, ', ')     // 将换行替换为逗号+空格
            .trim();
        }
        
        return JSON.stringify(jsonObj);
      } catch (e) {
        // 如果解析失败，返回原始字符串
        console.warn('JSON解析失败:', e);
        return value;
      }
    }
    
    // 尝试检测普通字符串中是否包含转义的JSON
    if (value.includes('\\"') || value.includes('\\{') || value.includes('\\[')) {
      try {
        // 可能是双重转义的JSON字符串，尝试修复并解析
        const unescaped = value.replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        if ((unescaped.startsWith('{') && unescaped.endsWith('}')) || 
            (unescaped.startsWith('[') && unescaped.endsWith(']'))) {
          const jsonObj = JSON.parse(unescaped);
          if (typeof jsonObj === 'object' && jsonObj !== null) {
            if ('status' in jsonObj && 'count' in jsonObj) {
              return `${jsonObj.status}: ${jsonObj.count}`;
            }
            
            // 其他JSON对象格式化
            return JSON.stringify(jsonObj, null, 2)
              .replace(/[{}\[\]"]/g, '')
              .replace(/,\n/g, ', ')
              .trim();
          }
        }
      } catch (e) {
        // 解析失败，忽略错误
        console.warn('尝试解析转义JSON失败:', e);
      }
    }
    
    return value;
  }
  
  // 处理对象类型的值 - 包括对象本身可能包含status_count等特殊字段
  if (typeof value === 'object' && value !== null) {
    // 特殊处理status_count字段
    if ('status_count' in value) {
      const statusCount = value['status_count'];
      if (typeof statusCount === 'string') {
        try {
          const parsedStatus = JSON.parse(statusCount);
          if (typeof parsedStatus === 'object' && parsedStatus !== null) {
            if ('status' in parsedStatus && 'count' in parsedStatus) {
              return `${parsedStatus.status}: ${parsedStatus.count}`;
            }
          }
        } catch (e) {
          // 如果解析失败，保持原样
          console.warn('特殊字段status_count解析失败:', e);
        }
      }
    }
    
    try {
      // 尝试将对象转为JSON字符串
      const objStr = JSON.stringify(value, null, 2)
        .replace(/[{}\[\]"]/g, '') // 去除括号和引号
        .replace(/,\n/g, ', ')     // 将换行替换为逗号+空格
        .trim();
      
      return objStr || String(value);
    } catch (e) {
      return String(value);
    }
  }
  
  return String(value);
}

// 获取每种状态的显示信息
const getStatusInfo = (status: QueryStatus | undefined): { label: string; color: string } => {
  switch (status) {
    case 'COMPLETED':
      return { label: '已完成', color: 'text-green-600' }
    case 'RUNNING':
      return { label: '执行中', color: 'text-blue-600' }
    case 'FAILED':
      return { label: '失败', color: 'text-red-600' }
    case 'CANCELLED':
      return { label: '已取消', color: 'text-yellow-600' }
    default:
      return { label: '未知', color: 'text-gray-600' }
  }
}

// 格式化执行时间
const formatExecutionTime = (ms: number | undefined): string => {
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

// 处理错误信息的展示
watch(() => props.error, (error) => {
  if (error) {
    // 检查是否是被取消的查询
    if (error.includes('取消') || error.toLowerCase().includes('cancel')) {
      userFriendlyError.value = '查询已被取消'
    }
    // 检查是否是SQL语法错误
    else if (error.includes('syntax error')) {
      userFriendlyError.value = 'SQL语法错误，请检查您的查询语句'
    }
    // 检查是否是表不存在错误
    else if (error.includes('table') && error.includes('not exist')) {
      userFriendlyError.value = '表不存在，请检查表名是否正确'
    }
    // 检查是否是字段不存在错误
    else if (error.includes('column') && error.includes('not exist')) {
      userFriendlyError.value = '字段不存在，请检查字段名是否正确'
    }
    // 默认错误信息
    else {
      userFriendlyError.value = error
    }
  } else {
    userFriendlyError.value = ''
  }
})

// 当结果改变时，复位分页
watch(() => props.results, (newResults) => {
  console.log("Results changed in QueryResults:", newResults)
  if (newResults) {
    console.log("Columns:", newResults.columns)
    console.log("Row count:", newResults.rowCount)
    console.log("First few rows:", newResults.rows?.slice(0, 3))
    
    // 确保即使返回数据的格式不完全符合期望，组件也能尝试显示数据
    if (!Array.isArray(newResults.rows) && typeof newResults.rows === 'object') {
      console.warn("Query results rows is not an array. Attempting to convert to array format.")
      try {
        // 尝试将对象转换为数组
        const rows = [];
        if (newResults.rows && Object.keys(newResults.rows).length > 0) {
          for (const key in newResults.rows) {
            if (Object.prototype.hasOwnProperty.call(newResults.rows, key)) {
              rows.push(newResults.rows[key]);
            }
          }
          newResults.rows = rows;
        }
      } catch (e) {
        console.error("Failed to convert rows to array format:", e);
      }
    }
  }
  currentPage.value = 1
  hiddenColumns.value = []
})
</script>

<template>
  <div class="h-full flex flex-col bg-white">
    <!-- 标签选择器 -->
    <div class="flex border-b border-gray-200">
      <button
        @click="activeView = 'table'"
        :class="[
          'px-4 py-2 text-sm font-medium border-b-2 focus:outline-none',
          activeView === 'table'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]"
      >
        <i class="fas fa-table mr-2"></i>
        表格
      </button>
      
      <button
        @click="activeView = 'visualization'"
        :class="[
          'px-4 py-2 text-sm font-medium border-b-2 focus:outline-none',
          activeView === 'visualization'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]"
      >
        <i class="fas fa-chart-bar mr-2"></i>
        可视化
      </button>
      
      <button
        @click="activeView = 'analysis'"
        :class="[
          'px-4 py-2 text-sm font-medium border-b-2 focus:outline-none',
          activeView === 'analysis'
            ? 'border-indigo-500 text-indigo-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
        ]"
      >
        <i class="fas fa-microscope mr-2"></i>
        分析
      </button>
    </div>
    
    <!-- 加载状态 - 等待获取结果 -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="text-center text-gray-500">
        <div class="w-8 h-8 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2"></div>
        <p>准备展示结果...</p>
      </div>
    </div>
    
    <!-- 无结果 -->
    <div v-else-if="!results || !results.rows || results.rows.length === 0" class="flex-1 flex items-center justify-center p-4">
      <div class="text-center text-gray-500">
        <i class="fas fa-database text-gray-400 text-3xl mb-2"></i>
        <p>没有查询结果</p>
        <p class="text-sm mt-1">请修改查询条件或选择其他数据</p>
      </div>
    </div>
    
    <!-- 查询结果内容 -->
    <div v-else class="flex-1 flex flex-col overflow-hidden">
      <!-- 表格视图 -->
      <div v-if="activeView === 'table'" class="flex-1 overflow-auto">
        <div class="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
          <div class="flex items-center">
            <span class="text-sm text-gray-600">共 {{ results.data?.rowCount || results.data?.totalCount || results.rowCount || 0 }} 条结果</span>
            <span v-if="results.executionTime" class="ml-4 text-sm text-gray-600">
              执行时间: {{ formatExecutionTime(results.executionTime) }}
            </span>
            <span v-if="results.status" class="ml-4 text-sm" :class="getStatusInfo(results.status).color">
              状态: {{ getStatusInfo(results.status).label }}
            </span>
          </div>
          
          <div class="flex items-center space-x-2">
            <!-- 列配置 -->
            <button 
              @click="showColumnConfig = !showColumnConfig" 
              class="p-1 text-gray-500 hover:text-indigo-600 rounded"
              :class="{'text-indigo-600': showColumnConfig}"
            >
              <i class="fas fa-columns"></i>
            </button>
            
            <!-- 导出按钮 -->
            <div class="relative">
              <button 
                @click="showExportMenu = !showExportMenu" 
                class="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-50"
              >
                <i class="fas fa-download mr-1"></i>
                导出
              </button>
              <!-- 导出菜单 -->
              <div 
                v-show="showExportMenu" 
                class="absolute right-0 mt-2 bg-white shadow-lg rounded-md py-1 z-10 w-32"
              >
                <button @click="exportData('csv'); showExportMenu = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  导出为 CSV
                </button>
                <button @click="exportData('excel'); showExportMenu = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  导出为 Excel
                </button>
                <button @click="exportData('json'); showExportMenu = false" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                  导出为 JSON
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 列配置面板 -->
        <div v-if="showColumnConfig" class="p-3 bg-gray-50 border-b">
          <div class="flex flex-wrap gap-2">
            <div 
              v-for="column in results.columns" 
              :key="column" 
              class="px-2 py-1 bg-white border rounded-full text-xs flex items-center"
              :class="hiddenColumns.includes(column) ? 'text-gray-400 border-gray-300' : 'text-gray-700 border-gray-400'"
            >
              <span class="mr-1">{{ column }}</span>
              <button @click="toggleColumnVisibility(column)" class="ml-1">
                <i :class="hiddenColumns.includes(column) ? 'far fa-eye-slash' : 'far fa-eye'"></i>
              </button>
            </div>
            
            <button 
              v-if="hiddenColumns.length > 0" 
              @click="showAllColumns" 
              class="px-2 py-1 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-full text-xs"
            >
              显示所有列
            </button>
          </div>
        </div>
        
        <!-- 表格 -->
        <div class="overflow-auto flex-1">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  v-for="column in visibleColumns"
                  :key="column"
                  class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider sticky top-0 bg-gray-50 border-b"
                >
                  {{ column }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <!-- 如果没有结果数据，但有原始结果对象 -->
              <tr v-if="paginatedRows.length === 0 && results">
                <td 
                  v-for="column in visibleColumns" 
                  :key="column"
                  class="px-4 py-2 text-sm text-gray-700"
                >
                  <!-- 直接从原始结果中获取COUNT(*)数据 -->
                  <template v-if="column === 'COUNT(*)' && results.rows && typeof results.rows === 'object'">
                    {{ results.rows['COUNT(*)'] || 0 }}
                  </template>
                  <template v-else-if="results.data && results.data.rows && results.data.rows.length > 0">
                    <!-- 尝试从API的data.rows中获取数据 -->
                    {{ results.data.rows[0][column] || '-' }}
                  </template>
                  <template v-else>
                    <!-- 尝试从原始结果中获取数据 -->
                    {{ results.rows && typeof results.rows === 'object' && column in results.rows ? results.rows[column] : '-' }}
                  </template>
                </td>
              </tr>
              
              <!-- 正常行数据渲染 -->
              <tr v-for="(row, rowIndex) in paginatedRows" :key="rowIndex" class="hover:bg-gray-50">
                <td
                  v-for="column in visibleColumns"
                  :key="column"
                  class="px-4 py-2 text-sm text-gray-700 max-w-xs truncate"
                >
                  {{ formatCellValue(row[column]) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 分页 -->
        <div class="px-4 py-2 bg-white border-t flex justify-between items-center">
          <div class="flex items-center text-sm text-gray-600">
            <span>每页显示</span>
            <select
              v-model="pageSize"
              @change="(e: Event) => updatePageSize(Number((e.target as HTMLSelectElement).value))"
              class="mx-1 px-2 py-1 border rounded text-sm"
            >
              <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
            </select>
            <span>条</span>
            
            <!-- 添加结果总数显示 -->
            <span class="ml-4">
              共 
              <span class="font-medium">
                {{ results.data?.rowCount || results.data?.totalCount || results.rowCount || 0 }}
              </span> 
              条记录
            </span>
          </div>
          
          <div class="flex items-center space-x-1">
            <button
              @click="goToPage(1)"
              :disabled="currentPage === 1"
              class="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <i class="fas fa-angle-double-left"></i>
            </button>
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <i class="fas fa-angle-left"></i>
            </button>
            
            <span class="text-sm text-gray-600">
              {{ currentPage }} / {{ results.data?.totalPages || totalPages || 1 }}
            </span>
            
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage >= (results.data?.totalPages || totalPages || 1)"
              class="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <i class="fas fa-angle-right"></i>
            </button>
            <button
              @click="goToPage(results.data?.totalPages || totalPages || 1)"
              :disabled="currentPage >= (results.data?.totalPages || totalPages || 1)"
              class="p-2 rounded hover:bg-gray-100 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              <i class="fas fa-angle-double-right"></i>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 可视化视图 -->
      <div v-else-if="activeView === 'visualization'" class="flex-1 overflow-auto">
        <QueryVisualization
          :query-id="queryId || ''"
          :query-result="results"
          :is-loading="isLoading"
        />
      </div>
      
      <!-- 分析视图 -->
      <div v-else-if="activeView === 'analysis'" class="flex-1 overflow-auto">
        <QueryAnalysis
          :query-id="queryId || ''"
          @apply-suggestion="handleApplySuggestion"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  max-height: calc(100vh - 300px);
  overflow-y: auto;
}

/* 自定义滚动条样式 */
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