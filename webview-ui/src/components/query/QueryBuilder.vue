<template>
  <div class="space-y-4">
    <!-- 顶部控制区域 -->
    <div class="flex justify-between mb-2">
      <div>
        <h3 class="text-lg font-medium text-gray-900">构建查询</h3>
        <p class="text-sm text-gray-500">使用可视化界面创建SQL查询</p>
      </div>
      <div class="flex items-center space-x-3">
        <button
          @click="resetBuilder"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-redo-alt mr-2"></i> 重置
        </button>
        <button
          @click="generateSqlWithFeedback"
          :disabled="!canGenerateSql"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          :title="sqlButtonTooltip"
        >
          <i class="fas fa-code mr-2"></i> 生成SQL
        </button>
        <button
          @click="$emit('execute')"
          :class="[
            'inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
            canExecuteQuery ? 
            'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500' :
            'bg-indigo-300 opacity-60 cursor-not-allowed'
          ]"
          :title="!builderState.selectedTables.length ? '请选择至少一个表' : !builderState.generatedSql ? '请先生成SQL' : '执行查询'"
        >
          <i class="fas fa-play mr-2"></i> 执行
        </button>
      </div>
    </div>

    <!-- 操作反馈提示 -->
    <div v-if="feedbackMessage" class="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-sm text-yellow-700">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="fas fa-exclamation-triangle text-yellow-400 mr-2"></i>
        </div>
        <div>{{ feedbackMessage }}</div>
      </div>
    </div>

    <div v-if="!dataSourceId" class="py-6 text-center bg-white rounded-lg border border-gray-300">
      <div class="mx-auto w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-3">
        <i class="fas fa-database text-indigo-500"></i>
      </div>
      <h3 class="text-base font-medium text-gray-900">请选择数据源</h3>
      <p class="text-sm text-gray-500 mt-1">在左侧面板选择要查询的数据源</p>
    </div>

    <div v-else-if="!tablesLoaded" class="flex justify-center py-6">
      <div class="w-6 h-6 border-2 border-gray-300 border-t-indigo-600 rounded-full animate-spin mr-3"></div>
      <span>加载表信息...</span>
    </div>

    <div v-else class="space-y-4">
      <!-- 表选择器 -->
      <TableSelector
        :tables="tables"
        :selected-tables="builderState.selectedTables"
        :joins="builderState.joins"
        @update:selected-tables="updateSelectedTables"
        @update:joins="updateJoins"
      />

      <!-- 字段选择器 -->
      <FieldSelector
        :value="builderState.fieldSelections"
        :tables="tables"
        :selected-tables="builderState.selectedTables"
        @update:value="updateFieldSelections"
      />

      <!-- 条件构建器 -->
      <ConditionBuilder
        :value="builderState.whereConditions"
        :tables="tables"
        :selected-tables="builderState.selectedTables"
        @update:value="updateWhereConditions"
      />

      <!-- 分组和排序选项 -->
      <div class="bg-white p-4 border border-gray-300 rounded-lg">
        <div class="grid grid-cols-2 gap-6">
          <!-- 分组 -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">分组依据</h4>
            <div class="space-y-2">
              <!-- 分组字段选择 -->
              <div class="flex">
                <select
                  v-model="groupByField"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mr-2"
                >
                  <option value="">选择字段...</option>
                  <option
                    v-for="field in availableGroupByFields"
                    :key="`${field.table}.${field.name}`"
                    :value="`${field.table}.${field.name}`"
                  >
                    {{ getTableName(field.table) }}.{{ field.name }}
                  </option>
                </select>
                <button
                  @click="addGroupByField"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  :disabled="!groupByField"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>

              <!-- 已选分组字段 -->
              <div v-if="builderState.groupByFields.length > 0" class="mt-2">
                <div class="text-sm text-gray-500 mb-1">已选分组字段:</div>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="(field, index) in builderState.groupByFields"
                    :key="`${field.table}.${field.name}-${index}`"
                    class="flex items-center bg-gray-100 rounded px-2 py-1 text-sm"
                  >
                    <span>{{ getTableName(field.table) }}.{{ field.name }}</span>
                    <button
                      @click="removeGroupByField(index)"
                      class="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 排序 -->
          <div>
            <h4 class="text-sm font-medium text-gray-700 mb-2">排序规则</h4>
            <div class="space-y-2">
              <!-- 排序字段选择 -->
              <div class="flex items-center">
                <select
                  v-model="orderByField"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mr-2"
                >
                  <option value="">选择字段...</option>
                  <option
                    v-for="field in availableOrderByFields"
                    :key="`${field.table}.${field.name}`"
                    :value="`${field.table}.${field.name}`"
                  >
                    {{ getTableName(field.table) }}.{{ field.name }}
                  </option>
                </select>
                <select
                  v-model="orderByDirection"
                  class="block rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm mr-2"
                >
                  <option value="ASC">升序</option>
                  <option value="DESC">降序</option>
                </select>
                <button
                  @click="addOrderByField"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  :disabled="!orderByField"
                >
                  <i class="fas fa-plus"></i>
                </button>
              </div>

              <!-- 已选排序规则 -->
              <div v-if="builderState.sortDefinitions.length > 0" class="mt-2">
                <div class="text-sm text-gray-500 mb-1">已选排序规则:</div>
                <div class="flex flex-wrap gap-2">
                  <div
                    v-for="(sort, index) in builderState.sortDefinitions"
                    :key="`${sort.field.table}.${sort.field.name}-${index}`"
                    class="flex items-center bg-gray-100 rounded px-2 py-1 text-sm"
                  >
                    <span>{{ getTableName(sort.field.table) }}.{{ sort.field.name }}</span>
                    <span class="mx-1">{{ sort.direction === 'ASC' ? '↑' : '↓' }}</span>
                    <button
                      @click="removeOrderByField(index)"
                      class="ml-1 text-gray-500 hover:text-gray-700"
                    >
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页限制 -->
      <div class="bg-white p-4 border border-gray-300 rounded-lg">
        <h4 class="text-sm font-medium text-gray-700 mb-2">结果限制</h4>
        <div class="flex items-center">
          <label class="block text-sm text-gray-700 mr-2">限制结果数量:</label>
          <input
            v-model.number="limit"
            type="number"
            min="1"
            class="block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="无限制"
          />
        </div>
      </div>

      <!-- 预览生成的SQL -->
      <div v-if="builderState.generatedSql" class="bg-gray-800 p-4 rounded-lg">
        <div class="flex justify-between items-center mb-2">
          <h4 class="text-sm font-medium text-white">生成的SQL</h4>
          <button
            @click="copySqlToClipboard"
            class="text-xs text-gray-400 hover:text-white"
          >
            <i class="fas fa-copy mr-1"></i> 复制
          </button>
        </div>
        <pre class="text-sm text-gray-300 overflow-x-auto whitespace-pre-wrap">{{ formatSql(builderState.generatedSql) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import TableSelector from './builder/TableSelector.vue'
import FieldSelector from './builder/FieldSelector.vue'
import ConditionBuilder from './builder/ConditionBuilder.vue'
import type {
  TableDefinition,
  TableField,
  JoinDefinition,
  FieldSelection,
  ConditionGroup,
  SortDefinition,
  SortDirection,
  QueryBuilderState,
  LogicalOperator,
  QueryCondition,
  OperatorType,
  ExpressionType,
  ExpressionDefinition,
  AggregateFunction
} from '@/types/builder'

// 属性定义
const props = defineProps<{
  modelValue: string // 生成的SQL
  dataSourceId: string // 数据源ID
}>()

// 事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'execute'): void
  (e: 'save'): void
  (e: 'update:state', state: QueryBuilderState): void
}>()

// 状态
const tables = ref<TableDefinition[]>([])
const tablesLoaded = ref(false)
const groupByField = ref('')
const orderByField = ref('')
const orderByDirection = ref<SortDirection>('ASC')
const limit = ref<number | null>(100) // 默认限制100条
const feedbackMessage = ref<string | null>(null) // 反馈信息

// 查询构建器状态
const builderState = reactive<QueryBuilderState>({
  selectedDataSourceId: props.dataSourceId,
  tables: [],
  selectedTables: [],
  joins: [],
  fieldSelections: [],
  whereConditions: {
    id: uuidv4(),
    conditions: [],
    groups: [],
    logicalOperator: 'AND'
  },
  groupByFields: [],
  sortDefinitions: [],
  generatedSql: ''
})

// 计算属性
// 判断是否可以生成SQL
const canGenerateSql = computed(() => {
  return builderState.selectedTables.length > 0 && builderState.fieldSelections.length > 0
})

// SQL按钮提示信息
const sqlButtonTooltip = computed(() => {
  if (!builderState.selectedTables.length) {
    return '请先选择至少一个表'
  }
  if (!builderState.fieldSelections.length) {
    return '请选择至少一个字段'
  }
  return '生成SQL查询语句'
})

// 可供分组的字段
const availableGroupByFields = computed(() => {
  const fields: TableField[] = []
  
  // 遍历所有已选择的表
  for (const tableName of builderState.selectedTables) {
    const table = tables.value.find(t => t.name === tableName)
    if (table) {
      // 添加该表的所有字段
      for (const field of table.fields) {
        fields.push({ ...field, table: tableName })
      }
    }
  }
  
  return fields
})

// 可供排序的字段
const availableOrderByFields = computed(() => {
  // 默认可以对所有字段排序，与分组相同
  return availableGroupByFields.value
})

// 是否可以执行查询
const canExecuteQuery = computed(() => {
  return (
    props.dataSourceId &&
    builderState.selectedTables.length > 0 &&
    builderState.fieldSelections.length > 0 &&
    builderState.generatedSql
  )
})

// 方法
// 获取表的显示名称
const getTableName = (tableName: string): string => {
  const table = tables.value.find(t => t.name === tableName)
  return table?.displayName || tableName
}

// 加载查询构建器状态
const loadState = (state: QueryBuilderState) => {
  // 只有当数据源ID匹配时才加载
  if (state.selectedDataSourceId === props.dataSourceId) {
    // 复制状态到当前状态对象
    Object.assign(builderState, state)
    
    // 如果已经加载了表，立即更新状态
    if (tablesLoaded.value) {
      // 更新生成的SQL
      generateSql()
    } else {
      // 在表加载完成后更新状态
      watch(tablesLoaded, (loaded) => {
        if (loaded) {
          generateSql()
        }
      }, { once: true })
    }
  }
}

// 更新选择的表
const updateSelectedTables = (selectedTables: string[]) => {
  builderState.selectedTables = selectedTables
}

// 更新JOIN关系
const updateJoins = (joins: JoinDefinition[]) => {
  builderState.joins = joins
}

// 更新字段选择
const updateFieldSelections = (fieldSelections: FieldSelection[]) => {
  builderState.fieldSelections = fieldSelections
}

// 更新WHERE条件
const updateWhereConditions = (whereConditions: ConditionGroup) => {
  builderState.whereConditions = whereConditions
}

// 添加分组字段
const addGroupByField = () => {
  if (!groupByField.value) return
  
  const [tableName, fieldName] = groupByField.value.split('.')
  
  // 检查字段是否存在
  const tableObj = tables.value.find(t => t.name === tableName)
  if (!tableObj) return
  
  const fieldObj = tableObj.fields.find(f => f.name === fieldName)
  if (!fieldObj) return
  
  // 添加到分组字段列表
  builderState.groupByFields.push({ ...fieldObj, table: tableName })
  
  // 清空选择
  groupByField.value = ''
}

// 移除分组字段
const removeGroupByField = (index: number) => {
  builderState.groupByFields.splice(index, 1)
}

// 添加排序字段
const addOrderByField = () => {
  if (!orderByField.value) return
  
  const [tableName, fieldName] = orderByField.value.split('.')
  
  // 检查字段是否存在
  const tableObj = tables.value.find(t => t.name === tableName)
  if (!tableObj) return
  
  const fieldObj = tableObj.fields.find(f => f.name === fieldName)
  if (!fieldObj) return
  
  // 添加到排序字段列表
  builderState.sortDefinitions.push({
    id: uuidv4(),
    field: { ...fieldObj, table: tableName },
    direction: orderByDirection.value
  })
  
  // 清空选择
  orderByField.value = ''
}

// 移除排序字段
const removeOrderByField = (index: number) => {
  builderState.sortDefinitions.splice(index, 1)
}

// 重置构建器
const resetBuilder = () => {
  if (confirm('确定要重置查询构建器吗？所有已配置的条件将会丢失。')) {
    // 重置所有状态
    builderState.selectedTables = []
    builderState.joins = []
    builderState.fieldSelections = []
    builderState.whereConditions = {
      id: uuidv4(),
      conditions: [],
      groups: [],
      logicalOperator: 'AND'
    }
    builderState.groupByFields = []
    builderState.sortDefinitions = []
    builderState.generatedSql = ''
    limit.value = 100
    
    // 更新输出
    emit('update:modelValue', '')
  }
}

// 生成字段部分SQL
const generateFieldsSQL = () => {
  if (builderState.fieldSelections.length === 0) {
    return '*'
  }
  
  return builderState.fieldSelections
    .filter(fs => fs.isVisible)
    .map(fs => {
      // 处理表达式字段
      if (fs.isExpression) {
        // 如果有表达式定义，直接使用表达式
        const expression = fs.expressionDefinition?.expression || fs.expression || ''
        
        // 应用别名
        if (fs.alias) {
          return `${expression} AS ${fs.alias}`
        }
        
        return expression
      }
      
      // 处理普通字段
      const tableName = fs.field?.table || ''
      const fieldName = fs.field?.name || ''
      
      if (!tableName || !fieldName) {
        return ''
      }
      
      // 构建字段引用
      let fieldRef = `${tableName}.${fieldName}`
      
      // 应用聚合函数
      if (fs.aggregate) {
        if (fs.aggregate === 'COUNT_DISTINCT') {
          fieldRef = `COUNT(DISTINCT ${fieldRef})`
        } else {
          fieldRef = `${fs.aggregate}(${fieldRef})`
        }
      }
      
      // 应用别名
      if (fs.alias) {
        fieldRef = `${fieldRef} AS ${fs.alias}`
      }
      
      return fieldRef
    })
    .filter(Boolean) // 过滤掉空字段
    .join(', ')
}

// 生成表和JOIN部分SQL
const generateTablesSQL = () => {
  if (builderState.selectedTables.length === 0) {
    return ''
  }
  
  // 主表
  let sql = builderState.selectedTables[0]
  
  // JOIN语句
  if (builderState.joins.length > 0) {
    for (let i = 0; i < builderState.joins.length; i++) {
      const join = builderState.joins[i]
      const joinType = join.type === 'NONE' ? '' : `${join.type} JOIN`
      
      sql += ` ${joinType} ${join.targetTable} ON ${join.sourceTable}.${join.sourceField} = ${join.targetTable}.${join.targetField}`
    }
  }
  
  return sql
}

// 生成单个条件的SQL
const generateConditionSQL = (condition: QueryCondition): string => {
  const { field, operator, value } = condition
  
  // 处理IS NULL和IS NOT NULL
  if (operator === 'IS NULL' || operator === 'IS NOT NULL') {
    return `${field.table}.${field.name} ${operator}`
  }
  
  // 处理BETWEEN
  if (operator === 'BETWEEN' && Array.isArray(value)) {
    return `${field.table}.${field.name} BETWEEN ${formatValue(value[0])} AND ${formatValue(value[1])}`
  }
  
  // 处理IN和NOT IN
  if ((operator === 'IN' || operator === 'NOT IN') && Array.isArray(value)) {
    const values = value.map(v => formatValue(v)).join(', ')
    return `${field.table}.${field.name} ${operator} (${values})`
  }
  
  // 处理LIKE和NOT LIKE
  if (operator === 'LIKE' || operator === 'NOT LIKE') {
    return `${field.table}.${field.name} ${operator} ${formatValue(`%${value}%`)}`
  }
  
  // 处理普通操作符
  return `${field.table}.${field.name} ${operator} ${formatValue(value)}`
}

// 格式化条件值
const formatValue = (value: any): string => {
  if (value === null || value === undefined) {
    return 'NULL'
  }
  
  if (typeof value === 'string') {
    return `'${value.replace(/'/g, "''")}'`
  }
  
  return String(value)
}

// 递归生成条件组SQL
const generateConditionGroupSQL = (group: ConditionGroup): string => {
  const conditions: string[] = []
  
  // 生成当前组的所有条件
  if (group.conditions.length > 0) {
    const conditionSQLs = group.conditions.map(generateConditionSQL)
    conditions.push(...conditionSQLs)
  }
  
  // 生成子组的所有条件
  if (group.groups && group.groups.length > 0) {
    for (const subGroup of group.groups) {
      const subGroupSQL = generateConditionGroupSQL(subGroup)
      if (subGroupSQL) {
        conditions.push(`(${subGroupSQL})`) // 子组需要括号
      }
    }
  }
  
  // 检查是否有条件
  if (conditions.length === 0) {
    return ''
  }
  
  // 组合条件使用适当的逻辑操作符
  const sql = conditions.join(` ${group.logicalOperator} `)
  
  // 如果只有一个条件/组，无需添加括号
  if (conditions.length === 1 && !sql.startsWith('(')) {
    return sql
  }
  
  return sql
}

// 生成WHERE部分SQL
const generateWhereSQL = () => {
  // 检查条件组是否为空
  const hasConditions = builderState.whereConditions.conditions.length > 0 ||
                      (builderState.whereConditions.groups && builderState.whereConditions.groups.length > 0)
  
  if (!hasConditions) {
    return ''
  }
  
  const conditionSQL = generateConditionGroupSQL(builderState.whereConditions)
  if (!conditionSQL) {
    return ''
  }
  
  return `WHERE ${conditionSQL}`
}

// 生成GROUP BY部分SQL
const generateGroupBySQL = () => {
  if (builderState.groupByFields.length === 0) {
    return ''
  }
  
  const fields = builderState.groupByFields
    .map(field => `${field.table}.${field.name}`)
    .join(', ')
  
  return `GROUP BY ${fields}`
}

// 生成ORDER BY部分SQL
const generateOrderBySQL = () => {
  if (builderState.sortDefinitions.length === 0) {
    return ''
  }
  
  const orders = builderState.sortDefinitions
    .map(sort => `${sort.field.table}.${sort.field.name} ${sort.direction}`)
    .join(', ')
  
  return `ORDER BY ${orders}`
}

// 生成LIMIT部分SQL
const generateLimitSQL = () => {
  if (!limit.value || limit.value <= 0) {
    return ''
  }
  
  return `LIMIT ${limit.value}`
}

// 生成完整SQL
const generateSql = () => {
  // 检查是否有选择表
  if (builderState.selectedTables.length === 0) {
    return
  }
  
  // 组装SQL各部分
  const selectClause = `SELECT ${generateFieldsSQL()}`
  const fromClause = `FROM ${generateTablesSQL()}`
  const whereClause = generateWhereSQL()
  const groupByClause = generateGroupBySQL()
  const orderByClause = generateOrderBySQL()
  const limitClause = generateLimitSQL()
  
  // 组合完整SQL
  const sqlParts = [
    selectClause,
    fromClause,
    whereClause,
    groupByClause,
    orderByClause,
    limitClause
  ].filter(Boolean) // 过滤掉空字符串
  
  const sql = sqlParts.join(' ')
  
  // 更新生成的SQL
  builderState.generatedSql = sql
  
  // 通知父组件
  emit('update:modelValue', sql)
  
  // 发送状态更新
  emit('update:state', builderState)
}

// 格式化SQL（简单实现，实际应用中可能需要更复杂的格式化）
const formatSql = (sql: string): string => {
  return sql
    .replace(/SELECT/i, 'SELECT\n  ')
    .replace(/FROM/i, '\nFROM\n  ')
    .replace(/WHERE/i, '\nWHERE\n  ')
    .replace(/GROUP BY/i, '\nGROUP BY\n  ')
    .replace(/ORDER BY/i, '\nORDER BY\n  ')
    .replace(/LIMIT/i, '\nLIMIT ')
    .replace(/ AND /g, '\n  AND ')
    .replace(/ OR /g, '\n  OR ')
    .replace(/INNER JOIN/g, '\n  INNER JOIN')
    .replace(/LEFT JOIN/g, '\n  LEFT JOIN')
    .replace(/RIGHT JOIN/g, '\n  RIGHT JOIN')
    .replace(/FULL JOIN/g, '\n  FULL JOIN')
}

// 复制SQL到剪贴板
const copySqlToClipboard = () => {
  if (!builderState.generatedSql) return
  
  navigator.clipboard.writeText(builderState.generatedSql)
    .then(() => {
      alert('SQL已复制到剪贴板')
    })
    .catch(err => {
      console.error('复制失败:', err)
      alert('复制失败，请手动复制')
    })
}

// 模拟从后端加载表信息
// 在实际应用中，这里应该调用API获取元数据
const loadTables = async () => {
  try {
    tablesLoaded.value = false
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // 这里应该是从API获取的数据
    // 为演示目的，使用模拟数据
    tables.value = [
      {
        name: 'customers',
        displayName: '客户',
        fields: [
          { name: 'id', type: 'INTEGER', table: 'customers', isPrimaryKey: true, displayName: '客户ID' },
          { name: 'name', type: 'STRING', table: 'customers', displayName: '客户名称' },
          { name: 'email', type: 'STRING', table: 'customers', displayName: '电子邮件' },
          { name: 'phone', type: 'STRING', table: 'customers', displayName: '电话' },
          { name: 'address', type: 'STRING', table: 'customers', displayName: '地址' },
          { name: 'created_at', type: 'DATETIME', table: 'customers', displayName: '创建时间' }
        ]
      },
      {
        name: 'orders',
        displayName: '订单',
        fields: [
          { name: 'id', type: 'INTEGER', table: 'orders', isPrimaryKey: true, displayName: '订单ID' },
          { name: 'customer_id', type: 'INTEGER', table: 'orders', isForeignKey: true, displayName: '客户ID' },
          { name: 'order_date', type: 'DATE', table: 'orders', displayName: '订单日期' },
          { name: 'status', type: 'STRING', table: 'orders', displayName: '状态' },
          { name: 'total_amount', type: 'DECIMAL', table: 'orders', displayName: '总金额' }
        ]
      },
      {
        name: 'products',
        displayName: '产品',
        fields: [
          { name: 'id', type: 'INTEGER', table: 'products', isPrimaryKey: true, displayName: '产品ID' },
          { name: 'name', type: 'STRING', table: 'products', displayName: '产品名称' },
          { name: 'description', type: 'STRING', table: 'products', displayName: '描述' },
          { name: 'price', type: 'DECIMAL', table: 'products', displayName: '价格' },
          { name: 'stock', type: 'INTEGER', table: 'products', displayName: '库存' },
          { name: 'category', type: 'STRING', table: 'products', displayName: '分类' }
        ]
      },
      {
        name: 'order_items',
        displayName: '订单项',
        fields: [
          { name: 'id', type: 'INTEGER', table: 'order_items', isPrimaryKey: true, displayName: '项目ID' },
          { name: 'order_id', type: 'INTEGER', table: 'order_items', isForeignKey: true, displayName: '订单ID' },
          { name: 'product_id', type: 'INTEGER', table: 'order_items', isForeignKey: true, displayName: '产品ID' },
          { name: 'quantity', type: 'INTEGER', table: 'order_items', displayName: '数量' },
          { name: 'unit_price', type: 'DECIMAL', table: 'order_items', displayName: '单价' }
        ]
      }
    ]
    
    // 更新状态
    builderState.tables = tables.value
    tablesLoaded.value = true
  } catch (error) {
    console.error('加载表信息失败:', error)
    tablesLoaded.value = true // 即使失败也设置为已加载，以便显示错误状态
  }
}

// 生命周期钩子
onMounted(() => {
  if (props.dataSourceId) {
    loadTables()
  }
})

// 监听数据源变化
watch(() => props.dataSourceId, (newValue) => {
  if (newValue) {
    builderState.selectedDataSourceId = newValue
    loadTables()
  } else {
    tables.value = []
    tablesLoaded.value = false
  }
})

// 向父组件暴露方法
defineExpose({
  loadState
})

// 带用户反馈的SQL生成
const generateSqlWithFeedback = () => {
  // 清除之前的反馈信息
  feedbackMessage.value = null
  
  // 检查是否选择了表
  if (builderState.selectedTables.length === 0) {
    feedbackMessage.value = '请先选择至少一个表'
    return
  }
  
  // 检查是否选择了字段
  if (builderState.fieldSelections.length === 0) {
    feedbackMessage.value = '请选择至少一个要显示的字段'
    return
  }
  
  // 生成SQL
  generateSql()
  
  // 生成成功提示
  if (builderState.generatedSql) {
    feedbackMessage.value = 'SQL生成成功！'
    // 3秒后自动清除提示
    setTimeout(() => {
      if (feedbackMessage.value === 'SQL生成成功！') {
        feedbackMessage.value = null
      }
    }, 3000)
  }
}
</script>