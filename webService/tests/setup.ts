import { config } from 'dotenv';
import { jest } from '@jest/globals';

// 加载环境变量
config({ path: '.env' });

// 设置测试环境
process.env.NODE_ENV = 'test';

// 全局变量设置
global.beforeEach(() => {
  jest.clearAllMocks();
});