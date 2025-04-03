/**
 * 查询版本状态枚举
 */
export type QueryVersionStatus = 'DRAFT' | 'PUBLISHED' | 'DEPRECATED';

/**
 * 查询版本接口
 */
export interface QueryVersion {
  id: string;
  queryId: string;
  versionNumber: number;
  queryText: string;
  status: QueryVersionStatus;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  deprecatedAt?: string;
  // 兼容API返回的字段
  version_number?: number;
  version_status?: string;
  sql_content?: string;
  created_at?: string;
  updated_at?: string;
  published_at?: string;
  deprecated_at?: string;
  is_active?: boolean;
  query_id?: string;
  // 添加数据源ID字段
  dataSourceId?: string;
}

/**
 * 创建版本请求参数
 */
export interface CreateVersionRequest {
  versionId: string;
  queryText: string;
}

/**
 * 版本更新响应
 */
export interface VersionUpdateResponse {
  success: boolean;
  message: string;
  version?: QueryVersion;
}

/**
 * 获取版本列表参数
 */
export interface GetVersionsParams {
  queryId: string;
  page?: number;
  size?: number;
  status?: QueryVersionStatus;
}

/**
 * 创建版本参数
 */
export interface CreateVersionParams {
  queryId: string;
  sqlContent: string;
  dataSourceId: string;
  parameters?: Record<string, any>;
  description?: string;
}

/**
 * 更新版本参数
 */
export interface UpdateVersionParams {
  id: string;
  sqlContent?: string;
  parameters?: Record<string, any>;
  description?: string;
}