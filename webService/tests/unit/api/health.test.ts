import request from 'supertest';
import app from '../../../src/app';

describe('Health API Endpoints', () => {
  describe('GET /status', () => {
    it('should return health information', async () => {
      const response = await request(app).get('/status');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'UP');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('api', 'DataScope API');
      expect(response.body).toHaveProperty('version');
      expect(response.body).toHaveProperty('env');
    });
  });

  describe('GET /health', () => {
    it('should return simplified health information', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'UP');
      expect(Object.keys(response.body).length).toBe(1);
    });
  });

  // 只在开发环境测试
  if (process.env.NODE_ENV === 'development') {
    describe('GET /system-info', () => {
      it('should return system information', async () => {
        const response = await request(app).get('/system-info');
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('os');
        expect(response.body).toHaveProperty('process');
        expect(response.body).toHaveProperty('env');
        
        expect(response.body.os).toHaveProperty('platform');
        expect(response.body.os).toHaveProperty('cpus');
        expect(response.body.process).toHaveProperty('pid');
        expect(response.body.env).toHaveProperty('node_env');
      });
    });
  }
}); 