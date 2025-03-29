<template>
  <div class="bg-white shadow rounded-lg mb-6">
    <div class="px-6 py-5 border-b border-gray-200 flex justify-between items-center">
      <h2 class="text-lg font-medium text-gray-900">基本信息</h2>
      <div class="flex space-x-2">
        <button
          @click="handleFavorite"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm"
          :class="query.isFavorite ? 'bg-yellow-50 text-yellow-800 hover:bg-yellow-100' : 'bg-white text-gray-700 hover:bg-gray-50'"
        >
          <i :class="[query.isFavorite ? 'fas fa-star text-yellow-500' : 'far fa-star', 'mr-1.5']"></i>
          {{ query.isFavorite ? '已收藏' : '收藏' }}
        </button>
        
        <button
          @click="handleShare"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
        >
          <i class="fas fa-share-alt mr-1.5"></i>
          分享
        </button>
        
        <button
          @click="handleEdit"
          class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-edit mr-1.5"></i>
          编辑查询
        </button>
        
        <button
          @click="handleExecute"
          :class="[
            'inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
            canExecute ? 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' : 
                        'bg-green-300 opacity-60 cursor-not-allowed'
          ]"
          :title="getExecuteButtonTooltip()"
        >
          <i class="fas fa-play mr-1.5"></i>
          执行
        </button>
      </div>
    </div>
    
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <h3 class="text-sm font-medium text-gray-500">查询名称</h3>
          <p class="mt-1 text-sm text-gray-900">{{ query.name || '未命名查询' }}</p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-500">查询类型</h3>
          <p class="mt-1 text-sm text-gray-900">{{ query.queryType === 'SQL' ? 'SQL' : '自然语言' }}</p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-500">数据源</h3>
          <p class="mt-1 text-sm text-gray-900">{{ dataSourceName }}</p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-500">状态</h3>
          <div class="mt-1">
            <span
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="getStatusClass(query.status)"
            >
              {{ getStatusDisplay(query.status) }}
            </span>
          </div>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-500">创建时间</h3>
          <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(query.createdAt) }}</p>
        </div>
        
        <div>
          <h3 class="text-sm font-medium text-gray-500">执行时间</h3>
          <p class="mt-1 text-sm text-gray-900">{{ formatExecutionTime(query.executionTime) }}</p>
        </div>
      </div>
      
      <div class="mt-4">
        <h3 class="text-sm font-medium text-gray-500">查询内容</h3>
        <div class="mt-1 p-3 bg-gray-50 rounded border border-gray-200 overflow-auto max-h-32">
          <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ query.queryText }}</pre>
        </div>
      </div>

      <div v-if="query.description" class="mt-4">
        <h3 class="text-sm font-medium text-gray-500">描述</h3>
        <p class="mt-1 text-sm text-gray-900">{{ query.description }}</p>
      </div>

      <div v-if="query.tags && query.tags.length > 0" class="mt-4">
        <h3 class="text-sm font-medium text-gray-500">标签</h3>
        <div class="mt-1">
          <span 
            v-for="(tag, index) in query.tags" 
            :key="index"
            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2"
          >
            {{ tag }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDataSourceStore } from '@/stores/datasource'
import type { Query, QueryStatus } from '@/types/query'

const props = defineProps<{
  query: Query
}>()

const emit = defineEmits<{
  (e: 'favorite', id: string): void
  (e: 'share', id: string): void
  (e: 'edit', id: string): void
  (e: 'execute', id: string): void
}>()

const dataSourceStore = useDataSourceStore()

// 计算属性：数据源名称
const dataSourceName = computed(() => {
  const dataSource = dataSourceStore.dataSources.find(ds => ds.id === props.query.dataSourceId)
  return dataSource ? dataSource.name : props.query.dataSourceId
})

// 获取查询状态样式类
const getStatusClass = (status: QueryStatus) => {
  switch (status) {
    case 'COMPLETED':
      return 'bg-green-100 text-green-800'
    case 'RUNNING':
      return 'bg-blue-100 text-blue-800'
    case 'FAILED':
      return 'bg-red-100 text-red-800'
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// 获取查询状态显示文本
const getStatusDisplay = (status: QueryStatus) => {
  switch (status) {
    case 'COMPLETED':
      return '完成'
    case 'RUNNING':
      return '运行中'
    case 'FAILED':
      return '失败'
    case 'CANCELLED':
      return '已取消'
    default:
      return status
  }
}

// 格式化日期时间
const formatDateTime = (dateString: string) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 格式化执行时间
const formatExecutionTime = (ms: number | undefined) => {
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

// 计算属性：判断是否可以执行查询
const canExecute = computed(() => {
  console.log('Query object:', props.query);
  console.log('DataSourceId:', props.query?.dataSourceId);
  console.log('QueryText:', props.query?.queryText);
  const result = props.query && props.query.dataSourceId && props.query.queryText && props.query.queryText.trim().length > 0;
  console.log('CanExecute result:', result);
  return result;
})

// 收藏/取消收藏操作
const handleFavorite = () => {
  emit('favorite', props.query.id)
}

// 分享操作
const handleShare = () => {
  emit('share', props.query.id)
}

// 编辑操作
const handleEdit = () => {
  emit('edit', props.query.id)
}

// 执行操作
const handleExecute = () => {
  emit('execute', props.query.id)
}

// 获取执行按钮提示信息
const getExecuteButtonTooltip = () => {
  if (!props.query) {
    return '查询对象为空，无法执行'
  }
  if (!props.query.dataSourceId) {
    return '请选择数据源后再执行查询'
  }
  if (!props.query.queryText || props.query.queryText.trim() === '') {
    return '查询内容为空，无法执行'
  }
  return '执行查询'
}
</script> 