<template>
  <div class="bg-white p-4 border border-gray-300 rounded-lg mb-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">条件设置</h3>
      <div class="flex space-x-2">
        <button 
          @click="addCondition" 
          class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-plus mr-2"></i> 添加条件
        </button>
        <button 
          @click="addGroup" 
          class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="fas fa-layer-group mr-2"></i> 添加条件组
        </button>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="isEmpty" class="py-6 text-center bg-gray-50 rounded-lg">
      <div class="mx-auto w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
        <i class="fas fa-filter text-indigo-500"></i>
      </div>
      <h3 class="text-base font-medium text-gray-900">添加查询条件</h3>
      <p class="text-sm text-gray-500 mt-1 mb-4">条件可以帮助筛选数据，使结果更精确</p>
      <div class="flex space-x-2 justify-center">
        <button 
          @click="addCondition" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-plus mr-2"></i> 添加条件
        </button>
        <button 
          @click="addGroup" 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <i class="fas fa-layer-group mr-2"></i> 添加条件组
        </button>
      </div>
    </div>
    
    <!-- 条件组内容 -->
    <div v-else>
      <!-- 主逻辑操作符选择 -->
      <div class="mb-4 flex items-center space-x-4">
        <span class="text-sm text-gray-700">匹配方式:</span>
        <div class="flex rounded-md shadow-sm">
          <button 
            @click="updateLogicalOperator('AND')"
            class="px-4 py-2 text-sm font-medium border"
            :class="[
              value.logicalOperator === 'AND' 
                ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            满足所有条件 (AND)
          </button>
          <button 
            @click="updateLogicalOperator('OR')"
            class="px-4 py-2 text-sm font-medium border"
            :class="[
              value.logicalOperator === 'OR' 
                ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            ]"
          >
            满足任一条件 (OR)
          </button>
        </div>
      </div>
      
      <!-- 根条件组 -->
      <ConditionGroupComp 
        :value="value" 
        :tables="tables" 
        :selectedTables="selectedTables"
        :level="0"
        :can-delete="false"
        @update:value="updateRootGroup"
        @edit-condition="handleEditCondition"
      />
    </div>
  </div>
  
  <!-- 添加/编辑条件弹窗 -->
  <div v-if="showConditionModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ editingConditionIndex === null ? '添加条件' : '编辑条件' }}
        </h3>
      </div>
      
      <div class="p-6">
        <!-- 表和字段选择 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">字段</label>
          <div class="grid grid-cols-2 gap-4">
            <select 
              v-model="selectedTableName" 
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">选择表...</option>
              <option v-for="tableName in selectedTables" :key="tableName" :value="tableName">
                {{ getTableDisplayName(tableName) }}
              </option>
            </select>
            
            <select 
              v-model="selectedFieldName" 
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              :disabled="!selectedTableName"
            >
              <option value="">选择字段...</option>
              <option v-for="field in tableFields" :key="field.name" :value="field.name">
                {{ field.displayName || field.name }}
              </option>
            </select>
          </div>
        </div>
        
        <!-- 操作符选择 -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">操作符</label>
          <select 
            v-model="selectedOperator" 
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="=">等于 (=)</option>
            <option value="!=">不等于 (!=)</option>
            <option value=">">大于 (>)</option>
            <option value=">=">大于等于 (>=)</option>
            <option value="<">小于 (<)</option>
            <option value="<=">小于等于 (<=)</option>
            <option value="LIKE">包含 (LIKE)</option>
            <option value="NOT LIKE">不包含 (NOT LIKE)</option>
            <option value="IN">在列表中 (IN)</option>
            <option value="NOT IN">不在列表中 (NOT IN)</option>
            <option value="IS NULL">为空 (IS NULL)</option>
            <option value="IS NOT NULL">不为空 (IS NOT NULL)</option>
            <option value="BETWEEN">介于 (BETWEEN)</option>
          </select>
        </div>
        
        <!-- 值输入 -->
        <div class="mb-4" v-if="needsValueInput">
          <label class="block text-sm font-medium text-gray-700 mb-1">条件值</label>
          
          <!-- 普通值输入 -->
          <input 
            v-if="!isListOperator && !isRangeOperator"
            v-model="conditionValue" 
            type="text" 
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="输入值..."
          />
          
          <!-- 列表值输入 (IN / NOT IN) -->
          <div v-else-if="isListOperator" class="space-y-2">
            <div v-for="(item, idx) in listValues" :key="idx" class="flex">
              <input 
                v-model="listValues[idx]" 
                type="text" 
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="输入值..."
              />
              <button 
                @click="removeListItem(idx)"
                class="ml-2 p-2 text-gray-400 hover:text-red-600"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button 
              @click="addListItem"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <i class="fas fa-plus mr-2"></i> 添加项
            </button>
          </div>
          
          <!-- 范围值输入 (BETWEEN) -->
          <div v-else-if="isRangeOperator" class="grid grid-cols-2 gap-4">
            <input 
              v-model="rangeStart" 
              type="text" 
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="开始值..."
            />
            <input 
              v-model="rangeEnd" 
              type="text" 
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="结束值..."
            />
          </div>
        </div>
        
        <!-- 参数设置 -->
        <div class="mb-4">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="isParameterCheck"
              v-model="isParameter" 
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="isParameterCheck" class="ml-2 block text-sm text-gray-700">设为查询参数</label>
          </div>
          
          <!-- 参数名输入 -->
          <div v-if="isParameter" class="mt-2">
            <input 
              v-model="parameterName" 
              type="text" 
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="参数名..."
            />
          </div>
        </div>
      </div>
      
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          @click="closeConditionModal" 
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          取消
        </button>
        <button 
          @click="confirmCondition" 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="!canConfirmCondition"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { 
  ConditionGroup as ConditionGroupType, 
  LogicalOperator, 
  QueryCondition, 
  OperatorType, 
  TableField, 
  TableDefinition 
} from '@/types/builder'
import { v4 as uuidv4 } from 'uuid'
import ConditionGroupComp from './ConditionGroup.vue'

