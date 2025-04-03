<template>
  <div class="h-full flex flex-col bg-gray-100">
    <!-- 头部导航和标题 -->
    <div class="bg-white border-b border-gray-200 px-4 py-4">
      <div class="container mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <router-link 
              :to="`/query/detail/${queryId}`" 
              class="text-gray-500 hover:text-gray-700 flex items-center"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              返回查询详情
            </router-link>
            <h1 class="text-xl font-semibold text-gray-800">
              版本详情 
              <span class="text-blue-600 ml-2">V{{ versionNumber }}</span>
            </h1>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="handleActivate"
              v-if="!isActiveVersion && versionData?.status === 'PUBLISHED'"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <i class="fas fa-check-circle mr-2"></i>
              设为活跃版本
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span class="text-gray-600">加载版本信息...</span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="errorMessage" class="flex-1 flex items-center justify-center">
      <div class="text-center">
        <i class="fas fa-exclamation-triangle text-3xl text-red-500 mb-3"></i>
        <h2 class="text-xl font-medium text-gray-800 mb-2">加载失败</h2>
        <p class="text-gray-600 mb-4">{{ errorMessage }}</p>
        <div class="flex justify-center space-x-3">
          <button
            @click="loadVersionData"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            重试
          </button>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div v-else class="flex-1 overflow-auto container mx-auto px-4 py-6">
      <!-- 版本基本信息 -->
      <div class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 class="text-sm font-medium text-gray-500">版本状态</h3>
            <div class="mt-1">
              <span
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="{
                  'bg-yellow-100 text-yellow-800': versionData?.status === 'DRAFT',
                  'bg-green-100 text-green-800': versionData?.status === 'PUBLISHED',
                  'bg-gray-100 text-gray-800': versionData?.status === 'DEPRECATED'
                }"
              >
                {{ formatVersionStatus(versionData?.status) }}
              </span>
              <span v-if="isActiveVersion" class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                <i class="fas fa-check-circle mr-1"></i>
                活跃版本
              </span>
            </div>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">创建时间</h3>
            <p class="mt-1 text-sm text-gray-900">{{ formatDateTime(versionData?.createdAt) }}</p>
          </div>
          
          <div>
            <h3 class="text-sm font-medium text-gray-500">发布时间</h3>
            <p class="mt-1 text-sm text-gray-900">{{ versionData?.publishedAt ? formatDateTime(versionData?.publishedAt) : '尚未发布' }}</p>
          </div>
        </div>

        <div class="mt-4">
          <h3 class="text-sm font-medium text-gray-500">查询内容</h3>
          <div class="mt-1 p-3 bg-gray-50 rounded border border-gray-200 overflow-auto max-h-64">
            <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ versionData?.queryText }}</pre>
          </div>
        </div>
      </div>

      <!-- 标签页导航 -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="border-b border-gray-200">
          <nav class="flex -mb-px">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                'py-4 px-6 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-200'
              ]"
            >
              <i :class="['fas mr-2', tab.icon]"></i>
              {{ tab.label }}
            </button>
          </nav>
        </div>
      </div>

      <!-- 执行历史标签页 -->
      <div v-if="activeTab === 'execution-history'" class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">执行历史</h2>
        </div>

        <div v-if="isLoadingHistory" class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="executionHistory.length === 0" class="text-center py-12">
          <i class="fas fa-history text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500">此版本暂无执行历史记录</p>
        </div>
        <div v-else>
          <!-- 执行历史列表 -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">执行时间</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">执行用时</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">结果行数</th>
                  <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="history in executionHistory" :key="history.id">
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDateTime(history.executedAt) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span 
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="{
                        'bg-green-100 text-green-800': history.status === 'SUCCESS',
                        'bg-red-100 text-red-800': history.status === 'ERROR',
                        'bg-yellow-100 text-yellow-800': history.status === 'CANCELLED',
                        'bg-blue-100 text-blue-800': history.status === 'RUNNING'
                      }"
                    >
                      {{ formatExecutionStatus(history.status) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatExecutionTime(history.executionTime) }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ history.resultRowCount || '-' }}</td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      @click="viewExecutionDetails(history.id)"
                      class="text-indigo-600 hover:text-indigo-900"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 执行计划标签页 -->
      <div v-if="activeTab === 'execution-plan'" class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">执行计划</h2>
        </div>

        <div v-if="isLoadingPlan" class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="!executionPlan" class="text-center py-12">
          <i class="fas fa-project-diagram text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500">此版本暂无执行计划</p>
          <p class="text-gray-400 text-sm mt-2">需要先执行查询才能获取执行计划</p>
        </div>
        <div v-else>
          <!-- 执行计划内容 -->
          <div class="p-4 bg-gray-50 rounded-lg overflow-auto max-h-96">
            <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ JSON.stringify(executionPlan, null, 2) }}</pre>
          </div>
        </div>
      </div>

      <!-- 查询结果标签页 -->
      <div v-if="activeTab === 'results'" class="bg-white shadow rounded-lg p-6 mb-6">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium text-gray-900">查询结果</h2>
          <div v-if="queryResults && queryResults.length > 0" class="flex space-x-2">
            <button
              @click="exportResults('csv')"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
            >
              <i class="fas fa-file-csv mr-1.5"></i>
              导出CSV
            </button>
            <button
              @click="exportResults('excel')"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
            >
              <i class="fas fa-file-excel mr-1.5"></i>
              导出Excel
            </button>
          </div>
        </div>

        <div v-if="isLoadingResults" class="flex justify-center py-12">
          <div class="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div v-else-if="!queryResults || queryResults.length === 0" class="text-center py-12">
          <i class="fas fa-table text-4xl text-gray-300 mb-3"></i>
          <p class="text-gray-500">此版本暂无查询结果</p>
          <p class="text-gray-400 text-sm mt-2">需要先执行查询才能查看结果</p>
          <button
            @click="executeQuery"
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-play mr-2"></i>
            执行查询
          </button>
        </div>
        <div v-else>
          <!-- 查询结果表格 -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th v-for="(column, index) in queryResultColumns" :key="index" scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {{ column }}
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="(row, rowIndex) in queryResults" :key="rowIndex">
                  <td v-for="(column, colIndex) in queryResultColumns" :key="colIndex" class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ row[column] }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <!-- 分页控件 -->
          <div v-if="totalResultPages > 1" class="flex justify-between items-center mt-4">
            <div class="text-sm text-gray-500">
              显示 {{ (currentResultPage - 1) * resultPageSize + 1 }} - {{ Math.min(currentResultPage * resultPageSize, totalResultRows) }} 行，共 {{ totalResultRows }} 行
            </div>
            <div class="flex space-x-2">
              <button
                @click="prevResultPage"
                :disabled="currentResultPage <= 1"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
                :class="{ 'opacity-50 cursor-not-allowed': currentResultPage <= 1 }"
              >
                <i class="fas fa-chevron-left mr-1.5"></i>
                上一页
              </button>
              <button
                @click="nextResultPage"
                :disabled="currentResultPage >= totalResultPages"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
                :class="{ 'opacity-50 cursor-not-allowed': currentResultPage >= totalResultPages }"
              >
                下一页
                <i class="fas fa-chevron-right ml-1.5"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import type { QueryVersion, QueryVersionStatus } from '@/types/queryVersion';
