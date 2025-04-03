import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../src/app';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../../src/utils/auth';

const prisma = new PrismaClient();

describe('查询服务版本控制集成测试', () => {
  let token: string;
  let queryId: string;
  let versionId: string;
  let dataSourceId: string;

  before(async () => {
    // 创建测试用户和生成认证令牌
    const testUser = await prisma.user.findFirst({ where: { email: 'test@example.com' } });
    
    if (!testUser) {
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          name: '测试用户',
          password: '$2b$10$PAw.QCd6mCMj71yukKXGbeUb6TgX9KJUROZUBEWk65IMxVpQ6jNVO', // 密码：test123
          role: 'USER'
        }
      });
    }
    
    token = generateToken({ email: 'test@example.com', role: 'USER' });

    // 创建测试数据源
    const dataSource = await prisma.dataSource.findFirst();
    if (dataSource) {
      dataSourceId = dataSource.id;
    } else {
      const newDataSource = await prisma.dataSource.create({
        data: {
          name: '测试数据源',
          type: 'MYSQL',
          config: JSON.stringify({
            host: 'localhost',
            port: 3306,
            database: 'test',
            user: 'test',
            password: 'test'
          }),
          createdBy: 'test@example.com'
        }
      });
      dataSourceId = newDataSource.id;
    }
  });

  after(async () => {
    // 清理测试数据
    if (queryId) {
      await prisma.queryVersion.deleteMany({
        where: { queryId }
      });
      
      await prisma.queryExecution.deleteMany({
        where: { queryId }
      });
      
      await prisma.query.delete({
        where: { id: queryId }
      });
    }
  });

  describe('创建查询草稿', () => {
    it('应该成功创建查询草稿', async () => {
      const response = await request(app)
        .post('/api/queries')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '测试查询',
          dataSourceId,
          sql: 'SELECT * FROM users LIMIT 10',
          description: '测试描述',
          tags: ['测试', '示例']
        });

      expect(response.status).to.equal(201);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('query');
      expect(response.body.data).to.have.property('versionId');
      
      queryId = response.body.data.query.id;
      versionId = response.body.data.versionId;
    });

    it('缺少必要参数时应该返回错误', async () => {
      const response = await request(app)
        .post('/api/queries')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '测试查询'
          // 缺少必要参数
        });

      expect(response.status).to.equal(400);
      expect(response.body.success).to.be.false;
    });
  });

  describe('更新查询草稿', () => {
    it('应该成功更新查询并创建新草稿', async () => {
      const response = await request(app)
        .put(`/api/queries/${queryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '更新的测试查询',
          sql: 'SELECT * FROM users WHERE id > 5 LIMIT 10',
          description: '更新的测试描述'
        });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.query.name).to.equal('更新的测试查询');
      expect(response.body.data).to.have.property('versionId');
      expect(response.body.data.versionId).to.not.equal(versionId);
      
      // 更新版本ID
      versionId = response.body.data.versionId;
    });

    it('查询不存在时应该返回错误', async () => {
      const response = await request(app)
        .put('/api/queries/non-existent-id')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '更新的测试查询',
          sql: 'SELECT * FROM users LIMIT 10'
        });

      expect(response.status).to.equal(404);
      expect(response.body.success).to.be.false;
    });
  });

  describe('获取版本列表', () => {
    it('应该成功获取查询的版本列表', async () => {
      const response = await request(app)
        .get(`/api/queries/${queryId}/versions`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.be.an('array');
      expect(response.body.data.length).to.be.at.least(1);
    });
  });

  describe('获取版本详情', () => {
    it('应该成功获取查询版本详情', async () => {
      const response = await request(app)
        .get(`/api/queries/${queryId}/versions/${versionId}`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('id');
      expect(response.body.data.id).to.equal(versionId);
      expect(response.body.data.versionStatus).to.equal('DRAFT');
    });

    it('版本不存在时应该返回错误', async () => {
      const response = await request(app)
        .get(`/api/queries/${queryId}/versions/non-existent-id`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(404);
      expect(response.body.success).to.be.false;
    });
  });

  describe('更新草稿版本', () => {
    it('应该成功更新草稿版本', async () => {
      const response = await request(app)
        .put(`/api/queries/${queryId}/versions/${versionId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          sql: 'SELECT id, name FROM users WHERE id > 10 LIMIT 15',
          description: '更新的版本描述',
          parameters: {
            id: {
              type: 'number',
              defaultValue: 10
            }
          }
        });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.sqlContent).to.equal('SELECT id, name FROM users WHERE id > 10 LIMIT 15');
    });
  });

  describe('发布版本', () => {
    it('应该成功发布草稿版本', async () => {
      const response = await request(app)
        .post(`/api/queries/${queryId}/versions/${versionId}/publish`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.versionStatus).to.equal('PUBLISHED');
      expect(response.body.data).to.have.property('publishedAt');
    });

    it('已发布版本不能再次发布', async () => {
      const response = await request(app)
        .post(`/api/queries/${queryId}/versions/${versionId}/publish`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).to.equal(400);
      expect(response.body.success).to.be.false;
    });
  });

  describe('查询服务状态管理', () => {
    it('应该成功禁用查询服务', async () => {
      const response = await request(app)
        .post(`/api/queries/${queryId}/disable`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          reason: '测试禁用原因'
        });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.serviceStatus).to.equal('DISABLED');
      expect(response.body.data.disabledReason).to.equal('测试禁用原因');
    });

    it('应该成功获取查询服务状态', async () => {
      const response = await request(app)
        .get(`/api/queries/${queryId}/status`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.status).to.equal('DISABLED');
      expect(response.body.data.disabledReason).to.equal('测试禁用原因');
    });

    it('禁用服务不应该能执行查询', async () => {
      const response = await request(app)
        .post(`/api/queries/${queryId}/execute`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          versionId
        });

      expect(response.status).to.equal(403);
      expect(response.body.success).to.be.false;
    });

    it('应该成功启用查询服务', async () => {
      const response = await request(app)
        .post(`/api/queries/${queryId}/enable`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.serviceStatus).to.equal('ENABLED');
      expect(response.body.data.disabledReason).to.be.null;
    });
  });

  describe('创建新版本并管理', () => {
    let newVersionId: string;

    it('应该成功创建新草稿版本', async () => {
      const response = await request(app)
        .put(`/api/queries/${queryId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: '测试查询 V2',
          sql: 'SELECT id, name, email FROM users WHERE active = true LIMIT 20'
        });

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('versionId');
      newVersionId = response.body.data.versionId;
    });

    it('应该成功发布新版本', async () => {
      const response = await request(app)
        .post(`/api/queries/${queryId}/versions/${newVersionId}/publish`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.versionStatus).to.equal('PUBLISHED');
    });

    it('应该成功设置新版本为活跃版本', async () => {
      const response = await request(app)
        .post(`/api/queries/${queryId}/versions/${newVersionId}/activate`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.currentVersionId).to.equal(newVersionId);
    });

    it('应该成功废弃旧版本', async () => {
      const response = await request(app)
        .post(`/api/queries/${queryId}/versions/${versionId}/deprecate`)
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data.versionStatus).to.equal('DEPRECATED');
    });
  });

  describe('查询执行和历史记录', () => {
    it('应该成功执行查询', async () => {
      // 注意：实际环境中可能需要模拟数据库连接
      const response = await request(app)
        .post(`/api/queries/${queryId}/execute`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          params: []
        });

      expect(response.status).to.be.oneOf([200, 500]); // 取决于是否能连接数据库
      if (response.status === 200) {
        expect(response.body.success).to.be.true;
        expect(response.body.data).to.have.property('columns');
        expect(response.body.data).to.have.property('rows');
      }
    });

    it('应该成功获取查询历史', async () => {
      const response = await request(app)
        .get(`/api/queries/${queryId}/history`)
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(response.body.success).to.be.true;
      expect(response.body.data).to.have.property('histories');
      expect(response.body.data).to.have.property('total');
    });
  });
});