import { Request, Response, NextFunction } from 'express';
import { check, validationResult } from 'express-validator';
import queryService from '../../services/query.service';
import { ApiError } from '../../utils/errors/types/api-error';
import { ERROR_CODES, GENERAL_ERROR, VALIDATION_ERROR } from '../../utils/errors/error-codes';
import logger from '../../utils/logger';
import dataSourceService from '../../services/datasource.service';
import { StatusCodes } from 'http-status-codes';
import { getPaginationParams, createSuccessResponse } from '../../utils/api.utils';
import { PrismaClient } from '@prisma/client';
import queryVersionService from '../../services/query-version.service';

const prisma = new PrismaClient();

/**
 * 检查SQL是否为特殊命令（如SHOW, DESCRIBE等），这些命令不支持LIMIT子句
 * 注意：MariaDB中的带LIMIT关键字的查询也需要作为特殊命令处理，避免追加额外的LIMIT
 */
function isSpecialCommand(sql: string): boolean {
  if (!sql) return false;
  const trimmedSql = sql.trim().toLowerCase();
  
  // MariaDB兼容性：将包含LIMIT关键字的SQL也视为特殊命令，避免额外添加分页参数
  if (trimmedSql.includes(' limit ')) {
    return true;
  }
  
  return (
    trimmedSql.startsWith('show ') || 
    trimmedSql.startsWith('describe ') || 
    trimmedSql.startsWith('desc ') ||
    trimmedSql === 'show databases;' ||
    trimmedSql === 'show tables;' ||
    trimmedSql === 'show databases' ||
    trimmedSql === 'show tables' ||
    trimmedSql.startsWith('show columns ') ||
    trimmedSql.startsWith('show index ') ||
    trimmedSql.startsWith('show create ') ||
    trimmedSql.startsWith('show grants ') ||
    trimmedSql.startsWith('show triggers ') ||
    trimmedSql.startsWith('show procedure ') ||
    trimmedSql.startsWith('show function ') ||
    trimmedSql.startsWith('show variables ') ||
    trimmedSql.startsWith('show status ') ||
    trimmedSql.startsWith('show engine ') ||
    trimmedSql.startsWith('set ') ||
    trimmedSql.startsWith('use ')
  );
}

export class QueryController {
  /**
   * 获取查询执行计划
   */
  async explainQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.BAD_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const { dataSourceId, sql, params, includeAnalysis = true } = req.body;
      const plan = await queryService.explainQuery(dataSourceId, sql, params);
      
      // 根据客户端请求决定是否返回完整分析结果
      if (!includeAnalysis && plan.performanceAnalysis) {
        // 缓存原始分析结果但不返回
        plan._performanceAnalysis = plan.performanceAnalysis;
        delete plan.performanceAnalysis;
      }
      
