<template>
  <div class="query-version-list-container">
    <div class="page-header">
      <h1 class="page-title">查询版本列表</h1>
      
      <div class="header-actions">
        <vs-input
          v-model="searchQuery"
          placeholder="搜索查询名称、描述或创建者"
          class="search-input"
        >
          <template #icon>
            <vs-icon name="search" />
          </template>
        </vs-input>

        <vs-select
          v-model="statusFilter"
          placeholder="状态筛选"
          class="status-filter"
        >
          <vs-option value="all">所有状态</vs-option>
          <vs-option value="draft">草稿</vs-option>
          <vs-option value="review">审核中</vs-option>
          <vs-option value="approved">已批准</vs-option>
          <vs-option value="published">已发布</vs-option>
          <vs-option value="deprecated">已弃用</vs-option>
          <vs-option value="archived">已归档</vs-option>
        </vs-select>

        <vs-select
          v-model="sortOption"
          placeholder="排序方式"
          class="sort-option"
        >
          <vs-option value="updated_desc">最近更新</vs-option>
          <vs-option value="updated_asc">最早更新</vs-option>
          <vs-option value="created_desc">最近创建</vs-option>
          <vs-option value="created_asc">最早创建</vs-option>
          <vs-option value="name_asc">名称 A-Z</vs-option>
          <vs-option value="name_desc">名称 Z-A</vs-option>
        </vs-select>

        <vs-button color="primary" to="/query/editor">
          <template #icon>
            <vs-icon name="add" />
          </template>
          新建查询
        </vs-button>
      </div>
    </div>

    <!-- 加载中状态 -->
    <div v-if="loading" class="loading-container">
      <vs-spinner size="large" />
      <div class="loading-text">加载查询版本列表...</div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <vs-icon name="error" size="large" class="error-icon" />
      <div class="error-message">加载查询版本失败</div>
      <div class="error-details">{{ error }}</div>
      <vs-button @click="loadQueryVersions">重试</vs-button>
    </div>

    <!-- 空状态 -->
    <div v-else-if="filteredVersions.length === 0" class="empty-container">
      <vs-icon name="description" size="large" class="empty-icon" />
      <div class="empty-message">
        {{ searchQuery || statusFilter !== 'all' ? '没有符合筛选条件的查询版本' : '暂无查询版本' }}
      </div>
      <div class="empty-action">
        <vs-button v-if="searchQuery || statusFilter !== 'all'" @click="resetFilters">
          清除筛选条件
        </vs-button>
        <vs-button v-else color="primary" to="/query/editor">
          创建第一个查询
        </vs-button>
      </div>
    </div>

    <!-- 版本列表 -->
    <div v-else class="versions-list">
      <div v-for="query in filteredVersions" :key="query.id" class="version-card">
        <div class="version-header">
          <router-link :to="`/query/version/${query.id}`" class="query-name">
            {{ query.name }}
          </router-link>
          
          <div class="version-badge" :class="`status-${query.currentVersion?.status || 'draft'}`">
            {{ getStatusLabel(query.currentVersion?.status || 'draft') }}
          </div>
        </div>
        
        <div class="version-details">
          <div class="version-info">
            <div class="info-row">
              <vs-icon name="database" size="small" class="info-icon" />
              <span class="info-label">数据源:</span>
              <span class="info-value">{{ query.dataSource?.name || '未知数据源' }}</span>
            </div>
            
            <div class="info-row">
              <vs-icon name="today" size="small" class="info-icon" />
              <span class="info-label">创建时间:</span>
              <span class="info-value">{{ formatDate(query.createdAt) }}</span>
            </div>
            
            <div class="info-row">
              <vs-icon name="history" size="small" class="info-icon" />
              <span class="info-label">最近更新:</span>
              <span class="info-value">{{ formatDate(query.updatedAt) }}</span>
            </div>
            
            <div class="info-row">
              <vs-icon name="person" size="small" class="info-icon" />
              <span class="info-label">创建者:</span>
              <span class="info-value">{{ query.createdBy?.name || '未知用户' }}</span>
            </div>
          </div>
          
          <div class="version-description" v-if="query.description">
            {{ query.description }}
          </div>
          <div class="version-description empty" v-else>
            暂无描述
          </div>
          
          <div class="versions-count">
            <vs-icon name="history" size="small" class="versions-icon" />
            <span>{{ query.versions?.length || 0 }} 个版本</span>
          </div>
        </div>
        
        <div class="version-actions">
          <router-link :to="`/query/version/${query.id}`" class="action-link">
            <vs-button flat size="small">
              查看详情
            </vs-button>
          </router-link>
          
          <vs-button 
            v-if="canEditQuery(query)"
            flat 
            size="small"
            to="/query/editor"
            :params="{ queryId: query.id }"
          >
            编辑
          </vs-button>
          
          <vs-button 
            v-if="canRunQuery(query)"
            flat 
            size="small"
            @click="runQuery(query)"
          >
            执行
          </vs-button>
          
          <vs-button 
            v-if="isFavoritable(query)"
            flat 
            size="small"
            :color="query.isFavorite ? 'warning' : 'default'"
            @click="toggleFavorite(query)"
          >
            <template #icon>
              <vs-icon :name="query.isFavorite ? 'star' : 'star_border'" />
            </template>
            {{ query.isFavorite ? '取消收藏' : '收藏' }}
          </vs-button>
        </div>
      </div>
      
      <!-- 分页 -->
      <div class="pagination-container" v-if="totalPages > 1">
        <vs-pagination
          v-model="currentPage"
          :length="totalPages"
          @input="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { queryService } from '@/services/queryService';
import type { Query } from '@/types/query';

// 路由
const router = useRouter();

