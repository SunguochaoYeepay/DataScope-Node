<template>
  <div class="version-history-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <vs-spinner />
      <p>正在加载版本历史...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <vs-icon name="error" />
      </div>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <vs-button @click="loadVersions">重试</vs-button>
      </div>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="versions.length === 0" class="empty-state">
      <div class="empty-icon">
        <vs-icon name="history" />
      </div>
      <p>暂无版本历史记录</p>
      <p class="empty-subtitle">创建新的版本后将显示在此处</p>
    </div>
    
    <!-- 版本列表 -->
    <div v-else class="version-list">
      <div class="version-list-header">
        <div class="header-actions">
          <vs-button 
            v-if="canCompare"
            size="small" 
            @click="$emit('compare', selectedVersions)"
            :disabled="selectedVersions.length !== 2"
          >
            比较选中的版本
          </vs-button>
          <div class="spacer"></div>
          <vs-input
            v-if="versions.length > 5"
            v-model="searchQuery"
            placeholder="搜索版本..."
            size="small"
            icon="search"
          />
        </div>
        <div class="list-info">
          共 {{ versions.length }} 个版本
          <span v-if="selectedVersions.length > 0">
            (已选择 {{ selectedVersions.length }} 个)
          </span>
        </div>
      </div>
      
      <div class="version-list-body">
        <div 
          v-for="version in filteredVersions" 
          :key="version.id"
          :class="['version-item', { 
            'is-active': activeVersionId === version.id,
            'is-selected': selectedVersions.includes(version.id)
          }]"
          @click="handleVersionClick(version)"
        >
          <div v-if="selectable" class="version-checkbox">
            <vs-checkbox
              :model-value="selectedVersions.includes(version.id)"
              @update:model-value="toggleVersionSelection(version.id)"
              @click.stop
            />
          </div>
          
          <div class="version-info">
            <div class="version-header">
              <div class="version-number">
                版本 {{ version.versionNumber }}
                <span v-if="version.isLatest" class="latest-badge">最新</span>
              </div>
              <div class="version-time">
                {{ formatDate(version.createdAt) }}
              </div>
            </div>
            
            <div class="version-meta">
              <div class="author">
                <vs-icon name="person" size="small" />
                {{ version.createdBy?.name || '未知用户' }}
              </div>
              <div class="changes">
                <vs-icon name="edit" size="small" />
                <span v-if="version.changes && version.changes.length > 0">
                  {{ version.changes.join(', ') }}
                </span>
                <span v-else>未记录变更</span>
              </div>
            </div>
            
            <div class="version-comment" v-if="version.comment">
              <div class="comment-icon">
                <vs-icon name="comment" size="small" />
              </div>
              <div class="comment-text">{{ version.comment }}</div>
            </div>
          </div>
          
          <div class="version-actions">
            <vs-dropdown position="bottom-right">
              <vs-button icon="more_vert" size="small" flat></vs-button>
              <template #dropdown>
                <vs-dropdown-item @click.stop="viewVersion(version)">
                  <vs-icon name="visibility" />
                  查看详情
                </vs-dropdown-item>
                <vs-dropdown-item @click.stop="$emit('restore', version)" v-if="!version.isLatest">
                  <vs-icon name="restore" />
                  恢复此版本
                </vs-dropdown-item>
                <vs-dropdown-item @click.stop="$emit('createFrom', version)">
                  <vs-icon name="add_circle" />
                  基于此版本创建新版本
                </vs-dropdown-item>
                <vs-dropdown-item @click.stop="$emit('tag', version)">
                  <vs-icon name="bookmark" />
                  为此版本添加标签
                </vs-dropdown-item>
                <vs-dropdown-item v-if="showExportOption" @click.stop="$emit('export', version)">
                  <vs-icon name="download" />
                  导出版本
                </vs-dropdown-item>
              </template>
            </vs-dropdown>
          </div>
        </div>
      </div>
      
      <!-- 分页控件 -->
      <div v-if="pagination && totalPages > 1" class="version-pagination">
        <vs-pagination
          v-model="currentPage"
          :length="totalPages"
          @change="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { format } from 'date-fns';
import { queryVersionService } from '@/services/queryVersionService';
import type { QueryVersion } from '@/types/query';

// 组件属性
interface Props {
  queryId: string;
  activeVersionId?: string;
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  versions?: QueryVersion[];
  showExportOption?: boolean;
  canCompare?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  activeVersionId: '',
  selectable: false,
  pagination: false,
  pageSize: 10,
  versions: () => [],
  showExportOption: false,
  canCompare: false
});

// 事件
const emit = defineEmits<{
  (e: 'select', version: QueryVersion): void;
  (e: 'compare', versionIds: string[]): void;
  (e: 'restore', version: QueryVersion): void;
  (e: 'createFrom', version: QueryVersion): void;
  (e: 'tag', version: QueryVersion): void;
  (e: 'export', version: QueryVersion): void;
  (e: 'page-change', page: number): void;
}>();

