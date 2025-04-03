<template>
  <vs-dialog
    v-model="show"
    :title="baseVersion ? `基于版本 ${baseVersion.versionNumber} 创建新版本` : '创建新版本'"
    width="600px"
    @close="onClose"
  >
    <div class="create-version-container">
      <div v-if="loading" class="loading-state">
        <vs-spinner />
        <p>{{ loadingMessage }}</p>
      </div>
      
      <form v-else @submit.prevent="createVersion" class="version-form">
        <div class="version-info-section">
          <h3>版本基本信息</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="version-name">版本名称 <span class="optional">(可选)</span></label>
              <vs-input
                id="version-name"
                v-model="formData.name"
                placeholder="输入版本名称"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="version-comment">版本说明</label>
              <vs-textarea
                id="version-comment"
                v-model="formData.comment"
                placeholder="描述此版本的主要变更"
                rows="3"
                :error="validationErrors.comment"
                @focus="validationErrors.comment = ''"
              />
              <p v-if="validationErrors.comment" class="error-message">
                {{ validationErrors.comment }}
              </p>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>版本变更内容</label>
              <div class="version-changes">
                <div v-for="(change, index) in formData.changes" :key="index" class="change-item">
                  <vs-input
                    v-model="formData.changes[index]"
                    placeholder="变更描述"
                    class="change-input"
                  />
                  <vs-button
                    icon="remove"
                    flat
                    size="small"
                    color="danger"
                    @click="removeChange(index)"
                    class="remove-change"
                  />
                </div>
                <vs-button
                  size="small"
                  icon="add"
                  @click="addChange"
                  :disabled="formData.changes.length >= 5"
                >
                  添加变更项
                </vs-button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="version-content-section">
          <h3>查询内容</h3>
          
          <div class="form-row">
            <div class="form-group">
              <label for="version-sql">SQL 查询</label>
              <div class="sql-editor-container" ref="editorContainer"></div>
              <p v-if="validationErrors.sql" class="error-message">
                {{ validationErrors.sql }}
              </p>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>参数配置</label>
              <div v-if="formData.parameters.length === 0" class="no-parameters">
                <p>当前查询没有定义参数</p>
                <vs-button size="small" @click="addParameter">
                  添加参数
                </vs-button>
              </div>
              <div v-else class="parameters-list">
                <div v-for="(param, index) in formData.parameters" :key="index" class="parameter-item">
                  <div class="parameter-header">
                    <h4>参数 #{{ index + 1 }}</h4>
                    <vs-button
                      icon="delete"
                      flat
                      size="small"
                      color="danger"
                      @click="removeParameter(index)"
                    />
                  </div>
                  
                  <div class="parameter-form">
                    <div class="form-row">
                      <div class="form-group half">
                        <label :for="`param-name-${index}`">参数名</label>
                        <vs-input
                          :id="`param-name-${index}`"
                          v-model="param.name"
                          placeholder="参数名"
                          :error="getParameterError(index, 'name')"
                          @focus="clearParameterError(index, 'name')"
                        />
                      </div>
                      <div class="form-group half">
                        <label :for="`param-type-${index}`">类型</label>
                        <vs-select
                          :id="`param-type-${index}`"
                          v-model="param.type"
                          :options="parameterTypes"
                        />
                      </div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group half">
                        <label :for="`param-label-${index}`">显示名称 <span class="optional">(可选)</span></label>
                        <vs-input
                          :id="`param-label-${index}`"
                          v-model="param.label"
                          placeholder="显示名称"
                        />
                      </div>
                      <div class="form-group half">
                        <label :for="`param-default-${index}`">默认值 <span class="optional">(可选)</span></label>
                        <vs-input
                          :id="`param-default-${index}`"
                          v-model="param.defaultValue"
                          placeholder="默认值"
                        />
                      </div>
                    </div>
                    
                    <div class="form-row">
                      <div class="form-group checkbox">
                        <vs-checkbox v-model="param.required">
                          必填参数
                        </vs-checkbox>
                      </div>
                    </div>
                  </div>
                </div>
                
                <vs-button size="small" @click="addParameter" class="add-parameter">
                  添加另一个参数
                </vs-button>
              </div>
            </div>
          </div>
        </div>
        
        <div class="form-actions">
          <vs-button @click="onClose">取消</vs-button>
          <vs-button
            type="submit"
            color="primary"
            :loading="creating"
            :disabled="creating"
          >
            创建版本
          </vs-button>
        </div>
      </form>
    </div>
  </vs-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import * as monaco from 'monaco-editor';
