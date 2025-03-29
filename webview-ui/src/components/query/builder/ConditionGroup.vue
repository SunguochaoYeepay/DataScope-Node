<template>
  <div class="border border-gray-300 rounded-lg p-4 mb-2" :class="{ 'bg-gray-50': level > 0 }">
    <!-- 组标题和操作 -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center">
        <span class="mr-2 text-sm font-medium text-gray-700">组条件</span>
        
        <!-- 逻辑操作符选择 -->
        <div class="flex rounded-md shadow-sm">
          <button 
            @click="updateLogicalOperator('AND')"
            class="px-3 py-1 text-xs font-medium border"
            :class="[
              value.logicalOperator === 'AND' 
                ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            AND
          </button>
          <button 
            @click="updateLogicalOperator('OR')"
            class="px-3 py-1 text-xs font-medium border"
            :class="[
              value.logicalOperator === 'OR' 
                ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            OR
          </button>
        </div>
      </div>
      
      <div class="flex space-x-2">
        <!-- 添加条件按钮 -->
        <button 
          @click="addCondition" 
          class="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          title="添加条件"
        >
          <i class="fas fa-plus mr-1"></i> 条件
        </button>

        <!-- 添加子组按钮 -->
        <button 
          @click="addGroup" 
          class="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
          title="添加条件组"
        >
          <i class="fas fa-layer-group mr-1"></i> 子组
        </button>
        
        <!-- 删除组按钮 -->
        <button 
          v-if="canDelete"
          @click="$emit('delete')" 
          class="inline-flex items-center px-2 py-1 border border-transparent rounded-md text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-1 focus:ring-red-500"
          title="删除组"
        >
          <i class="fas fa-times mr-1"></i> 删除
        </button>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="isEmpty" class="py-4 text-center bg-gray-50 rounded-lg">
      <p class="text-sm text-gray-500">条件组为空，请添加条件或子组</p>
    </div>
    
    <!-- 组内容 -->
    <div v-else class="space-y-2">
      <!-- 条件列表 -->
      <div 
        v-for="(condition, index) in value.conditions" 
        :key="condition.id"
        class="p-3 border border-gray-200 rounded-lg bg-white flex items-center"
      >
        <!-- 条件内容 -->
        <div class="flex-1 flex flex-wrap items-center gap-2">
          <!-- 字段名 -->
          <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
            {{ getFieldDisplayName(condition.field) }}
          </span>
          
          <!-- 操作符 -->
          <span class="px-2 py-1 bg-gray-200 text-gray-800 rounded text-sm">
            {{ getOperatorDisplay(condition.operator) }}
          </span>
          
          <!-- 值 -->
          <span class="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
            {{ formatConditionValue(condition) }}
          </span>
          
          <!-- 参数标记 -->
          <span 
            v-if="condition.isParameter" 
            class="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm"
          >
            参数: {{ condition.parameterName }}
          </span>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex space-x-1">
          <button 
            @click="editCondition(index)"
            class="p-1 text-gray-400 hover:text-indigo-600"
            title="编辑条件"
          >
            <i class="fas fa-edit"></i>
          </button>
          <button 
            @click="removeCondition(index)"
            class="p-1 text-gray-400 hover:text-red-600"
            title="移除条件"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <!-- 子条件组 -->
      <div 
        v-for="(group, index) in value.groups" 
        :key="group.id"
      >
        <ConditionGroup 
          :value="group"
          :tables="tables"
          :selectedTables="selectedTables"
          :level="level + 1"
          :can-delete="true"
          @update:value="updateGroup(index, $event)"
          @delete="deleteGroup(index)"
          @edit-condition="$emit('edit-condition', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { 
  ConditionGroup as ConditionGroupType, 
  LogicalOperator, 
  QueryCondition, 
  OperatorType, 
  TableField, 
  TableDefinition 
} from '@/types/builder'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps<{
  value: ConditionGroupType
  tables: TableDefinition[]
  selectedTables: string[]
  level?: number
  canDelete?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:value', value: ConditionGroupType): void
  (e: 'delete'): void
  (e: 'edit-condition', condition: { groupId: string, conditionIndex: number }): void
}>()

// 默认值
const level = computed(() => props.level || 0)

// 计算组是否为空
const isEmpty = computed(() => {
  return props.value.conditions.length === 0 && props.value.groups.length === 0
})

// 获取字段显示名称
const getFieldDisplayName = (field: TableField): string => {
  const table = props.tables.find(t => t.name === field.table)
  const tableName = table?.displayName || field.table
  return `${tableName}.${field.displayName || field.name}`
}

// 获取操作符显示文本
const getOperatorDisplay = (operator: OperatorType): string => {
  const operatorMap: Record<OperatorType, string> = {
    '=': '等于',
    '!=': '不等于',
    '>': '大于',
    '>=': '大于等于',
    '<': '小于',
    '<=': '小于等于',
    'LIKE': '包含',
    'NOT LIKE': '不包含',
    'IN': '在列表中',
    'NOT IN': '不在列表中',
    'IS NULL': '为空',
    'IS NOT NULL': '不为空',
    'BETWEEN': '介于'
  }
  
  return operatorMap[operator] || operator
}

// 格式化条件值
const formatConditionValue = (condition: QueryCondition): string => {
  if (condition.isParameter) {
    return `参数: ${condition.parameterName}`
  }
  
  if (['IS NULL', 'IS NOT NULL'].includes(condition.operator)) {
    return ''
  }
  
  if (condition.operator === 'BETWEEN' && Array.isArray(condition.value)) {
    return `${condition.value[0]} 到 ${condition.value[1]}`
  }
  
  if (['IN', 'NOT IN'].includes(condition.operator) && Array.isArray(condition.value)) {
    return condition.value.join(', ')
  }
  
  return String(condition.value)
}

// 更新逻辑操作符
const updateLogicalOperator = (operator: LogicalOperator) => {
  emit('update:value', {
    ...props.value,
    logicalOperator: operator
  })
}

// 添加条件
const addCondition = () => {
  emit('edit-condition', {
    groupId: props.value.id,
    conditionIndex: -1 // -1表示新增
  })
}

// 添加子组
const addGroup = () => {
  const newGroup: ConditionGroupType = {
    id: uuidv4(),
    logicalOperator: 'AND',
    conditions: [],
    groups: []
  }
  
  emit('update:value', {
    ...props.value,
    groups: [...props.value.groups, newGroup]
  })
}

// 编辑条件
const editCondition = (index: number) => {
  emit('edit-condition', {
    groupId: props.value.id,
    conditionIndex: index
  })
}

// 移除条件
const removeCondition = (index: number) => {
  const newConditions = [...props.value.conditions]
  newConditions.splice(index, 1)
  
  emit('update:value', {
    ...props.value,
    conditions: newConditions
  })
}

// 更新子组
const updateGroup = (index: number, newGroup: ConditionGroupType) => {
  const newGroups = [...props.value.groups]
  newGroups[index] = newGroup
  
  emit('update:value', {
    ...props.value,
    groups: newGroups
  })
}

// 删除子组
const deleteGroup = (index: number) => {
  const newGroups = [...props.value.groups]
  newGroups.splice(index, 1)
  
  emit('update:value', {
    ...props.value,
    groups: newGroups
  })
}
</script>