/**
 * 数据源API接口模拟数据
 */
import { Router, Request, Response } from 'express';
import { asyncHandler } from '../../middlewares/async-handler';
import logger from '../../utils/logger';

const router = Router();

/**
 * 模拟数据源列表数据
 */
const mockDataSources = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'MySQL测试数据库',
    description: '用于测试的MySQL数据库连接',
    type: 'MYSQL',
    host: 'localhost',
    port: 3306,
    databaseName: 'test_db',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'PostgreSQL产品数据库',
    description: '产品环境PostgreSQL数据库',
    type: 'POSTGRESQL',
    host: 'postgres.example.com',
    port: 5432,
    databaseName: 'product_db',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'MongoDB分析数据库',
    description: '用于数据分析的MongoDB数据库',
    type: 'MONGODB',
    host: 'mongo.example.com',
    port: 27017,
    databaseName: 'analytics',
    status: 'INACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: 'system'
  }
];

/**
 * @swagger
 * /api/datasources:
 *   get:
 *     tags: [数据源]
 *     summary: 获取数据源列表
 *     description: 分页获取数据源列表
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
 *                     type: object
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
router.get('/', asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const size = parseInt(req.query.size as string) || 10;
  const total = mockDataSources.length;
  const totalPages = Math.ceil(total / size);
  
  logger.info(`获取数据源列表，页码=${page}，每页数量=${size}`);
  logger.info(`使用模拟数据返回结果，共${total}条记录`);
  
  // 模拟分页，实际项目中应当使用数据库分页查询
  const skip = (page - 1) * size;
  const paginatedSources = mockDataSources.slice(skip, skip + size);
  
  res.status(200).json({
    success: true,
    data: paginatedSources,
    pagination: {
      total,
      page,
      size,
      totalPages
    },
    message: '获取数据源列表成功',
    mock: true, // 标记这是模拟数据
    _notice: '当前使用模拟数据模式 (USE_MOCK_DATA=true)'
  });
}));

/**
 * @swagger
 * /api/datasources/{id}:
 *   get:
 *     tags: [数据源]
 *     summary: 获取数据源详情
 *     description: 根据ID获取数据源详情
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 数据源ID
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
 *                   type: object
 *                 message:
 *                   type: string
 */
router.get('/:id', asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  logger.info(`获取数据源详情，ID=${id}`);
  logger.info(`使用模拟数据返回结果`);
  
  const dataSource = mockDataSources.find(ds => ds.id === id);
  
  if (!dataSource) {
    return res.status(404).json({
      success: false,
      message: '数据源不存在',
      mock: true,
      _notice: '当前使用模拟数据模式 (USE_MOCK_DATA=true)'
    });
  }
  
  res.status(200).json({
    success: true,
    data: dataSource,
    message: '获取数据源详情成功',
    mock: true,
    _notice: '当前使用模拟数据模式 (USE_MOCK_DATA=true)'
  });
}));

/**
 * @swagger
 * /api/datasources/test:
 *   post:
 *     tags: [数据源]
 *     summary: 测试数据源连接
 *     description: 测试数据库连接是否可用
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - host
 *               - port
 *               - database
 *               - username
 *               - password
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [MYSQL, POSTGRESQL, ORACLE, SQLSERVER, MONGODB, ELASTICSEARCH]
 *               host:
 *                 type: string
 *               port:
 *                 type: integer
 *               database:
 *                 type: string
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               connectionParams:
 *                 type: object
 *     responses:
 *       200:
 *         description: 测试成功
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
 *                     connected:
 *                       type: boolean
 *                     message:
 *                       type: string
 *                 message:
 *                   type: string
 *       400:
 *         description: 请求参数错误
 *       500:
 *         description: 服务器错误
 */
router.post('/test', asyncHandler(async (req: Request, res: Response) => {
  const connection = req.body;
  
  // 记录不包含密码的连接信息
  const { password, ...logSafeConnection } = connection;
  logger.info(`测试数据源连接: ${JSON.stringify(logSafeConnection)}`);
  logger.info(`使用模拟数据模式，返回模拟连接结果`);
  
  // 验证必要参数
  if (!connection.type || !connection.host || !connection.port || !connection.database || !connection.username) {
    return res.status(400).json({
      success: false,
      message: '连接参数不完整',
      mock: true,
      _notice: '当前使用模拟数据模式 (USE_MOCK_DATA=true)'
    });
  }
  
  // 模拟数据库连接测试
  // 实际项目中应当根据不同数据库类型建立真实连接
  const testResult = {
    connected: true,
    message: '连接成功'
  };
  
  // 模拟某些情况下的连接失败
  if (connection.host === 'error.example.com') {
    testResult.connected = false;
    testResult.message = '连接失败: 主机无法访问';
  } else if (connection.username === 'invalid' || connection.password === 'invalid') {
    testResult.connected = false;
    testResult.message = '连接失败: 用户名或密码错误';
  }
  
  res.status(200).json({
    success: true,
    data: testResult,
    message: testResult.connected ? '数据源连接测试成功' : '数据源连接测试失败',
    mock: true,
    _notice: '当前使用模拟数据模式 (USE_MOCK_DATA=true)'
  });
}));

export default router;