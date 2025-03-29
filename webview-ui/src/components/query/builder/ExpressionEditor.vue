<template>
  <div class="bg-white p-4 rounded-lg border border-gray-300">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-medium text-gray-900">表达式编辑器</h3>
      <div class="flex space-x-2">
        <button 
          @click="$emit('cancel')"
          class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          取消
        </button>
        <button 
          @click="confirmExpression"
          class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="!canConfirm"
        >
          确认
        </button>
      </div>
    </div>

    <!-- 表达式类型选择 -->
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

    <!-- CASE WHEN 编辑器 -->
    <div v-if="expressionType === 'CASE'" class="space-y-4">
      <div>
        <h4 class="text-sm font-medium text-gray-700 mb-2">CASE WHEN 条件</h4>
        <div class="space-y-3">
          <!-- 无条件时的提示 -->
          <div v-if="caseConditions.length === 0" class="py-3 text-center bg-gray-50 rounded-lg">
            <p class="text-sm text-gray-500">点击下方按钮添加条件</p>
          </div>

          <!-- 条件列表 -->
          <div 
            v-for="(item, index) in caseConditions" 
            :key="index"
            class="flex items-start border border-gray-200 p-3 rounded-lg bg-gray-50"
          >
            <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">当</label>
                <div class="flex items-center">
                  <select
                    v-model="item.field"
                    class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">选择字段...</option>
                    <option 
                      v-for="field in availableFields" 
                      :key="`${field.table}.${field.name}`"
                      :value="`${field.table}.${field.name}`"
                    >
                      {{ getTableName(field.table) }}.{{ field.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-xs font-medium text-gray-500 mb-1">操作符</label>
                <select
                  v-model="item.operator"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="=">等于 (=)</option>
                  <option value="!=">不等于 (!=)</option>
                  <option value=">">大于 (>)</option>
                  <option value=">=">大于等于 (>=)</option>
                  <option value="<">小于 (<)</option>
                  <option value="<=">小于等于 (<=)</option>
                  <option value="LIKE">包含 (LIKE)</option>
                  <option value="IS NULL">为空 (IS NULL)</option>
                  <option value="IS NOT NULL">不为空 (IS NOT NULL)</option>
                </select>
              </div>

              <div v-if="!['IS NULL', 'IS NOT NULL'].includes(item.operator)">
                <label class="block text-xs font-medium text-gray-500 mb-1">值</label>
                <input
                  v-model="item.value"
                  type="text"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="输入值..."
                />
              </div>
            </div>

            <div class="ml-3">
              <label class="block text-xs font-medium text-gray-500 mb-1">返回值</label>
              <div class="flex space-x-2">
                <input
                  v-model="item.then"
                  type="text"
                  class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="返回值..."
                />
                <button
                  @click="removeCaseCondition(index)"
                  class="p-1 text-gray-400 hover:text-red-600"
                  title="移除条件"
                >
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- 添加条件按钮 -->
          <button
            @click="addCaseCondition"
            class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full justify-center"
          >
            <i class="fas fa-plus mr-2"></i> 添加条件
          </button>
        </div>
      </div>

      <!-- ELSE 值 -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">ELSE 默认值</label>
        <input
          v-model="elseValue"
          type="text"
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="如果没有匹配条件则返回此值..."
        />
      </div>
    </div>

    <!-- 函数编辑器 -->
    <div v-else-if="expressionType === 'FUNCTION'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">选择函数</label>
        <select
          v-model="selectedFunction"
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">选择函数...</option>
          <optgroup label="聚合函数">
            <option value="COUNT">COUNT - 计数</option>
            <option value="SUM">SUM - 求和</option>
            <option value="AVG">AVG - 平均值</option>
            <option value="MIN">MIN - 最小值</option>
            <option value="MAX">MAX - 最大值</option>
          </optgroup>
          <optgroup label="字符串函数">
            <option value="CONCAT">CONCAT - 连接字符串</option>
            <option value="SUBSTRING">SUBSTRING - 截取子串</option>
            <option value="UPPER">UPPER - 转大写</option>
            <option value="LOWER">LOWER - 转小写</option>
            <option value="LENGTH">LENGTH - 字符串长度</option>
            <option value="TRIM">TRIM - 去除空格</option>
          </optgroup>
          <optgroup label="日期函数">
            <option value="DATE">DATE - 提取日期</option>
            <option value="YEAR">YEAR - 提取年份</option>
            <option value="MONTH">MONTH - 提取月份</option>
            <option value="DAY">DAY - 提取日</option>
            <option value="DATEDIFF">DATEDIFF - 日期差</option>
          </optgroup>
          <optgroup label="数值函数">
            <option value="ROUND">ROUND - 四舍五入</option>
            <option value="FLOOR">FLOOR - 向下取整</option>
            <option value="CEILING">CEILING - 向上取整</option>
            <option value="ABS">ABS - 绝对值</option>
          </optgroup>
          <optgroup label="条件函数">
            <option value="COALESCE">COALESCE - 返回第一个非空值</option>
            <option value="NULLIF">NULLIF - 相等时返回NULL</option>
            <option value="IFNULL">IFNULL - 如果为NULL则返回默认值</option>
          </optgroup>
        </select>
      </div>

      <!-- 函数参数 -->
      <div v-if="selectedFunction" class="space-y-3">
        <h4 class="text-sm font-medium text-gray-700">函数参数</h4>
        
        <!-- 聚合/单参数函数 -->
        <div v-if="['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'UPPER', 'LOWER', 'LENGTH', 'TRIM', 'DATE', 'YEAR', 'MONTH', 'DAY', 'ROUND', 'FLOOR', 'CEILING', 'ABS'].includes(selectedFunction)">
          <label class="block text-xs font-medium text-gray-500 mb-1">参数</label>
          <select
            v-model="functionParams.param1"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">选择字段...</option>
            <option 
              v-for="field in availableFields" 
              :key="`${field.table}.${field.name}`"
              :value="`${field.table}.${field.name}`"
            >
              {{ getTableName(field.table) }}.{{ field.name }}
            </option>
          </select>
          
          <!-- ROUND 额外参数 -->
          <div v-if="selectedFunction === 'ROUND'" class="mt-2">
            <label class="block text-xs font-medium text-gray-500 mb-1">小数位数</label>
            <input
              v-model="functionParams.param2"
              type="number"
              min="0"
              class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="小数位数..."
            />
          </div>
        </div>
        
        <!-- 多参数函数 -->
        <div v-else-if="['CONCAT', 'SUBSTRING', 'DATEDIFF', 'COALESCE', 'NULLIF', 'IFNULL'].includes(selectedFunction)" class="space-y-3">
          <!-- CONCAT -->
          <div v-if="selectedFunction === 'CONCAT'" class="space-y-2">
            <div v-for="(param, idx) in functionParamList" :key="idx" class="flex space-x-2">
              <select
                v-model="param.value"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">选择字段...</option>
                <option 
                  v-for="field in availableFields" 
                  :key="`${field.table}.${field.name}`"
                  :value="`${field.table}.${field.name}`"
                >
                  {{ getTableName(field.table) }}.{{ field.name }}
                </option>
              </select>
              
              <button
                v-if="functionParamList.length > 2"
                @click="removeParam(idx)"
                class="p-1 text-gray-400 hover:text-red-600"
                title="移除参数"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <button
              @click="addParam"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <i class="fas fa-plus mr-2"></i> 添加参数
            </button>
          </div>
          
          <!-- SUBSTRING -->
          <div v-else-if="selectedFunction === 'SUBSTRING'" class="grid grid-cols-1 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">字符串</label>
              <select
                v-model="functionParams.param1"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">选择字段...</option>
                <option 
                  v-for="field in availableFields" 
                  :key="`${field.table}.${field.name}`"
                  :value="`${field.table}.${field.name}`"
                >
                  {{ getTableName(field.table) }}.{{ field.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">起始位置</label>
              <input
                v-model="functionParams.param2"
                type="number"
                min="1"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="起始位置..."
              />
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">长度</label>
              <input
                v-model="functionParams.param3"
                type="number"
                min="1"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="长度..."
              />
            </div>
          </div>
          
          <!-- DATEDIFF -->
          <div v-else-if="selectedFunction === 'DATEDIFF'" class="grid grid-cols-1 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">日期1</label>
              <select
                v-model="functionParams.param1"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">选择字段...</option>
                <option 
                  v-for="field in availableFields" 
                  :key="`${field.table}.${field.name}`"
                  :value="`${field.table}.${field.name}`"
                >
                  {{ getTableName(field.table) }}.{{ field.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">日期2</label>
              <select
                v-model="functionParams.param2"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">选择字段...</option>
                <option 
                  v-for="field in availableFields" 
                  :key="`${field.table}.${field.name}`"
                  :value="`${field.table}.${field.name}`"
                >
                  {{ getTableName(field.table) }}.{{ field.name }}
                </option>
              </select>
            </div>
          </div>
          
          <!-- COALESCE -->
          <div v-else-if="selectedFunction === 'COALESCE'" class="space-y-2">
            <div v-for="(param, idx) in functionParamList" :key="idx" class="flex space-x-2">
              <select
                v-model="param.value"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">选择字段...</option>
                <option 
                  v-for="field in availableFields" 
                  :key="`${field.table}.${field.name}`"
                  :value="`${field.table}.${field.name}`"
                >
                  {{ getTableName(field.table) }}.{{ field.name }}
                </option>
              </select>
              
              <button
                v-if="functionParamList.length > 2"
                @click="removeParam(idx)"
                class="p-1 text-gray-400 hover:text-red-600"
                title="移除参数"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            
            <button
              @click="addParam"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
              <i class="fas fa-plus mr-2"></i> 添加参数
            </button>
          </div>
          
          <!-- NULLIF / IFNULL -->
          <div v-else class="grid grid-cols-1 gap-3">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">第一个参数</label>
              <select
                v-model="functionParams.param1"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">选择字段...</option>
                <option 
                  v-for="field in availableFields" 
                  :key="`${field.table}.${field.name}`"
                  :value="`${field.table}.${field.name}`"
                >
                  {{ getTableName(field.table) }}.{{ field.name }}
                </option>
              </select>
            </div>
            
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">第二个参数</label>
              <input
                v-model="functionParams.param2"
                type="text"
                class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="输入值..."
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 数学运算编辑器 -->
    <div v-else-if="expressionType === 'MATH'" class="space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">左操作数</label>
          <select
            v-model="mathExpression.left"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">选择字段...</option>
            <option 
              v-for="field in availableFields" 
              :key="`${field.table}.${field.name}`"
              :value="`${field.table}.${field.name}`"
            >
              {{ getTableName(field.table) }}.{{ field.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">运算符</label>
          <select
            v-model="mathExpression.operator"
            class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="+">加法 (+)</option>
            <option value="-">减法 (-)</option>
            <option value="*">乘法 (*)</option>
            <option value="/">除法 (/)</option>
            <option value="%">取余 (%)</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">右操作数</label>
          <div class="flex space-x-2">
            <select
              v-model="mathExpression.rightType"
              class="w-1/3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="field">字段</option>
              <option value="value">常量</option>
            </select>
            
            <select
              v-if="mathExpression.rightType === 'field'"
              v-model="mathExpression.right"
              class="w-2/3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">选择字段...</option>
              <option 
                v-for="field in availableFields" 
                :key="`${field.table}.${field.name}`"
                :value="`${field.table}.${field.name}`"
              >
                {{ getTableName(field.table) }}.{{ field.name }}
              </option>
            </select>
            
            <input
              v-else
              v-model="mathExpression.rightValue"
              type="text"
              class="w-2/3 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="输入值..."
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义表达式编辑器 -->
    <div v-else-if="expressionType === 'CUSTOM'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">自定义SQL表达式</label>
        <textarea
          v-model="customExpression"
          rows="5"
          class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="输入SQL表达式..."
        ></textarea>
      </div>
      
      <div>
        <p class="text-sm text-gray-500">
          <i class="fas fa-info-circle mr-1"></i> 
          您可以使用任何有效的SQL表达式，包括函数、子查询、条件语句等。请确保表达式语法正确。
        </p>
      </div>
    </div>

    <!-- 别名设置 -->
    <div class="mt-6">
      <label class="block text-sm font-medium text-gray-700 mb-1">别名（可选）</label>
      <input
        v-model="alias"
        type="text"
        class="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        placeholder="表达式别名..."
      />
    </div>

    <!-- 预览 -->
    <div class="mt-6">
      <h4 class="text-sm font-medium text-gray-700 mb-2">表达式预览</h4>
      <div class="bg-gray-100 p-3 rounded overflow-x-auto">
        <pre class="text-sm text-gray-800">{{ generatedExpression }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import type { TableField, TableDefinition } from '@/types/builder'

// 属性定义
const props = defineProps<{
  tables: TableDefinition[]
  selectedTables: string[]
  initialExpression?: string
  initialAlias?: string
}>()

// 事件
const emit = defineEmits<{
  (e: 'update:expression', expression: string, alias?: string): void
  (e: 'cancel'): void
}>()

// 状态
const expressionType = ref<'CASE' | 'FUNCTION' | 'MATH' | 'CUSTOM'>('CASE')
const alias = ref(props.initialAlias || '')

// CASE WHEN 状态
const caseConditions = ref<Array<{
  field: string
  operator: string
  value: string
  then: string
}>>([])
const elseValue = ref('')

// 函数状态
const selectedFunction = ref('')
const functionParams = ref<Record<string, string>>({
  param1: '',
  param2: '',
  param3: ''
})
const functionParamList = ref<Array<{ id: string, value: string }>>([
  { id: uuidv4(), value: '' },
  { id: uuidv4(), value: '' }
])

// 数学运算状态
const mathExpression = ref({
  left: '',
  operator: '+',
  rightType: 'value',
  right: '',
  rightValue: ''
})

// 自定义表达式状态
const customExpression = ref('')

// 计算属性
// 可用字段
const availableFields = computed(() => {
  const fields: TableField[] = []
  
  // 遍历所有已选择的表
  for (const tableName of props.selectedTables) {
    const table = props.tables.find(t => t.name === tableName)
    if (table) {
      // 添加该表的所有字段
      for (const field of table.fields) {
        fields.push({ ...field, table: tableName })
      }
    }
  }
  
  return fields
})

// 生成的表达式
const generatedExpression = computed((): string => {
  let expression = ''
  
  if (expressionType.value === 'CASE') {
    if (caseConditions.value.length === 0) {
      return ''
    }
    
    expression = 'CASE'
    
    for (const condition of caseConditions.value) {
      if (!condition.field || !condition.then) continue
      
      const fieldParts = condition.field.split('.')
      const fieldRef = fieldParts.length === 2 
        ? `${fieldParts[0]}.${fieldParts[1]}`
        : condition.field
      
      let conditionStr = ''
      
      if (['IS NULL', 'IS NOT NULL'].includes(condition.operator)) {
        conditionStr = `${fieldRef} ${condition.operator}`
      } else if (condition.operator === 'LIKE') {
        conditionStr = `${fieldRef} LIKE '%${condition.value}%'`
      } else {
        conditionStr = `${fieldRef} ${condition.operator} ${formatValue(condition.value)}`
      }
      
      expression += ` WHEN ${conditionStr} THEN ${formatValue(condition.then)}`
    }
    
    if (elseValue.value) {
      expression += ` ELSE ${formatValue(elseValue.value)}`
    }
    
    expression += ' END'
  } else if (expressionType.value === 'FUNCTION') {
    if (!selectedFunction.value) {
      return ''
    }
    
    if (['COUNT', 'SUM', 'AVG', 'MIN', 'MAX', 'UPPER', 'LOWER', 'LENGTH', 'TRIM', 'DATE', 'YEAR', 'MONTH', 'DAY', 'FLOOR', 'CEILING', 'ABS'].includes(selectedFunction.value)) {
      if (!functionParams.param1) return ''
      expression = `${selectedFunction.value}(${functionParams.param1})`
    } else if (selectedFunction.value === 'ROUND') {
      if (!functionParams.param1) return ''
      expression = `${selectedFunction.value}(${functionParams.param1}${functionParams.param2 ? `, ${functionParams.param2}` : ''})`
    } else if (selectedFunction.value === 'CONCAT') {
      const params = functionParamList.value
        .filter(p => p.value)
        .map(p => p.value)
      
      if (params.length < 2) return ''
      
      expression = `CONCAT(${params.join(', ')})`
    } else if (selectedFunction.value === 'SUBSTRING') {
      if (!functionParams.param1 || !functionParams.param2) return ''
      
      expression = `SUBSTRING(${functionParams.param1}, ${functionParams.param2}${functionParams.param3 ? `, ${functionParams.param3}` : ''})`
    } else if (selectedFunction.value === 'DATEDIFF') {
      if (!functionParams.param1 || !functionParams.param2) return ''
      
      expression = `DATEDIFF(${functionParams.param1}, ${functionParams.param2})`
    } else if (selectedFunction.value === 'COALESCE') {
      const params = functionParamList.value
        .filter(p => p.value)
        .map(p => p.value)
      
      if (params.length < 2) return ''
      
      expression = `COALESCE(${params.join(', ')})`
    } else if (['NULLIF', 'IFNULL'].includes(selectedFunction.value)) {
      if (!functionParams.param1 || !functionParams.param2) return ''
      
      expression = `${selectedFunction.value}(${functionParams.param1}, ${formatValue(functionParams.param2)})`
    }
  } else if (expressionType.value === 'MATH') {
    if (!mathExpression.value.left) return ''
    
    const right = mathExpression.value.rightType === 'field' 
      ? mathExpression.value.right 
      : formatValue(mathExpression.value.rightValue)
    
    if (!right) return ''
    
    expression = `${mathExpression.value.left} ${mathExpression.value.operator} ${right}`
  } else if (expressionType.value === 'CUSTOM') {
    expression = customExpression.value
  }
  
  if (expression && alias.value) {
    expression += ` AS ${alias.value}`
  }
  
  return expression
})

// 是否可以确认
const canConfirm = computed(() => {
  return generatedExpression.value !== ''
})

// 方法
// 添加CASE条件
const addCaseCondition = () => {
  caseConditions.value.push({
    field: '',
    operator: '=',
    value: '',
    then: ''
  })
}

// 移除CASE条件
const removeCaseCondition = (index: number) => {
  caseConditions.value.splice(index, 1)
}

// 添加参数
const addParam = () => {
  functionParamList.value.push({ id: uuidv4(), value: '' })
}

// 移除参数
const removeParam = (index: number) => {
  functionParamList.value.splice(index, 1)
}

// 获取表的显示名称
const getTableName = (tableName: string): string => {
  const table = props.tables.find(t => t.name === tableName)
  return table?.displayName || tableName
}

// 格式化值
const formatValue = (value: string): string => {
  if (value === undefined || value === null || value === '') {
    return 'NULL'
  }
  
  // 检查是否是数字
  if (!isNaN(Number(value)) && value.trim() !== '') {
    return value
  }
  
  // 处理字符串
  return `'${value.replace(/'/g, "''")}'`
}

// 确认表达式
const confirmExpression = () => {
  if (!generatedExpression.value) return
  
  emit('update:expression', generatedExpression.value, alias.value)
}

// 监听初始表达式
watch(() => props.initialExpression, (newValue) => {
  if (newValue) {
    customExpression.value = newValue
    expressionType.value = 'CUSTOM'
  }
}, { immediate: true })

// 初始化
onMounted(() => {
  // 默认添加一个CASE条件
  if (caseConditions.value.length === 0) {
    addCaseCondition()
  }
})
</script>