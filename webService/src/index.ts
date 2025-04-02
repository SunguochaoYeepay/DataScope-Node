/**
 * 服务启动入口
 */
import { app } from './app';
import logger from './utils/logger';

// 设置服务端口
const PORT = process.env.PORT || 5000;

// 启动服务器
app.listen(PORT, () => {
  logger.info(`服务已启动，端口: ${PORT}`);
  logger.info(`API文档地址: http://localhost:${PORT}/api-docs`);
  logger.info(`健康检查: http://localhost:${PORT}/health`);
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