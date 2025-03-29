<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useDataSourceStore } from '@/stores/datasource'
import type { DataSource } from '@/types/datasource'

// 组件属性
const props = defineProps<{
  initialKeyword?: string
  selectedDataSourceId?: string
}>()

// 组件事件
const emit = defineEmits<{
  (e: 'search', params: {
    keyword: string
    dataSourceIds: string[]
    entityTypes: ('table' | 'column' | 'view')[]
    caseSensitive: boolean
    searchHistory: boolean
    useRegex: boolean
    maxResults: number
    exactMatch: boolean
    fuzzyMatch: boolean
  }): void
  (e: 'close'): void
}>()

// 搜索状态
const keyword = ref(props.initialKeyword || '')
const selectedDataSources = ref<string[]>(props.selectedDataSourceId ? [props.selectedDataSourceId] : [])
const searchTables = ref(true)
const searchColumns = ref(true)
const searchViews = ref(true)
const caseSensitive = ref(false)
const includeSearchHistory = ref(true)
const isSearchHistoryExpanded = ref(false)
const searchHistory = ref<string[]>([])
const useRegex = ref(false)
const showAdvancedOptions = ref(false)
const maxResults = ref(100)
const exactMatch = ref(false)
const fuzzyMatch = ref(false)
const searchPresets = ref<Array<{
  name: string
  params: {
    keyword: string
    dataSourceIds: string[]
    entityTypes: ('table' | 'column' | 'view')[]
    caseSensitive: boolean
    useRegex: boolean
    maxResults: number
    exactMatch: boolean
    fuzzyMatch: boolean
  }
}>>([])

// 数据源存储
const dataSourceStore = useDataSourceStore()

// 激活的数据源列表
const activeDataSources = computed(() => {
  return dataSourceStore.activeDataSources
})

// 计算搜索条件是否有效
const isSearchValid = computed(() => {
  return keyword.value.trim().length > 0 && 
    (searchTables.value || searchColumns.value || searchViews.value) &&
    (selectedDataSources.value.length > 0)
})

// 计算正则表达式是否有效
const isRegexValid = computed(() => {
  if (!useRegex.value || !keyword.value.trim()) return true
  
  try {
    new RegExp(keyword.value)
    return true
  } catch (e) {
    return false
  }
})

// 加载搜索历史
const loadSearchHistory = () => {
  try {
    const historyString = localStorage.getItem('metadataSearchHistory')
    if (historyString) {
      const parsedHistory = JSON.parse(historyString)
      if (Array.isArray(parsedHistory)) {
        searchHistory.value = parsedHistory.slice(0, 10) // 只保留最近10条
      }
    }
  } catch (error) {
    console.error('Failed to load search history:', error)
  }
}

// 保存搜索历史
const saveToSearchHistory = (term: string) => {
  if (!term.trim()) return
  
  // 移除已存在的相同搜索词
  searchHistory.value = searchHistory.value.filter(item => item !== term)
  
  // 添加到历史记录开头
  searchHistory.value.unshift(term)
  
  // 限制历史记录数量
  if (searchHistory.value.length > 10) {
    searchHistory.value = searchHistory.value.slice(0, 10)
  }
  
  // 保存到localStorage
  try {
    localStorage.setItem('metadataSearchHistory', JSON.stringify(searchHistory.value))
  } catch (error) {
    console.error('Failed to save search history:', error)
  }
}

// 加载搜索预设
const loadSearchPresets = () => {
  try {
    const presetsString = localStorage.getItem('searchPresets')
    if (presetsString) {
      const parsedPresets = JSON.parse(presetsString)
      if (Array.isArray(parsedPresets)) {
        searchPresets.value = parsedPresets
      }
    }
  } catch (error) {
    console.error('Failed to load search presets:', error)
  }
}

