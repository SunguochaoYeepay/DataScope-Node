<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import type { DataSource } from '@/types/datasource'
import type { TableMetadata, ColumnMetadata } from '@/types/metadata'
import { useDataSourceStore } from '@/stores/datasource'
import { message } from '@/services/message'
import TableDataPreview from './TableDataPreview.vue'

// 组件属性
const props = defineProps<{
  dataSourceId: string
}>()

// 组件事件
const emit = defineEmits<{
  (e: 'edit', dataSource: DataSource): void
  (e: 'refresh'): void
  (e: 'delete', dataSource: DataSource): void
}>()

// 数据源状态管理
const dataSourceStore = useDataSourceStore()

// 组件状态
const isLoading = ref(true)
const isMetadataLoading = ref(false)
const isSyncingMetadata = ref(false)
const selectedTable = ref<string | null>(null)
const expandedTables = ref<Set<string>>(new Set())
const dataSource = ref<DataSource | null>(null)
const tables = ref<TableMetadata[]>([])
const searchKeyword = ref('')
const viewMode = ref<'metadata' | 'preview'>('metadata')

// 加载数据源信息
const loadDataSource = async () => {
  isLoading.value = true
  
  try {
    dataSource.value = await dataSourceStore.getDataSourceById(props.dataSourceId)
  } catch (err) {
    console.error('加载数据源详情失败:', err)
    message.error('加载数据源详情失败')
  } finally {
    isLoading.value = false
  }
}

// 加载元数据
const loadMetadata = async () => {
  if (!dataSource.value) return
  
  isMetadataLoading.value = true
  
  try {
    console.log('开始加载数据源元数据，dataSourceId:', dataSource.value.id)
    
    // 直接从API获取表列表
    try {
      const response = await fetch(`http://localhost:5000/api/metadata/${dataSource.value.id}/tables`)
      const data = await response.json()
      console.log('从API获取到的元数据:', data)
      
      if (data.success && Array.isArray(data.data)) {
        tables.value = data.data
        console.log('设置表格数据:', tables.value.length, '张表')
      } else if (data.success && data.data && data.data.tablesCount) {
        // 如果只返回了表计数，显示空表列表
        console.log('后端只返回了表计数:', data.data.tablesCount)
        tables.value = []
      } else {
        // 尝试从store获取
        const metadata = await dataSourceStore.getDataSourceMetadata(dataSource.value.id)
        if (metadata && Array.isArray(metadata.tables)) {
          tables.value = metadata.tables
        } else {
          tables.value = []
        }
      }
    } catch (error) {
      console.error('直接从API获取表列表失败:', error)
      
      // 回退到使用store
      try {
        const metadata = await dataSourceStore.getDataSourceMetadata(dataSource.value.id)
        if (metadata && Array.isArray(metadata.tables)) {
          tables.value = metadata.tables
        } else {
          tables.value = []
        }
      } catch (storeError) {
        console.error('从store获取元数据失败:', storeError)
        tables.value = []
      }
    }
  } catch (err) {
    console.error('加载元数据失败:', err)
    message.error('加载元数据失败')
    tables.value = []
  } finally {
    isMetadataLoading.value = false
  }
}

// 同步元数据
const syncMetadata = async () => {
  if (!dataSource.value) return
  
  isSyncingMetadata.value = true
  
  try {
    // 直接调用同步API
    try {
      const response = await fetch(`http://localhost:5000/api/metadata/${dataSource.value.id}/sync`, {
        method: 'POST'
      })
      const data = await response.json()
      console.log('同步元数据响应:', data)
      
      if (data.success) {
        message.success('元数据同步成功')
      } else {
        message.warning('元数据同步可能未完成')
      }
    } catch (error) {
      console.error('直接调用同步API失败:', error)
      
      // 回退到使用store
      await dataSourceStore.syncDataSourceMetadata(dataSource.value.id)
      message.success('元数据同步成功')
    }
    
    // 无论哪种方式，都重新加载元数据
    await loadMetadata()
  } catch (err) {
    console.error('同步元数据失败:', err)
    message.error('同步元数据失败')
  } finally {
    isSyncingMetadata.value = false
  }
}

// 搜索表
const filteredTables = computed(() => {
  if (!searchKeyword.value.trim()) {
    return tables.value
  }
  
  const keyword = searchKeyword.value.toLowerCase().trim()
  
  return tables.value.filter(table => {
    return table.name.toLowerCase().includes(keyword)
  })
})

// 获取表的列数量
const getColumnCount = (table: TableMetadata) => {
  return table.columns ? table.columns.length : 0
}

