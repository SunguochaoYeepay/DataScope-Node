/**
 * Swagger配置文件
 */
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { join } from 'path';
import fs from 'fs';

/**
 * 配置Swagger文档
 * @param app Express应用实例
 */
export function setupSwagger(app: express.Application) {
  // 原始规范文件路径
  const originalSpecPath = join(__dirname, '../public/openapi/spec.yaml');
  // 新的合并规范文件路径
  const fullSpecPath = join(__dirname, '../public/openapi/full-spec.yaml');
  
  try {
    // 设置新的完整API文档
    if (fs.existsSync(fullSpecPath)) {
      const fullSwaggerDocument = YAML.load(fullSpecPath);
      
      // 设置Swagger UI选项
      const options = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
          docExpansion: 'list',
          filter: true,
          showRequestDuration: true,
          displayOperationId: false
        }
      };
      
      // 设置新的完整文档路由
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(fullSwaggerDocument, options));
      console.log('完整Swagger文档已配置，可访问: /api-docs');
      
      // 如果原始规范文件存在，也提供访问
      if (fs.existsSync(originalSpecPath)) {
        const originalSwaggerDocument = YAML.load(originalSpecPath);
        // 设置原始文档路由
        app.use('/api-docs/original', swaggerUi.serve, swaggerUi.setup(originalSwaggerDocument, {
          ...options,
          customCss: '.swagger-ui .topbar { display: none } .swagger-ui .info { border-bottom: 1px solid #ccc; padding-bottom: 20px; margin-bottom: 20px; } .swagger-ui .info::after { content: "这是原始API文档，仅包含部分接口。请使用完整文档: /api-docs"; display: block; color: #f00; font-weight: bold; margin-top: 10px; }'
        }));
        console.log('原始Swagger文档也可访问: /api-docs/original');
      }
    } 
    // 如果只有原始文档
    else if (fs.existsSync(originalSpecPath)) {
      // 原始文档作为主文档
      const swaggerDocument = YAML.load(originalSpecPath);
      
      // 设置Swagger UI选项
      const options = {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
          docExpansion: 'list',
          filter: true,
          showRequestDuration: true,
        }
      };
      
      // 设置Swagger路由
      app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
      console.log('Swagger文档已配置，可访问: /api-docs');
    } else {
      console.error('未找到任何Swagger规范文件');
    }
  } catch (error) {
    console.error('无法加载Swagger文档:', error);
  }
}