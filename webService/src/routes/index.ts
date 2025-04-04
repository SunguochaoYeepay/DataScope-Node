/**
 * 路由索引文件
 * 导出所有API路由模块
 */

export { default as authRoutes } from './auth.routes';
export { default as userRoutes } from './user.routes';
export { default as dataSourceRoutes } from './data-source.routes';
export { default as queryRoutes } from './query.routes';
export { default as queryVersionRoutes } from './query-version.routes'; // 查询版本控制路由
export { default as queryFavoriteRoutes } from './query-favorite.routes'; // 查询收藏路由