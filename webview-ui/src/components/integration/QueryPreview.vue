<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useQueryStore } from '@/stores/query';
import { useMessageStore } from '@/stores/message';

interface Props {
  queryId: string;
  params?: Record<string, any>;
  pageSize?: number;
}

const props = defineProps<Props>();
const queryStore = useQueryStore();
const message = useMessageStore();

const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(0);
const totalRecords = ref(0);
const data = ref<any[]>([]);
const columns = ref<string[]>([]);
const error = ref<string | null>(null);

// 模拟预览数据
const mockData = [
  {
    productId: 'P001',
    productName: '高端笔记本电脑',
    category: '电子产品',
    price: 8999,
    salesQuantity: 120,
    salesAmount: 1079880,
    salesDate: '2023-01-15'
  },
  {
    productId: 'P002',
    productName: '智能手机旗舰版',
    category: '电子产品',
    price: 6999,
    salesQuantity: 350,
    salesAmount: 2449650,
    salesDate: '2023-02-10'
  },
  {
    productId: 'P003',
    productName: '无线蓝牙耳机',
    category: '电子产品',
    price: 1299,
    salesQuantity: 500,
    salesAmount: 649500,
    salesDate: '2023-03-05'
  },
  {
    productId: 'P004',
    productName: '智能手表',
    category: '电子产品',
    price: 2499,
    salesQuantity: 200,
    salesAmount: 499800,
    salesDate: '2023-04-20'
  },
  {
    productId: 'P005',
    productName: '家用空调',
    category: '家电',
    price: 3999,
    salesQuantity: 80,
    salesAmount: 319920,
    salesDate: '2023-05-15'
  },
  {
    productId: 'P006',
    productName: '智能冰箱',
    category: '家电',
    price: 5999,
    salesQuantity: 45,
    salesAmount: 269955,
    salesDate: '2023-06-10'
  },
  {
    productId: 'P007',
    productName: '洗衣机',
    category: '家电',
    price: 2699,
    salesQuantity: 60,
    salesAmount: 161940,
    salesDate: '2023-07-05'
  },
  {
    productId: 'P008',
    productName: '电视机',
    category: '家电',
    price: 4599,
    salesQuantity: 95,
    salesAmount: 436905,
    salesDate: '2023-08-20'
  },
  {
    productId: 'P009',
    productName: '办公桌',
    category: '家具',
    price: 899,
    salesQuantity: 30,
    salesAmount: 26970,
    salesDate: '2023-09-15'
  },
  {
    productId: 'P010',
    productName: '人体工学椅',
    category: '家具',
    price: 1299,
    salesQuantity: 25,
    salesAmount: 32475,
    salesDate: '2023-10-10'
  }
];

// 加载预览数据
const loadPreviewData = async () => {
  if (!props.queryId) {
    // 使用模拟数据
    data.value = mockData;
    totalPages.value = 1;
    totalRecords.value = mockData.length;
    columns.value = Object.keys(mockData[0]);
    return;
  }
  
  loading.value = true;
  error.value = null;
  
  try {
    const result = await queryStore.executeQuery(props.queryId, {
      params: props.params || {},
      page: currentPage.value,
      pageSize: props.pageSize || 10
    });
    
    if (result) {
      data.value = result.data;
      totalPages.value = result.totalPages;
      totalRecords.value = result.totalRecords;
      
      // 从第一条数据中提取列名
      if (result.data.length > 0) {
        columns.value = Object.keys(result.data[0]);
      }
    }
  } catch (err) {
    console.error('加载预览数据失败', err);
    error.value = err instanceof Error ? err.message : '加载预览数据失败';
    message.error('加载预览数据失败');
  } finally {
    loading.value = false;
  }
};

// 处理页码变化
const handlePageChange = (page: number) => {
  currentPage.value = page;
  loadPreviewData();
};

// 监听查询ID或参数变化
watch([() => props.queryId, () => props.params], () => {
  currentPage.value = 1; // 重置页码
  loadPreviewData();
}, { deep: true });

// 初始加载
onMounted(() => {
  loadPreviewData();
});

// 格式化单元格数据
const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) {
    return '-';
  }
  if (typeof value === 'object') {
    return JSON.stringify(value);
  }
  return String(value);
};
</script>

<template>
  <div class="query-preview">
    <!-- 加载状态 -->
    <div v-if="loading" class="flex items-center justify-center py-8">
      <i class="fas fa-circle-notch fa-spin text-gray-400 mr-2"></i>
      <span class="text-gray-500">加载预览数据...</span>
    </div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4">
      <div class="flex">
        <i class="fas fa-exclamation-circle text-red-400 mt-0.5 mr-2"></i>
        <div class="text-sm text-red-700">{{ error }}</div>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="!data.length" class="text-center py-8">
      <i class="fas fa-database text-gray-400 text-3xl mb-2"></i>
      <p class="text-gray-500">暂无数据</p>
    </div>
    
    <!-- 数据表格 -->
    <div v-else class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column"
              scope="col"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(row, rowIndex) in data" :key="rowIndex">
            <td
              v-for="column in columns"
              :key="column"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              {{ formatCellValue(row[column]) }}
            </td>
          </tr>
        </tbody>
      </table>
      
      <!-- 分页 -->
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            :disabled="currentPage === 1"
            @click="handlePageChange(currentPage - 1)"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            上一页
          </button>
          <button
            :disabled="currentPage === totalPages"
            @click="handlePageChange(currentPage + 1)"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            下一页
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示第
              <span class="font-medium">{{ ((currentPage - 1) * (props.pageSize || 10)) + 1 }}</span>
              至
              <span class="font-medium">{{ Math.min(currentPage * (props.pageSize || 10), totalRecords) }}</span>
              条，共
              <span class="font-medium">{{ totalRecords }}</span>
              条记录
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                :disabled="currentPage === 1"
                @click="handlePageChange(1)"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                <span class="sr-only">首页</span>
                <i class="fas fa-angle-double-left"></i>
              </button>
              <button
                :disabled="currentPage === 1"
                @click="handlePageChange(currentPage - 1)"
                class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                <span class="sr-only">上一页</span>
                <i class="fas fa-angle-left"></i>
              </button>
              <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button
                :disabled="currentPage === totalPages"
                @click="handlePageChange(currentPage + 1)"
                class="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
              >
                <span class="sr-only">下一页</span>
                <i class="fas fa-angle-right"></i>
              </button>
              <button
                :disabled="currentPage === totalPages"
                @click="handlePageChange(totalPages)"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
              >
                <span class="sr-only">末页</span>
                <i class="fas fa-angle-double-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>