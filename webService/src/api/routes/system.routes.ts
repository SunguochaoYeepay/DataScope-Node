import { Router } from 'express';
import systemController from '../controllers/system.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @api {get} /api/system/logs 获取系统日志
 * @apiName GetSystemLogs
 * @apiGroup System
 * @apiDescription 获取系统日志，支持分页、过滤和搜索
 * 
 * @apiParam {String} [level] 日志级别 (error, warn, info, debug)
 * @apiParam {String} [search] 搜索关键词
 * @apiParam {String} [startDate] 开始日期 (ISO 8601格式)
 * @apiParam {String} [endDate] 结束日期 (ISO 8601格式)
 * @apiParam {Number} [page=1] 页码
 * @apiParam {Number} [size=50] 每页数量
 * @apiParam {Number} [offset] 偏移量（与page/size二选一）
 * @apiParam {Number} [limit] 限制（与page/size二选一）
 * 
 * @apiSuccess {Boolean} success 请求成功标志
 * @apiSuccess {Object} data 返回数据
 * @apiSuccess {Array} data.items 日志列表
 * @apiSuccess {Object} data.pagination 分页信息
 * @apiSuccess {Number} data.pagination.page 当前页码
 * @apiSuccess {Number} data.pagination.pageSize 每页数量
 * @apiSuccess {Number} data.pagination.total 总记录数
 * @apiSuccess {Number} data.pagination.totalPages 总页数
 * @apiSuccess {Boolean} data.pagination.hasMore 是否有更多数据
 * 
 * @apiSuccessExample {json} 成功响应:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "items": [
 *       {
 *         "timestamp": "2023-06-01T10:15:30.123Z",
 *         "level": "INFO",
 *         "message": "用户登录成功",
 *         "data": {
 *           "userId": "123"
 *         }
 *       }
 *     ],
 *     "pagination": {
 *       "page": 1,
 *       "pageSize": 50,
 *       "total": 1,
 *       "totalPages": 1,
 *       "hasMore": false
 *     }
 *   }
 * }
 */
router.get('/logs', authMiddleware.authenticate, systemController.validateGetLogs(), systemController.getLogs);

/**
 * @api {get} /api/system/health 获取系统健康状态
 * @apiName GetSystemHealth
 * @apiGroup System
 * @apiDescription 获取系统健康状态，包括内存使用、CPU负载、数据库连接状态等
 * 
 * @apiSuccess {Boolean} success 请求成功标志
 * @apiSuccess {Object} data 系统状态数据
 * 
 * @apiSuccessExample {json} 成功响应:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "timestamp": "2023-06-01T10:15:30.123Z",
 *     "system": {
 *       "platform": "darwin",
 *       "arch": "x64",
 *       "version": "v16.15.0",
 *       "uptime": "2d 5h 30m 15s"
 *     },
 *     "memory": {
 *       "total": "16.00 GB",
 *       "free": "8.50 GB",
 *       "usage": 46.875
 *     },
 *     "cpu": {
 *       "model": "Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz",
 *       "cores": 12,
 *       "load": [2.15, 1.75, 1.54]
 *     },
 *     "process": {
 *       "pid": 12345,
 *       "uptime": "1d 2h 15m 30s",
 *       "memory": {
 *         "rss": "150.25 MB",
 *         "heapTotal": "85.50 MB",
 *         "heapUsed": "65.25 MB",
 *         "external": "2.75 MB"
 *       }
 *     },
 *     "database": {
 *       "status": "connected"
 *     }
 *   }
 * }
 */
router.get('/health', authMiddleware.authenticate, systemController.getHealthStatus);

export default router; 