import { queryVersionService } from '@/services/queryVersionService';
import type { QueryVersion, QueryParameter } from '@/types/query';

// 组件属性
interface Props {
  modelValue: boolean;
  queryId: string;
  baseVersion?: QueryVersion;
}

const props = withDefaults(defineProps<Props>(), {
  baseVersion: undefined
});

// 事件定义
const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'created', version: QueryVersion): void;
}>();

// 计算属性
const show = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// 参数类型选项
const parameterTypes = [
  { label: '文本', value: 'string' },
  { label: '数字', value: 'number' },
  { label: '日期', value: 'date' },
  { label: '布尔值', value: 'boolean' },
  { label: '数组', value: 'array' },
  { label: '对象', value: 'object' }
];

// 状态
const loading = ref(false);
const loadingMessage = ref('正在加载版本数据...');
const creating = ref(false);
const editor = ref<monaco.editor.IStandaloneCodeEditor | null>(null);
const editorContainer = ref<HTMLElement | null>(null);
const formData = ref({
  name: '',
  comment: '',
  sql: '',
  changes: [''],
  parameters: [] as Partial<QueryParameter>[]
});
const validationErrors = ref({
  comment: '',
  sql: '',
  parameters: {} as Record<number, Record<string, string>>
});

// 方法
function onClose() {
  show.value = false;
}

function addChange() {
  if (formData.value.changes.length < 5) {
    formData.value.changes.push('');
  }
}

function removeChange(index: number) {
  formData.value.changes.splice(index, 1);
  if (formData.value.changes.length === 0) {
    formData.value.changes.push('');
  }
}

function addParameter() {
  formData.value.parameters.push({
    name: '',
    type: 'string',
    label: '',
    defaultValue: '',
    required: false
  });
}

function removeParameter(index: number) {
  formData.value.parameters.splice(index, 1);
  
  // 清除对应的验证错误
  if (validationErrors.value.parameters[index]) {
    delete validationErrors.value.parameters[index];
  }
}

function getParameterError(index: number, field: string): string {
  return validationErrors.value.parameters[index]?.[field] || '';
}

function clearParameterError(index: number, field: string) {
  if (validationErrors.value.parameters[index]) {
    validationErrors.value.parameters[index][field] = '';
  }
}

function validateForm(): boolean {
  let isValid = true;
  validationErrors.value = {
    comment: '',
    sql: '',
    parameters: {}
  };
  
  // 验证版本说明
  if (!formData.value.comment.trim()) {
    validationErrors.value.comment = '请输入版本说明';
    isValid = false;
  }
  
  // 验证SQL
  if (!formData.value.sql.trim()) {
    validationErrors.value.sql = 'SQL查询不能为空';
    isValid = false;
  }
  
  // 验证参数
  formData.value.parameters.forEach((param, index) => {
    if (!validationErrors.value.parameters[index]) {
      validationErrors.value.parameters[index] = {};
    }
    
    if (!param.name?.trim()) {
      validationErrors.value.parameters[index].name = '参数名不能为空';
      isValid = false;
    }
  });
  
  return isValid;
}

async function loadBaseVersionData() {
  if (!props.baseVersion && !props.queryId) return;
  
  loading.value = true;
  loadingMessage.value = '正在加载版本数据...';
  
  try {
    if (props.baseVersion) {
      // 使用提供的基础版本数据
      initFormWithVersion(props.baseVersion);
    } else {
      // 获取查询的最新版本
      const response = await queryVersionService.getQueryVersions(props.queryId);
      if (response.data.length > 0) {
        const latestVersion = response.data.find(v => v.isLatest) || response.data[0];
        initFormWithVersion(latestVersion);
      }
    }
  } catch (err) {
    console.error('Failed to load base version data:', err);
  } finally {
    loading.value = false;
  }
}

