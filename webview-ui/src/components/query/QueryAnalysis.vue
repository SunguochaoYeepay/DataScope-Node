<script setup lang="ts">
import { ref, onMounted } from 'vue'
import QueryExecutionPlan from './QueryExecutionPlan.vue'
import QuerySuggestions from './QuerySuggestions.vue'

// 定义组件属性
const props = defineProps<{
  queryId: string
}>()

// 定义事件
const emit = defineEmits<{
  (e: 'apply-suggestion', query: string): void
}>()

// 当前激活的标签页
const activeTab = ref<'plan' | 'suggestions'>('plan')

// 处理应用建议事件
const handleApplySuggestion = (query: string) => {
  emit('apply-suggestion', query)
}
</script>

<template>
  <div class="h-full flex flex-col">
    <!-- 标签导航 -->
    <div class="flex border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <button
        @click="activeTab = 'plan'"
        :class="[
          'px-4 py-2 text-sm font-medium border-b-2 focus:outline-none',
          activeTab === 'plan'
            ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
        ]"
      >
        <i class="fas fa-project-diagram mr-2"></i>
        执行计划
      </button>
      
      <button
        @click="activeTab = 'suggestions'"
        :class="[
          'px-4 py-2 text-sm font-medium border-b-2 focus:outline-none',
          activeTab === 'suggestions'
            ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:border-gray-600'
        ]"
      >
        <i class="fas fa-lightbulb mr-2"></i>
        优化建议
      </button>
    </div>
    
    <!-- 内容区域 -->
    <div class="flex-grow overflow-hidden">
      <!-- 执行计划 -->
      <div v-if="activeTab === 'plan'" class="h-full">
        <QueryExecutionPlan :query-id="queryId" />
      </div>
      
      <!-- 优化建议 -->
      <div v-else-if="activeTab === 'suggestions'" class="h-full">
        <QuerySuggestions 
          :query-id="queryId" 
          @apply-suggestion="handleApplySuggestion"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.flex-grow {
  flex-grow: 1;
  min-height: 0;
}
</style>