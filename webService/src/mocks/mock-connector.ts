/**
 * 模拟数据库连接器
 * 用于开发和测试环境，不需要真实的数据库连接
 */

import { DatabaseConnector } from '../types/connector';
import { QueryPlan } from '../types/query-plan';
import { getMockQueryResult } from './query.mock';
import { getMockQueryPlanBySql } from './query-plan.mock';
import logger from '../utils/logger';

export class MockConnector implements DatabaseConnector {
  private database: string;
  private dataSourceId: string;
  private type: string;
  public isJsonExplainSupported: boolean;

  constructor(config: {
    host: string;
    port: number;
    username: string;
    password: string;
    database?: string;
    type: string;
    dataSourceId: string;
    options?: any;
  }) {
    this.database = config.database || 'mock_db';
    this.dataSourceId = config.dataSourceId;
    this.type = config.type;
    // 模拟MySQL 8.0+版本支持JSON格式EXPLAIN
    this.isJsonExplainSupported = this.type.toLowerCase() === 'mysql';
    
    logger.info('已创建模拟数据库连接器', { 
      dataSourceId: this.dataSourceId,
      type: this.type,
      database: this.database
    });
  }

  /**
   * 测试数据库连接
   */
  async testConnection(): Promise<{ success: boolean; message: string }> {
    // 始终返回成功
    return {
      success: true,
      message: '模拟连接测试成功'
    };
  }

  /**
   * 获取数据库列表
   */
  async getDatabases(): Promise<string[]> {
    return [
      this.database,
      'information_schema',
      'test_db',
      'sample_data'
    ];
  }

  /**
   * 获取数据库模式列表
   */
  async getSchemas(): Promise<string[]> {
    return [
      'public',
      'test_schema',
      'information_schema'
    ];
  }

  /**
   * 获取指定表的主键信息
   */
  async getPrimaryKeys(database: string, table: string): Promise<Array<string>> {
    if (table === 'users' || table === 'orders' || table === 'products') {
      return ['id'];
    }
    
    if (table === 'order_items') {
      return ['order_id', 'product_id'];
    }
    
    // 默认返回id作为主键
    return ['id'];
  }

  /**
   * 获取指定表的外键信息
   */
  async getForeignKeys(database: string, table: string): Promise<Array<{
    column: string;
    referencedTable: string;
    referencedColumn: string;
  }>> {
    if (table === 'orders') {
      return [
        {
          column: 'user_id',
          referencedTable: 'users',
          referencedColumn: 'id'
        }
      ];
    }
    
    if (table === 'order_items') {
      return [
        {
          column: 'order_id',
          referencedTable: 'orders',
          referencedColumn: 'id'
        },
        {
          column: 'product_id',
          referencedTable: 'products',
          referencedColumn: 'id'
        }
      ];
    }
    
    if (table === 'products') {
      return [
        {
          column: 'category_id',
          referencedTable: 'categories',
          referencedColumn: 'id'
        }
      ];
    }
    
    // 默认返回空数组
    return [];
  }

  /**
   * 获取指定表的表格数据预览
   */
  async previewTableData(database: string, table: string, limit: number = 10): Promise<{
    columns: string[];
    rows: any[];
    rowCount: number;
  }> {
    // 基于表名生成模拟数据
    if (table === 'users') {
      return {
        columns: ['id', 'name', 'email', 'status', 'created_at'],
        rows: Array(limit).fill(0).map((_, i) => ({
          id: i + 1,
          name: `用户${i + 1}`,
          email: `user${i + 1}@example.com`,
          status: ['active', 'inactive'][Math.floor(Math.random() * 2)],
          created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
        })),
        rowCount: limit
      };
    }
    
    if (table === 'orders') {
      return {
        columns: ['id', 'user_id', 'status', 'total_amount', 'created_at'],
        rows: Array(limit).fill(0).map((_, i) => ({
          id: i + 1,
          user_id: Math.floor(Math.random() * 10) + 1,
          status: ['pending', 'shipped', 'delivered'][Math.floor(Math.random() * 3)],
          total_amount: (Math.random() * 1000).toFixed(2),
          created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
        })),
        rowCount: limit
      };
    }
    
    // 默认返回通用模拟数据
    return {
      columns: ['id', 'name', 'description', 'created_at'],
      rows: Array(limit).fill(0).map((_, i) => ({
        id: i + 1,
        name: `项目${i + 1}`,
        description: `这是项目${i + 1}的描述`,
        created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
      })),
      rowCount: limit
    };
  }

