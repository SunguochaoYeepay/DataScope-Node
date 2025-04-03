<template>
  <div class="version-tagging-container">
    <div class="tagging-header">
      <h3>版本标记 - {{ version?.versionNumber ? `版本 ${version.versionNumber}` : '未知版本' }}</h3>
      <p class="tagging-subtitle">为此版本添加标签和备注，方便后续查找和管理</p>
    </div>
    
    <div class="form-container">
      <div class="form-group">
        <label for="tag-name">标签名称</label>
        <vs-input
          id="tag-name"
          v-model="tagName"
          placeholder="输入标签名称（如：生产版本、测试版本等）"
          :error="tagNameError"
          @focus="tagNameError = ''"
        />
        <p v-if="tagNameError" class="error-message">{{ tagNameError }}</p>
      </div>
      
      <div class="form-group">
        <label>标签类型</label>
        <div class="tag-type-options">
          <div
            v-for="type in tagTypes"
            :key="type.value"
            :class="['tag-type-option', { active: tagType === type.value }]"
            @click="tagType = type.value"
          >
            <div class="tag-color" :style="{ backgroundColor: type.color }"></div>
            <div class="tag-label">{{ type.label }}</div>
          </div>
        </div>
      </div>
      
      <div class="form-group">
        <label for="tag-comment">备注信息</label>
        <vs-textarea
          id="tag-comment"
          v-model="tagComment"
          placeholder="输入关于此版本的备注信息"
          rows="4"
        />
      </div>
      
      <div v-if="currentTags.length > 0" class="current-tags-container">
        <h4>当前已有标签</h4>
        <div class="tags-list">
          <div
            v-for="tag in currentTags"
            :key="tag.id"
            class="tag-item"
          >
            <div class="tag-color" :style="{ backgroundColor: getTagTypeColor(tag.type) }"></div>
            <div class="tag-info">
              <div class="tag-name">{{ tag.name }}</div>
              <div class="tag-meta">
                <span class="tag-by">{{ tag.createdBy?.name || '未知用户' }}</span>
                <span class="tag-date">{{ formatDate(tag.createdAt) }}</span>
              </div>
              <div class="tag-comment" v-if="tag.comment">{{ tag.comment }}</div>
            </div>
            <div class="tag-actions">
              <vs-button
                icon="delete"
                size="small"
                flat
                color="danger"
                @click="confirmDeleteTag(tag)"
                title="删除标签"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="actions-container">
      <vs-button @click="$emit('cancel')">取消</vs-button>
      <vs-button
        color="primary"
        :loading="saving"
        @click="saveTag"
      >
        保存标签
      </vs-button>
    </div>
    
    <!-- 确认删除对话框 -->
    <vs-dialog v-model="showDeleteConfirm" width="400px">
      <template #header>
        <h3>确认删除标签</h3>
      </template>
      
      <div class="delete-confirm-content">
        <p>您确定要删除标签 "{{ tagToDelete?.name }}" 吗？</p>
        <p>此操作无法撤销。</p>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <vs-button @click="showDeleteConfirm = false">取消</vs-button>
          <vs-button
            color="danger"
            :loading="deleting"
            @click="deleteTag"
          >
            确认删除
          </vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { format } from 'date-fns';
import { queryVersionService } from '@/services/queryVersionService';
import type { QueryVersion, VersionTag } from '@/types/query';

// 组件属性
interface Props {
  queryId: string;
  version?: QueryVersion;
  versionId?: string;
}

const props = defineProps<Props>();

// 事件
const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'saved'): void;
}>();

// 标签类型配置
const tagTypes = [
  { value: 'development', label: '开发版本', color: '#64B5F6' },
  { value: 'testing', label: '测试版本', color: '#FFD54F' },
  { value: 'staging', label: '预发布版本', color: '#9575CD' },
  { value: 'production', label: '生产版本', color: '#4CAF50' },
  { value: 'archived', label: '归档版本', color: '#90A4AE' },
  { value: 'custom', label: '自定义', color: '#FF8A65' }
];

