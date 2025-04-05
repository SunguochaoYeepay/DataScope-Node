/**
 * Mock服务通用工具函数
 * 
 * 提供创建统一格式响应的工具函数
 */

/**
 * 创建模拟API成功响应
 * @param data 响应数据
 * @param success 成功状态，默认为true
 * @param message 可选消息
 * @returns 标准格式的API响应
 */
export function createMockResponse<T>(
  data: T, 
  success: boolean = true, 
  message?: string
) {
  return {
    success,
    data,
    message,
    timestamp: new Date().toISOString(),
    mockResponse: true // 标记为模拟响应
  };
}

/**
 * 创建模拟API错误响应
 * @param message 错误消息
 * @param code 错误代码，默认为'MOCK_ERROR'
 * @param status HTTP状态码，默认为500
 * @returns 标准格式的错误响应
 */
export function createMockErrorResponse(
  message: string, 
  code: string = 'MOCK_ERROR', 
  status: number = 500
) {
  return {
    success: false,
    error: {
      message,
      code,
      statusCode: status
    },
    timestamp: new Date().toISOString(),
    mockResponse: true
  };
}

/**
 * 创建分页响应结构
 * @param items 当前页的项目列表
 * @param totalItems 总项目数
 * @param page 当前页码
 * @param size 每页大小
 * @returns 标准分页响应结构
 */
export function createPaginationResponse<T>(
  items: T[],
  totalItems: number,
  page: number = 1,
  size: number = 10
) {
  return createMockResponse({
    items,
    pagination: {
      total: totalItems,
      page,
      size,
      totalPages: Math.ceil(totalItems / size),
      hasMore: page * size < totalItems
    }
  });
}

/**
 * 模拟API响应延迟
 * @param ms 延迟毫秒数，默认300ms
 * @returns Promise对象
 */
export function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default {
  createMockResponse,
  createMockErrorResponse,
  createPaginationResponse,
  delay
}; 