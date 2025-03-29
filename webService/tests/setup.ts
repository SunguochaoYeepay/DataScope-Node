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

// 模拟express-validator
jest.mock('express-validator', () => {
  const originalModule = jest.requireActual('express-validator');
  
  // 创建一个模拟的validationResult函数
  const mockValidationResult = jest.fn().mockImplementation(() => ({
    isEmpty: jest.fn().mockReturnValue(true),
    array: jest.fn().mockReturnValue([])
  }));

  return {
    ...originalModule,
    validationResult: mockValidationResult,
    body: jest.fn().mockReturnValue(jest.fn()),
    param: jest.fn().mockReturnValue(jest.fn()),
    query: jest.fn().mockReturnValue(jest.fn()),
    // 以下是一些常用的验证器，如需更多可以添加
    isEmail: jest.fn().mockReturnValue(jest.fn()),
    isLength: jest.fn().mockReturnValue(jest.fn()),
    isNumeric: jest.fn().mockReturnValue(jest.fn()),
    isString: jest.fn().mockReturnValue(jest.fn()),
  };
});