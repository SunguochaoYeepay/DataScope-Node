<template>
  <div class="version-compare-container">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <vs-spinner />
      <p>正在加载版本比较数据...</p>
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <vs-icon name="error" />
      </div>
      <p class="error-message">{{ errorMessage }}</p>
      <div class="error-actions">
        <vs-button @click="loadVersionData">重试</vs-button>
      </div>
    </div>
    
    <!-- 主要内容 -->
    <div v-else class="compare-content">
      <!-- 版本选择器 -->
      <div class="versions-selector">
        <div class="version-selector left">
          <h3>基准版本</h3>
          <vs-select
            v-model="baseVersionId"
            :options="availableVersionsForBase"
            @change="compareVersions"
          >
            <template #option="{ label, value }">
              <div class="version-option">
                <span>{{ label }}</span>
                <span class="version-date">{{ formatDate(getVersionById(value)?.createdAt) }}</span>
              </div>
            </template>
          </vs-select>
        </div>
        
        <div class="version-actions">
          <vs-button icon="swap_horiz" @click="swapVersions" title="交换版本">
            交换
          </vs-button>
        </div>
        
        <div class="version-selector right">
          <h3>比较版本</h3>
          <vs-select
            v-model="compareVersionId"
            :options="availableVersionsForCompare"
            @change="compareVersions"
          >
            <template #option="{ label, value }">
              <div class="version-option">
                <span>{{ label }}</span>
                <span class="version-date">{{ formatDate(getVersionById(value)?.createdAt) }}</span>
              </div>
            </template>
          </vs-select>
        </div>
      </div>
      
      <!-- 比较结果 -->
      <div class="comparison-results">
        <div v-if="!hasComparison" class="no-comparison">
          <p>请选择两个不同的版本进行比较</p>
        </div>
        <div v-else class="diff-container">
          <!-- 元数据差异 -->
          <div class="metadata-diff">
            <h3>查询元数据变更</h3>
            <div v-if="metadataDiff.length === 0" class="no-changes">
              <p>元数据无变更</p>
            </div>
            <div v-else class="changes-list">
              <div v-for="(diff, index) in metadataDiff" :key="index" class="diff-item">
                <div class="diff-field">{{ diff.field }}</div>
                <div class="diff-values">
                  <div class="old-value">
                    <div class="value-label">旧值:</div>
                    <div class="value-content">{{ diff.oldValue || '(空)' }}</div>
                  </div>
                  <div class="new-value">
                    <div class="value-label">新值:</div>
                    <div class="value-content">{{ diff.newValue || '(空)' }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- SQL差异 -->
          <div class="sql-diff">
            <h3>SQL语句变更</h3>
            <div v-if="!sqlDiffContent" class="no-changes">
              <p>SQL语句无变更</p>
            </div>
            <div v-else class="code-diff">
              <div class="diff-view" ref="diffView"></div>
            </div>
          </div>
          
          <!-- 参数差异 -->
          <div class="params-diff">
            <h3>查询参数变更</h3>
            <div v-if="paramsDiff.length === 0" class="no-changes">
              <p>查询参数无变更</p>
            </div>
            <div v-else class="changes-list">
              <div v-for="(diff, index) in paramsDiff" :key="index" class="diff-item">
                <div class="diff-field">{{ diff.name }}</div>
                <div class="diff-values">
                  <div class="diff-change-type">
                    {{ diff.changeType === 'added' ? '新增' : 
                       diff.changeType === 'removed' ? '删除' : '修改' }}
                  </div>
                  <div v-if="diff.changeType !== 'added'" class="old-value">
                    <div class="value-label">旧值:</div>
                    <div class="value-content">
                      <pre>{{ JSON.stringify(diff.oldValue, null, 2) || '(空)' }}</pre>
                    </div>
                  </div>
                  <div v-if="diff.changeType !== 'removed'" class="new-value">
                    <div class="value-label">新值:</div>
                    <div class="value-content">
                      <pre>{{ JSON.stringify(diff.newValue, null, 2) || '(空)' }}</pre>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { format } from 'date-fns';
import * as monaco from 'monaco-editor';
import { DiffEditor } from 'monaco-editor';
import { queryVersionService } from '@/services/queryVersionService';
import type { QueryVersion } from '@/types/query';

// 组件属性
interface Props {
  queryId: string;
  versions?: QueryVersion[];
}

const props = withDefaults(defineProps<Props>(), {
  versions: () => []
});

// 状态
const loading = ref(false);
const error = ref(false);
const errorMessage = ref('');
const versions = ref<QueryVersion[]>([]);
const baseVersionId = ref<string | null>(null);
const compareVersionId = ref<string | null>(null);
const metadataDiff = ref<Array<{field: string, oldValue: any, newValue: any}>>([]);
const paramsDiff = ref<Array<{name: string, changeType: string, oldValue?: any, newValue?: any}>>([]);
const sqlDiffContent = ref<boolean>(false);
const diffView = ref<HTMLElement | null>(null);
const diffEditor = ref<DiffEditor | null>(null);

// 路由
const route = useRoute();

// 计算属性
const allVersions = computed(() => {
  return props.versions.length > 0 ? props.versions : versions.value;
});

const hasComparison = computed(() => {
  return baseVersionId.value && 
         compareVersionId.value && 
         baseVersionId.value !== compareVersionId.value;
});

const availableVersionsForBase = computed(() => {
  return allVersions.value.map(version => ({
    label: `版本 ${version.versionNumber}${version.isLatest ? ' (最新)' : ''}`,
    value: version.id
  }));
});

const availableVersionsForCompare = computed(() => {
  return allVersions.value.map(version => ({
    label: `版本 ${version.versionNumber}${version.isLatest ? ' (最新)' : ''}`,
    value: version.id
  }));
});

// 方法
function getVersionById(id: string | null) {
  if (!id) return null;
  return allVersions.value.find(v => v.id === id) || null;
}

function formatDate(dateString?: string) {
  if (!dateString) return '未知日期';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
  } catch (e) {
    return dateString;
  }
}

