<template>
  <div class="integration-edit">
    <div class="page-header mb-6">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">
          {{ isCreateMode ? '创建集成 (简化版)' : '编辑集成 (简化版)' }}
        </h1>
      </div>
    </div>
    
    <div class="bg-white shadow rounded-lg">
      <div class="p-6">
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
          
          <!-- 描述 -->
          <div>
            <label for="description" class="block text-sm font-medium text-gray-700 mb-1">
              描述
            </label>
            <input 
              id="description"
              v-model="integration.description"
              type="text"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="请输入集成描述"
            />
          </div>
        </div>
        
        <!-- 调试信息 -->
        <div class="mt-4 p-4 bg-gray-100 rounded">
          <h3 class="text-md font-medium mb-2">路由和状态信息</h3>
          <pre class="text-xs bg-white p-2 rounded">{{ routeInfo }}</pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 路由相关
const route = useRoute();
const router = useRouter();
const isCreateMode = computed(() => route.path.includes('/create'));
const integrationId = computed(() => route.params.id as string);

// 简化状态
const integration = reactive({
  id: '',
  name: '',
  description: '',
  type: 'FORM'
});

// 调试信息
const routeInfo = computed(() => {
  return {
    path: route.path,
    fullPath: route.fullPath,
    name: route.name,
    params: route.params,
    query: route.query,
    isCreateMode: isCreateMode.value,
    integrationId: integrationId.value
  };
});

// 生命周期钩子
onMounted(() => {
  console.log('简化版集成编辑页面已加载');
  
  if (!isCreateMode.value && integrationId.value) {
    // 编辑模式
    integration.id = integrationId.value;
  }
});
</script>