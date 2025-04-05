/**
 * 浏览器端Mock服务启动入口
 * 
 * 用于在浏览器端初始化Mock服务
 */

import axios from 'axios';
import { mockConfig } from './config';

let initialized = false;

/**
 * 设置客户端请求拦截器
 */
function setupRequestInterceptor() {
  // 添加请求拦截器
  const interceptorId = axios.interceptors.request.use(
    (config) => {
      // 仅处理API请求
      if (config.url && config.url.startsWith(mockConfig.apiBasePath)) {
        // 添加Mock服务标记头
        config.headers = config.headers || {};
        config.headers['X-Mock-Enabled'] = 'true';
        console.log(`[Mock-Client] 拦截请求: ${config.method?.toUpperCase()} ${config.url}`);
      }
      return config;
    },
    (error) => {
      console.error('[Mock-Client] 请求拦截器错误:', error);
      return Promise.reject(error);
    }
  );
  
  return interceptorId;
}

/**
 * 设置调试工具
 */
function setupDebugTools() {
  if (typeof window !== 'undefined') {
    // 添加全局控制对象
    (window as any)._mockTools = {
      // 获取配置
      getConfig: () => ({ ...mockConfig }),
      
      // 启用Mock服务
      enable: () => {
        localStorage.setItem('USE_MOCK_API', 'true');
        console.log('[Mock-Client] Mock服务已启用，重新加载页面以应用更改');
      },
      
      // 禁用Mock服务
      disable: () => {
        localStorage.setItem('USE_MOCK_API', 'false');
        console.log('[Mock-Client] Mock服务已禁用，重新加载页面以应用更改');
      },
      
      // 发送测试请求
      testApi: (url = '/api/datasources') => {
        console.log(`[Mock-Client] 发送测试请求到 ${url}`);
        return axios.get(url)
          .then(res => {
            console.log('[Mock-Client] 测试请求成功:', res.data);
            return res.data;
          })
          .catch(err => {
            console.error('[Mock-Client] 测试请求失败:', err);
            throw err;
          });
      }
    };
    
    console.log('[Mock-Client] 调试工具已初始化，可通过 window._mockTools 访问');
  }
}

/**
 * 设置Mock服务
 * 在浏览器环境中初始化Mock服务
 */
export function setupMockService() {
  // 防止重复初始化
  if (initialized) {
    console.warn('[Mock-Client] Mock服务已初始化，跳过');
    return;
  }
  
  // 检查是否启用
  if (!mockConfig.enabled) {
    console.log('[Mock-Client] Mock服务已禁用，跳过初始化');
    return;
  }
  
  // 标记为已初始化
  initialized = true;
  
  try {
    // 设置客户端拦截器
    setupRequestInterceptor();
    
    // 添加调试工具
    setupDebugTools();
    
    console.log('[Mock-Client] Mock服务初始化完成');
  } catch (error) {
    console.error('[Mock-Client] Mock服务初始化失败:', error);
  }
}

// 导出配置以便外部访问
export { mockConfig }; 