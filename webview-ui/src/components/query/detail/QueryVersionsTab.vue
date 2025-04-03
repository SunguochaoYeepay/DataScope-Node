<template>
  <div>
    <div v-if="isLoading" class="py-12 flex justify-center">
      <div class="flex flex-col items-center">
        <div class="w-10 h-10 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <span class="text-gray-600">加载版本数据...</span>
      </div>
    </div>
    
    <div v-else-if="versions.length === 0" class="py-12 text-center">
      <i class="fas fa-code-branch text-3xl text-gray-400 mb-3"></i>
      <h3 class="text-lg font-medium text-gray-900 mb-2">暂无版本记录</h3>
      <p class="text-gray-500 mb-4">此查询尚未创建任何版本</p>
    </div>
    
    <div v-else class="versions-list">
      <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
        <table class="min-w-full divide-y divide-gray-300">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">版本</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">状态</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">激活状态</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">创建时间</th>
              <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">发布时间</th>
              <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                <span class="sr-only">操作</span>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 bg-white">
            <tr 
              v-for="version in versions" 
              :key="version.id" 
              :class="{ 
                'bg-blue-50': isCurrentVersion(version),
                'hover:bg-gray-50': !isCurrentVersion(version)
              }"
            >
              <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                <div class="flex items-center">
                  <span :class="{ 'font-medium': isCurrentVersion(version) }">
                    v{{ version.versionNumber }}
                  </span>
                </div>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="{
                    'bg-yellow-100 text-yellow-800': version.status === 'DRAFT',
                    'bg-green-100 text-green-800': version.status === 'PUBLISHED',
                    'bg-gray-100 text-gray-800': version.status === 'DEPRECATED'
                  }"
                >
                  {{ formatStatus(version.status) }}
                </span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm">
                <span
                  v-if="version.isActive"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  <i class="fas fa-check-circle mr-1"></i>
                  已激活
                </span>
                <span
                  v-else-if="version.status === 'PUBLISHED'"
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  未激活
                </span>
                <span v-else class="text-gray-500">-</span>
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ formatDate(version.createdAt) }}
              </td>
              <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {{ version.publishedAt ? formatDate(version.publishedAt) : '—' }}
              </td>
              <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                <div class="flex justify-end space-x-2">
                  <button
                    @click="viewVersion(version)"
                    class="text-indigo-600 hover:text-indigo-900"
                    title="查看版本详情"
                  >
                    <i class="fas fa-eye"></i>
                  </button>
                  <button
                    v-if="version.status === 'DRAFT'"
                    @click="publishVersion(version.id)"
                    class="text-green-600 hover:text-green-900"
                    title="发布版本"
                  >
                    <i class="fas fa-check"></i>
                  </button>
                  <button
                    v-if="version.status === 'PUBLISHED' && !isCurrentVersion(version)"
                    @click="activateVersion(queryId, version.id)"
                    class="text-blue-600 hover:text-blue-900"
                    title="激活版本"
                  >
                    <i class="fas fa-play"></i>
                  </button>
                  <button
                    v-if="version.status === 'PUBLISHED'"
                    @click="deprecateVersion(version.id)"
                    class="text-red-600 hover:text-red-900"
                    title="废弃版本"
                  >
                    <i class="fas fa-archive"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-if="totalPages > 1" class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <button
            @click="currentPage > 1 && changePage(currentPage - 1)"
            :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
          >
            上一页
          </button>
          <button
            @click="currentPage < totalPages && changePage(currentPage + 1)"
            :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
          >
            下一页
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              显示第 <span class="font-medium">{{ startItem }}</span> 到第 <span class="font-medium">{{ endItem }}</span> 条，共 <span class="font-medium">{{ totalItems }}</span> 条结果
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                @click="currentPage > 1 && changePage(currentPage - 1)"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }"
              >
                <span class="sr-only">上一页</span>
                <i class="fas fa-chevron-left h-5 w-5"></i>
              </button>
              
              <template v-for="page in displayPages" :key="typeof page === 'number' ? page : `ellipsis-${page}`">
                <button
                  v-if="page !== '...'"
                  @click="changePage(page)"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
                  :class="{ 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600': page === currentPage }"
                >
                  {{ page }}
                </button>
                <span v-else class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              </template>
              
              <button
                @click="currentPage < totalPages && changePage(currentPage + 1)"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }"
              >
                <span class="sr-only">下一页</span>
                <i class="fas fa-chevron-right h-5 w-5"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 确认对话框 -->
    <a-modal
      v-model:visible="confirmDialogVisible"
      :title="confirmDialogTitle"
      @ok="handleConfirmAction"
      @cancel="cancelAction"
      :okText="confirmButtonText"
      okType="danger"
      cancelText="取消"
    >
      <p>{{ confirmDialogMessage }}</p>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import type { QueryVersion, QueryVersionStatus } from '@/types/queryVersion';
