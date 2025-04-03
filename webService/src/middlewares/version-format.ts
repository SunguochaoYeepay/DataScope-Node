/**
 * 查询版本数据格式转换中间件
 * 用于将后端模型字段映射成前端期望的格式
 */
import { Request, Response, NextFunction } from 'express';

/**
 * 将后端版本数据转换为前端期望的格式
 * @param version 后端版本对象
 * @returns 前端格式的版本对象
 */
const mapVersionToFrontend = (version: any) => {
  return {
    id: version.id,
    queryId: version.queryId,
    versionNumber: version.versionNumber,
    queryText: version.sqlContent, // 字段名转换
    status: version.versionStatus, // 字段名转换
    isActive: false, // 默认非活跃，需要根据查询确定
    createdAt: version.createdAt,
    updatedAt: version.updatedAt || version.createdAt,
    publishedAt: version.publishedAt,
    deprecatedAt: version.deprecatedAt,
    createdBy: version.createdBy || 'system'
  };
};

/**
 * 检查是否是版本相关的路由
 * @param path 请求路径
 * @returns 是否需要应用版本格式转换
 */
const isVersionRoute = (path: string): boolean => {
  // 只对版本相关路由应用转换
  const versionPaths = [
    '/query/version/', 
    '/query-version/',
    '/version/management/'
  ];
  
  // 检查是否包含版本相关路径
  const hasVersionPath = versionPaths.some(prefix => path.includes(prefix));
  
  // 同时检查前缀为/api的路径
  const apiVersionPaths = versionPaths.map(p => '/api' + p);
  const hasApiVersionPath = apiVersionPaths.some(prefix => path.includes(prefix));
  
  // 调试信息
  const isVersionRoute = hasVersionPath || hasApiVersionPath;
  console.log(`路径检查: ${path}, 是否版本路径: ${isVersionRoute}`);
  
  return isVersionRoute;
};

/**
 * 版本数据响应转换中间件
 * 拦截响应，转换数据格式
 */
export const versionFormatMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // 检查是否是版本相关的路由
  const isVersion = isVersionRoute(req.path);
  console.log(`版本格式中间件: 路径=${req.path}, 是否版本路径=${isVersion}, 当前版本ID=${req.query.currentVersionId || '无'}`);
  
  if (!isVersion) {
    return next();
  }
  
  // 保存原始的 json 方法
  const originalJson = res.json;
  
  // 重写 json 方法
  res.json = function(body: any) {
    console.log(`版本中间件处理响应体: path=${req.path}, success=${body?.success}, hasData=${!!body?.data}`);
    
    // 如果是成功响应且包含版本数据
    if (body && body.success === true && body.data) {
      if (Array.isArray(body.data)) {
        console.log(`版本数组处理: 原始数量=${body.data.length}`);
        
        // 记录原始版本信息供调试
        const debugOriginal = body.data.map((v: any) => ({
          id: v.id,
          queryId: v.queryId,
          vNumber: v.versionNumber,
          status: v.versionStatus
        }));
        console.log('原始版本数据:', debugOriginal);
        
        // 多个版本对象
        body.data = body.data.map(mapVersionToFrontend);
        
        // 如果是版本列表，标记活跃版本
        if (body.data.length > 0) {
          console.log(`标记活跃版本: 当前版本ID=${req.query.currentVersionId || '无'}`);
          
          // 查找已发布且是活跃版本的版本
          const currentVersion = body.data.find((v: any) => 
            v.status === 'PUBLISHED' && req.query.currentVersionId === v.id
          );
          
          if (currentVersion) {
            console.log(`找到活跃版本: id=${currentVersion.id}, 版本号=${currentVersion.versionNumber}`);
            currentVersion.isActive = true;
          } else if (body.data.length > 0) {
            // 如果没有找到活跃版本，将第一个版本标记为活跃版本
            console.log(`未找到活跃版本，将第一个版本标记为活跃: id=${body.data[0].id}`);
            body.data[0].isActive = true;
          }
        }
        
        // 记录转换后的版本信息供调试
        const debugConverted = body.data.map((v: any) => ({
          id: v.id,
          queryId: v.queryId,
          vNumber: v.versionNumber,
          status: v.status,
          isActive: v.isActive
        }));
        console.log('转换后版本数据:', debugConverted);
      } else {
        console.log('单个版本对象处理:', {
          id: body.data.id,
          versionNumber: body.data.versionNumber,
          versionStatus: body.data.versionStatus,
          currentVersionId: req.query.currentVersionId
        });
        
        // 单个版本对象
        body.data = mapVersionToFrontend(body.data);
        
        // 检查是否是当前活跃版本
        if (req.query.currentVersionId === body.data.id) {
          console.log(`单个版本是活跃版本: id=${body.data.id}`);
          body.data.isActive = true;
        }
      }
    }
    
    // 调用原始的 json 方法
    console.log(`响应处理完成，返回结果: 路径=${req.path}`);
    return originalJson.call(this, body);
  };
  
  next();
};

export default versionFormatMiddleware; 