<template>
  <div class="p-4 sm:p-6 bg-white">
    <!-- 页面标题 -->
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-xl font-bold text-gray-900">{{ isCreateMode ? '创建集成 (简化版)' : '编辑集成 (简化版)' }}</h1>
      <div>
        <button
          type="button"
          class="mr-3 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
          @click="cancelEdit"
        >
          取消
        </button>
        <button
          type="button"
          class="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          @click="saveIntegration"
        >
          保存
        </button>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="space-y-8">
      <!-- 基本信息 -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 mb-4">基本信息</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <!-- 名称 -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">
              集成名称 <span class="text-red-500">*</span>
            </label>
            <input 
              id="name"
              v-model="integration.name"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="请输入集成名称"
            />
          </div>
          
          <!-- 状态 -->
          <div>
            <label for="status" class="block text-sm font-medium text-gray-700 mb-1">
              状态
            </label>
            <select
              id="status"
              v-model="integration.status"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="DRAFT">草稿</option>
              <option value="ACTIVE">已激活</option>
              <option value="INACTIVE">已禁用</option>
            </select>
          </div>
        </div>
        
        <!-- 描述 -->
        <div>
          <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
          <textarea
            id="description"
            v-model="integration.description"
            rows="3"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="请输入集成描述"
          ></textarea>
        </div>
      </div>
      
      <!-- 数据配置 -->
      <div>
        <h2 class="text-lg font-medium text-gray-900 mb-4">数据配置</h2>
        
        <div class="mb-4">
          <h5 class="mb-3">数据配置</h5>
          <div class="mb-3">
            <label class="form-label">数据查询ID <span class="text-danger">*</span></label>
            <input type="text" class="form-control" v-model="integration.queryId" :disabled="isLoading" />
          </div>
          <div class="mb-3">
            <label class="form-label">集成类型</label>
            <select class="form-select" v-model="integration.type" :disabled="isLoading">
              <option value="FORM">表单集成</option>
              <option value="TABLE">表格集成</option>
            </select>
          </div>
          
          <!-- 表格配置 -->
          <div v-if="integration.type === 'TABLE'" class="mb-6">
            <div class="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
              <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 class="text-lg leading-6 font-medium text-gray-900">表格配置</h3>
              </div>
              <div class="px-4 py-5 sm:p-6">
                <TableConfigTable
                  v-model="integration.tableConfig"
                  :queryId="integration.queryId"
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- 表单配置编辑器 (仅当选择表单类型时显示) -->
        <div v-if="integration.type === 'FORM'" class="mb-4">
          <!-- 已有的表单配置内容 -->
        </div>
      </div>
      
      <!-- 调试信息 -->
      <div class="bg-gray-50 p-4 rounded-md">
        <h3 class="text-sm font-medium text-gray-500 mb-2">调试信息:</h3>
        <pre class="text-xs text-gray-600 overflow-auto max-h-40">
        path: {{ route.path }}
        params: {{ route.params }}
        query: {{ route.query }}
        
        集成信息:
        {{ JSON.stringify(integration, null, 2) }}
        </pre>
      </div>
    </div>
  </div>
    
  <!-- 表格配置编辑器对话框 -->
  <div v-if="showTableConfigEditor && integration.type === 'TABLE'" class="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 overflow-y-auto">
    <div class="relative bg-white rounded-lg shadow-xl max-w-7xl w-11/12 h-5/6 flex flex-col">
      <!-- 对话框标题栏 -->
      <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h3 class="text-lg font-medium text-gray-900">表格配置编辑器</h3>
        <button 
          type="button" 
          class="text-gray-400 hover:text-gray-500"
          @click="showTableConfigEditor = false">
          <span class="sr-only">关闭</span>
          <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- 对话框内容 -->
      <div class="flex-1 overflow-y-auto p-6">
        <TableConfigEditor 
          v-if="integration.tableConfig" 
          v-model="integration.tableConfig" 
          :queryId="integration.queryId" 
        />
      </div>
      
      <!-- 对话框底部按钮 -->
      <div class="px-6 py-4 border-t border-gray-200 flex justify-end">
        <button 
          type="button" 
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
          @click="showTableConfigEditor = false">
          关闭
        </button>
        <button 
          type="button" 
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="saveTableConfig">
          保存配置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIntegrationStore } from '@/stores/integration';
