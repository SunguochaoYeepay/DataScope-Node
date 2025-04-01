<template>
  <div class="container mx-auto px-4 py-6">
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="flex-1 min-w-0">
        <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
          查询列表
        </h2>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
        <button 
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="$router.push('/query/history')">
          <i class="fas fa-history mr-2"></i> 历史记录
        </button>
        <button 
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="showFavorites = !showFavorites">
          <i class="fas fa-star mr-2" :class="{ 'text-yellow-400': showFavorites }"></i> 收藏夹
        </button>
        <button 
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          @click="$router.push('/query/editor')">
          <i class="fas fa-plus mr-2"></i> 新建查询
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg mb-6">
      <div class="px-4 py-5 sm:p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="search-field">
            <label class="block text-sm font-medium text-gray-700 mb-1">搜索</label>
            <div class="relative rounded-md shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fas fa-search text-gray-400"></i>
              </div>
              <input
                type="text"
                v-model="searchTerm"
                placeholder="搜索查询..."
                class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div class="data-source-filter">
            <label class="block text-sm font-medium text-gray-700 mb-1">数据源</label>
            <select
              v-model="selectedDataSource"
              class="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">全部数据源</option>
              <option v-for="source in dataSources" :key="source.id" :value="source.id">
                {{ source.name }}
              </option>
            </select>
          </div>

          <div class="created-by-filter">
            <label class="block text-sm font-medium text-gray-700 mb-1">创建者</label>
            <select
              v-model="selectedUser"
              class="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">全部用户</option>
              <option value="current">我的</option>
            </select>
          </div>

          <div class="sort-by-filter">
            <label class="block text-sm font-medium text-gray-700 mb-1">排序方式</label>
            <select
              v-model="sortBy"
              class="block w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="lastModified">最近修改</option>
              <option value="name">名称</option>
              <option value="created">创建时间</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div v-if="loading" class="py-10 text-center">
        <i class="fas fa-spinner fa-spin text-indigo-600 text-2xl"></i>
        <p class="mt-2 text-gray-600">加载查询中...</p>
      </div>

      <div v-else-if="filteredQueries.length === 0" class="py-10 text-center">
        <p class="text-gray-600">暂无查询。</p>
      </div>

      <div v-else>
        <div v-for="query in paginatedQueries" :key="query.id" class="bg-white shadow rounded-lg p-4 mb-4">
          <div class="flex items-start justify-between">
            <div>
              <h3 class="text-lg font-medium text-gray-900">{{ query.name || '未命名查询' }}</h3>
              <div class="mt-1 flex items-center text-sm text-gray-500">
                <span class="inline-flex items-center mr-4">
                  <i class="fas fa-database mr-1"></i> {{ getDataSourceName(query.dataSourceId) }}
                </span>
                <span class="inline-flex items-center">
                  <i class="fas fa-clock mr-1"></i> 修改于 {{ formatDate(query.updatedAt || query.createdAt) }}
                </span>
              </div>
            </div>
            <div class="flex items-center space-x-2">
              <button
                @click="toggleFavorite(query)"
                class="p-2 rounded-full hover:bg-gray-100"
                :title="query.isFavorite ? '取消收藏' : '添加收藏'"
              >
                <i class="fas fa-star" :class="query.isFavorite ? 'text-yellow-400' : 'text-gray-400'"></i>
              </button>
              <button
                @click="viewQueryDetail(query)"
                class="p-2 rounded-full hover:bg-gray-100"
                title="查看详情"
              >
                <i class="fas fa-eye text-indigo-600"></i>
              </button>
              <button
                @click="editQuery(query)"
                class="p-2 rounded-full hover:bg-gray-100"
                title="编辑查询"
              >
                <i class="fas fa-edit text-indigo-600"></i>
              </button>
              <button
                @click="deleteQuery(query)"
                class="p-2 rounded-full hover:bg-gray-100"
                title="删除查询"
              >
                <i class="fas fa-trash text-red-600"></i>
              </button>
            </div>
          </div>
        </div>

        <div class="bg-white shadow rounded-lg p-4">
          <div class="flex items-center justify-between">
            <div class="text-sm text-gray-700">
              显示 <span class="font-medium">{{ startIndex + 1 }}</span> 到 <span class="font-medium">{{ Math.min(endIndex, totalQueries) }}</span> 共 <span class="font-medium">{{ totalQueries }}</span> 条结果
            </div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <!-- 上一页按钮 -->
              <button
                @click="prevPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">上一页</span>
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <!-- 页码按钮 -->
              <template v-for="pageNum in displayedPageNumbers" :key="pageNum">
                <button
                  v-if="pageNum !== '...'"
                  @click="goToPage(Number(pageNum))"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium"
                  :class="Number(pageNum) === currentPage 
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'"
                >
                  {{ pageNum }}
                </button>
                <span
                  v-else
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                >
                  ...
                </span>
              </template>
              
              <!-- 下一页按钮 -->
              <button
                @click="nextPage"
                :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span class="sr-only">下一页</span>
                <i class="fas fa-chevron-right"></i>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useDataSourceStore } from '@/stores/datasource';
import { useQueryStore } from '@/stores/query';
import type { Query } from '@/types/query';

const router = useRouter();
const dataSourceStore = useDataSourceStore();
const queryStore = useQueryStore();

// State
const loading = ref(true);
const searchTerm = ref('');
const selectedDataSource = ref('');
const selectedUser = ref('');
const sortBy = ref('lastModified');
const showFavorites = ref(false);
const currentPage = ref(1);
const pageSize = ref(10);

