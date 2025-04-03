<template>
  <div class="status-help-tips">
    <div class="help-trigger" @click="toggleHelp">
      <vs-icon name="help_outline" />
      <span class="trigger-text">状态管理帮助</span>
    </div>
    
    <vs-dialog v-model="showHelp" width="700px" title="查询状态管理工作流帮助">
      <div class="help-content">
        <div class="workflow-overview">
          <h3>状态工作流概览</h3>
          <p>查询在其生命周期中会经历不同的状态。了解这些状态和状态转换将帮助您更好地管理查询。</p>
          
          <div class="workflow-diagram">
            <div class="workflow-steps">
              <div class="workflow-step">
                <div class="step-icon draft">
                  <vs-icon name="edit" />
                </div>
                <div class="step-name">草稿</div>
                <div class="step-desc">初始创建或修改的版本</div>
              </div>
              <div class="step-arrow">
                <vs-icon name="arrow_forward" />
              </div>
              <div class="workflow-step">
                <div class="step-icon review">
                  <vs-icon name="rate_review" />
                </div>
                <div class="step-name">审核中</div>
                <div class="step-desc">已提交等待审核的版本</div>
              </div>
              <div class="step-arrow">
                <vs-icon name="arrow_forward" />
              </div>
              <div class="workflow-step">
                <div class="step-icon approved">
                  <vs-icon name="check_circle" />
                </div>
                <div class="step-name">已批准</div>
                <div class="step-desc">通过审核的版本</div>
              </div>
              <div class="step-arrow">
                <vs-icon name="arrow_forward" />
              </div>
              <div class="workflow-step">
                <div class="step-icon published">
                  <vs-icon name="publish" />
                </div>
                <div class="step-name">已发布</div>
                <div class="step-desc">正式发布到生产环境的版本</div>
              </div>
            </div>
            <div class="workflow-additional">
              <div class="workflow-step">
                <div class="step-icon deprecated">
                  <vs-icon name="warning" />
                </div>
                <div class="step-name">已弃用</div>
                <div class="step-desc">不再推荐使用的版本</div>
              </div>
              <div class="workflow-step">
                <div class="step-icon archived">
                  <vs-icon name="archive" />
                </div>
                <div class="step-name">已归档</div>
                <div class="step-desc">已归档不可修改的版本</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="status-details">
          <h3>状态详细说明</h3>
          
          <div class="status-item">
            <div class="status-header">
              <div class="status-badge draft"></div>
              <div class="status-title">草稿 (Draft)</div>
            </div>
            <div class="status-content">
              <p>这是查询的初始状态。在此状态下，您可以自由编辑查询的SQL和参数。</p>
              <div class="status-actions">
                <strong>可执行操作:</strong>
                <ul>
                  <li>编辑查询内容</li>
                  <li>测试执行查询</li>
                  <li>提交审核</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="status-item">
            <div class="status-header">
              <div class="status-badge review"></div>
              <div class="status-title">审核中 (Review)</div>
            </div>
            <div class="status-content">
              <p>查询已提交审核，等待审核人员审查。在此状态下，创建者不能再编辑查询。</p>
              <div class="status-actions">
                <strong>可执行操作:</strong>
                <ul>
                  <li>查看查询内容</li>
                  <li>测试执行查询</li>
                  <li>审核人员：批准或退回查询</li>
                  <li>创建者：取消审核申请，退回到草稿状态</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="status-item">
            <div class="status-header">
              <div class="status-badge approved"></div>
              <div class="status-title">已批准 (Approved)</div>
            </div>
            <div class="status-content">
              <p>查询已通过审核，但尚未正式发布。这是一个临时状态，通常在发布前进行最终确认。</p>
              <div class="status-actions">
                <strong>可执行操作:</strong>
                <ul>
                  <li>查看查询内容</li>
                  <li>测试执行查询</li>
                  <li>发布查询</li>
                  <li>退回到草稿状态进行修改</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="status-item">
            <div class="status-header">
              <div class="status-badge published"></div>
              <div class="status-title">已发布 (Published)</div>
            </div>
            <div class="status-content">
              <p>查询已正式发布，可供所有授权用户使用。这是生产环境中的活跃查询。</p>
              <div class="status-actions">
                <strong>可执行操作:</strong>
                <ul>
                  <li>查看查询内容</li>
                  <li>执行查询</li>
                  <li>标记为已弃用</li>
                  <li>创建新版本（基于此版本）</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="status-item">
            <div class="status-header">
              <div class="status-badge deprecated"></div>
              <div class="status-title">已弃用 (Deprecated)</div>
            </div>
            <div class="status-content">
              <p>查询仍然可用，但不再推荐使用。通常表示此查询即将被新版本替代。</p>
              <div class="status-actions">
                <strong>可执行操作:</strong>
                <ul>
                  <li>查看查询内容</li>
                  <li>执行查询</li>
                  <li>重新激活（恢复到已发布状态）</li>
                  <li>归档</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div class="status-item">
            <div class="status-header">
              <div class="status-badge archived"></div>
              <div class="status-title">已归档 (Archived)</div>
            </div>
            <div class="status-content">
              <p>查询已被归档，不再活跃使用。归档的查询仅供查看，不能执行或修改。</p>
              <div class="status-actions">
                <strong>可执行操作:</strong>
                <ul>
                  <li>查看查询内容</li>
                  <li>创建新版本（基于此版本）</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div class="workflow-tips">
          <h3>工作流使用技巧</h3>
          <ul>
            <li><strong>版本管理</strong>：每次状态变更都会记录在版本历史中，便于追踪查询的演变。</li>
            <li><strong>添加注释</strong>：在提交审核或更改状态时，添加详细说明有助于其他人理解变更的目的。</li>
            <li><strong>使用标签</strong>：为重要版本添加标签，如"生产版本"或"季度报表"，便于后续查找。</li>
            <li><strong>状态回退</strong>：如需修改，可将已审核或已发布的查询退回到草稿状态。</li>
            <li><strong>权限控制</strong>：不同状态的操作可能需要不同级别的权限，请确保您有对应的权限。</li>
          </ul>
        </div>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <vs-checkbox v-model="dontShowAgain">不再显示此帮助</vs-checkbox>
          <vs-button @click="closeHelp">关闭</vs-button>
        </div>
      </template>
    </vs-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 组件属性
