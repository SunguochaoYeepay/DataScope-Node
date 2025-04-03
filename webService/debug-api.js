const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugGetQueries() {
  try {
    // 测试不带includeDrafts参数
    const where1 = { status: 'PUBLISHED' };
    const total1 = await prisma.query.count({ where: where1 });
    const queries1 = await prisma.query.findMany({
      where: where1,
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log('=== 测试查询条件1 ===');
    console.log('条件:', JSON.stringify(where1));
    console.log('记录数:', total1);
    console.log('ID列表:', queries1.map(q => q.id).join(', '));
    
    // 测试includeDrafts=true参数
    const where2 = {}; // 不添加status过滤条件
    const total2 = await prisma.query.count({ where: where2 });
    const queries2 = await prisma.query.findMany({
      where: where2,
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log('\n=== 测试查询条件2 ===');
    console.log('条件:', JSON.stringify(where2));
    console.log('记录数:', total2);
    console.log('ID列表:', queries2.map(q => q.id).join(', '));
    
    // 直接检查数据库记录状态
    console.log('\n=== 数据库中所有查询的状态 ===');
    const allQueries = await prisma.query.findMany({
      select: {
        id: true,
        name: true,
        status: true,
        serviceStatus: true
      }
    });
    
    allQueries.forEach(q => {
      console.log(`ID: ${q.id}, 名称: ${q.name}, 状态: ${q.status}, 服务状态: ${q.serviceStatus}`);
    });
    
  } catch (error) {
    console.error('调试失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugGetQueries();