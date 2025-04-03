<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useQueryStore } from '@/stores/query'
import type { QueryExecutionPlan } from '@/types/query'

// 定义组件属性
const props = defineProps<{
  queryId: string
}>()

const queryStore = useQueryStore()

// 执行计划状态
const executionPlan = ref<QueryExecutionPlan | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// 加载执行计划
const loadExecutionPlan = async () => {
  if (!props.queryId) {
    error.value = '缺少查询ID'
    isLoading.value = false
    return
  }
  
  isLoading.value = true
  error.value = null
  
  try {
    console.log(`QueryExecutionPlan组件: 开始加载查询执行计划, queryId: ${props.queryId}`);
    const plan = await queryStore.getQueryExecutionPlan(props.queryId)
    console.log('QueryExecutionPlan组件: 获取到执行计划:', plan);
    executionPlan.value = plan
    
    // 检查执行计划数据是否有效
    if (plan && plan.planDetails && 
        plan.planDetails.steps && 
        plan.planDetails.steps.length > 0) {
      console.log(`QueryExecutionPlan组件: 执行计划有效，包含 ${plan.planDetails.steps.length} 个步骤`);
    } else {
      console.warn('QueryExecutionPlan组件: 执行计划数据不完整或为空');
    }
  } catch (err) {
    console.error('加载执行计划失败:', err)
    error.value = err instanceof Error ? err.message : '加载执行计划失败'
  } finally {
    isLoading.value = false
  }
}

// 计算属性：执行计划步骤
const executionSteps = computed(() => {
  if (!executionPlan.value || !executionPlan.value.planDetails || !executionPlan.value.planDetails.steps) {
    return []
  }
  
  return executionPlan.value.planDetails.steps
})

// 计算属性：总成本
const totalCost = computed(() => {
  if (!executionPlan.value || !executionPlan.value.planDetails) {
    return 0
  }
  
  return executionPlan.value.planDetails.totalCost
})

// 计算属性：估计行数
const estimatedRows = computed(() => {
  if (!executionPlan.value || !executionPlan.value.planDetails) {
    return 0
  }
  
  return executionPlan.value.planDetails.estimatedRows
})

// 获取步骤类型对应的图标
const getStepIcon = (stepType: string) => {
  switch (stepType.toLowerCase()) {
    case 'tablescan':
      return 'fas fa-table'
    case 'filter':
      return 'fas fa-filter'
    case 'sort':
      return 'fas fa-sort'
    case 'join':
      return 'fas fa-link'
    case 'groupby':
      return 'fas fa-object-group'
    case 'aggregate':
      return 'fas fa-calculator'
    case 'limit':
      return 'fas fa-compress-arrows-alt'
    case 'union':
      return 'fas fa-object-ungroup'
    default:
      return 'fas fa-cog'
  }
}

// 获取步骤类型对应的描述
const getStepDescription = (step: any) => {
  const { type, table, condition, columns } = step
  
  switch (type.toLowerCase()) {
    case 'tablescan':
      return `扫描表 ${table || '未知'}`
    case 'filter':
      return `条件过滤: ${condition || '未知条件'}`
    case 'sort':
      return `排序字段: ${Array.isArray(columns) ? columns.join(', ') : '未知'}`
    case 'join':
      return `关联表: ${table || '未知'}`
    case 'groupby':
      return `分组字段: ${Array.isArray(columns) ? columns.join(', ') : '未知'}`
    case 'aggregate':
      return `聚合计算`
    case 'limit':
      return `限制结果行数`
    default:
      return `${type} 操作`
  }
}

// 获取步骤的成本类别（用于颜色标识）
const getCostClass = (cost: number, totalCost: number) => {
  const percentage = (cost / totalCost) * 100
  
  if (percentage > 50) {
    return 'text-red-600 font-bold'
  } else if (percentage > 20) {
    return 'text-orange-500'
  } else if (percentage > 10) {
    return 'text-yellow-500'
  } else {
    return 'text-green-600'
  }
}

