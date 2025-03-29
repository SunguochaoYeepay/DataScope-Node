<template>
  <div class="bg-white p-4 border border-gray-300 rounded-lg mb-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">选择字段</h3>
      <div class="flex space-x-2">
        <button 
          @click="openFieldModal('field')"
          class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-columns mr-2"></i> 添加字段
        </button>
        <button 
          @click="openFieldModal('expression')"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-code mr-2"></i> 添加表达式
        </button>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-if="value.length === 0" class="py-6 text-center bg-gray-50 rounded-lg">
      <div class="mx-auto w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
        <i class="fas fa-columns text-indigo-500"></i>
      </div>
      <h3 class="text-base font-medium text-gray-900">选择要显示的字段</h3>
      <p class="text-sm text-gray-500 mt-1 mb-4">从表中选择要展示的字段，可以添加别名、聚合函数，或创建自定义表达式</p>
      <div class="flex space-x-3 justify-center">
        <button 
          @click="openFieldModal('field')"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-columns mr-2"></i> 添加字段
        </button>
        <button 
          @click="openFieldModal('expression')"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-code mr-2"></i> 添加表达式
        </button>
      </div>
    </div>
    
    <!-- 字段列表 -->
    <div v-else>
      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                字段/表达式
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                别名
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                显示
              </th>
              <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(fieldSelection, index) in value" :key="fieldSelection.id">
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                <div class="flex items-center">
                  <i v-if="fieldSelection.isExpression" class="fas fa-code text-indigo-400 mr-2" title="表达式"></i>
                  <i v-else class="fas fa-columns text-gray-400 mr-2" title="数据库字段"></i>
                  <span>
                    {{ getFieldDisplayText(fieldSelection) }}
                  </span>
                </div>
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                {{ fieldSelection.alias || '-' }}
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                <span v-if="fieldSelection.isExpression">
                  {{ getExpressionTypeName(fieldSelection.expressionDefinition?.type) }}
                </span>
                <span v-else-if="fieldSelection.aggregate">
                  {{ fieldSelection.aggregate }}
                </span>
                <span v-else>
                  -
                </span>
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                <span 
                  class="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="fieldSelection.isVisible ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
                >
                  {{ fieldSelection.isVisible ? '是' : '否' }}
                </span>
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                <div class="flex space-x-1">
                  <button 
                    @click="editField(index)"
                    class="text-indigo-600 hover:text-indigo-900"
                  >
                    <i class="fas fa-edit"></i>
                  </button>
                  <button 
                    @click="removeField(index)"
                    class="text-red-600 hover:text-red-900"
                  >
                    <i class="fas fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 快速添加所有字段按钮 -->
      <div class="mt-4 flex justify-center">
        <button 
          @click="addAllFields"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-magic mr-2"></i> 添加所有字段
        </button>
      </div>
    </div>
  </div>
  
  <!-- 添加/编辑字段弹窗 -->
  <div v-if="showFieldModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ getModalTitle() }}
        </h3>
      </div>
      
      <div class="p-6" v-if="!showExpressionEditor">
        <!-- 普通字段编辑 -->
        <div v-if="!isExpression">
          <!-- 表和字段选择 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">选择字段</label>
            <div class="grid grid-cols-2 gap-4">
              <select 
                v-model="selectedTableName" 
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :disabled="editingFieldIndex !== null && !isNewField"
              >
                <option value="">选择表...</option>
                <option v-for="tableName in selectedTables" :key="tableName" :value="tableName">
                  {{ getTableDisplayName(tableName) }}
                </option>
              </select>
              
              <select 
                v-model="selectedFieldName" 
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                :disabled="!selectedTableName || (editingFieldIndex !== null && !isNewField)"
              >
                <option value="">选择字段...</option>
                <option v-for="field in tableFields" :key="field.name" :value="field.name">
                  {{ field.displayName || field.name }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- 别名 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">别名 (可选)</label>
            <input 
              v-model="fieldAlias" 
              type="text" 
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="字段别名..."
            />
          </div>
          
          <!-- 聚合函数 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">聚合函数 (可选)</label>
            <select 
              v-model="aggregateFunction" 
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">无聚合</option>
              <option value="SUM">SUM (求和)</option>
              <option value="AVG">AVG (平均值)</option>
              <option value="COUNT">COUNT (计数)</option>
              <option value="COUNT_DISTINCT">COUNT DISTINCT (去重计数)</option>
              <option value="MAX">MAX (最大值)</option>
              <option value="MIN">MIN (最小值)</option>
            </select>
          </div>
        </div>
        
        <!-- 表达式选择 -->
        <div v-else>
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">表达式类型</label>
            <select 
              v-model="expressionType" 
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="CASE">CASE WHEN 条件判断</option>
              <option value="FUNCTION">SQL 函数</option>
              <option value="MATH">数学运算</option>
              <option value="CUSTOM">自定义表达式</option>
            </select>
          </div>
          
          <!-- 自定义表达式输入 -->
          <div v-if="expressionType === 'CUSTOM'" class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">SQL表达式</label>
            <textarea 
              v-model="customExpression" 
              rows="5"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="输入SQL表达式..."
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">
              可以输入任何有效的SQL表达式，如：CONCAT(first_name, ' ', last_name)
            </p>
          </div>
          
          <!-- 点击打开高级表达式编辑器按钮 -->
          <div class="mb-4">
            <button
              @click="openExpressionEditor"
              class="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full justify-center"
            >
              <i class="fas fa-code mr-2"></i> 打开高级表达式编辑器
            </button>
          </div>
          
          <!-- 别名 -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">别名 (可选)</label>
            <input 
              v-model="fieldAlias" 
              type="text" 
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="表达式别名..."
            />
          </div>
        </div>
        
        <!-- 是否显示 -->
        <div class="mb-4">
          <div class="flex items-center">
            <input 
              type="checkbox" 
              id="isVisibleCheck"
              v-model="isVisible" 
              class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label for="isVisibleCheck" class="ml-2 block text-sm text-gray-700">在结果中显示</label>
          </div>
        </div>
      </div>
      
      <!-- 表达式编辑器 -->
      <div v-if="showExpressionEditor" class="p-6">
        <ExpressionEditor
          :tables="tables"
          :selectedTables="selectedTables"
          :initial-expression="customExpression"
          :initial-alias="fieldAlias"
          @update:expression="updateExpression"
          @cancel="closeExpressionEditor"
        />
      </div>
      
      <!-- 弹窗底部按钮 -->
      <div v-if="!showExpressionEditor" class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          @click="closeFieldModal" 
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          取消
        </button>
        <button 
          @click="confirmField" 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="!canConfirmField"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { 
  TableDefinition, 
  TableField, 
  FieldSelection, 
  ExpressionType,
  ExpressionDefinition,
  AggregateFunction
} from '@/types/builder'
import { v4 as uuidv4 } from 'uuid'
import ExpressionEditor from './ExpressionEditor.vue'

// 属性定义
const props = defineProps<{
  value: FieldSelection[]
  tables: TableDefinition[]
  selectedTables: string[]
}>()

// 事件
const emit = defineEmits<{
  (e: 'update:value', value: FieldSelection[]): void
}>()

// 状态
const showFieldModal = ref(false)
const editingFieldIndex = ref<number | null>(null)
const isNewField = ref(true)
const selectedTableName = ref('')
const selectedFieldName = ref('')
const fieldAlias = ref('')
const aggregateFunction = ref<AggregateFunction>(null)
const isVisible = ref(true)
const isExpression = ref(false)
const expressionType = ref<ExpressionType>('CASE')
const customExpression = ref('')
const showExpressionEditor = ref(false)

// 计算属性
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

// 是否可以确认字段选择
const canConfirmField = computed(() => {
  // 如果是表达式字段
  if (isExpression.value) {
    return expressionType.value === 'CUSTOM' ? !!customExpression.value : true
  }
  
  // 编辑模式下可以直接确认
  if (editingFieldIndex.value !== null && !isNewField.value) {
    return true
  }
  
  // 添加模式需要选择表和字段
  return !!selectedTableName.value && !!selectedFieldName.value
})

// 方法
// 获取弹窗标题
const getModalTitle = () => {
  if (editingFieldIndex.value !== null) {
    return isExpression.value ? '编辑表达式' : '编辑字段'
  } else {
    return isExpression.value ? '添加表达式' : '添加字段'
  }
}

// 获取表达式类型名称
const getExpressionTypeName = (type?: ExpressionType): string => {
  switch(type) {
    case 'CASE': return '条件判断'
    case 'FUNCTION': return '函数'
    case 'MATH': return '数学运算'
    case 'CUSTOM': return '自定义'
    default: return '表达式'
  }
}

// 获取字段/表达式显示文本
const getFieldDisplayText = (fieldSelection: FieldSelection): string => {
  if (fieldSelection.isExpression) {
    if (fieldSelection.expressionDefinition?.expression) {
      return fieldSelection.expressionDefinition.expression
    } else if (fieldSelection.expression) {
      return fieldSelection.expression
    } else {
      return '自定义表达式'
    }
  } else if (fieldSelection.field) {
    const table = props.tables.find(t => t.name === fieldSelection.field?.table)
    const tableName = table?.displayName || fieldSelection.field.table
    return `${tableName}.${fieldSelection.field.displayName || fieldSelection.field.name}`
  } else {
    return '未知字段'
  }
}

// 获取表显示名称
const getTableDisplayName = (tableName: string): string => {
  const table = props.tables.find(t => t.name === tableName)
  return table?.displayName || tableName
}

// 打开添加字段弹窗
const openFieldModal = (type: 'field' | 'expression') => {
  editingFieldIndex.value = null
  isNewField.value = true
  isExpression.value = type === 'expression'
  resetFieldForm()
  
  // 默认选择第一个表
  if (type === 'field' && props.selectedTables.length > 0) {
    selectedTableName.value = props.selectedTables[0]
  }
  
  showFieldModal.value = true
}

// 打开表达式编辑器
const openExpressionEditor = () => {
  showExpressionEditor.value = true
}

// 关闭表达式编辑器
const closeExpressionEditor = () => {
  showExpressionEditor.value = false
}

// 更新表达式
const updateExpression = (expression: string, alias?: string) => {
  customExpression.value = expression
  if (alias) {
    fieldAlias.value = alias
  }
  showExpressionEditor.value = false
}

// 编辑字段
const editField = (index: number) => {
  const fieldSelection = props.value[index]
  if (!fieldSelection) return
  
  editingFieldIndex.value = index
  isNewField.value = false
  isExpression.value = fieldSelection.isExpression || false
  
  if (isExpression.value) {
    if (fieldSelection.expressionDefinition) {
      expressionType.value = fieldSelection.expressionDefinition.type
      customExpression.value = fieldSelection.expressionDefinition.expression
    } else if (fieldSelection.expression) {
      expressionType.value = 'CUSTOM'
      customExpression.value = fieldSelection.expression
    }
  } else {
    // 无法更改表和字段，仅填充其他表单项
    selectedTableName.value = fieldSelection.field?.table || ''
    selectedFieldName.value = fieldSelection.field?.name || ''
  }
  
  fieldAlias.value = fieldSelection.alias || ''
  aggregateFunction.value = fieldSelection.aggregate || null
  isVisible.value = fieldSelection.isVisible
  
  showFieldModal.value = true
}

// 移除字段
const removeField = (index: number) => {
  const newFieldSelections = [...props.value]
  newFieldSelections.splice(index, 1)
  
  emit('update:value', newFieldSelections)
}

// 添加所有字段
const addAllFields = () => {
  // 获取所有已选择表的所有字段
  const allFields: FieldSelection[] = []
  
  // 现有字段的ID映射，用于避免重复添加
  const existingFieldIds = new Map(
    props.value
      .filter(field => !field.isExpression && field.field)
      .map(field => [`${field.field?.table}.${field.field?.name}`, true])
  )
  
  // 遍历所有选择的表
  for (const tableName of props.selectedTables) {
    const table = props.tables.find(t => t.name === tableName)
    if (!table) continue
    
    // 添加该表的所有字段
    for (const field of table.fields) {
      const fieldKey = `${tableName}.${field.name}`
      
      // 跳过已存在的字段
      if (existingFieldIds.has(fieldKey)) continue
      
      allFields.push({
        id: uuidv4(),
        field: { ...field, table: tableName },
        alias: '',
        aggregate: null,
        isVisible: true,
        isExpression: false
      })
    }
  }
  
  // 合并新字段和现有字段
  emit('update:value', [...props.value, ...allFields])
}

// 确认字段选择
const confirmField = () => {
  if (editingFieldIndex.value !== null) {
    // 编辑模式：更新现有字段属性
    const fieldSelection = { ...props.value[editingFieldIndex.value] }
    
    if (isExpression.value) {
      fieldSelection.isExpression = true
      fieldSelection.expressionDefinition = {
        type: expressionType.value,
        expression: customExpression.value,
        alias: fieldAlias.value
      }
      fieldSelection.expression = customExpression.value
    } else {
      fieldSelection.aggregate = aggregateFunction.value
    }
    
    fieldSelection.alias = fieldAlias.value || ''
    fieldSelection.isVisible = isVisible.value
    
    const newFieldSelections = [...props.value]
    newFieldSelections[editingFieldIndex.value] = fieldSelection
    
    emit('update:value', newFieldSelections)
  } else {
    // 添加模式
    if (isExpression.value) {
      // 添加表达式字段
      const fieldSelection: FieldSelection = {
        id: uuidv4(),
        alias: fieldAlias.value || '',
        isVisible: isVisible.value,
        isExpression: true,
        expression: customExpression.value,
        expressionDefinition: {
          type: expressionType.value,
          expression: customExpression.value,
          alias: fieldAlias.value
        }
      }
      
      emit('update:value', [...props.value, fieldSelection])
    } else {
      // 添加普通字段，需要选择表和字段
      if (!selectedField.value) return
      
      const fieldSelection: FieldSelection = {
        id: uuidv4(),
        field: { 
          ...selectedField.value,
          table: selectedTableName.value 
        },
        alias: fieldAlias.value || '',
        aggregate: aggregateFunction.value,
        isVisible: isVisible.value,
        isExpression: false
      }
      
      emit('update:value', [...props.value, fieldSelection])
    }
  }
  
  // 关闭弹窗
  closeFieldModal()
}

// 关闭字段弹窗
const closeFieldModal = () => {
  showFieldModal.value = false
  showExpressionEditor.value = false
  editingFieldIndex.value = null
  resetFieldForm()
}

// 重置字段表单
const resetFieldForm = () => {
  selectedTableName.value = ''
  selectedFieldName.value = ''
  fieldAlias.value = ''
  aggregateFunction.value = null
  isVisible.value = true
  customExpression.value = ''
  expressionType.value = 'CASE'
}
</script>