// 切换表展开状态
const toggleTableExpand = (tableName: string) => {
  if (expandedTables.value.has(tableName)) {
    expandedTables.value.delete(tableName)
  } else {
    expandedTables.value.add(tableName)
  }
}

// 检查表是否展开
const isTableExpanded = (tableName: string) => {
  return expandedTables.value.has(tableName)
}

// 选择表并查看数据预览
const selectTable = (tableName: string) => {
  selectedTable.value = tableName
  viewMode.value = 'preview' // 切换到预览模式
}

// 返回元数据视图
const backToMetadata = () => {
  viewMode.value = 'metadata'
  selectedTable.value = null
}

// 获取数据源类型名称
const getDataSourceTypeName = (type: string) => {
  const typeMap: Record<string, string> = {
    'MYSQL': 'MySQL',
    'POSTGRESQL': 'PostgreSQL',
    'ORACLE': 'Oracle',
    'SQLSERVER': 'SQL Server',
    'MONGODB': 'MongoDB',
    'ELASTICSEARCH': 'Elasticsearch'
  }
  
  return typeMap[type] || type
}

// 格式化同步频率
const formatSyncFrequency = (frequency: string) => {
  const frequencyMap: Record<string, string> = {
    'MANUAL': '手动',
    'HOURLY': '每小时',
    'DAILY': '每天',
    'WEEKLY': '每周',
    'MONTHLY': '每月'
  }
  
  return frequencyMap[frequency] || frequency
}

// 处理编辑
const handleEdit = () => {
  if (dataSource.value) {
    emit('edit', dataSource.value)
  }
}

// 处理删除
const handleDelete = () => {
  if (dataSource.value) {
    if (confirm(`确定要删除数据源 "${dataSource.value.name}" 吗？此操作不可撤销。`)) {
      emit('delete', dataSource.value)
    }
  }
}

// 刷新数据
const handleRefresh = () => {
  loadDataSource()
  loadMetadata()
  emit('refresh')
}

// 组件挂载
onMounted(() => {
  loadDataSource()
  loadMetadata()
})
</script>

