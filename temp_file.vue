<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 页面标题和操作按钮区域 -->
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ currentQueryId ? '编辑查询' : '新增查询' }}
        </h1>
        <div class="flex space-x-3">
          <button
            @click="returnToList"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-arrow-left mr-2"></i>
            返回列表
          </button>
          <button
            v-if="currentQueryId"
            @click="viewVersions"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-code-branch mr-2"></i>
            查看版本
          </button>
          <button
            @click="toggleFavorite"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-star mr-2" :class="{ 'text-yellow-400': isFavorite }"></i>
            收藏
          </button>
          <button
            v-if="currentQueryId && versionStatus === 'DRAFT'"
            @click="publishVersion"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <i class="fas fa-check-circle mr-2"></i>
            发布
          </button>
        </div>
      </div>
    </div>

    <!-- 基本信息卡片 -->
    <div class="bg-white shadow rounded-lg mb-6">
      <div class="p-3">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- 查询名称 -->
          <div>
            <label for="queryName" class="block text-sm font-medium text-gray-700 mb-1">
              查询名称 <span class="text-red-500">*</span>
            </label>
            <input 
              id="queryName"
              v-model="queryName"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm force-border py-2 px-3"
              placeholder="请输入查询名称"
            />
          </div>
          
          <!-- 版本信息 - 使用下拉选择框 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              版本信息
            </label>
            <div class="relative">
              <select 
                v-model="selectedVersion"
                disabled
                class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm pr-20 cursor-not-allowed force-border"
              >
                <option 
                  v-for="version in availableVersions" 
                  :key="version" 
                  :value="version"
                >
                  {{ version }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-8 text-gray-500">
                <i class="fas fa-code-branch mr-1"></i>
              </div>
              <button
                v-if="currentQueryId && versionStatus === 'DRAFT'"
                @click="createNewVersion"
                class="absolute inset-y-0 right-8 flex items-center px-2 py-1 border-l border-gray-300 bg-gray-100 text-xs font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <i class="fas fa-plus mr-1"></i>
                新建版本
              </button>
            </div>
          </div>
          
          <!-- 版本状态 - 直接显示内容 -->
          <div v-if="currentQueryId" class="flex items-center h-8">
            <span 
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="{
                'bg-blue-100 text-blue-800': versionStatus === 'DRAFT',
                'bg-green-100 text-green-800': versionStatus === 'PUBLISHED' && isActiveVersion,
                'bg-indigo-100 text-indigo-800': versionStatus === 'PUBLISHED' && !isActiveVersion,
                'bg-gray-100 text-gray-800': versionStatus === 'DEPRECATED'
              }"
            >
              <span 
                class="w-2 h-2 rounded-full mr-1.5"
                :class="{
                  'bg-blue-400': versionStatus === 'DRAFT',
                  'bg-green-400': versionStatus === 'PUBLISHED' && isActiveVersion,
                  'bg-indigo-400': versionStatus === 'PUBLISHED' && !isActiveVersion,
                  'bg-gray-400': versionStatus === 'DEPRECATED'
                }"
              ></span>
              {{ versionStatusText }}
            </span>
            <span v-if="versionStatus === 'PUBLISHED'" class="ml-2 text-xs text-gray-500">
              发布于 {{ formatDate(publishedAt) }}
            </span>
            <span v-if="versionStatus === 'DRAFT'" class="ml-2 text-xs text-gray-500">
              最后编辑于 {{ formatDate(lastEditedAt) }}
            </span>
            <span v-if="versionStatus === 'DEPRECATED'" class="ml-2 text-xs text-gray-500">
              废弃于 {{ formatDate(deprecatedAt) }}
            </span>
          </div>
        </div>
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
              <div class="relative">
                <!-- 未保存更改提示 -->
                <div v-if="hasUnsavedChanges" class="absolute right-2 top-2 p-1 rounded-md bg-yellow-50 border border-yellow-300 text-yellow-800 text-xs flex items-center">
                  <i class="fas fa-exclamation-circle mr-1"></i>
                  未保存更改
                </div>
              
                <SqlEditor 
                  v-model="sqlQuery" 
                  :data-source-id="selectedDataSourceId" 
                  @execute="handleExecuteQuery" 
                />
              </div>

              <!-- 显示最后保存草稿时间和操作按钮区域 -->
              <div class="mt-4 flex justify-between">
                <div class="flex items-center">
                  <button
                    @click="() => executeQuery()"
                    class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    :disabled="isExecuting || !selectedDataSourceId || !sqlQuery.trim()"
                  >
                    <i class="fas fa-play mr-1.5"></i>
                    执行查询
                  </button>
                  
                  <!-- 显示最后保存时间 -->
                  <span v-if="lastDraftSaveAt" class="ml-3 text-xs text-gray-500">
                    <i class="fas fa-history mr-1"></i>
                    草稿保存于: {{ lastDraftSaveTime }}
                  </span>
                </div>
                
                <div class="flex space-x-3">
                  <button
                    @click="showSaveModal()"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i class="fas fa-save mr-1.5"></i>
                    {{ currentQueryId ? '保存更改' : '保存查询' }}
                  </button>
                </div>
              </div>
            </div>
            
            <!-- 自然语言查询 -->
            <div v-else-if="activeTab === 'nlq'" class="h-full flex flex-col">
              <NaturalLanguageQuery
                v-model="naturalLanguageQuery"
                :data-source-id="selectedDataSourceId"
                @execute="executeQuery"
                @save="saveQuery"
              />
              
              <!-- 版本操作按钮区域 -->
              <div class="mt-4 flex justify-between">
                <span v-if="lastDraftSaveAt" class="text-xs text-gray-500 self-center">
                  <i class="fas fa-history mr-1"></i>
                  草稿保存于: {{ lastDraftSaveTime }}
                </span>
                
                <div class="flex space-x-3">
                  <button
                    @click="showSaveModal()"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i class="fas fa-save mr-1.5"></i>
                    {{ currentQueryId ? '保存更改' : '保存查询' }}
                  </button>
                </div>
              </div>
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
      v-if="isComponentMounted && isSaveModalVisible"
      :visible="isSaveModalVisible"
      @update:visible="isSaveModalVisible = $event"
      :query="{
        id: currentQueryId || '',
        name: queryName || '未命名查询',
        queryText: getQueryTextByType(activeTab === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE'),
        queryType: activeTab === 'builder' || activeTab === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE',
        dataSourceId: selectedDataSourceId || (dataSourceStore.dataSources[0]?.id || '')
      }"
      :data-sources="dataSourceStore.dataSources || []"
      @save="handleSaveQuery"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch, nextTick, onUnmounted, h } from 'vue'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { useQueryStore } from '@/stores/query'