import { useMessageStore } from '@/stores/message';
import type { Integration } from '@/types/integration';
import QuerySelector from '@/components/integration/QuerySelector.vue';
import FormConfigEditor from '@/components/integration/FormConfigEditor.vue';
import TableConfigTable from '@/components/integration/tablemode/TableConfigTable.vue';

const route = useRoute();
const router = useRouter();
const integrationStore = useIntegrationStore();
const messageStore = useMessageStore();

// 是否加载中
const isLoading = ref(false);

// 是否显示表格配置编辑器
const showTableConfigEditor = ref(false);

// 是否为创建模式
const isCreateMode = computed(() => route.path.includes('/create'));

// 集成信息
const integration = reactive<Integration>({
  id: '',
  name: '',
  description: '',
  type: 'TABLE', // 默认为表格类型
  status: 'DRAFT',
  queryId: '',
  createTime: '',
  updateTime: '',
  formConfig: undefined,
  tableConfig: {
    columns: [],
    actions: [],
    pagination: {
      enabled: true,
      pageSize: 10,
      pageSizeOptions: [10, 20, 50, 100]
    },
    export: {
      enabled: true,
      formats: ['CSV', 'EXCEL'],
      maxRows: 1000
    },
    batchActions: [],
    aggregation: {
      enabled: false,
      groupByFields: [],
      aggregationFunctions: []
    },
    advancedFilters: {
      enabled: false,
      defaultFilters: [],
      savedFilters: []
    }
  },
  integrationPoint: {
    id: '',
    name: '',
    type: 'URL',
    urlConfig: {
      url: '',
      method: 'GET',
      headers: {}
    }
  }
});

// 打开表格配置编辑器
const openTableConfigEditor = () => {
  // 确保表格配置存在
  if (!integration.tableConfig) {
    integration.tableConfig = {
      columns: [],
      actions: [],
      pagination: {
        enabled: true,
        pageSize: 10,
        pageSizeOptions: [10, 20, 50, 100]
      },
      export: {
        enabled: true,
        formats: ['CSV', 'EXCEL'],
        maxRows: 1000
      },
      batchActions: [],
      aggregation: {
        enabled: false,
        groupByFields: [],
        aggregationFunctions: []
      },
      advancedFilters: {
        enabled: false,
        defaultFilters: [],
        savedFilters: []
      }
    };
  }
  
  showTableConfigEditor.value = true;
};

// 保存表格配置
const saveTableConfig = () => {
  messageStore.success('表格配置已保存');
  showTableConfigEditor.value = false;
};

// 生命周期钩子
onMounted(async () => {
  console.log('简化版集成编辑页面已加载', route.path);
  
  if (!isCreateMode.value && route.params.id) {
    try {
      isLoading.value = true;
      const id = route.params.id as string;
      const result = await integrationStore.fetchIntegrationById(id);
      
      if (result) {
        // 填充集成数据
        Object.assign(integration, result);
        
        // 确保表格配置存在
        if (integration.type === 'TABLE' && !integration.tableConfig) {
          integration.tableConfig = {
            columns: [],
            actions: [],
            pagination: {
              enabled: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50, 100]
            },
            export: {
              enabled: true,
              formats: ['CSV', 'EXCEL'],
              maxRows: 1000
            },
            batchActions: [],
            aggregation: {
              enabled: false,
              groupByFields: [],
              aggregationFunctions: []
            },
            advancedFilters: {
              enabled: false,
              defaultFilters: [],
              savedFilters: []
            }
          };
        }
      } else {
        messageStore.error('未找到指定的集成');
        router.push('/integration/list');
      }
    } catch (error) {
      messageStore.error('获取集成数据失败');
      console.error('获取集成数据失败:', error);
    } finally {
      isLoading.value = false;
    }
  }
});

// 保存集成
const saveIntegration = async () => {
  try {
    if (!integration.name) {
      messageStore.error('请输入集成名称');
      return;
    }
    
    if (!integration.queryId) {
      messageStore.error('请输入查询ID');
      return;
    }
    
    let result;
    
    if (isCreateMode.value) {
      result = await integrationStore.createIntegration(integration);
      messageStore.success('创建集成成功');
      router.push(`/integration/edit/${result.id}`);
    } else {
      result = await integrationStore.updateIntegration(integration.id, integration);
      messageStore.success('更新集成成功');
    }
  } catch (error) {
    console.error('保存集成失败', error);
    messageStore.error('保存集成失败');
  }
};

// 取消编辑
const cancelEdit = () => {
  router.push('/integration');
};
</script>