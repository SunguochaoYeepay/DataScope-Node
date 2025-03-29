/**
 * 查询计划功能测试脚本
 * 使用方法: node test/query-plan.test.js
 */

const axios = require('axios');

// 配置
const API_BASE_URL = 'http://localhost:3000/api';
const AUTH_TOKEN = 'your-auth-token'; // 替换为有效的认证令牌

// 测试数据
const TEST_DATA = {
  dataSourceId: 'your-datasource-id', // 替换为有效的数据源ID
  sql: 'SELECT * FROM users WHERE status = "active"'
};

// 测试函数
async function runTests() {
  console.log('===== 开始查询计划功能测试 =====');
  
  try {
    // 测试分析查询执行计划
    console.log('\n1. 测试分析查询执行计划:');
    const analyzePlanResponse = await axios.post(
      `${API_BASE_URL}/query-plans/analyze`,
      TEST_DATA,
      { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
    );
    
    if (analyzePlanResponse.data.success) {
      console.log('✅ 分析查询执行计划成功');
      console.log('- 查询计划ID:', analyzePlanResponse.data.data.id);
      console.log('- 执行计划节点数:', analyzePlanResponse.data.data.plan.planNodes.length);
      console.log('- 优化建议数:', analyzePlanResponse.data.data.plan.optimizationTips.length);
      
      // 保存分析结果以供后续测试使用
      const planId = analyzePlanResponse.data.data.id;
      const planData = analyzePlanResponse.data.data.plan;
      
      // 测试保存查询执行计划
      console.log('\n2. 测试保存查询执行计划:');
      const savePlanResponse = await axios.post(
        `${API_BASE_URL}/query-plans/save`,
        {
          dataSourceId: TEST_DATA.dataSourceId,
          name: '测试查询计划',
          sql: TEST_DATA.sql,
          planData
        },
        { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
      );
      
      if (savePlanResponse.data.success) {
        console.log('✅ 保存查询执行计划成功');
        console.log('- 保存的计划ID:', savePlanResponse.data.data.id);
        
        const savedPlanId = savePlanResponse.data.data.id;
        
        // 测试获取所有保存的查询执行计划
        console.log('\n3. 测试获取所有保存的查询执行计划:');
        const getAllPlansResponse = await axios.get(
          `${API_BASE_URL}/query-plans`,
          { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
        );
        
        if (getAllPlansResponse.data.success) {
          console.log('✅ 获取所有保存的查询执行计划成功');
          console.log('- 计划数量:', getAllPlansResponse.data.data.length);
          
          // 测试获取特定的查询执行计划
          console.log('\n4. 测试获取特定的查询执行计划:');
          const getSavedPlanResponse = await axios.get(
            `${API_BASE_URL}/query-plans/${savedPlanId}`,
            { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
          );
          
          if (getSavedPlanResponse.data.success) {
            console.log('✅ 获取特定的查询执行计划成功');
            console.log('- 计划名称:', getSavedPlanResponse.data.data.name);
            
            // 测试比较查询执行计划
            // 注意：这需要有两个不同的计划ID才能比较
            if (planId && savedPlanId && planId !== savedPlanId) {
              console.log('\n5. 测试比较查询执行计划:');
              try {
                const comparePlansResponse = await axios.post(
                  `${API_BASE_URL}/query-plans/compare`,
                  {
                    planAId: planId,
                    planBId: savedPlanId
                  },
                  { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
                );
                
                if (comparePlansResponse.data.success) {
                  console.log('✅ 比较查询执行计划成功');
                  console.log('- 成本差异:', comparePlansResponse.data.data.costDifference);
                  console.log('- 优化比例:', comparePlansResponse.data.data.improvement);
                } else {
                  console.log('❌ 比较查询执行计划失败:', comparePlansResponse.data.message);
                }
              } catch (error) {
                console.log('❌ 比较查询执行计划失败:', error.response?.data?.message || error.message);
              }
            } else {
              console.log('\n5. 测试比较查询执行计划: 跳过 (需要两个不同的计划ID)');
            }
            
            // 测试删除查询执行计划
            console.log('\n6. 测试删除查询执行计划:');
            const deletePlanResponse = await axios.delete(
              `${API_BASE_URL}/query-plans/${savedPlanId}`,
              { headers: { Authorization: `Bearer ${AUTH_TOKEN}` } }
            );
            
            if (deletePlanResponse.data.success) {
              console.log('✅ 删除查询执行计划成功');
            } else {
              console.log('❌ 删除查询执行计划失败:', deletePlanResponse.data.message);
            }
          } else {
            console.log('❌ 获取特定的查询执行计划失败:', getSavedPlanResponse.data.message);
          }
        } else {
          console.log('❌ 获取所有保存的查询执行计划失败:', getAllPlansResponse.data.message);
        }
      } else {
        console.log('❌ 保存查询执行计划失败:', savePlanResponse.data.message);
      }
    } else {
      console.log('❌ 分析查询执行计划失败:', analyzePlanResponse.data.message);
    }
  } catch (error) {
    console.error('❌ 测试过程中出错:', error.response?.data?.message || error.message);
  }
  
  console.log('\n===== 查询计划功能测试完成 =====');
}

// 执行测试
runTests();