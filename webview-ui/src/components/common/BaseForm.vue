<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type {
  FormItem,
  FormConfig,
  FormEvents,
  FormValidateError,
  FormLayout
} from '@/types/form'

// 定义组件属性
interface Props {
  items: FormItem[]
  config?: FormConfig
  modelValue?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({
    layout: 'horizontal',
    labelWidth: '120px',
    labelAlign: 'right',
    gutter: 16,
    disabled: false,
    showMessage: true,
    validateOnRuleChange: true
  })
})

// 定义组件事件
const emit = defineEmits<{
  (e: 'update:modelValue', value: Record<string, any>): void
  (e: 'submit', values: Record<string, any>): void
  (e: 'change', key: string, value: any): void
  (e: 'validate', errors: FormValidateError[]): void
  (e: 'reset'): void
}>()

// 表单数据
const formData = ref<Record<string, any>>(props.modelValue || {})

// 表单错误信息
const formErrors = ref<Record<string, string>>({})

// 监听表单数据变化
watch(formData, (newValue) => {
  emit('update:modelValue', newValue)
}, { deep: true })

// 计算表单布局类名
const formClasses = computed(() => {
  const layout = props.config?.layout as FormLayout
  return {
    'flex flex-col space-y-4': layout === 'vertical',
    'flex flex-wrap': layout === 'horizontal',
    'flex items-center space-x-4': layout === 'inline'
  }
})

// 计算表单项布局类名
const formItemClasses = computed(() => {
  const layout = props.config?.layout as FormLayout
  return {
    'flex flex-col': layout === 'vertical',
    'flex items-start': layout === 'horizontal',
    'flex items-center': layout === 'inline'
  }
})

// 计算标签布局类名
const labelClasses = computed(() => {
  const { labelAlign, labelWidth, layout } = props.config as FormConfig
  return {
    'text-right': labelAlign === 'right',
    'text-left': labelAlign === 'left',
    'mb-1': layout === 'vertical',
    'w-[120px]': layout !== 'vertical' && labelWidth === '120px'
  }
})

// 处理输入变化
const handleInputChange = (item: FormItem, value: any) => {
  formData.value[item.key] = value
  emit('change', item.key, value)
  validateField(item)
}

// 验证单个字段
const validateField = async (item: FormItem): Promise<boolean> => {
  if (!item.rules || !item.rules.length) return true

  try {
    for (const rule of item.rules) {
      const value = formData.value[item.key]

      // 必填验证
      if (rule.required && !value) {
        throw new Error(rule.message || `${item.label}不能为空`)
      }

      // 最小长度/值验证
      if (rule.min !== undefined) {
        if (typeof value === 'string' && value.length < rule.min) {
          throw new Error(rule.message || `${item.label}长度不能小于${rule.min}`)
        }
        if (typeof value === 'number' && value < rule.min) {
          throw new Error(rule.message || `${item.label}不能小于${rule.min}`)
        }
      }

      // 最大长度/值验证
      if (rule.max !== undefined) {
        if (typeof value === 'string' && value.length > rule.max) {
          throw new Error(rule.message || `${item.label}长度不能大于${rule.max}`)
        }
        if (typeof value === 'number' && value > rule.max) {
          throw new Error(rule.message || `${item.label}不能大于${rule.max}`)
        }
      }

      // 正则验证
      if (rule.pattern && !rule.pattern.test(String(value))) {
        throw new Error(rule.message || `${item.label}格式不正确`)
      }

      // 自定义验证
      if (rule.validator) {
        await rule.validator(value)
      }
    }

    // 验证通过，清除错误信息
    formErrors.value[item.key] = ''
    return true
  } catch (error) {
    // 验证失败，设置错误信息
    formErrors.value[item.key] = error.message
    return false
  }
}

// 验证整个表单
const validate = async (): Promise<boolean> => {
  const errors: FormValidateError[] = []
  const validations = props.items.map(async (item) => {
    const valid = await validateField(item)
    if (!valid) {
      errors.push({
        key: item.key,
        message: formErrors.value[item.key]
      })
    }
  })

  await Promise.all(validations)
  emit('validate', errors)
  return errors.length === 0
}

// 提交表单
const handleSubmit = async (e: Event) => {
  e.preventDefault()
  const valid = await validate()
  if (valid) {
    emit('submit', formData.value)
  }
}

// 重置表单
const reset = () => {
  formData.value = {}
  formErrors.value = {}
  emit('reset')
}

// 暴露方法给父组件
defineExpose({
  validate,
  reset
})
</script>

