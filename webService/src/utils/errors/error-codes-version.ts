/**
 * 查询版本相关错误码定义
 */

// 5. 查询版本相关错误 (50xxx)
export const VERSION_ERROR = {
  // 版本不存在
  VERSION_NOT_FOUND: {
    code: 50001,
    message: '查询版本不存在',
    status: 404
  },
  // 创建版本失败
  VERSION_CREATE_FAILED: {
    code: 50002,
    message: '创建查询版本失败',
    status: 500
  },
  // 更新版本失败
  VERSION_UPDATE_FAILED: {
    code: 50003,
    message: '更新查询版本失败',
    status: 500
  },
  // 发布版本失败
  VERSION_PUBLISH_FAILED: {
    code: 50004,
    message: '发布查询版本失败',
    status: 500
  },
  // 废弃版本失败
  VERSION_DEPRECATE_FAILED: {
    code: 50005,
    message: '废弃查询版本失败',
    status: 500
  },
  // 设置活跃版本失败
  VERSION_ACTIVATE_FAILED: {
    code: 50006,
    message: '设置查询活跃版本失败',
    status: 500
  },
  // 获取版本列表失败
  VERSION_LIST_FAILED: {
    code: 50007,
    message: '获取查询版本列表失败',
    status: 500
  },
  // 非草稿状态错误
  VERSION_NOT_DRAFT: {
    code: 50008,
    message: '只有草稿状态的查询版本可以更新',
    status: 400
  },
  // 非发布状态错误
  VERSION_NOT_PUBLISHED: {
    code: 50009,
    message: '只有已发布状态的查询版本可以设为活跃版本',
    status: 400
  },
  // 当前活跃版本错误
  VERSION_IS_ACTIVE: {
    code: 50010,
    message: '当前活跃版本不能废弃，请先切换到其他版本',
    status: 400
  },
  
  // 查询服务状态错误
  QUERY_DISABLE_FAILED: {
    code: 50020,
    message: '禁用查询服务失败',
    status: 500
  },
  QUERY_ENABLE_FAILED: {
    code: 50021,
    message: '启用查询服务失败',
    status: 500
  },
  QUERY_STATUS_FAILED: {
    code: 50022,
    message: '获取查询服务状态失败',
    status: 500
  },
  QUERY_DISABLED: {
    code: 50023,
    message: '查询服务已禁用，无法执行操作',
    status: 403
  }
};