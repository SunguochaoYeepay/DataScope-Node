<template>
  <div class="h-full flex flex-col bg-gray-50">
    <!-- 头部导航和标题 -->
    <div class="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 px-4 py-4 shadow-sm">
      <div class="container mx-auto">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <router-link 
              :to="`/query/detail/${queryId}`" 
              class="text-gray-500 hover:text-indigo-600 flex items-center transition-colors duration-200"
            >
              <i class="fas fa-arrow-left mr-2"></i>
              返回查询详情
            </router-link>
            <h1 class="text-xl font-semibold text-gray-800 flex items-center">
              版本详情 
              <span class="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                V{{ versionNumber }}
              </span>
            </h1>
          </div>
          <div class="flex items-center space-x-3">
            <button
              @click="handleActivate"
              v-if="!isActiveVersion && versionData?.status === 'PUBLISHED'"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              <i class="fas fa-check-circle mr-2"></i>
              设为活跃版本
            </button>
            <button
              v-if="versionData?.queryText"
              @click="executeQuery"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
            >
              <i class="fas fa-play mr-2"></i>
              执行查询
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div class="flex flex-col items-center">
        <div class="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6"></div>
        <span class="text-gray-600 text-lg">加载版本信息...</span>
      </div>
    </div>

    <!-- 错误提示 -->
    <div v-else-if="errorMessage" class="flex-1 flex items-center justify-center">
      <div class="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
        <div class="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center mb-5">
          <i class="fas fa-exclamation-triangle text-3xl text-red-500"></i>
        </div>
        <h2 class="text-xl font-medium text-gray-800 mb-2">加载失败</h2>
        <p class="text-gray-600 mb-6">{{ errorMessage }}</p>
        <div class="flex justify-center space-x-3">
          <button
            @click="loadVersionData"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
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
      <div class="bg-white shadow rounded-lg overflow-hidden mb-6 border border-gray-200">
        <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 class="text-lg font-medium text-gray-800">版本信息</h2>
        </div>
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 class="text-sm font-medium text-gray-500 mb-2">版本状态</h3>
              <div class="flex items-center">
                <span
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800': versionData?.status === 'DRAFT',
                    'bg-green-100 text-green-800': versionData?.status === 'PUBLISHED',
                    'bg-gray-100 text-gray-800': versionData?.status === 'DEPRECATED'
                  }"
                >
                  <i :class="[
                    'mr-1.5',
                    versionData?.status === 'DRAFT' ? 'fas fa-pencil-alt' : '',
                    versionData?.status === 'PUBLISHED' ? 'fas fa-check' : '',
                    versionData?.status === 'DEPRECATED' ? 'fas fa-archive' : ''
                  ]"></i>
                  {{ formatVersionStatus(versionData?.status) }}
                </span>
                <span v-if="isActiveVersion" class="ml-3 inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  <i class="fas fa-star mr-1.5"></i>
                  活跃版本
                </span>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 class="text-sm font-medium text-gray-500 mb-2">创建时间</h3>
              <p class="text-sm text-gray-900 flex items-center">
                <i class="far fa-calendar-alt mr-2 text-indigo-500"></i>
                {{ formatDateTime(versionData?.createdAt) }}
              </p>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h3 class="text-sm font-medium text-gray-500 mb-2">发布时间</h3>
              <p class="text-sm text-gray-900 flex items-center">
                <i class="far fa-calendar-check mr-2 text-green-500"></i>
                {{ versionData?.publishedAt ? formatDateTime(versionData?.publishedAt) : '尚未发布' }}
              </p>
            </div>
          </div>

          <div class="mt-6">
            <h3 class="text-sm font-medium text-gray-500 mb-2 flex items-center">
              <i class="fas fa-code mr-2 text-indigo-500"></i>
              查询内容
            </h3>
            <div class="mt-1 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
              <div v-if="versionData?.queryText" class="relative">
                <div class="absolute right-2 top-2 flex space-x-2">
                  <button
                    @click="copyQueryText"
                    class="p-1.5 bg-white rounded shadow-sm text-gray-600 hover:text-indigo-600 transition-colors duration-200"
                    title="复制查询内容"
                  >
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
                <pre class="p-4 text-sm text-gray-800 whitespace-pre-wrap overflow-auto max-h-64">{{ versionData.queryText }}</pre>
              </div>
              <div v-else class="flex flex-col items-center justify-center py-10 px-4">
                <div class="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                  <i class="fas fa-exclamation-triangle text-yellow-500 text-xl"></i>
                </div>
                <p class="text-gray-600 font-medium mb-2">此版本没有查询内容</p>
                <p class="text-sm text-gray-500 text-center max-w-md">
                  可能是因为数据源未创建或数据导入过程中出错。请检查版本创建过程是否正确完成。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 标签页导航 -->
      <div class="bg-white shadow rounded-lg overflow-hidden mb-6 border border-gray-200">
        <div class="border-b border-gray-200">
          <nav class="flex" aria-label="Tabs">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              :class="[
                'py-4 px-6 text-sm font-medium',
                'transition-all duration-200 ease-in-out',
                activeTab === tab.id
                  ? 'border-b-2 border-indigo-500 text-indigo-600 bg-indigo-50 bg-opacity-50'
                  : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
              ]"
            >
              <div class="flex items-center space-x-2">
                <i :class="['fas', tab.icon]"></i>
                <span>{{ tab.label }}</span>
              </div>
            </button>
          </nav>
        </div>

        <!-- 内容区域 -->
        <div class="p-6">
          <!-- 执行历史标签页 -->
          <div v-if="activeTab === 'execution-history'" class="animate-fadeIn">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900 flex items-center">
                <i class="fas fa-history text-indigo-500 mr-2"></i>
                执行历史
              </h2>
              <button
                v-if="!isLoadingHistory && versionData?.queryText"
                @click="loadExecutionHistory"
                class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-indigo-500"
              >
                <i class="fas fa-sync-alt mr-1.5"></i>
                刷新
              </button>
            </div>

            <div v-if="isLoadingHistory" class="flex justify-center py-12">
              <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="executionHistory.length === 0" class="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-history text-gray-400 text-2xl"></i>
              </div>
              <p class="text-gray-600 font-medium mb-2">此版本暂无执行历史记录</p>
              <p class="text-sm text-gray-500 mb-4">尝试执行查询以生成历史记录</p>
              <button
                v-if="versionData?.queryText"
                @click="executeQuery"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <i class="fas fa-play mr-2"></i>
                执行查询
              </button>
            </div>
            <div v-else>
              <!-- 执行历史列表 -->
              <div class="overflow-x-auto bg-white rounded-lg border border-gray-200">
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
                    <tr v-for="history in executionHistory" :key="history.id" class="hover:bg-gray-50 transition-colors duration-150">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDateTime(history.executedAt) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          :class="{
                            'bg-green-100 text-green-800': String(history.status).toUpperCase() === 'SUCCESS',
                            'bg-red-100 text-red-800': String(history.status).toUpperCase() === 'ERROR',
                            'bg-yellow-100 text-yellow-800': String(history.status).toUpperCase() === 'CANCELLED',
                            'bg-blue-100 text-blue-800': String(history.status).toUpperCase() === 'RUNNING'
                          }"
                        >
                          <i :class="[
                            'mr-1', 
                            String(history.status).toUpperCase() === 'SUCCESS' ? 'fas fa-check' : '',
                            String(history.status).toUpperCase() === 'ERROR' ? 'fas fa-times' : '',
                            String(history.status).toUpperCase() === 'CANCELLED' ? 'fas fa-ban' : '',
                            String(history.status).toUpperCase() === 'RUNNING' ? 'fas fa-spinner fa-spin' : ''
                          ]"></i>
                          {{ formatExecutionStatus(history.status) }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatExecutionTime(history.executionTime) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ history.rowCount || '-' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          @click="viewExecutionDetails(history.id)"
                          class="text-indigo-600 hover:text-indigo-900 hover:underline transition-colors duration-150"
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
          <div v-if="activeTab === 'execution-plan'" class="animate-fadeIn">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-lg font-medium text-gray-900 flex items-center">
                <i class="fas fa-project-diagram text-indigo-500 mr-2"></i>
                执行计划
              </h2>
            </div>

            <div v-if="isLoadingPlan" class="flex justify-center py-12">
              <div class="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div v-else-if="!executionPlan" class="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg border border-gray-200">
              <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <i class="fas fa-project-diagram text-gray-400 text-2xl"></i>
              </div>
              <p class="text-gray-600 font-medium mb-2">此版本暂无执行计划</p>
              <p class="text-sm text-gray-500 mb-4">需要先执行查询才能获取执行计划</p>
              <button
                v-if="versionData?.queryText"
                @click="executeQuery"
                class="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                <i class="fas fa-play mr-2"></i>
                执行查询
              </button>
            </div>
            <div v-else>
              <!-- 执行计划内容 -->
              <div class="p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-auto max-h-96">
                <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ JSON.stringify(executionPlan, null, 2) }}</pre>
              </div>
            </div>
          </div>

          <!-- 查询结果标签页 -->
          <div v-if="activeTab === 'results'" class="animate-fadeIn">
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

          <!-- 可视化标签页 -->
          <div v-if="activeTab === 'visualization'" class="animate-fadeIn">
            <!-- 可视化内容... -->
          </div>

          <!-- 优化建议标签页 -->
          <div v-if="activeTab === 'optimization'" class="animate-fadeIn">
            <!-- 优化建议内容... -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import useQueryStore from '@/stores/query'