// 状态
const queries = ref<Query[]>([]);
const loading = ref(true);
const error = ref<string | null>(null);
const searchQuery = ref('');
const statusFilter = ref('all');
const sortOption = ref('updated_desc');
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);

// 计算属性
const totalPages = computed(() => Math.ceil(totalItems.value / pageSize.value));

const filteredVersions = computed(() => {
  let result = [...queries.value];
  
  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(q => 
      (q.name?.toLowerCase().includes(query)) ||
      (q.description?.toLowerCase().includes(query)) ||
      (q.createdBy?.name?.toLowerCase().includes(query))
    );
  }
  
  // 状态筛选
  if (statusFilter.value !== 'all') {
    result = result.filter(q => q.currentVersion?.status === statusFilter.value);
  }
  
  // 排序
  result = sortVersions(result, sortOption.value);
  
  return result;
});

// 方法
function sortVersions(versions: Query[], option: string) {
  return [...versions].sort((a, b) => {
    switch (option) {
      case 'updated_desc':
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      case 'updated_asc':
        return new Date(a.updatedAt || 0).getTime() - new Date(b.updatedAt || 0).getTime();
      case 'created_desc':
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case 'created_asc':
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      case 'name_asc':
        return (a.name || '').localeCompare(b.name || '');
      case 'name_desc':
        return (b.name || '').localeCompare(a.name || '');
      default:
        return 0;
    }
  });
}

function getStatusLabel(status: string): string {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    review: '审核中',
    approved: '已批准',
    published: '已发布',
    deprecated: '已弃用',
    archived: '已归档'
  };
  
  return statusMap[status] || '未知状态';
}

function formatDate(dateString?: string): string {
  if (!dateString) return '未知日期';
  
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

async function loadQueryVersions() {
  loading.value = true;
  error.value = null;
  
  try {
    const response = await queryService.getQueries({
      page: currentPage.value,
      pageSize: pageSize.value,
      sortBy: sortOption.value.split('_')[0],
      sortOrder: sortOption.value.split('_')[1]
    });
    
    queries.value = response.data;
    totalItems.value = response.meta.total;
  } catch (err) {
    console.error('Failed to load query versions:', err);
    error.value = err instanceof Error ? err.message : '加载查询版本失败';
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  searchQuery.value = '';
  statusFilter.value = 'all';
  currentPage.value = 1;
  loadQueryVersions();
}

function handlePageChange() {
  loadQueryVersions();
}

function canEditQuery(query: Query): boolean {
  // 通常只有草稿状态的查询可以编辑
  return query.currentVersion?.status === 'draft';
}

function canRunQuery(query: Query): boolean {
  // 查询通常需要处于已批准或已发布状态才能执行
  const status = query.currentVersion?.status;
  return status === 'approved' || status === 'published';
}

function isFavoritable(query: Query): boolean {
  // 判断查询是否可以收藏，通常所有查询都可以收藏
  return true;
}

async function toggleFavorite(query: Query) {
  try {
    if (query.isFavorite) {
      await queryService.unfavoriteQuery(query.id);
    } else {
      await queryService.favoriteQuery(query.id);
    }
    
    // 更新本地状态
    query.isFavorite = !query.isFavorite;
  } catch (err) {
    console.error('Failed to toggle favorite status:', err);
  }
}

async function runQuery(query: Query) {
  // 跳转到查询执行页面
  router.push({
    name: 'QueryVersionDetail',
    params: { id: query.id },
    query: { tab: 'execute' }
  });
}

// 监听筛选条件变化
watch([searchQuery, statusFilter, sortOption], () => {
  currentPage.value = 1;
  loadQueryVersions();
}, { debounce: 300 });

// 初始化
onMounted(() => {
  loadQueryVersions();
});
</script>

<style scoped>
.query-version-list-container {
  padding: 2rem;
  width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--text-primary);
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  width: 300px;
}

.loading-container,
.error-container,
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  margin: 2rem 0;
  background-color: var(--background-secondary);
  border-radius: 0.5rem;
}

.loading-text {
  margin-top: 1rem;
  font-size: 1.1rem;
  color: var(--text-secondary);
}

.error-icon,
.empty-icon {
  color: var(--error-color);
  margin-bottom: 1rem;
}

.empty-icon {
  color: var(--text-secondary);
}

.error-message,
.empty-message {
  font-size: 1.1rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.error-details {
  margin-bottom: 1.5rem;
  color: var(--text-secondary);
  text-align: center;
}

.empty-action {
  margin-top: 1.5rem;
}

.versions-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.version-card {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  padding: 1.5rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.version-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.query-name {
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--primary-color);
  text-decoration: none;
}

.query-name:hover {
  text-decoration: underline;
}

.version-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-draft {
  background-color: rgba(var(--primary-rgb), 0.15);
  color: var(--primary-color);
}

.status-review {
  background-color: rgba(var(--warning-rgb), 0.15);
  color: var(--warning-color);
}

.status-approved {
  background-color: rgba(var(--success-rgb), 0.15);
  color: var(--success-color);
}

.status-published {
  background-color: rgba(var(--success-rgb), 0.15);
  color: var(--success-color);
}

.status-deprecated {
  background-color: rgba(var(--gray-rgb), 0.15);
  color: var(--gray-color);
}

.status-archived {
  background-color: rgba(var(--dark-rgb), 0.15);
  color: var(--dark-color);
}

.version-details {
  margin-bottom: 1.5rem;
}

.version-info {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-icon {
  color: var(--text-secondary);
}

.info-label {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.info-value {
  font-weight: 500;
}

.version-description {
  background-color: var(--background-secondary);
  padding: 0.75rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.version-description.empty {
  color: var(--text-tertiary);
  font-style: italic;
}

.versions-count {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.versions-icon {
  color: var(--text-secondary);
}

.version-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}
</style>