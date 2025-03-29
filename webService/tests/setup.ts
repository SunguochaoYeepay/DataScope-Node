import { config } from 'dotenv';
import { jest } from '@jest/globals';

// 加载环境变量
config({ path: '.env' });

// 确保使用模拟数据模式
process.env.USE_MOCK_DATA = 'true';
process.env.NODE_ENV = 'test';

// 全局变量设置
global.beforeEach(() => {
  jest.clearAllMocks();
});