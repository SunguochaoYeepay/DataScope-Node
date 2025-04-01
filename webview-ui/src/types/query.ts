// 查询类型
export type QueryType = 'SQL' | 'NATURAL_LANGUAGE' | 'DATA'

// 查询状态
export type QueryStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

// 列数据类型
export type ColumnType = 
  'STRING' | 
  'INTEGER' | 
  'DECIMAL' | 
  'BOOLEAN' | 
  'DATE' | 
  'DATETIME' | 
  'TIMESTAMP' | 
  'JSON' | 
  'ARRAY' | 
  'BINARY' | 
  'UNKNOWN'

// 查询模型
export interface Query {
  id: string
  name?: string
  dataSourceId: string
  queryType: QueryType
  queryText: string
  status: QueryStatus
  createdAt: string
  updatedAt: string
  executionTime?: number  // 毫秒
  resultCount?: number
  error?: string
  isFavorite?: boolean
  description?: string
  tags?: string[]
}

// 列定义
export interface ColumnDefinition {
  name: string
  type: ColumnType
  label?: string
  isPrimaryKey?: boolean
  isForeignKey?: boolean
  isNullable?: boolean
}

// 查询结果
export interface QueryResult {
  id: string
  columns: string[]
  columnTypes?: ColumnType[]
  rows: Record<string, any>[]
  rowCount: number
  executionTime?: number
  hasMore?: boolean
  status?: QueryStatus
  error?: string
  createdAt?: string
}

// 执行查询参数
export interface ExecuteQueryParams {
  dataSourceId: string
  queryType: QueryType
  queryText: string
  limit?: number
  offset?: number
  parameters?: Record<string, any>
}

// 自然语言查询参数
export interface NaturalLanguageQueryParams {
  dataSourceId: string
  question: string
  context?: string
}

// 保存查询参数
export interface SaveQueryParams {
  id?: string
  name: string
  dataSourceId: string
  queryType: QueryType
  queryText: string
  description?: string
  tags?: string[]
}

// 查询历史参数
export interface QueryHistoryParams {
  dataSourceId?: string
  queryType?: QueryType
  startDate?: string
  endDate?: string
  status?: QueryStatus
  page?: number
  size?: number
  searchTerm?: string
}

// 查询展示配置
export interface QueryDisplayConfig {
  id: string
  queryId: string
  displayType: 'TABLE' | 'CHART'
  chartType?: 'BAR' | 'LINE' | 'PIE' | 'SCATTER' | 'AREA'
  title?: string
  description?: string
  config: any  // 配置对象，根据展示类型不同而不同
  createdAt: string
  updatedAt: string
}

// 查询收藏夹
export interface QueryFavorite {
  id: string
  queryId: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

// 分页响应
export interface PageResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  totalPages?: number
  hasMore?: boolean
}

// 分页信息
export interface Pagination {
  total: number
  page: number
  size: number
  totalPages: number
  hasMore: boolean
}

// SQL执行计划
export interface QueryExecutionPlan {
  id: string
  queryId: string
  planDetails: {
    steps: Array<{
      type: string
      table?: string
      condition?: string
      columns?: string[]
      cost: number
      rows: number
    }>
    totalCost: number
    estimatedRows: number
  }
  estimatedCost?: number
  estimatedRows?: number
  createdAt: string
}

// 查询节点类型
export interface QueryNode {
  id: string
  type: 'TABLE' | 'JOIN' | 'FILTER' | 'SORT' | 'GROUP' | 'AGGREGATE' | 'UNION' | 'SUBQUERY'
  label: string
  details: any
  children?: QueryNode[]
}

// 图表类型
export type ChartType = 'bar' | 'line' | 'pie' | 'scatter'

// 图表配置
export interface ChartConfig {
  chartType: ChartType
  title?: string
  xAxis: string  // X轴数据字段
  yAxis: string  // Y轴数据字段
  groupBy?: string  // 分组字段
  aggregateFunction?: 'sum' | 'avg' | 'count' | 'max' | 'min'  // 聚合函数
  colorField?: string  // 颜色映射字段（用于散点图）
  enableDataZoom?: boolean  // 是否启用缩放功能
  showLegend?: boolean  // 是否显示图例
}

// 查询可视化表示
export interface QueryVisualization {
  id: string
  queryId: string
  nodes?: QueryNode[]
  displayType?: 'TABLE' | 'CHART'
  chartType?: ChartType
  title?: string
  description?: string
  config?: ChartConfig
  createdAt: string
}

// 查询相关建议
export interface QuerySuggestion {
  id: string
  queryId: string
  type: 'OPTIMIZATION' | 'SECURITY' | 'READABILITY' | 'ALTERNATIVE'
  title: string
  description: string
  suggestedQuery?: string
  impact?: 'HIGH' | 'MEDIUM' | 'LOW'
  createdAt: string
}