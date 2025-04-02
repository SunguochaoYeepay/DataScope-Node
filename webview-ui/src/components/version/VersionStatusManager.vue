<template>
  <div class="status-manager-container">
    <!-- 当前状态显示 -->
    <div class="status-display">
      <div class="status-label">当前状态:</div>
      <div class="status-value" :class="statusClass">
        <div class="status-badge" :class="statusClass"></div>
        <span>{{ statusText }}</span>
      </div>
      
      <StatusHelpTips class="help-tips" />
      
      <vs-button v-if="canManageStatus" @click="showStatusActions = !showStatusActions">
        <template #icon>
          <vs-icon name="settings" />
        </template>
        管理状态
      </vs-button>
    </div>
    
    <!-- 状态操作区域 -->
    <div v-if="showStatusActions && canManageStatus" class="status-actions">
      <div class="status-action-title">
        更改状态
        <vs-button icon="close" flat size="small" @click="showStatusActions = false" />
      </div>
      
      <div class="status-progress-bar">
        <div 
          v-for="(step, index) in workflowSteps" 
          :key="index"
          :class="[
            'progress-step', 
            { 'active': currentWorkflowStep >= index },
            { 'can-activate': canTransitionToStep(index) }
          ]"
          @click="handleStepClick(index)"
        >
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-label">{{ step.label }}</div>
        </div>
        <div class="progress-line"></div>
      </div>
      
      <div class="available-actions">
        <div v-if="availableTransitions.length === 0" class="no-actions">
          <p>当前没有可用的状态转换操作</p>
        </div>
        <div v-else class="action-list">
          <div v-for="transition in availableTransitions" :key="transition.to" class="action-item">
            <div class="action-info">
              <div class="action-title">
                <span class="action-direction">{{ transition.direction }}</span>
                <span class="action-to">{{ getStatusLabel(transition.to) }}</span>
              </div>
              <div class="action-description">{{ transition.description }}</div>
            </div>
            <div class="action-button">
              <vs-button
                :color="getActionColor(transition.to)"
                size="small"
                @click="confirmStatusChange(transition)"
              >
                {{ transition.buttonText }}
              </vs-button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-if="showCommentInput" class="transition-comment">
        <div class="comment-label">添加备注 (可选)</div>
        <vs-textarea
          v-model="transitionComment"
          placeholder="输入关于此状态变更的备注信息"
          rows="3"
        />
        <div class="comment-actions">
          <vs-button @click="cancelTransition">取消</vs-button>
          <vs-button
            color="primary"
            :loading="transitioning"
            @click="executeTransition"
          >
            确认更改
          </vs-button>
        </div>
      </div>
    </div>
    
    <!-- 状态历史记录 -->
    <div v-if="showHistory" class="status-history">
      <div class="history-header">
        <h3>状态变更历史</h3>
        <vs-button
          v-if="!loadingHistory && !statusHistory.length"
          size="small"
          @click="loadStatusHistory"
        >
          加载历史记录
        </vs-button>
      </div>
      
      <div v-if="loadingHistory" class="history-loading">
        <vs-spinner size="small" />
        <span>加载历史记录...</span>
      </div>
      
      <div v-else-if="statusHistory.length === 0" class="history-empty">
        <p>暂无状态变更历史记录</p>
      </div>
      
      <div v-else class="history-timeline">
        <div
          v-for="(historyItem, index) in statusHistory"
          :key="index"
          class="history-item"
        >
          <div class="history-point"></div>
          <div class="history-content">
            <div class="history-header">
              <div class="history-status">
                <div class="status-badge" :class="getStatusClass(historyItem.toStatus)"></div>
                <span>{{ getStatusLabel(historyItem.toStatus) }}</span>
              </div>
              <div class="history-date">{{ formatDate(historyItem.timestamp) }}</div>
            </div>
            <div class="history-user">
              <vs-icon name="person" size="small" />
              {{ historyItem.user?.name || '未知用户' }}
            </div>
            <div class="history-transition">
              <div class="transition-from">
                <span class="from-label">从:</span>
                <span class="from-value">{{ getStatusLabel(historyItem.fromStatus) }}</span>
              </div>
              <div class="transition-arrow">
                <vs-icon name="arrow_downward" size="small" />
              </div>
              <div class="transition-to">
                <span class="to-label">到:</span>
                <span class="to-value">{{ getStatusLabel(historyItem.toStatus) }}</span>
              </div>
            </div>
            <div v-if="historyItem.comment" class="history-comment">
              <div class="comment-icon">
                <vs-icon name="comment" size="small" />
              </div>
              <div class="comment-text">{{ historyItem.comment }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { queryVersionService } from '@/services/queryVersionService';
import type { QueryVersion, StatusHistory } from '@/types/query';
import StatusHelpTips from './StatusHelpTips.vue';

// 状态类型定义
type QueryStatus = 'draft' | 'review' | 'approved' | 'published' | 'deprecated' | 'archived';

// 状态转换定义
interface StatusTransition {
  from: QueryStatus;
  to: QueryStatus;
  direction: string;
  description: string;
  buttonText: string;
  requiresApproval?: boolean;
}

// 工作流步骤定义
interface WorkflowStep {
  status: QueryStatus;
  label: string;
}

// 组件属性
interface Props {
  queryId: string;
  version?: QueryVersion;
  currentStatus?: QueryStatus;
  canManageStatus?: boolean;
  showHistory?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  currentStatus: 'draft',
  canManageStatus: true,
  showHistory: true
});

