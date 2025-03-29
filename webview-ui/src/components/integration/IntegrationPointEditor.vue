<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useSystemStore } from '@/stores/system';
import { useMessageStore } from '@/stores/message';
import type { IntegrationPoint, UrlConfig, FormSubmitConfig } from '@/types/integration';

// 组件属性
const props = defineProps<{
  modelValue: IntegrationPoint;
}>();

// 组件事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: IntegrationPoint): void;
}>();

// Store
const systemStore = useSystemStore();
const message = useMessageStore();

// 状态
const integrationPoint = reactive<IntegrationPoint>({
  id: '',
  name: '',
  type: 'URL',
  urlConfig: {
    url: '',
    method: 'GET',
    headers: {}
  },
  formSubmitConfig: {
    formId: '',
    submitAction: '',
    successMessage: '',
    errorMessage: ''
  }
});

// 选项定义
const integrationTypeOptions = [
  { value: 'URL', label: '外部URL' },
  { value: 'FORM_SUBMIT', label: '表单提交' }
];

const httpMethodOptions = [
  { value: 'GET', label: 'GET' },
  { value: 'POST', label: 'POST' },
  { value: 'PUT', label: 'PUT' },
  { value: 'DELETE', label: 'DELETE' }
];

// 编辑状态
const isEditingHeaders = ref(false);
const headerKey = ref('');
const headerValue = ref('');
const formList = ref<Array<{ id: string; name: string }>>([]);
const loadingForms = ref(false);

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    // 复制props数据到本地状态
    integrationPoint.id = newValue.id || '';
    integrationPoint.name = newValue.name || '';
    integrationPoint.type = newValue.type || 'URL';
    
    if (newValue.type === 'URL' && newValue.urlConfig) {
      integrationPoint.urlConfig = {
        url: newValue.urlConfig.url || '',
        method: newValue.urlConfig.method || 'GET',
        headers: { ...newValue.urlConfig.headers }
      };
    } else if (newValue.type === 'FORM_SUBMIT' && newValue.formSubmitConfig) {
      integrationPoint.formSubmitConfig = {
        formId: newValue.formSubmitConfig.formId || '',
        submitAction: newValue.formSubmitConfig.submitAction || '',
        successMessage: newValue.formSubmitConfig.successMessage || '',
        errorMessage: newValue.formSubmitConfig.errorMessage || ''
      };
    }
  }
}, { deep: true });

// 监听integrationPoint变化，触发更新事件
watch(integrationPoint, (newValue) => {
  emit('update:modelValue', {
    id: newValue.id,
    name: newValue.name,
    type: newValue.type,
    urlConfig: newValue.type === 'URL' ? { ...newValue.urlConfig } : undefined,
    formSubmitConfig: newValue.type === 'FORM_SUBMIT' ? { ...newValue.formSubmitConfig } : undefined
  });
}, { deep: true });

// 计算属性
const headerEntries = computed(() => {
  if (!integrationPoint.urlConfig || !integrationPoint.urlConfig.headers) {
    return [];
  }
  
  return Object.entries(integrationPoint.urlConfig.headers).map(([key, value]) => ({
    key,
    value
  }));
});

// 生命周期钩子
onMounted(async () => {
  if (integrationPoint.type === 'FORM_SUBMIT') {
    await loadFormsList();
  }
});

// 加载表单列表
const loadFormsList = async () => {
  loadingForms.value = true;
  
  try {
    // 调用接口获取表单列表
    const forms = await systemStore.fetchForms();
    
    if (forms && Array.isArray(forms)) {
      formList.value = forms.map(form => ({
        id: form.id,
        name: form.name
      }));
    }
  } catch (error) {
    console.error('加载表单列表失败', error);
    message.error('加载表单列表失败');
  } finally {
    loadingForms.value = false;
  }
};

// 添加HTTP头
const addHeader = () => {
  if (!headerKey.value || !headerValue.value) {
    message.error('请输入键和值');
    return;
  }
  
  if (!integrationPoint.urlConfig) {
    integrationPoint.urlConfig = {
      url: '',
      method: 'GET',
      headers: {}
    };
  }
  
  if (!integrationPoint.urlConfig.headers) {
    integrationPoint.urlConfig.headers = {};
  }
  
  integrationPoint.urlConfig.headers[headerKey.value] = headerValue.value;
  
  // 重置
  headerKey.value = '';
  headerValue.value = '';
  isEditingHeaders.value = false;
};

// 删除HTTP头
const deleteHeader = (key: string) => {
  if (integrationPoint.urlConfig && integrationPoint.urlConfig.headers) {
    delete integrationPoint.urlConfig.headers[key];
  }
};

// 集成类型变更处理
const handleTypeChange = (newType: string) => {
  integrationPoint.type = newType;
  
  if (newType === 'URL' && !integrationPoint.urlConfig) {
    integrationPoint.urlConfig = {
      url: '',
      method: 'GET',
      headers: {}
    };
  } else if (newType === 'FORM_SUBMIT' && !integrationPoint.formSubmitConfig) {
    integrationPoint.formSubmitConfig = {
      formId: '',
      submitAction: '',
      successMessage: '',
      errorMessage: ''
    };
    
    // 首次切换到表单提交类型时加载表单列表
    if (formList.value.length === 0) {
      loadFormsList();
    }
  }
};
</script>

