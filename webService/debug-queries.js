// 调试脚本：测试查询列表API中includeDrafts参数的处理

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 创建一个DRAFT状态的查询用于测试
async function createDraftQuery() {
  try {
    // 检查是否已经有DRAFT状态的查询
    const existingDrafts = await prisma.query.findMany({
      where: { status: 'DRAFT' }
    });

    if (existingDrafts.length > 0) {
      console.log('数据库中已存在DRAFT状态的查询：', existingDrafts.length, '条');
      return;
    }

    // 创建一个新的DRAFT状态查询
    const draftQuery = await prisma.query.create({
      data: {
        name: '测试草稿查询',
        description: '这是一个测试草稿查询',
        dataSourceId: '05293e16-70ce-4793-8eee-f7ead10235c5', // 确保这是一个存在的数据源ID
        sqlContent: 'SELECT * FROM test',
        status: 'DRAFT',
        queryType: 'SQL',
        tags: '测试,草稿',
        createdBy: 'system',
        updatedBy: 'system',
        serviceStatus: 'ENABLED'
      }
    });

    console.log('创建了一个新的DRAFT状态查询：', draftQuery);
  } catch (error) {
    console.error('创建DRAFT查询失败：', error);
  }
}

// 测试不同includeDrafts参数值的结果
async function testIncludeDrafts() {
  try {
    console.log('\n====== 测试数据库中的所有查询 ======');
    const allQueries = await prisma.query.findMany();
    console.log(`数据库中共有 ${allQueries.length} 条查询记录`);
    
    allQueries.forEach(query => {
      console.log(`ID: ${query.id}, 名称: ${query.name}, 状态: ${query.status}, 服务状态: ${query.serviceStatus}`);
    });

    console.log('\n====== 测试不带includeDrafts参数 ======');
    // 模拟默认查询：只返回PUBLISHED状态的查询
    const publishedQueries = await prisma.query.findMany({
      where: { status: 'PUBLISHED' }
    });
    console.log(`找到 ${publishedQueries.length} 条PUBLISHED状态的查询`);
    
    console.log('\n====== 测试includeDrafts=true参数 ======');
    // 模拟includeDrafts=true：应返回所有状态的查询
    const allStatusQueries = await prisma.query.findMany();
    console.log(`找到 ${allStatusQueries.length} 条查询（所有状态）`);
    
    // 打印每种状态的数量
    const statusCounts = allStatusQueries.reduce((acc, query) => {
      acc[query.status] = (acc[query.status] || 0) + 1;
      return acc;
    }, {});
    console.log('各状态数量：', statusCounts);
    
    // 细分检查
    const draftQueries = allStatusQueries.filter(q => q.status === 'DRAFT');
    console.log(`DRAFT状态查询：${draftQueries.length} 条`);
    
    const deprecatedQueries = allStatusQueries.filter(q => q.status === 'DEPRECATED');
    console.log(`DEPRECATED状态查询：${deprecatedQueries.length} 条`);
    
    // 检查includeDrafts字符串参数解析
    console.log('\n====== 测试字符串参数解析 ======');
    const stringValues = ['true', 'True', 'TRUE', 'false', 'False', 'FALSE', '1', '0'];
    
    stringValues.forEach(value => {
      const parsedValue = value.toLowerCase() === 'true' || value === '1';
      console.log(`字符串值 "${value}" 解析为布尔值: ${parsedValue}`);
    });
    
  } catch (error) {
    console.error('测试查询失败：', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function main() {
  try {
    // 先创建测试数据
    await createDraftQuery();
    
    // 然后测试includeDrafts参数
    await testIncludeDrafts();
  } catch (error) {
    console.error('调试失败：', error);
  }
}

main();