  /**
   * 获取指定表的列信息
   */
  async getColumns(database: string, table: string): Promise<Array<{
    name: string;
    type: string;
    nullable: boolean;
    defaultValue?: string;
    isPrimary: boolean;
    isUnique: boolean;
    comment?: string;
  }>> {
    // 为users表返回一个固定的列结构
    if (table === 'users') {
      return [
        {
          name: 'id',
          type: 'INT',
          nullable: false,
          defaultValue: undefined,
          isPrimary: true,
          isUnique: true,
          comment: '用户ID'
        },
        {
          name: 'name',
          type: 'VARCHAR(100)',
          nullable: false,
          defaultValue: undefined,
          isPrimary: false,
          isUnique: false,
          comment: '用户名'
        },
        {
          name: 'email',
          type: 'VARCHAR(255)',
          nullable: false,
          defaultValue: undefined,
          isPrimary: false,
          isUnique: true,
          comment: '电子邮箱'
        },
        {
          name: 'password',
          type: 'VARCHAR(255)',
          nullable: false,
          defaultValue: undefined,
          isPrimary: false,
          isUnique: false,
          comment: '密码哈希'
        },
        {
          name: 'status',
          type: 'ENUM("active","inactive","suspended")',
          nullable: false,
          defaultValue: 'active',
          isPrimary: false,
          isUnique: false,
          comment: '用户状态'
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          nullable: false,
          defaultValue: 'CURRENT_TIMESTAMP',
          isPrimary: false,
          isUnique: false,
          comment: '创建时间'
        },
        {
          name: 'updated_at',
          type: 'TIMESTAMP',
          nullable: false,
          defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          isPrimary: false,
          isUnique: false,
          comment: '更新时间'
        },
        {
          name: 'last_login_at',
          type: 'TIMESTAMP',
          nullable: true,
          defaultValue: undefined,
          isPrimary: false,
          isUnique: false,
          comment: '最后登录时间'
        }
      ];
    }
    
    // 为orders表返回一个固定的列结构
    if (table === 'orders') {
      return [
        {
          name: 'id',
          type: 'INT',
          nullable: false,
          defaultValue: undefined,
          isPrimary: true,
          isUnique: true,
          comment: '订单ID'
        },
        {
          name: 'user_id',
          type: 'INT',
          nullable: false,
          defaultValue: undefined,
          isPrimary: false,
          isUnique: false,
          comment: '用户ID'
        },
        {
          name: 'status',
          type: 'ENUM("pending","processing","shipped","delivered","cancelled")',
          nullable: false,
          defaultValue: 'pending',
          isPrimary: false,
          isUnique: false,
          comment: '订单状态'
        },
        {
          name: 'total_amount',
          type: 'DECIMAL(10,2)',
          nullable: false,
          defaultValue: '0.00',
          isPrimary: false,
          isUnique: false,
          comment: '订单总金额'
        },
        {
          name: 'created_at',
          type: 'TIMESTAMP',
          nullable: false,
          defaultValue: 'CURRENT_TIMESTAMP',
          isPrimary: false,
          isUnique: false,
          comment: '创建时间'
        },
        {
          name: 'updated_at',
          type: 'TIMESTAMP',
          nullable: false,
          defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          isPrimary: false,
          isUnique: false,
          comment: '更新时间'
        }
      ];
    }
    
    // 其他表返回一个通用的列结构
    return [
      {
        name: 'id',
        type: 'INT',
        nullable: false,
        defaultValue: undefined,
        isPrimary: true,
        isUnique: true,
        comment: '主键ID'
      },
      {
        name: 'name',
        type: 'VARCHAR(255)',
        nullable: false,
        defaultValue: undefined,
        isPrimary: false,
        isUnique: false,
        comment: '名称'
      },
      {
        name: 'description',
        type: 'TEXT',
        nullable: true,
        defaultValue: undefined,
        isPrimary: false,
        isUnique: false,
        comment: '描述'
      },
      {
        name: 'created_at',
        type: 'TIMESTAMP',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP',
        isPrimary: false,
        isUnique: false,
        comment: '创建时间'
      },
      {
        name: 'updated_at',
        type: 'TIMESTAMP',
        nullable: false,
        defaultValue: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        isPrimary: false,
        isUnique: false,
        comment: '更新时间'
      }
    ];
  }

