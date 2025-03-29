import { jest, describe, beforeEach, it, expect } from '@jest/globals';
import config from '../../../src/config';

describe('应用配置', () => {
  describe('基本配置验证', () => {
    it('config对象应当存在', () => {
      expect(config).toBeDefined();
    });
    
    it('config对象应包含基本属性', () => {
      expect(config).toHaveProperty('server');
      expect(config).toHaveProperty('database');
      expect(config).toHaveProperty('logging');
      expect(config).toHaveProperty('api');
      expect(config).toHaveProperty('development');
    });
    
    it('开发模式配置应该正确设置', () => {
      expect(config.development).toBeDefined();
      // 验证开发环境配置具有mockDataPath属性
      expect(config.development).toHaveProperty('mockDataPath');
    });
    
    it('不应该包含useMockData配置', () => {
      // 检查配置中不应该包含useMockData属性
      expect(config.development).not.toHaveProperty('useMockData');
      
      // 检查其他可能包含mock数据相关配置的地方
      const configAsAny = config as any;
      for (const key in configAsAny) {
        const section = configAsAny[key];
        if (typeof section === 'object' && section !== null) {
          expect(section).not.toHaveProperty('useMockData');
          expect(section).not.toHaveProperty('use_mock_data');
          expect(section).not.toHaveProperty('mockData');
          expect(section).not.toHaveProperty('mock_data');
        }
      }
    });
    
    it('服务器配置应该正确设置', () => {
      expect(config.server).toBeDefined();
      expect(config.server).toHaveProperty('port');
      expect(typeof config.server.port).not.toBe(undefined);
      expect(config.server).toHaveProperty('host');
      expect(config.server).toHaveProperty('nodeEnv');
    });
    
    it('API配置应该正确设置', () => {
      expect(config.api).toBeDefined();
      expect(config.api).toHaveProperty('prefix');
      expect(config.api).toHaveProperty('rateLimit');
      expect(config.api.rateLimit).toHaveProperty('windowMs');
      expect(config.api.rateLimit).toHaveProperty('max');
    });
  });
  
  describe('数据库配置测试', () => {
    it('数据库配置应该存在', () => {
      expect(config).toHaveProperty('database');
      expect(config.database).toBeDefined();
    });
    
    it('数据库配置应该包含必要属性', () => {
      const db = config.database;
      expect(db).toHaveProperty('url');
      expect(typeof db.url).toBe('string');
      expect(db).toHaveProperty('maxConnections');
      expect(typeof db.maxConnections).toBe('number');
      expect(db).toHaveProperty('ssl');
      expect(typeof db.ssl).toBe('boolean');
    });
  });
});