import { queryService } from '@/services/query'
import { versionService } from '@/services/queryVersion'
import type { Query, QueryVersion as QueryVersionType, QueryExecutionPlan, QuerySuggestion, QueryExecution, QueryStatus } from '@/types/query'
import type { QueryVersion } from '@/types/queryVersion'

// 执行状态类型
type ExecutionStatus = 'SUCCESS' | 'ERROR' | 'RUNNING' | 'CANCELLED'

// 查询版本状态类型 - 修改名称避免冲突
type VersionStatus = 'DRAFT' | 'PUBLISHED' | 'DEPRECATED'

const route = useRoute();
const router = useRouter();
const queryStore = useQueryStore();
const messageStore = useMessageStore();

// 从路由参数获取查询ID和版本ID
const queryId = computed(() => route.params.id as string);
const versionId = computed(() => route.params.versionId as string);
const versionNumber = ref<number>(0);

// 状态变量
const isLoading = ref(true);
const isLoadingHistory = ref(false);
const isLoadingPlan = ref(false);
const isLoadingResults = ref(false);
const isExecuting = ref(false);
const errorMessage = ref('');
const versionData = ref<QueryVersion | null>(null);
const executionHistory = ref<QueryExecution[]>([]);
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
    console.log(`加载版本数据，查询ID: ${queryId.value}, 版本ID: ${versionId.value}`);
    
    // 获取主查询信息
    const query = await queryStore.getQuery(queryId.value);
    if (!query) {
      errorMessage.value = '无法找到对应的查询信息';
      isLoading.value = false;
      return;
    }
    
    // 使用真实API获取版本数据
    try {
      const versionResponse = await versionService.getVersion(versionId.value);
      versionData.value = versionResponse;
      
      // 提取版本号
      versionNumber.value = versionResponse.versionNumber || 1;
      
      // 设置是否为活跃版本
      isActiveVersion.value = versionResponse.isActive || false;
      
      console.log('成功获取版本数据:', versionData.value);
    } catch (versionError) {
      console.error('获取版本数据失败:', versionError);
      errorMessage.value = `无法获取版本数据: ${versionError instanceof Error ? versionError.message : String(versionError)}`;
      isLoading.value = false;
      return;
    }
    
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
    // 使用真实API获取执行历史数据
    console.log(`加载执行历史，查询ID: ${queryId.value}, 版本ID: ${versionId.value}`);
    
    if (!queryId.value || !versionId.value) {
      console.warn('无法加载执行历史：查询ID或版本ID为空');
      executionHistory.value = [];
      isLoadingHistory.value = false;
      return;
    }
    
    try {
      // 使用查询服务获取执行历史
      const historyData = await queryService.getQueryExecutionHistory(queryId.value);
      
      if (historyData && Array.isArray(historyData)) {
        executionHistory.value = historyData;
        console.log('成功获取执行历史数据:', executionHistory.value);
      } else {
        console.warn('执行历史数据格式不正确或为空');
        executionHistory.value = [];
      }
    } catch (historyError) {
      console.error('获取执行历史失败:', historyError);
      executionHistory.value = [];
    }
    
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
    // 从 queryService 获取执行计划数据
    console.log(`加载执行计划，查询ID: ${queryId.value}`);
    
    if (!queryId.value) {
      console.warn('无法加载执行计划：查询ID为空');
      executionPlan.value = null;
      isLoadingPlan.value = false;
      return;
    }
    
    // 调用 API 获取执行计划
    const plan = await queryService.getQueryExecutionPlan(queryId.value);
    
    // 检查结果
    if (plan) {
      executionPlan.value = plan;
      console.log('成功获取执行计划:', plan);
    } else {
      console.warn('未找到执行计划数据');
      executionPlan.value = null;
    }
  } catch (error) {
    console.error('加载执行计划失败:', error);
    executionPlan.value = null;
  } finally {
    isLoadingPlan.value = false;
  }
};

