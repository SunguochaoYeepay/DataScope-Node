/**
 * Mock数据集中导出
 * 
 * 提供统一的模拟数据入口点
 */

import { mockDataSources } from './datasource';
import { mockIntegrations } from './integration';

// 导出所有模拟数据
export {
  mockDataSources,
  mockIntegrations
};

export default {
  dataSources: mockDataSources,
  integrations: mockIntegrations
};
