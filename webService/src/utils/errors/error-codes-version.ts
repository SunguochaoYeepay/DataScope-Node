/**
 * 查询版本控制相关错误码定义
 */

export const VERSION_ERROR = {
  // 版本管理相关错误 (50001-50020)
  VERSION_NOT_FOUND: 50001,
  VERSION_CREATE_FAILED: 50002,
  VERSION_UPDATE_FAILED: 50003,
  VERSION_DELETE_FAILED: 50004,
  VERSION_PUBLISH_FAILED: 50005,
  VERSION_DEPRECATE_FAILED: 50006,
  VERSION_ACTIVATE_FAILED: 50007,
  VERSION_NOT_DRAFT: 50008,
  VERSION_NOT_PUBLISHED: 50009,
  VERSION_IS_CURRENT: 50010,
  VERSION_LIST_FAILED: 50011,
  VERSION_GET_FAILED: 50012,
  VERSION_COUNT_FAILED: 50013,
  
  // 查询服务状态管理相关错误 (50021-50030)
  QUERY_DISABLE_FAILED: 50021,
  QUERY_ENABLE_FAILED: 50022,
  QUERY_STATUS_FAILED: 50023,
  
  // 查询执行相关错误 (50031-50040)
  QUERY_EXECUTION_FAILED: 50031,
  QUERY_SERVICE_DISABLED: 50032,
  QUERY_VERSION_NOT_ACTIVE: 50033,
  
  // 查询历史相关错误 (50041-50050)
  QUERY_HISTORY_FETCH_FAILED: 50041
};

/**
 * 查询版本控制相关错误消息
 */
export const VERSION_ERROR_MESSAGES = {
  // 版本管理相关错误
  [VERSION_ERROR.VERSION_NOT_FOUND]: '查询版本不存在',
  [VERSION_ERROR.VERSION_CREATE_FAILED]: '创建版本失败',
  [VERSION_ERROR.VERSION_UPDATE_FAILED]: '更新版本失败',
  [VERSION_ERROR.VERSION_DELETE_FAILED]: '删除版本失败',
  [VERSION_ERROR.VERSION_PUBLISH_FAILED]: '发布版本失败',
  [VERSION_ERROR.VERSION_DEPRECATE_FAILED]: '废弃版本失败',
  [VERSION_ERROR.VERSION_ACTIVATE_FAILED]: '设置活跃版本失败',
  [VERSION_ERROR.VERSION_NOT_DRAFT]: '只有草稿状态的版本可以更新',
  [VERSION_ERROR.VERSION_NOT_PUBLISHED]: '只有已发布状态的版本可以设为活跃或废弃',
  [VERSION_ERROR.VERSION_IS_CURRENT]: '不能废弃当前活跃版本',
  [VERSION_ERROR.VERSION_LIST_FAILED]: '获取版本列表失败',
  [VERSION_ERROR.VERSION_GET_FAILED]: '获取版本详情失败',
  [VERSION_ERROR.VERSION_COUNT_FAILED]: '获取版本总数失败',
  
  // 查询服务状态管理相关错误
  [VERSION_ERROR.QUERY_DISABLE_FAILED]: '禁用查询服务失败',
  [VERSION_ERROR.QUERY_ENABLE_FAILED]: '启用查询服务失败',
  [VERSION_ERROR.QUERY_STATUS_FAILED]: '获取查询服务状态失败',
  
  // 查询执行相关错误
  [VERSION_ERROR.QUERY_EXECUTION_FAILED]: '执行查询失败',
  [VERSION_ERROR.QUERY_SERVICE_DISABLED]: '查询服务已禁用',
  [VERSION_ERROR.QUERY_VERSION_NOT_ACTIVE]: '指定的查询版本不是活跃版本',
  
  // 查询历史相关错误
  [VERSION_ERROR.QUERY_HISTORY_FETCH_FAILED]: '获取查询历史记录失败'
};

/**
 * 获取版本控制相关错误的HTTP状态码
 */
export const VERSION_ERROR_HTTP_STATUS = {
  // 版本管理相关错误
  [VERSION_ERROR.VERSION_NOT_FOUND]: 404,
  [VERSION_ERROR.VERSION_CREATE_FAILED]: 500,
  [VERSION_ERROR.VERSION_UPDATE_FAILED]: 500,
  [VERSION_ERROR.VERSION_DELETE_FAILED]: 500,
  [VERSION_ERROR.VERSION_PUBLISH_FAILED]: 500,
  [VERSION_ERROR.VERSION_DEPRECATE_FAILED]: 500,
  [VERSION_ERROR.VERSION_ACTIVATE_FAILED]: 500,
  [VERSION_ERROR.VERSION_NOT_DRAFT]: 400,
  [VERSION_ERROR.VERSION_NOT_PUBLISHED]: 400,
  [VERSION_ERROR.VERSION_IS_CURRENT]: 400,
  [VERSION_ERROR.VERSION_LIST_FAILED]: 500,
  [VERSION_ERROR.VERSION_GET_FAILED]: 500,
  [VERSION_ERROR.VERSION_COUNT_FAILED]: 500,
  
  // 查询服务状态管理相关错误
  [VERSION_ERROR.QUERY_DISABLE_FAILED]: 500,
  [VERSION_ERROR.QUERY_ENABLE_FAILED]: 500,
  [VERSION_ERROR.QUERY_STATUS_FAILED]: 500,
  
  // 查询执行相关错误
  [VERSION_ERROR.QUERY_EXECUTION_FAILED]: 500,
  [VERSION_ERROR.QUERY_SERVICE_DISABLED]: 403,
  [VERSION_ERROR.QUERY_VERSION_NOT_ACTIVE]: 400,
  
  // 查询历史相关错误
  [VERSION_ERROR.QUERY_HISTORY_FETCH_FAILED]: 500
};