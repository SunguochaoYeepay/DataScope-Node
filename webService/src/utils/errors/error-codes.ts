/**
 * 应用全局错误码定义
 */

// 通用错误 (10000-19999)
export enum ErrorCode {
  // 通用基础错误 (10000-10999)
  UNKNOWN_ERROR = 10000,
  INTERNAL_SERVER_ERROR = 10001,
  SERVICE_UNAVAILABLE = 10002,
  BAD_REQUEST = 10003,
  UNAUTHORIZED = 10004,
  FORBIDDEN = 10005,
  NOT_FOUND = 10006,
  METHOD_NOT_ALLOWED = 10007,
  REQUEST_TIMEOUT = 10008,
  CONFLICT = 10009,
  RESOURCE_GONE = 10010,
  UNPROCESSABLE_ENTITY = 10011,
  TOO_MANY_REQUESTS = 10012,
  INVALID_PARAMETER = 10013,
  MISSING_PARAMETER = 10014,
  
  // 验证相关错误 (11000-11999)
  VALIDATION_ERROR = 11000,
  INVALID_CREDENTIALS = 11001,
  TOKEN_EXPIRED = 11002,
  TOKEN_INVALID = 11003,
  TOKEN_REQUIRED = 11004,
  
  // 数据库相关错误 (12000-12999)
  DATABASE_ERROR = 12000,
  DATABASE_CONNECTION_ERROR = 12001,
  DATABASE_QUERY_ERROR = 12002,
  DATABASE_CONSTRAINT_ERROR = 12003,
  DATABASE_TRANSACTION_ERROR = 12004,
  
  // 文件相关错误 (13000-13999)
  FILE_ERROR = 13000,
  FILE_NOT_FOUND = 13001,
  FILE_TOO_LARGE = 13002,
  FILE_TYPE_NOT_ALLOWED = 13003,
  FILE_UPLOAD_ERROR = 13004,
  
  // 用户相关错误 (14000-14999)
  USER_ERROR = 14000,
  USER_NOT_FOUND = 14001,
  USER_ALREADY_EXISTS = 14002,
  USER_INACTIVE = 14003,
  
  // 数据源相关错误 (20000-29999)
  DATASOURCE_ERROR = 20000,
  DATASOURCE_NOT_FOUND = 20001,
  DATASOURCE_ALREADY_EXISTS = 20002,
  DATASOURCE_CONNECTION_ERROR = 20003,
  DATASOURCE_QUERY_ERROR = 20004,
  DATASOURCE_SYNC_ERROR = 20005,
  
  // 查询相关错误 (30000-39999)
  QUERY_ERROR = 30000,
  QUERY_NOT_FOUND = 30001,
  QUERY_ALREADY_EXISTS = 30002,
  QUERY_EXECUTION_ERROR = 30003,
  QUERY_TIMEOUT = 30004,
  QUERY_SYNTAX_ERROR = 30005,
  QUERY_PERMISSION_ERROR = 30006,
  
  // 元数据相关错误 (40000-49999)
  METADATA_ERROR = 40000,
  METADATA_NOT_FOUND = 40001,
  METADATA_SYNC_ERROR = 40002,
  
  // 查询收藏相关错误 (60000-60999)
  FAVORITE_ERROR = 60000,
  FAVORITE_ADD_ERROR = 60001,
  FAVORITE_REMOVE_ERROR = 60002,
  FAVORITE_LIST_ERROR = 60003
}

// 允许其他代码引用 ERROR_CODES
export const ERROR_CODES = ErrorCode;

// 导出验证错误常量
export const VALIDATION_ERROR = ErrorCode.VALIDATION_ERROR;

// 定义通用错误类型
export const GENERAL_ERROR = {
  INVALID_REQUEST: ErrorCode.BAD_REQUEST,
  NOT_FOUND: ErrorCode.NOT_FOUND,
  UNKNOWN_ERROR: ErrorCode.UNKNOWN_ERROR,
  INTERNAL_SERVER_ERROR: ErrorCode.INTERNAL_SERVER_ERROR,
  // 兼容旧版错误码
  RESOURCE_NOT_FOUND: ErrorCode.NOT_FOUND,
  QUERY_EXECUTION_FAILED: ErrorCode.QUERY_EXECUTION_ERROR,
  QUERY_HISTORY_FETCH_FAILED: ErrorCode.QUERY_ERROR,
  // 数据库记录错误
  DATABASE_RECORD_NOT_FOUND: ErrorCode.NOT_FOUND,
  DATABASE_RECORD_EXISTS: ErrorCode.CONFLICT,
  // 验证错误
  REQUIRED_FIELD_MISSING: ErrorCode.VALIDATION_ERROR,
  INVALID_FIELD_TYPE: ErrorCode.VALIDATION_ERROR,
  INVALID_FIELD_LENGTH: ErrorCode.VALIDATION_ERROR,
  INVALID_FIELD_FORMAT: ErrorCode.VALIDATION_ERROR
};

