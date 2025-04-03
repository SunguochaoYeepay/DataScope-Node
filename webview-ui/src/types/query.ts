/**
 * 用户信息
 */
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}

/**
 * 数据源信息
 */
export interface DataSource {
  id: string;
  name: string;
  type: string;
  icon?: string;
}

/**
 * 查询参数
 */
export interface QueryParameter {
  id: string;
  name: string;
  type: string;
  label?: string;
  defaultValue?: any;
  required?: boolean;
  options?: any[];
}

/**
 * 查询标签
 */
export interface QueryTag {
  id: string;
  name: string;
  color?: string;
}

/**
 * 执行结果
 */
export interface ExecutionResult {
  id: string;
  status: 'success' | 'error' | 'running' | 'cancelled';
  startTime: string;
  endTime?: string;
  duration?: number;
  rowCount?: number;
  message?: string;
  columns?: {
    name: string;
    type: string;
    displayName?: string;
  }[];
  data?: any[];
  error?: {
    code: string;
    message: string;
    details?: string;
  };
}

/**
 * 执行历史记录
 */
export interface ExecutionHistory {
  id: string;
  queryId: string;
  versionId: string;
  executedBy?: User;
  executedAt: string;
  status: 'success' | 'error' | 'running' | 'cancelled';
  duration?: number;
  rowCount?: number;
  parameters?: Record<string, any>;
  resultId?: string;
}

/**
 * 查询版本
 */
export interface QueryVersion {
  id: string;
  queryId: string;
  versionNumber: number;
  name?: string;
  description?: string;
  sql: string;
  dataSourceId: string;
  dataSource?: DataSource;
  parameters?: QueryParameter[];
  status: string;
  isLatest: boolean;
  createdBy?: User;
  createdAt: string;
  updatedBy?: User;
  updatedAt?: string;
  comment?: string;
  changes?: string[];
  tags?: VersionTag[];
  executionHistory?: ExecutionHistory[];
  lastExecution?: ExecutionHistory;
}

/**
 * 查询信息
 */
export interface Query {
  id: string;
  name: string;
  description?: string;
  folderId?: string;
  status?: QueryStatus;
  serviceStatus?: string;
  dataSourceId?: string;
  dataSourceName?: string;
  queryType?: QueryType;
  queryText?: string;
  resultCount?: number;
  executionTime?: number;
  error?: string;
  versionStatus?: string;
  isActive?: boolean;
  currentVersion?: QueryVersion;
  versions?: QueryVersion[];
  isFavorite: boolean;
  createdBy?: User;
  createdAt: string;
  updatedBy?: User;
  updatedAt?: string;
  executionCount: number;
  lastExecutedAt?: string;
}

/**
 * 版本标签
 */
export interface VersionTag {
  id: string;
  queryId: string;
  versionId: string;
  name: string;
  type: string;
  color?: string;
  comment?: string;
  createdBy?: User;
  createdAt: string;
}

/**
 * 状态历史记录
 */
export interface StatusHistory {
  id: string;
  queryId: string;
  versionId: string;
  fromStatus: string;
  toStatus: string;
  timestamp: string;
  user?: User;
  comment?: string;
}

/**
 * 查询文件夹
 */
export interface QueryFolder {
  id: string;
  name: string;
  parentId?: string;
  createdBy?: User;
  createdAt: string;
  updatedAt?: string;
  queryCount?: number;
}

/**
 * 分页数据响应格式
 */
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 查询类型
 */
export type QueryType = 'SQL' | 'NATURAL_LANGUAGE';

/**
 * 保存查询的参数
 */
export interface SaveQueryParams {
  id?: string;
  name: string;
  dataSourceId: string;
  sql: string;
  description?: string;
  status?: QueryStatus;
  tags?: string[];
  isPublic?: boolean;
}

/**
 * 查询状态类型
 */
export type QueryStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'DEPRECATED' | 'DRAFT' | 'PUBLISHED';

/**
 * 查询结果
 */
export interface QueryResult {
  id: string;
  queryId?: string;
  status?: string;
  createdAt?: string;
  executionTime?: number;
  rowCount?: number;
  rows: any[];
  columns: string[];
  fields?: any[];
  error?: string;
  warnings?: string[];
  metadata?: Record<string, any>;
}

/**
 * 执行查询的参数
 */
export interface ExecuteQueryParams {
  dataSourceId: string;
  queryText: string;
  queryType: QueryType;
  parameters?: Record<string, any>;
  maxRows?: number;
  timeout?: number;
}

/**
 * 自然语言查询参数
 */
export interface NaturalLanguageQueryParams {
  dataSourceId: string;
  question: string;
  contextTables?: string[];
  maxRows?: number;
  timeout?: number;
}

/**
 * 查询历史查询参数
 */
export interface QueryHistoryParams {
  page: number;
  size: number;
  search?: string;
  queryType?: QueryType;
  status?: QueryStatus;
  from?: string;
  to?: string;
  sortBy?: string;
  sortDir?: 'asc' | 'desc';
}

/**
 * 查询显示配置
 */
export interface QueryDisplayConfig {
  id: string;
  queryId: string;
  visibleColumns?: string[];
  columnWidths?: Record<string, number>;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  pageSize?: number;
  visualizationType?: string;
  chartConfig?: ChartConfig;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * 查询收藏信息
 */
export interface QueryFavorite {
  id: string;
  queryId: string;
  userId: string;
  createdAt: string;
  query?: Query;
}

/**
 * 查询优化建议
 */
export interface QuerySuggestion {
  id: string;
  queryId: string;
  type: string;
  title: string;
  description: string;
  suggestion: string;
  impact: 'high' | 'medium' | 'low';
  createdAt: string;
}

/**
 * 查询执行计划
 */
export interface QueryExecutionPlan {
  id: string;
  queryId: string;
  plan: any;
  estimatedCost: number;
  estimatedRows: number;
  planningTime?: number;
  executionTime?: number;
  createdAt: string;
}

/**
 * 查询可视化
 */
export interface QueryVisualization {
  id: string;
  queryId: string;
  name: string;
  type: string;
  config: ChartConfig;
  createdAt: string;
  updatedAt?: string;
  createdBy?: User;
}

/**
 * 图表配置
 */
export interface ChartConfig {
  type: string;
  title?: string;
  xAxis?: string;
  yAxis?: string | string[];
  series?: {
    name: string;
    dataKey: string;
    color?: string;
  }[];
  options?: Record<string, any>;
}

/**
 * 分页信息
 */
export interface Pagination {
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasMore: boolean;
}

/**
 * 分页响应
 */
export interface PageResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  totalPages: number;
}

/**
 * 查询参数接口
 */
export interface FetchQueryParams {
  page?: number;
  size?: number;
  queryType?: string;
  status?: QueryStatus;
  serviceStatus?: string;
  search?: string;
  sortBy?: string;
  sortDir?: string;
}