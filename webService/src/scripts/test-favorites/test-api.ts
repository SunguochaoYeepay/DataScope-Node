/**
 * 查询收藏API测试脚本
 * 
 * 用于测试查询收藏相关API的可用性
 */
import axios from 'axios';

// API配置
const api = axios.create({
  baseURL: 'http://localhost:5000',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer simulated-token'
  }
});

// 测试数据
const testQueryId = '00000000-0000-0000-0000-000000000001'; // 示例查询ID

/**
 * 测试获取收藏列表
 */
async function testGetFavorites() {
  try {
    console.log('测试获取收藏列表...');
    const response = await api.get('/api/queries/favorites');
    console.log('收藏列表接口响应:', JSON.stringify(response.data, null, 2));
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('获取收藏列表失败:', error.message);
    if (error.response) {
      console.error('错误响应:', JSON.stringify(error.response.data, null, 2));
    }
    return { success: false, error };
  }
}

/**
 * 测试添加收藏
 */
async function testAddFavorite() {
  try {
    console.log(`测试添加收藏，查询ID: ${testQueryId}...`);
    const response = await api.post(`/api/queries/${testQueryId}/favorite`);
    console.log('添加收藏接口响应:', JSON.stringify(response.data, null, 2));
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('添加收藏失败:', error.message);
    if (error.response) {
      console.error('错误响应:', JSON.stringify(error.response.data, null, 2));
    }
    return { success: false, error };
  }
}

/**
 * 测试检查收藏状态
 */
async function testCheckFavoriteStatus() {
  try {
    console.log(`测试检查收藏状态，查询ID: ${testQueryId}...`);
    const response = await api.get(`/api/queries/${testQueryId}/favorite/status`);
    console.log('检查收藏状态接口响应:', JSON.stringify(response.data, null, 2));
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('检查收藏状态失败:', error.message);
    if (error.response) {
      console.error('错误响应:', JSON.stringify(error.response.data, null, 2));
    }
    return { success: false, error };
  }
}

/**
 * 测试移除收藏
 */
async function testRemoveFavorite() {
  try {
    console.log(`测试移除收藏，查询ID: ${testQueryId}...`);
    const response = await api.delete(`/api/queries/${testQueryId}/favorite`);
    console.log('移除收藏接口响应:', JSON.stringify(response.data, null, 2));
    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('移除收藏失败:', error.message);
    if (error.response) {
      console.error('错误响应:', JSON.stringify(error.response.data, null, 2));
    }
    return { success: false, error };
  }
}

/**
 * 运行所有测试
 */
async function runTests() {
  console.log('🚀 开始测试查询收藏API...\n');
  
  console.log('\n------------------------------\n');
  
  // 运行测试
  const results: Record<string, boolean> = {};
  
  // 测试获取收藏列表
  const getFavoritesResult = await testGetFavorites();
  results['获取收藏列表'] = getFavoritesResult.success;
  
  console.log('\n------------------------------\n');
  
  // 测试添加收藏
  const addFavoriteResult = await testAddFavorite();
  results['添加收藏'] = addFavoriteResult.success;
  
  console.log('\n------------------------------\n');
  
  // 测试检查收藏状态
  const checkStatusResult = await testCheckFavoriteStatus();
  results['检查收藏状态'] = checkStatusResult.success;
  
  console.log('\n------------------------------\n');
  
  // 测试移除收藏
  const removeFavoriteResult = await testRemoveFavorite();
  results['移除收藏'] = removeFavoriteResult.success;
  
  console.log('\n------------------------------\n');
  
  // 输出测试结果汇总
  console.log('📊 测试结果汇总:');
  let allPassed = true;
  
  for (const [testName, success] of Object.entries(results)) {
    console.log(`${testName}: ${success ? '✅ 通过' : '❌ 失败'}`);
    if (!success) allPassed = false;
  }
  
  if (allPassed) {
    console.log('\n🎉 所有测试通过! API接口符合规范，请求与响应正常。');
    process.exit(0);
  } else {
    console.log('\n❌ 有测试未通过，需要检查API接口问题');
    process.exit(1);
  }
}

// 运行测试
runTests().catch(error => {
  console.error('测试过程中发生错误:', error);
  process.exit(1);
});