<template>
  <div class="integration-point-editor">
    <!-- 基本信息 -->
    <div class="mb-6">
      <h3 class="text-sm font-medium text-gray-700 mb-4">基本信息</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 名称 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            集成点名称 <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="integrationPoint.name"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="请输入集成点名称"
          />
        </div>
        
        <!-- 类型 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            集成类型
          </label>
          <select
            v-model="integrationPoint.type"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            @change="handleTypeChange($event.target.value)"
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
    
    <!-- URL集成配置 -->
    <div v-if="integrationPoint.type === 'URL'" class="mb-6">
      <h3 class="text-sm font-medium text-gray-700 mb-4">URL集成配置</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <!-- URL -->
        <div class="md:col-span-2">
          <label class="block text-xs font-medium text-gray-700 mb-1">
            目标URL <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="integrationPoint.urlConfig.url"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="请输入目标URL"
          />
        </div>
        
        <!-- HTTP方法 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            HTTP方法
          </label>
          <select
            v-model="integrationPoint.urlConfig.method"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option 
              v-for="option in httpMethodOptions" 
              :key="option.value" 
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- HTTP请求头 -->
      <div>
        <div class="flex justify-between items-center mb-2">
          <label class="block text-xs font-medium text-gray-700">
            HTTP请求头
          </label>
          <button 
            @click="isEditingHeaders = true"
            class="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-plus mr-1"></i> 添加请求头
          </button>
        </div>
        
        <!-- 添加HTTP头表单 -->
        <div v-if="isEditingHeaders" class="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">
                名称 <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="headerKey"
                type="text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="例如: Content-Type"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700 mb-1">
                值 <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="headerValue"
                type="text"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                placeholder="例如: application/json"
              />
            </div>
          </div>
          
          <div class="flex justify-end space-x-2">
            <button 
              @click="isEditingHeaders = false"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              取消
            </button>
            <button 
              @click="addHeader"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              添加
            </button>
          </div>
        </div>
        
        <!-- HTTP头列表 -->
        <div v-if="headerEntries.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  名称
                </th>
                <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  值
                </th>
                <th scope="col" class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="header in headerEntries" :key="header.key">
                <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                  {{ header.key }}
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                  {{ header.value }}
                </td>
                <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    @click="deleteHeader(header.key)"
                    class="text-red-600 hover:text-red-900"
                    title="删除"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 空状态 -->
        <div v-else-if="!isEditingHeaders" class="bg-gray-50 border border-dashed border-gray-300 rounded-md p-4 text-center">
          <p class="text-sm text-gray-500">暂无HTTP请求头</p>
        </div>
      </div>
    </div>
    
    <!-- 表单提交配置 -->
    <div v-if="integrationPoint.type === 'FORM_SUBMIT'" class="mb-6">
      <h3 class="text-sm font-medium text-gray-700 mb-4">表单提交配置</h3>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <!-- 表单选择 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            目标表单 <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <div v-if="loadingForms" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <i class="fas fa-circle-notch fa-spin text-gray-400"></i>
            </div>
            
            <select
              v-model="integrationPoint.formSubmitConfig.formId"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :disabled="loadingForms"
            >
              <option value="">请选择表单</option>
              <option 
                v-for="form in formList" 
                :key="form.id" 
                :value="form.id"
              >
                {{ form.name }}
              </option>
            </select>
            
            <div v-if="!loadingForms" class="absolute inset-y-0 right-0 pr-3 flex items-center">
              <button 
                type="button" 
                @click="loadFormsList"
                class="text-gray-400 hover:text-gray-500 focus:outline-none"
                title="刷新表单列表"
              >
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>
        </div>
        
        <!-- 提交动作 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            提交动作
          </label>
          <input 
            v-model="integrationPoint.formSubmitConfig.submitAction"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="例如: save, submit, update"
          />
        </div>
        
        <!-- 成功消息 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            成功消息
          </label>
          <input 
            v-model="integrationPoint.formSubmitConfig.successMessage"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="操作成功后显示的消息"
          />
        </div>
        
        <!-- 错误消息 -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-1">
            错误消息
          </label>
          <input 
            v-model="integrationPoint.formSubmitConfig.errorMessage"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="操作失败后显示的消息"
          />
        </div>
      </div>
    </div>
    
    <div class="bg-gray-50 p-3 rounded-md text-sm text-gray-500 mb-2">
      <div class="flex items-start">
        <div class="flex-shrink-0 mt-0.5">
          <i class="fas fa-info-circle text-blue-500"></i>
        </div>
        <div class="ml-3">
          <p>集成点用于将当前系统与外部系统或表单进行连接。请确保提供的URL或表单ID是正确的。</p>
        </div>
      </div>
    </div>
  </div>
</template>