// 监听queryId变化
watch(() => props.queryId, (newId) => {
  if (newId) {
    loadExecutionPlan()
  }
})

// 组件挂载时加载数据
onMounted(() => {
  loadExecutionPlan()
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
        <span class="text-gray-600">加载执行计划中...</span>
      </div>
    </div>
    
    <!-- 错误信息 -->
    <div v-else-if="error" class="flex-grow flex items-center justify-center p-4">
      <div class="max-w-lg bg-red-50 border border-red-200 rounded-lg p-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-red-500 mx-auto mb-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <h3 class="text-red-800 font-medium mb-1">无法加载执行计划</h3>
        <p class="text-red-700 text-sm">{{ error }}</p>
      </div>
    </div>
    
    <!-- 执行计划内容 -->
    <div v-else-if="executionPlan" class="h-full overflow-auto p-4">
      <!-- 执行计划摘要 -->
      <div class="mb-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">执行计划摘要</h3>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">总成本</p>
            <p class="text-xl font-bold" :class="getCostClass(totalCost, totalCost)">{{ totalCost.toFixed(2) }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-1">估计行数</p>
            <p class="text-xl font-bold text-blue-600">{{ estimatedRows.toLocaleString() }}</p>
          </div>
        </div>
      </div>
      
      <!-- 执行步骤列表 -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-medium p-4 border-b border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100">执行步骤</h3>
        
        <div class="divide-y divide-gray-200 dark:divide-gray-700">
          <div 
            v-for="(step, index) in executionSteps" 
            :key="index"
            class="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
          >
            <div class="flex items-start">
              <!-- 步骤序号 -->
              <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3 text-blue-600 dark:text-blue-300 font-medium">
                {{ index + 1 }}
              </div>
              
              <!-- 步骤内容 -->
              <div class="flex-grow">
                <div class="flex items-center mb-1">
                  <i :class="[getStepIcon(step.type), 'mr-2 text-gray-600 dark:text-gray-400']"></i>
                  <h4 class="font-medium text-gray-900 dark:text-gray-100">{{ step.type }}</h4>
                </div>
                
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{{ getStepDescription(step) }}</p>
                
                <div class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  <div class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400 mr-1">成本:</span>
                    <span :class="getCostClass(step.cost, totalCost)">{{ step.cost.toFixed(2) }}</span>
                  </div>
                  
                  <div class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400 mr-1">行数:</span>
                    <span class="font-medium">{{ step.rows.toLocaleString() }}</span>
                  </div>
                  
                  <div v-if="step.cost && totalCost" class="flex items-center">
                    <span class="text-gray-500 dark:text-gray-400 mr-1">占比:</span>
                    <div class="w-24 h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        class="h-full rounded-full"
                        :class="{
                          'bg-red-500': (step.cost / totalCost) > 0.5,
                          'bg-orange-500': (step.cost / totalCost) <= 0.5 && (step.cost / totalCost) > 0.2,
                          'bg-yellow-500': (step.cost / totalCost) <= 0.2 && (step.cost / totalCost) > 0.1,
                          'bg-green-500': (step.cost / totalCost) <= 0.1
                        }"
                        :style="{ width: `${(step.cost / totalCost) * 100}%` }"
                      ></div>
                    </div>
                    <span class="ml-1 text-xs">{{ ((step.cost / totalCost) * 100).toFixed(1) }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 无数据提示 -->
    <div v-else class="flex-grow flex items-center justify-center">
      <div class="text-center text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p>无执行计划数据</p>
        <p class="text-sm mt-1">可能是查询尚未执行或不支持执行计划</p>
        
        <!-- 添加手动获取执行计划按钮 -->
        <button 
          @click="loadExecutionPlan" 
          class="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          <i class="fas fa-sync-alt mr-2"></i>
          获取执行计划
        </button>
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
</style>