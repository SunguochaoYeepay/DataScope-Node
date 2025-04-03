/**
 * 清空所有查询和历史记录，只保留一条
 */

import { PrismaClient } from '@prisma/client';
import logger from '../src/utils/logger';

const prisma = new PrismaClient();

async function cleanAndCreateOneQuery() {
  try {
    console.log('开始清理所有查询和历史记录...');
    
    // 先删除所有查询记录和历史记录
    await prisma.queryFavorite.deleteMany({});
    await prisma.queryHistory.deleteMany({});
    await prisma.query.deleteMany({});
    
    console.log('所有查询和历史记录已清空');
    
    // 获取数据源ID
    const dataSource = await prisma.dataSource.findFirst({});
    if (!dataSource) {
      throw new Error('找不到数据源，请先创建数据源');
    }
    
    // 创建一个新的查询ID
    const newId = '41e2c9fb-140a-4867-9e9a-ffbb93276f90';
    
    // 创建一个新的查询
    const query = await prisma.query.create({
      data: {
        id: newId,
        name: '示例查询',
        description: '这是一个示例查询，用于测试。',
        dataSourceId: dataSource.id,
        sqlContent: 'SELECT 1 AS test',
        status: 'PUBLISHED',
        queryType: 'SQL',
        createdBy: 'system',
        updatedBy: 'system'
      }
    });
    
    console.log('创建查询成功:', query.id);
    
    // 创建对应的查询历史记录
    const history = await prisma.queryHistory.create({
      data: {
        id: newId,
        queryId: newId,
        dataSourceId: dataSource.id,
        sqlContent: 'SELECT 1 AS test',
        status: 'COMPLETED',
        startTime: new Date(),
        endTime: new Date(),
        duration: 1,
        rowCount: 1,
        createdBy: 'system'
      }
    });
    
    console.log('创建查询历史记录成功:', history.id);
    console.log('清理完成，现在系统中只有一条查询记录和一条查询历史记录');
    
  } catch (error) {
    console.error('操作失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行清理操作
cleanAndCreateOneQuery();