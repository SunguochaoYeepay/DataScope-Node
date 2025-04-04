<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useIntegrationStore } from '@/stores/integration';
import { useMessageStore } from '@/stores/message';
import { storeToRefs } from 'pinia';
import QuerySelector from '@/components/integration/QuerySelector.vue';
import FormConfigEditor from '@/components/integration/FormConfigEditor.vue';
import TableConfigTable from '@/components/integration/tablemode/TableConfigTable.vue';
import IntegrationPointEditor from '@/components/integration/IntegrationPointEditor.vue';
import IntegrationDebug from '@/components/integration/IntegrationDebug.vue';
import DataSourceSelector from '@/components/datasource/DataSourceSelector.vue';
import type { Integration, FormConfig, TableConfig, IntegrationPoint } from '@/types/integration';
import type { DataSource } from '@/types/datasource';

// 路由相关
const route = useRoute();
const router = useRouter();
const isCreateMode = computed(() => route.path.includes('/create'));
const integrationId = computed(() => route.params.id as string);

// 开发环境检查
const isDev = ref(import.meta.env.DEV);

// Store
const integrationStore = useIntegrationStore();
const message = useMessageStore();
const { loading } = storeToRefs(integrationStore);

// 表单状态
const integration = reactive<Integration>({
  id: '',
  name: '',
  description: '',
  type: 'FORM',
  status: 'DRAFT',
  queryId: '',
  dataSourceId: '',
  formConfig: {
    layout: 'vertical',
    conditions: [],
    buttons: []
  },
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
  },
  createTime: '',
  updateTime: ''
});

// 表单验证
const formErrors = reactive({
  name: '',
  queryId: '',
  dataSourceId: '',
  formConfig: '',
  tableConfig: '',
  integrationPoint: ''
});

// 选项定义
const integrationTypeOptions = [
  { value: 'FORM', label: '表单集成' },
  { value: 'TABLE', label: '表格集成' }
];

const statusOptions = [
  { value: 'DRAFT', label: '草稿' },
  { value: 'ACTIVE', label: '已激活' },
  { value: 'INACTIVE', label: '已停用' }
];

// 生命周期钩子
onMounted(async () => {
  console.log('[IntegrationEdit] 组件挂载，集成ID:', integrationId.value, '创建模式:', isCreateMode.value);
  
  if (!isCreateMode.value && integrationId.value) {
    await loadIntegration(integrationId.value);
  } else {
    console.log('[IntegrationEdit] 创建模式，使用默认空数据');
  }
});

// 加载集成
const loadIntegration = async (id: string) => {
  try {
    console.log('[IntegrationEdit] 开始加载集成数据, ID:', id);
    const result = await integrationStore.fetchIntegrationById(id);
    
    if (result) {
      console.log('[IntegrationEdit] 获取到集成数据:', result);
      
      // 复制数据到本地状态
      integration.id = result.id;
      integration.name = result.name;
      integration.description = result.description || '';
      integration.type = result.type;
      integration.status = result.status;
      
      // 特别关注这两个关键字段
      integration.queryId = result.queryId || result.config?.queryId || '';
      integration.dataSourceId = result.dataSourceId || result.config?.dataSourceId || '';
      
      console.log('[IntegrationEdit] 设置数据源ID:', integration.dataSourceId);
      console.log('[IntegrationEdit] 设置查询ID:', integration.queryId);
      
      integration.createTime = result.createTime;
      integration.updateTime = result.updateTime;
      
      // 表单配置
      if (result.formConfig) {
        integration.formConfig = { ...result.formConfig };
        console.log('[IntegrationEdit] 加载表单配置:', integration.formConfig);
      }
      
      // 表格配置
      if (result.tableConfig) {
        integration.tableConfig = { ...result.tableConfig };
        console.log('[IntegrationEdit] 加载表格配置:', integration.tableConfig);
      }
      
      // 集成点配置
      if (result.integrationPoint) {
        integration.integrationPoint = { ...result.integrationPoint };
        console.log('[IntegrationEdit] 加载集成点配置:', integration.integrationPoint);
      }
    } else {
      console.error('[IntegrationEdit] 未找到集成项');
      message.error('未找到集成项');
      router.push('/integration');
    }
  } catch (error) {
    console.error('[IntegrationEdit] 加载集成项失败', error);
    message.error('加载集成项失败');
    router.push('/integration');
  }
};

