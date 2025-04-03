/**
 * 从查询历史记录创建一个保存的查询
 */

import { PrismaClient } from '@prisma/client';
import logger from '../src/utils/logger';

const prisma = new PrismaClient();

async function createQueryFromHistory() {
  try {
    console.log('开始从历史记录创建查询...');
    
    // 获取最新的查询历史记录
    const historyRecord = await prisma.queryHistory.findFirst({
      orderBy: { createdAt: 'desc' }
    });
    
    if (!historyRecord) {
      console.error('未找到查询历史记录');
      return;
    }
    
    console.log('找到最新查询历史记录:', historyRecord.id);
    
    // 使用历史记录内容创建一个新的查询
    const newQuery = await prisma.query.create({
      data: {
        id: historyRecord.id, // 使用相同的ID
        name: `测试查询 - ${new Date().toLocaleString()}`,
        description: '从历史记录创建的测试查询',
        dataSourceId: historyRecord.dataSourceId,
        sqlContent: historyRecord.sqlContent,
        status: 'PUBLISHED',
        queryType: 'SQL',
        createdAt: historyRecord.createdAt,
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system'
      }
    });
    
    console.log('成功创建查询:', newQuery.id);
    
    // 更新历史记录，关联到新创建的查询
    await prisma.queryHistory.update({
      where: { id: historyRecord.id },
      data: {
        queryId: newQuery.id
      }
    });
    
    console.log('操作完成，现在可以通过查询ID访问历史记录了');
  } catch (error) {
    console.error('创建查询失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行操作
createQueryFromHistory();