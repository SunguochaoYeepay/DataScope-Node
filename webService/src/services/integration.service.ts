import { PrismaClient } from '@prisma/client';
import { QueryService } from './query.service';
import ApiError from '../utils/apiError';
import logger from '../utils/logger';

// 使用类型断言解决Prisma类型问题
const prisma = new PrismaClient() as any;

export class IntegrationService {
  constructor(private queryService: QueryService) {}

  /**
   * 获取所有集成
   */
  async getIntegrations() {
    try {
      return prisma.integration.findMany({
        include: {
          query: {
            select: {
              id: true,
              name: true,
              dataSourceId: true
            }
          }
        }
      });
    } catch (error: any) {
      logger.error('获取集成列表失败', { error });
      throw ApiError.internal(`获取集成列表失败: ${error.message}`);
    }
  }

  /**
   * 获取集成详情
   * @param id 集成ID
   */
  async getIntegrationById(id: string) {
    try {
      const integration = await prisma.integration.findUnique({
        where: { id },
        include: {
          query: {
            select: {
              id: true,
              name: true,
              dataSourceId: true
            }
          }
        }
      });
      
      if (!integration) {
        throw ApiError.notFound(`ID为${id}的集成配置不存在`);
      }
      
      return integration;
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`获取集成详情失败: ${id}`, { error });
      throw ApiError.internal(`获取集成详情失败: ${error.message}`);
    }
  }

  /**
   * 创建集成
   * @param data 集成数据
   */
  async createIntegration(data: any) {
    try {
      // 验证关联的查询是否存在
      const queryExists = await prisma.query.findUnique({
        where: { id: data.queryId }
      });
      
      if (!queryExists) {
        throw ApiError.badRequest(`ID为${data.queryId}的查询不存在`);
      }
      
      return prisma.integration.create({
        data,
        include: {
          query: {
            select: {
              id: true,
              name: true,
              dataSourceId: true
            }
          }
        }
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('创建集成失败', { error, data });
      throw ApiError.internal(`创建集成失败: ${error.message}`);
    }
  }

  /**
   * 更新集成
   * @param id 集成ID
   * @param data 更新数据
   */
  async updateIntegration(id: string, data: any) {
    try {
      // 检查集成是否存在
      const integration = await this.getIntegrationById(id);
      
      // 如果更新了queryId，验证新的查询是否存在
      if (data.queryId && data.queryId !== integration.queryId) {
        const queryExists = await prisma.query.findUnique({
          where: { id: data.queryId }
        });
        
        if (!queryExists) {
          throw ApiError.badRequest(`ID为${data.queryId}的查询不存在`);
        }
      }
      
      return prisma.integration.update({
        where: { id },
        data,
        include: {
          query: {
            select: {
              id: true,
              name: true,
              dataSourceId: true
            }
          }
        }
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`更新集成失败: ${id}`, { error, data });
      throw ApiError.internal(`更新集成失败: ${error.message}`);
    }
  }

  /**
   * 删除集成
   * @param id 集成ID
   */
  async deleteIntegration(id: string) {
    try {
      // 检查集成是否存在
      await this.getIntegrationById(id);
      
      return prisma.integration.delete({
        where: { id }
      });
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`删除集成失败: ${id}`, { error });
      throw ApiError.internal(`删除集成失败: ${error.message}`);
    }
  }

  /**
   * 执行集成查询
   * @param integrationId 集成ID
   * @param params 查询参数
   * @param pagination 分页信息
   * @param sorting 排序信息
   */
  async executeQuery(integrationId: string, params: any, pagination?: any, sorting?: any) {
    try {
      // 1. 获取集成配置
      const integration = await this.getIntegrationById(integrationId);
      
      // 2. 获取关联的查询信息
      const query = await prisma.query.findUnique({
        where: { id: integration.queryId },
        include: {
          dataSource: true
        }
      });
      
      if (!query) {
        throw ApiError.notFound(`ID为${integration.queryId}的查询不存在`);
      }
      
      // 3. 验证参数
      this.validateParams(integration.config as any, params);
      
      // 4. 准备执行SQL
      // 获取SQL内容和数据源ID
      const sqlContent = query.sqlContent;
      const dataSourceId = query.dataSourceId;
      
      // 处理SQL参数
      const sqlParams = this.prepareSqlParams(integration.config as any, params);
      
      // 5. 执行查询
      // 调用现有的查询服务执行查询
      const result = await this.queryService.executeQuery(
        dataSourceId,
        sqlContent,
        sqlParams,
        {
          page: pagination?.page,
          pageSize: pagination?.pageSize,
          sort: sorting?.field,
          order: sorting?.order
        }
      );
      
      // 6. 格式化结果
      return this.formatResult(result, integration.config as any);
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`执行集成查询失败: ${integrationId}`, { 
        error, 
        params, 
        pagination,
        sorting
      });
      throw ApiError.internal(`执行集成查询失败: ${error.message}`);
    }
  }

  /**
   * 获取集成的API配置
   * @param id 集成ID
   */
  async getIntegrationConfig(id: string) {
    try {
      const integration = await this.getIntegrationById(id);
      
      // 构建示例参数对象
      const params: Record<string, any> = {};
      if (integration.config && (integration.config as any).params) {
        for (const param of (integration.config as any).params) {
          params[param.name] = param.defaultValue || '示例值';
        }
      }
      
      // 构建配置响应
      return {
        apiEndpoint: "/api/data-service/query",
        method: "POST",
        requestFormat: {
          integrationId: integration.id,
          params,
          pagination: {
            page: 1,
            pageSize: 10
          }
        },
        responseFormat: this.getExampleResponse(integration.config as any),
        parameterDocs: (integration.config as any).params || []
      };
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`获取集成配置失败: ${id}`, { error });
      throw ApiError.internal(`获取集成配置失败: ${error.message}`);
    }
  }

  /**
   * 测试集成
   * @param id 集成ID
   * @param testParams 测试参数
   */
  async testIntegration(id: string, testParams: any) {
    try {
      const { params, pagination, sorting } = testParams;
      
      // 执行查询
      const result = await this.executeQuery(id, params, pagination, sorting);
      
      // 添加执行时间
      return {
        ...result,
        executionTime: '120ms' // 示例值，实际实现中应从查询结果中获取
      };
    } catch (error: any) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`测试集成失败: ${id}`, { error, testParams });
      throw ApiError.internal(`测试集成失败: ${error.message}`);
    }
  }

  /**
   * 准备SQL参数
   * @param config 集成配置
   * @param params 请求参数
   */
  private prepareSqlParams(config: any, params: any): any[] {
    // 获取参数配置
    const paramConfigs = config.params || [];
    const sqlParams: any[] = [];
    
    // 按照参数配置顺序准备SQL参数
    for (const paramConfig of paramConfigs) {
      let value = params[paramConfig.name];
      
      // 如果参数未提供但有默认值，使用默认值
      if ((value === undefined || value === null) && paramConfig.defaultValue !== undefined) {
        value = paramConfig.defaultValue;
      }
      
      // 进行必要的类型转换
      if (value !== undefined && value !== null) {
        switch (paramConfig.type) {
          case 'number':
            value = Number(value);
            break;
          case 'boolean':
            value = Boolean(value);
            break;
          case 'string':
          default:
            value = String(value);
            break;
        }
      }
      
      sqlParams.push(value);
    }
    
    return sqlParams;
  }

  /**
   * 验证参数
   * @param config 集成配置
   * @param params 请求参数
   */
  private validateParams(config: any, params: any) {
    // 获取参数配置
    const paramConfigs = config.params || [];
    
    // 检查必填参数
    for (const paramConfig of paramConfigs) {
      if (paramConfig.required && (params[paramConfig.name] === undefined || params[paramConfig.name] === null)) {
        throw ApiError.badRequest(`参数${paramConfig.name}为必填项`);
      }
      
      // 简单的类型验证
      if (params[paramConfig.name] !== undefined && params[paramConfig.name] !== null) {
        switch (paramConfig.type) {
          case 'number':
            if (isNaN(Number(params[paramConfig.name]))) {
              throw ApiError.badRequest(`参数${paramConfig.name}必须是数字类型`);
            }
            break;
          case 'boolean':
            if (typeof params[paramConfig.name] !== 'boolean' && 
                params[paramConfig.name] !== 'true' && 
                params[paramConfig.name] !== 'false') {
              throw ApiError.badRequest(`参数${paramConfig.name}必须是布尔类型`);
            }
            break;
        }
      }
    }
  }

  /**
   * 格式化结果
   * @param result 查询结果
   * @param config 集成配置
   */
  private formatResult(result: any, config: any) {
    // 处理可能的空结果
    if (!result || !result.rows) {
      return {
        records: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      };
    }
    
    // 获取原始查询结果
    const { rows, rowCount, fields, totalCount, page, pageSize, totalPages } = result;
    
    // 获取表格配置
    const tableConfig = config.tableConfig || { columns: [] };
    
    // 映射字段
    let records = rows;
    if (tableConfig.columns && tableConfig.columns.length > 0) {
      // 如果定义了列映射，则应用列映射
      records = rows.map((row: any) => {
        const mappedRow: any = {};
        
        for (const column of tableConfig.columns) {
          // 使用dataIndex作为原始字段名，key作为映射后的字段名
          if (column.dataIndex && column.key) {
            // 获取原始值
            const originalValue = row[column.dataIndex];
            
            // 应用格式化器（如果有）
            let formattedValue = originalValue;
            if (column.formatter) {
              try {
                // 注意：实际实现中，这里可能需要一个更安全的方式来执行格式化器
                // 例如使用预定义的格式化函数而不是eval
                const formatFunc = new Function('value', 'row', 'return ' + column.formatter);
                formattedValue = formatFunc(originalValue, row);
              } catch (error) {
                logger.warn('格式化字段值失败', { error, column, value: originalValue });
                formattedValue = originalValue;
              }
            }
            
            // 设置映射后的值
            mappedRow[column.key] = formattedValue;
          }
        }
        
        return mappedRow;
      });
    }
    
    // 构建返回结果
    const formattedResult = {
      records,
      total: totalCount || rowCount || 0,
      page: page || 1,
      pageSize: pageSize || records.length,
      totalPages: totalPages || 1
    };
    
    // 可选：添加元数据
    if (config.includeMetadata) {
      (formattedResult as any).metadata = {
        fields: fields.map((f: any) => ({
          name: f.name,
          type: f.type
        })),
        query: {
          executionTime: result.executionTime
        }
      };
    }
    
    return formattedResult;
  }

  /**
   * 获取示例响应
   * @param config 集成配置
   */
  private getExampleResponse(config: any) {
    const tableConfig = config.tableConfig || { columns: [] };
    const columns = tableConfig.columns || [];
    
    // 构建示例记录
    const exampleRecord: Record<string, any> = {};
    for (const column of columns) {
      if (column.key) {
        // 根据字段名称生成示例值
        let exampleValue: any;
        if (column.key.includes('id') || column.key.includes('Id')) {
          exampleValue = 1;
        } else if (column.key.includes('name') || column.key.includes('Name')) {
          exampleValue = '示例名称';
        } else if (column.key.includes('time') || column.key.includes('Time') || column.key.includes('date') || column.key.includes('Date')) {
          exampleValue = '2023-01-01T00:00:00.000Z';
        } else if (column.key.includes('count') || column.key.includes('Count')) {
          exampleValue = 42;
        } else if (column.key.includes('price') || column.key.includes('Price')) {
          exampleValue = 99.99;
        } else if (column.key.includes('status') || column.key.includes('Status')) {
          exampleValue = '活跃';
        } else {
          exampleValue = '示例值';
        }
        exampleRecord[column.key] = exampleValue;
      }
    }
    
    // 如果没有配置列，则提供默认示例
    if (Object.keys(exampleRecord).length === 0) {
      exampleRecord.id = 1;
      exampleRecord.name = '示例数据';
      exampleRecord.value = '示例值';
    }
    
    // 构建示例响应
    return {
      success: true,
      data: {
        records: [exampleRecord],
        total: 100,
        page: 1,
        pageSize: 10,
        totalPages: 10
      }
    };
  }
}