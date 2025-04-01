import { Router } from 'express';
import folderController from '../controllers/folder.controller';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

/**
 * @api {get} /api/query-folders 获取查询文件夹列表
 * @apiName GetFolders
 * @apiGroup QueryFolder
 * @apiDescription 获取查询文件夹列表，支持分页和按父文件夹筛选
 * 
 * @apiParam {String} [parentId] 父文件夹ID，不传则获取根目录文件夹
 * @apiParam {Number} [page=1] 页码
 * @apiParam {Number} [size=10] 每页数量
 * @apiParam {Number} [offset] 偏移量（与page/size二选一）
 * @apiParam {Number} [limit] 限制（与page/size二选一）
 * 
 * @apiSuccess {Boolean} success 请求成功标志
 * @apiSuccess {Object} data 返回数据
 * @apiSuccess {Array} data.items 文件夹列表
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
 *         "id": "1",
 *         "name": "报表文件夹",
 *         "description": "存放各类报表",
 *         "parentId": null,
 *         "createdAt": "2023-05-01T08:00:00.000Z",
 *         "updatedAt": "2023-05-01T08:00:00.000Z"
 *       }
 *     ],
 *     "pagination": {
 *       "page": 1,
 *       "pageSize": 10,
 *       "total": 1,
 *       "totalPages": 1,
 *       "hasMore": false
 *     }
 *   }
 * }
 */
router.get('/', authMiddleware.authenticate, folderController.getFolders.bind(folderController));

/**
 * @api {get} /api/query-folders/:id 获取文件夹详情
 * @apiName GetFolderById
 * @apiGroup QueryFolder
 * @apiDescription 获取特定文件夹的详细信息，包括子文件夹和查询
 * 
 * @apiParam {String} id 文件夹ID
 * 
 * @apiSuccess {Boolean} success 请求成功标志
 * @apiSuccess {Object} data 文件夹详情
 * 
 * @apiSuccessExample {json} 成功响应:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "id": "1",
 *     "name": "报表文件夹",
 *     "description": "存放各类报表",
 *     "parentId": null,
 *     "createdAt": "2023-05-01T08:00:00.000Z",
 *     "updatedAt": "2023-05-01T08:00:00.000Z",
 *     "parent": null,
 *     "children": [
 *       {
 *         "id": "2",
 *         "name": "月度报表",
 *         "description": "月度统计报表",
 *         "parentId": "1"
 *       }
 *     ],
 *     "queries": [
 *       {
 *         "id": "101",
 *         "name": "用户增长报表",
 *         "description": "每日新增用户统计"
 *       }
 *     ]
 *   }
 * }
 * 
 * @apiError (404) {Boolean} success 请求失败标志
 * @apiError (404) {String} message 错误信息
 * @apiError (404) {String} errorCode 错误代码
 * 
 * @apiErrorExample {json} 错误响应:
 * HTTP/1.1 404 Not Found
 * {
 *   "success": false,
 *   "message": "文件夹不存在",
 *   "errorCode": "RESOURCE_NOT_FOUND"
 * }
 */
router.get('/:id', authMiddleware.authenticate, folderController.getFolderById.bind(folderController));

/**
 * @api {post} /api/query-folders 创建文件夹
 * @apiName CreateFolder
 * @apiGroup QueryFolder
 * @apiDescription 创建一个新的查询文件夹
 * 
 * @apiParam {String} name 文件夹名称
 * @apiParam {String} [description] 文件夹描述
 * @apiParam {String} [parentId] 父文件夹ID
 * 
 * @apiSuccess {Boolean} success 请求成功标志
 * @apiSuccess {Object} data 创建的文件夹信息
 * @apiSuccess {String} message 成功信息
 * 
 * @apiSuccessExample {json} 成功响应:
 * HTTP/1.1 201 Created
 * {
 *   "success": true,
 *   "data": {
 *     "id": "3",
 *     "name": "数据分析",
 *     "description": "数据分析相关查询",
 *     "parentId": null,
 *     "createdAt": "2023-05-15T09:30:00.000Z",
 *     "updatedAt": "2023-05-15T09:30:00.000Z"
 *   },
 *   "message": "文件夹创建成功"
 * }
 * 
 * @apiError (400) {Boolean} success 请求失败标志
 * @apiError (400) {String} message 错误信息
 * @apiError (400) {Array} errors 验证错误详情
 * 
 * @apiErrorExample {json} 错误响应:
 * HTTP/1.1 400 Bad Request
 * {
 *   "success": false,
 *   "message": "请求参数错误",
 *   "errors": [
 *     {
 *       "param": "name",
 *       "msg": "文件夹名称不能为空"
 *     }
 *   ]
 * }
 */
router.post('/', authMiddleware.authenticate, folderController.validateCreateFolder(), folderController.createFolder.bind(folderController));

/**
 * @api {put} /api/query-folders/:id 更新文件夹
 * @apiName UpdateFolder
 * @apiGroup QueryFolder
 * @apiDescription 更新现有文件夹的信息
 * 
 * @apiParam {String} id 文件夹ID
 * @apiParam {String} [name] 文件夹名称
 * @apiParam {String} [description] 文件夹描述
 * @apiParam {String} [parentId] 父文件夹ID
 * 
 * @apiSuccess {Boolean} success 请求成功标志
 * @apiSuccess {Object} data 更新后的文件夹信息
 * @apiSuccess {String} message 成功信息
 * 
 * @apiSuccessExample {json} 成功响应:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "data": {
 *     "id": "3",
 *     "name": "数据分析报表",
 *     "description": "数据分析相关报表和查询",
 *     "parentId": "1",
 *     "createdAt": "2023-05-15T09:30:00.000Z",
 *     "updatedAt": "2023-05-15T10:15:00.000Z"
 *   },
 *   "message": "文件夹更新成功"
 * }
 * 
 * @apiError (404) {Boolean} success 请求失败标志
 * @apiError (404) {String} message 错误信息
 * @apiError (404) {String} errorCode 错误代码
 * 
 * @apiErrorExample {json} 错误响应:
 * HTTP/1.1 404 Not Found
 * {
 *   "success": false,
 *   "message": "文件夹不存在",
 *   "errorCode": "RESOURCE_NOT_FOUND"
 * }
 */
router.put('/:id', authMiddleware.authenticate, folderController.validateUpdateFolder(), folderController.updateFolder.bind(folderController));

/**
 * @api {delete} /api/query-folders/:id 删除文件夹
 * @apiName DeleteFolder
 * @apiGroup QueryFolder
 * @apiDescription 删除文件夹（仅当文件夹为空时才能删除）
 * 
 * @apiParam {String} id 文件夹ID
 * 
 * @apiSuccess {Boolean} success 请求成功标志
 * @apiSuccess {String} message 成功信息
 * 
 * @apiSuccessExample {json} 成功响应:
 * HTTP/1.1 200 OK
 * {
 *   "success": true,
 *   "message": "文件夹删除成功"
 * }
 * 
 * @apiError (400) {Boolean} success 请求失败标志
 * @apiError (400) {String} message 错误信息
 * @apiError (400) {String} errorCode 错误代码
 * 
 * @apiErrorExample {json} 错误响应:
 * HTTP/1.1 400 Bad Request
 * {
 *   "success": false,
 *   "message": "文件夹不为空，无法删除",
 *   "errorCode": "FOLDER_NOT_EMPTY"
 * }
 */
router.delete('/:id', authMiddleware.authenticate, folderController.deleteFolder.bind(folderController));

export default router; 