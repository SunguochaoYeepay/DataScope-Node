import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import config from './env';

// Swagger 定义
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DataScope API',
      version: '1.0.0',
      description: '数据库可视化查询管理与元数据分析API',
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
    },
    servers: [
      {
        url: `http://${config.service.host}:${config.service.port}${config.service.apiPrefix}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/api/routes/*.ts', './src/types/*.ts'],
};

const specs = swaggerJsdoc(options);

/**
 * 设置Swagger UI
 */
const setupSwagger = (app: Express): void => {
  // Swagger API 文档路由
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
  }));
};

export default setupSwagger;