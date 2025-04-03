/**
 * 查询版本控制API测试脚本
 */
import axios from 'axios';

// 基础配置
const API_BASE_URL = 'http://localhost:5000';
const API_TIMEOUT = 5000;

// 创建API客户端
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 模拟认证令牌
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJyb2xlIjoiVVNFUiIsImlhdCI6MTYxNjQwNjcwMCwiZXhwIjoxNjE2NDkzMTAwfQ.7ry0CQ5aHd_xJ8BUcRVxt8-_CzAu6bJHkiHXBCI1fIE';

// 添加认证头
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

/**
 * 测试健康检查接口
 */
async function testHealthEndpoint() {
  try {
    console.log('🧪 测试健康检查接口...');
    const response = await api.get('/health');
    console.log('✅ 健康检查测试通过:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ 健康检查测试失败:', error.message);
    return false;
  }
}

/**
 * 测试查询版本控制测试接口
 */
async function testQueryVersionEndpoint() {
  try {
    console.log('🧪 测试查询版本控制接口...');
    const response = await api.get('/api/query-version/test');
    console.log('✅ 查询版本控制接口测试通过:', response.data);
    return true;
  } catch (error: any) {
    console.error('❌ 查询版本控制接口测试失败:', error.message);
    return false;
  }
}

interface TestEndpoint {
  name: string;
  path: string;
}

/**
 * 测试其他API接口
 */
async function testOtherEndpoints() {
  const endpoints: TestEndpoint[] = [
    { name: '认证接口', path: '/api/auth/test' },
    { name: '用户接口', path: '/api/users/test' },
    { name: '数据源接口', path: '/api/data-sources/test' },
    { name: '查询接口', path: '/api/queries/test' }
  ];
  
  const results: Record<string, boolean> = {};
  
  for (const endpoint of endpoints) {
    try {
      console.log(`🧪 测试${endpoint.name}...`);
      const response = await api.get(endpoint.path);
      console.log(`✅ ${endpoint.name}测试通过:`, response.data);
      results[endpoint.name] = true;
    } catch (error: any) {
      console.error(`❌ ${endpoint.name}测试失败:`, error.message);
      results[endpoint.name] = false;
    }
  }
  
  return results;
}

/**
 * 运行所有测试
 */
async function runTests() {
  console.log('🚀 开始测试查询版本控制API...');
  
  // 运行测试
  const healthTest = await testHealthEndpoint();
  const versionTest = await testQueryVersionEndpoint();
  const otherTests = await testOtherEndpoints();
  
  // 输出结果
  console.log('\n📊 测试结果汇总:');
  console.log(`健康检查接口: ${healthTest ? '✅ 通过' : '❌ 失败'}`);
  console.log(`查询版本控制接口: ${versionTest ? '✅ 通过' : '❌ 失败'}`);
  
  for (const [name, result] of Object.entries(otherTests)) {
    console.log(`${name}: ${result ? '✅ 通过' : '❌ 失败'}`);
  }
  
  // 最终结果
  const allPassed = healthTest && versionTest && Object.values(otherTests).every(r => r);
  console.log(`\n${allPassed ? '🎉 所有测试通过!' : '❌ 部分测试失败'}`);
  
  process.exit(allPassed ? 0 : 1);
}

// 执行测试
runTests().catch((error: any) => {
  console.error('❌ 测试执行失败:', error);
  process.exit(1);
});