// 查看执行详情
const viewExecutionDetails = (executionId: string) => {
  console.log(`查看执行详情: ${executionId}`);
  messageStore.addMessage({
    type: 'info',
    content: '执行详情功能开发中...'
  });
};

// 设为活跃版本
const handleActivate = async () => {
  try {
    console.log(`设置版本 ${versionId.value} 为活跃版本`);
    
    // 使用真实API调用激活版本
    if (!queryId.value || !versionId.value) {
      messageStore.addMessage({
        type: 'error',
        content: '无法激活版本：查询ID或版本ID为空'
      });
      return;
    }
    
    // 显示处理中状态
    isLoading.value = true;
    
    // 调用修改后的激活版本API，传递queryId和versionId
    const response = await versionService.activateVersion(queryId.value, versionId.value);
    
    console.log('激活版本响应：', response);
    
    // 根据响应结果处理
    if (response && response.success === true) {
      // 更新本地数据
      isActiveVersion.value = true;
      if (versionData.value) {
        versionData.value.isActive = true;
      }
      
      messageStore.addMessage({
        type: 'success',
        content: '已将当前版本设置为活跃版本'
      });
      
      // 显示提示
      setTimeout(() => {
        // 激活成功后跳转到查询列表页面
        router.push('/queries');
      }, 1500); // 延迟1.5秒后跳转，让用户能看到成功消息
    } else {
      // 安全地访问可能不存在的属性
      let errorMsg = '设置活跃版本失败，请稍后重试';
      
      // 检查对象结构和数据类型
      if (response && typeof response === 'object') {
        if ('message' in response && typeof response.message === 'string') {
          errorMsg = response.message;
        }
      }
        
      messageStore.addMessage({
        type: 'error',
        content: `激活版本失败: ${errorMsg}`
      });
    }
  } catch (error) {
    console.error('激活版本失败:', error);
    
    messageStore.addMessage({
      type: 'error',
      content: `激活版本失败: ${error instanceof Error ? error.message : String(error)}`
    });
  } finally {
    isLoading.value = false;
  }
};