// Fetch data
onMounted(async () => {
  loading.value = true;
  
  try {
    // 加载数据源，如果尚未加载
    if (dataSourceStore.dataSources.length === 0) {
      await dataSourceStore.fetchDataSources();
      console.log('Data sources loaded:', dataSourceStore.dataSources);
    }
    
    // 使用try-catch包装每个API调用，防止一个失败影响后续操作
    try {
      // 直接加载查询历史，添加详细日志
      await queryStore.fetchQueryHistory({
        page: 1,
        size: 10
      });
      console.log('Query history loaded, records:', queryStore.queryHistory?.length || 0);
    } catch (err) {
      console.error('Failed to load query history:', err);
      // 失败时使用空数组初始化，防止UI错误
      queryStore.queryHistory = [];
    }
    
    // 尝试加载收藏
    try {
      await queryStore.getFavorites();
      console.log('Favorites loaded:', queryStore.favorites?.length || 0);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    }
  } catch (err) {
    console.error('Error during page initialization:', err);
  } finally {
    loading.value = false;
    console.log('Page loading completed');
  }
});

// Computed properties
const dataSources = computed(() => dataSourceStore.dataSources);

const filteredQueries = computed(() => {
  let result = [...queryStore.queryHistory];
  
  // Apply favorites filter
  if (showFavorites.value) {
    result = result.filter(query => queryStore.favorites.some(fav => fav.id === query.id));
  }
  
  // Apply search term filter
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    result = result.filter(query => 
      (query.name || '').toLowerCase().includes(term) || 
      (query.queryText || '').toLowerCase().includes(term)
    );
  }
  
  // Apply data source filter
  if (selectedDataSource.value) {
    result = result.filter(query => query.dataSourceId === selectedDataSource.value);
  }
  
  // Apply user filter (placeholder - would need actual user info)
  if (selectedUser.value === 'current') {
    // Filter for current user's queries
    // This is a placeholder - actual implementation would depend on user authentication
  }
  
  // Apply sorting
  result.sort((a, b) => {
    if (sortBy.value === 'name') {
      return (a.name || '').localeCompare(b.name || '');
    } else if (sortBy.value === 'created') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else {
      // Default: lastModified
      const aDate = a.updatedAt || a.createdAt;
      const bDate = b.updatedAt || b.createdAt;
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    }
  });
  
  // Add favorite flag
  return result.map(query => ({
    ...query,
    isFavorite: queryStore.favorites.some(fav => fav.id === query.id)
  }));
});

// Pagination
const totalQueries = computed(() => filteredQueries.value.length);
const totalPages = computed(() => Math.ceil(totalQueries.value / pageSize.value));
const startIndex = computed(() => (currentPage.value - 1) * pageSize.value);
const endIndex = computed(() => startIndex.value + pageSize.value);
const paginatedQueries = computed(() => 
  filteredQueries.value.slice(startIndex.value, endIndex.value)
);

const displayedPages = computed(() => {
  const pages = [];
  const maxVisiblePages = 5;
  
  if (totalPages.value <= maxVisiblePages) {
    // Show all pages
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Show a subset of pages
    const halfVisible = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(currentPage.value - halfVisible, 1);
    let endPage = Math.min(startPage + maxVisiblePages - 1, totalPages.value);
    
    // Adjust if at the end
    if (endPage === totalPages.value) {
      startPage = Math.max(endPage - maxVisiblePages + 1, 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }
  
  return pages;
});

const displayedPageNumbers = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  
  // 如果总页数较少，全部显示
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => (i + 1).toString());
  }
  
  // 否则显示部分页码，带省略号
  const result = [];
  
  // 总是显示第一页
  result.push('1');
  
  // 如果当前页靠近开始
  if (current <= 4) {
    for (let i = 2; i <= 5; i++) {
      result.push(i.toString());
    }
    result.push('...');
    result.push(total.toString());
  } 
  // 如果当前页靠近结束
  else if (current >= total - 3) {
    result.push('...');
    for (let i = total - 4; i < total; i++) {
      result.push(i.toString());
    }
  } 
  // 如果当前页在中间
  else {
    result.push('...');
    for (let i = current - 1; i <= current + 1; i++) {
      result.push(i.toString());
    }
    result.push('...');
    result.push(total.toString());
  }
  
  return result;
});



// Methods
function getDataSourceName(id: string) {
  const dataSource = dataSourceStore.dataSources.find(ds => ds.id === id);
  return dataSource ? dataSource.name : 'Unknown';
}

function formatDate(dateString: string) {
  try {
    // 简化日期显示，不使用date-fns
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (error) {
    return 'Unknown date';
  }
}

function toggleFavorite(query: any) {
  if (query.isFavorite) {
    queryStore.unfavoriteQuery(query.id);
  } else {
    queryStore.favoriteQuery(query.id);
  }
}

function viewQueryDetail(query: any) {
  router.push(`/query/detail/${query.id}`);
}

function editQuery(query: any) {
  router.push(`/query/editor?id=${query.id}`);
}

function deleteQuery(query: any) {
  if (confirm(`Are you sure you want to delete "${query.name}"?`)) {
    queryStore.deleteQuery(query.id);
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

function goToPage(page: number) {
  currentPage.value = page;
}
</script>

<style scoped>
.queries-list-container {
  background-color: #f9fafb;
  min-height: calc(100vh - 60px); /* Adjust based on your header height */
  padding-bottom: 2rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>