// 状态
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');
const versions = ref<QueryVersion[]>([]);
const selectedVersions = ref<string[]>([]);
const searchQuery = ref('');
const currentPage = ref(1);
const totalVersions = ref(0);

// 计算属性
const filteredVersions = computed(() => {
  let result = props.versions.length > 0 ? props.versions : versions.value;
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(version => {
      return (
        `版本 ${version.versionNumber}`.toLowerCase().includes(query) ||
        (version.comment && version.comment.toLowerCase().includes(query)) ||
        (version.createdBy?.name && version.createdBy.name.toLowerCase().includes(query)) ||
        (version.changes && version.changes.some(change => change.toLowerCase().includes(query)))
      );
    });
  }
  
  return result;
});

const totalPages = computed(() => {
  if (!props.pagination) return 1;
  return Math.ceil(totalVersions.value / props.pageSize);
});

// 方法
function formatDate(dateString?: string) {
  if (!dateString) return '未知日期';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
  } catch (e) {
    return dateString;
  }
}

function handleVersionClick(version: QueryVersion) {
  if (props.selectable) {
    toggleVersionSelection(version.id);
  } else {
    emit('select', version);
  }
}

function toggleVersionSelection(versionId: string) {
  const index = selectedVersions.value.indexOf(versionId);
  if (index === -1) {
    if (props.canCompare && selectedVersions.value.length >= 2) {
      // 如果已经选择了两个版本，移除最早选择的那个
      selectedVersions.value.shift();
    }
    selectedVersions.value.push(versionId);
  } else {
    selectedVersions.value.splice(index, 1);
  }
}

function viewVersion(version: QueryVersion) {
  emit('select', version);
}

function handlePageChange(page: number) {
  currentPage.value = page;
  emit('page-change', page);
  
  if (props.versions.length === 0) {
    loadVersions();
  }
}

async function loadVersions() {
  if (!props.queryId) return;
  
  // 如果已经从父组件接收到版本列表，则不需要加载
  if (props.versions.length > 0) return;
  
  loading.value = true;
  error.value = false;
  errorMessage.value = '';
  
  try {
    if (props.pagination) {
      const response = await queryVersionService.getQueryVersionsPaginated(
        props.queryId, 
        currentPage.value, 
        props.pageSize
      );
      versions.value = response.data.versions;
      totalVersions.value = response.data.total;
    } else {
      const response = await queryVersionService.getQueryVersions(props.queryId);
      versions.value = response.data;
      totalVersions.value = response.data.length;
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = '加载版本历史失败，请重试';
    console.error('Failed to load version history:', err);
  } finally {
    loading.value = false;
  }
}

// 生命周期钩子
onMounted(async () => {
  await loadVersions();
});

// 监听版本变化
watch(() => props.versions, (newVersions) => {
  if (newVersions.length > 0) {
    selectedVersions.value = [];
    totalVersions.value = newVersions.length;
  }
}, { deep: true });

// 监听页码变化
watch(() => props.pagination, (newValue) => {
  if (newValue) {
    loadVersions();
  }
});
</script>

<style scoped>
.version-history-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.loading-state, .error-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 2rem;
  text-align: center;
}

.error-icon, .empty-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-icon {
  color: var(--error-color);
}

.empty-icon {
  color: var(--text-secondary);
}

.error-message {
  margin-bottom: 1rem;
  color: var(--error-color);
}

.empty-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
}

.version-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.version-list-header {
  padding: 1rem;
  background-color: var(--background-secondary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.spacer {
  flex: 1;
}

.list-info {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.version-list-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.5rem;
}

.version-item {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: var(--background-secondary);
  transition: background-color 0.2s ease;
  cursor: pointer;
  position: relative;
}

.version-item:hover {
  background-color: var(--background-hover);
}

.version-item.is-active {
  background-color: var(--primary-color-light);
  border-left: 3px solid var(--primary-color);
}

.version-item.is-selected {
  background-color: var(--background-selected);
}

.version-checkbox {
  margin-right: 0.75rem;
  padding-top: 0.25rem;
}

.version-info {
  flex: 1;
  min-width: 0;
}

.version-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.version-number {
  font-weight: 500;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.latest-badge {
  background-color: var(--primary-color);
  color: white;
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 0.25rem;
}

.version-time {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.version-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.author, .changes {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-secondary);
}

.version-comment {
  background-color: var(--background-primary);
  border-radius: 0.25rem;
  padding: 0.75rem;
  margin-top: 0.5rem;
  display: flex;
  gap: 0.5rem;
}

.comment-icon {
  color: var(--text-secondary);
}

.comment-text {
  flex: 1;
  font-style: italic;
  font-size: 0.9rem;
  line-height: 1.4;
  word-break: break-word;
}

.version-actions {
  margin-left: 0.5rem;
}

.version-pagination {
  padding: 1rem;
  display: flex;
  justify-content: center;
  border-top: 1px solid var(--border-color);
}
</style>