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