  /**
   * 获取指定表的索引信息
   */
  async getIndexes(database: string, table: string): Promise<Array<{
    name: string;
    columns: string[];
    unique: boolean;
    type: string;
  }>> {
    if (table === 'users') {
      return [
        {
          name: 'PRIMARY',
          columns: ['id'],
          unique: true,
          type: 'BTREE'
        },
        {
          name: 'idx_email',
          columns: ['email'],
          unique: true,
          type: 'BTREE'
        },
        {
          name: 'idx_status',
          columns: ['status'],
          unique: false,
          type: 'BTREE'
        },
        {
          name: 'idx_created_at',
          columns: ['created_at'],
          unique: false,
          type: 'BTREE'
        }
      ];
    }
    
    if (table === 'orders') {
      return [
        {
          name: 'PRIMARY',
          columns: ['id'],
          unique: true,
          type: 'BTREE'
        },
        {
          name: 'idx_user_id',
          columns: ['user_id'],
          unique: false,
          type: 'BTREE'
        },
        {
          name: 'idx_status',
          columns: ['status'],
          unique: false,
          type: 'BTREE'
        },
        {
          name: 'idx_created_at',
          columns: ['created_at'],
          unique: false,
          type: 'BTREE'
        }
      ];
    }
    
    // 默认返回一个基本的主键索引
    return [
      {
        name: 'PRIMARY',
        columns: ['id'],
        unique: true,
        type: 'BTREE'
      }
    ];
  }

  /**
   * 获取指定数据库的表列表
   */
  async getTables(database: string): Promise<string[]> {
    if (database === 'information_schema') {
      return [
        'TABLES',
        'COLUMNS',
        'STATISTICS',
        'USER_PRIVILEGES',
        'SCHEMA_PRIVILEGES',
        'TABLE_PRIVILEGES'
      ];
    }
    
    return [
      'users',
      'orders',
      'products',
      'categories',
      'customers',
      'order_items',
      'inventory',
      'sales',
      'user_activities'
    ];
  }

  /**
   * 执行SQL查询
   */
  async executeQuery(
    sql: string,
    params: any[] = [],
    queryId?: string,
    options?: any
  ): Promise<{
    columns: string[];
    rows: any[];
    rowCount: number;
    executionTime: number;
  }> {
    try {
      // 使用模拟数据模块获取适当的查询结果
      const result = getMockQueryResult(sql, options);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
      
      return result;
    } catch (error) {
      logger.error('模拟查询执行失败', { error, sql });
      throw error;
    }
  }

  /**
   * 获取SQL查询执行计划
   */
  async explainQuery(sql: string): Promise<QueryPlan> {
    try {
      // 使用模拟数据模块获取适当的查询计划
      const queryPlan = getMockQueryPlanBySql(sql);
      
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
      
      return queryPlan;
    } catch (error) {
      logger.error('获取模拟查询计划失败', { error, sql });
      throw error;
    }
  }

  /**
   * 查询计划转换为标准格式
   * 这是一个适配方法，与getQueryPlan有区别
   */
  async getQueryPlan(sql: string): Promise<QueryPlan> {
    return this.explainQuery(sql);
  }

  /**
   * 取消查询
   */
  async cancelQuery(queryId: string): Promise<boolean> {
    // 模拟查询取消成功
    logger.info('模拟取消查询', { queryId });
    return true;
  }

  /**
   * 关闭数据库连接
   */
  async closeConnection(): Promise<void> {
    // 模拟连接关闭
    logger.info('模拟数据库连接已关闭', {
      dataSourceId: this.dataSourceId,
      database: this.database
    });
  }

  /**
   * 关闭连接的别名方法
   */
  async close(): Promise<void> {
    return this.closeConnection();
  }
}