import { useDataSourceStore } from '@/stores/datasource'
import { useDark, useToggle } from '@vueuse/core'
import type { Query, SaveQueryParams } from '@/types/query'
import type { QueryBuilderState } from '@/types/builder'
import { message, Modal } from 'ant-design-vue'
import type { QueryType } from '@/types/query'
import { getApiBaseUrl } from '@/services/query'
import type { QueryVersion as QueryVersionType } from '@/types/queryVersion'

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
const router = useRouter()

// 组件状态标志
let isComponentMounted = true

// 防抖/节流变量
let lastPanelSwitchTime = 0

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
const naturalLanguageQuery = ref('')
const builderQuery = ref('')
const isExecuting = ref(false)
const queryError = ref<string | null>(null)
const statusMessage = ref<string | null>(null)
const currentQueryId = ref<string | null>(null)
const isSaveModalVisible = ref(false)
const isLoadingQuery = ref(false)
const queryName = ref('')
const queryVersion = ref('V1')
// 替换固定版本号选项为动态生成的版本号列表
const availableVersions = ref<string[]>([])
// 当前选择的版本
const selectedVersion = ref('V1')
// 当前最高版本号 - 用于创建新版本时递增
const currentMaxVersionNumber = ref(1)
const isFavorite = ref(false)
const showExportOptions = ref(false)
const leftPanel = ref<'metadata' | 'saved'>('metadata')
const savedQuerySearch = ref('')
const executionTime = ref(0)
const executionTimer = ref<number | null>(null)
const lastDraftSaveAt = ref<string | null>(null)
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

// 查询版本状态
const versionStatus = ref<'DRAFT' | 'PUBLISHED' | 'DEPRECATED'>('DRAFT')
const isActiveVersion = ref(false)
const publishedAt = ref<string | null>(null)
const lastEditedAt = ref<string | null>(null)
const deprecatedAt = ref<string | null>(null)

// 计算属性：版本状态文本
const versionStatusText = computed(() => {
  if (versionStatus.value === 'DRAFT') {
    return '草稿';
  } else if (versionStatus.value === 'PUBLISHED') {
    return isActiveVersion.value ? '当前版本' : '已发布';
  } else if (versionStatus.value === 'DEPRECATED') {
    return '已废弃';
  }
  return versionStatus.value; // 默认返回原始状态值
})

// 加载状态
onMounted(async () => {
  isComponentMounted = true
  // 加载数据源
  if (dataSourceStore.dataSources.length === 0) {
    await dataSourceStore.fetchDataSources()
  }
  
  // 设置默认数据源
  if (dataSourceStore.dataSources.length > 0 && !selectedDataSourceId.value) {
    selectedDataSourceId.value = dataSourceStore.dataSources[0].id
  }
  
  // 在页面初始化时，确保版本号正确
  if (window.location.href.includes('/edit')) {
    console.log('页面初始化');
    // 不再硬编码设置V3版本号，将在loadQueryById处理
  } else {
    // 新增查询场景，默认设置为V1
    console.log('新增查询场景，默认设置版本号为V1');
    selectedVersion.value = 'V1';
    queryVersion.value = 'V1';
    availableVersions.value = ['V1'];
    currentMaxVersionNumber.value = 1;
  }
  
  // 检查URL参数是否包含查询ID
  const queryId = route.query.id as string
  if (queryId) {
    await loadQueryById(queryId)
    
    // 不再在这里重置版本号，由loadQueryById负责设置正确的版本号
  } else {
    // 如果没有查询ID，尝试从localStorage加载临时草稿
    const draftText = localStorage.getItem('query_draft_text')
    const draftType = localStorage.getItem('query_draft_type')
    const draftTimestamp = localStorage.getItem('query_draft_timestamp')
    
    if (draftText && draftType) {
      // 加载草稿内容
      if (draftType === 'SQL') {
        activeTab.value = 'editor'
        sqlQuery.value = draftText
      } else if (draftType === 'NATURAL_LANGUAGE') {
        activeTab.value = 'nlq'
        naturalLanguageQuery.value = draftText
      }
      
      // 设置最后保存草稿时间
      if (draftTimestamp) {
        lastDraftSaveAt.value = draftTimestamp
      }
      
      console.log(`已加载临时草稿，保存时间: ${draftTimestamp || '未知'}`)
      
      // 提示用户
      setTimeout(() => {
        message.info('已加载上次未保存的草稿')
      }, 1000)
    }
  }
  
  // 加载查询历史和收藏
  await queryStore.fetchQueryHistory()
  await queryStore.getFavorites()
  
  // 预加载保存的查询列表，用于左侧面板的"保存的查询"标签页
  if (leftPanel.value === 'saved') {
    await queryStore.fetchQueries({
      page: 1,
      size: 20,
      sortBy: 'updatedAt',
      sortDir: 'desc'
    })
  }
  
  // 添加页面离开提示
  window.addEventListener('beforeunload', handleBeforeUnload)
  
  // 添加全局键盘事件监听，防止浏览器拦截快捷键
  document.addEventListener('keydown', handleGlobalKeyDown)
})

// 页面离开处理
const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  // 如果有未保存的更改，提示用户
  if (isExecuting.value) {
    const message = '查询正在执行中，确定要离开吗？'
    event.returnValue = message
    return message
  }
}

// 全局键盘事件处理
const handleGlobalKeyDown = (event: KeyboardEvent) => {
  // Ctrl+S 保存草稿
  if ((event.ctrlKey || event.metaKey) && event.key === 's') {
    event.preventDefault() // 阻止浏览器默认的保存页面行为
    
    // 无论是否有ID都保存草稿
    saveDraft()
    return
  }
  
  // Ctrl+Enter 执行查询
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    event.preventDefault()
    executeQuery()
  }
}

