<template>
  <div class="bg-white p-4 border border-gray-300 rounded-lg mb-4">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-medium text-gray-900">选择表</h3>
      <button 
        v-if="selectedTables.length > 0"
        @click="addTable" 
        class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <i class="fas fa-plus mr-2"></i> 添加表
      </button>
    </div>
    
    <!-- 空状态 -->
    <div v-if="selectedTables.length === 0" class="py-6 text-center">
      <div class="mx-auto w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
        <i class="fas fa-table text-indigo-500"></i>
      </div>
      <h3 class="text-base font-medium text-gray-900">添加第一个表</h3>
      <p class="text-sm text-gray-500 mt-1 mb-4">选择一个表开始构建查询</p>
      <button 
        @click="addTable" 
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <i class="fas fa-plus mr-2"></i> 添加表
      </button>
    </div>
    
    <!-- 已选择的表 -->
    <div v-else class="space-y-4">
      <div v-for="(tableName, index) in selectedTables" :key="tableName" class="p-4 border border-gray-200 rounded-lg bg-gray-50">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center">
            <i class="fas fa-table text-gray-500 mr-2"></i>
            <span class="font-medium">{{ getTableDisplayName(tableName) }}</span>
            
            <!-- 显示JOIN类型 (非第一个表) -->
            <div v-if="index > 0 && joins[index-1]" class="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-md">
              {{ getJoinTypeDisplay(joins[index-1].type) }}
            </div>
          </div>
          
          <div class="flex space-x-1">
            <button 
              @click="editJoin(index)"
              v-if="index > 0"
              class="p-1 text-gray-400 hover:text-indigo-600"
              title="编辑关联"
            >
              <i class="fas fa-link"></i>
            </button>
            <button 
              @click="removeTable(index)"
              class="p-1 text-gray-400 hover:text-red-600"
              title="移除表"
            >
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        <!-- JOIN条件展示 -->
        <div v-if="index > 0 && joins[index-1]" class="mt-2 text-sm text-gray-500 bg-white p-2 rounded border border-gray-200">
          <span>{{ getTableDisplayName(joins[index-1].sourceTable) }}.{{ joins[index-1].sourceField }}</span>
          <span class="mx-2">=</span>
          <span>{{ getTableDisplayName(joins[index-1].targetTable) }}.{{ joins[index-1].targetField }}</span>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 添加/编辑表弹窗 -->
  <div v-if="showTableModal" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg shadow-xl max-w-lg w-full mx-4">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ editingJoinIndex === null ? '添加表' : '编辑表关联' }}
        </h3>
      </div>
      
      <div class="p-6">
        <!-- 表选择 -->
        <div class="mb-4" v-if="editingJoinIndex === null">
          <label class="block text-sm font-medium text-gray-700 mb-1">选择表</label>
          <select 
            v-model="selectedTable" 
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">请选择一个表...</option>
            <option v-for="table in availableTables" :key="table.name" :value="table.name">
              {{ table.displayName || table.name }}
            </option>
          </select>
        </div>
        
        <!-- JOIN类型选择 (非第一个表) -->
        <div class="mb-4" v-if="(editingJoinIndex !== null || selectedTables.length > 0) && editingJoinIndex !== 0">
          <label class="block text-sm font-medium text-gray-700 mb-1">连接类型</label>
          <select 
            v-model="joinType" 
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="INNER">INNER JOIN</option>
            <option value="LEFT">LEFT JOIN</option>
            <option value="RIGHT">RIGHT JOIN</option>
            <option value="FULL">FULL JOIN</option>
          </select>
        </div>
        
        <!-- JOIN条件 (非第一个表) -->
        <div v-if="(editingJoinIndex !== null || selectedTables.length > 0) && editingJoinIndex !== 0">
          <label class="block text-sm font-medium text-gray-700 mb-1">连接条件</label>
          
          <div class="grid grid-cols-5 gap-2 items-center">
            <!-- 左侧表选择 -->
            <div class="col-span-2">
              <select 
                v-model="joinSourceTable" 
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                @change="updateSourceFields"
              >
                <option v-for="table in selectedTables.slice(0, editingJoinIndex !== null ? editingJoinIndex + 1 : undefined)" 
                        :key="table" 
                        :value="table">
                  {{ getTableDisplayName(table) }}
                </option>
              </select>
            </div>
            
            <!-- 操作符 -->
            <div class="col-span-1 text-center">
              <span class="text-gray-500">=</span>
            </div>
            
            <!-- 右侧表和字段 -->
            <div class="col-span-2">
              <select 
                v-model="joinTargetField" 
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">选择字段...</option>
                <option 
                  v-for="field in editingJoinIndex !== null ? getFieldsForTable(selectedTable || selectedTables[editingJoinIndex]) : getFieldsForTable(selectedTable)"
                  :key="field.name" 
                  :value="field.name"
                >
                  {{ field.displayName || field.name }}
                </option>
              </select>
            </div>
            
            <!-- 左侧字段 -->
            <div class="col-span-2">
              <select 
                v-model="joinSourceField" 
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">选择字段...</option>
                <option 
                  v-for="field in sourceFields" 
                  :key="field.name" 
                  :value="field.name"
                >
                  {{ field.displayName || field.name }}
                </option>
              </select>
            </div>
            
            <!-- 说明文字 -->
            <div class="col-span-1 text-center">
              <span class="text-gray-400">到</span>
            </div>
            
            <!-- 目标表 -->
            <div class="col-span-2">
              <select 
                v-model="joinTargetTable" 
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                disabled
              >
                <option :value="editingJoinIndex !== null ? selectedTables[editingJoinIndex] : selectedTable">
                  {{ getTableDisplayName(editingJoinIndex !== null ? selectedTables[editingJoinIndex] : selectedTable) }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
        <button 
          @click="closeModal" 
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          取消
        </button>
        <button 
          @click="confirmTableSelection" 
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="!canConfirm"
        >
          确认
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { TableDefinition, JoinDefinition, JoinType, TableField } from '@/types/builder'
import { v4 as uuidv4 } from 'uuid'

// 属性定义
const props = defineProps<{
  tables: TableDefinition[]
  selectedTables: string[]
  joins: JoinDefinition[]
}>()

// 事件
const emit = defineEmits<{
  (e: 'update:selectedTables', tables: string[]): void
  (e: 'update:joins', joins: JoinDefinition[]): void
}>()

// 状态
const showTableModal = ref(false)
const selectedTable = ref('')
const joinType = ref<JoinType>('INNER')
const joinSourceTable = ref('')
const joinSourceField = ref('')
const joinTargetTable = ref('')
const joinTargetField = ref('')
const editingJoinIndex = ref<number | null>(null)
const sourceFields = ref<TableField[]>([])

// 计算属性：可用的表（尚未选择的表）
const availableTables = computed(() => {
  return props.tables.filter(table => !props.selectedTables.includes(table.name))
})

// 计算属性：是否可以确认
const canConfirm = computed(() => {
  // 第一个表只需要选择表
  if (props.selectedTables.length === 0 && selectedTable.value) {
    return true
  }
  
  // 其他表需要完整的JOIN条件
  return selectedTable.value && 
         joinType.value && 
         joinSourceTable.value && 
         joinSourceField.value && 
         joinTargetTable.value && 
         joinTargetField.value
})

// 根据表名获取表显示名称
const getTableDisplayName = (tableName: string): string => {
  const table = props.tables.find(t => t.name === tableName)
  return table?.displayName || tableName
}

// 获取JOIN类型的显示文本
const getJoinTypeDisplay = (type: JoinType): string => {
  const joinTypesMap: Record<JoinType, string> = {
    'INNER': 'INNER JOIN',
    'LEFT': 'LEFT JOIN',
    'RIGHT': 'RIGHT JOIN',
    'FULL': 'FULL JOIN',
    'NONE': '无关联'
  }
  return joinTypesMap[type] || type
}

// 获取表的字段列表
const getFieldsForTable = (tableName: string): TableField[] => {
  const table = props.tables.find(t => t.name === tableName)
  return table?.fields || []
}

// 更新源表字段列表
const updateSourceFields = () => {
  if (joinSourceTable.value) {
    sourceFields.value = getFieldsForTable(joinSourceTable.value)
  } else {
    sourceFields.value = []
  }
}

// 打开添加表弹窗
const addTable = () => {
  editingJoinIndex.value = null
  selectedTable.value = ''
  
  if (props.selectedTables.length > 0) {
    joinType.value = 'INNER'
    joinSourceTable.value = props.selectedTables[0] // 默认选择第一个表作为JOIN源
    joinSourceField.value = ''
    joinTargetTable.value = ''
    joinTargetField.value = ''
    updateSourceFields()
  }
  
  showTableModal.value = true
}

// 编辑JOIN关系
const editJoin = (index: number) => {
  if (index <= 0 || index >= props.selectedTables.length) {
    return
  }
  
  editingJoinIndex.value = index
  
  // 填充当前JOIN信息
  const join = props.joins[index - 1]
  if (join) {
    joinType.value = join.type
    joinSourceTable.value = join.sourceTable
    joinSourceField.value = join.sourceField
    joinTargetTable.value = join.targetTable
    joinTargetField.value = join.targetField
    updateSourceFields()
  }
  
  showTableModal.value = true
}

// 移除表
const removeTable = (index: number) => {
  // 获取当前选中的表列表和JOIN列表的副本
  const newSelectedTables = [...props.selectedTables]
  const newJoins = [...props.joins]
  
  // 移除表
  newSelectedTables.splice(index, 1)
  
  // 如果非第一个表，还需要处理相关的JOIN
  if (index > 0) {
    // 移除此表的JOIN
    newJoins.splice(index - 1, 1)
  } else if (newSelectedTables.length > 0) {
    // 如果删除的是第一个表，且还有剩余表，需要移除第一个JOIN
    newJoins.splice(0, 1)
  }
  
  // 更新父组件
  emit('update:selectedTables', newSelectedTables)
  emit('update:joins', newJoins)
}

// 确认表选择
const confirmTableSelection = () => {
  if (editingJoinIndex.value !== null) {
    // 编辑现有JOIN
    const newJoins = [...props.joins]
    newJoins[editingJoinIndex.value - 1] = {
      id: newJoins[editingJoinIndex.value - 1].id,
      type: joinType.value,
      sourceTable: joinSourceTable.value,
      sourceField: joinSourceField.value,
      targetTable: joinTargetTable.value,
      targetField: joinTargetField.value
    }
    
    emit('update:joins', newJoins)
  } else {
    // 添加新表
    const newSelectedTables = [...props.selectedTables, selectedTable.value]
    
    // 如果不是第一个表，需要添加JOIN信息
    if (props.selectedTables.length > 0) {
      const newJoins = [...props.joins, {
        id: uuidv4(),
        type: joinType.value,
        sourceTable: joinSourceTable.value,
        sourceField: joinSourceField.value,
        targetTable: selectedTable.value,
        targetField: joinTargetField.value
      }]
      
      emit('update:joins', newJoins)
    }
    
    emit('update:selectedTables', newSelectedTables)
  }
  
  // 关闭弹窗
  closeModal()
}

// 关闭弹窗
const closeModal = () => {
  showTableModal.value = false
  editingJoinIndex.value = null
}

// 监听表选择变化，更新目标表
watch(selectedTable, (newValue) => {
  if (newValue) {
    joinTargetTable.value = newValue
  }
})
</script>