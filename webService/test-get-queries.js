const { QueryService } = require('./dist/services/query.service');
const queryService = new QueryService();

async function testGetQueries() {
  try {
    console.log('测试不带includeDrafts参数:');
    const result1 = await queryService.getQueries({});
    console.log(`获取到 ${result1.items.length} 条记录`);
    
    console.log('\n测试带includeDrafts=true参数:');
    const result2 = await queryService.getQueries({ includeDrafts: true });
    console.log(`获取到 ${result2.items.length} 条记录`);
    
    console.log('\n测试带includeDrafts=true和sortBy参数:');
    const result3 = await queryService.getQueries({ 
      includeDrafts: true,
      sortBy: 'updatedAt',
      sortDir: 'desc'
    });
    console.log(`获取到 ${result3.items.length} 条记录`);
    
    if (result3.items.length > 0) {
      console.log('记录ID:');
      result3.items.forEach(item => {
        console.log(`- ${item.id}, 状态: ${item.status}`);
      });
    }
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testGetQueries();