import versionService from '@/services/queryVersion';
import { useQueryStore } from '@/stores/query';
import type { Query } from '@/types/query';
import axios from 'axios';

const props = defineProps<{
  queryId: string;
  activeVersionNumber?: number;
}>();

const router = useRouter();
const queryStore = useQueryStore();

// 状态变量
const isLoading = ref(true);
const versions = ref<QueryVersion[]>([]);
const totalItems = ref(0);
const totalPages = ref(1);
const currentPage = ref(1);
const pageSize = ref(10);

// 确认对话框状态
const confirmDialogVisible = ref(false);
const confirmDialogTitle = ref('');
const confirmDialogMessage = ref('');
const confirmButtonText = ref('');
const pendingAction = ref<(() => void) | null>(null);

// 格式化状态显示
const formatStatus = (status: QueryVersionStatus) => {
  const statusMap: Record<QueryVersionStatus, string> = {
    'DRAFT': '草稿',
    'PUBLISHED': '已发布',
    'DEPRECATED': '已废弃'
  };
  return statusMap[status] || status;
};

// 格式化日期显示
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 计算分页信息
const startItem = computed(() => (currentPage.value - 1) * pageSize.value + 1);
const endItem = computed(() => Math.min(currentPage.value * pageSize.value, totalItems.value));

// 计算显示的页码
const displayPages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  
  // 总是显示第一页和最后一页
  const result: Array<number | string> = [1];
  
  if (current <= 3) {
    // 靠近开始
    result.push(2, 3, 4, '...', total);
  } else if (current >= total - 2) {
    // 靠近结束
    result.push('...', total - 3, total - 2, total - 1, total);
  } else {
    // 中间
    result.push('...', current - 1, current, current + 1, '...', total);
  }
  
  return result;
});

// 格式化版本号，确保使用真实版本ID
const formatVersionNumber = (versionId: string | null): string => {
  if (!versionId) return '无版本';
  
  // 查找版本对象以获取版本号
  const version = versions.value.find(v => v.id === versionId);
  if (version && version.versionNumber) {
    return version.versionNumber.toString();
  }
  
  // 如果找不到对应的版本对象，返回默认值
  return '1';
}

// 判断版本是否为活跃版本
const isActiveVersion = (versionId: string | null): boolean => {
  if (!versionId || !props.activeVersionNumber) return false;
  return versionId === String(props.activeVersionNumber);
};

// 如果版本列表为空，显示一个提示消息
const hasNoVersions = computed(() => {
  return !isLoading.value && (!versions.value || versions.value.length === 0);
})

