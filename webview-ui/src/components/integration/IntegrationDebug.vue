<template>
  <div class="debug-info p-4 bg-gray-100 rounded-lg">
    <h3 class="text-lg font-medium mb-2">集成调试信息</h3>
    
    <div v-if="error" class="error-message bg-red-50 border border-red-300 text-red-700 p-3 rounded mb-4">
      {{ error }}
    </div>
    
    <dl class="grid grid-cols-1 gap-2">
      <div class="flex flex-col bg-white p-3 rounded border border-gray-200">
        <dt class="text-sm font-medium text-gray-500">Vue Router 当前路径</dt>
        <dd class="mt-1 text-sm text-gray-900">{{ route.fullPath }}</dd>
      </div>
      
      <div class="flex flex-col bg-white p-3 rounded border border-gray-200">
        <dt class="text-sm font-medium text-gray-500">组件加载状态</dt>
        <dd class="mt-1 text-sm text-gray-900">{{ componentLoaded ? '已加载' : '未加载' }}</dd>
      </div>
      
      <div class="flex flex-col bg-white p-3 rounded border border-gray-200">
        <dt class="text-sm font-medium text-gray-500">用户ID</dt>
        <dd class="mt-1 text-sm text-gray-900">{{ $route.params.id || '无' }}</dd>
      </div>
      
      <div class="flex flex-col bg-white p-3 rounded border border-gray-200">
        <dt class="text-sm font-medium text-gray-500">查询ID</dt>
        <dd class="mt-1 text-sm text-gray-900">{{ queryId }}</dd>
      </div>
    </dl>
    
    <div class="mt-4">
      <button @click="testQuerySelector" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        测试查询选择器
      </button>
      
      <button @click="testFormConfigEditor" class="ml-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
        测试表单配置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import { useRoute } from 'vue-router';
import { useQueryStore } from '@/stores/query';

const props = defineProps<{
  queryId: string;
}>();

const emit = defineEmits<{
  (e: 'debug', info: any): void;
}>();

const route = useRoute();
const componentLoaded = ref(false);
const error = ref<string | null>(null);
const queryStore = useQueryStore();

onMounted(() => {
  try {
    componentLoaded.value = true;
    emit('debug', { status: 'mounted', route: route.fullPath });
  } catch (err: any) {
    error.value = `组件加载错误: ${err.message}`;
  }
});

// 测试查询选择器
const testQuerySelector = async () => {
  try {
    const queries = await queryStore.fetchQueries({});
    emit('debug', { component: 'QuerySelector', queries });
  } catch (err: any) {
    error.value = `查询选择器测试错误: ${err.message}`;
  }
};

// 测试表单配置
const testFormConfigEditor = () => {
  try {
    const formConfig = {
      layout: 'vertical',
      conditions: [],
      buttons: []
    };
    emit('debug', { component: 'FormConfigEditor', formConfig });
  } catch (err: any) {
    error.value = `表单配置测试错误: ${err.message}`;
  }
};
</script>