import type { ExecutionHistory, ExecutionStatus } from '@/types/executionHistory';
import versionService from '@/services/queryVersion';
// 注释掉或删除不存在的导入
// import executionService from '@/services/execution';
import { useQueryStore } from '@/stores/query';

const route = useRoute();
const router = useRouter();
const queryStore = useQueryStore();

// 从路由参数获取查询ID和版本ID
const queryId = computed(() => route.params.id as string);
const versionId = computed(() => route.params.versionId as string);
const versionNumber = ref<number>(0);

// 状态变量
const isLoading = ref(true);
const isLoadingHistory = ref(false);
const isLoadingPlan = ref(false);
const isLoadingResults = ref(false);
const errorMessage = ref('');
const versionData = ref<QueryVersion | null>(null);
const executionHistory = ref<ExecutionHistory[]>([]);
const executionPlan = ref<any>(null);
const activeTab = ref('execution-history');
const isActiveVersion = ref(false);

// 查询结果相关变量
const queryResults = ref<Array<Record<string, any>>>([]);
const queryResultColumns = ref<string[]>([]);
const currentResultPage = ref(1);
const resultPageSize = ref(10);
const totalResultRows = ref(0);
const totalResultPages = computed(() => Math.ceil(totalResultRows.value / resultPageSize.value));

