<template>
  <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
    <!-- 标签页切换 -->
    <div class="border-b border-gray-200">
      <nav class="flex" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-3 py-2 font-medium text-sm border-b-2 focus:outline-none"
          :class="[
            activeTab === tab.key
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- 集成点基本信息 -->
    <div v-if="activeTab === 'basic'" class="p-4">
      <div class="space-y-4">
        <div>
          <label for="integration-point-name" class="block text-sm font-medium text-gray-700 mb-1">
            集成点名称 <span class="text-red-500">*</span>
          </label>
          <input 
            id="integration-point-name"
            v-model="integrationPoint.name"
            type="text"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="请输入集成点名称"
          />
        </div>
        
        <div>
          <label for="integration-point-type" class="block text-sm font-medium text-gray-700 mb-1">
            集成点类型 <span class="text-red-500">*</span>
          </label>
          <select
            id="integration-point-type"
            v-model="integrationPoint.type"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="URL">URL</option>
            <option value="FORM_SUBMIT">表单提交</option>
          </select>
        </div>
      </div>
    </div>

    <!-- URL配置 -->
    <div v-if="activeTab === 'url' && integrationPoint.type === 'URL'" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">属性</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">值</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- URL -->
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
              URL <span class="text-red-500">*</span>
            </td>
            <td class="px-4 py-2">
              <input 
                v-model="integrationPoint.urlConfig.url" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="请输入URL"
              />
            </td>
          </tr>
          
          <!-- 请求方法 -->
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
              请求方法 <span class="text-red-500">*</span>
            </td>
            <td class="px-4 py-2">
              <select 
                v-model="integrationPoint.urlConfig.method" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 请求头 -->
      <div class="px-4 py-3 border-t border-gray-200">
        <h3 class="text-sm font-medium text-gray-700 mb-2">请求头</h3>
        
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">名称</th>
              <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">值</th>
              <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(value, key) in headers" :key="key" class="hover:bg-gray-50">
              <td class="px-4 py-2">
                <input 
                  v-model="headerKeys[key]" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="请输入名称"
                />
              </td>
              <td class="px-4 py-2">
                <input 
                  v-model="headers[key]" 
                  class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="请输入值"
                />
              </td>
              <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
                <button 
                  @click="removeHeader(key)" 
                  class="text-red-600 hover:text-red-900"
                >
                  删除
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="px-4 py-2">
                <button 
                  @click="addHeader" 
                  class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
                >
                  添加请求头
                </button>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- 表单提交配置 -->
    <div v-if="activeTab === 'form' && integrationPoint.type === 'FORM_SUBMIT'" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">属性</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">值</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <!-- 表单ID -->
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
              表单ID <span class="text-red-500">*</span>
            </td>
            <td class="px-4 py-2">
              <input 
                v-model="formSubmitConfig.formId" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="请输入表单ID"
              />
            </td>
          </tr>
          
          <!-- 提交动作 -->
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
              提交动作 <span class="text-red-500">*</span>
            </td>
            <td class="px-4 py-2">
              <input 
                v-model="formSubmitConfig.submitAction" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="请输入提交动作"
              />
            </td>
          </tr>
          
          <!-- 成功消息 -->
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
              成功消息
            </td>
            <td class="px-4 py-2">
              <input 
                v-model="formSubmitConfig.successMessage" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="请输入成功消息"
              />
            </td>
          </tr>
          
          <!-- 错误消息 -->
          <tr class="hover:bg-gray-50">
            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-700">
              错误消息
            </td>
            <td class="px-4 py-2">
              <input 
                v-model="formSubmitConfig.errorMessage" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="请输入错误消息"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import type { IntegrationPoint, FormSubmitConfig, UrlConfig } from '@/types/integration';

const props = defineProps<{
  modelValue: IntegrationPoint;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: IntegrationPoint): void;
}>();

