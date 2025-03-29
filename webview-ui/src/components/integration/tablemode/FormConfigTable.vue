<template>
  <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg">
    <!-- 标签页切换 -->
    <div class="border-b border-gray-200">
      <nav class="flex" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          @click="activeTab = tab.key"
          class="px-3 py-2 font-medium text-sm border-b-2 focus:outline-none"
          :class="[
            activeTab === tab.key
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- 查询条件配置 -->
    <div v-if="activeTab === 'conditions'" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">字段</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">字段类型</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">数据格式</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">中文名称</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">必填</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">表单类型</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">默认值</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(condition, index) in formConfig.conditions" :key="index" class="hover:bg-gray-50">
            <!-- 字段 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <input 
                v-model="condition.field" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="字段名"
              />
            </td>
            
            <!-- 字段类型 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <select 
                v-model="condition.type" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option v-for="type in componentTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </td>
            
            <!-- 数据格式 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <select 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="string">文本</option>
                <option value="number">数字</option>
                <option value="date">日期</option>
                <option value="datetime">日期时间</option>
                <option value="enum">枚举</option>
              </select>
            </td>
            
            <!-- 中文名称 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <input 
                v-model="condition.label" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="显示名称"
              />
            </td>
            
            <!-- 必填 -->
            <td class="px-4 py-2 whitespace-nowrap text-center">
              <input 
                type="checkbox" 
                v-model="condition.required" 
                class="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </td>
            
            <!-- 表单类型 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <select 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="input">输入框</option>
                <option value="select">下拉选择</option>
                <option value="datepicker">日期选择</option>
                <option value="rangepicker">日期范围</option>
              </select>
            </td>
            
            <!-- 默认值 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <input 
                v-model="condition.defaultValue" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="默认值"
              />
            </td>
            
            <!-- 操作 -->
            <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="removeCondition(index)" 
                class="text-red-600 hover:text-red-900 mr-2"
              >
                删除
              </button>
              <button class="text-indigo-600 hover:text-indigo-900">更多</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="8" class="px-4 py-2">
              <button 
                @click="addCondition" 
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
              >
                新增
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>

    <!-- 按钮配置 -->
    <div v-if="activeTab === 'buttons'" class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">按钮类型</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">按钮文本</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">样式</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">图标</th>
            <th scope="col" class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(button, index) in formConfig.buttons" :key="index" class="hover:bg-gray-50">
            <!-- 按钮类型 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <select 
                v-model="button.type" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="submit">提交</option>
                <option value="reset">重置</option>
                <option value="button">普通按钮</option>
              </select>
            </td>
            
            <!-- 按钮文本 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <input 
                v-model="button.label" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="按钮文本"
              />
            </td>
            
            <!-- 样式 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <select 
                v-model="button.style" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="primary">主要</option>
                <option value="secondary">次要</option>
                <option value="danger">危险</option>
                <option value="warning">警告</option>
                <option value="info">信息</option>
              </select>
            </td>
            
            <!-- 图标 -->
            <td class="px-4 py-2 whitespace-nowrap">
              <input 
                v-model="button.icon" 
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="图标类名"
              />
            </td>
            
            <!-- 操作 -->
            <td class="px-4 py-2 whitespace-nowrap text-right text-sm font-medium">
              <button 
                @click="removeButton(index)" 
                class="text-red-600 hover:text-red-900 mr-2"
              >
                删除
              </button>
              <button class="text-indigo-600 hover:text-indigo-900">更多</button>
            </td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="5" class="px-4 py-2">
              <button 
                @click="addButton" 
                class="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none"
              >
                新增
              </button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { FormConfig, FormCondition, FormButton } from '@/types/integration';
import { FormComponentType } from '@/types/integration';

const props = defineProps<{
  modelValue: FormConfig;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: FormConfig): void;
}>();

const formConfig = ref<FormConfig>({
  layout: props.modelValue.layout || 'vertical',
  conditions: [...(props.modelValue.conditions || [])],
  buttons: [...(props.modelValue.buttons || [])]
});

// 监听外部数据变化
watch(() => props.modelValue, (newValue) => {
  formConfig.value = {
    layout: newValue.layout,
    conditions: [...newValue.conditions],
    buttons: [...newValue.buttons]
  };
}, { deep: true });

// 监听内部数据变化，向父组件发送更新
watch(formConfig, (newValue) => {
  emit('update:modelValue', {
    layout: newValue.layout,
    conditions: [...newValue.conditions],
    buttons: [...newValue.buttons]
  });
}, { deep: true });

const activeTab = ref('conditions');

const tabs = [
  { key: 'conditions', label: '查询条件' },
  { key: 'buttons', label: '按钮' }
];

// 组件类型选项
const componentTypes = [
  { value: FormComponentType.INPUT, label: '输入框' },
  { value: FormComponentType.NUMBER, label: '数字输入' },
  { value: FormComponentType.DATE, label: '日期选择' },
  { value: FormComponentType.DATETIME, label: '日期时间选择' },
  { value: FormComponentType.SELECT, label: '下拉选择' },
  { value: FormComponentType.MULTISELECT, label: '多选下拉' },
  { value: FormComponentType.CHECKBOX, label: '复选框' },
  { value: FormComponentType.RADIO, label: '单选框' },
  { value: FormComponentType.TEXTAREA, label: '文本域' }
];

// 添加查询条件
const addCondition = () => {
  formConfig.value.conditions.push({
    field: '',
    label: '',
    type: FormComponentType.INPUT,
    required: false,
    displayOrder: formConfig.value.conditions.length
  });
};

// 删除查询条件
const removeCondition = (index: number) => {
  formConfig.value.conditions.splice(index, 1);
  // 重新设置displayOrder
  formConfig.value.conditions.forEach((condition, idx) => {
    condition.displayOrder = idx;
  });
};

// 添加按钮
const addButton = () => {
  formConfig.value.buttons.push({
    type: 'button',
    label: '新按钮',
    style: 'primary'
  });
};

// 删除按钮
const removeButton = (index: number) => {
  formConfig.value.buttons.splice(index, 1);
};
</script>