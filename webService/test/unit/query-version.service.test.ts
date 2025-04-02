/**
 * 查询版本管理服务单元测试
 */
import { expect } from 'chai';
import sinon from 'sinon';
import { PrismaClient } from '@prisma/client';
import queryVersionService from '../../src/services/query-version.service';
import { QueryServiceStatus, QueryVersionStatus } from '../../src/types/query-version';
import { ApiError } from '../../src/utils/errors/types/api-error';

// 模拟 PrismaClient
const prisma = {
  query: {
    findUnique: sinon.stub(),
    update: sinon.stub()
  },
  queryVersion: {
    findUnique: sinon.stub(),
    create: sinon.stub(),
    update: sinon.stub(),
    findMany: sinon.stub(),
    count: sinon.stub()
  },
  $transaction: sinon.stub().callsFake(async (callback) => {
    return callback(prisma);
  })
} as unknown as PrismaClient;

// 替换服务中的 prisma 实例
(queryVersionService as any).prisma = prisma;

describe('QueryVersionService', () => {
  // 每个测试后重置所有存根
  afterEach(() => {
    sinon.reset();
  });

  describe('createVersion', () => {
    it('应该成功创建新的查询版本', async () => {
      // 设置存根行为
      prisma.queryVersion.count.resolves(2);
      prisma.queryVersion.create.resolves({
        id: 'new-version-id',
        queryId: 'query-id',
        versionNumber: 3,
        versionStatus: 'DRAFT',
        sqlContent: 'SELECT * FROM test',
        dataSourceId: 'datasource-id',
        createdAt: new Date()
      });
      prisma.query.update.resolves({});

      // 调用方法
      const result = await queryVersionService.createVersion({
        queryId: 'query-id',
        sqlContent: 'SELECT * FROM test',
        dataSourceId: 'datasource-id',
        description: 'Test description'
      });

      // 验证结果
      expect(result).to.have.property('id', 'new-version-id');
      expect(result).to.have.property('versionNumber', 3);
      expect(result).to.have.property('versionStatus', 'DRAFT');
      
      // 验证调用
      expect(prisma.queryVersion.count.calledOnce).to.be.true;
      expect(prisma.queryVersion.create.calledOnce).to.be.true;
      expect(prisma.query.update.calledOnce).to.be.true;
    });

    it('创建版本失败时应抛出异常', async () => {
      // 设置存根行为
      prisma.queryVersion.count.rejects(new Error('Database error'));

      // 验证异常
      try {
        await queryVersionService.createVersion({
          queryId: 'query-id',
          sqlContent: 'SELECT * FROM test',
          dataSourceId: 'datasource-id'
        });
        // 如果没有抛出异常，测试应该失败
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(ApiError);
        expect((error as ApiError).code).to.equal(50002); // VERSION_CREATE_FAILED
      }
    });
  });

  describe('updateDraftVersion', () => {
    it('应该成功更新草稿版本', async () => {
      // 设置存根行为
      prisma.queryVersion.findUnique.resolves({
        id: 'version-id',
        queryId: 'query-id',
        versionNumber: 1,
        versionStatus: 'DRAFT',
        sqlContent: 'SELECT * FROM old',
        dataSourceId: 'datasource-id',
        createdAt: new Date()
      });
      
      prisma.queryVersion.update.resolves({
        id: 'version-id',
        queryId: 'query-id',
        versionNumber: 1,
        versionStatus: 'DRAFT',
        sqlContent: 'SELECT * FROM new',
        dataSourceId: 'datasource-id',
        createdAt: new Date()
      });

      // 调用方法
      const result = await queryVersionService.updateDraftVersion('version-id', {
        sqlContent: 'SELECT * FROM new'
      });

      // 验证结果
      expect(result).to.have.property('id', 'version-id');
      expect(result).to.have.property('sqlContent', 'SELECT * FROM new');
      
      // 验证调用
      expect(prisma.queryVersion.findUnique.calledOnce).to.be.true;
      expect(prisma.queryVersion.update.calledOnce).to.be.true;
    });

    it('更新非草稿状态版本时应抛出异常', async () => {
      // 设置存根行为
      prisma.queryVersion.findUnique.resolves({
        id: 'version-id',
        queryId: 'query-id',
        versionNumber: 1,
        versionStatus: 'PUBLISHED',
        sqlContent: 'SELECT * FROM test',
        dataSourceId: 'datasource-id',
        createdAt: new Date()
      });

      // 验证异常
      try {
        await queryVersionService.updateDraftVersion('version-id', {
          sqlContent: 'SELECT * FROM new'
        });
        // 如果没有抛出异常，测试应该失败
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(ApiError);
        expect((error as ApiError).code).to.equal(50008); // VERSION_NOT_DRAFT
      }
    });
  });

  describe('publishVersion', () => {
    it('应该成功发布版本', async () => {
      // 设置存根行为
      prisma.queryVersion.findUnique.resolves({
        id: 'version-id',
        queryId: 'query-id',
        versionNumber: 1,
        versionStatus: 'DRAFT',
        sqlContent: 'SELECT * FROM test',
        dataSourceId: 'datasource-id',
        createdAt: new Date()
      });
      
      prisma.queryVersion.update.resolves({
        id: 'version-id',
        queryId: 'query-id',
        versionNumber: 1,
        versionStatus: 'PUBLISHED',
        sqlContent: 'SELECT * FROM test',
        dataSourceId: 'datasource-id',
        createdAt: new Date(),
        publishedAt: new Date()
      });
      
      prisma.query.update.resolves({});

      // 调用方法
      const result = await queryVersionService.publishVersion('version-id');

      // 验证结果
      expect(result).to.have.property('id', 'version-id');
      expect(result).to.have.property('versionStatus', 'PUBLISHED');
      expect(result).to.have.property('publishedAt');
      
      // 验证调用
      expect(prisma.queryVersion.findUnique.calledOnce).to.be.true;
      expect(prisma.queryVersion.update.calledOnce).to.be.true;
      expect(prisma.query.update.calledOnce).to.be.true;
    });

    it('发布非草稿状态版本时应抛出异常', async () => {
      // 设置存根行为
      prisma.queryVersion.findUnique.resolves({
        id: 'version-id',
        queryId: 'query-id',
        versionNumber: 1,
        versionStatus: 'PUBLISHED',
        sqlContent: 'SELECT * FROM test',
        dataSourceId: 'datasource-id',
        createdAt: new Date()
      });

      // 验证异常
      try {
        await queryVersionService.publishVersion('version-id');
        // 如果没有抛出异常，测试应该失败
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(ApiError);
        expect((error as ApiError).code).to.equal(50008); // VERSION_NOT_DRAFT
      }
    });
  });

  describe('getVersions', () => {
    it('应该成功获取查询版本列表', async () => {
      // 设置存根行为
      prisma.queryVersion.findMany.resolves([
        {
          id: 'version-1',
          queryId: 'query-id',
          versionNumber: 1,
          versionStatus: 'PUBLISHED',
          sqlContent: 'SELECT * FROM v1',
          dataSourceId: 'datasource-id',
          createdAt: new Date(),
          publishedAt: new Date()
        },
        {
          id: 'version-2',
          queryId: 'query-id',
          versionNumber: 2,
          versionStatus: 'DRAFT',
          sqlContent: 'SELECT * FROM v2',
          dataSourceId: 'datasource-id',
          createdAt: new Date()
        }
      ]);

      // 调用方法
      const result = await queryVersionService.getVersions('query-id');

      // 验证结果
      expect(result).to.be.an('array').with.lengthOf(2);
      expect(result[0]).to.have.property('id', 'version-1');
      expect(result[1]).to.have.property('id', 'version-2');
      
      // 验证调用
      expect(prisma.queryVersion.findMany.calledOnce).to.be.true;
      expect(prisma.queryVersion.findMany.firstCall.args[0]).to.deep.include({
        where: { queryId: 'query-id' }
      });
    });
  });

  describe('disableQuery', () => {
    it('应该成功禁用查询服务', async () => {
      // 设置存根行为
      prisma.query.findUnique.resolves({
        id: 'query-id',
        name: 'Test Query',
        serviceStatus: 'ENABLED',
        createdAt: new Date()
      });
      
      prisma.query.update.resolves({
        id: 'query-id',
        name: 'Test Query',
        serviceStatus: 'DISABLED',
        disabledReason: 'Test reason',
        disabledAt: new Date(),
        createdAt: new Date()
      });

      // 调用方法
      const result = await queryVersionService.disableQuery('query-id', 'Test reason');

      // 验证结果
      expect(result).to.have.property('id', 'query-id');
      expect(result).to.have.property('serviceStatus', 'DISABLED');
      expect(result).to.have.property('disabledReason', 'Test reason');
      expect(result).to.have.property('disabledAt');
      
      // 验证调用
      expect(prisma.query.findUnique.calledOnce).to.be.true;
      expect(prisma.query.update.calledOnce).to.be.true;
    });

    it('禁用不存在的查询服务时应抛出异常', async () => {
      // 设置存根行为
      prisma.query.findUnique.resolves(null);

      // 验证异常
      try {
        await queryVersionService.disableQuery('not-exist', 'Test reason');
        // 如果没有抛出异常，测试应该失败
        expect.fail('Should have thrown an error');
      } catch (error) {
        expect(error).to.be.instanceOf(ApiError);
        expect((error as ApiError).code).to.equal(20001); // QUERY_NOT_FOUND
      }
    });
  });
});