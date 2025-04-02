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
  currentVersion?: QueryVersion;
  versions?: QueryVersion[];
  tags?: QueryTag[];
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
  description?: string;
  dataSourceId: string;
  queryText: string;
  queryType: QueryType;
  tags?: string[];
  folderId?: string;
}