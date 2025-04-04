<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useQueryStore } from '@/stores/query'
import { useDataSourceStore } from '@/stores/datasource'
import { useDark, useToggle } from '@vueuse/core'

// 导入组件
import MetadataExplorer from '@/components/query/MetadataExplorer.vue'
import SqlEditor from '@/components/query/SqlEditor.vue'
import QueryResults from '@/components/query/QueryResults.vue'
import QueryHistory from '@/components/query/QueryHistory.vue'
import SaveQueryModal from '@/components/query/SaveQueryModal.vue'
import NaturalLanguageQuery from '@/components/query/NaturalLanguageQuery.vue'

// 暗黑模式
const isDark = useDark()
const toggleDark = useToggle(isDark)

// Store
const queryStore = useQueryStore()
const dataSourceStore = useDataSourceStore()

// 状态
const activeTab = ref<'editor' | 'nlq'>('editor')
const selectedDataSourceId = ref('')
const sqlQuery = ref('')
const nlQuery = ref('')
const isExecuting = ref(false)
const queryError = ref<string | null>(null)
const currentQueryId = ref<string | null>(null)
const isHistoryVisible = ref(true)
const isSaveModalVisible = ref(false)
const resultsPanelHeight = ref('50%')

// 元数据面板状态
const isMetadataPanelVisible = ref(true)
const metadataPanelWidth = ref('300px')

// 加载状态
onMounted(async () => {
  // 加载数据源
  if (dataSourceStore.dataSources.length === 0) {
    await dataSourceStore.fetchDataSources()
  }
  
  // 加载查询历史
  await queryStore.fetchQueryHistory()
  
  // 设置默认数据源
  if (dataSourceStore.dataSources.length > 0 && !selectedDataSourceId.value) {
    selectedDataSourceId.value = dataSourceStore.dataSources[0].id
  }
})

// 计算属性：选中的数据源
const selectedDataSource = computed(() => {
  return dataSourceStore.dataSources.find(ds => ds.id === selectedDataSourceId.value) || null
})

// 计算属性：是否可以执行查询
const canExecuteQuery = computed(() => {
  if (!selectedDataSourceId.value) return false
  
  if (activeTab.value === 'editor') {
    return sqlQuery.value.trim().length > 0
  } else {
    return nlQuery.value.trim().length > 0
  }
})

// 执行SQL查询
const executeQuery = async () => {
  if (!canExecuteQuery.value || isExecuting.value) return
  
  isExecuting.value = true
  queryError.value = null
  
  try {
    // 根据当前活动标签页选择查询内容
    const query = activeTab.value === 'editor' ? sqlQuery.value : nlQuery.value
    const queryType = activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE'
    
    // 执行查询
    await queryStore.executeQuery({
      dataSourceId: selectedDataSourceId.value,
      queryText: query,
      queryType
    })
    
    // 更新当前查询ID
    currentQueryId.value = queryStore.currentQueryResult?.id || null
  } catch (error) {
    queryError.value = error instanceof Error ? error.message : '执行查询时出错'
  } finally {
    isExecuting.value = false
  }
}

// 取消查询
const cancelQuery = async () => {
  if (!currentQueryId.value) return
  
  try {
    await queryStore.cancelQuery(currentQueryId.value)
  } catch (error) {
    console.error('取消查询失败:', error)
  }
}

// 保存查询
const saveQuery = () => {
  isSaveModalVisible.value = true
}

// 处理保存查询
const handleSaveQuery = async (query: any) => {
  try {
    await queryStore.saveQuery({
      ...query,
      dataSourceId: selectedDataSourceId.value,
      queryText: activeTab.value === 'editor' ? sqlQuery.value : nlQuery.value,
      queryType: activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE'
    })
  } catch (error) {
    console.error('保存查询失败:', error)
  }
}

// 加载历史查询
const loadQueryFromHistory = (query: any) => {
  selectedDataSourceId.value = query.dataSourceId
  
  if (query.queryType === 'SQL') {
    activeTab.value = 'editor'
    sqlQuery.value = query.queryText
  } else {
    activeTab.value = 'nlq'
    nlQuery.value = query.queryText
  }
}

