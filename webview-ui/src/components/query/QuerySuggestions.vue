<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQueryStore } from '@/stores/query'
import type { QuerySuggestion } from '@/types/query'

// 定义组件属性
const props = defineProps<{
  queryId: string
}>()

// 定义事件
const emit = defineEmits<{
  (e: 'apply-suggestion', query: string): void
}>()

const queryStore = useQueryStore()

// 查询建议状态
const suggestions = ref<QuerySuggestion[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)
const activeTab = ref<'all' | 'optimization' | 'security' | 'readability' | 'alternative'>('all')

// 加载查询建议
const loadSuggestions = async () => {
  if (!props.queryId) {
    error.value = '缺少查询ID'
    isLoading.value = false
    return
  }
  
  isLoading.value = true
  error.value = null
  
  try {
    const result = await queryStore.getQuerySuggestions(props.queryId)
    suggestions.value = result || []
  } catch (err) {
    console.error('加载查询建议失败:', err)
    error.value = err instanceof Error ? err.message : '加载查询建议失败'
  } finally {
    isLoading.value = false
  }
}

// 过滤建议
const filteredSuggestions = computed(() => {
  if (activeTab.value === 'all') {
    return suggestions.value
  }
  
  return suggestions.value.filter(suggestion => 
    suggestion.type.toLowerCase() === activeTab.value
  )
})

// 计算各类型建议的数量
const suggestionCounts = computed(() => {
  const counts = {
    all: suggestions.value.length,
    optimization: 0,
    security: 0,
    readability: 0,
    alternative: 0
  }
  
  suggestions.value.forEach(suggestion => {
    const type = suggestion.type.toLowerCase()
    if (type === 'optimization') counts.optimization++
    else if (type === 'security') counts.security++
    else if (type === 'readability') counts.readability++
    else if (type === 'alternative') counts.alternative++
  })
  
  return counts
})

// 获取建议类型对应的图标和颜色
const getTypeInfo = (type: string) => {
  switch (type.toLowerCase()) {
    case 'optimization':
      return { icon: 'fas fa-bolt', colorClass: 'text-yellow-500' }
    case 'security':
      return { icon: 'fas fa-shield-alt', colorClass: 'text-red-500' }
    case 'readability':
      return { icon: 'fas fa-glasses', colorClass: 'text-blue-500' }
    case 'alternative':
      return { icon: 'fas fa-exchange-alt', colorClass: 'text-green-500' }
    default:
      return { icon: 'fas fa-lightbulb', colorClass: 'text-gray-500' }
  }
}

// 获取建议影响程度对应的样式
const getImpactClass = (impact: string | undefined) => {
  switch (impact?.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
    case 'low':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
  }
}

// 获取建议类型中文名称
const getTypeName = (type: string) => {
  switch (type.toLowerCase()) {
    case 'optimization':
      return '性能优化'
    case 'security':
      return '安全建议'
    case 'readability':
      return '可读性'
    case 'alternative':
      return '替代方案'
    default:
      return '未知类型'
  }
}

// 应用建议
const applySuggestion = (suggestion: QuerySuggestion) => {
  if (suggestion.suggestedQuery) {
    emit('apply-suggestion', suggestion.suggestedQuery)
  }
}

// 监听queryId变化
watch(() => props.queryId, (newId) => {
  if (newId) {
    loadSuggestions()
  }
})