// 事件
const emit = defineEmits<{
  (e: 'status-changed', newStatus: QueryStatus): void;
}>();

// 状态
const showStatusActions = ref(false);
const showCommentInput = ref(false);
const transitionComment = ref('');
const transitioning = ref(false);
const pendingTransition = ref<StatusTransition | null>(null);
const statusHistory = ref<StatusHistory[]>([]);
const loadingHistory = ref(false);

// 工作流步骤配置
const workflowSteps: WorkflowStep[] = [
  { status: 'draft', label: '草稿' },
  { status: 'review', label: '审核中' },
  { status: 'approved', label: '已批准' },
  { status: 'published', label: '已发布' }
];

// 状态标签映射
const statusLabels: Record<QueryStatus, string> = {
  draft: '草稿',
  review: '审核中',
  approved: '已批准',
  published: '已发布',
  deprecated: '已弃用',
  archived: '已归档'
};

// 状态颜色映射
const statusColors: Record<QueryStatus, string> = {
  draft: 'primary',
  review: 'warning',
  approved: 'success',
  published: 'success',
  deprecated: 'gray',
  archived: 'dark'
};

// 可用的状态转换定义
const allTransitions: StatusTransition[] = [
  {
    from: 'draft',
    to: 'review',
    direction: '提交到',
    description: '提交查询到审核流程',
    buttonText: '提交审核'
  },
  {
    from: 'review',
    to: 'approved',
    direction: '批准为',
    description: '批准通过此查询',
    buttonText: '批准',
    requiresApproval: true
  },
  {
    from: 'review',
    to: 'draft',
    direction: '退回到',
    description: '退回查询到草稿状态进行修改',
    buttonText: '退回修改'
  },
  {
    from: 'approved',
    to: 'published',
    direction: '发布为',
    description: '将批准的查询发布到生产环境',
    buttonText: '发布'
  },
  {
    from: 'approved',
    to: 'draft',
    direction: '退回到',
    description: '退回已批准的查询到草稿状态',
    buttonText: '退回修改'
  },
  {
    from: 'published',
    to: 'deprecated',
    direction: '标记为',
    description: '将此查询标记为已弃用',
    buttonText: '标记弃用'
  },
  {
    from: 'deprecated',
    to: 'published',
    direction: '重新激活为',
    description: '重新激活已弃用的查询',
    buttonText: '重新激活'
  },
  {
    from: 'deprecated',
    to: 'archived',
    direction: '归档为',
    description: '将此查询归档（不可恢复）',
    buttonText: '归档'
  }
];

// 计算属性
const effectiveStatus = computed((): QueryStatus => {
  if (props.version?.status) {
    return props.version.status as QueryStatus;
  }
  return props.currentStatus;
});

const statusText = computed(() => {
  return statusLabels[effectiveStatus.value] || '未知状态';
});

const statusClass = computed(() => {
  return `status-${effectiveStatus.value}`;
});

const currentWorkflowStep = computed(() => {
  return workflowSteps.findIndex(step => step.status === effectiveStatus.value);
});

const availableTransitions = computed(() => {
  return allTransitions.filter(t => t.from === effectiveStatus.value);
});

// 方法
function getStatusLabel(status: string): string {
  return statusLabels[status as QueryStatus] || '未知状态';
}

function getStatusClass(status: string): string {
  return `status-${status}`;
}

function getActionColor(status: string): string {
  return statusColors[status as QueryStatus] || 'primary';
}

function canTransitionToStep(stepIndex: number) {
  if (currentWorkflowStep.value === stepIndex) return false;
  
  const targetStatus = workflowSteps[stepIndex].status;
  return availableTransitions.value.some(t => t.to === targetStatus);
}

function handleStepClick(stepIndex: number) {
  if (!canTransitionToStep(stepIndex)) return;
  
  const targetStatus = workflowSteps[stepIndex].status;
  const transition = availableTransitions.value.find(t => t.to === targetStatus);
  
  if (transition) {
    confirmStatusChange(transition);
  }
}

function confirmStatusChange(transition: StatusTransition) {
  pendingTransition.value = transition;
  showCommentInput.value = true;
}

function cancelTransition() {
  pendingTransition.value = null;
  transitionComment.value = '';
  showCommentInput.value = false;
}