function swapVersions() {
  const temp = baseVersionId.value;
  baseVersionId.value = compareVersionId.value;
  compareVersionId.value = temp;
  compareVersions();
}

async function loadVersionData() {
  if (!props.queryId) return;
  
  loading.value = true;
  error.value = false;
  errorMessage.value = '';
  
  try {
    // 如果没有提供版本列表，则从API获取
    if (props.versions.length === 0) {
      const response = await queryVersionService.getQueryVersions(props.queryId);
      versions.value = response.data;
      
      // 默认选择最新的两个版本进行比较
      if (versions.value.length >= 2) {
        baseVersionId.value = versions.value[1].id; // 第二新的版本
        compareVersionId.value = versions.value[0].id; // 最新版本
        await compareVersions();
      }
    } else {
      // 使用提供的版本列表
      if (props.versions.length >= 2) {
        baseVersionId.value = props.versions[1].id; // 第二新的版本
        compareVersionId.value = props.versions[0].id; // 最新版本
        await compareVersions();
      }
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = '加载版本数据失败，请重试';
    console.error('Failed to load version data:', err);
  } finally {
    loading.value = false;
  }
}

async function compareVersions() {
  if (!baseVersionId.value || !compareVersionId.value || baseVersionId.value === compareVersionId.value) {
    metadataDiff.value = [];
    paramsDiff.value = [];
    sqlDiffContent.value = false;
    return;
  }
  
  loading.value = true;
  error.value = false;
  
  try {
    const response = await queryVersionService.compareVersions(
      props.queryId,
      baseVersionId.value,
      compareVersionId.value
    );
    
    // 处理元数据差异
    metadataDiff.value = response.data.metadataDiff || [];
    
    // 处理参数差异
    paramsDiff.value = response.data.paramsDiff || [];
    
    // 处理SQL差异
    const baseVersion = getVersionById(baseVersionId.value);
    const compareVersion = getVersionById(compareVersionId.value);
    
    if (baseVersion && compareVersion) {
      sqlDiffContent.value = baseVersion.sql !== compareVersion.sql;
      
      // 创建diff编辑器
      await nextTick();
      if (diffView.value && sqlDiffContent.value) {
        if (diffEditor.value) {
          diffEditor.value.dispose();
        }
        
        diffEditor.value = monaco.editor.createDiffEditor(diffView.value, {
          readOnly: true,
          minimap: { enabled: false },
          automaticLayout: true,
          renderSideBySide: true,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          theme: 'vs'
        });
        
        diffEditor.value.setModel({
          original: monaco.editor.createModel(baseVersion.sql || '', 'sql'),
          modified: monaco.editor.createModel(compareVersion.sql || '', 'sql')
        });
      }
    }
  } catch (err) {
    error.value = true;
    errorMessage.value = '版本比较失败，请重试';
    console.error('Failed to compare versions:', err);
  } finally {
    loading.value = false;
  }
}

// 生命周期钩子
onMounted(async () => {
  await loadVersionData();
});

// 监听版本变化
watch(() => props.versions, async (newVersions) => {
  if (newVersions.length > 0) {
    versions.value = newVersions;
    if (newVersions.length >= 2) {
      baseVersionId.value = newVersions[1].id;
      compareVersionId.value = newVersions[0].id;
      await compareVersions();
    }
  }
}, { deep: true });
</script>

<style scoped>
.version-compare-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: hidden;
}

.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  padding: 2rem;
  text-align: center;
}

.error-icon {
  color: var(--error-color);
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-message {
  margin-bottom: 1rem;
  color: var(--error-color);
}

.error-actions {
  display: flex;
  gap: 1rem;
}

.compare-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  gap: 1rem;
  overflow: hidden;
}

.versions-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--background-secondary);
  border-radius: 0.5rem;
}

.version-selector {
  flex: 1;
}

.version-selector h3 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.version-option {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.version-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.comparison-results {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1rem;
}

.no-comparison {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary);
}

.diff-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.metadata-diff, .sql-diff, .params-diff {
  background-color: var(--background-secondary);
  border-radius: 0.5rem;
  padding: 1rem;
}

.metadata-diff h3, .sql-diff h3, .params-diff h3 {
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
  font-weight: 500;
}

.no-changes {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  color: var(--text-secondary);
  font-style: italic;
}

.changes-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.diff-item {
  padding: 0.75rem;
  background-color: var(--background-primary);
  border-radius: 0.25rem;
  border-left: 3px solid var(--primary-color);
}

.diff-field {
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.diff-values {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.old-value, .new-value {
  display: flex;
  gap: 0.5rem;
  align-items: flex-start;
}

.value-label {
  min-width: 40px;
  color: var(--text-secondary);
}

.value-content {
  flex: 1;
  word-break: break-word;
}

.old-value .value-content {
  color: var(--error-color);
  text-decoration: line-through;
  text-decoration-color: var(--error-color);
  text-decoration-thickness: 1px;
}

.new-value .value-content {
  color: var(--success-color);
}

.diff-change-type {
  font-size: 0.85rem;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  background-color: var(--primary-color);
  color: white;
  display: inline-block;
  margin-bottom: 0.5rem;
}

.code-diff {
  height: 400px;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  overflow: hidden;
}

.diff-view {
  height: 100%;
  width: 100%;
}
</style>