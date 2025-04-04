import { Router } from 'express';
import { IntegrationController } from '../controllers/integration.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { validate } from '../../utils/validate';
import { body, param } from 'express-validator';

const router = Router();
const controller = new IntegrationController();

// 添加健康检查路由
router.get('/test', (req, res) => {
  return res.json({
    success: true,
    message: '集成服务正常运行',
    status: 'healthy'
  });
});

// 集成管理路由
// 获取集成列表
router.get(
  '/',
  controller.getIntegrations
);

// 获取单个集成
router.get(
  '/:id',
  validate([
    param('id').isUUID().withMessage('集成ID必须是有效的UUID')
  ]),
  controller.getIntegrationById
);

// 创建集成
router.post(
  '/',
  validate([
    body('name').notEmpty().withMessage('集成名称不能为空'),
    body('queryId').isUUID().withMessage('查询ID必须是有效的UUID'),
    body('type').isIn(['FORM', 'TABLE', 'CHART']).withMessage('集成类型必须是FORM、TABLE或CHART之一'),
    body('config').isObject().withMessage('配置必须是有效的JSON对象')
  ]),
  controller.createIntegration
);

// 更新集成
router.put(
  '/:id',
  validate([
    param('id').isUUID().withMessage('集成ID必须是有效的UUID'),
    body('name').optional().notEmpty().withMessage('集成名称不能为空'),
    body('queryId').optional().isUUID().withMessage('查询ID必须是有效的UUID'),
    body('type').optional().isIn(['FORM', 'TABLE', 'CHART']).withMessage('集成类型必须是FORM、TABLE或CHART之一'),
    body('config').optional().isObject().withMessage('配置必须是有效的JSON对象')
  ]),
  controller.updateIntegration
);

// 删除集成
router.delete(
  '/:id',
  validate([
    param('id').isUUID().withMessage('集成ID必须是有效的UUID')
  ]),
  controller.deleteIntegration
);

// 获取API配置
router.get(
  '/:id/config',
  validate([
    param('id').isUUID().withMessage('集成ID必须是有效的UUID')
  ]),
  controller.getIntegrationConfig
);

// 测试集成
router.post(
  '/:id/test',
  validate([
    param('id').isUUID().withMessage('集成ID必须是有效的UUID'),
    body('params').optional().isObject().withMessage('参数必须是有效的JSON对象')
  ]),
  controller.testIntegration
);

// 数据查询接口
router.post(
  '/data-service/query',
  validate([
    body('integrationId').isUUID().withMessage('集成ID必须是有效的UUID'),
    body('params').optional().isObject().withMessage('参数必须是有效的JSON对象'),
    body('pagination').optional().isObject().withMessage('分页参数必须是有效的JSON对象'),
    body('sorting').optional().isObject().withMessage('排序参数必须是有效的JSON对象')
  ]),
  controller.executeQuery
);

export default router;