// 表单验证
const validateForm = (): boolean => {
  let isValid = true;
  
  // 重置错误
  Object.keys(formErrors).forEach(key => {
    formErrors[key as keyof typeof formErrors] = '';
  });
  
  // 验证名称
  if (!integration.name.trim()) {
    formErrors.name = '请输入集成名称';
    isValid = false;
  }
  
  // 验证数据源ID
  if (!integration.dataSourceId.trim()) {
    formErrors.dataSourceId = '请选择数据源';
    isValid = false;
  }
  
  // 验证查询ID
  if (!integration.queryId.trim()) {
    formErrors.queryId = '请选择数据查询';
    isValid = false;
  }
  
  // 验证表单配置
  if (integration.type === 'FORM') {
    if (!integration.formConfig || integration.formConfig.conditions.length === 0) {
      formErrors.formConfig = '表单配置不完整，请至少添加一个条件';
      isValid = false;
    }
  }
  
  // 验证表格配置
  if (integration.type === 'TABLE') {
    if (!integration.tableConfig || integration.tableConfig.columns.length === 0) {
      formErrors.tableConfig = '表格配置不完整，请至少添加一列';
      isValid = false;
    }
  }
  
  // 验证集成点
  if (!integration.integrationPoint.name.trim()) {
    formErrors.integrationPoint = '请完善集成点配置';
    isValid = false;
  }
  
  if (integration.integrationPoint.type === 'URL' && 
      (!integration.integrationPoint.urlConfig || !integration.integrationPoint.urlConfig.url.trim())) {
    formErrors.integrationPoint = '请配置集成点URL';
    isValid = false;
  }
  
  if (integration.integrationPoint.type === 'FORM_SUBMIT' && 
      (!integration.integrationPoint.formSubmitConfig || !integration.integrationPoint.formSubmitConfig.formId.trim())) {
    formErrors.integrationPoint = '请选择目标表单';
    isValid = false;
  }
  
  return isValid;
};

// 保存集成
const saveIntegration = async () => {
  if (!validateForm()) {
    message.error('请完善表单信息');
    return;
  }
  
  try {
    let result;
    
    // 准备保存的数据
    const integrationData: any = {
      name: integration.name,
      description: integration.description,
      queryId: integration.queryId,
      dataSourceId: integration.dataSourceId || '',
      type: integration.type,
      status: integration.status || 'DRAFT',
      // 使用原始结构，保持与API一致
      integrationPoint: integration.integrationPoint
    };
    
    // 根据类型添加对应的配置
    if (integration.type === 'FORM') {
      integrationData.formConfig = integration.formConfig;
    } else if (integration.type === 'TABLE') {
      integrationData.tableConfig = integration.tableConfig;
    } else if (integration.type === 'CHART' && integration.chartConfig) {
      integrationData.chartConfig = integration.chartConfig;
    }
    
    // 添加查询参数
    if (integration.queryParams && integration.queryParams.length > 0) {
      integrationData.queryParams = integration.queryParams;
    }
    
    if (isCreateMode.value) {
      // 创建新集成
      result = await integrationStore.createIntegration(integrationData);
      
      if (result) {
        message.success('创建集成成功');
        router.push(`/integration/edit/${result.id}`);
      }
    } else {
      // 更新现有集成
      result = await integrationStore.updateIntegration(integration.id, integrationData);
      
      if (result) {
        message.success('更新集成成功');
        router.push('/integration');
      }
    }
  } catch (error) {
    console.error('保存集成失败', error);
    message.error('保存集成失败，请检查输入并重试');
  }
};

// 预览集成
const previewIntegration = () => {
  if (integration.id) {
    router.push(`/integration/preview/${integration.id}`);
  } else {
    message.warning('请先保存集成后再预览');
  }
};

// 取消编辑
const cancelEdit = () => {
  router.push('/integration');
};

// 数据源选择变更处理
const handleDataSourceSelected = (id: string, data: any) => {
  console.log('[IntegrationEdit] 选择的数据源:', { id, data });
  // 当数据源变化时，清空已选的查询
  if (integration.queryId && integration.dataSourceId !== id) {
    console.log('[IntegrationEdit] 数据源变更，清空原查询ID:', integration.queryId);
    integration.queryId = '';
  }
};

// 查询选择变更处理
const handleQuerySelected = (id: string, data: any) => {
  console.log('[IntegrationEdit] 选择的查询:', { id, data });
};

// 集成类型变更处理
const handleTypeChange = () => {
  // 重置相关配置
  if (integration.type === 'FORM') {
    integration.formConfig = {
      layout: 'vertical',
      conditions: [],
      buttons: []
    } as FormConfig;
  } else if (integration.type === 'TABLE') {
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
      }
    } as TableConfig;
  }
};