<template>
  <div class="bg-white shadow rounded-lg overflow-hidden">
    <div v-if="isLoading" class="p-6 text-center">
      <div class="animate-pulse flex justify-center">
        <div class="h-6 w-6 bg-indigo-200 rounded-full"></div>
      </div>
      <p class="mt-2 text-sm text-gray-500">加载数据源信息...</p>
    </div>
    
    <template v-else-if="dataSource">
      <!-- 数据源基本信息 -->
      <div class="border-b border-gray-200">
        <div class="px-6 py-5 sm:flex sm:items-center sm:justify-between">
          <div>
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              {{ dataSource.name }}
            </h3>
            <p class="mt-1 max-w-2xl text-sm text-gray-500">
              {{ dataSource.description || '无描述' }}
            </p>
          </div>
          <div class="mt-3 flex sm:mt-0 sm:ml-4">
            <button
              type="button"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
              @click="handleEdit"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              编辑
            </button>
            <button
              type="button"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-2"
              @click="handleDelete"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              删除
            </button>
            <button
              type="button"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="handleRefresh"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              刷新
            </button>
          </div>
        </div>
      </div>
      
      <!-- 详细信息 -->
      <div class="px-6 py-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <!-- 左侧：连接信息 -->
        <div>
          <h4 class="text-base font-medium text-gray-700 mb-4">连接信息</h4>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">类型</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ getDataSourceTypeName(dataSource.type) }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">状态</dt>
              <dd class="mt-1 text-sm">
                <span
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="dataSource.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ dataSource.status === 'ACTIVE' ? '活跃' : '未连接' }}
                </span>
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">连接字符串</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ `${dataSource.type.toLowerCase()}://${dataSource.host}:${dataSource.port}/${dataSource.databaseName}` }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">主机</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ dataSource.host }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">端口</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ dataSource.port }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">数据库名称</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ dataSource.databaseName }}</dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">用户名</dt>
              <dd class="mt-1 text-sm text-gray-900">{{ dataSource.username }}</dd>
            </div>
          </dl>
        </div>
        
        <!-- 右侧：高级设置 -->
        <div>
          <h4 class="text-base font-medium text-gray-700 mb-4">高级设置</h4>
          <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">同步频率</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ formatSyncFrequency(dataSource.syncFrequency) }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">最后同步时间</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ dataSource.lastSyncTime ? new Date(dataSource.lastSyncTime).toLocaleString() : '从未同步' }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">创建时间</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(dataSource.createdAt).toLocaleString() }}
              </dd>
            </div>
            <div class="sm:col-span-1">
              <dt class="text-sm font-medium text-gray-500">最后更新时间</dt>
              <dd class="mt-1 text-sm text-gray-900">
                {{ new Date(dataSource.updatedAt).toLocaleString() }}
              </dd>
            </div>
            <div class="sm:col-span-2">
              <dt class="text-sm font-medium text-gray-500">连接选项</dt>
              <dd class="mt-1 text-sm text-gray-900">
                <div v-if="dataSource.connectionOptions && Object.keys(dataSource.connectionOptions).length > 0">
                  <ul class="list-disc pl-5 text-sm">
                    <li v-for="(value, key) in dataSource.connectionOptions" :key="key">
                      {{ key }}: {{ value }}
                    </li>
                  </ul>
                </div>
                <div v-else class="text-gray-500 text-sm">无附加连接选项</div>
              </dd>
            </div>
          </dl>
        </div>
      </div>
      
      <!-- 元数据部分 -->
      <div class="border-t border-gray-200 px-6 py-5">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-base font-medium text-gray-700">数据库元数据</h4>
          <div class="flex">
            <div class="mr-2 relative rounded-md shadow-sm">
              <input
                v-model="searchKeyword"
                type="text"
                class="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="搜索表..."
              />
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              type="button"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              :disabled="isSyncingMetadata"
              @click="syncMetadata"
            >
              <template v-if="isSyncingMetadata">
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                同步中...
              </template>
              <template v-else>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                同步元数据
              </template>
            </button>
          </div>
        </div>
        
        <div v-if="isMetadataLoading" class="text-center py-4">
          <div class="animate-pulse flex justify-center">
            <div class="h-6 w-6 bg-indigo-200 rounded-full"></div>
          </div>
          <p class="mt-2 text-sm text-gray-500">加载元数据中...</p>
        </div>
        
        <div v-else-if="filteredTables.length === 0" class="text-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p class="mt-2 text-sm text-gray-500">
            {{ searchKeyword ? '没有找到匹配的表' : '暂无表结构数据，请点击"同步元数据"按钮' }}
          </p>
        </div>
        
        <div v-else class="overflow-hidden border border-gray-200 rounded-md">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  表名
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  类型
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  列数
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <template v-for="table in filteredTables" :key="table.name">
                <tr
                  @click="toggleTableExpand(table.name)"
                  class="hover:bg-gray-50 cursor-pointer"
                  :class="{ 'bg-gray-50': isTableExpanded(table.name) }"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div class="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-4 w-4 mr-2 text-gray-400 transform transition-transform"
                        :class="isTableExpanded(table.name) ? 'rotate-90' : ''"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                      </svg>
                      {{ table.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ table.type || 'TABLE' }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {{ getColumnCount(table) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      @click.stop="selectTable(table.name)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      查看
                    </button>
                  </td>
                </tr>
                
                <!-- 展开的列信息 -->
                <tr v-if="isTableExpanded(table.name)" class="bg-gray-50">
                  <td colspan="4" class="px-6 py-4">
                    <div class="overflow-x-auto">
                      <table class="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-md">
                        <thead class="bg-gray-100">
                          <tr>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              列名
                            </th>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              数据类型
                            </th>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              是否可为空
                            </th>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              主键
                            </th>
                            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              默认值
                            </th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr v-for="column in table.columns" :key="column.name" class="hover:bg-gray-50">
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {{ column.name }}
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {{ column.type }}
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              <span
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                                :class="column.nullable ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'"
                              >
                                {{ column.nullable ? '是' : '否' }}
                              </span>
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              <span
                                v-if="column.primaryKey"
                                class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800"
                              >
                                是
                              </span>
                              <span v-else>否</span>
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                              {{ column.defaultValue !== null ? column.defaultValue : '-' }}
                            </td>
                          </tr>
                          <tr v-if="!table.columns || table.columns.length === 0">
                            <td colspan="5" class="px-4 py-2 whitespace-nowrap text-sm text-gray-500 text-center">
                              无列信息
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- 表数据预览 -->
      <div v-if="viewMode === 'preview' && selectedTable" class="border-t border-gray-200 px-6 py-5">
        <div class="flex justify-between items-center mb-4">
          <h4 class="text-base font-medium text-gray-700">{{ selectedTable }} - 数据预览</h4>
          <button
            type="button"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            @click="backToMetadata"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回表结构
          </button>
        </div>
        
        <TableDataPreview
          :data-source-id="dataSource.id"
          :table-name="selectedTable"
          :initial-page-size="10"
        />
      </div>
    </template>
    
    <template v-else>
      <div class="p-6 text-center">
        <p class="text-gray-500">数据源不存在或已被删除</p>
      </div>
    </template>
  </div>
</template>