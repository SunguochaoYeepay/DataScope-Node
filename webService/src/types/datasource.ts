/**
 * @swagger
 * components:
 *   schemas:
 *     DataSourceCreate:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - host
 *         - port
 *         - username
 *         - password
 *         - database
 *       properties:
 *         name:
 *           type: string
 *           description: 数据源名称
 *         type:
 *           type: string
 *           description: 数据源类型 (mysql, postgresql, etc.)
 *           enum: [mysql, postgresql, sqlserver, oracle]
 *         host:
 *           type: string
 *           description: 主机地址
 *         port:
 *           type: number
 *           description: 端口号
 *         username:
 *           type: string
 *           description: 用户名
 *         password:
 *           type: string
 *           description: 密码
 *         database:
 *           type: string
 *           description: 数据库名
 *         description:
 *           type: string
 *           description: 数据源描述
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 标签列表
 *         active:
 *           type: boolean
 *           default: true
 *           description: 是否激活
 *
 *     DataSourceUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 数据源名称
 *         host:
 *           type: string
 *           description: 主机地址
 *         port:
 *           type: number
 *           description: 端口号
 *         username:
 *           type: string
 *           description: 用户名
 *         password:
 *           type: string
 *           description: 密码
 *         database:
 *           type: string
 *           description: 数据库名
 *         description:
 *           type: string
 *           description: 数据源描述
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 标签列表
 *         active:
 *           type: boolean
 *           description: 是否激活
 *
 *     DataSourceConnection:
 *       type: object
 *       required:
 *         - type
 *         - host
 *         - port
 *         - username
 *         - password
 *         - database
 *       properties:
 *         type:
 *           type: string
 *           description: 数据源类型
 *           enum: [mysql, postgresql, sqlserver, oracle]
 *         host:
 *           type: string
 *           description: 主机地址
 *         port:
 *           type: number
 *           description: 端口号
 *         username:
 *           type: string
 *           description: 用户名
 *         password:
 *           type: string
 *           description: 密码
 *         database:
 *           type: string
 *           description: 数据库名
 *
 *     QueryExecution:
 *       type: object
 *       required:
 *         - dataSourceId
 *         - sql
 *       properties:
 *         dataSourceId:
 *           type: string
 *           description: 数据源ID
 *         sql:
 *           type: string
 *           description: SQL查询语句
 *         params:
 *           type: array
 *           items:
 *             oneOf:
 *               - type: string
 *               - type: number
 *               - type: boolean
 *               - type: null
 *           description: 查询参数 
 *
 *     QuerySave:
 *       type: object
 *       required:
 *         - name
 *         - dataSourceId
 *         - sql
 *       properties:
 *         name:
 *           type: string
 *           description: 查询名称
 *         dataSourceId:
 *           type: string
 *           description: 数据源ID
 *         sql:
 *           type: string
 *           description: SQL查询语句
 *         description:
 *           type: string
 *           description: 查询描述
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 标签列表
 *         isPublic:
 *           type: boolean
 *           default: false
 *           description: 是否公开
 *
 *     QueryUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: 查询名称
 *         sql:
 *           type: string
 *           description: SQL查询语句
 *         description:
 *           type: string
 *           description: 查询描述
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           description: 标签列表
 *         isPublic:
 *           type: boolean
 *           description: 是否公开
 */

// 数据库连接器接口
export interface DatabaseConnector {
  testConnection(): Promise<boolean>;
  executeQuery(sql: string, params?: any[]): Promise<any>;
  getSchemas(): Promise<string[]>;
  getTables(schema?: string): Promise<any[]>;
  getColumns(schema: string, table: string): Promise<any[]>;
  getPrimaryKeys(schema: string, table: string): Promise<any[]>;
  getForeignKeys(schema: string, table: string): Promise<any[]>;
  getIndexes(schema: string, table: string): Promise<any[]>;
  previewTableData(schema: string, table: string, limit?: number): Promise<any>;
  close(): Promise<void>;
}