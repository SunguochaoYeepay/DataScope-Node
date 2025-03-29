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
 */
router.get('/errors/query', demonstrateQueryError);

export default router;