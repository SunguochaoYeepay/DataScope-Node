// API数据转换工具
import type { Integration, ChartConfig, TableConfig } from '@/types/integration';
import { ChartType, ChartTheme, ColumnDisplayType, ColumnAlign } from '@/types/integration';
import { validateTableConfig, validateChartConfig, validateQueryParams } from './typeMapping';

/**
 * 转换API返回的集成数据为前端使用的类型
 * @param apiIntegration API返回的集成数据
 * @returns 转换后的前端集成数据
 */
export function transformApiIntegrationToFrontend(apiIntegration: any): Integration {
  const integration = { ...apiIntegration } as Integration;
  
  // 处理查询参数
  if (integration.queryParams) {
    integration.queryParams = validateQueryParams(integration.queryParams);
  } else {
    integration.queryParams = [];
  }
  
  // 处理表格配置
  if (integration.tableConfig) {
    // 转换列配置
    if (integration.tableConfig.columns) {
      integration.tableConfig.columns = integration.tableConfig.columns.map((column: any) => {
        // 处理列的displayType
        if (typeof column.displayType === 'string') {
          try {
            column.displayType = column.displayType as ColumnDisplayType;
          } catch (e) {
            column.displayType = ColumnDisplayType.TEXT;
          }
        }
        
        // 处理列的align
        if (typeof column.align === 'string') {
          try {
            column.align = column.align as ColumnAlign;
          } catch (e) {
            column.align = ColumnAlign.LEFT;
          }
        }
        
        return column;
      });
    }
    
    // 验证并补充缺失字段
    integration.tableConfig = validateTableConfig(integration.tableConfig);
  }
  
  // 处理图表配置
  if (integration.chartConfig) {
    // 处理图表类型
    if (typeof integration.chartConfig.type === 'string') {
      try {
        const typeStr = integration.chartConfig.type.toUpperCase();
        integration.chartConfig.type = ChartType[typeStr as keyof typeof ChartType] || ChartType.BAR;
      } catch (e) {
        integration.chartConfig.type = ChartType.BAR;
      }
    }
    
    // 处理主题
    if (typeof integration.chartConfig.theme === 'string') {
      try {
        const themeStr = integration.chartConfig.theme.toUpperCase();
        integration.chartConfig.theme = ChartTheme[themeStr as keyof typeof ChartTheme] || ChartTheme.DEFAULT;
      } catch (e) {
        integration.chartConfig.theme = ChartTheme.DEFAULT;
      }
    }
    
    // 验证并补充缺失字段
    integration.chartConfig = validateChartConfig(integration.chartConfig as Partial<ChartConfig>);
  }
  
  return integration;
}

/**
 * 转换前端集成数据为API提交格式
 * @param frontendIntegration 前端集成数据
 * @returns 转换后的API集成数据
 */
export function transformFrontendIntegrationToApi(frontendIntegration: Integration): any {
  const apiIntegration = { ...frontendIntegration };
  
  // 处理枚举值，确保后端能识别
  if (apiIntegration.chartConfig) {
    // 确保ChartType枚举值转为字符串
    if (apiIntegration.chartConfig.type) {
      apiIntegration.chartConfig.type = apiIntegration.chartConfig.type.toString();
    }
    
    // 确保ChartTheme枚举值转为字符串
    if (apiIntegration.chartConfig.theme) {
      apiIntegration.chartConfig.theme = apiIntegration.chartConfig.theme.toString();
    }
  }
  
  // 处理表格配置中的枚举
  if (apiIntegration.tableConfig && apiIntegration.tableConfig.columns) {
    apiIntegration.tableConfig.columns = apiIntegration.tableConfig.columns.map(column => {
      const apiColumn = { ...column };
      
      // 转换displayType枚举为字符串
      if (apiColumn.displayType) {
        apiColumn.displayType = apiColumn.displayType.toString();
      }
      
      // 转换align枚举为字符串
      if (apiColumn.align) {
        apiColumn.align = apiColumn.align.toString();
      }
      
      return apiColumn;
    });
  }
  
  return apiIntegration;
} 