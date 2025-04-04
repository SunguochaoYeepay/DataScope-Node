import mysql from 'mysql2/promise';
import logger from './logger';

/**
 * 数据库连接工具
 */
const connection = {
  /**
   * 根据连接器获取数据库连接池
   * @param connector 数据源连接器
   * @returns 连接池接口
   */
  getPool: (connector: any) => {
    // 简单实现，实际应该根据connector创建合适的连接池
    return {
      query: async (sql: string, params: any[] = []) => {
        try {
          // 获取数据库连接信息
          // 适配不同连接器对象可能使用的不同字段名
          const { host, port, password } = connector;
          
          // 处理用户名字段，兼容username和user两种字段名
          const username = connector.username || connector.user || '';
          
          // 记录所有连接器字段，帮助调试
          logger.debug('连接器对象字段', { 
            fields: Object.keys(connector).join(', '),
            hasUsername: 'username' in connector,
            hasUser: 'user' in connector,
            usernameValue: connector.username,
            userValue: connector.user
          });
          
          if (!username) {
            logger.warn('数据库用户名为空，这可能导致连接失败', { 
              connectorFields: Object.keys(connector).join(', ') 
            });
          }
          
          // 处理数据库名字段，兼容databaseName和database两种字段名
          const databaseName = connector.databaseName || connector.database || '';
          if (!databaseName) {
            logger.warn('数据库名为空，这可能导致连接失败', {
              hasDatabaseName: 'databaseName' in connector,
              hasDatabase: 'database' in connector
            });
          }
          
          // 记录详细的连接信息（不包括密码）
          logger.info('创建数据库连接', {
            host,
            port,
            user: username,
            database: databaseName,
            hasPassword: !!password
          });
          
          // 创建连接池
          const pool = mysql.createPool({
            host,
            port,
            user: username, // 使用处理后的用户名
            password,
            database: databaseName // 使用处理后的数据库名
          });
          
          // 执行查询
          logger.debug(`执行SQL: ${sql.substring(0, 100)}${sql.length > 100 ? '...' : ''}`);
          const [rows] = await pool.query(sql, params);
          
          // 关闭连接
          await pool.end();
          
          return rows;
        } catch (error: any) {
          // 记录详细的错误信息
          logger.error('数据库查询失败', { 
            error, 
            errorCode: error.code,
            errorMessage: error.message,
            sqlState: error.sqlState,
            host: connector.host,
            user: connector.username || connector.user,
            database: connector.databaseName || connector.database,
            connectorFields: Object.keys(connector)
          });
          throw error;
        }
      }
    };
  }
};

export default connection; 