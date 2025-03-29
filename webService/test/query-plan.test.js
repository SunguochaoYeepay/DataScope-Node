/**
 * 查询执行计划功能测试
 * 
 * 此测试文件用于验证MySQL查询执行计划分析功能
 */

const { MySQLQueryPlanConverter } = require('../dist/database-core/query-plan/mysql-query-plan-converter');
const { MySQLPlanAnalyzer } = require('../dist/database-core/query-plan/mysql-plan-analyzer');

// 模拟MySQL传统格式的EXPLAIN结果
const mockTraditionalExplainData = [
  {
    id: 1,
    select_type: 'SIMPLE',
    table: 'users',
    partitions: null,
    type: 'ALL',
    possible_keys: null,
    key: null,
    key_len: null,
    ref: null,
    rows: 10000,
    filtered: 100,
    Extra: null
  },
  {
    id: 1,
    select_type: 'SIMPLE',
    table: 'orders',
    partitions: null,
    type: 'ref',
    possible_keys: 'user_id_idx',
    key: 'user_id_idx',
    key_len: '4',
    ref: 'db.users.id',
    rows: 10,
    filtered: 100,
    Extra: 'Using where'
  }
];

// 模拟MySQL JSON格式的EXPLAIN结果
const mockJsonExplainData = {
  query_block: {
    select_id: 1,
    cost_info: {
      query_cost: '1046.15'
    },
    nested_loop: [
      {
        table: {
          table_name: 'users',
          access_type: 'ALL',
          rows: 10000,
          filtered: 100,
          cost_info: {
            read_cost: '1000.00',
            eval_cost: '1.00',
            prefix_cost: '1001.00',
            data_read_per_join: '100K'
          }
        }
      },
      {
        table: {
          table_name: 'orders',
          access_type: 'ref',
          possible_keys: [
            { key_name: 'user_id_idx' }
          ],
          key: 'user_id_idx',
          key_length: '4',
          ref: [
            'db.users.id'
          ],
          rows: 10,
          filtered: 100,
          using_index: true,
          cost_info: {
            read_cost: '4.50',
            eval_cost: '0.50',
            prefix_cost: '1045.15',
            data_read_per_join: '1K'
          }
        }
      }
    ]
  }
};

// 测试SQL查询
const testQuery = 'SELECT u.name, o.order_date, o.total_amount FROM users u JOIN orders o ON u.id = o.user_id WHERE u.status = "active"';

// 测试MySQL查询计划转换器
console.log('=== 测试MySQL查询计划转换器 ===');
const converter = new MySQLQueryPlanConverter();

// 测试传统格式转换
console.log('\n>> 转换传统格式EXPLAIN结果');
try {
  const traditionalPlan = converter.convertTraditionalExplain(mockTraditionalExplainData, testQuery);
  console.log('✅ 转换成功');
  console.log(`- 节点数量: ${traditionalPlan.planNodes.length}`);
  console.log(`- 估算行数: ${traditionalPlan.estimatedRows}`);
} catch (error) {
  console.error('❌ 转换失败:', error.message);
}

// 测试JSON格式转换
console.log('\n>> 转换JSON格式EXPLAIN结果');
try {
  const jsonPlan = converter.convertJsonExplain(mockJsonExplainData, testQuery);
  console.log('✅ 转换成功');
  console.log(`- 节点数量: ${jsonPlan.planNodes.length}`);
  console.log(`- 估算行数: ${jsonPlan.estimatedRows}`);
  console.log(`- 估算成本: ${jsonPlan.estimatedCost}`);
} catch (error) {
  console.error('❌ 转换失败:', error.message);
}

// 测试MySQL查询计划分析器
console.log('\n=== 测试MySQL查询计划分析器 ===');
const analyzer = new MySQLPlanAnalyzer();

// 转换为可分析的计划格式
const planToAnalyze = converter.convertTraditionalExplain(mockTraditionalExplainData, testQuery);

// 分析计划
console.log('\n>> 分析查询执行计划');
try {
  const analyzedPlan = analyzer.analyze(planToAnalyze);
  console.log('✅ 分析成功');
  console.log(`- 警告数量: ${analyzedPlan.warnings.length}`);
  console.log(`- 优化建议: ${analyzedPlan.optimizationTips.length}`);
  
  if (analyzedPlan.warnings.length > 0) {
    console.log('\n>> 发现的警告:');
    analyzedPlan.warnings.forEach(warning => console.log(`  - ${warning}`));
  }
  
  if (analyzedPlan.optimizationTips.length > 0) {
    console.log('\n>> 优化建议:');
    analyzedPlan.optimizationTips.forEach(tip => console.log(`  - ${tip}`));
  }
  
  if (analyzedPlan.performanceAnalysis) {
    console.log('\n>> 性能分析:');
    console.log(`  - 发现瓶颈: ${analyzedPlan.performanceAnalysis.bottlenecks.length}`);
    console.log(`  - 索引问题: ${analyzedPlan.performanceAnalysis.indexUsage.missingIndexes.length + 
                           analyzedPlan.performanceAnalysis.indexUsage.inefficientIndexes.length}`);
    console.log(`  - 连接问题: ${analyzedPlan.performanceAnalysis.joinAnalysis.length}`);
  }
} catch (error) {
  console.error('❌ 分析失败:', error.message);
}

console.log('\n=== 测试完成 ===');