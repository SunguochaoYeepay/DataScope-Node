<script setup lang="ts">
import { ref, computed, onMounted, watch, reactive } from 'vue'
import type { DataSource } from '@/types/datasource'
import type { TableMetadata, ColumnMetadata } from '@/types/metadata'
import { useDataSourceStore } from '@/stores/datasource'
import { dataSourceService } from '@/services/datasource'
import { ExclamationCircleOutlined } from '@ant-design/icons-vue'
import { message } from 'ant-design-vue'

// 定义组件属性
const props = defineProps<{
  dataSourceId: string;
  searchKeyword?: string;
}>()

// 定义组件事件
const emit = defineEmits<{
  (e: 'table-select', table: TableMetadata): void
  (e: 'column-select', column: ColumnMetadata, table: TableMetadata): void
  (e: 'insert-table', tableName: string): void
  (e: 'insert-column', columnName: string): void
  (e: 'tablesLoaded', tables: TableMetadata[]): void
}>()

// 数据源存储
const dataSourceStore = useDataSourceStore()

// 状态
const searchTerm = ref('')
const expandedTables = ref<string[]>([])
const isLoading = ref(false)
const error = ref<string>('')
const tables = ref<TableMetadata[]>([])

interface ExplorerState {
  loading: boolean;
  error: string;
}

const state = reactive<ExplorerState>({
  loading: false,
  error: ''
})

// 获取数据源的元数据
const getMetadataForDataSource = (dataSourceId: string) => {
  // 查找对应数据源的元数据
  const dataSource = dataSourceStore.dataSources.find(ds => ds.id === dataSourceId)
  return dataSource?.metadata
}