function initFormWithVersion(version: QueryVersion) {
  formData.value = {
    name: '',
    comment: '',
    sql: version.sql || '',
    changes: [''],
    parameters: version.parameters?.map(p => ({
      name: p.name,
      type: p.type,
      label: p.label,
      defaultValue: p.defaultValue,
      required: p.required
    })) || []
  };
  
  nextTick(() => {
    if (editor.value) {
      editor.value.setValue(formData.value.sql);
    }
  });
}

async function createVersion() {
  if (!validateForm()) return;
  
  creating.value = true;
  
  try {
    const versionData = {
      name: formData.value.name.trim() || undefined,
      comment: formData.value.comment.trim(),
      sql: formData.value.sql.trim(),
      changes: formData.value.changes.filter(c => c.trim()),
      parameters: formData.value.parameters.map(p => ({
        name: p.name?.trim() || '',
        type: p.type || 'string',
        label: p.label?.trim() || undefined,
        defaultValue: p.defaultValue !== undefined ? p.defaultValue : undefined,
        required: p.required || false
      }))
    };
    
    let response;
    
    if (props.baseVersion) {
      // 基于特定版本创建新版本
      response = await queryVersionService.createVersionFromExisting(
        props.queryId,
        props.baseVersion.id,
        versionData
      );
    } else {
      // 创建新版本
      response = await queryVersionService.createQueryVersion(
        props.queryId,
        versionData
      );
    }
    
    // 通知父组件版本创建成功
    emit('created', response.data);
    
    // 关闭对话框
    show.value = false;
  } catch (err) {
    console.error('Failed to create version:', err);
  } finally {
    creating.value = false;
  }
}

// 初始化Monaco编辑器
function initEditor() {
  if (!editorContainer.value) return;
  
  editor.value = monaco.editor.create(editorContainer.value, {
    value: formData.value.sql,
    language: 'sql',
    minimap: { enabled: false },
    automaticLayout: true,
    theme: 'vs',
    scrollBeyondLastLine: false,
    lineNumbers: 'on',
    roundedSelection: true,
    scrollbar: {
      useShadows: false,
      verticalHasArrows: false,
      horizontalHasArrows: false,
      verticalScrollbarSize: 10,
      horizontalScrollbarSize: 10
    }
  });
  
  editor.value.onDidChangeModelContent(() => {
    if (editor.value) {
      formData.value.sql = editor.value.getValue();
    }
  });
}

// 生命周期钩子
onMounted(async () => {
  await loadBaseVersionData();
  nextTick(() => {
    initEditor();
  });
});

// 监听对话框可见性变化
watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    loadBaseVersionData();
    nextTick(() => {
      if (!editor.value && editorContainer.value) {
        initEditor();
      }
    });
  }
});

// 监听基础版本变化
watch(() => props.baseVersion, (newVal) => {
  if (newVal && show.value) {
    initFormWithVersion(newVal);
  }
});
</script>

<style scoped>
.create-version-container {
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  overflow-y: auto;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
}

.version-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.version-info-section,
.version-content-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.version-info-section h3,
.version-content-section h3 {
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
  font-weight: 500;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color);
}

.form-row {
  display: flex;
  gap: 1rem;
  width: 100%;
}

.form-group {
  flex: 1;
  margin-bottom: 1rem;
}

.form-group.half {
  flex: 0.5;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.optional {
  font-weight: normal;
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.error-message {
  color: var(--error-color);
  font-size: 0.85rem;
  margin-top: 0.25rem;
}

.version-changes {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.change-item {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.change-input {
  flex: 1;
}

.sql-editor-container {
  height: 300px;
  border: 1px solid var(--border-color);
  border-radius: 0.25rem;
  overflow: hidden;
}

.no-parameters {
  text-align: center;
  padding: 1.5rem;
  background-color: var(--background-secondary);
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.parameters-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.parameter-item {
  background-color: var(--background-secondary);
  border-radius: 0.25rem;
  padding: 1rem;
}

.parameter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.parameter-header h4 {
  font-size: 0.9rem;
  font-weight: 500;
}

.parameter-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.add-parameter {
  align-self: center;
  margin-top: 0.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}
</style>