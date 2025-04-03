/**
 * 系统集成API模型定义
 * 这些类型与后端API接口的数据结构保持一致
 */

import { QueryParam } from '../integration';

/**
 * 集成配置接口
 * 与后端的Integration模型对应
 */
export interface IntegrationConfig {
  id: string;
  name: string;
  description?: string;
  queryId: string;
  type: 'FORM' | 'TABLE' | 'CHART';
  config: {
    params?: QueryParam[];
    tableConfig?: {
      columns: Array<{
        key: string;
        dataIndex: string;
        title: string;
        formatter?: string;
      }>;
    };
    formConfig?: {
      fields: Array<{
        name: string;
        label: string;
        type: string;
        required: boolean;
      }>;
    };
    chartConfig?: {
      type: string;
      options: Record<string, any>;
    };
    includeMetadata?: boolean;
  };
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
  query?: {
    id: string;
    name: string;
    dataSourceId: string;
  };
}

/**
 * API配置接口
 * 表示一个集成API的配置信息
 */
export interface ApiConfig {
  apiEndpoint: string;
  method: string;
  requestFormat: {
    integrationId: string;
    params: Record<string, any>;
    pagination?: {
      page: number;
      pageSize: number;
    };
    sorting?: {
      field: string;
      order: 'asc' | 'desc';
    };
  };
  responseFormat: {
    success: boolean;
    data: {
      records: any[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      [key: string]: any;
    };
  };
  parameterDocs: Array<{
    name: string;
    description: string;
    type: string;
    required: boolean;
    defaultValue?: any;
  }>;
}

/**
 * 查询执行请求接口
 */
export interface ExecuteQueryRequest {
  integrationId: string;
  params: Record<string, any>;
  pagination?: {
    page: number;
    pageSize: number;
  };
  sorting?: {
    field: string;
    order: 'asc' | 'desc';
  };
}

/**
 * 查询执行结果接口
 */
export interface ExecuteQueryResult {
  records: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  executionTime?: string;
  [key: string]: any;
}

/**
 * 测试集成参数接口
 */
export interface TestIntegrationParams {
  params: Record<string, any>;
  pagination?: {
    page: number;
    pageSize: number;
  };
  sorting?: {
    field: string;
    order: 'asc' | 'desc';
  };
} 