// 处理调试信息
const handleDebugInfo = (info: any) => {
  console.log('调试信息:', info);
};
</script>

<template>
  <div class="integration-edit">
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isCreateMode ? '创建集成' : '编辑集成' }}
        </h1>
        <div class="flex space-x-2">
          <button 
            @click="cancelEdit"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            取消
          </button>
          <button 
            v-if="!isCreateMode"
            @click="previewIntegration"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <i class="fas fa-eye mr-2"></i>
            预览
          </button>
          <button 
            @click="saveIntegration"
            class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="loading"
          >
            <i class="fas fa-save mr-2"></i>
            {{ loading ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
    
    <div class="bg-white shadow rounded-lg">
      <div class="p-6">
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
              :class="{ 'border-red-300': formErrors.name }"
              placeholder="请输入集成名称"
            />
            <div v-if="formErrors.name" class="mt-1 text-sm text-red-600">
              {{ formErrors.name }}
            </div>
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
              <option 
                v-for="option in statusOptions" 
                :key="option.value" 
                :value="option.value"
              >
                {{ option.label }}
              </option>
            </select>
          </div>
          
          <!-- 描述 -->
          <div class="md:col-span-2">
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
        <div class="border-t border-gray-200 pt-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">数据配置</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <!-- 数据源选择 -->
            <div class="md:col-span-1">
              <DataSourceSelector
                v-model="integration.dataSourceId"
                label="数据源"
                placeholder="请选择数据源"
                :error="formErrors.dataSourceId"
                :required="true"
                @selected="handleDataSourceSelected"
              />
              <div v-if="!integration.dataSourceId" class="mt-2 text-sm text-amber-600">
                <i class="fas fa-info-circle mr-1"></i> 请先选择数据源
              </div>
            </div>
            
            <!-- 查询选择 -->
            <div class="md:col-span-1">
              <QuerySelector
                v-model="integration.queryId"
                label="数据查询"
                placeholder="请选择数据查询"
                :error="formErrors.queryId"
                :required="true"
                :dataSourceId="integration.dataSourceId"
                :disabled="!integration.dataSourceId"
                @selected="handleQuerySelected"
              />
              <div v-if="integration.dataSourceId && !integration.queryId" class="mt-2 text-sm text-blue-600">
                <i class="fas fa-lightbulb mr-1"></i> 只显示此数据源的查询
              </div>
            </div>
            
            <!-- 集成类型 -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                集成类型
              </label>
              <select
                v-model="integration.type"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                @change="handleTypeChange"
              >
                <option 
                  v-for="option in integrationTypeOptions" 
                  :key="option.value" 
                  :value="option.value"
                >
                  {{ option.label }}
                </option>
              </select>
            </div>
          </div>
        </div>
        
        <!-- 表单配置 -->
        <div v-if="integration.type === 'FORM'" class="border-t border-gray-200 pt-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">表单配置</h2>
          
          <FormConfigEditor
            v-model="integration.formConfig"
            :queryId="integration.queryId"
          />
          
          <div v-if="formErrors.formConfig" class="mt-2 text-sm text-red-600">
            {{ formErrors.formConfig }}
          </div>
        </div>
        
        <!-- 表格配置 -->
        <div v-if="integration.type === 'TABLE'" class="border-t border-gray-200 pt-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">表格配置</h2>
          
          <TableConfigTable
            v-model="integration.tableConfig"
            :queryId="integration.queryId"
          />
          
          <div v-if="formErrors.tableConfig" class="mt-2 text-sm text-red-600">
            {{ formErrors.tableConfig }}
          </div>
        </div>
        
        <!-- 集成点配置 -->
        <div class="border-t border-gray-200 pt-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">集成点配置</h2>
          
          <IntegrationPointEditor
            v-model="integration.integrationPoint"
          />
          
          <div v-if="formErrors.integrationPoint" class="mt-2 text-sm text-red-600">
            {{ formErrors.integrationPoint }}
          </div>
        </div>
      </div>
      
      <!-- 表单底部 -->
      <div class="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg">
        <button 
          @click="cancelEdit"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          取消
        </button>
        <button 
          v-if="!isCreateMode"
          @click="previewIntegration"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <i class="fas fa-eye mr-2"></i>
          预览
        </button>
        <button 
          @click="saveIntegration"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="loading"
        >
          <i class="fas fa-save mr-2"></i>
          {{ loading ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>
  
  <!-- 调试信息（仅开发环境） -->
  <div v-if="isDev" class="mt-6">
    <IntegrationDebug :queryId="integration.queryId" @debug="handleDebugInfo" />
  </div>
</template>