// 组件挂载时加载数据
onMounted(() => {
  loadSuggestions()
})
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex-grow flex items-center justify-center">
      <div class="flex flex-col items-center">
        <svg class="animate-spin h-8 w-8 text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600">加载查询建议中...</span>
      </div>
    </div>
    
    <!-- 错误信息 -->
    <div v-else-if="error" class="flex-grow flex items-center justify-center p-4">
      <div class="max-w-lg bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500 mx-auto mb-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <h3 class="text-red-800 font-medium mb-1">无法加载查询建议</h3>
        <p class="text-red-700 text-sm">{{ error }}</p>
      </div>
    </div>
    
    <!-- 无建议提示 -->
    <div v-else-if="suggestions.length === 0" class="flex-grow flex items-center justify-center">
      <div class="text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
        <p>没有查询建议</p>
        <p class="text-sm mt-1">当前查询没有可用的优化建议</p>
      </div>
    </div>
    
    <!-- 建议内容 -->
    <div v-else class="h-full flex flex-col">
      <!-- 标签导航 -->
      <div class="px-4 pt-4 pb-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-thin">
          <button
            @click="activeTab = 'all'"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium',
              activeTab === 'all' 
                ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            全部
            <span class="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600">{{ suggestionCounts.all }}</span>
          </button>
          
          <button
            @click="activeTab = 'optimization'"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium',
              activeTab === 'optimization' 
                ? 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <i class="fas fa-bolt mr-1"></i>
            性能优化
            <span class="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600">{{ suggestionCounts.optimization }}</span>
          </button>
          
          <button
            @click="activeTab = 'security'"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium',
              activeTab === 'security' 
                ? 'bg-red-50 text-red-700 dark:bg-red-900 dark:text-red-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <i class="fas fa-shield-alt mr-1"></i>
            安全建议
            <span class="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600">{{ suggestionCounts.security }}</span>
          </button>
          
          <button
            @click="activeTab = 'readability'"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium',
              activeTab === 'readability' 
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <i class="fas fa-glasses mr-1"></i>
            可读性
            <span class="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600">{{ suggestionCounts.readability }}</span>
          </button>
          
          <button
            @click="activeTab = 'alternative'"
            :class="[
              'px-3 py-1.5 rounded-md text-sm font-medium',
              activeTab === 'alternative' 
                ? 'bg-green-50 text-green-700 dark:bg-green-900 dark:text-green-300' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
            ]"
          >
            <i class="fas fa-exchange-alt mr-1"></i>
            替代方案
            <span class="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-600">{{ suggestionCounts.alternative }}</span>
          </button>
        </div>
      </div>
      
      <!-- 建议列表 -->
      <div class="flex-grow overflow-auto p-4">
        <!-- 无过滤结果提示 -->
        <div v-if="filteredSuggestions.length === 0" class="text-center text-gray-500 py-8">
          <i class="fas fa-filter text-3xl mb-2"></i>
          <p>没有符合当前筛选条件的建议</p>
        </div>
        
        <!-- 建议卡片列表 -->
        <div v-else class="space-y-4">
          <div 
            v-for="suggestion in filteredSuggestions" 
            :key="suggestion.id"
            class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <div class="p-4">
              <!-- 建议标题和类型 -->
              <div class="flex items-start mb-2">
                <div class="flex-shrink-0 mr-3">
                  <div 
                    class="w-10 h-10 rounded-full flex items-center justify-center"
                    :class="{
                      'bg-yellow-100 dark:bg-yellow-900': suggestion.type === 'OPTIMIZATION',
                      'bg-red-100 dark:bg-red-900': suggestion.type === 'SECURITY',
                      'bg-blue-100 dark:bg-blue-900': suggestion.type === 'READABILITY',
                      'bg-green-100 dark:bg-green-900': suggestion.type === 'ALTERNATIVE'
                    }"
                  >
                    <i :class="[getTypeInfo(suggestion.type).icon, getTypeInfo(suggestion.type).colorClass, 'text-lg']"></i>
                  </div>
                </div>
                
                <div class="flex-grow">
                  <div class="flex items-center justify-between">
                    <h3 class="text-base font-medium text-gray-900 dark:text-gray-100">{{ suggestion.title }}</h3>
                    
                    <div class="flex items-center space-x-2">
                      <span 
                        v-if="suggestion.impact"
                        class="px-2 py-0.5 text-xs rounded-full"
                        :class="getImpactClass(suggestion.impact)"
                      >
                        {{ suggestion.impact === 'HIGH' ? '高影响' : suggestion.impact === 'MEDIUM' ? '中影响' : '低影响' }}
                      </span>
                      
                      <span 
                        class="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      >
                        {{ getTypeName(suggestion.type) }}
                      </span>
                    </div>
                  </div>
                  
                  <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">{{ suggestion.description }}</p>
                </div>
              </div>
              
              <!-- 建议的SQL查询 -->
              <div v-if="suggestion.suggestedQuery" class="mt-2">
                <div class="bg-gray-100 dark:bg-gray-750 rounded-md p-3 overflow-x-auto">
                  <pre class="text-sm text-gray-800 dark:text-gray-300 whitespace-pre-wrap font-mono">{{ suggestion.suggestedQuery }}</pre>
                </div>
                
                <div class="mt-3 flex justify-end">
                  <button 
                    @click="applySuggestion(suggestion)"
                    class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md"
                  >
                    应用此建议
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.scrollbar-thin::-webkit-scrollbar {
  height: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 2px;
}

.scrollbar-thin::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>