// 保存当前搜索为预设
const saveCurrentAsPreset = () => {
  const presetName = prompt('请输入预设名称:')
  if (!presetName) return
  
  const newPreset = {
    name: presetName,
    params: {
      keyword: keyword.value,
      dataSourceIds: [...selectedDataSources.value],
      entityTypes: getSelectedEntityTypes(),
      caseSensitive: caseSensitive.value,
      useRegex: useRegex.value,
      maxResults: maxResults.value,
      exactMatch: exactMatch.value,
      fuzzyMatch: fuzzyMatch.value
    }
  }
  
  // 添加到预设列表
  searchPresets.value.push(newPreset)
  
  // 保存到localStorage
  try {
    localStorage.setItem('searchPresets', JSON.stringify(searchPresets.value))
  } catch (error) {
    console.error('Failed to save search preset:', error)
  }
}

// 加载预设
const loadPreset = (preset: any) => {
  keyword.value = preset.params.keyword
  selectedDataSources.value = [...preset.params.dataSourceIds]
  
  // 设置实体类型
  searchTables.value = preset.params.entityTypes.includes('table')
  searchColumns.value = preset.params.entityTypes.includes('column')
  searchViews.value = preset.params.entityTypes.includes('view')
  
  // 设置其他选项
  caseSensitive.value = preset.params.caseSensitive
  useRegex.value = preset.params.useRegex
  maxResults.value = preset.params.maxResults
  exactMatch.value = preset.params.exactMatch
  fuzzyMatch.value = preset.params.fuzzyMatch
}

// 删除预设
const deletePreset = (index: number) => {
  if (confirm(`确定要删除预设 "${searchPresets.value[index].name}" 吗?`)) {
    searchPresets.value.splice(index, 1)
    
    // 更新localStorage
    try {
      localStorage.setItem('searchPresets', JSON.stringify(searchPresets.value))
    } catch (error) {
      console.error('Failed to update search presets:', error)
    }
  }
}

// 选择历史搜索词
const selectHistoryTerm = (term: string) => {
  keyword.value = term
  isSearchHistoryExpanded.value = false
  handleSearch()
}

// 清除搜索历史
const clearSearchHistory = () => {
  searchHistory.value = []
  try {
    localStorage.removeItem('metadataSearchHistory')
  } catch (error) {
    console.error('Failed to clear search history:', error)
  }
}

// 切换全选/取消所有数据源
const toggleAllDataSources = () => {
  if (selectedDataSources.value.length === activeDataSources.value.length) {
    selectedDataSources.value = []
  } else {
    selectedDataSources.value = activeDataSources.value.map(ds => ds.id)
  }
}

// 获取选中的实体类型
const getSelectedEntityTypes = (): ('table' | 'column' | 'view')[] => {
  const entityTypes: ('table' | 'column' | 'view')[] = []
  if (searchTables.value) entityTypes.push('table')
  if (searchColumns.value) entityTypes.push('column')
  if (searchViews.value) entityTypes.push('view')
  return entityTypes
}

// 处理搜索
const handleSearch = () => {
  if (!isSearchValid.value || !isRegexValid.value) return
  
  // 获取选中的实体类型
  const entityTypes = getSelectedEntityTypes()
  
  // 保存到搜索历史
  if (includeSearchHistory.value) {
    saveToSearchHistory(keyword.value)
  }
  
  // 发送搜索事件
  emit('search', {
    keyword: keyword.value,
    dataSourceIds: selectedDataSources.value,
    entityTypes,
    caseSensitive: caseSensitive.value,
    searchHistory: includeSearchHistory.value,
    useRegex: useRegex.value,
    maxResults: maxResults.value,
    exactMatch: exactMatch.value,
    fuzzyMatch: fuzzyMatch.value
  })
}

// 关闭搜索面板
const handleClose = () => {
  emit('close')
}

