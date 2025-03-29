/**
 * 错误处理集成测试
 * 验证全局错误处理中间件在实际请求中的行为
 */
import request from 'supertest';
import app from '../../../src/app';
import { ERROR_CODES } from '../../../src/utils/errors/error-codes';

// 定义字段错误的接口
interface FieldError {
  field: string;
  message: string;
}

describe('错误处理集成测试', () => {
  describe('示例错误API', () => {
    it('当没有指定错误类型时，应返回正常响应', async () => {
      const response = await request(app)
        .get('/api/examples/errors')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(response.body).toHaveProperty('message', '错误演示API');
      expect(response.body).toHaveProperty('availableTypes');
    });

    it('应正确处理 badRequest 错误', async () => {
      const response = await request(app)
        .get('/api/examples/errors?type=badRequest')
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.INVALID_REQUEST);
      expect(response.body.error).toHaveProperty('type', 'BAD_REQUEST');
      expect(response.body.error).toHaveProperty('message', '无效的请求参数');
      expect(response.body.error).toHaveProperty('timestamp');
      expect(response.body.error).toHaveProperty('path', '/api/examples/errors');
      expect(response.body.error).toHaveProperty('details');
    });

    it('应正确处理 unauthorized 错误', async () => {
      const response = await request(app)
        .get('/api/examples/errors?type=unauthorized')
        .expect('Content-Type', /json/)
        .expect(401);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.UNAUTHORIZED);
      expect(response.body.error).toHaveProperty('type', 'UNAUTHORIZED');
    });

    it('应正确处理 forbidden 错误', async () => {
      const response = await request(app)
        .get('/api/examples/errors?type=forbidden')
        .expect('Content-Type', /json/)
        .expect(403);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.FORBIDDEN);
      expect(response.body.error).toHaveProperty('type', 'FORBIDDEN');
    });

    it('应正确处理 notFound 错误', async () => {
      const response = await request(app)
        .get('/api/examples/errors?type=notFound')
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.RESOURCE_NOT_FOUND);
      expect(response.body.error).toHaveProperty('type', 'NOT_FOUND');
    });

    it('应正确处理 conflict 错误', async () => {
      const response = await request(app)
        .get('/api/examples/errors?type=conflict')
        .expect('Content-Type', /json/)
        .expect(409);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.CONFLICT);
      expect(response.body.error).toHaveProperty('type', 'CONFLICT');
    });

    it('应正确处理 tooManyRequests 错误', async () => {
      const response = await request(app)
        .get('/api/examples/errors?type=tooManyRequests')
        .expect('Content-Type', /json/)
        .expect(429);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.TOO_MANY_REQUESTS);
      expect(response.body.error).toHaveProperty('type', 'TOO_MANY_REQUESTS');
    });

    it('应正确处理 internal 错误', async () => {
      const response = await request(app)
        .get('/api/examples/errors?type=internal')
        .expect('Content-Type', /json/)
        .expect(500);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.INTERNAL_SERVER_ERROR);
      expect(response.body.error).toHaveProperty('type', 'INTERNAL_SERVER_ERROR');
    });
  });

  describe('验证错误API', () => {
    it('应正确处理验证错误', async () => {
      const response = await request(app)
        .get('/api/examples/errors/validation')
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.VALIDATION_FAILED);
      expect(response.body.error).toHaveProperty('type', 'VALIDATION_FAILED');
      expect(response.body.error).toHaveProperty('details');
      expect(Array.isArray(response.body.error.details)).toBe(true);
      expect(response.body.error.details.length).toBe(3); // 应包含3个字段错误
      
      // 验证字段错误结构
      const fieldErrors = response.body.error.details as FieldError[];
      expect(fieldErrors.some((e: FieldError) => e.field === 'username')).toBe(true);
      expect(fieldErrors.some((e: FieldError) => e.field === 'password')).toBe(true);
      expect(fieldErrors.some((e: FieldError) => e.field === 'email')).toBe(true);
    });
  });

  describe('数据库错误API', () => {
    it('应正确处理数据库连接错误', async () => {
      const response = await request(app)
        .get('/api/examples/errors/database?subtype=connection')
        .expect('Content-Type', /json/)
        .expect(500);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.DATABASE_CONNECTION_ERROR);
      expect(response.body.error).toHaveProperty('type', 'DatabaseError');
      expect(response.body.error).toHaveProperty('details');
    });

    it('应正确处理数据库记录不存在错误', async () => {
      const id = '12345';
      const response = await request(app)
        .get(`/api/examples/errors/database?subtype=notFound&id=${id}`)
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.DATABASE_RECORD_NOT_FOUND);
      expect(response.body.error).toHaveProperty('type', 'DatabaseError');
      expect(response.body.error).toHaveProperty('details');
      expect(response.body.error.details).toHaveProperty('id', id);
    });
  });

  describe('404错误处理', () => {
    it('应正确处理不存在的路由', async () => {
      const response = await request(app)
        .get('/api/non-existent-route')
        .expect('Content-Type', /json/)
        .expect(404);
      
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('code', ERROR_CODES.RESOURCE_NOT_FOUND);
      expect(response.body.error).toHaveProperty('type', 'NOT_FOUND');
      expect(response.body.error).toHaveProperty('message', '未找到请求的路径: /api/non-existent-route');
    });
  });
}); 