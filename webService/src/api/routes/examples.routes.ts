/**
 * 示例路由
 */
import { Router } from 'express';
import {
  demonstrateValidationError,
  demonstrateDatabaseError,
  demonstrateAuthenticationError,
  demonstrateAuthorizationError,
  demonstrateAppError,
  demonstrateSuccess,
  errorExamplesIndex
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
 *     summary: 错误演示API
 *     description: 错误演示的入口点，可以通过type参数选择不同类型的错误
 *     tags: [示例]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: 错误类型
 *     responses:
 *       200:
 *         description: 错误演示信息
 *       400:
 *         description: 无效请求
 *       401:
 *         description: 未授权
 *       403:
 *         description: 禁止访问
 *       404:
 *         description: 资源不存在
 *       409:
 *         description: 资源冲突
 *       429:
 *         description: 请求过多
 *       500:
 *         description: 服务器错误
 */
router.get('/errors', errorExamplesIndex);

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
 * /examples/errors/authentication:
 *   get:
 *     summary: 认证错误示例
 *     description: 演示认证错误的使用方法
 *     tags: [示例]
 *     responses:
 *       401:
 *         description: 认证错误
 */
router.get('/errors/authentication', demonstrateAuthenticationError);

/**
 * @swagger
 * /examples/errors/authorization:
 *   get:
 *     summary: 授权错误示例
 *     description: 演示授权错误的使用方法
 *     tags: [示例]
 *     responses:
 *       403:
 *         description: 授权错误
 */
router.get('/errors/authorization', demonstrateAuthorizationError);

/**
 * @swagger
 * /examples/errors/application:
 *   get:
 *     summary: 应用错误示例
 *     description: 演示应用错误的使用方法
 *     tags: [示例]
 *     responses:
 *       500:
 *         description: 应用错误
 */
router.get('/errors/application', demonstrateAppError);

/**
 * @swagger
 * /examples/success:
 *   get:
 *     summary: 成功响应示例
 *     description: 演示正常成功响应
 *     tags: [示例]
 *     responses:
 *       200:
 *         description: 成功响应
 */
router.get('/success', demonstrateSuccess);

export default router;