// 属性定义
const props = defineProps<{
  value: ConditionGroupType
  tables: TableDefinition[]
  selectedTables: string[]
}>()

// 事件
const emit = defineEmits<{
  (e: 'update:value', value: ConditionGroupType): void
}>()

// 状态
const value = ref<ConditionGroupType>(props.value)
const showConditionModal = ref(false)
const editingConditionIndex = ref<number | null>(null)
const currentGroupId = ref<string>('') // 当前正在编辑的组ID
const selectedTableName = ref('')
const selectedFieldName = ref('')
const selectedOperator = ref<OperatorType>('=')
const conditionValue = ref('')
const isParameter = ref(false)
const parameterName = ref('')
const listValues = ref<string[]>([''])
const rangeStart = ref('')
const rangeEnd = ref('')

// 计算属性
// 条件组是否为空
const isEmpty = computed(() => {
  return value.value.conditions.length === 0 && value.value.groups.length === 0
})

// 表的可用字段
const tableFields = computed(() => {
  if (!selectedTableName.value) return []
  
  const table = props.tables.find(t => t.name === selectedTableName.value)
  return table?.fields || []
})

// 选中的字段
const selectedField = computed((): TableField | undefined => {
  if (!selectedTableName.value || !selectedFieldName.value) return undefined
  
  return tableFields.value.find(f => f.name === selectedFieldName.value)
})

// 是否是需要列表值的操作符
const isListOperator = computed(() => {
  return ['IN', 'NOT IN'].includes(selectedOperator.value)
})

// 是否是需要范围值的操作符
const isRangeOperator = computed(() => {
  return selectedOperator.value === 'BETWEEN'
})

// 是否需要值输入
const needsValueInput = computed(() => {
  return !['IS NULL', 'IS NOT NULL'].includes(selectedOperator.value)
})

// 是否可以确认条件
const canConfirmCondition = computed(() => {
  if (!selectedField.value || !selectedOperator.value) {
    return false
  }
  
  // 不需要值的操作符直接返回true
  if (!needsValueInput.value) {
    return true
  }
  
  // 检查参数设置
  if (isParameter.value && !parameterName.value) {
    return false
  }
  
  // 检查普通值
  if (!isListOperator.value && !isRangeOperator.value) {
    return isParameter.value || conditionValue.value.trim() !== ''
  }
  
  // 检查列表值
  if (isListOperator.value) {
    return isParameter.value || listValues.value.some(v => v.trim() !== '')
  }
  
  // 检查范围值
  if (isRangeOperator.value) {
    return isParameter.value || (rangeStart.value.trim() !== '' && rangeEnd.value.trim() !== '')
  }
  
  return false
})

// 方法
// 获取表显示名称
const getTableDisplayName = (tableName: string): string => {
  const table = props.tables.find(t => t.name === tableName)
  return table?.displayName || tableName
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
  editingConditionIndex.value = null
  resetConditionForm()
  currentGroupId.value = value.value.id // 设置当前组ID为根组
  showConditionModal.value = true
}

// 添加条件组
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

// 更新根组
const updateRootGroup = (newGroup: ConditionGroupType) => {
  emit('update:value', newGroup)
}

