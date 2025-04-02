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