interface Props {
  initialShow?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  initialShow: false
});

// 状态
const showHelp = ref(props.initialShow);
const dontShowAgain = ref(false);

// 方法
function toggleHelp() {
  showHelp.value = !showHelp.value;
}

function closeHelp() {
  showHelp.value = false;
  if (dontShowAgain.value) {
    localStorage.setItem('status-help-tips-hide', 'true');
  }
}

// 生命周期
// 检查用户是否选择了不再显示帮助
if (localStorage.getItem('status-help-tips-hide') === 'true') {
  showHelp.value = false;
}
</script>

<style scoped>
.status-help-tips {
  display: inline-block;
}

.help-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border-radius: 0.25rem;
  background-color: var(--background-secondary);
  transition: background-color 0.2s ease;
}

.help-trigger:hover {
  background-color: var(--background-hover);
}

.trigger-text {
  font-size: 0.9rem;
}

.help-content {
  overflow-y: auto;
  max-height: 70vh;
  padding: 0 1rem;
}

.workflow-overview {
  margin-bottom: 2rem;
}

.workflow-diagram {
  margin-top: 1.5rem;
}

.workflow-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.workflow-additional {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 4rem;
  margin-left: 2rem;
}

.workflow-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  width: 120px;
}

.step-arrow {
  color: var(--text-secondary);
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.step-icon.draft {
  background-color: var(--primary-color);
}

.step-icon.review {
  background-color: var(--warning-color);
}

.step-icon.approved {
  background-color: var(--success-color);
}

.step-icon.published {
  background-color: var(--info-color);
}

.step-icon.deprecated {
  background-color: var(--gray-color);
}

.step-icon.archived {
  background-color: var(--dark-color);
}

.step-name {
  font-weight: 500;
}

.step-desc {
  font-size: 0.8rem;
  text-align: center;
  color: var(--text-secondary);
}

.status-details {
  margin-bottom: 2rem;
}

.status-item {
  margin-bottom: 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  overflow: hidden;
}

.status-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background-color: var(--background-secondary);
  border-bottom: 1px solid var(--border-color);
}

.status-badge {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-badge.draft {
  background-color: var(--primary-color);
}

.status-badge.review {
  background-color: var(--warning-color);
}

.status-badge.approved {
  background-color: var(--success-color);
}

.status-badge.published {
  background-color: var(--info-color);
}

.status-badge.deprecated {
  background-color: var(--gray-color);
}

.status-badge.archived {
  background-color: var(--dark-color);
}

.status-title {
  font-weight: 500;
}

.status-content {
  padding: 1rem;
}

.status-actions {
  margin-top: 0.75rem;
}

.status-actions ul {
  margin-top: 0.5rem;
  padding-left: 1.5rem;
}

.status-actions li {
  margin-bottom: 0.25rem;
}

.workflow-tips {
  background-color: var(--background-secondary);
  padding: 1rem;
  border-radius: 0.5rem;
}

.workflow-tips ul {
  padding-left: 1.5rem;
  margin-top: 0.75rem;
}

.workflow-tips li {
  margin-bottom: 0.5rem;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>