// 加载版本数据
const loadVersions = async () => {
  isLoading.value = true;
  try {
    console.log('加载版本数据，查询ID:', props.queryId);
    
    const versionApi = axios.create({
      baseURL: import.meta.env.VITE_API_BASE_URL || '',
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log(`请求版本列表API: ${versionApi.defaults.baseURL}/api/query/version/management/${props.queryId}`);
    const response = await versionApi.get(`/api/query/version/management/${props.queryId}`);
    
    if (response.data.success && Array.isArray(response.data.data)) {
      console.log('API返回版本数据:', response.data.data);
      versions.value = response.data.data;
      totalItems.value = versions.value.length;
      totalPages.value = Math.ceil(totalItems.value / pageSize.value);
      console.log('处理后的版本数据:', versions.value);
    } else {
      console.error('API返回数据格式不正确:', response.data);
      message.error('获取版本数据失败，请稍后重试');
      versions.value = [];
      totalItems.value = 0;
      totalPages.value = 1;
    }
  } catch (error) {
    console.error('加载版本数据失败:', error);
    message.error('无法加载版本数据，请稍后重试');
    versions.value = [];
    totalItems.value = 0;
    totalPages.value = 1;
  } finally {
    isLoading.value = false;
  }
};

// 切换页码
const changePage = (page: number | string) => {
  currentPage.value = typeof page === 'number' ? page : parseInt(page);
};

// 创建新版本
const createNewVersion = () => {
  router.push(`/query/edit/${props.queryId}/new-version`);
};

// 查看版本
const viewVersion = (version: QueryVersion) => {
  // 添加调试信息
  console.log('查看版本:', version);
  
  try {
    // 使用命名路由进行导航
    router.push({
      name: 'QueryVersionDetails',
      params: {
        id: props.queryId,
        versionId: version.id
      }
    });
    
    // 通知用户
    message.info(`正在查看版本 V${version.versionNumber} 的详情`);
  } catch (error) {
    console.error('路由跳转失败:', error);
    message.error(`路由跳转失败: ${error instanceof Error ? error.message : String(error)}`);
    
    // 使用备选方案，采用完整的URL路径
    const baseUrl = window.location.origin;
    window.location.href = `${baseUrl}/query/detail/${props.queryId}/version/${version.id}`;
  }
};

// 发布版本
const publishVersion = (versionId: string) => {
  confirmDialogTitle.value = '发布版本';
  confirmDialogMessage.value = '确定要发布此版本吗？发布后将无法修改，只能废弃。';
  confirmButtonText.value = '发布';
  confirmDialogVisible.value = true;
  
  pendingAction.value = async () => {
    try {
      console.log('正在发布版本:', versionId);
      
      const versionApi = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || '',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // 调用发布版本的API
      const response = await versionApi.post(`/api/query/version/management/${props.queryId}/publish/${versionId}`);
      
      if (response.data.success) {
        // 重新加载版本列表以获取最新状态
        await loadVersions();
        message.success('版本已成功发布');
      } else {
        throw new Error(response.data.message || '发布版本失败');
      }
    } catch (error) {
      console.error('发布版本失败:', error);
      message.error('发布版本失败，请稍后重试');
    }
  };
};

// 废弃版本
const deprecateVersion = (versionId: string) => {
  confirmDialogTitle.value = '废弃版本';
  confirmDialogMessage.value = '确定要废弃此版本吗？废弃后将无法恢复。';
  confirmButtonText.value = '废弃';
  confirmDialogVisible.value = true;
  
  pendingAction.value = async () => {
    try {
      console.log('正在废弃版本:', versionId);
      
      const versionApi = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || '',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // 调用废弃版本的API
      const response = await versionApi.post(`/api/query/version/management/${props.queryId}/deprecate/${versionId}`);
      
      if (response.data.success) {
        // 重新加载版本列表以获取最新状态
        await loadVersions();
        message.success('版本已成功废弃');
      } else {
        throw new Error(response.data.message || '废弃版本失败');
      }
    } catch (error) {
      console.error('废弃版本失败:', error);
      message.error('废弃版本失败，请稍后重试');
    }
  };
};

// 激活版本
const activateVersion = async (queryId: string, versionId: string) => {
  confirmDialogTitle.value = '激活版本';
  confirmDialogMessage.value = '确定要将此版本设为活跃版本吗？';
  confirmButtonText.value = '激活';
  confirmDialogVisible.value = true;
  
  pendingAction.value = async () => {
    try {
      console.log('正在激活版本:', queryId, versionId);
      
      const versionApi = axios.create({
        baseURL: import.meta.env.VITE_API_BASE_URL || '',
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // 调用激活版本的API
      const response = await versionApi.post(`/api/queries/${queryId}/versions/${versionId}/activate`);
      
      if (response.data.success) {
        // 重新加载版本列表以获取最新状态
        await loadVersions();
        message.success('版本已成功激活');
      } else {
        throw new Error(response.data.message || '激活版本失败');
      }
    } catch (error) {
      console.error('激活版本失败:', error);
      message.error('激活版本失败，请稍后重试');
    }
  };
};

// 处理确认操作
const handleConfirmAction = async () => {
  if (pendingAction.value) {
    await pendingAction.value();
  }
  confirmDialogVisible.value = false;
  pendingAction.value = null;
};

// 取消操作
const cancelAction = () => {
  confirmDialogVisible.value = false;
  pendingAction.value = null;
};

// 监听分页变化
watch(currentPage, () => {
  loadVersions();
});

// 组件挂载时加载数据
onMounted(() => {
  loadVersions();
});

// 处理版本数据映射
const processVersions = (data: any[]) => {
  versions.value = data.map((v: any) => ({
    ...v,
    isActive: v.id === (props.activeVersionNumber ? String(props.activeVersionNumber) : null)
  }));
  totalItems.value = data.length;
  totalPages.value = Math.ceil(totalItems.value / pageSize.value);
};

// 添加判断当前版本的方法
const isCurrentVersion = (version: QueryVersion): boolean => {
  if (!props.activeVersionNumber || !version.versionNumber) return false;
  return version.versionNumber === props.activeVersionNumber;
};
</script>

<style scoped>
.versions-tab-container {
  padding: 1.5rem;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

/* 添加过渡效果 */
tr {
  @apply transition-colors duration-150 ease-in-out;
}

/* 操作按钮样式 */
button {
  @apply p-1.5 rounded-full transition-colors duration-150 ease-in-out;
}

button:hover {
  @apply bg-gray-100;
}
</style>