// 根据URL参数填充搜索条件
const populateFromUrlParams = () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const searchParams = urlParams.get('search')
    
    if (searchParams) {
      const params = JSON.parse(decodeURIComponent(searchParams))
      
      if (params.keyword) {
        keyword.value = params.keyword
      }
      
      if (params.dataSourceIds && Array.isArray(params.dataSourceIds)) {
        selectedDataSources.value = params.dataSourceIds
      }
      
      if (params.entityTypes && Array.isArray(params.entityTypes)) {
        searchTables.value = params.entityTypes.includes('table')
        searchColumns.value = params.entityTypes.includes('column')
        searchViews.value = params.entityTypes.includes('view')
      }
      
      if (params.caseSensitive !== undefined) {
        caseSensitive.value = params.caseSensitive
      }
      
      if (params.useRegex !== undefined) {
        useRegex.value = params.useRegex
      }
      
      if (params.maxResults !== undefined) {
        maxResults.value = params.maxResults
      }
      
      if (params.exactMatch !== undefined) {
        exactMatch.value = params.exactMatch
      }
      
      if (params.fuzzyMatch !== undefined) {
        fuzzyMatch.value = params.fuzzyMatch
      }
    }
  } catch (error) {
    console.error('Failed to parse URL search params:', error)
  }
}

// 初始化
onMounted(() => {
  loadSearchHistory()
  loadSearchPresets()
  populateFromUrlParams()
})

// 监听数据源ID变化
watch(() => props.selectedDataSourceId, (newId) => {
  if (newId && !selectedDataSources.value.includes(newId)) {
    selectedDataSources.value = [newId]
  }
})

// 确保exactMatch和fuzzyMatch互斥
watch(exactMatch, (value) => {
  if (value && fuzzyMatch.value) {
    fuzzyMatch.value = false
  }
})

watch(fuzzyMatch, (value) => {
  if (value && exactMatch.value) {
    exactMatch.value = false
  }
})
</script>