// 标签页定义
const tabs = [
  { id: 'execution-history', label: '执行历史', icon: 'fa-history' },
  { id: 'execution-plan', label: '执行计划', icon: 'fa-project-diagram' },
  { id: 'results', label: '查询结果', icon: 'fa-table' },
  { id: 'visualization', label: '可视化', icon: 'fa-chart-bar' },
  { id: 'optimization', label: '优化建议', icon: 'fa-lightbulb' }
];

// 加载版本数据
const loadVersionData = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    // 获取版本详情
    // 在实际应用中，这里应该调用API获取数据
    // 这里使用模拟数据
    console.log(`加载版本数据，查询ID: ${queryId.value}, 版本ID: ${versionId.value}`);
    
    // 获取主查询信息
    const query = await queryStore.getQuery(queryId.value);
    if (!query) {
      errorMessage.value = '无法找到对应的查询信息';
      isLoading.value = false;
      return;
    }
    
    // 模拟版本数据
    // 提取版本号（假设版本ID格式为 version-{queryId}-{number}）
    const versionIdParts = versionId.value.split('-');
    const extractedVersionNumber = versionIdParts[versionIdParts.length - 1];
    versionNumber.value = parseInt(extractedVersionNumber) || 1;
    
    // 创建版本数据
    versionData.value = {
      id: versionId.value,
      queryId: queryId.value,
      versionNumber: versionNumber.value,
      status: 'PUBLISHED' as QueryVersionStatus,
      queryText: query.queryText || 'SELECT * FROM customers LIMIT 100',
      createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      publishedAt: versionNumber.value === 1 ? new Date(Date.now() - 6 * 86400000).toISOString() : null,
      isActive: versionNumber.value === 1, // 假设版本1是活跃版本
      deprecatedAt: null
    };
    
    // 设置是否为活跃版本
    isActiveVersion.value = versionData.value.isActive || false;
    
    // 加载执行历史
    await loadExecutionHistory();
    
    isLoading.value = false;
  } catch (error) {
    console.error('Failed to load version data:', error);
    errorMessage.value = error instanceof Error 
      ? `无法加载版本信息: ${error.message}` 
      : '无法加载版本信息，请稍后重试';
    isLoading.value = false;
  }
};

// 加载执行历史
const loadExecutionHistory = async () => {
  isLoadingHistory.value = true;
  try {
    // 这里应该调用API获取执行历史数据
    console.log(`加载执行历史，版本ID: ${versionId.value}`);
    
    // 模拟执行历史数据
    executionHistory.value = [
      {
        id: `exec-${versionId.value}-1`,
        queryId: queryId.value,
        versionId: versionId.value,
        executedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        status: 'SUCCESS' as ExecutionStatus,
        executionTime: 1240, // 毫秒
        resultRowCount: 150,
        userId: 'user-1',
        error: null
      },
      {
        id: `exec-${versionId.value}-2`,
        queryId: queryId.value,
        versionId: versionId.value,
        executedAt: new Date(Date.now() - 4 * 86400000).toISOString(),
        status: 'ERROR' as ExecutionStatus,
        executionTime: 320, // 毫秒
        resultRowCount: 0,
        userId: 'user-1',
        error: 'Table not found: customers'
      }
    ];
    
    // 加载执行计划
    await loadExecutionPlan();
    
    isLoadingHistory.value = false;
  } catch (error) {
    console.error('Failed to load execution history:', error);
    isLoadingHistory.value = false;
  }
};

// 加载执行计划
const loadExecutionPlan = async () => {
  isLoadingPlan.value = true;
  try {
    // 这里应该调用API获取执行计划数据
    console.log(`加载执行计划，版本ID: ${versionId.value}`);
    
    // 模拟执行计划数据
    executionPlan.value = {
      plan: {
        nodeType: 'Seq Scan',
        relation: 'customers',
        alias: 'customers',
        startupCost: 0.00,
        totalCost: 22.70,
        rows: 1270,
        width: 204
      },
      planningTime: 0.052,
      executionTime: 0.078
    };
    
    isLoadingPlan.value = false;
  } catch (error) {
    console.error('Failed to load execution plan:', error);
    isLoadingPlan.value = false;
  }
};

// 查看执行详情
const viewExecutionDetails = (executionId: string) => {
  console.log(`查看执行详情: ${executionId}`);
  message.info('执行详情功能开发中...');
};

