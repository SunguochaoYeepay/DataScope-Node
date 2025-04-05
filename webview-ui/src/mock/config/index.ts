/**
 * Mock服务统一配置
 * 集中管理Mock相关的配置项，避免分散在多个文件中
 */

// 从环境变量中读取Mock开关
const ENV_USE_MOCK = import.meta.env.VITE_USE_MOCK_API === 'true';

/**
 * Mock服务配置
 */
export interface MockConfig {
  /** 是否启用Mock服务 */
  enabled: boolean;
  /** 模拟延迟，单位毫秒 */
  delay?: number;
  /** 是否在控制台输出Mock请求日志 */
  logging?: boolean;
  /** 是否返回Mock数据中的错误 */
  returnError?: boolean;
}

// 默认配置
const defaultConfig: MockConfig = {
  enabled: ENV_USE_MOCK,
  delay: 300,
  logging: true,
  returnError: false,
};

// 当前运行时配置
let runtimeConfig: MockConfig = { ...defaultConfig };

/**
 * 获取当前Mock配置
 */
export function getMockConfig(): MockConfig {
  return { ...runtimeConfig };
}

/**
 * 更新Mock配置
 * @param config 需要更新的配置
 */
export function updateMockConfig(config: Partial<MockConfig>): void {
  runtimeConfig = { ...runtimeConfig, ...config };
  
  // 兼容旧代码 - 同步更新全局变量
  if (window) {
    (window as any).USE_MOCK = runtimeConfig.enabled;
  }
  
  console.log(`[Mock] 配置已更新: 状态=${runtimeConfig.enabled ? '已启用' : '已禁用'}`);
}

/**
 * 启用Mock服务
 */
export function enableMock(): void {
  updateMockConfig({ enabled: true });
}

/**
 * 禁用Mock服务
 */
export function disableMock(): void {
  updateMockConfig({ enabled: false });
}

/**
 * 检查Mock服务是否启用
 */
export function isMockEnabled(): boolean {
  return runtimeConfig.enabled;
}

/**
 * 模拟延迟函数
 * @returns Promise，在配置的延迟时间后resolve
 */
export function simulateDelay(): Promise<void> {
  const delay = runtimeConfig.delay || 0;
  return new Promise(resolve => setTimeout(resolve, delay));
}

// 导出配置对象
export const mockConfig = runtimeConfig;

// 默认导出当前配置
export default runtimeConfig; 