<template>
  <div class="bg-white shadow-lg rounded-lg overflow-hidden max-w-3xl mx-auto">
    <div class="px-6 py-4 bg-indigo-50 border-b border-indigo-100">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium text-indigo-800">高级搜索</h3>
        <button 
          class="text-gray-500 hover:text-gray-700 focus:outline-none"
          @click="handleClose"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
    
    <div class="p-6">
      <!-- 搜索预设 -->
      <div v-if="searchPresets.length > 0" class="mb-5">
        <div class="flex justify-between items-center mb-1">
          <label class="block text-sm font-medium text-gray-700">搜索预设</label>
          <button
            class="text-xs text-indigo-600 hover:text-indigo-800"
            @click="saveCurrentAsPreset"
            :disabled="!isSearchValid"
          >
            保存当前搜索
          </button>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div
            v-for="(preset, index) in searchPresets"
            :key="index"
            class="flex items-center border border-gray-200 rounded-md p-2 bg-gray-50 hover:bg-gray-100"
          >
            <button
              class="flex-1 text-left text-sm text-indigo-600 hover:text-indigo-800"
              @click="loadPreset(preset)"
            >
              {{ preset.name }}
            </button>
            <button
              class="text-red-400 hover:text-red-600 ml-2"
              @click="deletePreset(index)"
              title="删除预设"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      <!-- 搜索输入框 -->
      <div class="mb-5">
        <label class="block text-sm font-medium text-gray-700 mb-1">搜索关键词</label>
        <div class="relative">
          <input
            v-model="keyword"
            type="text"
            placeholder="输入搜索关键词..."
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            :class="{ 'border-red-300': useRegex && !isRegexValid }"
            @keyup.enter="handleSearch"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              class="text-gray-400 hover:text-gray-600"
              @click="isSearchHistoryExpanded = !isSearchHistoryExpanded"
              v-if="searchHistory.length > 0 && includeSearchHistory"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" transform="rotate(45 10 10)" />
              </svg>
            </button>
          </div>
        </div>
        <p v-if="useRegex && !isRegexValid" class="mt-1 text-sm text-red-600">
          无效的正则表达式
        </p>
        
        <!-- 搜索历史下拉 -->
        <div
          v-show="isSearchHistoryExpanded && searchHistory.length > 0"
          class="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-auto"
        >
          <div class="p-2 flex justify-between items-center border-b">
            <span class="text-xs text-gray-500 font-medium">搜索历史</span>
            <button
              class="text-xs text-red-500 hover:text-red-700"
              @click="clearSearchHistory"
            >
              清除历史
            </button>
          </div>
          <ul class="py-1">
            <li
              v-for="term in searchHistory"
              :key="term"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              @click="selectHistoryTerm(term)"
            >
              {{ term }}
            </li>
          </ul>
        </div>
      </div>
      
      <!-- 数据源选择 -->
      <div class="mb-5">
        <div class="flex justify-between items-center mb-1">
          <label class="block text-sm font-medium text-gray-700">选择数据源</label>
          <button
            class="text-xs text-indigo-600 hover:text-indigo-800"
            @click="toggleAllDataSources"
          >
            {{ selectedDataSources.length === activeDataSources.length ? '取消全选' : '全选' }}
          </button>
        </div>
        <div class="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 bg-gray-50">
          <div v-if="activeDataSources.length === 0" class="text-sm text-gray-500 py-2 text-center">
            没有可用的数据源
          </div>
          <div
            v-for="ds in activeDataSources"
            :key="ds.id"
            class="flex items-center mb-2 last:mb-0"
          >
            <input
              type="checkbox"
              :id="`ds-${ds.id}`"
              :value="ds.id"
              v-model="selectedDataSources"
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label :for="`ds-${ds.id}`" class="ml-2 block text-sm text-gray-900">
              {{ ds.name }}
              <span class="text-xs text-gray-500">
                ({{ ds.type }})
              </span>
            </label>
          </div>
        </div>
      </div>
      
      <!-- 搜索选项 -->
      <div class="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">搜索范围</label>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                id="search-tables"
                v-model="searchTables"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="search-tables" class="ml-2 block text-sm text-gray-900">
                表
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="search-columns"
                v-model="searchColumns"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="search-columns" class="ml-2 block text-sm text-gray-900">
                列
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="search-views"
                v-model="searchViews"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="search-views" class="ml-2 block text-sm text-gray-900">
                视图
              </label>
            </div>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">基本选项</label>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                id="case-sensitive"
                v-model="caseSensitive"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="case-sensitive" class="ml-2 block text-sm text-gray-900">
                区分大小写
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="include-history"
                v-model="includeSearchHistory"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="include-history" class="ml-2 block text-sm text-gray-900">
                记录搜索历史
              </label>
            </div>
            <div class="flex items-center">
              <input
                id="use-regex"
                v-model="useRegex"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="use-regex" class="ml-2 block text-sm text-gray-900">
                使用正则表达式
              </label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 高级选项 按钮 -->
      <div class="mb-4">
        <button
          type="button"
          class="text-sm text-indigo-600 hover:text-indigo-800 flex items-center"
          @click="showAdvancedOptions = !showAdvancedOptions"
        >
          <span>高级选项</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="h-4 w-4 ml-1" 
            :class="showAdvancedOptions ? 'transform rotate-180' : ''"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <!-- 高级选项面板 -->
      <div v-if="showAdvancedOptions" class="mb-5 p-3 bg-gray-50 rounded-md border border-gray-200">
        <div class="mb-3">
          <label for="max-results" class="block text-sm font-medium text-gray-700 mb-1">
            最大结果数
          </label>
          <select
            id="max-results"
            v-model="maxResults"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option :value="50">50</option>
            <option :value="100">100</option>
            <option :value="200">200</option>
            <option :value="500">500</option>
            <option :value="1000">1000</option>
          </select>
        </div>
        
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div class="flex items-center">
              <input
                id="exact-match"
                v-model="exactMatch"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="exact-match" class="ml-2 block text-sm text-gray-900">
                精确匹配
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-1 ml-6">
              仅返回完全匹配的结果
            </p>
          </div>
          
          <div>
            <div class="flex items-center">
              <input
                id="fuzzy-match"
                v-model="fuzzyMatch"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label for="fuzzy-match" class="ml-2 block text-sm text-gray-900">
                模糊匹配
              </label>
            </div>
            <p class="text-xs text-gray-500 mt-1 ml-6">
              允许拼写错误和变体
            </p>
          </div>
        </div>
      </div>
      
      <!-- 搜索按钮 -->
      <div class="mt-6 flex justify-end">
        <button
          type="button"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :disabled="!isSearchValid || (useRegex && !isRegexValid)"
          @click="handleSearch"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 -ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          搜索
        </button>
      </div>
    </div>
  </div>
</template>