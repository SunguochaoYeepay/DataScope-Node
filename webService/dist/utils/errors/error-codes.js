"use strict";
/**
 * 错误代码定义
 * 命名规则: [领域]_[具体错误]
 * 格式: 固定5位数字，前2位为领域编码，后3位为错误编码
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_CODES = exports.ERROR_MESSAGES = exports.VALIDATION_ERROR = exports.DATABASE_ERROR = exports.SYSTEM_ERROR = exports.AUTH_ERROR = exports.METADATA_ERROR = exports.QUERY_ERROR = exports.DATASOURCE_ERROR = exports.GENERAL_ERROR = void 0;
// 1. 通用错误 (10xxx)
exports.GENERAL_ERROR = {
    INTERNAL_SERVER_ERROR: 10001, // 内部服务器错误
    INVALID_REQUEST: 10002, // 无效请求
    VALIDATION_ERROR: 10003, // 参数验证错误
    RESOURCE_NOT_FOUND: 10004, // 资源未找到
    UNAUTHORIZED: 10005, // 未授权
    FORBIDDEN: 10006, // 禁止访问
    METHOD_NOT_ALLOWED: 10007, // 方法不允许
    REQUEST_TIMEOUT: 10008, // 请求超时
    CONFLICT: 10009, // 资源冲突
    RESOURCE_CONFLICT: 10009, // 资源冲突 (与CONFLICT相同)
    TOO_MANY_REQUESTS: 10010, // 请求过多
    SERVICE_UNAVAILABLE: 10011, // In 服务不可用
    UNKNOWN_ERROR: 10099, // 未知错误
};
// 2. 数据源错误 (20xxx)
exports.DATASOURCE_ERROR = {
    CONNECTION_FAILED: 20001, // 连接失败
    INVALID_CREDENTIALS: 20002, // 无效的凭证
    DATABASE_NOT_FOUND: 20003, // 数据库未找到
    INVALID_HOST: 20004, // 无效的主机
    TIMEOUT: 20005, // 连接超时
    ALREADY_EXISTS: 20006, // 数据源已存在
    NOT_FOUND: 20007, // 数据源不存在
    SYNC_FAILED: 20008, // 同步失败
    TEST_FAILED: 20009, // 测试失败
    UNSUPPORTED_TYPE: 20010, // 不支持的数据源类型
    DATASOURCE_ERROR: 20099, // 数据源通用错误
    // 追加数据源特定错误码
    AUTHENTICATION_FAILED: 20011, // 数据源认证失败
    DATASOURCE_NOT_FOUND: 20012, // 数据源不存在
    INVALID_DATASOURCE_CONFIG: 20013, // 数据源配置无效
    UNSUPPORTED_DATASOURCE_TYPE: 20014, // 不支持的数据源类型
    DATASOURCE_TIMEOUT: 20015, // 数据源超时
};
// 3. 查询执行错误 (30xxx)
exports.QUERY_ERROR = {
    EXECUTION_FAILED: 30001, // 执行失败
    SYNTAX_ERROR: 30002, // 语法错误
    TIMEOUT: 30003, // 执行超时
    ACCESS_DENIED: 30004, // 访问被拒绝
    RESULT_TOO_LARGE: 30005, // 结果集过大
    INVALID_PARAMETERS: 30006, // 参数无效
    TRANSACTION_ERROR: 30007, // 事务错误
    QUERY_NOT_FOUND: 30008, // 查询未找到
    INVALID_SQL: 30009, // 无效的SQL
    QUERY_EXECUTION_ERROR: 30099, // 查询执行通用错误
    QUERY_SYNTAX_ERROR: 30010, // SQL语法错误
    QUERY_TIMEOUT: 30011, // 查询执行超时
    QUERY_PERMISSION_DENIED: 30012, // 查询权限被拒绝
    QUERY_RESOURCE_NOT_FOUND: 30013, // 查询资源不存在
    QUERY_TOO_COMPLEX: 30014, // 查询过于复杂
    QUERY_RESULT_TOO_LARGE: 30015, // 查询结果过大
};
// 4. 元数据错误 (40xxx)
exports.METADATA_ERROR = {
    SYNC_FAILED: 40001, // 元数据同步失败
    SCHEMA_NOT_FOUND: 40002, // 模式未找到
    TABLE_NOT_FOUND: 40003, // 表未找到
    COLUMN_NOT_FOUND: 40004, // 列未找到
    INVALID_STRUCTURE: 40005, // 无效的结构
    EXPORT_FAILED: 40006, // 导出失败
    IMPORT_FAILED: 40007, // 导入失败
    RELATION_ERROR: 40008, // 关系错误
};
// 5. 用户认证错误 (50xxx)
exports.AUTH_ERROR = {
    INVALID_CREDENTIALS: 50001, // 凭证无效
    TOKEN_EXPIRED: 50002, // 令牌过期
    TOKEN_INVALID: 50003, // 令牌无效
    ACCESS_DENIED: 50004, // 拒绝访问
    ACCOUNT_LOCKED: 50005, // 账户已锁定
    PASSWORD_EXPIRED: 50006, // 密码已过期
    SESSION_EXPIRED: 50007, // 会话已过期
};
// 6. 系统错误 (60xxx)
exports.SYSTEM_ERROR = {
    FILE_NOT_FOUND: 60001, // 文件未找到
    FILE_IO_ERROR: 60002, // 文件I/O错误
    CONFIG_ERROR: 60003, // 配置错误
    NETWORK_ERROR: 60004, // 网络错误
    MEMORY_ERROR: 60005, // 内存错误
    CPU_ERROR: 60006, // CPU错误
    DISK_ERROR: 60007, // 磁盘错误
    RESOURCE_EXCEEDED: 60008, // 资源超限
};
// 7. 数据库错误 (70xxx)
exports.DATABASE_ERROR = {
    DATABASE_ERROR: 70001, // 数据库通用错误
    DATABASE_CONNECTION_ERROR: 70002, // 数据库连接错误
    DATABASE_QUERY_ERROR: 70003, // 数据库查询错误
    DATABASE_TRANSACTION_ERROR: 70004, // 数据库事务错误
    DATABASE_RECORD_NOT_FOUND: 70005, // 数据库记录未找到
    DATABASE_RECORD_EXISTS: 70006, // 数据库记录已存在
    DATABASE_CONSTRAINT_ERROR: 70007, // 数据库约束错误
    DATABASE_MIGRATION_ERROR: 70008, // 数据库迁移错误
    DATABASE_TIMEOUT: 70009, // 数据库操作超时
    DATABASE_PERMISSION_ERROR: 70010, // 数据库权限错误
};
// 8. 验证错误 (80xxx)
exports.VALIDATION_ERROR = {
    VALIDATION_ERROR: 80001, // 验证通用错误
    REQUIRED_FIELD_MISSING: 80002, // 必填字段缺失
    INVALID_FIELD_TYPE: 80003, // 字段类型无效
    INVALID_FIELD_LENGTH: 80004, // 字段长度无效
    INVALID_FIELD_FORMAT: 80005, // 字段格式无效
    INVALID_FIELD_VALUE: 80006, // 字段值无效
    INVALID_FIELD_RANGE: 80007, // 字段范围无效
    VALIDATION_FAILED: 80008, // 验证失败
};
// 错误码与错误消息映射
exports.ERROR_MESSAGES = {
    // 通用错误
    [exports.GENERAL_ERROR.INTERNAL_SERVER_ERROR]: '内部服务器错误',
    [exports.GENERAL_ERROR.INVALID_REQUEST]: '无效的请求',
    [exports.GENERAL_ERROR.VALIDATION_ERROR]: '参数验证错误',
    [exports.GENERAL_ERROR.RESOURCE_NOT_FOUND]: '资源未找到',
    [exports.GENERAL_ERROR.UNAUTHORIZED]: '未授权',
    [exports.GENERAL_ERROR.FORBIDDEN]: '禁止访问',
    [exports.GENERAL_ERROR.METHOD_NOT_ALLOWED]: '方法不被允许',
    [exports.GENERAL_ERROR.REQUEST_TIMEOUT]: '请求超时',
    [exports.GENERAL_ERROR.CONFLICT]: '资源冲突',
    [exports.GENERAL_ERROR.RESOURCE_CONFLICT]: '资源冲突',
    [exports.GENERAL_ERROR.TOO_MANY_REQUESTS]: '请求过多，请稍后再试',
    [exports.GENERAL_ERROR.SERVICE_UNAVAILABLE]: '服务暂时不可用',
    [exports.GENERAL_ERROR.UNKNOWN_ERROR]: '未知错误',
    // 数据源错误
    [exports.DATASOURCE_ERROR.CONNECTION_FAILED]: '数据源连接失败',
    [exports.DATASOURCE_ERROR.INVALID_CREDENTIALS]: '数据源凭证无效',
    [exports.DATASOURCE_ERROR.DATABASE_NOT_FOUND]: '数据库未找到',
    [exports.DATASOURCE_ERROR.INVALID_HOST]: '无效的数据源主机地址',
    [exports.DATASOURCE_ERROR.TIMEOUT]: '数据源连接超时',
    [exports.DATASOURCE_ERROR.ALREADY_EXISTS]: '数据源已存在',
    [exports.DATASOURCE_ERROR.NOT_FOUND]: '数据源不存在',
    [exports.DATASOURCE_ERROR.SYNC_FAILED]: '数据源同步失败',
    [exports.DATASOURCE_ERROR.TEST_FAILED]: '数据源连接测试失败',
    [exports.DATASOURCE_ERROR.UNSUPPORTED_TYPE]: '不支持的数据源类型',
    [exports.DATASOURCE_ERROR.DATASOURCE_ERROR]: '数据源错误',
    [exports.DATASOURCE_ERROR.AUTHENTICATION_FAILED]: '数据源认证失败',
    [exports.DATASOURCE_ERROR.DATASOURCE_NOT_FOUND]: '数据源不存在',
    [exports.DATASOURCE_ERROR.INVALID_DATASOURCE_CONFIG]: '数据源配置无效',
    [exports.DATASOURCE_ERROR.UNSUPPORTED_DATASOURCE_TYPE]: '不支持的数据源类型',
    [exports.DATASOURCE_ERROR.DATASOURCE_TIMEOUT]: '数据源操作超时',
    // 查询执行错误
    [exports.QUERY_ERROR.EXECUTION_FAILED]: '查询执行失败',
    [exports.QUERY_ERROR.SYNTAX_ERROR]: 'SQL语法错误',
    [exports.QUERY_ERROR.TIMEOUT]: '查询执行超时',
    [exports.QUERY_ERROR.ACCESS_DENIED]: '查询访问被拒绝',
    [exports.QUERY_ERROR.RESULT_TOO_LARGE]: '查询结果集过大',
    [exports.QUERY_ERROR.INVALID_PARAMETERS]: '查询参数无效',
    [exports.QUERY_ERROR.TRANSACTION_ERROR]: '事务处理错误',
    [exports.QUERY_ERROR.QUERY_NOT_FOUND]: '查询未找到',
    [exports.QUERY_ERROR.INVALID_SQL]: '无效的SQL语句',
    [exports.QUERY_ERROR.QUERY_EXECUTION_ERROR]: '查询执行错误',
    [exports.QUERY_ERROR.QUERY_SYNTAX_ERROR]: 'SQL语法错误',
    [exports.QUERY_ERROR.QUERY_TIMEOUT]: '查询执行超时',
    [exports.QUERY_ERROR.QUERY_PERMISSION_DENIED]: '无权执行此查询',
    [exports.QUERY_ERROR.QUERY_RESOURCE_NOT_FOUND]: '查询的资源不存在',
    [exports.QUERY_ERROR.QUERY_TOO_COMPLEX]: '查询过于复杂',
    [exports.QUERY_ERROR.QUERY_RESULT_TOO_LARGE]: '查询结果过大',
    // 数据库错误
    [exports.DATABASE_ERROR.DATABASE_ERROR]: '数据库错误',
    [exports.DATABASE_ERROR.DATABASE_CONNECTION_ERROR]: '数据库连接错误',
    [exports.DATABASE_ERROR.DATABASE_QUERY_ERROR]: '数据库查询错误',
    [exports.DATABASE_ERROR.DATABASE_TRANSACTION_ERROR]: '数据库事务错误',
    [exports.DATABASE_ERROR.DATABASE_RECORD_NOT_FOUND]: '数据库记录未找到',
    [exports.DATABASE_ERROR.DATABASE_RECORD_EXISTS]: '数据库记录已存在',
    [exports.DATABASE_ERROR.DATABASE_CONSTRAINT_ERROR]: '数据库约束错误',
    [exports.DATABASE_ERROR.DATABASE_MIGRATION_ERROR]: '数据库迁移错误',
    [exports.DATABASE_ERROR.DATABASE_TIMEOUT]: '数据库操作超时',
    [exports.DATABASE_ERROR.DATABASE_PERMISSION_ERROR]: '数据库权限错误',
    // 验证错误
    [exports.VALIDATION_ERROR.VALIDATION_ERROR]: '验证错误',
    [exports.VALIDATION_ERROR.REQUIRED_FIELD_MISSING]: '必填字段缺失',
    [exports.VALIDATION_ERROR.INVALID_FIELD_TYPE]: '字段类型无效',
    [exports.VALIDATION_ERROR.INVALID_FIELD_LENGTH]: '字段长度无效',
    [exports.VALIDATION_ERROR.INVALID_FIELD_FORMAT]: '字段格式无效',
    [exports.VALIDATION_ERROR.INVALID_FIELD_VALUE]: '字段值无效',
    [exports.VALIDATION_ERROR.INVALID_FIELD_RANGE]: '字段范围无效',
    [exports.VALIDATION_ERROR.VALIDATION_FAILED]: '验证失败',
    // 其他错误略...
};
// 统一导出所有错误码
exports.ERROR_CODES = {
    ...exports.GENERAL_ERROR,
    ...exports.DATASOURCE_ERROR,
    ...exports.QUERY_ERROR,
    ...exports.METADATA_ERROR,
    ...exports.AUTH_ERROR,
    ...exports.SYSTEM_ERROR,
    ...exports.DATABASE_ERROR,
    ...exports.VALIDATION_ERROR,
};
//# sourceMappingURL=error-codes.js.map