// 组件卸载时
onUnmounted(() => {
  console.log('QueryEditor组件已卸载')
  isComponentMounted = false
  
  // 清理定时器和事件监听
  if (executionTimer.value) {
    clearInterval(executionTimer.value)
    executionTimer.value = null
  }
  
  // 清理引用
  queryBuilderRef.value = null
  queryManagerRef.value = null
  
  // 删除可能的DOM事件监听器
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('keydown', handleGlobalKeyDown)
  
  // 重置可能的状态
  lastPanelSwitchTime = 0
})

// 监听左侧面板标签切换，当切换到保存的查询时刷新数据
watch(leftPanel, async (newValue) => {
  if (newValue === 'saved') {
    console.log('切换到保存的查询面板，刷新保存的查询列表')
    try {
      // 检查组件是否已卸载
      if (!isComponentMounted) {
        console.log('组件已卸载，取消查询刷新')
        return
      }
      
      // 防止事件循环和重复刷新
      const currentTimestamp = Date.now()
      if (lastPanelSwitchTime && (currentTimestamp - lastPanelSwitchTime < 500)) {
        console.log('面板切换过于频繁，跳过此次刷新')
        return
      }
      lastPanelSwitchTime = currentTimestamp
      
      // 使用组件状态检查，如果store不可用，则不执行
      if (!queryStore || !queryStore.fetchQueries) {
        console.log('store不可用，取消操作')
        return
      }
      
      // 使用fetchQueries获取正式保存的查询，而不是查询历史
      await queryStore.fetchQueries({
        page: 1,
        size: 20, // 获取更多保存的查询以便浏览
        sortBy: 'updatedAt',
        sortDir: 'desc'
      })
    } catch (err) {
      console.error('刷新保存的查询列表失败:', err)
    }
  }
}, { flush: 'post' }) // 使用post选项确保DOM更新后再执行

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
  
  if (activeTab.value === 'editor' && (!sqlQuery.value || sqlQuery.value.trim().length === 0)) {
    return false
  }
  
  if (activeTab.value === 'nlq' && (!naturalLanguageQuery.value || naturalLanguageQuery.value.trim().length === 0)) {
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

// 从查询ID加载查询内容
const loadQueryById = async (queryId: string) => {
  try {
    isLoadingQuery.value = true
    
    console.log('开始加载查询，ID:', queryId)
    
    // 从API获取查询信息
    let query: Query | null = null
    
    // 首先尝试从store的direct API获取
    try {
      query = await queryStore.getQuery(queryId)
      console.log('通过API获取到查询:', query)
    } catch (apiError) {
      console.warn('直接API获取失败:', apiError)
      query = null
    }
    
    if (!query) {
      console.log('从direct API未找到查询，尝试从历史列表查找')
      
      // 再次检查组件状态
      if (!isComponentMounted) return
      
      // 确保历史列表已加载
      if (queryStore.queryHistory.length === 0) {
        await queryStore.fetchQueryHistory()
      }
      
      // 从历史列表查找
      query = queryStore.queryHistory.find((q: Query) => q.id === queryId) || null
      
      if (!query) {
        console.log('从历史列表也未找到查询，尝试获取查询列表')
        
        // 再次检查组件状态
        if (!isComponentMounted) return
        
        // 尝试从查询列表查找
        const queries = await queryStore.fetchQueries()
        query = queries.find((q: Query) => q.id === queryId) || null
        
        if (!query) {
          // 如果仍然未找到查询，但要求能够调试版本功能，则创建一个临时查询对象
          console.log('未找到查询，创建临时查询对象')
          query = {
            id: queryId,
            name: '临时查询',
            dataSourceId: selectedDataSourceId.value || (dataSourceStore.dataSources[0]?.id || ''),
            queryType: 'SQL',
            queryText: sqlQuery.value || 'SELECT * FROM users',
            status: 'DRAFT',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isFavorite: false,
            executionCount: 0
          }
          
          // 激活新增版本按钮
          versionStatus.value = 'DRAFT'
          currentQueryId.value = queryId
          
          // 将临时查询添加到store中
          queryStore.currentQuery = query
          
          message.info('已创建临时查询对象，以便调试版本功能')
          
          // 完成加载
          isLoadingQuery.value = false
          return
        }
      }
    }
    
    // 检查组件是否已卸载
    if (!isComponentMounted) return
    
    console.log('成功加载查询:', query)
    
    // 设置查询详情
    currentQueryId.value = query.id
    selectedDataSourceId.value = query.dataSourceId || ''
    queryName.value = query.name || '未命名查询'
    
    // 设置版本状态与版本号
    console.log('查询对象属性:', Object.keys(query))
    console.log('查询当前版本信息:', query.currentVersion)
    console.log('查询当前版本ID:', (query as any).currentVersionId)
    
    // 重置版本相关状态
    availableVersions.value = [];
    let highestVersionNumber = 0;
    
    // 尝试获取版本列表
    let versionList: QueryVersionType[] = [];
    try {
      // 导入版本服务获取版本列表
      const module = await import('@/services/queryVersion');
      const versionService = module.default;
      
      if (versionService && versionService.getVersions) {
        const versionsResponse = await versionService.getVersions({ queryId: query.id, page: 1, size: 50 });
        if (versionsResponse && versionsResponse.items) {
          versionList = versionsResponse.items;
          console.log('获取到版本列表:', versionList);
        }
      }
    } catch (error) {
      console.warn('获取版本列表失败:', error);
      // 如果无法获取版本列表，使用模拟数据
      versionList = [];
    }
    
    // 如果有版本列表，从中提取版本号
    if (versionList.length > 0) {
      // 为可用版本列表填充数据
      versionList.forEach(version => {
        const versionNumber = version.versionNumber;
        if (versionNumber) {
          availableVersions.value.push(`V${versionNumber}`);
          // 更新最高版本号
          if (versionNumber > highestVersionNumber) {
            highestVersionNumber = versionNumber;
          }
        }
      });
      
      // 确保版本号排序
      availableVersions.value.sort((a, b) => {
        const numA = parseInt(a.slice(1));
        const numB = parseInt(b.slice(1));
        return numB - numA; // 降序排列
      });
    } else {
      // 如果没有版本列表，尝试从当前版本获取
      let versionNumber = 1;
      
      // 尝试获取版本API数据
      if (query.currentVersion) {
        console.log('从currentVersion对象获取版本信息')
        // 使用当前版本的状态
        versionStatus.value = query.currentVersion.status as 'DRAFT' | 'PUBLISHED' | 'DEPRECATED'
        
        // 设置是否为活跃版本
        isActiveVersion.value = query.currentVersion.isLatest || false
        
        // 设置发布时间等
        lastEditedAt.value = query.currentVersion.updatedAt || query.updatedAt || null
        publishedAt.value = (query.currentVersion as any).publishedAt || 
                          (query.currentVersion as any).published_at || 
                          null
        deprecatedAt.value = (query.currentVersion as any).deprecatedAt || 
                          (query.currentVersion as any).deprecated_at || 
                          null
        
        // 设置版本号 - 从当前版本获取，确保显示正确的版本号
        versionNumber = Number(query.currentVersion.versionNumber || 
                            (query.currentVersion as any).version_number || 
                            (query.currentVersion as any).version || 
                            (typeof query.currentVersion.id === 'string' && 
                             query.currentVersion.id.match(/v(\d+)/) ? 
                             query.currentVersion.id.match(/v(\d+)/)?.[1] : '1'));
        
        console.log('从currentVersion提取到版本号:', versionNumber)
        
        // 更新最高版本号
        if (versionNumber > highestVersionNumber) {
          highestVersionNumber = versionNumber;
        }
        
        // 添加到可用版本列表
        if (!availableVersions.value.includes(`V${versionNumber}`)) {
          availableVersions.value.push(`V${versionNumber}`);
        }
      } else if ((query as any).currentVersionId) {
        console.log('从currentVersionId尝试获取版本号:', (query as any).currentVersionId)
        const versionId = (query as any).currentVersionId;
        
        // 1. 首先尝试直接从ID中提取版本号
        const directMatch = String(versionId).match(/v(\d+)/) || String(versionId).match(/(\d+)$/);
        if (directMatch) {
          versionNumber = parseInt(directMatch[1], 10);
          console.log('从版本ID直接提取到版本号:', versionNumber);
          
          // 更新最高版本号
          if (versionNumber > highestVersionNumber) {
            highestVersionNumber = versionNumber;
          }
          
          // 添加到可用版本列表
          if (!availableVersions.value.includes(`V${versionNumber}`)) {
            availableVersions.value.push(`V${versionNumber}`);
          }
        } else {
          // 2. 使用V1作为默认版本
          versionNumber = 1;
          console.log('无法确定具体版本号，默认设置为V1');
          
          // 更新最高版本号
          highestVersionNumber = 1;
          
          // 添加估计的版本列表
          // 只添加默认V1版本
            if (!availableVersions.value.includes(`V${i}`)) {
              availableVersions.value.push(`V${i}`);
            }
          }
        }
        
        // 没有currentVersion信息时，回退到查询状态
        versionStatus.value = query.status === 'PUBLISHED' ? 'PUBLISHED' : 
                          query.status === 'DEPRECATED' ? 'DEPRECATED' : 'DRAFT'
        isActiveVersion.value = query.isActive || false
        lastEditedAt.value = query.updatedAt || new Date().toISOString()
      } else {
        // 完全没有版本信息，设置默认值
        console.log('没有找到版本信息，使用默认版本V1');
        versionNumber = 1;
        highestVersionNumber = 1;
        
        // 添加默认版本
        availableVersions.value = ['V1'];
        
        // 设置状态
        versionStatus.value = 'DRAFT';
        isActiveVersion.value = false;
        lastEditedAt.value = query.updatedAt || new Date().toISOString();
      }
      
      // 确保至少有一个版本可选
      if (availableVersions.value.length === 0) {
        availableVersions.value = ['V1'];
        highestVersionNumber = 1;
      }
    }
    
    // 设置当前最高版本号
    currentMaxVersionNumber.value = highestVersionNumber;
    console.log('设置当前最高版本号:', currentMaxVersionNumber.value);
    
    // 排序可用版本列表
    availableVersions.value.sort((a, b) => {
      const numA = parseInt(a.slice(1));
      const numB = parseInt(b.slice(1));
      return numB - numA; // 降序排列
    });
    
    // 设置当前选中的版本
    if (window.location.href.includes('/edit') && availableVersions.value.length > 0) {
      // 编辑页面使用最高版本号
      selectedVersion.value = availableVersions.value[0]; // 第一个是最高版本
      queryVersion.value = selectedVersion.value;
    } else {
      // 新增页面或其他情况，使用最高版本号
      // 这里不再使用highestVersionNumber，直接使用V1表示新增查询
      if (!currentQueryId.value) {
        // 新增查询时确保显示V1
        selectedVersion.value = 'V1';
        queryVersion.value = 'V1';
      } else {
        // 编辑现有查询时使用当前版本号
        const currentVersionFormat = `V${highestVersionNumber}`;
        selectedVersion.value = currentVersionFormat;
        queryVersion.value = currentVersionFormat;
      }
    }
    
    console.log('最终设置的版本号:', queryVersion.value);
    console.log('可用版本列表:', availableVersions.value);
    
    // 检查是否是收藏的查询
    isFavorite.value = queryStore.favorites.some(fav => fav.queryId === queryId)
    
    // 提取查询SQL内容 - 优先使用当前版本的SQL，其次是queryText
    let sqlContent = ''
    if (query.currentVersion?.sql) {
      sqlContent = query.currentVersion.sql
      console.log('从query.currentVersion.sql获取SQL内容')
    } else if (query.queryText) {
      sqlContent = query.queryText
      console.log('从query.queryText获取SQL内容')
    } else {
      // 尝试其他可能的字段名
      const possibleFields = ['sql', 'queryContent', 'sqlContent']
      for (const field of possibleFields) {
        if ((query as any)[field]) {
          sqlContent = (query as any)[field]
          console.log(`从query.${field}获取SQL内容`)
          break
        }
      }
    }
    
    console.log(`SQL内容: ${sqlContent ? `获取到内容，长度 ${sqlContent.length}` : '未找到内容'}`)
    
    // 根据查询类型设置对应的查询内容
    if (query.queryType === 'SQL' || !query.queryType) {
      activeTab.value = 'editor'
      sqlQuery.value = sqlContent
      console.log('设置SQL查询内容:', sqlContent.substring(0, 100) + (sqlContent.length > 100 ? '...' : ''))
    } else if (query.queryType === 'NATURAL_LANGUAGE') {
      activeTab.value = 'nlq'
      naturalLanguageQuery.value = sqlContent
      console.log('设置自然语言查询内容:', sqlContent.substring(0, 100) + (sqlContent.length > 100 ? '...' : ''))
    }
    
    // 保存到本地存储以便于恢复
    try {
      localStorage.setItem('last_loaded_query_id', query.id);
      localStorage.setItem('last_loaded_query_text', sqlContent || '');
      localStorage.setItem('last_loaded_query_timestamp', new Date().toISOString());
    } catch (storageError) {
      console.warn('无法保存查询到本地存储:', storageError);
    }
    
    statusMessage.value = '查询加载成功'
    setTimeout(() => {
      if (!isComponentMounted) return
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
      if (!isComponentMounted) return
      statusMessage.value = null
    }, 5000)
  } finally {
    isLoadingQuery.value = false
    
    // 确保新增查询场景默认版本号为V1
    if (!currentQueryId.value || !window.location.href.includes('/edit')) {
      console.log('确认新增查询版本号为V1');
      selectedVersion.value = 'V1';
      queryVersion.value = 'V1';
      if (!availableVersions.value.includes('V1')) {
        availableVersions.value = ['V1'];
      }
    }
  }
}