// 设为活跃版本
const handleActivate = async () => {
  try {
    console.log(`设置版本 ${versionId.value} 为活跃版本`);
    
    // 模拟激活版本
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 更新本地数据
    isActiveVersion.value = true;
    if (versionData.value) {
      versionData.value.isActive = true;
    }
    
    message.success('已将当前版本设置为活跃版本');
  } catch (error) {
    console.error('Failed to activate version:', error);
    message.error('设置活跃版本失败，请稍后重试');
  }
};

// 格式化版本状态显示
const formatVersionStatus = (status?: QueryVersionStatus): string => {
  if (!status) return '-';
  const statusMap: Record<QueryVersionStatus, string> = {
    'DRAFT': '草稿',
    'PUBLISHED': '已发布',
    'DEPRECATED': '已废弃'
  };
  return statusMap[status] || status;
};

// 格式化执行状态
const formatExecutionStatus = (status?: ExecutionStatus): string => {
  if (!status) return '-';
  const statusMap: Record<ExecutionStatus, string> = {
    'SUCCESS': '成功',
    'ERROR': '失败',
    'RUNNING': '执行中',
    'CANCELLED': '已取消'
  };
  return statusMap[status] || status;
};

// 格式化日期和时间
const formatDateTime = (dateString?: string): string => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// 格式化执行时间
const formatExecutionTime = (ms?: number): string => {
  if (!ms) return '-';
  if (ms < 1000) return `${ms}毫秒`;
  return `${(ms / 1000).toFixed(2)}秒`;
};

// 加载查询结果
const loadQueryResults = async () => {
  isLoadingResults.value = true;
  try {
    // 这里应该调用API获取查询结果数据
    console.log(`加载查询结果，版本ID: ${versionId.value}`);
    
    // 模拟查询结果数据
    // 在实际应用中，这里应该从API获取数据
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 模拟列名
    queryResultColumns.value = ['id', 'name', 'email', 'phone', 'city'];
    
    // 模拟结果数据
    const mockResults = [];
    for (let i = 0; i < 25; i++) {
      mockResults.push({
        id: i + 1,
        name: `Customer ${i + 1}`,
        email: `customer${i+1}@example.com`,
        phone: `+1 555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`,
        city: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'][Math.floor(Math.random() * 5)]
      });
    }
    
    // 设置分页相关数据
    totalResultRows.value = mockResults.length;
    
    // 获取当前页数据
    const startIndex = (currentResultPage.value - 1) * resultPageSize.value;
    const endIndex = Math.min(startIndex + resultPageSize.value, mockResults.length);
    queryResults.value = mockResults.slice(startIndex, endIndex);
    
    isLoadingResults.value = false;
  } catch (error) {
    console.error('Failed to load query results:', error);
    isLoadingResults.value = false;
  }
};

// 执行查询
const executeQuery = async () => {
  if (!versionData.value || !versionData.value.queryText) {
    message.error('无法执行查询，查询内容为空');
    return;
  }
  
  try {
    message.loading('正在执行查询...');
    
    // 模拟查询执行
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // 加载查询结果
    await loadQueryResults();
    
    message.success('查询执行成功');
  } catch (error) {
    console.error('Failed to execute query:', error);
    message.error('查询执行失败，请稍后重试');
  }
};

// 导出结果
const exportResults = (format: 'csv' | 'excel') => {
  if (!queryResults.value || queryResults.value.length === 0) {
    message.error('无可导出的查询结果');
    return;
  }
  
  message.success(`已开始导出查询结果为 ${format.toUpperCase()} 格式`);
  
  // 这里应该实现实际的导出逻辑
  console.log(`导出结果为 ${format} 格式`);
};

// 结果分页控制
const prevResultPage = () => {
  if (currentResultPage.value > 1) {
    currentResultPage.value--;
    loadQueryResults();
  }
};

const nextResultPage = () => {
  if (currentResultPage.value < totalResultPages.value) {
    currentResultPage.value++;
    loadQueryResults();
  }
};

// 监听标签页变化
const handleTabChange = (tabId: string) => {
  activeTab.value = tabId;
  
  // 根据选中的标签页加载相关数据
  if (tabId === 'execution-history' && executionHistory.value.length === 0) {
    loadExecutionHistory();
  } else if (tabId === 'execution-plan' && !executionPlan.value) {
    loadExecutionPlan();
  } else if (tabId === 'results' && queryResults.value.length === 0) {
    loadQueryResults();
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadVersionData();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
}
</style>