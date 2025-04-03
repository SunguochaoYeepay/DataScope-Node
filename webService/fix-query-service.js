// 修复查询服务中的includeDrafts参数处理问题

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testFixedQuery() {
  try {
    console.log('\n====== 测试数据库中的所有查询 ======');
    const allQueries = await prisma.query.findMany();
    console.log(`数据库中共有 ${allQueries.length} 条查询记录`);
    
    // 统计各状态数量
    const statusCounts = allQueries.reduce((acc, query) => {
      acc[query.status] = (acc[query.status] || 0) + 1;
      return acc;
    }, {});
    console.log('各状态数量：', statusCounts);
    
    // 打印每条查询的基本信息
    allQueries.forEach(query => {
      console.log(`ID: ${query.id}, 名称: ${query.name}, 状态: ${query.status}, 服务状态: ${query.serviceStatus}`);
    });
    
    // 正确获取所有查询（不添加status过滤）
    console.log('\n====== 正确获取所有查询（不添加status过滤） ======');
    const result = await prisma.query.findMany({
      orderBy: { createdAt: 'desc' }
    });
    console.log(`找到 ${result.length} 条记录`);
    
    // 统计结果中各状态的数量
    const resultStatusCounts = result.reduce((acc, query) => {
      acc[query.status] = (acc[query.status] || 0) + 1;
      return acc;
    }, {});
    console.log('返回结果中各状态数量：', resultStatusCounts);
    
    // 检查每条查询
    result.forEach(query => {
      console.log(`ID: ${query.id.slice(0, 8)}..., 名称: ${query.name}, 状态: ${query.status}`);
    });
    
    // 检查前端请求的条件
    console.log('\n====== 检查前端的请求条件 ======');
    
    // 尝试模拟前端请求，获取所有查询
    console.log('\n尝试模拟前端请求，获取所有查询');
    await simulateFrontendRequest({
      includeDrafts: true
    });
    
    // 尝试模拟前端请求，只获取PUBLISHED状态的查询
    console.log('\n尝试模拟前端请求，只获取PUBLISHED状态的查询');
    await simulateFrontendRequest({
      includeDrafts: false
    });
    
    // 提供修复建议
    console.log('\n====== 修复建议 ======');
    console.log(`
1. 在 query.service.ts 中的 getQueries 方法中，当 includeDrafts=true 时，不应该添加任何 status 过滤条件：

if (!includeDrafts) {
  where.status = 'PUBLISHED';
} else if (options.isPublic !== undefined) {
  where.status = options.isPublic ? 'PUBLISHED' : 'DRAFT';
}
// 注意：这里不再添加 else 分支，当 includeDrafts=true 且 isPublic 未指定时，不添加 status 过滤条件

2. 确保前端传递 includeDrafts=true 参数时，正确地将其作为布尔值或字符串 'true' 传递：

// 在前端调用API时
const result = await queryStore.fetchQueries({
  includeDrafts: true,
  // 其他参数...
});

3. 确保 API Controller 正确处理布尔值参数：

const includeAllDrafts = 
  includeDrafts === 'true' || 
  (typeof includeDrafts === 'boolean' && includeDrafts === true) || 
  String(includeDrafts || '').toLowerCase() === 'true';
`);
    
  } catch (error) {
    console.error('测试失败：', error);
  } finally {
    await prisma.$disconnect();
  }
}

// 模拟前端请求
async function simulateFrontendRequest(options = {}) {
  try {
    // 构建查询条件
    const where = {};
    
    // 检查 includeDrafts 参数
    const includeDrafts = !!options.includeDrafts;
    console.log('includeDrafts 参数值:', options.includeDrafts, '处理后:', includeDrafts);
    
    // 根据 includeDrafts 参数添加过滤条件
    if (!includeDrafts) {
      where.status = 'PUBLISHED';
      console.log('只查询 PUBLISHED 状态');
    } else {
      console.log('查询所有状态');
      // 不添加 status 过滤条件
    }
    
    console.log('最终查询条件:', where);
    
    // 执行查询
    const result = await prisma.query.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`找到 ${result.length} 条记录`);
    
    // 统计结果中各状态的数量
    const statusCounts = result.reduce((acc, query) => {
      acc[query.status] = (acc[query.status] || 0) + 1;
      return acc;
    }, {});
    console.log('返回结果中各状态数量：', statusCounts);
    
    return result;
  } catch (error) {
    console.error('模拟请求失败：', error);
    return [];
  }
}

// 主函数
async function main() {
  await testFixedQuery();
}

main();