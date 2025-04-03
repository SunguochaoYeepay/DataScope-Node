import { Router } from 'express';

const router = Router();

/**
 * @swagger
 * /api/visualizations:
 *   get:
 *     summary: 获取所有可视化配置
 *     description: 返回系统中所有可用的可视化配置
 *     tags: [Visualizations]
 *     responses:
 *       200:
 *         description: 成功获取可视化配置
 *       500:
 *         description: 服务器错误
 */
router.get('/', (req, res) => {
  // 临时返回一个占位响应
  res.status(200).json({
    success: true,
    message: '可视化功能已注册'
  });
});

export default router;