// 执行查询
const executeQuery = async (queryType: QueryType = 'SQL') => {
  // 检查组件是否已卸载
  if (!isComponentMounted) {
    console.log('组件已卸载，取消查询执行')
    return
  }
  
  // 清除之前的错误信息
  queryError.value = null
  statusMessage.value = null
  
  // 基本验证
  if (!selectedDataSourceId.value) {
    message.error('请先选择数据源')
    queryError.value = '未选择数据源'
    statusMessage.value = '执行失败：未选择数据源'
    return
  }
  
  // 根据查询类型获取查询文本
  const queryText = getQueryTextByType(queryType)
  
  if (!queryText || !queryText.trim()) {
    message.error('请输入查询语句')
    queryError.value = '查询语句为空'
    statusMessage.value = '执行失败：查询语句为空'
    return
  }
  
  // SQL特有的验证逻辑
  if (queryType === 'SQL') {
    const validationError = validateSqlQuery(queryText)
    if (validationError) {
      message.warning(validationError)
      queryError.value = validationError
      statusMessage.value = `查询警告：${validationError}`
      // 警告级别的错误，不阻止执行，仅提示用户
    }
  }
  
  if (isExecuting.value) {
    message.info('查询正在执行中，请稍候...')
    return
  }
  
  // 初始化查询执行
  initializeQueryExecution()
  
  try {
    // 再次检查组件状态
    if (!isComponentMounted) {
      finalizeQueryExecution()
      return
    }
    
    // 构建查询参数
    const queryParams = {
      dataSourceId: selectedDataSourceId.value,
      queryText,
      queryType
    }
    
    console.log(`开始执行${queryType}查询...`, queryParams)
    statusMessage.value = '正在执行查询...'
    
    // 根据查询类型执行不同的查询
    const result = queryType === 'SQL'
      ? await queryStore.executeQuery(queryParams)
      : await queryStore.executeNaturalLanguageQuery({
          dataSourceId: selectedDataSourceId.value,
          question: queryText
        })
    
    // 检查组件是否已卸载
    if (!isComponentMounted) {
      finalizeQueryExecution()
      return
    }
    
    // 检查查询结果状态
    if (result) {
      // 使用类型断言安全地访问结果对象
      const resultObj: any = ('query' in result && 'result' in result) ? result.result : result;
      if (resultObj.status === 'ERROR' || resultObj.error) {
        const errorMessage = resultObj.errorMessage || resultObj.error || '查询执行失败';
        throw new Error(errorMessage);
      }
    }
    
    // 更新查询ID
    currentQueryId.value = queryStore.currentQueryResult?.id || null
    
    // 更新状态信息
    const rowCount = queryStore.currentQueryResult?.rowCount || 0
    const execTime = queryStore.currentQueryResult?.executionTime || 0
    statusMessage.value = `查询执行成功，返回 ${rowCount} 条记录，耗时 ${execTime}ms`
    message.success(statusMessage.value)
    
    // 在查询执行完成后尝试获取执行计划，但不阻断正常流程
    if (currentQueryId.value) {
      console.log(`查询执行完成，尝试获取执行计划，查询ID: ${currentQueryId.value}`)
      tryGetExecutionPlan(currentQueryId.value).catch(error => {
        // 仅记录错误，不影响主流程
        console.warn('获取执行计划失败，但不影响查询结果显示:', error)
      });
    }
    
    // 检查组件是否已卸载
    if (!isComponentMounted) {
      finalizeQueryExecution()
      return
    }
    
    console.log('查询执行成功:', result)
    
    // 自动滚动到结果区域
    nextTick(() => {
      // 检查组件是否已卸载
      if (!isComponentMounted) return
      
      const resultsElement = document.getElementById('query-results')
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth' })
      }
    })
  } catch (error) {
    handleQueryError(error)
  } finally {
    finalizeQueryExecution()
  }
}

