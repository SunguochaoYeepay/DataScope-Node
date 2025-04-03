const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkQueries() {
  try {
    const totalCount = await prisma.query.count();
    console.log('数据库中共有查询记录:', totalCount);
    
    const queries = await prisma.query.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' }
    });
    
    console.log('最新的查询记录:');
    queries.forEach(q => {
      console.log(`ID: ${q.id}, 名称: ${q.name}, 状态: ${q.status}, 服务状态: ${q.serviceStatus}`);
    });
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkQueries();