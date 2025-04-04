<script setup lang="ts">
import { ref, watch, computed, reactive } from 'vue';
import type { QueryParam } from '@/types/integration';
import { 
  UpOutlined, 
  DownOutlined, 
  SearchOutlined, 
  ReloadOutlined 
} from '@ant-design/icons-vue';
import { Form } from 'ant-design-vue';

const useForm = Form.useForm;

const props = defineProps<{
  conditions: QueryParam[];
  modelValue: Record<string, any>;
  loading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void;
  (e: 'submit'): void;
  (e: 'reset'): void;
  (e: 'toggle'): void;
}>();

const formState = reactive<Record<string, any>>({});
const isQueryCollapsed = ref(false);

// 初始化本地值
watch(() => props.modelValue, (newVal) => {
  Object.keys(newVal).forEach(key => {
    formState[key] = newVal[key];
  });
}, { immediate: true, deep: true });

// 排序后的条件
const sortedConditions = computed(() => {
  return [...props.conditions].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
});

// 表单实例
const { resetFields, validate, validateInfos } = useForm(
  formState,
  computed(() => {
    const rules: Record<string, any> = {};
    props.conditions.forEach(condition => {
      const fieldRules = [];
      
      if (condition.required) {
        fieldRules.push({
          required: true,
          message: `${condition.description || condition.name}不能为空`,
        });
      }
      
      // 添加数字类型验证
      if (condition.formType === 'number' || condition.type === 'NUMBER') {
        fieldRules.push({
          type: 'number',
          message: `${condition.description || condition.name}必须是数字`,
          transform: (value: string) => (value === '' ? undefined : Number(value)),
        });
        
        // 添加最小值最大值验证
        if (condition.advancedConfig?.minValue !== undefined) {
          fieldRules.push({
            type: 'number',
            min: condition.advancedConfig.minValue,
            message: `${condition.description || condition.name}不能小于${condition.advancedConfig.minValue}`,
          });
        }
        
        if (condition.advancedConfig?.maxValue !== undefined) {
          fieldRules.push({
            type: 'number',
            max: condition.advancedConfig.maxValue,
            message: `${condition.description || condition.name}不能大于${condition.advancedConfig.maxValue}`,
          });
        }
      }
      
      rules[condition.name] = fieldRules;
    });
    
    return rules;
  })
);

// 处理值变更
const handleValuesChange = (changedValues: Record<string, any>) => {
  emit('update:modelValue', { ...formState });
};

// 提交表单
const submitForm = () => {
  validate()
    .then(() => {
      emit('submit');
    })
    .catch(errors => {
      console.log('表单验证失败:', errors);
    });
};

// 重置表单
const resetForm = () => {
  resetFields();
  const defaultValues: Record<string, any> = {};
  
  props.conditions.forEach(condition => {
    formState[condition.name] = condition.defaultValue || '';
    defaultValues[condition.name] = condition.defaultValue || '';
  });
  
  emit('update:modelValue', { ...defaultValues });
  emit('reset');
};

// 切换查询区域展开/收起
const toggleQuerySection = () => {
  isQueryCollapsed.value = !isQueryCollapsed.value;
  emit('toggle');
};

// 获取表单项占的列数
const getColSpan = (condition: QueryParam) => {
  // 文本域占2列
  if (condition.formType === 'textarea') {
    return { span: 8 };
  }
  return { span: 8 };
};
</script>

