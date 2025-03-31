import swaggerJSDoc from 'swagger-jsdoc';
import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import config from './env';

// Swagger 配置选项
const swaggerOptions: swaggerJSDoc.Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'DataScope API',
      version: '1.0.0',
      description: 'DataScope API 文档',
      contact: {
        name: 'DataScope Team',
        email: 'support@datascope.io',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:5000/api`,
        description: '本地开发服务器',
      },
      {
        url: `http://localhost:5000/api`,
        description: '测试服务器',
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
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts', './src/api/**/*.ts'],
};

// 创建 Swagger 规范
const swaggerSpec = swaggerJSDoc(swaggerOptions);

/**
 * 配置 Swagger
 */
export const setupSwagger = (app: Express): void => {
  // 设置 Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // 设置 Swagger JSON 端点
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
};

export default setupSwagger;