// 格式化版本状态显示
const formatVersionStatus = (status?: string): string => {
  if (!status) return '-';
  const statusMap: Record<string, string> = {
    'DRAFT': '草稿',
    'PUBLISHED': '已发布',
    'DEPRECATED': '已废弃'
  };
  return statusMap[status] || status;
};

// 格式化执行状态
const formatExecutionStatus = (status?: string): string => {
  if (!status) return '-';
  const statusMap: Record<string, string> = {
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
    console.log(`加载查询结果，查询ID: ${queryId.value}, 版本ID: ${versionId.value}`);
    
    if (!queryId.value) {
      console.warn('无法加载查询结果：查询ID为空');
      queryResults.value = [];
      queryResultColumns.value = [];
      isLoadingResults.value = false;
      return;
    }
    
    // 根据是否有版本ID调用不同的API
    let result;
    if (versionId.value) {
      // 如果有版本ID，直接获取该版本的执行结果
      console.log(`获取特定版本的执行结果: ${versionId.value}`);
      result = await queryService.getVersionExecutionResult(queryId.value, versionId.value);
    } else {
      // 否则获取最新版本的执行结果
      console.log('获取最新版本的执行结果');
      result = await queryService.getQueryResult(queryId.value);
    }
    
    if (result && result.rows) {
      // 处理列信息
      queryResultColumns.value = result.columns || [];
      
      // 处理行数据
      queryResults.value = result.rows;
      totalResultRows.value = result.rows.length;
      
      console.log(`成功获取查询结果，列: ${queryResultColumns.value.length}, 行: ${queryResults.value.length}`);
    } else {
      console.warn('未找到查询结果数据');
      queryResults.value = [];
      queryResultColumns.value = [];
      totalResultRows.value = 0;
    }
  } catch (error) {
    console.error('加载查询结果失败:', error);
    queryResults.value = [];
    queryResultColumns.value = [];
    totalResultRows.value = 0;
  } finally {
    isLoadingResults.value = false;
  }
};