<template>
  <a-card class="query-section mb-4" :bordered="false">
    <template #title>
      <div class="flex justify-between items-center">
        <div class="flex items-center">
          <span class="text-base font-medium mr-2">查询条件</span>
          <a-tag color="blue">按条件筛选</a-tag>
        </div>
        <a-button type="text" @click="toggleQuerySection">
          {{ isQueryCollapsed ? '展开' : '收起' }}
          <template #icon>
            <component :is="isQueryCollapsed ? DownOutlined : UpOutlined" />
          </template>
        </a-button>
      </div>
    </template>
    
    <a-form
      v-if="!isQueryCollapsed"
      layout="horizontal"
      :model="formState"
      @finish="submitForm"
      :validateInfos="validateInfos"
      class="search-form"
    >
      <a-row :gutter="16">
        <a-col v-for="condition in sortedConditions" :key="condition.name" v-bind="getColSpan(condition)">
          <a-form-item
            :name="condition.name"
            :label="condition.description || condition.name"
            class="form-item"
          >
            <!-- 文本输入 -->
            <a-input 
              v-if="condition.formType === 'input' || condition.type === 'STRING'"
              v-model:value="formState[condition.name]" 
              :placeholder="`请输入${condition.description || condition.name}`"
              @change="handleValuesChange"
              class="w-full"
            />
            
            <!-- 数字输入 -->
            <a-input-number 
              v-else-if="condition.formType === 'number' || condition.type === 'NUMBER'"
              v-model:value="formState[condition.name]" 
              style="width: 100%"
              :min="condition.advancedConfig?.minValue"
              :max="condition.advancedConfig?.maxValue"
              :step="condition.advancedConfig?.step || 1"
              :placeholder="`请输入${condition.description || condition.name}`"
              @change="handleValuesChange"
              class="w-full"
            />
            
            <!-- 日期选择 -->
            <a-date-picker 
              v-else-if="condition.formType === 'date' || condition.type === 'DATE'"
              v-model:value="formState[condition.name]" 
              style="width: 100%"
              :placeholder="`请选择${condition.description || condition.name}`"
              @change="handleValuesChange"
              class="w-full"
            />
            
            <!-- 日期时间选择 -->
            <a-date-picker 
              v-else-if="condition.formType === 'datetime' || condition.type === 'DATETIME'"
              v-model:value="formState[condition.name]" 
              show-time
              style="width: 100%"
              :placeholder="`请选择${condition.description || condition.name}`"
              @change="handleValuesChange"
              class="w-full"
            />
            
            <!-- 下拉选择 -->
            <a-select 
              v-else-if="condition.formType === 'select' || condition.format === 'enum'"
              v-model:value="formState[condition.name]" 
              style="width: 100%"
              :placeholder="`请选择${condition.description || condition.name}`"
              @change="handleValuesChange"
              class="w-full"
            >
              <a-select-option v-for="option in condition.options" :key="option.value" :value="option.value">
                {{ option.label }}
              </a-select-option>
            </a-select>
            
            <!-- 文本域 -->
            <a-textarea 
              v-else-if="condition.formType === 'textarea'"
              v-model:value="formState[condition.name]" 
              :rows="3"
              :placeholder="`请输入${condition.description || condition.name}`"
              @change="handleValuesChange"
              class="w-full"
            />
            
            <!-- 复选框 -->
            <a-checkbox 
              v-else-if="condition.formType === 'checkbox' || condition.type === 'BOOLEAN'"
              v-model:checked="formState[condition.name]" 
              @change="handleValuesChange"
            >
              {{ condition.description || condition.name }}
            </a-checkbox>
            
            <!-- 密码输入 -->
            <a-input-password 
              v-else-if="condition.formType === 'password'"
              v-model:value="formState[condition.name]" 
              :placeholder="`请输入${condition.description || condition.name}`"
              @change="handleValuesChange"
              class="w-full"
            />
            
            <!-- 默认文本输入 -->
            <a-input 
              v-else
              v-model:value="formState[condition.name]" 
              :placeholder="`请输入${condition.description || condition.name}`"
              @change="handleValuesChange"
              class="w-full"
            />
          </a-form-item>
        </a-col>
      </a-row>
      
      <!-- 操作按钮 -->
      <div class="flex justify-end space-x-2 mt-4">
        <a-button @click="resetForm" :disabled="loading" class="reset-btn">
          <template #icon><ReloadOutlined /></template>
          重置
        </a-button>
        <a-button type="primary" html-type="submit" :loading="loading" class="submit-btn">
          <template #icon><SearchOutlined /></template>
          查询
        </a-button>
      </div>
    </a-form>
  </a-card>
</template>

<style scoped>
.query-section {
  background-color: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
}

.search-form {
  padding: 8px 0;
}

.form-item {
  margin-bottom: 16px;
}

.submit-btn {
  min-width: 80px;
  font-weight: 500;
}

.reset-btn {
  min-width: 80px;
}

:deep(.ant-form-item-label) {
  font-weight: 500;
}
</style>