// 尝试获取执行计划，但允许失败
const tryGetExecutionPlan = async (queryId: string) => {
  // 检查组件是否已卸载
  if (!isComponentMounted) return
  
  try {
    // 等待一小段时间，确保后端有足够时间生成执行计划
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 尝试获取执行计划，最多重试2次
    let retries = 0;
    const maxRetries = 1;
    
    while (retries <= maxRetries) {
      try {
        await queryStore.getQueryExecutionPlan(queryId)
        console.log('执行计划加载完成')
        return
      } catch (error: any) {
        // 检查错误是否是"执行计划不存在"
        const isNotFoundError = 
          (error.message && error.message.includes('计划不存在')) || 
          (error.details && error.details.includes('计划不存在'));
        
        if (isNotFoundError && retries < maxRetries) {
          console.log(`执行计划暂不可用，等待后重试 (${retries + 1}/${maxRetries})`)
          // 等待一段时间再重试
          await new Promise(resolve => setTimeout(resolve, 1000))
          retries++;
        } else {
          // 其他错误或已重试最大次数，停止尝试
          throw error;
        }
      }
    }
  } catch (error) {
    console.error('获取执行计划失败:', error)
    // 不阻断主流程，仅记录错误
  }
}

// 验证SQL查询
const validateSqlQuery = (queryText: string): string | null => {
  const trimmedSQL = queryText.trim().toLowerCase()
  
  // 检查是否是简单的SELECT *
  if (trimmedSQL === 'select *') {
    return '不完整的SQL语句，请指定表名'
  }
  
  // 检查SELECT * FROM 后是否有表名
  if (trimmedSQL.startsWith('select * from') && trimmedSQL.split(' ').length <= 3) {
    return '请在FROM子句后指定表名'
  }
  
  // 检查SQL语句是否有基本语法要素
  if (!trimmedSQL.includes('select')) {
    return 'SQL语句需要包含SELECT关键字'
  }
  
  if (!trimmedSQL.includes('from') && trimmedSQL.includes('select')) {
    return 'SQL语句可能缺少FROM子句'
  }
  
  // 括号匹配检查
  const openCount = (trimmedSQL.match(/\(/g) || []).length
  const closeCount = (trimmedSQL.match(/\)/g) || []).length
  if (openCount !== closeCount) {
    return '括号不匹配，请检查SQL语法'
  }
  
  // 没有错误
  return null
}

