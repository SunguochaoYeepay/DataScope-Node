"use strict";
/**
 * 数据库类型定义
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseType = void 0;
/**
 * 数据库类型枚举
 */
var DatabaseType;
(function (DatabaseType) {
    DatabaseType["MySQL"] = "mysql";
    DatabaseType["PostgreSQL"] = "postgresql";
    DatabaseType["SQLServer"] = "sqlserver";
    DatabaseType["Oracle"] = "oracle";
    DatabaseType["MongoDB"] = "mongodb";
    DatabaseType["Elasticsearch"] = "elasticsearch";
})(DatabaseType || (exports.DatabaseType = DatabaseType = {}));
//# sourceMappingURL=database.js.map