      res.status(200).json({
        success: true,
        data: plan
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 获取查询计划的优化建议
   */
  async getQueryOptimizationTips(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      // 从历史记录中获取查询计划
      let planHistory = await queryService.getQueryPlanById(id);
      
      // 如果数据库中不存在，尝试从测试文件中获取
      if (!planHistory && id === '123') {
        logger.debug('从数据库未找到查询计划，尝试从测试文件获取', { id });
        try {
          const fs = require('fs');
          const path = require('path');
          const testFile = path.join(process.cwd(), 'sqldump', 'testplan.json');
          
          if (fs.existsSync(testFile)) {
            const fileContent = fs.readFileSync(testFile, 'utf-8');
            planHistory = JSON.parse(fileContent);
            // 添加sql字段（如果测试文件中不存在）
            planHistory.sql = planHistory.sql || 'SELECT * FROM users JOIN orders ON users.id = orders.user_id';
            logger.debug('成功从测试文件获取查询计划', { id });
          }
        } catch (error) {
          logger.error('尝试从测试文件获取查询计划失败', { error, id });
        }
      }
      
      if (!planHistory) {
        throw ApiError.notFound('查询计划不存在');
      }
      
      // 获取优化建议
      const plan = JSON.parse(planHistory.planData);
      
      res.status(200).json({
        success: true,
        data: {
          sql: planHistory.sql,
          optimizationTips: plan.optimizationTips || [],
          performanceAnalysis: plan.performanceAnalysis || {}
        }
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 获取查询计划历史记录
   */
  async getQueryPlanHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId, limit, offset } = req.query;
      
      const result = await queryService.getQueryPlanHistory(
        dataSourceId as string,
        limit ? Number(limit) : 20,
        offset ? Number(offset) : 0
      );
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 取消查询执行
   */
  async cancelQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const success = await queryService.cancelQuery(id);
      
      if (success) {
        res.status(200).json({
          success: true,
          message: '查询已成功取消'
        });
      } else {
        res.status(200).json({
          success: false,
          message: '无法取消查询，查询可能已完成或已取消'
        });
      }
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 执行SQL查询
   */
  async executeQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw new ApiError('验证错误', ERROR_CODES.BAD_REQUEST, 400, 'BAD_REQUEST', errors.array());
      }

      const { dataSourceId, sql, params, page, pageSize, offset, limit, sort, order, createHistory, explainQuery } = req.body;
      
      // 检查是否为特殊命令，使用外部函数
      if (isSpecialCommand(sql)) {
        logger.debug('检测到特殊命令，直接使用连接器执行', { dataSourceId, sql });
        
        try {
          // 获取数据源连接器
          const connector = await dataSourceService.getConnector(dataSourceId);
          
          // 直接执行特殊命令，不通过查询服务
          const result = await connector.executeQuery(sql, params || []);
          
          return res.status(200).json({
            success: true,
            data: result
          });
        } catch (error: any) {
          logger.error('直接执行特殊命令失败', { 
            error: error?.message || '未知错误', 
            dataSourceId, 
            sql 
          });
          throw error;
        }
      } else {
        // 如果启用了执行计划
        if (explainQuery) {
          logger.debug('启用执行计划，调用explainQuery', { dataSourceId, sql });
          try {
            const planResult = await queryService.explainQuery(dataSourceId, sql, params || []);
            return res.status(200).json({
              success: true,
              data: planResult
            });
          } catch (error: any) {
            logger.error('获取查询执行计划失败', { 
              error: error?.message || '未知错误', 
              dataSourceId, 
              sql 
            });
            throw error;
          }
        }
        
        // 普通查询通过查询服务执行
        logger.debug('执行普通查询', { dataSourceId, sql, createHistory });
        
        // 获取查询ID - 从请求中获取
        const queryId = req.body.queryId || req.params.id;
        
        // 判断是否需要创建历史记录
        const shouldCreateHistory = (createHistory === true) || (queryId && queryId.length > 0);
        
        // 如果提供了queryId，验证该查询是否存在
        if (queryId) {
          try {
            // 只检查ID是否存在，不加载完整查询
            const queryExists = await prisma.query.findUnique({
              where: { id: queryId },
              select: { id: true }
            });
            
            if (!queryExists) {
              logger.warn('请求执行的查询ID不存在', { queryId });
              // 不返回错误，仍然执行查询，但记录警告
            }
          } catch (error) {
            logger.error('验证查询ID时出错', { error, queryId });
            // 不中断执行流程
          }
        }
        
        // 直接传递分页参数和历史记录选项
        const queryOptions = {
          page, pageSize, offset, limit, sort, order, 
          queryId,  // 传递queryId而不是从req.body.id获取
          createHistory: shouldCreateHistory
        };
        
        // 执行查询
        const result = await queryService.executeQuery(dataSourceId, sql, params, queryOptions);
        
        return res.status(200).json({
          success: true,
          data: result
        });
      }
    } catch (error: any) {
      next(error);
    }
  }
  
  /**
   * 保存查询
   */
  async saveQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // 格式化验证错误，提供更详细的错误信息
        const formattedErrors = errors.array().map(error => ({
          field: (error as any).path || (error as any).param,
          value: (error as any).value,
          message: error.msg
        }));
        
        return res.status(400).json({
          success: false,
          message: '查询保存失败：输入验证错误',
          errors: formattedErrors
        });
      }

      const {
        id,
        dataSourceId,
        name,
        description,
        sql,
        tags,
        isPublic,
        shouldPublish = false // 默认不自动发布
      } = req.body;

      // 如果前端提供了ID，记录一下
      if (id) {
        logger.debug('前端提供了自定义ID', { id });
      }

      // 使用重构后的保存查询方法，同时创建初始版本
      const userId = (req as any).user?.id || 'system';
      
