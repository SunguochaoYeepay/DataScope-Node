// 类型映射工具函数
import { ColumnDisplayType, ChartType, ChartTheme } from '@/types/integration';
import type { ChartConfig, TableConfig, QueryParam, ChartDataMapping } from '@/types/integration';

/**
 * 根据字段类型推荐合适的显示类型
 * @param fieldType 字段类型
 * @returns 推荐的显示类型
 */
export function getRecommendedDisplayType(fieldType: string): ColumnDisplayType {
  switch (fieldType.toUpperCase()) {
    case 'NUMBER':
    case 'INTEGER':
    case 'DECIMAL':
    case 'FLOAT':
    case 'DOUBLE':
      return ColumnDisplayType.NUMBER;
    
    case 'DATE':
    case 'DATETIME':
    case 'TIMESTAMP':
      return ColumnDisplayType.DATE;
    
    case 'BOOLEAN':
      return ColumnDisplayType.STATUS;
    
    case 'EMAIL':
    case 'PHONE':
    case 'PASSWORD':
    case 'IDCARD':
      return ColumnDisplayType.SENSITIVE;
    
    case 'URL':
    case 'LINK':
      return ColumnDisplayType.LINK;
    
    case 'IMAGE':
    case 'PHOTO':
    case 'AVATAR':
      return ColumnDisplayType.IMAGE;
    
    case 'TAG':
    case 'CATEGORY':
    case 'LABEL':
      return ColumnDisplayType.TAG;
    
    case 'RATING':
    case 'SCORE':
    case 'GRADE':
      return ColumnDisplayType.BADGE;
    
    // 默认为文本显示
    default:
      return ColumnDisplayType.TEXT;
  }
}

/**
 * 获取字段在表单中的默认显示组件类型
 * @param fieldType 字段类型
 * @param format 数据格式
 * @returns 推荐的表单组件类型
 */
export function getRecommendedFormType(fieldType: string, format?: string): string {
  // 首先检查format
  if (format) {
    switch (format.toLowerCase()) {
      case 'enum':
      case 'select':
        return 'select';
      case 'multiselect':
        return 'multiselect';
      case 'date':
        return 'date';
      case 'datetime':
        return 'datetime';
      case 'checkbox':
        return 'checkbox';
      case 'radio':
        return 'radio';
      case 'textarea':
        return 'textarea';
    }
  }
  
  // 基于字段类型判断
  switch (fieldType.toLowerCase()) {
    case 'number':
    case 'integer':
    case 'decimal':
    case 'float':
    case 'double':
      return 'number';
    
    case 'date':
      return 'date';
    
    case 'datetime':
    case 'timestamp':
      return 'datetime';
    
    case 'boolean':
      return 'checkbox';
    
    case 'text':
    case 'longtext':
    case 'content':
      return 'textarea';
    
    // 默认为普通输入框
    default:
      return 'input';
  }
}

/**
 * 检查并处理图表配置有效性，确保所需必填字段存在
 * @param chartConfig 图表配置
 * @returns 处理后的图表配置
 */
export function validateChartConfig(chartConfig?: Partial<ChartConfig>): ChartConfig {
  if (!chartConfig) {
    return {
      type: ChartType.BAR,
      theme: ChartTheme.DEFAULT,
      showLegend: true,
      animation: true,
      dataMapping: {}
    };
  }
  
  const config = { ...chartConfig } as ChartConfig;
  
  // 确保基本属性存在
  if (!config.type) config.type = ChartType.BAR;
  if (!config.theme) config.theme = ChartTheme.DEFAULT;
  if (config.showLegend === undefined) config.showLegend = true;
  if (config.animation === undefined) config.animation = true;
  if (!config.dataMapping) config.dataMapping = {} as ChartDataMapping;
  
  return config;
}

/**
 * 检查并处理表格配置有效性，确保所需必填字段存在
 * @param tableConfig 表格配置
 * @returns 处理后的表格配置
 */
export function validateTableConfig(tableConfig?: Partial<TableConfig>): TableConfig {
  if (!tableConfig) {
    return {
      columns: [],
      actions: [],
      pagination: {
        enabled: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 50, 100]
      },
      export: {
        enabled: true,
        formats: ['CSV', 'EXCEL'],
        maxRows: 1000
      },
      batchActions: [],
      aggregation: {
        enabled: false,
        groupByFields: [],
        aggregationFunctions: []
      },
      advancedFilters: {
        enabled: true,
        defaultFilters: [],
        savedFilters: []
      }
    };
  }
  
  const config = { ...tableConfig } as TableConfig;
  
  // 确保基本属性存在
  if (!config.columns) config.columns = [];
  if (!config.actions) config.actions = [];
  if (!config.pagination) {
    config.pagination = {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100]
    };
  }
  if (!config.export) {
    config.export = {
      enabled: true,
      formats: ['CSV', 'EXCEL'],
      maxRows: 1000
    };
  }
  if (!config.batchActions) config.batchActions = [];
  if (!config.aggregation) {
    config.aggregation = {
      enabled: false,
      groupByFields: [],
      aggregationFunctions: []
    };
  }
  if (!config.advancedFilters) {
    config.advancedFilters = {
      enabled: true,
      defaultFilters: [],
      savedFilters: []
    };
  }
  
  return config;
}

/**
 * 检查并处理查询参数配置有效性
 * @param queryParams 查询参数配置
 * @returns 处理后的查询参数配置
 */
export function validateQueryParams(queryParams?: Partial<QueryParam>[]): QueryParam[] {
  if (!queryParams || !Array.isArray(queryParams)) {
    return [];
  }
  
  return queryParams.map(param => {
    const validatedParam = { ...param } as QueryParam;
    
    // 确保基本属性存在
    if (!validatedParam.name) validatedParam.name = '';
    if (!validatedParam.type) validatedParam.type = 'string';
    if (!validatedParam.format) validatedParam.format = 'string';
    if (!validatedParam.formType) {
      validatedParam.formType = getRecommendedFormType(validatedParam.type, validatedParam.format);
    }
    if (validatedParam.required === undefined) validatedParam.required = false;
    if (!validatedParam.description) validatedParam.description = validatedParam.name;
    if (validatedParam.displayOrder === undefined) validatedParam.displayOrder = 0;
    
    return validatedParam;
  });
} 