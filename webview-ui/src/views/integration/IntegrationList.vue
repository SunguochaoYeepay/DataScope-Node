<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useIntegrationStore } from '@/stores/integration';
import { useMessageStore } from '@/stores/message';
import { storeToRefs } from 'pinia';
import type { Integration } from '@/types/integration';
import { convertToStandardConfig } from '@/utils/configConverter';
import { transformFrontendIntegrationToApi } from '@/utils/apiTransformer';

// 路由相关
const router = useRouter();

// Store
const integrationStore = useIntegrationStore();
const message = useMessageStore();
const { integrations, loading } = storeToRefs(integrationStore);

// 状态
const searchQuery = ref('');
const selectedType = ref('all');
const selectedStatus = ref('all');
const currentPage = ref(1);
const pageSize = ref(10);
const showDeleteConfirm = ref(false);
const integrationToDelete = ref<Integration | null>(null);

// 选项定义
const typeOptions = [
  { value: 'all', label: '所有类型' },
  { value: 'SIMPLE_TABLE', label: '简单表格' },
  { value: 'TABLE', label: '高级表格' },
  { value: 'CHART', label: '数据图表' }
];

const statusOptions = [
  { value: 'all', label: '所有状态' },
  { value: 'DRAFT', label: '草稿' },
  { value: 'ACTIVE', label: '已激活' },
  { value: 'INACTIVE', label: '已停用' }
];

// 计算属性
const filteredIntegrations = computed(() => {
  let result = integrations.value;
  
  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(integration => 
      integration.name.toLowerCase().includes(query) || 
      (integration.description && integration.description.toLowerCase().includes(query))
    );
  }
  
  // 类型过滤
  if (selectedType.value !== 'all') {
    result = result.filter(integration => integration.type === selectedType.value);
  }
  
  // 状态过滤
  if (selectedStatus.value !== 'all') {
    result = result.filter(integration => integration.status === selectedStatus.value);
  }
  
  return result;
});

// 分页数据
const paginatedIntegrations = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredIntegrations.value.slice(start, end);
});

// 总页数
const totalPages = computed(() => {
  return Math.ceil(filteredIntegrations.value.length / pageSize.value);
});

// 生命周期钩子
onMounted(async () => {
  await fetchIntegrations();
});

// 获取集成列表
const fetchIntegrations = async () => {
  try {
    await integrationStore.fetchIntegrations();
  } catch (error) {
    console.error('获取集成列表失败', error);
    message.error('获取集成列表失败');
  }
};

// 创建新集成
const createIntegration = () => {
  router.push('/integration/create');
};

// 编辑集成
const editIntegration = (id: string) => {
  router.push(`/integration/edit/${id}`);
};

// 预览集成
const previewIntegration = (id: string, type?: string) => {
  // 如果有类型参数，使用查询参数传递给预览页面
  if (type) {
    router.push({
      path: `/integration/preview/${id}`,
      query: { type }
    });
  } else {
    router.push(`/integration/preview/${id}`);
  }
};

// 下载转换后的JSON
const downloadStandardJSON = (integration: Integration) => {
  try {
    // 首先使用API转换器转换集成数据
    const apiIntegration = transformFrontendIntegrationToApi(integration);
    
    // 准备转换数据对象
    const integrationData = {
      meta: {
        database: '',
        schema: '',
        table: '',
        pageCode: integration.id || 'integration'
      },
      type: apiIntegration.type,
      queryParams: apiIntegration.queryParams || [],
      tableConfig: {
        ...apiIntegration.tableConfig,
        // 确保columns数组存在且完整
        columns: apiIntegration.tableConfig?.columns || []
      },
      chartConfig: apiIntegration.chartConfig || null
    };
    
    console.log('[转换前] tableConfig.columns:', integrationData.tableConfig.columns);
    
    // 转换为标准JSON格式
    const standardConfig = convertToStandardConfig(integrationData);
    
    console.log('[转换后] standardConfig:', standardConfig);
    console.log('[转换后] list字段:', standardConfig.list);
    
    // 转换为美化的JSON字符串
    const jsonString = JSON.stringify(standardConfig, null, 2);
    
    // 创建Blob并下载
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${integration.name.replace(/\s+/g, '_')}_standard_config.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    message.success('JSON配置下载成功');
  } catch (error) {
    console.error('下载JSON配置失败', error);
    message.error('下载JSON配置失败');
  }
};

// 删除集成确认
const confirmDelete = (integration: Integration) => {
  integrationToDelete.value = integration;
  showDeleteConfirm.value = true;
};

// 执行删除操作
const deleteIntegration = async () => {
  if (!integrationToDelete.value) return;
  
  try {
    await integrationStore.deleteIntegration(integrationToDelete.value.id);
    message.success('删除集成成功');
    showDeleteConfirm.value = false;
    integrationToDelete.value = null;
  } catch (error) {
    console.error('删除集成失败', error);
    message.error('删除集成失败');
  }
};

// 取消删除
const cancelDelete = () => {
  showDeleteConfirm.value = false;
  integrationToDelete.value = null;
};

// 切换状态
const toggleStatus = async (integration: Integration) => {
  const newStatus = integration.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
  
  try {
    await integrationStore.updateIntegrationStatus(integration.id, newStatus);
    message.success(`集成已${newStatus === 'ACTIVE' ? '激活' : '停用'}`);
  } catch (error) {
    console.error('更新集成状态失败', error);
    message.error('更新集成状态失败');
  }
};

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = '';
  selectedType.value = 'all';
  selectedStatus.value = 'all';
  currentPage.value = 1;
};

// 页码变更处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
};

// 获取状态标签样式
const getStatusClass = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return 'bg-green-100 text-green-800';
    case 'INACTIVE':
      return 'bg-gray-100 text-gray-800';
    case 'DRAFT':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// 获取状态名称
const getStatusName = (status: string): string => {
  switch (status) {
    case 'ACTIVE':
      return '已激活';
    case 'INACTIVE':
      return '已停用';
    case 'DRAFT':
      return '草稿';
    default:
      return status;
  }
};

// 获取类型名称
const getTypeName = (type: string): string => {
  switch (type) {
    case 'SIMPLE_TABLE':
      return '简单表格';
    case 'TABLE':
      return '高级表格';
    case 'CHART':
      return '数据图表';
    default:
      return type;
  }
};

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};
</script>

<template>
  <div class="container mx-auto px-4 py-6">
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">系统集成</h1>
        <button 
          @click="createIntegration"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-plus mr-2"></i>
          创建集成
        </button>
      </div>
    </div>
    
    <!-- 过滤器 -->
    <div class="bg-white shadow rounded-lg p-6 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- 搜索 -->
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 mb-1">
            搜索
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fas fa-search text-gray-400"></i>
            </div>
            <input 
              id="search"
              v-model="searchQuery"
              type="text"
              class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="搜索集成名称或描述"
            />
          </div>
        </div>
        
        <!-- 类型过滤 -->
        <div>
          <label for="type-filter" class="block text-sm font-medium text-gray-700 mb-1">
            集成类型
          </label>
          <select
            id="type-filter"
            v-model="selectedType"
            class="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option 
              v-for="option in typeOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <!-- 状态过滤 -->
        <div>
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-1">
            状态
          </label>
          <select
            id="status-filter"
            v-model="selectedStatus"
            class="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option 
              v-for="option in statusOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
        
        <!-- 操作按钮 -->
        <div class="flex items-end">
          <button 
            @click="resetFilters"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-sync-alt mr-2"></i>
            重置筛选
          </button>
        </div>
      </div>
    </div>
    
    <!-- 数据表格 -->
    <div class="bg-white shadow rounded-lg">
      <!-- 加载中 -->
      <div v-if="loading" class="p-10 text-center">
        <i class="fas fa-circle-notch fa-spin text-indigo-500 text-3xl mb-4"></i>
        <p class="text-gray-500">正在加载集成列表...</p>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="filteredIntegrations.length === 0" class="p-10 text-center">
        <div class="rounded-full bg-gray-100 h-16 w-16 flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-cubes text-gray-400 text-2xl"></i>
        </div>
        <h3 class="text-sm font-medium text-gray-900">暂无集成</h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ searchQuery || selectedType !== 'all' || selectedStatus !== 'all' ? '没有符合筛选条件的集成' : '开始创建您的第一个系统集成' }}
        </p>
        <div class="mt-6">
          <button 
            @click="createIntegration"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-plus mr-2"></i>
            创建集成
          </button>
        </div>
      </div>
      
      <!-- 数据表格 -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                名称
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                类型
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                状态
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                创建时间
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="integration in paginatedIntegrations" :key="integration.id">
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-indigo-100 text-indigo-600">
                    <i v-if="integration.type === 'SIMPLE_TABLE'" class="fas fa-clipboard-list"></i>
                    <i v-else-if="integration.type === 'TABLE'" class="fas fa-table"></i>
                    <i v-else-if="integration.type === 'CHART'" class="fas fa-chart-bar"></i>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">
                      {{ integration.name }}
                    </div>
                    <div v-if="integration.description" class="text-sm text-gray-500 max-w-md truncate">
                      {{ integration.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">{{ getTypeName(integration.type) }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    getStatusClass(integration.status)
                  ]"
                >
                  {{ getStatusName(integration.status) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(integration.createTime) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="previewIntegration(integration.id, integration.type)"
                  class="text-green-600 hover:text-green-900 mx-1"
                  title="预览"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  @click="editIntegration(integration.id)"
                  class="text-indigo-600 hover:text-indigo-900 mx-1"
                  title="编辑"
                >
                  <i class="fas fa-edit"></i>
                </button>
                <button 
                  @click="toggleStatus(integration)"
                  :class="[
                    'mx-1',
                    integration.status === 'ACTIVE' ? 'text-gray-600 hover:text-gray-900' : 'text-green-600 hover:text-green-900'
                  ]"
                  :title="integration.status === 'ACTIVE' ? '停用' : '激活'"
                >
                  <i :class="[
                    integration.status === 'ACTIVE' ? 'fas fa-pause-circle' : 'fas fa-play-circle'
                  ]"></i>
                </button>
                <button 
                  @click="downloadStandardJSON(integration)"
                  class="text-blue-600 hover:text-blue-900 mx-1"
                  title="下载JSON配置"
                >
                  <i class="fas fa-download"></i>
                </button>
                <button 
                  @click="confirmDelete(integration)"
                  class="text-red-600 hover:text-red-900 mx-1"
                  title="删除"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- 分页 -->
      <div v-if="filteredIntegrations.length > 0" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示
              <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span>
              至
              <span class="font-medium">{{ Math.min(currentPage * pageSize, filteredIntegrations.length) }}</span>
              条，共
              <span class="font-medium">{{ filteredIntegrations.length }}</span>
              条记录
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <!-- 上一页 -->
              <button
                @click="handlePageChange(currentPage - 1)"
                :disabled="currentPage === 1"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium',
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                ]"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <!-- 页码 -->
              <template v-for="page in totalPages" :key="page">
                <button
                  @click="handlePageChange(page)"
                  :class="[
                    'relative inline-flex items-center px-4 py-2 border',
                    page === currentPage
                      ? 'bg-indigo-50 border-indigo-500 text-indigo-600 z-10'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]"
                >
                  {{ page }}
                </button>
              </template>
              
              <!-- 下一页 -->
              <button
                @click="handlePageChange(currentPage + 1)"
                :disabled="currentPage === totalPages"
                :class="[
                  'relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium',
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                ]"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 删除确认对话框 -->
    <div v-if="showDeleteConfirm" class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <i class="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900">
                  删除集成
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    确定要删除"{{ integrationToDelete?.name }}"吗？此操作无法撤销。
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button 
              @click="deleteIntegration"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              删除
            </button>
            <button 
              @click="cancelDelete"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>