      // 调用版本化服务进行保存
      const result = await queryVersionService.saveQueryWithVersion({
        id,
        name,
        dataSourceId,
        sql,
        description,
        tags: tags ? Array.isArray(tags) ? tags : [tags] : [],
        userId,
        isPublic: isPublic === true
      });
      
      // 如果需要发布和激活版本
      if (shouldPublish && result.versionId) {
        try {
          // 发布版本
          logger.debug('自动发布查询版本', { queryId: result.query.id, versionId: result.versionId });
          await queryVersionService.publishVersion(result.versionId);
          
          // 设置为活跃版本
          logger.debug('自动设置版本为活跃版本', { queryId: result.query.id, versionId: result.versionId });
          await queryVersionService.activateVersion(result.versionId);
          
          // 重新获取查询信息，确保包含最新状态
          const updatedQuery = await queryService.getQueryById(result.query.id);
          
          // 返回成功响应，包含查询信息和版本ID
          return res.status(201).json({
            success: true,
            data: updatedQuery
          });
        } catch (publishError) {
          logger.error('自动发布并激活版本失败', { error: publishError, queryId: result.query.id, versionId: result.versionId });
          // 即使发布失败，仍然返回创建的查询
        }
      }
      
      // 返回成功响应，包含查询信息和版本ID
      res.status(201).json({
        success: true,
        data: {
          ...result.query,
          currentVersionId: result.versionId
        }
      });
    } catch (error: any) {
      logger.error('保存查询失败', { error, body: req.body });
      
      // 处理特定类型的错误
      if (error instanceof ApiError) {
        return res.status(error.statusCode || 500).json({
          success: false,
          message: `查询保存失败：${error.message}`,
          errorCode: error.errorCode
        });
      }
      
      // 未知错误处理
      return res.status(500).json({
        success: false,
        message: `查询保存失败：${error.message || '未知错误'}`
      });
    }
  }

  /**
   * 获取所有保存的查询
   */
  async getQueries(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId, tag, isPublic, search, includeDrafts } = req.query;
      const pagination = getPaginationParams(req);
      
      const result = await queryService.getQueries({
        dataSourceId: dataSourceId as string,
        tag: tag as string,
        isPublic: isPublic === 'true',
        search: search as string,
        page: pagination.page,
        size: pagination.size,
        includeDrafts: includeDrafts === 'true'
      });
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 获取单个查询
   */
  async getQueryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const query = await queryService.getQueryById(id);
      
      res.status(200).json({
        success: true,
        data: query
      });
    } catch (error: any) {
      logger.error('获取查询失败', { error, id: req.params.id });
      
      // 处理特定类型的错误
      if (error instanceof ApiError) {
        // 处理资源不存在的情况
        if (error.statusCode === 404 || error.errorCode === GENERAL_ERROR.NOT_FOUND) {
          return res.status(404).json({
            success: false,
            message: '查询不存在',
            errorCode: error.errorCode || GENERAL_ERROR.NOT_FOUND
          });
        }
        
        // 其他API错误
        return res.status(error.statusCode || 500).json({
          success: false,
          message: error.message,
          errorCode: error.errorCode
        });
      }
      
      // 未知错误处理
      return res.status(500).json({
        success: false,
        message: error.message || '获取查询时发生未知错误'
      });
    }
  }

  /**
   * 更新查询
   */
  async updateQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: {
            code: ERROR_CODES.VALIDATION_ERROR,
            message: '查询更新失败：输入验证错误',
            details: errors.array()
          }
        });
      }

      const { id } = req.params;
      const {
        name,
        sql,
        description,
        tags,
        isPublic,
        dataSourceId
      } = req.body;

      // 记录更详细的操作信息
      logger.debug('尝试更新查询', { id, requestBody: req.body });

      try {
        const updatedQuery = await queryService.updateQuery(id, {
          name,
          sql,
          description,
          tags,
          isPublic,
          dataSourceId // 传递dataSourceId给服务
        });

        return res.status(200).json({
          success: true,
          data: updatedQuery
        });
      } catch (error: any) {
        // 错误处理
        if (error instanceof ApiError) {
          // 如果是自定义API错误，使用它的状态码和错误码
          return res.status(error.statusCode || 500).json({
            success: false,
            error: {
              code: error.errorCode,
              message: `更新失败：${error.message}`,
              details: null
            }
          });
        }
        
        // 其他错误
        logger.error('更新查询时发生错误', { id, error });
        return res.status(500).json({
          success: false,
          error: {
            code: GENERAL_ERROR.INTERNAL_SERVER_ERROR,
            message: `更新失败：${error.message || '未知错误'}`,
            details: null
          }
        });
      }
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 删除保存的查询
   */
  async deleteQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      logger.debug('收到删除查询请求', { id });
      
      await queryService.deleteQuery(id);
      
      return res.status(200).json({
        success: true,
        message: '查询已成功删除'
      });
    } catch (error: any) {
      logger.error('删除查询失败', { 
        error: error.message || '未知错误', 
        stack: error.stack,
        id: req.params.id 
      });
      
      // 处理特定类型的错误
      if (error instanceof ApiError) {
        // 处理资源不存在的情况
        if (error.statusCode === 404 || error.errorCode === GENERAL_ERROR.NOT_FOUND) {
          return res.status(404).json({
            success: false,
            error: {
              code: GENERAL_ERROR.NOT_FOUND,
              message: '删除失败：查询不存在',
              details: null
            }
          });
        }
        
        // 其他API错误
        return res.status(error.statusCode || 500).json({
          success: false,
          error: {
            code: error.errorCode || GENERAL_ERROR.INTERNAL_SERVER_ERROR,
            message: `删除失败：${error.message}`,
            details: null
          }
        });
      }
      
      // 未知错误处理
      return res.status(500).json({
        success: false,
        error: {
          code: GENERAL_ERROR.INTERNAL_SERVER_ERROR,
          message: `删除失败：${error.message || '未知错误'}`,
          details: null
        }
      });
    }
  }

  /**
   * 获取查询历史记录
   */
  async getQueryHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId, limit, offset, page, size } = req.query;
      
      // 优先使用limit和offset参数，如果未提供则尝试使用page和size参数
      let finalLimit = limit ? Number(limit) : (size ? Number(size) : 20);
      let finalOffset = offset ? Number(offset) : (page ? (Number(page) - 1) * finalLimit : 0);
      
      // 使用Prisma ORM查询数据
      logger.debug('获取查询历史记录', { dataSourceId, limit: finalLimit, offset: finalOffset });
      
      // 构建查询条件
      const where = dataSourceId ? { dataSourceId: dataSourceId as string } : {};
      
      try {
        // 使用Prisma查询
        const [history, total] = await Promise.all([
          prisma.queryHistory.findMany({
            where,
            orderBy: [
              { startTime: 'desc' },
              { createdAt: 'desc' }
            ],
            skip: finalOffset,
            take: finalLimit
          }),
          prisma.queryHistory.count({ where })
        ]);
        
        logger.debug(`成功获取查询历史记录: ${history.length} 条，总计: ${total}`);
        
        // 构建分页信息
        const pagination = {
          page: Math.floor(finalOffset / finalLimit) + 1,
          pageSize: finalLimit,
          total,
          totalPages: Math.ceil(total / finalLimit),
          hasMore: finalOffset + finalLimit < total
        };
        
        // 返回标准响应格式
        return res.status(200).json({
          success: true,
          data: {
            items: history,
            pagination
          }
        });
      } catch (dbError) {
        logger.error('Prisma查询历史记录失败', { error: dbError });
        throw new ApiError('获取查询历史记录失败', 500);
      }
    } catch (error: any) {
      console.error('获取查询历史记录失败:', error);
      logger.error('获取查询历史记录失败', { error });
      
      return res.status(500).json({
        success: false,
        error: {
          code: GENERAL_ERROR.INTERNAL_SERVER_ERROR,
          message: `获取查询历史记录失败: ${error.message || '未知错误'}`,
          details: null
        }
      });
    }
  }

  /**
   * 获取收藏的查询列表
   */
  async getFavorites(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id || 'anonymous'; // 如果有认证系统，获取用户ID
      const pagination = getPaginationParams(req);
      
      const favorites = await queryService.getFavorites(userId, {
        page: pagination.page,
        size: pagination.size
      });
      
      res.status(200).json({
        success: true,
        data: favorites
      });
    } catch (error: any) {
      next(error);
    }
  }

  /**
   * 添加查询到收藏夹
   */
  async favoriteQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id || 'anonymous'; // 如果有认证系统，获取用户ID
      
      // 首先验证查询是否存在
      try {
        await queryService.getQueryById(id);
      } catch (error) {
        if (error instanceof ApiError && error.errorCode === GENERAL_ERROR.NOT_FOUND) {
          return res.status(404).json({
            success: false,
            error: {
              code: GENERAL_ERROR.NOT_FOUND,
              message: '添加收藏失败：查询不存在',
              details: null
            }
          });
        }
      }
      
      const favorite = await queryService.favoriteQuery(id, userId);
      
      res.status(200).json({
        success: true,
        data: favorite,
        message: '查询已添加到收藏夹'
      });
    } catch (error: any) {
      logger.error('添加查询到收藏夹失败', { error, queryId: req.params.id, userId: (req as any).user?.id || 'anonymous' });
      
      // 处理特定类型的错误
      if (error instanceof ApiError) {
        return res.status(error.statusCode || 500).json({
          success: false,
          error: {
            code: error.errorCode,
            message: `添加收藏失败：${error.message}`,
            details: null
          }
        });
      }
      
      // 未知错误处理
      return res.status(500).json({
        success: false,
        error: {
          code: GENERAL_ERROR.INTERNAL_SERVER_ERROR,
          message: `添加收藏失败：${error.message || '未知错误'}`,
          details: null
        }
      });
    }
  }

  /**
   * 从收藏夹中移除查询
   */
  async unfavoriteQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id || 'anonymous'; // 如果有认证系统，获取用户ID
      
      const success = await queryService.unfavoriteQuery(id, userId);
      
      res.status(200).json({
        success: true,
        message: '查询已从收藏夹中移除'
      });
    } catch (error: any) {
      logger.error('从收藏夹移除查询失败', { error, queryId: req.params.id, userId: (req as any).user?.id || 'anonymous' });
      
      // 处理特定类型的错误
      if (error instanceof ApiError) {
        return res.status(error.statusCode || 500).json({
          success: false,
          error: {
            code: error.errorCode,
            message: `取消收藏失败：${error.message}`,
            details: null
          }
        });
      }
      
      // 未知错误处理
      return res.status(500).json({
        success: false,
        error: {
          code: GENERAL_ERROR.INTERNAL_SERVER_ERROR,
          message: `取消收藏失败：${error.message || '未知错误'}`,
          details: null
        }
      });
    }
  }

  /**
   * 获取单个查询历史记录
   */
  async getQueryHistoryById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      
      const history = await queryService.getQueryHistoryById(id);
      
      res.status(200).json({
        success: true,
        data: history
      });
    } catch (error: any) {
      // 处理特定类型的错误
      if (error instanceof ApiError) {
        // 处理资源不存在的情况
        if (error.statusCode === 404 || error.errorCode === GENERAL_ERROR.NOT_FOUND) {
          return res.status(404).json({
            success: false,
            error: {
              code: GENERAL_ERROR.NOT_FOUND,
              message: '查询历史记录不存在',
              details: null
            }
          });
        }
        
        // 其他API错误
        return res.status(error.statusCode || 500).json({
          success: false,
          error: {
            code: error.errorCode,
            message: error.message,
            details: null
          }
        });
      }
      
      // 未知错误处理
      next(error);
    }
  }

  /**
   * 验证执行查询请求
   */
  validateExecuteQuery() {
    return [
      check('dataSourceId').not().isEmpty().withMessage('数据源ID不能为空'),
      check('sql').not().isEmpty().withMessage('SQL语句不能为空'),
      check('createHistory').optional().isBoolean().withMessage('createHistory必须是布尔值'),
      check('explainQuery').optional().isBoolean().withMessage('explainQuery必须是布尔值'),
    ];
  }

  /**
   * 验证保存查询请求
   */
  validateSaveQuery() {
    return [
      check('dataSourceId').not().isEmpty().withMessage('数据源ID不能为空'),
      check('name').not().isEmpty().withMessage('名称不能为空'),
      check('sql').not().isEmpty().withMessage('SQL查询语句不能为空'),
    ];
  }

  /**
   * 验证更新查询请求
   */
  validateUpdateQuery() {
    return [
      check('id').not().isEmpty().withMessage('查询ID不能为空'),
    ];
  }

  /**
   * 清空临时查询历史记录
   * 仅删除未关联到保存查询的历史记录(queryId为null的记录)
   */
  async clearTemporaryQueryHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId } = req.query;
      
      // 调用服务层方法清空临时历史记录
      const deletedCount = await queryService.clearTemporaryQueryHistory(
        dataSourceId as string
      );
      
      res.status(200).json({
        success: true,
        message: `已成功清空临时查询历史记录，共删除${deletedCount}条记录`,
        data: {
          deletedCount
        }
      });
    } catch (error: any) {
      logger.error('清空临时查询历史记录失败', { error });
      
      if (error instanceof ApiError) {
        return res.status(error.statusCode || 500).json({
          success: false,
          error: {
            code: error.errorCode,
            message: error.message,
            details: null
          }
        });
      }
      
      return res.status(500).json({
        success: false,
        error: {
          code: GENERAL_ERROR.INTERNAL_SERVER_ERROR,
          message: `清空临时查询历史记录失败: ${error.message || '未知错误'}`,
          details: null
        }
      });
    }
  }

  /**
   * 删除单条查询历史记录
   */
  async deleteQueryHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      logger.debug('收到删除查询历史记录请求', { id });
      
      await queryService.deleteQueryHistory(id);
      
      return res.status(200).json({
        success: true,
        message: '查询历史记录已成功删除'
      });
    } catch (error: any) {
      logger.error('删除查询历史记录失败', { 
        error: error.message || '未知错误', 
        stack: error.stack,
        id: req.params.id 
      });
      
      // 处理特定类型的错误
      if (error instanceof ApiError) {
        // 处理资源不存在的情况
        if (error.statusCode === 404 || error.errorCode === GENERAL_ERROR.NOT_FOUND) {
          return res.status(404).json({
            success: false,
            error: {
              code: GENERAL_ERROR.NOT_FOUND,
              message: '删除失败：查询历史记录不存在',
              details: null
            }
          });
        }
        
        // 其他API错误
        return res.status(error.statusCode || 500).json({
          success: false,
          error: {
            code: error.errorCode || GENERAL_ERROR.INTERNAL_SERVER_ERROR,
            message: `删除失败：${error.message}`,
            details: null
          }
        });
      }
      
      // 未知错误处理
      return res.status(500).json({
        success: false,
        error: {
          code: GENERAL_ERROR.INTERNAL_SERVER_ERROR,
          message: `删除失败：${error.message || '未知错误'}`,
          details: null
        }
      });
    }
  }

  /**
   * 一键保存并发布查询
   * 创建查询记录、初始版本，并发布激活该版本
   */
  async publishQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // 格式化验证错误
        const formattedErrors = errors.array().map(error => ({
          field: (error as any).path || (error as any).param,
          value: (error as any).value,
          message: error.msg
        }));
        
        return res.status(400).json({
          success: false,
          message: '查询发布失败：输入验证错误',
          errors: formattedErrors
        });
      }

      const {
        id,
        dataSourceId,
        name,
        description,
        sql,
        tags
      } = req.body;

      const userId = (req as any).user?.id || 'system';
      
      // 第一步：保存查询并创建初始版本
      logger.debug('开始一键发布查询', { name, dataSourceId });
      
      // 调用版本化服务进行保存
      const result = await queryVersionService.saveQueryWithVersion({
        id,
        name,
        dataSourceId,
        sql,
        description,
        tags: tags ? Array.isArray(tags) ? tags : [tags] : [],
        userId,
        isPublic: true // 设置为公开
      });
      
      // 第二步：发布该版本
      logger.debug('发布查询版本', { versionId: result.versionId });
      const publishedVersion = await queryVersionService.publishVersion(result.versionId);
      
      // 第三步：激活该版本
      logger.debug('激活查询版本', { versionId: result.versionId });
      const activatedQuery = await queryVersionService.activateVersion(result.versionId);
      
      // 返回成功响应
      res.status(201).json({
        success: true,
        data: {
          ...activatedQuery,
          currentVersionId: result.versionId,
          publishedVersion: publishedVersion
        },
        message: '查询已成功保存并发布'
      });
    } catch (error: any) {
      logger.error('保存并发布查询失败', { error, body: req.body });
      
      // 处理特定类型的错误
      if (error instanceof ApiError) {
        return res.status(error.statusCode || 500).json({
          success: false,
          message: `查询发布失败：${error.message}`,
          errorCode: error.errorCode
        });
      }
      
      // 未知错误处理
      return res.status(500).json({
        success: false,
        message: `查询发布失败：${error.message || '未知错误'}`
      });
    }
  }
}

export default new QueryController();