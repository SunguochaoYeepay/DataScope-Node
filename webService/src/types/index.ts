/**
 * 类型定义导出
 */

export * from './connector';
export * from './database';
export * from './database-factory';
export * from './datasource';
export * from './db-interface';
export * from './metadata';
export * from './query';
export * from './query-plan';
export * from './query-version';
export * from './performance-analysis';

/**
 * 扩展Request类型，添加用户属性
 */
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name?: string;
        roles?: string[];
      };
    }
  }
}