// 执行查询
const executeQuery = async () => {
  if (!versionData.value || !versionData.value.queryText) {
    console.error('无法执行查询，查询内容为空');
    messageStore.addMessage({
      type: 'error',
      content: '无法执行查询，查询内容为空'
    });
    return;
  }
  
  try {
    console.log('正在执行查询...');
    isExecuting.value = true;
    
    // 获取主查询信息以获取数据源ID
    const query = await queryStore.getQuery(queryId.value);
    const dataSourceId = versionData.value.dataSourceId || query?.dataSourceId;
    
    if (!dataSourceId) {
      throw new Error('无法执行查询：缺少数据源ID');
    }
    
    // 执行查询
    const result = await queryService.executeQuery({
      dataSourceId: dataSourceId,
      queryText: versionData.value.queryText,
      queryType: 'SQL',
      maxRows: 1000
    });
    
    console.log('查询执行完成，结果:', result);
    
    // 加载查询结果
    await loadQueryResults();
    
    // 同时更新执行历史
    await loadExecutionHistory();
    
    messageStore.addMessage({
      type: 'success',
      content: '查询执行成功'
    });
  } catch (error) {
    console.error('查询执行失败:', error);
    messageStore.addMessage({
      type: 'error',
      content: `查询执行失败: ${error instanceof Error ? error.message : String(error)}`
    });
  } finally {
    isExecuting.value = false;
  }
};

// 导出结果
const exportResults = (format: 'csv' | 'excel') => {
  if (!queryResults.value || queryResults.value.length === 0) {
    messageStore.addMessage({
      type: 'error',
      content: '无可导出的查询结果'
    });
    return;
  }
  
  messageStore.addMessage({
    type: 'success',
    content: `已开始导出查询结果为 ${format.toUpperCase()} 格式`
  });
  
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

// 添加复制查询文本功能
const copyQueryText = () => {
  if (versionData.value?.queryText) {
    navigator.clipboard.writeText(versionData.value.queryText)
      .then(() => {
        messageStore.addMessage({
          type: 'success',
          content: '查询内容已复制到剪贴板'
        });
      })
      .catch(err => {
        console.error('复制失败:', err);
        messageStore.addMessage({
          type: 'error',
          content: '复制失败，请手动选择并复制'
        });
      });
  }
};

// 组件挂载时加载数据
onMounted(() => {
  loadVersionData();
});
</script>

<style scoped>
.animate-fadeIn {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.container {
  max-width: 1200px;
}
</style>