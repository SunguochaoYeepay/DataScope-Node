/**
 * 示例路由
 */
import { Router } from 'express';
import {
  demonstrateApiErrors,
  demonstrateValidationError,
  demonstrateDatabaseError,
  demonstrateDataSourceError,
  demonstrateQueryError
} from '../controllers/examples/error-examples.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *  name: 示例
 *  description: 功能示例API
 */

/**
 * @swagger
 * /examples/errors:
 *   get:
 *     summary: 错误处理示例
 *     description: 演示各种API错误的使用方法
 *     tags: [示例]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: 错误类型
 *     responses:
 *       200:
 *         description: 成功返回，如果没有指定错误类型
 *       400:
 *         description: 无效请求错误
 *       401:
 *         description: 未授权错误
 *       403:
 *         description: 禁止访问错误
 *       404:
 *         description: 资源不存在错误
 *       409:
 *         description: 资源冲突错误
 *       429:
 *         description: 请求频率过高错误
 *       500:
 *         description: 服务器内部错误
 */
router.get('/errors', demonstrateApiErrors);

/**
 * @swagger
 * /examples/errors/validation:
 *   get:
 *     summary: 验证错误示例
 *     description: 演示验证错误的使用方法
 *     tags: [示例]
 *     responses:
 *       400:
 *         description: 验证错误
 */
router.get('/errors/validation', demonstrateValidationError);

/**
 * @swagger
 * /examples/errors/database:
 *   get:
 *     summary: 数据库错误示例
 *     description: 演示数据库错误的使用方法
 *     tags: [示例]
 *     parameters:
 *       - in: query
 *         name: subtype
 *         schema:
 *           type: string
 *         description: 错误子类型
 *     responses:
 *       500:
 *         description: 数据库错误
 */
router.get('/errors/database', demonstrateDatabaseError);

/**
 * @swagger
 * /examples/errors/datasource:
 *   get:
 *     summary: 数据源错误示例
 *     description: 演示数据源错误的使用方法
 *     tags: [示例]
 *     parameters:
 *       - in: query
 *         name: subtype
 *         schema:
 *           type: string
 *         description: 错误子类型
 *     responses:
 *       500:
 *         description: 数据源错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                     error:
 *                       type: string
 *                     message:
 *                       type: string
 *                     code:
 *                       type: integer
 *                     timestamp:
 *                       type: string
 *                     details:
 *                       type: object
 *             examples:
 *               connectionError:
 *                 summary: 连接错误
 *                 value:
 *                   success: false
 *                   error:
 *                     statusCode: 500
 *                     error: "DatabaseError"
 *                     message: "无法连接到数据源"
 *                     code: 70001
 *                     timestamp: "2023-06-15T08:30:00.000Z"
 *                     details:
 *                       host: "localhost"
 *                       port: 3306
 *               authenticateError:
 *                 summary: 认证错误
 *                 value:
 *                   success: false
 *                   error:
 *                     statusCode: 401
 *                     error: "DatabaseError"
 *                     message: "数据源认证失败"
 *                     code: 70003
 *                     timestamp: "2023-06-15T08:30:00.000Z"
 *                     details:
 *                       user: "db_user"
 */
router.get('/errors/datasource', demonstrateDataSourceError);

/**
 * @swagger
 * /examples/errors/query:
 *   get:
 *     summary: 查询错误示例
 *     description: 演示查询错误的使用方法
 *     tags: [示例]
 *     parameters:
 *       - in: query
 *         name: subtype
 *         schema:
 *           type: string
 *         description: 错误子类型
 *     responses:
 *       500:
 *         description: 查询错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 error:
 *                   type: object
 *                   properties:
 *                     statusCode:
 *                       type: integer
 *                     error:
 *                       type: string
 *                     message:
 *                       type: string
 *                     code:
 *                       type: integer
 *                     timestamp:
 *                       type: string
 *                     details:
 *                       type: object
 *             examples:
 *               syntaxError:
 *                 summary: SQL语法错误
 *                 value:
 *                   success: false
 *                   error:
 *                     statusCode: 400
 *                     error: "QueryError"
 *                     message: "SQL语法错误"
 *                     code: 50001
 *                     timestamp: "2023-06-15T08:30:00.000Z"
 *                     details:
 *                       sql: "SELECT * FORM users"
 *                       position: 7
 *               timeoutError:
 *                 summary: 查询超时
 *                 value:
 *                   success: false
 *                   error:
 *                     statusCode: 408
 *                     error: "QueryError"
 *                     message: "查询执行超时"
 *                     code: 50003
 *                     timestamp: "2023-06-15T08:30:00.000Z"
 *                     details:
 *                       queryId: "c7f3bda5-8e9a-4d2c-8186-4d9e173a57b6"
 *                       timeout: 30000
 */
router.get('/errors/query', demonstrateQueryError);

export default router;