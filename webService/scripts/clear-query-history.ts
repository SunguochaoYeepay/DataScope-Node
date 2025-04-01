/**
 * 清空查询历史记录并创建一条新记录
 */

import { PrismaClient } from '@prisma/client';
import logger from '../src/utils/logger';

const prisma = new PrismaClient();

async function clearQueryHistory() {
  try {
    console.log('开始清空查询历史记录...');
    
    // 获取当前记录数量
    const countBefore = await prisma.queryHistory.count();
    console.log(`清空前查询历史记录数量: ${countBefore}`);
    
    // 删除所有查询历史记录
    await prisma.queryHistory.deleteMany({});
    console.log('已删除所有查询历史记录');
    
    // 创建一条新的查询历史记录
    const newRecord = await prisma.queryHistory.create({
      data: {
        dataSourceId: "55cd307e-0e6a-11f0-a533-0242ac110002", // MySQL本地数据库ID
        sqlContent: "SELECT 1 AS test", // 简单测试查询
        status: "COMPLETED", // 已完成状态
        startTime: new Date(),
        endTime: new Date(),
        duration: 1, // 1毫秒
        rowCount: 1,
        createdBy: "system"
      }
    });
    
    console.log('已创建新的查询历史记录:', newRecord.id);
    
    // 获取清空后的记录数量
    const countAfter = await prisma.queryHistory.count();
    console.log(`清空后查询历史记录数量: ${countAfter}`);
    
    console.log('操作完成');
  } catch (error) {
    console.error('清空查询历史记录失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 执行清空操作
clearQueryHistory();