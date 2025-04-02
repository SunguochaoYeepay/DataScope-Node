/**
 * 查询收藏路由
 */
import { Router } from 'express';
import { QueryFavoriteController } from '../controllers/query-favorite.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/queries/favorites:
 *   get:
 *     tags: [查询收藏]
 *     summary: 获取用户收藏的查询列表
 *     description: 分页获取当前用户收藏的所有查询
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: 页码
 *       - in: query
 *         name: size
 *         schema:
 *           type: integer
 *           default: 10
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Query'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     size:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 message:
 *                   type: string
 */
router.get('/queries/favorites', authMiddleware, QueryFavoriteController.getFavorites);

/**
 * @swagger
 * /api/queries/{queryId}/favorite:
 *   post:
 *     tags: [查询收藏]
 *     summary: 添加查询到收藏
 *     description: 将指定查询添加到用户的收藏列表
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询ID
 *     responses:
 *       200:
 *         description: 添加成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 */
router.post('/queries/:queryId/favorite', authMiddleware, QueryFavoriteController.addToFavorites);

/**
 * @swagger
 * /api/queries/{queryId}/favorite:
 *   delete:
 *     tags: [查询收藏]
 *     summary: 从收藏中移除查询
 *     description: 将指定查询从用户的收藏列表中移除
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询ID
 *     responses:
 *       200:
 *         description: 移除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     success:
 *                       type: boolean
 *                 message:
 *                   type: string
 */
router.delete('/queries/:queryId/favorite', authMiddleware, QueryFavoriteController.removeFromFavorites);

/**
 * @swagger
 * /api/queries/{queryId}/favorite/status:
 *   get:
 *     tags: [查询收藏]
 *     summary: 检查查询是否被收藏
 *     description: 检查当前用户是否已收藏指定查询
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: queryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 查询ID
 *     responses:
 *       200:
 *         description: 查询成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     isFavorite:
 *                       type: boolean
 *                 message:
 *                   type: string
 */
router.get('/queries/:queryId/favorite/status', authMiddleware, QueryFavoriteController.checkFavoriteStatus);

export default router;