const integrationPoint = ref<IntegrationPoint>({
  id: props.modelValue.id || '',
  name: props.modelValue.name || '',
  type: props.modelValue.type || 'URL',
  urlConfig: {
    url: props.modelValue.urlConfig?.url || '',
    method: props.modelValue.urlConfig?.method || 'GET',
    headers: { ...props.modelValue.urlConfig?.headers } || {}
  },
  formSubmitConfig: props.modelValue.formSubmitConfig ? { ...props.modelValue.formSubmitConfig } : undefined
});

// 初始化表单提交配置
const formSubmitConfig = reactive<FormSubmitConfig>({
  formId: integrationPoint.value.formSubmitConfig?.formId || '',
  submitAction: integrationPoint.value.formSubmitConfig?.submitAction || '',
  successMessage: integrationPoint.value.formSubmitConfig?.successMessage || '',
  errorMessage: integrationPoint.value.formSubmitConfig?.errorMessage || ''
});

// 提取headers为可编辑对象
const headers = reactive<Record<string, string>>(
  { ...integrationPoint.value.urlConfig?.headers } || {}
);

// 存储header的键名，用于修改键名
const headerKeys = reactive<Record<string, string>>({});

// 初始化headerKeys
Object.keys(headers).forEach(key => {
  headerKeys[key] = key;
});

// 添加新的请求头
const addHeader = () => {
  const newKey = `header-${Object.keys(headers).length + 1}`;
  headers[newKey] = '';
  headerKeys[newKey] = '';
};

// 删除请求头
const removeHeader = (key: string) => {
  delete headers[key];
  delete headerKeys[key];
};

// 活动标签
const activeTab = ref('basic');

// 标签定义
const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'url', label: 'URL配置' },
  { key: 'form', label: '表单提交配置' }
];

// 监听表单配置变化
watch(formSubmitConfig, (newValue) => {
  if (integrationPoint.value.type === 'FORM_SUBMIT') {
    integrationPoint.value.formSubmitConfig = { ...newValue };
  }
}, { deep: true });

// 监听headers变化，更新到integrationPoint
watch([headers, headerKeys], () => {
  if (integrationPoint.value.type === 'URL') {
    const newHeaders: Record<string, string> = {};
    
    // 使用新的键名更新headers
    Object.keys(headers).forEach(key => {
      if (headerKeys[key]) {
        newHeaders[headerKeys[key]] = headers[key];
      }
    });
    
    integrationPoint.value.urlConfig = {
      ...(integrationPoint.value.urlConfig || { url: '', method: 'GET' }),
      headers: newHeaders
    };
  }
}, { deep: true });

// 监听集成点变化并向父组件发送更新
watch(integrationPoint, (newValue) => {
  emit('update:modelValue', {
    id: newValue.id,
    name: newValue.name,
    type: newValue.type,
    urlConfig: newValue.type === 'URL' ? { ...newValue.urlConfig } : undefined,
    formSubmitConfig: newValue.type === 'FORM_SUBMIT' ? { ...newValue.formSubmitConfig } : undefined
  });
}, { deep: true });

// 监听外部数据变化
watch(() => props.modelValue, (newValue) => {
  integrationPoint.value = {
    id: newValue.id || '',
    name: newValue.name || '',
    type: newValue.type || 'URL',
    urlConfig: newValue.urlConfig ? { ...newValue.urlConfig } : undefined,
    formSubmitConfig: newValue.formSubmitConfig ? { ...newValue.formSubmitConfig } : undefined
  };
  
  // 更新表单配置
  if (newValue.formSubmitConfig) {
    Object.assign(formSubmitConfig, newValue.formSubmitConfig);
  }
  
  // 更新headers
  if (newValue.urlConfig && newValue.urlConfig.headers) {
    Object.keys(headers).forEach(key => delete headers[key]);
    Object.keys(headerKeys).forEach(key => delete headerKeys[key]);
    
    Object.entries(newValue.urlConfig.headers).forEach(([key, value]) => {
      headers[key] = value;
      headerKeys[key] = key;
    });
  }
}, { deep: true });
</script>