// 查询构建器类型定义

// 表关联类型
export type JoinType = 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'NONE'

// 操作符类型
export type OperatorType = 
  '=' | '!=' | '>' | '>=' | '<' | '<=' | 
  'LIKE' | 'NOT LIKE' | 'IN' | 'NOT IN' | 
  'IS NULL' | 'IS NOT NULL' | 'BETWEEN'

// 排序方向
export type SortDirection = 'ASC' | 'DESC'

// 表达式类型
export type ExpressionType = 'CASE' | 'FUNCTION' | 'MATH' | 'CUSTOM'

// 聚合函数类型
export type AggregateFunction = 'SUM' | 'AVG' | 'COUNT' | 'MAX' | 'MIN' | 'COUNT_DISTINCT' | null

// SQL函数类型
export type SqlFunction = 
  // 聚合函数
  'COUNT' | 'SUM' | 'AVG' | 'MIN' | 'MAX' | 
  // 字符串函数
  'CONCAT' | 'SUBSTRING' | 'UPPER' | 'LOWER' | 'LENGTH' | 'TRIM' | 
  // 日期函数
  'DATE' | 'YEAR' | 'MONTH' | 'DAY' | 'DATEDIFF' | 
  // 数值函数
  'ROUND' | 'FLOOR' | 'CEILING' | 'ABS' |
  // 条件函数
  'COALESCE' | 'NULLIF' | 'IFNULL'

// 表字段定义
export interface TableField {
  name: string
  type: string
  table: string
  displayName?: string
  isPrimaryKey?: boolean
  isForeignKey?: boolean
}

// 表定义
export interface TableDefinition {
  name: string
  displayName?: string
  schema?: string
  fields: TableField[]
}

// 表关联定义
export interface JoinDefinition {
  id: string
  type: JoinType
  targetTable: string
  sourceTable: string
  sourceField: string
  targetField: string
}

// 条件组逻辑操作符
export type LogicalOperator = 'AND' | 'OR'

// 查询条件
export interface QueryCondition {
  id: string
  field: TableField
  operator: OperatorType
  value: any
  valueType?: string
  isParameter?: boolean
  parameterName?: string
}

// 条件组
export interface ConditionGroup {
  id: string
  conditions: QueryCondition[]
  logicalOperator: LogicalOperator
  groups: ConditionGroup[]
}

// 表达式定义
export interface ExpressionDefinition {
  type: ExpressionType
  expression: string
  alias?: string
  components?: Record<string, any> // 存储表达式的组成部分，用于编辑
}

// 字段选择
export interface FieldSelection {
  id: string
  field?: TableField // 可能是空的，如果使用表达式
  alias?: string
  aggregate?: AggregateFunction
  expression?: string // 自定义表达式
  expressionDefinition?: ExpressionDefinition // 结构化的表达式定义
  isVisible: boolean
  isExpression: boolean // 标识是否为表达式字段
}

// 排序定义
export interface SortDefinition {
  id: string
  field: TableField
  direction: SortDirection
}

// 查询构建器状态
export interface QueryBuilderState {
  selectedDataSourceId: string
  tables: TableDefinition[]
  selectedTables: string[]
  joins: JoinDefinition[]
  fieldSelections: FieldSelection[]
  whereConditions: ConditionGroup
  groupByFields: TableField[]
  sortDefinitions: SortDefinition[]
  limit?: number
  offset?: number
  generatedSql?: string
}