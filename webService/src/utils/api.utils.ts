/**
 * 标准化API响应工具
 */

/**
 * 创建统一的分页响应格式
 * @param items 分页数据项
 * @param total 总记录数
 * @param page 当前页码
 * @param pageSize 每页大小
 * @param additionalData 额外数据
 * @returns 标准化的分页响应
 */
export function createPaginatedResponse<T>(
  items: T[],
  total: number,
  page: number = 1,
  pageSize: number = 20,
  additionalData: Record<string, any> = {}
) {
  const totalPages = Math.ceil(total / pageSize);
  
  return {
    items,
    pagination: {
      page,
      pageSize,
      total,
      totalPages,
      hasMore: page < totalPages
    },
    ...additionalData
  };
}

/**
 * 将offset/limit转换为page/pageSize
 * @param offset 偏移量
 * @param limit 限制数
 * @returns 页码和每页大小
 */
export function offsetToPage(offset: number, limit: number): { page: number, pageSize: number } {
  return {
    page: Math.floor(offset / limit) + 1,
    pageSize: limit
  };
}

/**
 * 将page/pageSize转换为offset/limit
 * @param page 页码
 * @param pageSize 每页大小
 * @returns 偏移量和限制数
 */
export function pageToOffset(page: number, pageSize: number): { offset: number, limit: number } {
  return {
    offset: (page - 1) * pageSize,
    limit: pageSize
  };
}

/**
 * 从请求中获取统一的分页参数
 * 兼容两种分页参数形式：page/size和offset/limit
 * 优先使用page/size，如果没有提供，则尝试使用offset/limit
 * @param req Express请求对象
 * @param defaultPageSize 默认每页大小
 * @returns 统一的分页参数对象
 */
export function getPaginationParams(req: any, defaultPageSize: number = 10): {
  page: number;
  size: number;
  offset: number;
  limit: number;
} {
  // 尝试从查询参数中获取page和size
  const pageParam = req.query.page;
  const sizeParam = req.query.size;
  
  // 尝试从查询参数中获取offset和limit
  const offsetParam = req.query.offset;
  const limitParam = req.query.limit;
  
  // 如果提供了page参数，优先使用page/size
  if (pageParam !== undefined) {
    const page = Math.max(1, parseInt(pageParam, 10) || 1); // 最小页码为1
    const size = parseInt(sizeParam, 10) || defaultPageSize;
    const offset = (page - 1) * size;
    return { page, size, offset, limit: size };
  }
  
  // 否则使用offset/limit
  const limit = parseInt(limitParam, 10) || defaultPageSize;
  const offset = parseInt(offsetParam, 10) || 0;
  const page = Math.floor(offset / limit) + 1;
  return { page, size: limit, offset, limit };
}

/**
 * 创建标准的成功响应
 * @param data 响应数据
 * @returns 标准成功响应对象
 */
export function createSuccessResponse<T>(data: T) {
  return {
    success: true,
    data
  };
}

/**
 * 创建标准的分页成功响应
 * @param items 分页数据项
 * @param total 总记录数
 * @param page 当前页码
 * @param pageSize 每页大小
 * @param additionalData 额外数据
 * @returns 标准的分页成功响应
 */
export function createPaginatedSuccessResponse<T>(
  items: T[],
  total: number,
  page: number = 1,
  pageSize: number = 10,
  additionalData: Record<string, any> = {}
) {
  return {
    success: true,
    data: createPaginatedResponse(items, total, page, pageSize, additionalData)
  };
} 