<template>
  <form @submit="handleSubmit" :class="formClasses">
    <!-- 遍历表单项 -->
    <div
      v-for="item in items"
      :key="item.key"
      :class="[
        formItemClasses,
        item.col ? `col-span-${item.col}` : '',
        'mb-4'
      ]"
    >
      <!-- 标签 -->
      <label
        :for="item.key"
        :class="[
          labelClasses,
          'block text-sm font-medium text-gray-700',
          item.required ? 'required' : ''
        ]"
      >
        {{ item.label }}
      </label>

      <!-- 表单控件 -->
      <div class="flex-1">
        <!-- 文本输入 -->
        <template v-if="item.type === 'text'">
          <input
            :id="item.key"
            type="text"
            v-model="formData[item.key]"
            :placeholder="item.placeholder"
            :disabled="item.disabled || config?.disabled"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            @input="handleInputChange(item, $event.target.value)"
          />
        </template>

        <!-- 密码输入 -->
        <template v-else-if="item.type === 'password'">
          <input
            :id="item.key"
            type="password"
            v-model="formData[item.key]"
            :placeholder="item.placeholder"
            :disabled="item.disabled || config?.disabled"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            @input="handleInputChange(item, $event.target.value)"
          />
        </template>

        <!-- 数字输入 -->
        <template v-else-if="item.type === 'number'">
          <input
            :id="item.key"
            type="number"
            v-model.number="formData[item.key]"
            :placeholder="item.placeholder"
            :disabled="item.disabled || config?.disabled"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            @input="handleInputChange(item, $event.target.value)"
          />
        </template>

        <!-- 多行文本 -->
        <template v-else-if="item.type === 'textarea'">
          <textarea
            :id="item.key"
            v-model="formData[item.key]"
            :placeholder="item.placeholder"
            :disabled="item.disabled || config?.disabled"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            @input="handleInputChange(item, $event.target.value)"
          />
        </template>

        <!-- 选择框 -->
        <template v-else-if="item.type === 'select'">
          <select
            :id="item.key"
            v-model="formData[item.key]"
            :disabled="item.disabled || config?.disabled"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            @change="handleInputChange(item, $event.target.value)"
          >
            <option
              v-for="option in item.options"
              :key="option.value"
              :value="option.value"
              :disabled="option.disabled"
            >
              {{ option.label }}
            </option>
          </select>
        </template>

        <!-- 单选框组 -->
        <template v-else-if="item.type === 'radio'">
          <div class="mt-1 space-x-4">
            <label
              v-for="option in item.options"
              :key="option.value"
              class="inline-flex items-center"
            >
              <input
                type="radio"
                :name="item.key"
                :value="option.value"
                v-model="formData[item.key]"
                :disabled="option.disabled || item.disabled || config?.disabled"
                class="form-radio h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                @change="handleInputChange(item, option.value)"
              />
              <span class="ml-2">{{ option.label }}</span>
            </label>
          </div>
        </template>

        <!-- 多选框组 -->
        <template v-else-if="item.type === 'checkbox'">
          <div class="mt-1 space-x-4">
            <label
              v-for="option in item.options"
              :key="option.value"
              class="inline-flex items-center"
            >
              <input
                type="checkbox"
                :value="option.value"
                v-model="formData[item.key]"
                :disabled="option.disabled || item.disabled || config?.disabled"
                class="form-checkbox h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                @change="handleInputChange(item, formData[item.key])"
              />
              <span class="ml-2">{{ option.label }}</span>
            </label>
          </div>
        </template>

        <!-- 开关 -->
        <template v-else-if="item.type === 'switch'">
          <button
            type="button"
            :class="[
              formData[item.key] ? 'bg-indigo-600' : 'bg-gray-200',
              'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
            ]"
            :disabled="item.disabled || config?.disabled"
            @click="handleInputChange(item, !formData[item.key])"
          >
            <span
              :class="[
                formData[item.key] ? 'translate-x-5' : 'translate-x-0',
                'pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out'
              ]"
            />
          </button>
        </template>

        <!-- 自定义组件 -->
        <template v-else-if="item.type === 'custom' && item.customRender">
          <component
            :is="item.customRender(item)"
            v-model="formData[item.key]"
            @change="handleInputChange(item, $event)"
          />
        </template>

        <!-- 错误提示 -->
        <div
          v-if="config?.showMessage && formErrors[item.key]"
          class="mt-1 text-sm text-red-600"
        >
          {{ formErrors[item.key] }}
        </div>
      </div>
    </div>

    <!-- 表单按钮 -->
    <div
      :class="[
        config?.layout === 'vertical' ? '' : 'ml-[120px]',
        'mt-4 flex items-center space-x-4'
      ]"
    >
      <slot name="buttons">
        <button
          type="submit"
          class="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          提交
        </button>
        <button
          type="button"
          class="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          @click="reset"
        >
          重置
        </button>
      </slot>
    </div>
  </form>
</template>

<style scoped>
.required::before {
  content: '*';
  color: #ff4d4f;
  margin-right: 4px;
}
</style>