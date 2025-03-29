<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { QueryResult, ColumnDefinition } from '@/types/query'

// 定义组件属性
const props = defineProps<{
  result: QueryResult
  maxHeight?: string
}>()

// 定义组件事件
const emit = defineEmits<{
  (e: 'export'): void
}>()

// 当前页码
const currentPage = ref(1)

// 每页行数
const pageSize = ref(10)

// 最大页数
const maxPage = computed(() => {
  return Math.ceil(props.result.totalRows / pageSize.value)
})

// 当前页数据
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  
  return props.result.rows.slice(start, end)
})

// 可选页大小
const pageSizeOptions = [10, 20, 50, 100]

// 监听结果变化，重置页码
watch(() => props.result, () => {
  currentPage.value = 1
})

// 改变页码
const changePage = (page: number) => {
  if (page < 1) page = 1
  if (page > maxPage.value) page = maxPage.value
  
  currentPage.value = page
}

// 改变每页大小
const changePageSize = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 格式化数据类型显示
const formatColumnType = (type: string) => {
  switch (type.toUpperCase()) {
    case 'STRING':
      return 'Text'
    case 'INTEGER':
      return 'Integer'
    case 'DECIMAL':
      return 'Decimal'
    case 'BOOLEAN':
      return 'Boolean'
    case 'DATE':
      return 'Date'
    case 'DATETIME':
      return 'DateTime'
    case 'TIMESTAMP':
      return 'Timestamp'
    case 'JSON':
      return 'JSON'
    case 'ARRAY':
      return 'Array'
    case 'BINARY':
      return 'Binary'
    default:
      return type
  }
}

// 格式化单元格值
const formatCellValue = (value: any, column: ColumnDefinition) => {
  if (value === null || value === undefined) {
    return 'NULL'
  }
  
  // 根据类型格式化
  const type = column.type.toUpperCase()
  
  if (type === 'JSON' || type === 'ARRAY') {
    return typeof value === 'string' ? value : JSON.stringify(value, null, 2)
  } else if (type === 'BOOLEAN') {
    return value ? 'true' : 'false'
  } else if (type === 'BINARY') {
    return '[Binary Data]'
  } else {
    return String(value)
  }
}

// 获取单元格类
const getCellClass = (value: any, column: ColumnDefinition) => {
  if (value === null || value === undefined) {
    return 'text-gray-400 italic'
  }
  
  const type = column.type.toUpperCase()
  
  if (type === 'INTEGER' || type === 'DECIMAL') {
    return 'text-right font-mono'
  } else if (type === 'BOOLEAN') {
    return value ? 'text-green-600' : 'text-red-600'
  } else if (type === 'DATE' || type === 'DATETIME' || type === 'TIMESTAMP') {
    return 'text-purple-600 font-mono text-sm'
  } else {
    return ''
  }
}

// 导出数据
const handleExport = () => {
  emit('export')
}
</script>

<template>
  <div class="space-y-4">
    <!-- 查询结果头部 -->
    <div class="flex justify-between items-center">
      <div class="text-sm text-gray-600">
        <span>共 {{ result.totalRows }} 条记录，执行时间 {{ result.executionTime }}ms</span>
      </div>
      
      <button
        class="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
        @click="handleExport"
      >
        导出
      </button>
    </div>
    
    <!-- 结果表格 -->
    <div class="border rounded overflow-auto" :style="{ maxHeight: props.maxHeight || '500px' }">
      <table class="w-full whitespace-nowrap">
        <thead>
          <tr class="bg-gray-100 text-left">
            <th class="px-4 py-2 border-b text-xs font-medium text-gray-700 sticky top-0 bg-gray-100" style="min-width: 40px">#</th>
            <th
              v-for="(column, index) in result.columns"
              :key="index"
              class="px-4 py-2 border-b text-xs font-medium text-gray-700 sticky top-0 bg-gray-100"
              style="min-width: 120px"
            >
              <div class="flex items-center space-x-1">
                <span>{{ column.label || column.name }}</span>
                <span v-if="column.isPrimaryKey" class="text-blue-500 text-xs" title="主键">🔑</span>
                <span v-if="column.isForeignKey" class="text-green-500 text-xs" title="外键">🔗</span>
              </div>
              <div class="text-xs text-gray-500 mt-1">
                {{ formatColumnType(column.type) }}
                <span v-if="column.isNullable" class="text-gray-400">(可为空)</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in currentPageData"
            :key="rowIndex"
            class="hover:bg-gray-50 border-b"
          >
            <td class="px-4 py-2 text-xs text-gray-500">{{ (currentPage - 1) * pageSize + rowIndex + 1 }}</td>
            <td
              v-for="(column, colIndex) in result.columns"
              :key="`${rowIndex}-${colIndex}`"
              class="px-4 py-2"
              :class="getCellClass(row[column.name], column)"
            >
              <div class="text-sm truncate max-w-xs" :title="formatCellValue(row[column.name], column)">
                {{ formatCellValue(row[column.name], column) }}
              </div>
            </td>
          </tr>
          
          <!-- 空结果提示 -->
          <tr v-if="result.rows.length === 0">
            <td
              :colspan="result.columns.length + 1"
              class="px-4 py-8 text-center text-gray-500"
            >
              没有数据
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <!-- 分页 -->
    <div v-if="result.rows.length > 0" class="flex justify-between items-center">
      <!-- 分页控件 -->
      <div class="flex items-center space-x-2">
        <button
          class="px-2 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="changePage(1)"
        >
          首页
        </button>
        
        <button
          class="px-2 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="changePage(currentPage - 1)"
        >
          上一页
        </button>
        
        <span class="text-sm">
          {{ currentPage }} / {{ maxPage }}
        </span>
        
        <button
          class="px-2 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === maxPage"
          @click="changePage(currentPage + 1)"
        >
          下一页
        </button>
        
        <button
          class="px-2 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="currentPage === maxPage"
          @click="changePage(maxPage)"
        >
          末页
        </button>
      </div>
      
      <!-- 每页记录数 -->
      <div class="flex items-center space-x-2 text-sm">
        <span>每页显示：</span>
        <select
          v-model="pageSize"
          class="border rounded px-2 py-1"
          @change="changePageSize(Number($event.target.value))"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">
            {{ size }}
          </option>
        </select>
        <span>条</span>
      </div>
    </div>
  </div>
</template>