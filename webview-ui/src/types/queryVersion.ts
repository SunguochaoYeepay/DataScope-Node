// 版本状态枚举
export type QueryVersionStatus = 'DRAFT' | 'PUBLISHED' | 'DEPRECATED'

// 分页信息
export interface Pagination {
  total: number
  page: number
  size: number
  totalPages: number
  hasMore: boolean
}

// 分页响应
export interface PageResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
  totalPages: number
}

// 查询版本
export interface QueryVersion {
  id: string                      // 版本ID
  queryId: string                 // 关联的查询ID
  versionNumber: number           // 版本号
  queryText: string               // 查询语句
  status: QueryVersionStatus      // 版本状态
  description?: string            // 版本描述
  createdBy: string               // 创建人
  createdAt: string               // 创建时间
  updatedAt: string               // 更新时间
  publishedAt?: string            // 发布时间
  deprecatedAt?: string           // 废弃时间
  isActive: boolean               // 是否为当前活跃版本
}

// 版本创建参数
export interface CreateVersionParams {
  queryText: string               // 查询语句
  description?: string            // 版本描述
}

// 版本更新参数
export interface UpdateVersionParams {
  queryText?: string              // 查询语句
  description?: string            // 版本描述
}

// 保存版本参数
export interface SaveVersionParams {
  versionId?: string              // 版本ID（如果是更新现有版本）
  queryText: string               // 查询语句
  description?: string            // 版本描述
}

// 查询版本参数
export interface QueryVersionParams {
  queryId: string                 // 查询ID
  versionId: string               // 版本ID
}

// 版本列表查询参数
export interface VersionListParams {
  page?: number                   // 页码
  size?: number                   // 每页数量
  status?: QueryVersionStatus     // 按状态筛选
  sortBy?: string                 // 排序字段
  sortDir?: 'asc' | 'desc'        // 排序方向
}

// 版本比较结果
export interface VersionComparison {
  version1: {
    id: string
    versionNumber: number
    status: QueryVersionStatus
    queryText: string
    createdAt: string
  }
  version2: {
    id: string
    versionNumber: number
    status: QueryVersionStatus
    queryText: string
    createdAt: string
  }
  differences: {
    addedLines: number[]         // 版本2相对于版本1新增的行
    removedLines: number[]       // 版本2相对于版本1删除的行
    changedLines: number[]       // 版本2相对于版本1修改的行
  }
}