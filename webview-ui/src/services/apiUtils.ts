/**
 * API 工具函数
 * 用于处理与后端API通信的通用功能
 */

import type { ApiMappingConfig } from '@/types/api-mapping';
import { getApiBaseUrl } from './query';

// 默认API映射配置
const defaultApiMapping: ApiMappingConfig = {
  baseConfig: {
    apiBaseUrl: "/api",
    mockDataEnabled: true, // 默认启用模拟数据
    autoSwitchToMock: true,
    defaultTimeoutMs: 30000
  },
  dataSourceManagement: {
    list: "/datasources",
    detail: "/datasources/{id}",
    create: "/datasources",
    update: "/datasources/{id}",
    delete: "/datasources/{id}",
    test: "/datasources/{id}/test-connection",
    checkStatus: "/datasources/{id}/check-status",
    stats: "/datasources/{id}/stats"
  },
  metadataManagement: {
    sync: "/metadata/datasources/{dataSourceId}/sync",
    tables: "/metadata/datasources/{dataSourceId}/tables",
    table: "/metadata/datasources/{dataSourceId}/tables/{tableName}",
    columns: "/metadata/datasources/{dataSourceId}/tables/{tableName}/columns",
    relationships: "/metadata/datasources/{dataSourceId}/relationships",
    search: "/metadata/datasources/{dataSourceId}/search",
    syncHistory: "/metadata/datasources/{dataSourceId}/sync-history",
    analyzeColumns: "/metadata/datasources/{dataSourceId}/columns/analyze"
  },
  queryManagement: {
    list: "/queries",
    detail: "/queries/{id}",
    create: "/queries",
    update: "/queries/{id}",
    delete: "/queries/{id}",
    execute: "/queries/{id}/execute",
    favorites: "/queries/favorites",
    favorite: "/queries/{id}/favorite",
    unfavorite: "/queries/{id}/favorite",
    nlToSql: "/queries/nl-to-sql",
    history: "/queries/{id}/history",
    executionPlan: "/queries/{id}/execution-plan",
    parameters: "/queries/{id}/parameters"
  },
  versionManagement: {
    list: "/queries/{id}/versions",
    create: "/queries/{id}/versions",
    detail: "/queries/versions/{versionId}",
    update: "/queries/versions/{versionId}",
    publish: "/queries/versions/{versionId}/publish",
    deprecate: "/queries/versions/{versionId}/deprecate",
    activate: "/queries/{queryId}/versions/{versionId}/activate",
    execute: "/queries/{queryId}/versions/{versionId}/execute"
  },
  integrationManagement: {
    list: "/integrations",
    detail: "/integrations/{id}",
    create: "/integrations",
    update: "/integrations/{id}",
    delete: "/integrations/{id}",
    preview: "/integrations/{id}/preview",
    updateStatus: "/integrations/{id}/status",
    executeQuery: "/integration/execute-query",
    apis: "/low-code/apis"
  }
};

// 存储加载的API配置
let ApiMapping: ApiMappingConfig = {
  ...defaultApiMapping,
  baseConfig: {
    ...defaultApiMapping.baseConfig,
    apiBaseUrl: "http://localhost:3200/api",
    mockDataEnabled: false // 强制禁用模拟数据
  }
};

// 异步加载API映射配置
export async function loadApiMapping(): Promise<ApiMappingConfig> {
  try {
    // 使用动态导入代替require
    const mapping = await import('@/config/api-mapping.json');
    console.log('成功从文件加载API配置:', mapping);
    
    // 确保mockDataEnabled为false
    const combinedConfig = {
      ...mapping.default || mapping,
      baseConfig: {
        ...(mapping.default || mapping).baseConfig,
        mockDataEnabled: false // 强制禁用模拟数据
      }
    };
    
    ApiMapping = combinedConfig;
    console.log('合并后的API配置:', ApiMapping);
    return ApiMapping;
  } catch (e) {
    console.warn('未找到API映射配置文件，使用默认配置', e);
    return ApiMapping;
  }
}

// 立即加载配置，但不阻塞其他代码执行
loadApiMapping().catch(e => console.error('加载API映射失败', e));

/**
 * 获取API基础URL
 */
export function getApiUrl(): string {
  const baseUrl = ApiMapping.baseConfig.apiBaseUrl || getApiBaseUrl();
  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

/**
 * 返回数据源管理API路径
 * @param path API路径标识符
 * @param params 路径参数
 * @returns 完整API路径
 */
export function getDataSourceApiUrl(path: keyof ApiMappingConfig['dataSourceManagement'], params?: Record<string, string>): string {
  let urlPath = ApiMapping.dataSourceManagement[path];
  return getFullApiUrl(urlPath, params);
}

/**
 * 返回元数据管理API路径
 * @param path API路径标识符
 * @param params 路径参数
 * @returns 完整API路径
 */
export function getMetadataApiUrl(path: keyof ApiMappingConfig['metadataManagement'], params?: Record<string, string>): string {
  let urlPath = ApiMapping.metadataManagement[path];
  return getFullApiUrl(urlPath, params);
}

/**
 * 返回查询管理API路径
 * @param path API路径标识符
 * @param params 路径参数
 * @returns 完整API路径
 */
export function getQueryApiUrl(path: keyof ApiMappingConfig['queryManagement'], params?: Record<string, string>): string {
  let urlPath = ApiMapping.queryManagement[path];
  return getFullApiUrl(urlPath, params);
}

/**
 * 返回版本管理API路径
 * @param path API路径标识符
 * @param params 路径参数
 * @returns 完整API路径
 */
export function getVersionApiUrl(path: keyof ApiMappingConfig['versionManagement'], params?: Record<string, string>): string {
  let urlPath = ApiMapping.versionManagement[path];
  return getFullApiUrl(urlPath, params);
}

/**
 * 返回集成管理API路径
 * @param path API路径标识符
 * @param params 路径参数
 * @returns 完整API路径
 */
export function getIntegrationApiUrl(path: keyof ApiMappingConfig['integrationManagement'], params?: Record<string, string>): string {
  let urlPath = ApiMapping.integrationManagement[path];
  return getFullApiUrl(urlPath, params);
}

/**
 * 生成完整API URL
 * @param urlPath API路径模板
 * @param params 路径参数
 * @returns 完整API URL
 */
function getFullApiUrl(urlPath: string, params?: Record<string, string>): string {
  // 替换路径中的参数
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      urlPath = urlPath.replace(`{${key}}`, value);
    });
  }
  
  return `${getApiUrl()}${urlPath}`;
}

/**
 * 检查是否启用模拟数据
 * @returns 是否启用模拟数据
 */
export function isMockEnabled(): boolean {
  const enabled = ApiMapping.baseConfig.mockDataEnabled;
  console.log('isMockEnabled调用 - 当前模拟数据状态:', enabled);
  return false; // 强制返回false，禁用模拟数据
}

/**
 * 检查是否自动切换到模拟数据
 * @returns 是否自动切换到模拟数据
 */
export function isAutoSwitchToMockEnabled(): boolean {
  return ApiMapping.baseConfig.autoSwitchToMock;
}

/**
 * 获取API超时时间
 * @returns API超时时间 (ms)
 */
export function getApiTimeout(): number {
  return ApiMapping.baseConfig.defaultTimeoutMs;
}

export default ApiMapping;