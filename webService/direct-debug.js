const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 查看数据库中已存在的记录
async function examineQueries() {
  try {
    const queries = await prisma.query.findMany();
    console.log('数据库中的查询记录:');
    
    for(const query of queries) {
      console.log(`ID: ${query.id}`);
      console.log(`名称: ${query.name}`);
      console.log(`状态: ${query.status}`);
      console.log(`服务状态: ${query.serviceStatus}`);
      console.log('---------------------------');
    }
    
    // 尝试一个自定义查询
    console.log('\n尝试自定义查询:');
    const customQuery = await prisma.query.findMany({
      take: 5,
      orderBy: {
        updatedAt: 'desc'
      }
    });
    
    console.log(`自定义查询返回 ${customQuery.length} 条记录`);
    for(const q of customQuery) {
      console.log(`${q.id} | ${q.name} | ${q.status} | ${q.serviceStatus}`);
    }
    
  } catch (error) {
    console.error('查询失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 添加一条带DRAFT状态的测试记录
async function addDraftQuery() {
  try {
    const result = await prisma.query.create({
      data: {
        name: 'DRAFT测试查询',
        description: '测试DRAFT状态的记录',
        sqlContent: 'SELECT * FROM test_table',
        dataSourceId: '05293e16-70ce-4793-8eee-f7ead10235c5', // 使用已有的数据源ID
        status: 'DRAFT',
        serviceStatus: 'ENABLED',
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: '测试,草稿'
      }
    });
    
    console.log('成功创建DRAFT查询:', result);
  } catch (error) {
    console.error('创建查询失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 根据命令行参数执行不同操作
const args = process.argv.slice(2);
if (args[0] === 'add') {
  addDraftQuery();
} else {
  examineQueries();
}