// 处理编辑条件
const handleEditCondition = ({ groupId, conditionIndex }: { groupId: string, conditionIndex: number }) => {
  currentGroupId.value = groupId
  
  // 找到对应的组
  let targetGroup = findGroupById(value.value, groupId)
  if (!targetGroup) return
  
  if (conditionIndex === -1) {
    // 新增条件
    editingConditionIndex.value = null
    resetConditionForm()
  } else {
    // 编辑条件
    const condition = targetGroup.conditions[conditionIndex]
    if (!condition) return
    
    editingConditionIndex.value = conditionIndex
    
    // 填充表单
    selectedTableName.value = condition.field.table
    selectedFieldName.value = condition.field.name
    selectedOperator.value = condition.operator
    isParameter.value = condition.isParameter || false
    parameterName.value = condition.parameterName || ''
    
    // 处理不同类型的值
    if (['IN', 'NOT IN'].includes(condition.operator) && Array.isArray(condition.value)) {
      listValues.value = condition.value.map(String)
    } else if (condition.operator === 'BETWEEN' && Array.isArray(condition.value)) {
      rangeStart.value = String(condition.value[0] || '')
      rangeEnd.value = String(condition.value[1] || '')
    } else if (condition.value !== undefined && condition.value !== null) {
      conditionValue.value = String(condition.value)
    }
  }
  
  showConditionModal.value = true
}

// 递归查找条件组
const findGroupById = (root: ConditionGroupType, groupId: string): ConditionGroupType | null => {
  if (root.id === groupId) {
    return root
  }
  
  for (const group of root.groups) {
    const found = findGroupById(group, groupId)
    if (found) {
      return found
    }
  }
  
  return null
}

// 添加列表项
const addListItem = () => {
  listValues.value.push('')
}

// 移除列表项
const removeListItem = (index: number) => {
  listValues.value.splice(index, 1)
  if (listValues.value.length === 0) {
    listValues.value = ['']
  }
}

// 确认条件
const confirmCondition = () => {
  // 确保有有效的字段
  if (!selectedField.value) return
  
  // 准备条件值
  let conditionValueFinal: any
  
  if (isParameter.value) {
    // 参数值使用null占位
    conditionValueFinal = null
  } else if (!needsValueInput.value) {
    // IS NULL / IS NOT NULL不需要值
    conditionValueFinal = null
  } else if (isListOperator.value) {
    // 列表值
    conditionValueFinal = listValues.value.filter(v => v.trim() !== '')
  } else if (isRangeOperator.value) {
    // 范围值
    conditionValueFinal = [rangeStart.value.trim(), rangeEnd.value.trim()]
  } else {
    // 普通值
    conditionValueFinal = conditionValue.value
  }
  
  // 找到当前组
  const targetGroup = findGroupById(value.value, currentGroupId.value)
  if (!targetGroup) return
  
  const condition: QueryCondition = {
    id: (editingConditionIndex.value !== null && targetGroup.conditions[editingConditionIndex.value]) ? 
      targetGroup.conditions[editingConditionIndex.value].id : 
      uuidv4(),
    field: { ...selectedField.value },
    operator: selectedOperator.value,
    value: conditionValueFinal,
    isParameter: isParameter.value,
    parameterName: isParameter.value ? parameterName.value : undefined
  }
  
  // 创建新的变更保证响应性
  const updateGroup = (group: ConditionGroupType): ConditionGroupType => {
    if (group.id === targetGroup.id) {
      const newConditions = [...group.conditions]
      
      if (editingConditionIndex.value !== null) {
        newConditions[editingConditionIndex.value] = condition
      } else {
        newConditions.push(condition)
      }
      
      return {
        ...group,
        conditions: newConditions
      }
    }
    
    return {
      ...group,
      groups: group.groups.map(g => updateGroup(g))
    }
  }
  
  // 更新值
  const updatedValue = updateGroup(value.value)
  emit('update:value', updatedValue)
  
  // 关闭弹窗
  closeConditionModal()
}

// 关闭条件弹窗
const closeConditionModal = () => {
  showConditionModal.value = false
  editingConditionIndex.value = null
  resetConditionForm()
}

// 重置条件表单
const resetConditionForm = () => {
  selectedTableName.value = props.selectedTables.length > 0 ? props.selectedTables[0] : ''
  selectedFieldName.value = ''
  selectedOperator.value = '='
  conditionValue.value = ''
  isParameter.value = false
  parameterName.value = ''
  listValues.value = ['']
  rangeStart.value = ''
  rangeEnd.value = ''
}

// 同步属性与状态
watch(() => props.value, (newValue) => {
  value.value = newValue
  
  // 如果是添加第一个条件，自动选择第一个表
  if (isEmpty.value && props.selectedTables.length > 0) {
    resetConditionForm()
  }
})
</script>