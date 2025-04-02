/**
 * 查询服务版本控制与状态管理 - 类型定义
 */

/**
 * 查询服务状态枚举
 */
export enum QueryServiceStatus {
  /** 启用状态 */
  ENABLED = 'ENABLED',
  /** 禁用状态 */
  DISABLED = 'DISABLED'
}

/**
 * 查询版本状态枚举
 */
export enum QueryVersionStatus {
  /** 草稿状态 */
  DRAFT = 'DRAFT',
  /** 已发布状态 */
  PUBLISHED = 'PUBLISHED',
  /** 已废弃状态 */
  DEPRECATED = 'DEPRECATED'
}

/**
 * 查询版本信息
 */
export interface QueryVersion {
  /** 版本ID */
  id: string;
  /** 关联的查询服务ID */
  queryId: string;
  /** 版本号 */
  versionNumber: number;
  /** 版本状态 */
  versionStatus: QueryVersionStatus;
  /** SQL内容 */
  sqlContent: string;
  /** 数据源ID */
  dataSourceId: string;
  /** 参数定义 */
  parameters?: any;
  /** 版本描述 */
  description?: string;
  /** 创建时间 */
  createdAt: Date;
  /** 发布时间 */
  publishedAt?: Date;
  /** 废弃时间 */
  deprecatedAt?: Date;
  /** 创建人 */
  createdBy: string;
}

/**
 * 创建查询版本参数
 */
export interface CreateQueryVersionParams {
  /** 关联的查询服务ID */
  queryId: string;
  /** SQL内容 */
  sqlContent: string;
  /** 数据源ID */
  dataSourceId: string;
  /** 版本描述 */
  description?: string;
  /** 参数定义 */
  parameters?: any;
}

/**
 * 更新查询版本参数
 */
export interface UpdateQueryVersionParams {
  /** SQL内容 */
  sqlContent?: string;
  /** 版本描述 */
  description?: string;
  /** 参数定义 */
  parameters?: any;
}

/**
 * 查询版本列表响应
 */
export interface QueryVersionListResponse {
  /** 版本列表 */
  versions: QueryVersion[];
  /** 总数 */
  total: number;
  /** 当前活跃版本ID */
  currentVersionId?: string;
}

/**
 * 禁用查询服务参数
 */
export interface DisableQueryParams {
  /** 禁用原因 */
  reason: string;
}

/**
 * 查询服务状态响应
 */
export interface QueryStatusResponse {
  /** 查询服务ID */
  id: string;
  /** 服务状态 */
  status: QueryServiceStatus;
  /** 禁用原因 */
  disabledReason?: string;
  /** 禁用时间 */
  disabledAt?: Date;
}