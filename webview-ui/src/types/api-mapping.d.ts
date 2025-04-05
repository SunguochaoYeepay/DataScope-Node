/**
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