/**
 * 错误码对应的错误消息
 */
export const ERROR_MESSAGES: Record<number, string> = {
  // 通用基础错误
  [ErrorCode.UNKNOWN_ERROR]: '未知错误',
  [ErrorCode.INTERNAL_SERVER_ERROR]: '服务器内部错误',
  [ErrorCode.SERVICE_UNAVAILABLE]: '服务不可用',
  [ErrorCode.BAD_REQUEST]: '无效的请求',
  [ErrorCode.UNAUTHORIZED]: '未授权',
  [ErrorCode.FORBIDDEN]: '禁止访问',
  [ErrorCode.NOT_FOUND]: '资源不存在',
  [ErrorCode.METHOD_NOT_ALLOWED]: '方法不允许',
  [ErrorCode.REQUEST_TIMEOUT]: '请求超时',
  [ErrorCode.CONFLICT]: '资源冲突',
  [ErrorCode.RESOURCE_GONE]: '资源已删除',
  [ErrorCode.UNPROCESSABLE_ENTITY]: '无法处理的请求实体',
  [ErrorCode.TOO_MANY_REQUESTS]: '请求过于频繁',
  [ErrorCode.INVALID_PARAMETER]: '无效的参数',
  [ErrorCode.MISSING_PARAMETER]: '缺少必要参数',
  
  // 验证相关错误
  [ErrorCode.VALIDATION_ERROR]: '验证失败',
  [ErrorCode.INVALID_CREDENTIALS]: '无效的凭证',
  [ErrorCode.TOKEN_EXPIRED]: '令牌已过期',
  [ErrorCode.TOKEN_INVALID]: '无效的令牌',
  [ErrorCode.TOKEN_REQUIRED]: '需要令牌',
  
  // 数据库相关错误
  [ErrorCode.DATABASE_ERROR]: '数据库错误',
  [ErrorCode.DATABASE_CONNECTION_ERROR]: '数据库连接错误',
  [ErrorCode.DATABASE_QUERY_ERROR]: '数据库查询错误',
  [ErrorCode.DATABASE_CONSTRAINT_ERROR]: '数据库约束错误',
  [ErrorCode.DATABASE_TRANSACTION_ERROR]: '数据库事务错误',
  
  // 文件相关错误
  [ErrorCode.FILE_ERROR]: '文件错误',
  [ErrorCode.FILE_NOT_FOUND]: '文件不存在',
  [ErrorCode.FILE_TOO_LARGE]: '文件过大',
  [ErrorCode.FILE_TYPE_NOT_ALLOWED]: '文件类型不允许',
  [ErrorCode.FILE_UPLOAD_ERROR]: '文件上传错误',
  
  // 用户相关错误
  [ErrorCode.USER_ERROR]: '用户错误',
  [ErrorCode.USER_NOT_FOUND]: '用户不存在',
  [ErrorCode.USER_ALREADY_EXISTS]: '用户已存在',
  [ErrorCode.USER_INACTIVE]: '用户未激活',
  
  // 数据源相关错误
  [ErrorCode.DATASOURCE_ERROR]: '数据源错误',
  [ErrorCode.DATASOURCE_NOT_FOUND]: '数据源不存在',
  [ErrorCode.DATASOURCE_ALREADY_EXISTS]: '数据源已存在',
  [ErrorCode.DATASOURCE_CONNECTION_ERROR]: '数据源连接错误',
  [ErrorCode.DATASOURCE_QUERY_ERROR]: '数据源查询错误',
  [ErrorCode.DATASOURCE_SYNC_ERROR]: '数据源同步错误',
  
  // 查询相关错误
  [ErrorCode.QUERY_ERROR]: '查询错误',
  [ErrorCode.QUERY_NOT_FOUND]: '查询不存在',
  [ErrorCode.QUERY_ALREADY_EXISTS]: '查询已存在',
  [ErrorCode.QUERY_EXECUTION_ERROR]: '查询执行错误',
  [ErrorCode.QUERY_TIMEOUT]: '查询超时',
  [ErrorCode.QUERY_SYNTAX_ERROR]: '查询语法错误',
  [ErrorCode.QUERY_PERMISSION_ERROR]: '查询权限错误',
  
  // 元数据相关错误
  [ErrorCode.METADATA_ERROR]: '元数据错误',
  [ErrorCode.METADATA_NOT_FOUND]: '元数据不存在',
  [ErrorCode.METADATA_SYNC_ERROR]: '元数据同步错误',
  
  // 查询收藏相关错误
  [ErrorCode.FAVORITE_ERROR]: '收藏功能错误',
  [ErrorCode.FAVORITE_ADD_ERROR]: '添加收藏失败',
  [ErrorCode.FAVORITE_REMOVE_ERROR]: '移除收藏失败',
  [ErrorCode.FAVORITE_LIST_ERROR]: '获取收藏列表失败'
};