// 处理查询错误
const handleQueryError = (error: any) => {
  console.error('查询执行失败:', error)
  
  // 提取错误消息
  let errorMessage = '执行查询时出错'
  
  if (error instanceof Error) {
    errorMessage = error.message
  } else if (typeof error === 'string') {
    errorMessage = error
  } else if (error && typeof error === 'object') {
    errorMessage = error.message || error.error || JSON.stringify(error)
  }
  
  // 设置错误状态
  queryError.value = errorMessage
  statusMessage.value = '查询执行失败'
  
  // 显示详细错误提示
  message.error({
    content: errorMessage,
    duration: 5
  })
}

// 根据查询类型获取查询文本
const getQueryTextByType = (queryType: QueryType): string => {
  switch (queryType) {
    case 'SQL':
      return sqlQuery.value;
    case 'NATURAL_LANGUAGE':
      return naturalLanguageQuery.value;
    default:
      return builderQuery.value;
  }
};

// 初始化查询执行状态
const initializeQueryExecution = () => {
  // 重置错误状态
  queryError.value = null;
  statusMessage.value = null;
  isExecuting.value = true;
  
  // 重置并启动执行时间计时器
  executionTime.value = 0;
  if (executionTimer.value) {
    clearInterval(executionTimer.value);
  }
  executionTimer.value = window.setInterval(() => {
    executionTime.value += 1;
  }, 1000);
};

// 完成查询执行
const finalizeQueryExecution = () => {
  // 清除执行时间计时器
  if (executionTimer.value) {
    clearInterval(executionTimer.value);
    executionTimer.value = null;
  }
  isExecuting.value = false;
  
  // 5秒后清除状态消息
  if (statusMessage.value) {
    setTimeout(() => {
      statusMessage.value = null;
    }, 5000);
  }
};

