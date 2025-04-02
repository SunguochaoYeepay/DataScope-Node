/**
 * 查询版本控制相关类型定义
 */

/**
 * 查询版本状态枚举
 */
export enum QueryVersionStatus {
  DRAFT = 'DRAFT',       // 草稿
  PUBLISHED = 'PUBLISHED',   // 已发布
  DEPRECATED = 'DEPRECATED'  // 已废弃
}

/**
 * 查询服务状态枚举
 */
export enum QueryServiceStatus {
  ENABLED = 'ENABLED',   // 启用
  DISABLED = 'DISABLED'  // 禁用
}

/**
 * 查询执行状态枚举
 */
export enum QueryExecutionStatus {
  RUNNING = 'RUNNING',     // 运行中
  COMPLETED = 'COMPLETED', // 已完成
  FAILED = 'FAILED',       // 失败
  CANCELLED = 'CANCELLED'  // 已取消
}

/**
 * 创建版本参数
 */
export interface CreateVersionParams {
  queryId: string;                // 查询ID
  sqlContent: string;             // SQL内容
  dataSourceId: string;           // 数据源ID
  description?: string;           // 描述
  parameters?: Record<string, any>; // 参数定义
  createdBy?: string;             // 创建者
}

/**
 * 更新草稿版本参数
 */
export interface UpdateDraftParams {
  sqlContent?: string;            // SQL内容
  description?: string;           // 描述
  parameters?: Record<string, any>; // 参数定义
}

/**
 * 查询版本信息接口
 */
export interface QueryVersion {
  id: string;                     // 版本ID
  queryId: string;                // 查询ID
  versionNumber: number;          // 版本号
  versionStatus: QueryVersionStatus; // 版本状态
  sqlContent: string;             // SQL内容
  dataSourceId: string;           // 数据源ID
  parameters?: string;            // 参数定义(JSON字符串)
  description?: string;           // 描述
  createdAt: Date;                // 创建时间
  publishedAt?: Date;             // 发布时间
  deprecatedAt?: Date;            // 废弃时间
  createdBy?: string;             // 创建者
}

/**
 * 禁用查询参数
 */
export interface DisableQueryParams {
  reason: string;                 // 禁用原因
}

/**
 * 执行查询参数
 */
export interface ExecuteQueryParams {
  queryId: string;                // 查询ID
  versionId?: string;             // 版本ID(可选，不提供则使用当前活跃版本)
  params?: any[];                 // 查询参数
  userId?: string;                // 用户ID
  options?: {                     // 执行选项
    page?: number;                // 页码
    pageSize?: number;            // 每页记录数
    createHistory?: boolean;      // 是否创建历史记录
  };
}

/**
 * 查询执行结果
 */
export interface QueryExecutionResult {
  columns: string[];              // 列名
  rows: any[];                    // 数据行
  rowCount: number;               // 总行数
  executionTime: number;          // 执行时间(毫秒)
  totalPages?: number;            // 总页数
  currentPage?: number;           // 当前页码
}

/**
 * 查询历史查询参数
 */
export interface QueryHistoryParams {
  queryId: string;                // 查询ID
  versionId?: string;             // 版本ID(可选)
  page?: number;                  // 页码
  pageSize?: number;              // 每页记录数
}

/**
 * 查询历史查询结果
 */
export interface QueryHistoryResult {
  histories: any[];               // 历史记录
  total: number;                  // 总记录数
  page: number;                   // 页码
  pageSize: number;               // 每页记录数
  totalPages: number;             // 总页数
}