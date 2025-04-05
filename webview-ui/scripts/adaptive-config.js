#!/usr/bin/env node

/**
 * 配置适配脚本
 * 创建一个配置文件用于存储后端API规范与前端的映射关系
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置文件路径
const configPath = path.join(__dirname, '..', 'src', 'config', 'api-mapping.json');
const configDir = path.dirname(configPath);

// 确保目录存在
if (!fs.existsSync(configDir)) {
  fs.mkdirSync(configDir, { recursive: true });
  console.log(`创建目录: ${configDir}`);
}

// API映射配置
const apiMapping = {
  // 基础配置
  baseConfig: {
    apiBaseUrl: "http://localhost:3200/api",
    mockDataEnabled: false,
    autoSwitchToMock: true,
    defaultTimeoutMs: 30000
  },
  
  // 数据源管理API映射
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
  
  // 元数据管理API映射
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
  
  // 查询管理API映射
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
  
  // 版本管理API映射
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
  
  // 集成管理API映射
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

// 写入配置文件
fs.writeFileSync(configPath, JSON.stringify(apiMapping, null, 2));
console.log(`API映射配置已保存到: ${configPath}`);

// 创建类型定义文件
const typesPath = path.join(__dirname, '..', 'src', 'types', 'api-mapping.d.ts');
const typesDir = path.dirname(typesPath);

// 确保目录存在
if (!fs.existsSync(typesDir)) {
  fs.mkdirSync(typesDir, { recursive: true });
  console.log(`创建目录: ${typesDir}`);
}

// 生成类型定义
const typesContent = `/**
 * API映射类型定义
 * 自动生成，请勿手动修改
 */

export interface ApiMappingConfig {
  baseConfig: {
    apiBaseUrl: string;
    mockDataEnabled: boolean;
    autoSwitchToMock: boolean;
    defaultTimeoutMs: number;
  };
  
  dataSourceManagement: {
    list: string;
    detail: string;
    create: string;
    update: string;
    delete: string;
    test: string;
    checkStatus: string;
    stats: string;
  };
  
  metadataManagement: {
    sync: string;
    tables: string;
    table: string;
    columns: string;
    relationships: string;
    search: string;
    syncHistory: string;
    analyzeColumns: string;
  };
  
  queryManagement: {
    list: string;
    detail: string;
    create: string;
    update: string;
    delete: string;
    execute: string;
    favorites: string;
    favorite: string;
    unfavorite: string;
    nlToSql: string;
    history: string;
    executionPlan: string;
    parameters: string;
  };
  
  versionManagement: {
    list: string;
    create: string;
    detail: string;
    update: string;
    publish: string;
    deprecate: string;
    activate: string;
    execute: string;
  };
  
  integrationManagement: {
    list: string;
    detail: string;
    create: string;
    update: string;
    delete: string;
    preview: string;
    updateStatus: string;
    executeQuery: string;
    apis: string;
  };
}

declare const ApiMapping: ApiMappingConfig;
export default ApiMapping;
`;

fs.writeFileSync(typesPath, typesContent);
console.log(`API映射类型定义已保存到: ${typesPath}`);

console.log('API配置适配完成！');