async function executeTransition() {
  if (!pendingTransition.value || !props.queryId) return;
  
  transitioning.value = true;
  
  try {
    const versionId = props.version?.id;
    if (!versionId) throw new Error('Version ID is required for status change');
    
    await queryVersionService.changeQueryStatus(
      props.queryId,
      versionId,
      pendingTransition.value.to as string,
      transitionComment.value
    );
    
    // 更新本地状态
    emit('status-changed', pendingTransition.value.to);
    
    // 关闭评论输入
    showCommentInput.value = false;
    transitionComment.value = '';
    pendingTransition.value = null;
    
    // 如果历史记录已加载，则重新加载
    if (statusHistory.value.length > 0) {
      await loadStatusHistory();
    }
  } catch (err) {
    console.error('Failed to change query status:', err);
  } finally {
    transitioning.value = false;
  }
}

async function loadStatusHistory() {
  if (!props.queryId || !props.version?.id) return;
  
  loadingHistory.value = true;
  
  try {
    const response = await queryVersionService.getStatusHistory(
      props.queryId,
      props.version.id
    );
    statusHistory.value = response.data;
  } catch (err) {
    console.error('Failed to load status history:', err);
  } finally {
    loadingHistory.value = false;
  }
}

function formatDate(dateString?: string) {
  if (!dateString) return '未知日期';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  } catch (e) {
    return dateString;
  }
}

// 生命周期钩子
onMounted(async () => {
  if (props.showHistory && props.queryId && props.version?.id) {
    await loadStatusHistory();
  }
});

// 监听版本变化
watch(() => props.version, async (newVersion) => {
  if (props.showHistory && props.queryId && newVersion?.id) {
    await loadStatusHistory();
  }
}, { deep: true });
</script>

<style scoped>
.status-manager-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.status-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background-color: var(--background-secondary);
  border-radius: 0.5rem;
}

.status-label {
  font-weight: 500;
}

.status-value {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  background-color: var(--background-primary);
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  margin-right: auto;
}

.help-tips {
  margin-right: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.status-badge {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* Status-specific colors */
.status-draft .status-badge {
  background-color: var(--primary-color);
}

.status-review .status-badge {
  background-color: var(--warning-color);
}

.status-approved .status-badge {
  background-color: var(--success-color);
}

.status-published .status-badge {
  background-color: var(--success-color);
}

.status-deprecated .status-badge {
  background-color: var(--gray-color);
}

.status-archived .status-badge {
  background-color: var(--dark-color);
}

.status-actions {
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.status-action-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: var(--background-secondary);
  font-weight: 500;
  border-bottom: 1px solid var(--border-color);
}

.status-progress-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  position: relative;
}

.progress-line {
  position: absolute;
  top: 50%;
  left: 2rem;
  right: 2rem;
  height: 2px;
  background-color: var(--border-color);
  z-index: 1;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  z-index: 2;
  cursor: default;
}

.step-number {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--background-secondary);
  border: 2px solid var(--border-color);
  border-radius: 50%;
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.step-label {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.progress-step.active .step-number {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: white;
}

.progress-step.active .step-label {
  color: var(--primary-color);
  font-weight: 500;
}

.progress-step.can-activate {
  cursor: pointer;
}

.progress-step.can-activate:hover .step-number {
  border-color: var(--primary-color);
}

.available-actions {
  padding: 1rem;
  background-color: var(--background-secondary);
  border-top: 1px solid var(--border-color);
}

.no-actions {
  text-align: center;
  padding: 1rem;
  color: var(--text-secondary);
  font-style: italic;
}

.action-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: var(--background-primary);
  border-radius: 0.25rem;
}

.action-title {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.action-direction {
  color: var(--text-secondary);
  margin-right: 0.5rem;
}

.action-description {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.transition-comment {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.comment-label {
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.comment-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
}

.status-history {
  margin-top: 1rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.history-header h3 {
  font-size: 1rem;
  font-weight: 500;
}

.history-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: var(--text-secondary);
}

.history-empty {
  text-align: center;
  padding: 2rem;
  color: var(--text-secondary);
  font-style: italic;
}

.history-timeline {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: relative;
  padding-left: 1.5rem;
}

.history-timeline:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0.5rem;
  width: 2px;
  background-color: var(--border-color);
}

.history-item {
  position: relative;
}

.history-point {
  position: absolute;
  width: 12px;
  height: 12px;
  left: -1.5rem;
  top: 0.5rem;
  background-color: var(--primary-color);
  border-radius: 50%;
  z-index: 2;
}

.history-content {
  background-color: var(--background-secondary);
  border-radius: 0.5rem;
  padding: 0.75rem;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.history-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.history-date {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.history-user {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.history-transition {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
}

.from-label, .to-label {
  color: var(--text-secondary);
}

.history-comment {
  background-color: var(--background-primary);
  border-radius: 0.25rem;
  padding: 0.75rem;
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.comment-icon {
  color: var(--text-secondary);
}

.comment-text {
  flex: 1;
  word-break: break-word;
}
</style>