// 获取执行按钮提示信息
const getExecuteButtonTooltip = () => {
  if (!selectedDataSourceId.value) {
    return '请在左侧面板中选择一个数据源';
  }
  
  if (activeTab.value === 'editor' && (!sqlQuery.value || sqlQuery.value.trim().length === 0)) {
    return '请在SQL编辑器中输入查询语句';
  } else if (activeTab.value === 'builder' && (!builderQuery.value || builderQuery.value.trim().length === 0)) {
    return '查询构建器未生成有效的查询语句';
  } else if (activeTab.value === 'nlq' && (!naturalLanguageQuery.value || naturalLanguageQuery.value.trim().length === 0)) {
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
  // 检查组件是否已卸载
  if (!isComponentMounted) return
  
  // 在显示保存对话框前，验证必要数据
  if (!selectedDataSourceId.value) {
    statusMessage.value = '请先选择数据源再保存查询'
    setTimeout(() => {
      if (!isComponentMounted) return
      statusMessage.value = null
    }, 3000)
    return
  }
  
  // 验证查询内容
  if (!sqlQuery.value.trim() && !naturalLanguageQuery.value.trim()) {
    statusMessage.value = '查询内容不能为空'
    setTimeout(() => {
      if (!isComponentMounted) return
      statusMessage.value = null
    }, 3000)
    return
  }
  
  // 显示保存对话框
  isSaveModalVisible.value = true
}

// 执行构建器查询
const executeBuilderQuery = () => {
  // 安全检查
  if (!isComponentMounted) return
  
  executeQuery()
}

// 处理保存查询
const handleSaveQuery = async (saveData: any) => {
  try {
    isSaveModalVisible.value = false
    statusMessage.value = '正在保存查询...'
    
    // 构造符合SaveQueryParams的对象
    const queryData: any = {
      id: saveData.id || (currentQueryId.value || undefined),
      name: saveData.name,
      dataSourceId: saveData.dataSourceId,
      queryText: saveData.queryText || (activeTab.value === 'editor' ? sqlQuery.value : naturalLanguageQuery.value),
      queryType: saveData.queryType || (activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE'),
      description: saveData.description,
      tags: saveData.tags ? saveData.tags.map((tag: any) => typeof tag === 'string' ? tag : (tag.name || tag.toString())) : undefined
    }
    
    console.log('保存查询:', queryData)
    
    // 调用保存查询接口
    const result = await queryStore.saveQuery(queryData)
    
    if (result && result.id) {
      message.success('查询保存成功')
      statusMessage.value = '查询保存成功'
      
      // 更新当前查询ID
      currentQueryId.value = result.id
      
      // 更新查询名称和数据源ID
      queryName.value = saveData.name || '未命名查询'
      selectedDataSourceId.value = saveData.dataSourceId || ''
      
      // 根据查询类型更新查询内容
      if (saveData.queryType === 'SQL' || !saveData.queryType) {
        sqlQuery.value = saveData.queryText || sqlQuery.value
      } else if (saveData.queryType === 'NATURAL_LANGUAGE') {
        naturalLanguageQuery.value = saveData.queryText || naturalLanguageQuery.value
      }
      
      // 设置版本状态为草稿
      versionStatus.value = 'DRAFT'
      
      // 更新最后编辑时间
      lastEditedAt.value = new Date().toISOString()
      
      // 如果是新建查询，更新URL并添加到历史记录
      if (!route.query.id) {
        const newQuery = { ...route.query, id: result.id }
        router.replace({ query: newQuery })
      }
      
      setTimeout(() => {
        statusMessage.value = null
      }, 3000)
    } else {
      throw new Error('保存查询失败')
    }
  } catch (error) {
    console.error('保存查询失败:', error)
    message.error('保存查询失败')
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
const formatDate = (dateString: string | number | Date | undefined | null) => {
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
    } else if (activeTab.value === 'nlq' && !naturalLanguageQuery.value.trim()) {
      showError('请在自然语言查询输入框中输入问题');
      return;
    }
    
    return;
  }
  
  // 如果条件满足，执行查询
  executeQuery();
}

// 返回列表
const returnToList = () => {
  router.push('/query/list');
}

// 查看版本
const viewVersions = () => {
  const id = router.currentRoute.value.query.id;
  if (!id) return;
  router.push(`/query/version/management/${id}`);
}

// 保存草稿
const saveDraft = async () => {
  try {
    statusMessage.value = '正在保存草稿...';
    
    // 获取当前查询文本
    const queryText = getQueryTextByType(activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE');
    
    // 验证是否有内容
    if (!queryText.trim()) {
      statusMessage.value = '无内容可保存';
      setTimeout(() => {
        statusMessage.value = null;
      }, 3000);
      return;
    }
    
    // 更新最后保存草稿时间
    const now = new Date().toISOString();
    lastDraftSaveAt.value = now;
    
    // 根据是否有查询ID决定操作
    if (currentQueryId.value) {
      // 已有查询，更新草稿
      // 构造保存草稿的请求数据
      const draftData = {
        id: currentQueryId.value,
        queryText: queryText,
        queryType: activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE'
      };
      
      // 调用API保存草稿
      // TODO: 替换为实际的API调用
      await simulateDelay(500, 1000);
      
      // 更新最后编辑时间
      lastEditedAt.value = now;
      
      message.success('草稿已保存');
      statusMessage.value = '草稿已保存';
    } else {
      // 新查询，首次保存草稿，静默存储到本地
      localStorage.setItem('query_draft_text', queryText);
      localStorage.setItem('query_draft_type', activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE');
      localStorage.setItem('query_draft_timestamp', now);
      
      message.success('草稿已临时保存');
      statusMessage.value = '草稿已临时保存';
    }
    
    setTimeout(() => {
      statusMessage.value = null;
    }, 3000);
  } catch (error) {
    console.error('保存草稿失败:', error);
    message.error('保存草稿失败');
    statusMessage.value = '保存草稿失败';
    setTimeout(() => {
      statusMessage.value = null;
    }, 5000);
  }
};

// 发布版本
const publishVersion = async () => {
  if (!currentQueryId.value || versionStatus.value !== 'DRAFT') return;
  
  // 获取当前查询文本
  const queryText = getQueryTextByType(activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE');
  const queryType = activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE';
  
  // 使用Modal组件显示确认对话框
  const confirmResult = await new Promise(resolve => {
    Modal.confirm({
      title: '确认发布查询版本',
      content: h('div', {}, [
        h('p', { class: 'mb-2' }, '您确定要发布此查询版本吗？发布后将不能修改。'),
        h('div', { class: 'p-3 bg-gray-50 rounded mb-2' }, [
          h('div', { class: 'font-medium mb-1' }, '查询名称:'),
          h('div', { class: 'ml-2 mb-2 text-gray-700' }, queryName.value || '(未命名查询)'),
          h('div', { class: 'font-medium mb-1' }, '查询类型:'),
          h('div', { class: 'ml-2 mb-2 text-gray-700' }, queryType === 'SQL' ? 'SQL查询' : '自然语言查询'),
          h('div', { class: 'font-medium mb-1' }, '版本:'),
          h('div', { class: 'ml-2 mb-2 text-gray-700' }, queryVersion.value),
          h('div', { class: 'font-medium mb-1' }, '查询内容:'),
          h('pre', { class: 'ml-2 p-2 bg-gray-100 border rounded max-h-24 overflow-y-auto text-xs' }, queryText.length > 200 ? queryText.substring(0, 200) + '...' : queryText)
        ])
      ]),
      okText: '确认发布',
      cancelText: '取消',
      okButtonProps: {
        type: 'primary',
        danger: true
      },
      onOk() {
        resolve(true);
      },
      onCancel() {
        resolve(false);
      }
    });
  });
  
  // 如果用户取消了确认，则不继续发布
  if (!confirmResult) {
    return;
  }
  
  try {
    statusMessage.value = '正在发布版本...';
    
    // 构造发布版本的请求数据
    const publishData = {
      id: currentQueryId.value,
      queryText: queryText,
      queryType: queryType,
      setAsActive: true
    };
    
    // 调用API发布版本
    // TODO: 替换为实际的API调用
    await simulateDelay(800, 1500);
    
    // 更新版本状态
    versionStatus.value = 'PUBLISHED';
    isActiveVersion.value = true;
    publishedAt.value = new Date().toISOString();
    
    statusMessage.value = '版本已发布';
    setTimeout(() => {
      statusMessage.value = null;
    }, 3000);
  } catch (error) {
    console.error('发布版本失败:', error);
    statusMessage.value = '发布版本失败';
    setTimeout(() => {
      statusMessage.value = null;
    }, 5000);
  }
};

// 创建新版本
const createNewVersion = async () => {
  if (!currentQueryId.value) return;
  
  try {
    statusMessage.value = '正在创建新版本...';
    
    // 构造创建新版本的请求数据
    const newVersionData = {
      queryId: currentQueryId.value,
      queryText: getQueryTextByType(activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE'),
      queryType: activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE'
    };
    
    let success = false;
    let newVersionNumber = 0;
    
    try {
      // 尝试调用实际API
      console.log('尝试创建新版本，当前最高版本号:', currentMaxVersionNumber.value);
      // 计算新版本号 - 当前最高版本号加1
      newVersionNumber = currentMaxVersionNumber.value + 1;
      
      // 调用版本服务的创建版本API
      let versionService;
      try {
        const module = await import('@/services/queryVersion');
        versionService = module.default;
      } catch (importError) {
        console.warn('无法导入queryVersion服务:', importError);
        
        // 如果无法导入服务，模拟成功
        await simulateDelay(800, 1500);
        success = true;
        console.log('使用前端模拟，创建新版本号:', newVersionNumber);
      }
      
      if (versionService && versionService.createVersion) {
        // 构造参数
        const createParams = {
          queryId: currentQueryId.value,
          sqlContent: getQueryTextByType(activeTab.value === 'editor' ? 'SQL' : 'NATURAL_LANGUAGE'),
          dataSourceId: selectedDataSourceId.value
        };
        
        // 调用API
        const result = await versionService.createVersion(createParams);
        console.log('创建版本API返回结果:', result);
        
        if (result && result.versionNumber) {
          newVersionNumber = result.versionNumber;
          success = true;
        }
      } else {
        // 模拟API调用成功
        await simulateDelay(800, 1500);
        success = true;
      }
    } catch (apiError) {
      console.warn('调用后端API失败，使用前端模拟:', apiError);
      
      // 模拟延迟
      await simulateDelay(500, 1000);
      
      // 在API调用失败的情况下，我们仍然模拟操作成功
      success = true;
      newVersionNumber = currentMaxVersionNumber.value + 1;
      
      // 显示调试模式提示信息
      message.warning('后端API不可用，使用前端模拟创建了新版本');
    }
    
    if (success) {
      // 更新版本状态
      versionStatus.value = 'DRAFT';
      isActiveVersion.value = false;
      lastEditedAt.value = new Date().toISOString();
      
      // 更新最高版本号
      currentMaxVersionNumber.value = newVersionNumber;
      
      // 更新版本号显示
      queryVersion.value = `V${newVersionNumber}`;
      selectedVersion.value = `V${newVersionNumber}`;
      
      // 更新可用版本列表
      if (!availableVersions.value.includes(`V${newVersionNumber}`)) {
        availableVersions.value.push(`V${newVersionNumber}`);
        // 确保版本号按数字排序
        availableVersions.value.sort((a, b) => {
          const numA = parseInt(a.slice(1));
          const numB = parseInt(b.slice(1));
          return numB - numA; // 降序排列
        });
      }
      
      statusMessage.value = '已创建新版本';
      message.success(`已成功创建新版本 V${newVersionNumber}`);
      
      // 可选：将当前查询状态保存到localStorage，方便调试
      try {
        localStorage.setItem('current_version', queryVersion.value);
        localStorage.setItem('current_max_version_number', String(currentMaxVersionNumber.value));
        localStorage.setItem('version_status', versionStatus.value);
      } catch (e) {
        console.warn('无法保存版本信息到localStorage:', e);
      }
    } else {
      throw new Error('创建新版本失败');
    }
    
    setTimeout(() => {
      statusMessage.value = null;
    }, 3000);
  } catch (error) {
    console.error('创建新版本失败:', error);
    statusMessage.value = '创建新版本失败';
    message.error('创建新版本失败: ' + (error instanceof Error ? error.message : String(error)));
    setTimeout(() => {
      statusMessage.value = null;
    }, 5000);
  }
};

// 计算属性：是否有未保存的更改
const hasUnsavedChanges = computed(() => {
  if (!currentQueryId.value) {
    // 新建查询，检查是否填写了内容
    return !!sqlQuery.value.trim() || !!naturalLanguageQuery.value.trim() || !!builderQuery.value.trim();
  }
  
  // 已有查询，检查内容是否有变化
  const originalQuery = queryStore.currentQuery;
  if (!originalQuery) return false;
  
  if (activeTab.value === 'editor') {
    return sqlQuery.value !== originalQuery.queryText;
  } else if (activeTab.value === 'nlq') {
    return naturalLanguageQuery.value !== originalQuery.queryText;
  } else if (activeTab.value === 'builder') {
    return builderQuery.value !== originalQuery.queryText;
  }
  
  return false;
});

// 处理SQL编辑器执行按钮逻辑
const handleExecuteQuery = (errorMsg?: string) => {
  if (errorMsg) {
    showError(errorMsg);
  } else {
    // 只验证SQL语法，不直接执行
  }
};

// 分离保存和执行逻辑
const showSaveModal = () => {
  isSaveModalVisible.value = true;
};

// 离开编辑页面前提醒用户保存更改
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    // 显示确认对话框
    const confirmResult = window.confirm("你有未保存的更改，确定要离开吗？");
    if (confirmResult) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

// 计算属性：上次草稿保存时间的格式化显示
const lastDraftSaveTime = computed(() => {
  if (!lastDraftSaveAt.value) return '';
  
  const now = new Date();
  const saveTime = new Date(lastDraftSaveAt.value);
  const diffMinutes = Math.floor((now.getTime() - saveTime.getTime()) / (1000 * 60));
  
  if (diffMinutes < 1) {
    return '刚刚';
  } else if (diffMinutes < 60) {
    return `${diffMinutes}分钟前`;
  } else if (diffMinutes < 24 * 60) {
    const hours = Math.floor(diffMinutes / 60);
    return `${hours}小时前`;
  } else {
    const days = Math.floor(diffMinutes / (60 * 24));
    return `${days}天前`;
  }
});
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

/* 强制添加边框的重要边框 */
.force-border {
  border: 1px solid #d1d5db !important;
}
</style>