<script setup lang="ts">
import { ref } from 'vue'
import BaseForm from '@/components/common/BaseForm.vue'
import type { FormItem, FormConfig } from '@/types/form'

// 表单配置
const formConfig: FormConfig = {
  layout: 'horizontal',
  labelWidth: '120px',
  labelAlign: 'right',
  showMessage: true
}

// 表单项
const formItems: FormItem[] = [
  {
    key: 'name',
    label: '姓名',
    type: 'text',
    required: true,
    rules: [
      { required: true, message: '请输入姓名' },
      { min: 2, max: 20, message: '姓名长度在 2-20 个字符之间' }
    ],
    placeholder: '请输入姓名'
  },
  {
    key: 'password',
    label: '密码',
    type: 'password',
    required: true,
    rules: [
      { required: true, message: '请输入密码' },
      { min: 6, message: '密码长度不能小于 6 个字符' },
      { 
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,}$/,
        message: '密码必须包含大小写字母和数字'
      }
    ],
    placeholder: '请输入密码'
  },
  {
    key: 'age',
    label: '年龄',
    type: 'number',
    rules: [
      { min: 0, max: 150, message: '年龄必须在 0-150 之间' }
    ],
    placeholder: '请输入年龄'
  },
  {
    key: 'gender',
    label: '性别',
    type: 'radio',
    required: true,
    options: [
      { label: '男', value: 'male' },
      { label: '女', value: 'female' },
      { label: '其他', value: 'other' }
    ]
  },
  {
    key: 'interests',
    label: '兴趣爱好',
    type: 'checkbox',
    options: [
      { label: '阅读', value: 'reading' },
      { label: '音乐', value: 'music' },
      { label: '运动', value: 'sports' },
      { label: '旅行', value: 'travel' }
    ]
  },
  {
    key: 'education',
    label: '学历',
    type: 'select',
    options: [
      { label: '高中', value: 'high-school' },
      { label: '大专', value: 'college' },
      { label: '本科', value: 'bachelor' },
      { label: '硕士', value: 'master' },
      { label: '博士', value: 'phd' }
    ],
    placeholder: '请选择学历'
  },
  {
    key: 'newsletter',
    label: '订阅通知',
    type: 'switch'
  },
  {
    key: 'description',
    label: '个人简介',
    type: 'textarea',
    placeholder: '请输入个人简介',
    rules: [
      { max: 500, message: '个人简介不能超过 500 个字符' }
    ]
  }
]

// 表单数据
const formData = ref({
  name: '',
  password: '',
  age: null,
  gender: '',
  interests: [],
  education: '',
  newsletter: false,
  description: ''
})

// 处理表单提交
const handleSubmit = (values: Record<string, any>) => {
  console.log('Form submitted:', values)
}

// 处理表单验证
const handleValidate = (errors: any[]) => {
  if (errors.length > 0) {
    console.log('Validation errors:', errors)
  }
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">表单组件示例</h1>
    
    <div class="max-w-3xl">
      <BaseForm
        v-model="formData"
        :items="formItems"
        :config="formConfig"
        @submit="handleSubmit"
        @validate="handleValidate"
      />
    </div>

    <div class="mt-8">
      <h2 class="text-lg font-semibold mb-2">当前表单数据：</h2>
      <pre class="bg-gray-100 p-4 rounded">{{ JSON.stringify(formData, null, 2) }}</pre>
    </div>
  </div>
</template>