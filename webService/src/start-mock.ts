/**
 * 模拟数据模式下的服务启动入口
 */
import { app } from './app';
import logger from './utils/logger';

// 强制设置使用模拟数据
process.env.USE_MOCK_DATA = 'true';

// 设置服务端口
const PORT = process.env.PORT || 5000;

// 输出启动配置信息
console.log('==============================================');
console.log('启动服务：模拟数据模式');
console.log(`环境: ${process.env.NODE_ENV || 'development'}`);
console.log(`端口: ${PORT}`);
console.log(`模拟数据: ${process.env.USE_MOCK_DATA}`);
console.log('==============================================');

// 启动服务器
app.listen(PORT, () => {
  logger.info(`服务已启动（模拟数据模式），端口: ${PORT}`);
  logger.info(`API文档地址: http://localhost:${PORT}/api-docs`);
  logger.info(`健康检查: http://localhost:${PORT}/health`);
  logger.info(`模拟数据源API: http://localhost:${PORT}/api/data-sources`);
  logger.info(`模拟数据源API (兼容旧路径): http://localhost:${PORT}/api/datasources`);
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error('未捕获的异常', { error: error.stack });
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的Promise拒绝', { reason, promise });
}); 