// 加载元数据
const loadMetadata = async (dataSourceId: string) => {
  if (!dataSourceId) return
  
  console.log('开始加载元数据，数据源ID:', dataSourceId)
  isLoading.value = true
  error.value = ''
  
  try {
    // 使用数据源store中的方法加载元数据
    // 如果不存在loadMetadata方法，则尝试使用其他可用方法或模拟加载
    if (typeof dataSourceStore.fetchDataSources === 'function') {
      console.log('正在获取数据源列表...')
      await dataSourceStore.fetchDataSources()
    }
    
    // 获取数据源元数据
    console.log('尝试获取数据源元数据...')
    if (typeof dataSourceStore.getDataSourceMetadata === 'function') {
      try {
        console.log('调用getDataSourceMetadata方法...')
        await dataSourceStore.getDataSourceMetadata(dataSourceId)
      } catch (metadataError) {
        console.warn('获取元数据时出错:', metadataError)
      }
    }

    // 如果搜索到有表，自动展开
    if (searchTerm.value) {
      const metadata = getMetadataForDataSource(dataSourceId)
      console.log('搜索模式下获取到的元数据:', metadata)
      const tables = metadata?.tables || []
      const filteredTables = tables.filter((table: TableMetadata) => {
        // 检查表名
        if (table.name.toLowerCase().includes(searchTerm.value.toLowerCase())) {
          return true
        }
        
        // 检查列名
        return table.columns.some((column: ColumnMetadata) => 
          column.name.toLowerCase().includes(searchTerm.value.toLowerCase())
        )
      })
      
      // 自动展开搜索到的表
      expandedTables.value = filteredTables.map((t: TableMetadata) => t.name)
    }
    
    // 检查元数据是否成功加载
    const metadata = getMetadataForDataSource(dataSourceId)
    console.log('加载到的元数据:', metadata)
    if (!metadata || !metadata.tables || metadata.tables.length === 0) {
      console.warn('元数据加载完成，但未找到表信息')
      // 尝试主动同步元数据
      if (typeof dataSourceStore.syncDataSourceMetadata === 'function') {
        console.log('尝试主动同步元数据...')
        try {
          await dataSourceStore.syncDataSourceMetadata(dataSourceId)
          console.log('同步完成，重新获取元数据...')
          if (typeof dataSourceStore.getDataSourceMetadata === 'function') {
            await dataSourceStore.getDataSourceMetadata(dataSourceId)
          }
        } catch (syncError) {
          console.warn('同步元数据失败:', syncError)
        }
      }
    } else {
      console.log('元数据加载成功，找到表数量:', metadata.tables.length)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : '加载元数据失败'
    console.error('加载元数据出错:', err)
  } finally {
    isLoading.value = false
    console.log('元数据加载流程完成')
  }
}

// 监听searchKeyword，更新searchTerm
watch(() => props.searchKeyword, (newKeyword) => {
  if (newKeyword !== undefined) {
    searchTerm.value = newKeyword
  }
}, { immediate: true })

// 监听选中的数据源变化
watch(() => props.dataSourceId, async (newId) => {
  if (newId) {
    await loadMetadata(newId)
  }
}, { immediate: true })

// 计算属性：过滤后的表格
const filteredTables = computed(() => {
  const metadata = getMetadataForDataSource(props.dataSourceId)
  if (!metadata || !metadata.tables) {
    return []
  }
  
  const term = searchTerm.value.toLowerCase()
  
  if (!term) {
    return metadata.tables
  }
  
  return metadata.tables.filter((table: TableMetadata) => {
    // 检查表名
    if (table.name.toLowerCase().includes(term)) {
      return true
    }
    
    // 检查列名
    return table.columns.some((column: ColumnMetadata) => 
      column.name.toLowerCase().includes(term)
    )
  })
})

// 展开/折叠表格
const toggleTable = (tableName: string) => {
  console.log(`切换表格 ${tableName} 的展开状态`)
  
  if (expandedTables.value.includes(tableName)) {
    console.log(`折叠表格 ${tableName}`)
    expandedTables.value = expandedTables.value.filter(t => t !== tableName)
  } else {
    console.log(`展开表格 ${tableName}，尝试加载字段信息`)
    
    // 先添加到展开列表
    expandedTables.value.push(tableName)
    
    // 尝试加载表的字段信息
    loadColumns(tableName).catch(err => {
      console.error(`加载表 ${tableName} 的字段信息失败:`, err)
    })
  }
}

// 获取表的字段信息
const loadColumns = async (tableName: string) => {
  if (!props.dataSourceId || !tableName) return []

  console.log(`MetadataExplorer: 开始获取表 ${tableName} 的字段信息`)
  const targetTable = tables.value.find(t => getTableName(t) === tableName)
  
  if (targetTable && targetTable.columns && targetTable.columns.length > 0) {
    console.log(`MetadataExplorer: 表 ${tableName} 已有字段信息, 数量:`, targetTable.columns.length)
    return targetTable.columns
  }

  try {
    console.log(`MetadataExplorer: 从API获取表 ${tableName} 的字段信息`)
    // 先尝试直接从API获取字段信息
    try {
      const columnsData = await dataSourceService.getTableColumns(props.dataSourceId, tableName)
      console.log(`MetadataExplorer: API获取表 ${tableName} 字段成功:`, columnsData)
      
      if (columnsData && columnsData.length > 0) {
        // 更新表的列信息
        if (targetTable) {
          targetTable.columns = columnsData
          console.log(`MetadataExplorer: 更新表 ${tableName} 字段信息, 数量:`, columnsData.length)
        }
        
        return columnsData
      }
    } catch (apiError) {
      console.error(`MetadataExplorer: 直接API获取表 ${tableName} 字段失败:`, apiError)
    }
    
    // 如果直接获取失败，回退到使用默认方法
    console.log(`尝试使用默认方法获取表 ${tableName} 字段信息`)
    // 模拟列信息，或者直接返回空数组
    const columns: ColumnMetadata[] = []
    console.log(`MetadataExplorer: 使用默认方法获取表 ${tableName} 字段信息`)
    
    return columns
  } catch (err) {
    console.error(`MetadataExplorer: 获取表 ${tableName} 的字段信息失败:`, err)
    message.error(`获取表 ${tableName} 的字段信息失败`)
    return []
  }
}

// 组件挂载时初始化
onMounted(async () => {
  if (props.dataSourceId) {
    try {
      await fetchMetadata()
    } catch (err) {
      console.error('初始化加载元数据失败:', err)
    }
  }
})

// 获取元数据
const fetchMetadata = async () => {
  if (!props.dataSourceId) {
    console.error('数据源ID为空，无法获取元数据')
    return
  }

  isLoading.value = true
  state.loading = true
  state.error = ''
  error.value = ''

  try {
    console.log('MetadataExplorer: 开始获取元数据...')
    
    // 从store获取元数据
    const metadata = await dataSourceStore.getDataSourceMetadata(props.dataSourceId)
    console.log('MetadataExplorer: 获取到元数据结果:', metadata)
    
    if (!metadata) {
      error.value = '未能获取到元数据'
      console.error('MetadataExplorer: 未能获取到元数据')
      return
    }

    // 尝试直接从API获取表列表（作为后备方案）
    if (!metadata.tables || metadata.tables.length === 0) {
      console.log('MetadataExplorer: 元数据中没有表，尝试直接API获取')
      try {
        const tablesData = await dataSourceService.getTableMetadata(props.dataSourceId)
        if (tablesData && tablesData.length > 0) {
          console.log('MetadataExplorer: API直接获取表成功', tablesData)
          tables.value = tablesData
          emit('tablesLoaded', tables.value)
          return
        }
      } catch (apiError) {
        console.error('MetadataExplorer: 直接API获取表失败', apiError)
      }
    }

    tables.value = metadata.tables || []
    console.log('MetadataExplorer: 设置表列表', tables.value.length)
    
    // 如果表为空显示错误提示
    if (tables.value.length === 0) {
      error.value = '无可用表，请检查数据库连接和权限'
      console.warn('MetadataExplorer: 表列表为空')
    } else {
      console.log('MetadataExplorer: 表加载完成, 数量:', tables.value.length)
    }
    
    emit('tablesLoaded', tables.value)
  } catch (err) {
    console.error('MetadataExplorer: 获取元数据失败:', err)
    error.value = err instanceof Error ? err.message : String(err)
    
    // 错误时，尝试直接获取表列表
    try {
      console.log('MetadataExplorer: 错误恢复，尝试直接API获取表')
      const tablesData = await dataSourceService.getTableMetadata(props.dataSourceId)
      if (tablesData && tablesData.length > 0) {
        console.log('MetadataExplorer: 错误恢复成功', tablesData)
        tables.value = tablesData
        error.value = '' // 清除错误
        emit('tablesLoaded', tables.value)
      }
    } catch (recoveryError) {
      console.error('MetadataExplorer: 错误恢复失败', recoveryError)
    }
  } finally {
    isLoading.value = false
  }
}

// 获取表名的辅助函数
const getTableName = (table: any): string => {
  if (table.name && typeof table.name === 'object' && 'name' in table.name) {
    return table.name.name;
  }
  return typeof table.name === 'string' ? table.name : '';
}

// 获取表显示名称
const getTableDisplayName = (table: TableMetadata): string => {
  return getTableName(table);
}

// 获取列类型显示
const getColumnTypeDisplay = (column: ColumnMetadata) => {
  return `${column.type}${column.size ? `(${column.size})` : ''}`
}

// 处理表格选择
const handleTableSelect = (table: TableMetadata) => {
  emit('table-select', table)
}

// 处理列选择
const handleColumnSelect = (column: ColumnMetadata, table: TableMetadata) => {
  emit('column-select', column, table)
}

// 向编辑器插入表名
const insertTableName = (tableName: string) => {
  emit('insert-table', tableName)
}

// 向编辑器插入列名
const insertColumnName = (columnName: string) => {
  emit('insert-column', columnName)
}

// 刷新元数据
const refreshMetadata = async () => {
  if (props.dataSourceId) {
    await fetchMetadata()
  }
}

// 清除搜索
const clearSearch = () => {
  searchTerm.value = ''
}

// 展开所有表格
const expandAllTables = () => {
  if (filteredTables.value.length > 0) {
    expandedTables.value = filteredTables.value.map((t) => getTableName(t))
  }
}

// 折叠所有表格
const collapseAllTables = () => {
  expandedTables.value = []
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- 搜索框 -->
    <div class="p-3 border-b border-gray-200">
      <div class="relative">
        <input
          v-model="searchTerm"
          type="text"
          class="w-full p-2 pl-8 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
          placeholder="搜索表或字段..."
        />
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 absolute left-2 top-2.5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
        <button
          v-if="searchTerm"
          class="absolute right-2 top-2.5 text-gray-400 hover:text-gray-600"
          @click="clearSearch"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="!props.dataSourceId" class="flex-grow flex items-center justify-center p-4">
      <p class="text-sm text-gray-500">请选择一个数据源</p>
    </div>
    
    <!-- 加载中或错误时 -->
    <div v-else-if="isLoading" class="flex-grow flex items-center justify-center p-4">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-6 w-6 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-sm text-gray-500">加载元数据...</span>
      </div>
    </div>
    
    <!-- 错误信息 -->
    <div v-else-if="error" class="flex-grow flex items-center justify-center p-4">
      <div class="flex flex-col items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500 mb-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-red-500">{{ error }}</p>
        <button
          class="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="refreshMetadata"
        >
          重试
        </button>
      </div>
    </div>
    
    <!-- 没有数据 -->
    <div v-else-if="filteredTables.length === 0" class="flex-grow flex items-center justify-center p-4">
      <div v-if="searchTerm" class="text-center">
        <p class="text-sm text-gray-500">无搜索结果</p>
        <button
          class="mt-2 px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="clearSearch"
        >
          清除搜索
        </button>
      </div>
      <div v-else class="flex flex-col items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400 mb-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 2h10v10H5V5z" clip-rule="evenodd" />
        </svg>
        <p class="text-sm text-gray-500">没有元数据可用</p>
      </div>
    </div>
    
    <!-- 元数据树 -->
    <div v-else class="flex-grow overflow-y-auto p-1">
      <div
        v-for="table in filteredTables"
        :key="table.name"
        class="mb-1 border rounded overflow-hidden"
      >
        <!-- 表头部 -->
        <div
          class="flex items-center justify-between px-2 py-1.5 bg-gray-50 cursor-pointer hover:bg-gray-100"
          @click="toggleTable(getTableName(table))"
        >
          <div class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M5 4a3 3 0 00-3 3v6a3 3 0 003 3h10a3 3 0 003-3V7a3 3 0 00-3-3H5zm0 2h10a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1z" clip-rule="evenodd" />
            </svg>
            <span class="font-medium text-sm truncate">{{ getTableDisplayName(table) }}</span>
          </div>
          <div class="flex items-center space-x-1">
            <button
              class="p-0.5 text-gray-500 hover:text-blue-600 focus:outline-none"
              title="插入表名"
              @click.stop="insertTableName(getTableName(table))"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
              </svg>
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-400"
              viewBox="0 0 20 20"
              fill="currentColor"
              :class="{'transform rotate-180': expandedTables.includes(getTableName(table))}"
            >
              <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </div>
        </div>
        
        <!-- 表列表 -->
        <div v-if="expandedTables.includes(getTableName(table))" class="border-t">
          <div
            v-for="column in table.columns"
            :key="`${table.name}-${column.name}`"
            class="flex items-center justify-between px-2 py-1 hover:bg-gray-50 text-sm border-b last:border-b-0"
            @click="handleColumnSelect(column, table)"
          >
            <div class="flex items-center pl-6">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 text-gray-400 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clip-rule="evenodd" />
              </svg>
              <span class="truncate">{{ column.name }}</span>
            </div>
            <div class="flex items-center">
              <span class="text-xs text-gray-500 mr-2">{{ getColumnTypeDisplay(column) }}</span>
              <button
                class="p-0.5 text-gray-500 hover:text-blue-600 focus:outline-none"
                title="插入列名"
                @click.stop="insertColumnName(column.name)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                  <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>