// 状态
const tagName = ref('');
const tagType = ref('development');
const tagComment = ref('');
const tagNameError = ref('');
const currentTags = ref<VersionTag[]>([]);
const loading = ref(false);
const saving = ref(false);
const deleting = ref(false);
const showDeleteConfirm = ref(false);
const tagToDelete = ref<VersionTag | null>(null);

// 计算属性
const effectiveVersionId = computed(() => {
  return props.versionId || props.version?.id;
});

// 方法
function getTagTypeColor(type: string) {
  const found = tagTypes.find(t => t.value === type);
  return found ? found.color : tagTypes[0].color;
}

function formatDate(dateString?: string) {
  if (!dateString) return '未知日期';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd HH:mm:ss');
  } catch (e) {
    return dateString;
  }
}

function confirmDeleteTag(tag: VersionTag) {
  tagToDelete.value = tag;
  showDeleteConfirm.value = true;
}

async function loadTags() {
  if (!props.queryId || !effectiveVersionId.value) return;
  
  loading.value = true;
  
  try {
    const response = await queryVersionService.getVersionTags(
      props.queryId,
      effectiveVersionId.value
    );
    currentTags.value = response.data;
  } catch (err) {
    console.error('Failed to load version tags:', err);
  } finally {
    loading.value = false;
  }
}

async function saveTag() {
  if (!props.queryId || !effectiveVersionId.value) return;
  
  // 验证
  if (!tagName.value.trim()) {
    tagNameError.value = '标签名称不能为空';
    return;
  }
  
  saving.value = true;
  
  try {
    await queryVersionService.createVersionTag(
      props.queryId,
      effectiveVersionId.value,
      {
        name: tagName.value.trim(),
        type: tagType.value,
        comment: tagComment.value.trim()
      }
    );
    
    // 重置表单
    tagName.value = '';
    tagComment.value = '';
    
    // 重新加载标签列表
    await loadTags();
    
    // 通知父组件保存成功
    emit('saved');
  } catch (err) {
    console.error('Failed to save version tag:', err);
  } finally {
    saving.value = false;
  }
}

async function deleteTag() {
  if (!tagToDelete.value || !props.queryId) return;
  
  deleting.value = true;
  
  try {
    await queryVersionService.deleteVersionTag(
      props.queryId,
      tagToDelete.value.id
    );
    
    // 从列表中移除
    currentTags.value = currentTags.value.filter(t => t.id !== tagToDelete.value?.id);
    
    // 关闭确认对话框
    showDeleteConfirm.value = false;
    tagToDelete.value = null;
  } catch (err) {
    console.error('Failed to delete version tag:', err);
  } finally {
    deleting.value = false;
  }
}

// 生命周期钩子
onMounted(async () => {
  await loadTags();
});

// 监听版本变化
watch(() => [props.version, props.versionId], async () => {
  if (effectiveVersionId.value) {
    await loadTags();
  }
});
</script>

<style scoped>
.version-tagging-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.tagging-header {
  margin-bottom: 1.5rem;
}

.tagging-header h3 {
  margin-bottom: 0.5rem;
  font-size: 1.25rem;
}

.tagging-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.form-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.error-message {
  color: var(--error-color);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.tag-type-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-type-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid var(--border-color);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tag-type-option:hover {
  border-color: var(--primary-color-light);
}

.tag-type-option.active {
  background-color: var(--primary-color-light);
  border-color: var(--primary-color);
}

.tag-color {
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
}

.current-tags-container {
  margin-top: 2rem;
}

.current-tags-container h4 {
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 500;
}

.tags-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.tag-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: var(--background-secondary);
  border-radius: 0.25rem;
}

.tag-info {
  flex: 1;
  min-width: 0;
}

.tag-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.tag-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.tag-comment {
  font-size: 0.9rem;
  color: var(--text-primary);
  line-height: 1.4;
  word-break: break-word;
}

.actions-container {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.delete-confirm-content {
  padding: 1rem 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}
</style>