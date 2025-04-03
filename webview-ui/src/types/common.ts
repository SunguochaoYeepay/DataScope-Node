/**
 * 分页请求参数
 */
export interface PaginationParams {
  page: number;    // 页码，从1开始
  size: number;    // 每页条数，默认10
}

/**
 * 分页信息
 */
export interface PaginationInfo {
  page: number;      // 当前页码
  pageSize: number;  // 每页条数
  total: number;     // 总记录数
  totalPages: number;// 总页数
  hasMore: boolean;  // 是否有下一页
}

/**
 * 分页响应
 */
export interface PaginationResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: PaginationInfo;
  }
}

/**
 * 排序方向
 */
export type SortDirection = 'asc' | 'desc';

/**
 * 基础查询参数
 */
export interface BaseQueryParams extends PaginationParams {
  sortBy?: string;
  sortDir?: SortDirection;
  search?: string;
} 