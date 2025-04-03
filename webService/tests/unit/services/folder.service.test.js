const { PrismaClient } = require('@prisma/client');
const folderService = require('../../../src/services/folder.service').default;
const { ApiError } = require('../../../src/utils/errors/types/api-error');

// 模拟Prisma客户端
jest.mock('@prisma/client', () => {
  const mockPrisma = {
    queryFolder: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn()
    },
    query: {
      count: jest.fn()
    },
    $transaction: jest.fn((callback) => callback(mockPrisma))
  };
  return { PrismaClient: jest.fn(() => mockPrisma) };
});

// 模拟日志记录器
jest.mock('../../../src/utils/logger', () => ({
  info: jest.fn(),
  error: jest.fn(),
  debug: jest.fn()
}));

describe('FolderService', () => {
  let prisma;

  beforeEach(() => {
    // 获取模拟的Prisma实例
    prisma = new PrismaClient();
    // 清除所有模拟的调用记录
    jest.clearAllMocks();
  });

  describe('getFolders', () => {
    it('应该返回带有分页信息的文件夹列表', async () => {
      // 准备模拟数据
      const mockFolders = [
        { id: '1', name: '文件夹1', description: '描述1', parentId: null },
        { id: '2', name: '文件夹2', description: '描述2', parentId: null }
      ];
      
      prisma.queryFolder.findMany.mockResolvedValue(mockFolders);
      prisma.queryFolder.count.mockResolvedValue(10);

      // 调用服务方法
      const result = await folderService.getFolders({ page: 1, size: 2 });

      // 验证结果
      expect(result).toHaveProperty('items');
      expect(result).toHaveProperty('pagination');
      expect(result.items).toEqual(mockFolders);
      expect(result.pagination).toEqual({
        page: 1,
        pageSize: 2,
        total: 10,
        totalPages: 5,
        hasMore: true
      });

      // 验证Prisma调用
      expect(prisma.queryFolder.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 2,
        orderBy: {
          createdAt: 'desc'
        }
      });
      expect(prisma.queryFolder.count).toHaveBeenCalledWith({ where: {} });
    });

    it('应该根据parentId过滤文件夹', async () => {
      // 准备模拟数据
      const mockFolders = [
        { id: '3', name: '子文件夹1', description: '描述3', parentId: '1' },
        { id: '4', name: '子文件夹2', description: '描述4', parentId: '1' }
      ];
      
      prisma.queryFolder.findMany.mockResolvedValue(mockFolders);
      prisma.queryFolder.count.mockResolvedValue(2);

      // 调用服务方法
      const result = await folderService.getFolders({ parentId: '1', page: 1, size: 10 });

      // 验证结果
      expect(result.items).toEqual(mockFolders);
      expect(result.pagination.total).toBe(2);

      // 验证Prisma调用
      expect(prisma.queryFolder.findMany).toHaveBeenCalledWith({
        where: { parentId: '1' },
        skip: 0,
        take: 10,
        orderBy: {
          createdAt: 'desc'
        }
      });
    });
  });

  describe('createFolder', () => {
    it('应该创建文件夹并返回创建的文件夹信息', async () => {
      // 准备模拟数据
      const folderData = { name: '新文件夹', description: '新文件夹描述' };
      const createdFolder = { id: '5', ...folderData, parentId: null, createdAt: new Date(), updatedAt: new Date() };
      
      prisma.queryFolder.create.mockResolvedValue(createdFolder);

      // 调用服务方法
      const result = await folderService.createFolder(folderData);

      // 验证结果
      expect(result).toEqual(createdFolder);
      expect(prisma.queryFolder.create).toHaveBeenCalledWith({
        data: folderData
      });
    });

    it('当指定父文件夹不存在时应该抛出错误', async () => {
      // 准备模拟数据
      const folderData = { name: '新文件夹', description: '新文件夹描述', parentId: 'non-existent' };
      
      prisma.queryFolder.findUnique.mockResolvedValue(null);

      // 调用服务方法并期望抛出错误
      await expect(folderService.createFolder(folderData)).rejects.toThrow(ApiError);
      expect(prisma.queryFolder.create).not.toHaveBeenCalled();
    });
  });

  describe('updateFolder', () => {
    it('应该更新文件夹并返回更新后的信息', async () => {
      // 准备模拟数据
      const folderId = '1';
      const updateData = { name: '更新的文件夹', description: '更新的描述' };
      const existingFolder = { id: folderId, name: '原文件夹', description: '原描述', parentId: null };
      const updatedFolder = { ...existingFolder, ...updateData, updatedAt: new Date() };
      
      prisma.queryFolder.findUnique.mockResolvedValue(existingFolder);
      prisma.queryFolder.update.mockResolvedValue(updatedFolder);

      // 调用服务方法
      const result = await folderService.updateFolder(folderId, updateData);

      // 验证结果
      expect(result).toEqual(updatedFolder);
      expect(prisma.queryFolder.update).toHaveBeenCalledWith({
        where: { id: folderId },
        data: updateData
      });
    });

    it('当文件夹不存在时应该抛出错误', async () => {
      // 准备模拟数据
      const folderId = 'non-existent';
      const updateData = { name: '更新的文件夹' };
      
      prisma.queryFolder.findUnique.mockResolvedValue(null);

      // 调用服务方法并期望抛出错误
      await expect(folderService.updateFolder(folderId, updateData)).rejects.toThrow(ApiError);
      expect(prisma.queryFolder.update).not.toHaveBeenCalled();
    });

    it('当设置的父文件夹会造成循环引用时应该抛出错误', async () => {
      // 准备模拟数据 - 这里模拟父文件夹是自己的子文件夹的情况
      const parentId = '2';
      const folderId = '1';
      const updateData = { parentId };
      const existingFolder = { id: folderId, name: '文件夹1', parentId: null };
      const parentFolder = { id: parentId, name: '文件夹2', parentId: folderId };
      
      prisma.queryFolder.findUnique
        .mockResolvedValueOnce(existingFolder)  // 第一次调用返回目标文件夹
        .mockResolvedValueOnce(parentFolder);   // 第二次调用返回父文件夹

      // 调用服务方法并期望抛出错误
      await expect(folderService.updateFolder(folderId, updateData)).rejects.toThrow(ApiError);
      expect(prisma.queryFolder.update).not.toHaveBeenCalled();
    });
  });

  describe('deleteFolder', () => {
    it('应该成功删除空文件夹', async () => {
      // 准备模拟数据
      const folderId = '1';
      const existingFolder = { id: folderId, name: '待删除文件夹', parentId: null };
      
      prisma.queryFolder.findUnique.mockResolvedValue(existingFolder);
      prisma.queryFolder.count.mockResolvedValue(0); // 没有子文件夹
      prisma.query.count.mockResolvedValue(0); // 没有查询
      prisma.queryFolder.delete.mockResolvedValue(existingFolder);

      // 调用服务方法
      const result = await folderService.deleteFolder(folderId);

      // 验证结果
      expect(result).toEqual(existingFolder);
      expect(prisma.queryFolder.delete).toHaveBeenCalledWith({
        where: { id: folderId }
      });
    });

    it('当文件夹不存在时应该抛出错误', async () => {
      // 准备模拟数据
      const folderId = 'non-existent';
      
      prisma.queryFolder.findUnique.mockResolvedValue(null);

      // 调用服务方法并期望抛出错误
      await expect(folderService.deleteFolder(folderId)).rejects.toThrow(ApiError);
      expect(prisma.queryFolder.delete).not.toHaveBeenCalled();
    });

    it('当文件夹包含子文件夹时应该抛出错误', async () => {
      // 准备模拟数据
      const folderId = '1';
      const existingFolder = { id: folderId, name: '待删除文件夹', parentId: null };
      
      prisma.queryFolder.findUnique.mockResolvedValue(existingFolder);
      prisma.queryFolder.count.mockResolvedValue(2); // 有2个子文件夹
      prisma.query.count.mockResolvedValue(0); // 没有查询

      // 调用服务方法并期望抛出错误
      await expect(folderService.deleteFolder(folderId)).rejects.toThrow(ApiError);
      expect(prisma.queryFolder.delete).not.toHaveBeenCalled();
    });

    it('当文件夹包含查询时应该抛出错误', async () => {
      // 准备模拟数据
      const folderId = '1';
      const existingFolder = { id: folderId, name: '待删除文件夹', parentId: null };
      
      prisma.queryFolder.findUnique.mockResolvedValue(existingFolder);
      prisma.queryFolder.count.mockResolvedValue(0); // 没有子文件夹
      prisma.query.count.mockResolvedValue(3); // 有3个查询

      // 调用服务方法并期望抛出错误
      await expect(folderService.deleteFolder(folderId)).rejects.toThrow(ApiError);
      expect(prisma.queryFolder.delete).not.toHaveBeenCalled();
    });
  });

  describe('getFolderById', () => {
    it('应该返回带有详细信息的文件夹', async () => {
      // 准备模拟数据
      const folderId = '1';
      const mockFolder = {
        id: folderId,
        name: '文件夹1',
        description: '描述1',
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        parent: null,
        children: [
          { id: '2', name: '子文件夹1', parentId: folderId }
        ],
        queries: [
          { id: '101', name: '查询1', folderId: folderId }
        ]
      };
      
      prisma.queryFolder.findUnique.mockResolvedValue(mockFolder);

      // 调用服务方法
      const result = await folderService.getFolderById(folderId);

      // 验证结果
      expect(result).toEqual(mockFolder);
      expect(prisma.queryFolder.findUnique).toHaveBeenCalledWith({
        where: { id: folderId },
        include: {
          parent: true,
          children: true,
          queries: true
        }
      });
    });

    it('当文件夹不存在时应该抛出错误', async () => {
      // 准备模拟数据
      const folderId = 'non-existent';
      
      prisma.queryFolder.findUnique.mockResolvedValue(null);

      // 调用服务方法并期望抛出错误
      await expect(folderService.getFolderById(folderId)).rejects.toThrow(ApiError);
    });
  });
}); 