// 导出查询结果
const exportResults = (format: 'csv' | 'excel' | 'json') => {
  if (!queryStore.currentQueryResult) return
  
  queryStore.exportQueryResults(queryStore.currentQueryResult.id, format)
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

// 切换元数据面板显示
const toggleMetadataPanel = () => {
  isMetadataPanelVisible.value = !isMetadataPanelVisible.value
}

// 调整元数据面板宽度（用于拖拽实现）
const startResizeMetadataPanel = (e: MouseEvent) => {
  const startX = e.clientX
  const startWidth = parseInt(metadataPanelWidth.value)
  
  const doResize = (e: MouseEvent) => {
    const newWidth = startWidth + (e.clientX - startX)
    metadataPanelWidth.value = `${Math.max(200, Math.min(500, newWidth))}px`
  }
  
  const stopResize = () => {
    document.removeEventListener('mousemove', doResize)
    document.removeEventListener('mouseup', stopResize)
  }
  
  document.addEventListener('mousemove', doResize)
  document.addEventListener('mouseup', stopResize)
}

// 调整结果面板高度（用于拖拽实现）
const startResizeResultsPanel = (e: MouseEvent) => {
  const startY = e.clientY
  const container = e.currentTarget?.parentElement as HTMLElement | null
  if (!container) return
  
  const containerRect = container.getBoundingClientRect()
  const startPercentage = parseInt(resultsPanelHeight.value)
  
  const doResize = (e: MouseEvent) => {
    const deltaY = startY - e.clientY
    const containerHeight = containerRect.height
    const newHeightPixels = (containerHeight * startPercentage / 100) + deltaY
    const newHeightPercentage = (newHeightPixels / containerHeight) * 100
    
    resultsPanelHeight.value = `${Math.max(20, Math.min(80, newHeightPercentage))}%`
  }
  
  const stopResize = () => {
    document.removeEventListener('mousemove', doResize)
    document.removeEventListener('mouseup', stopResize)
  }
  
  document.addEventListener('mousemove', doResize)
  document.addEventListener('mouseup', stopResize)
}
</script>

<template>
  <div class="flex flex-col h-full bg-gray-100">
    <!-- 顶部工具栏 -->
    <div class="py-4 px-6 bg-white shadow-sm border-b border-gray-200">
      <div class="flex justify-between items-center">
        <div class="flex items-center space-x-4">
          <!-- 数据源选择 -->
          <div class="w-64">
            <label class="block text-sm text-gray-600 mb-1">数据源</label>
            <select
              v-model="selectedDataSourceId"
              class="w-full bg-white border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option v-for="ds in dataSourceStore.dataSources" :key="ds.id" :value="ds.id">
                {{ ds.name }}
              </option>
            </select>
          </div>
          
          <!-- 标签页切换 -->
          <div class="flex mt-5">
            <button
              @click="activeTab = 'editor'"
              :class="[
                'px-4 py-2 text-sm font-medium border-b-2 focus:outline-none',
                activeTab === 'editor'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              SQL 编辑器
            </button>
            <button
              @click="activeTab = 'nlq'"
              :class="[
                'px-4 py-2 text-sm font-medium border-b-2 focus:outline-none',
                activeTab === 'nlq'
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              ]"
            >
              自然语言查询
            </button>
          </div>
        </div>
        
        <div class="flex items-center space-x-3">
          <!-- 执行/取消按钮 -->
          <button
            v-if="!isExecuting"
            @click="executeQuery"
            :disabled="!canExecuteQuery"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <i class="fas fa-play mr-2"></i>
            执行
          </button>
          <button
            v-else
            @click="cancelQuery"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <i class="fas fa-stop mr-2"></i>
            取消
          </button>
          
          <!-- 保存按钮 -->
          <button
            @click="saveQuery"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-save mr-2"></i>
            保存
          </button>
          
          <!-- 导出按钮 -->
          <div class="relative" v-if="queryStore.hasResult">
            <button
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-download mr-2"></i>
              导出
            </button>
            <!-- 导出选项下拉菜单 -->
            <!-- ... 省略 ... -->
          </div>
          
          <!-- 暗黑模式切换 -->
          <button
            @click="toggleDark()"
            class="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas" :class="isDark ? 'fa-sun' : 'fa-moon'"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- 主内容区 -->
    <div class="flex flex-1 overflow-hidden">
      <!-- 元数据面板 -->
      <div v-if="isMetadataPanelVisible" class="h-full flex flex-col border-r border-gray-200 bg-white shadow-sm" :style="{ width: metadataPanelWidth }">
        <MetadataExplorer
          :data-source-id="selectedDataSourceId"
          @table-select="handleTableSelect"
          @column-select="handleColumnSelect"
          @insert-table="insertTableName"
          @insert-column="insertColumnName"
        />
        <!-- 调整大小控制器 -->
        <div class="w-1 h-full bg-gray-200 hover:bg-indigo-400 absolute right-0 top-0 cursor-col-resize" @mousedown="startResizeMetadataPanel"></div>
      </div>
      
      <!-- 内容和结果区域 -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- 查询编辑区 -->
        <div class="flex-1 overflow-hidden" :style="{ height: `calc(100% - ${resultsPanelHeight})` }">
          <!-- SQL编辑器 -->
          <div v-if="activeTab === 'editor'" class="h-full">
            <SqlEditor v-model="sqlQuery" :data-source-id="selectedDataSourceId" />
          </div>
          
          <!-- 自然语言查询 -->
          <div v-else-if="activeTab === 'nlq'" class="h-full">
            <NaturalLanguageQuery v-model="nlQuery" :data-source-id="selectedDataSourceId" />
          </div>
        </div>
        
        <!-- 调整大小控制器 -->
        <div class="w-full h-2 bg-gray-200 hover:bg-indigo-400 cursor-row-resize" @mousedown="startResizeResultsPanel"></div>
        
        <!-- 查询结果区 -->
        <div class="bg-white shadow-md border-t border-gray-200 overflow-hidden" :style="{ height: resultsPanelHeight }">
          <QueryResults
            :results="queryStore.currentQueryResult"
            :is-loading="isExecuting"
            :error="queryError"
            :query-id="queryStore.currentQuery?.id"
            @export-results="exportResults"
          />
        </div>
      </div>
      
      <!-- 历史面板 -->
      <div v-if="isHistoryVisible" class="bg-white border-l border-gray-200 shadow-sm" style="width: 320px">
        <div class="h-full">
          <QueryHistory @select-query="loadQueryFromHistory" />
        </div>
      </div>
    </div>
    
    <!-- 保存查询对话框 -->
    <SaveQueryModal
      v-if="isSaveModalVisible"
      :open="isSaveModalVisible"
      @update:open="isSaveModalVisible = $event"
      :query="activeTab === 'editor' ? sqlQuery : nlQuery"
      :query-type="activeTab === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE'"
      @save="handleSaveQuery"
    />
  </div>
</template>

<style scoped>
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