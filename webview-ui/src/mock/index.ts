/**
 * Mock模块入口文件
 * 
 * 集中导出所有Mock相关功能和配置
 * 为Vue应用和Vite开发服务器提供统一的API模拟功能
 */

// 导入配置
import { mockConfig, isMockEnabled, isModuleEnabled, logMock } from './config';

// 导入服务
import services from './services';

// 导入中间件
import createMockMiddleware from './middleware';

// 导入Vite插件
import createMockPlugin from './vite.config';

// 导入工具函数
import { 
  createMockResponse, 
  createMockErrorResponse,
  createPaginationResponse,
  delay
} from './services/utils';

// 导出服务
export { services };
export * from './services';

// 导出配置
export { mockConfig, isMockEnabled, isModuleEnabled, logMock };

// 导出中间件
export { createMockMiddleware };

// 导出Vite插件
export { createMockPlugin };

// 导出工具函数
export { 
  createMockResponse, 
  createMockErrorResponse,
  createPaginationResponse,
  delay
};

/**
 * 初始化Mock服务
 * 在应用启动时调用此函数可确保Mock服务正确配置
 */
export function setupMockServices(): boolean {
  if (isMockEnabled()) {
    try {
      logMock('info', '初始化Mock服务');
      logMock('debug', '当前环境:', import.meta.env.MODE);
      logMock('debug', '当前配置:', mockConfig);
      
      // 这里可以添加更多初始化逻辑
      
      logMock('info', 'Mock服务初始化完成');
      return true;
    } catch (error) {
      logMock('error', '初始化Mock服务失败:', error);
      return false;
    }
  }
  return false;
}

/**
 * 默认导出
 */
export default {
  setupMockServices,
  services,
  createMockMiddleware,
  createMockPlugin,
  isMockEnabled,
  config: mockConfig
}; 