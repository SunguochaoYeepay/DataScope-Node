const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createTestQuery() {
  try {
    const result = await prisma.query.create({
      data: {
        name: '测试查询',
        description: '这是一个自动添加的测试查询',
        sqlContent: 'SELECT * FROM users',
        dataSourceId: '05293e16-70ce-4793-8eee-f7ead10235c5',
        status: 'PUBLISHED',
        serviceStatus: 'ENABLED',
        createdBy: 'system',
        updatedBy: 'system',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: '测试,示例'
      }
    });
    console.log('创建测试查询成功:', result);
  } catch (error) {
    console.error('创建测试查询失败:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestQuery();