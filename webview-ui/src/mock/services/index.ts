/**
 * Mock服务集中导出
 * 
 * 提供统一的API Mock服务入口点
 */

// 导入数据源服务
import dataSource from './datasource';

// 导入工具函数
import { 
  createMockResponse, 
  createMockErrorResponse, 
  createPaginationResponse,
  delay 
} from './utils';

/**
 * 查询服务Mock
 */
const query = {
  /**
   * 获取查询列表
   */
  async getQueries(params: { page: number; size: number; }) {
    await delay();
    return createPaginationResponse({
      items: [
        { id: 'q1', name: '用户分析查询', description: '按地区统计用户注册数据', createdAt: new Date().toISOString() },
        { id: 'q2', name: '销售业绩查询', description: '按月统计销售额', createdAt: new Date().toISOString() },
        { id: 'q3', name: '库存分析', description: '监控库存水平', createdAt: new Date().toISOString() },
      ],
      total: 3,
      page: params.page,
      size: params.size
    });
  },

  /**
   * 获取单个查询
   */
  async getQuery(id: string) {
    await delay();
    return {
      id,
      name: '示例查询',
      description: '这是一个示例查询',
      sql: 'SELECT * FROM users WHERE status = $1',
      parameters: ['active'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * 创建查询
   */
  async createQuery(data: any) {
    await delay();
    return {
      id: `query-${Date.now()}`,
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * 更新查询
   */
  async updateQuery(id: string, data: any) {
    await delay();
    return {
      id,
      ...data,
      updatedAt: new Date().toISOString()
    };
  },

  /**
   * 删除查询
   */
  async deleteQuery(id: string) {
    await delay();
    return { success: true };
  },

  /**
   * 执行查询
   */
  async executeQuery(id: string, params: any) {
    await delay();
    return {
      columns: ['id', 'name', 'email', 'status'],
      rows: [
        { id: 1, name: '张三', email: 'zhang@example.com', status: 'active' },
        { id: 2, name: '李四', email: 'li@example.com', status: 'active' },
        { id: 3, name: '王五', email: 'wang@example.com', status: 'inactive' },
      ],
      metadata: {
        executionTime: 0.235,
        rowCount: 3,
        totalPages: 1
      }
    };
  }
};

/**
 * 导出所有服务
 */
const services = {
  dataSource,
  query
};

// 导出mock service工具
export {
  createMockResponse,
  createMockErrorResponse,
  createPaginationResponse,
  delay
};

// 导出各个服务
export const dataSourceService = services.dataSource;
export const queryService = services.query;

// 默认导出所有服务
export default services; 