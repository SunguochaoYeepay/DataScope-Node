/**
 * 拦截器模块索引文件
 * 
 * 提供统一的请求拦截器入口点
 */

import fetchInterceptor from './fetch';

/**
 * 初始化所有拦截器
 */
export function setupInterceptors() {
  // 设置fetch拦截器
  fetchInterceptor.setupFetchInterceptor();
}

/**
 * 移除所有拦截器
 */
export function removeInterceptors() {
  // 移除fetch拦截器
  fetchInterceptor.removeFetchInterceptor();
}

// 导出各拦截器模块
export { fetchInterceptor };

// 默认导出
export default {
  setupInterceptors,
  removeInterceptors,
  fetch: fetchInterceptor
}; 