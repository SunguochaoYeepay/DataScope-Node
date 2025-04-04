<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import type { Query, QueryType } from '@/types/query'
import type { DataSource } from '@/types/datasource'

// 定义组件属性
const props = defineProps<{
  open: boolean
  query?: Partial<Query> | null
  dataSources: DataSource[]
}>()

// 定义组件事件
const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
  (e: 'save', query: Partial<Query>): void
}>()

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  dataSourceId: '',
  queryType: 'SQL' as QueryType,
  queryText: '',
  description: ''
})

// 表单验证错误
const errors = reactive({
  name: '',
  dataSourceId: '',
  queryText: ''
})

// 重置表单
const resetForm = () => {
  formData.id = ''
  formData.name = ''
  formData.dataSourceId = props.dataSources.length > 0 ? props.dataSources[0].id : ''
  formData.queryType = 'SQL'
  formData.queryText = ''
  formData.description = ''
}

// 监听 open 属性变化
watch(() => props.open, (open) => {
  if (open) {
    console.log('SaveQueryModal打开，接收到查询数据:', props.query);
    
    // 清除表单数据，避免旧数据残留
    resetForm();
    
    if (props.query) {
      // 填充表单数据
      formData.id = props.query.id || ''
      formData.name = props.query.name || ''
      formData.dataSourceId = props.query.dataSourceId || (props.dataSources.length > 0 ? props.dataSources[0].id : '')
      formData.queryType = props.query.queryType || 'SQL'
      formData.queryText = props.query.queryText || ''
      formData.description = props.query.description || ''
    }
    
    console.log('初始化表单数据完成:', formData);
    
    // 清除验证错误
    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = ''
    })
  }
}, { immediate: true })

// 关闭对话框
const handleClose = () => {
  emit('update:open', false)
}

// 验证表单
const validateForm = () => {
  let isValid = true
  
  // 验证名称
  if (!formData.name.trim()) {
    errors.name = '请输入查询名称'
    isValid = false
  } else {
    errors.name = ''
  }
  
  // 验证数据源
  if (!formData.dataSourceId) {
    errors.dataSourceId = '请选择数据源'
    isValid = false
  } else {
    errors.dataSourceId = ''
  }
  
  // 验证查询内容
  if (!formData.queryText.trim()) {
    errors.queryText = 'SQL语句不能为空'
    isValid = false
  } else {
    errors.queryText = ''
  }
  
  return isValid
}

// 保存查询
const handleSave = () => {
  if (!validateForm()) return
  
  // 提交前的数据检查和记录
  console.log('准备保存查询:', { ...formData });
  
  // 创建一个适合接口要求的对象
  const queryData = {
    id: formData.id,
    name: formData.name,
    dataSourceId: formData.dataSourceId,
    sql: formData.queryText,
    description: formData.description
  };
  
  // 发出保存事件
  emit('save', queryData)
  handleClose()
}
</script>

<template>
  <div v-if="open" class="fixed inset-0 flex items-center justify-center z-50">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="handleClose"></div>
    
    <!-- 对话框内容 -->
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden relative z-10">
      <!-- 头部 -->
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">{{ formData.id ? '保存查询更改' : '保存新查询' }}</h3>
      </div>
      
      <!-- 表单内容 -->
      <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
        <!-- 新建查询说明或更新现有查询说明 -->
        <div class="space-y-4">
          <!-- 第一行: 查询名称和数据源 -->
          <div class="grid grid-cols-2 gap-4">
            <!-- 查询名称 -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                查询名称 <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.name"
                type="text"
                class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="给查询取个名字"
              />
              <p v-if="errors.name" class="text-red-500 text-xs">{{ errors.name }}</p>
            </div>
            
            <!-- 数据源 -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">
                数据源 <span class="text-red-500">*</span>
              </label>
              <select
                v-model="formData.dataSourceId"
                class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="" disabled>请选择数据源</option>
                <option v-for="ds in dataSources" :key="ds.id" :value="ds.id">
                  {{ ds.name }}
                </option>
              </select>
              <p v-if="errors.dataSourceId" class="text-red-500 text-xs">{{ errors.dataSourceId }}</p>
            </div>
          </div>
          
          <!-- 查询类型 -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">查询类型</label>
            <div class="flex space-x-4 mt-2">
              <label class="inline-flex items-center">
                <input type="radio" v-model="formData.queryType" value="SQL" class="form-radio" />
                <span class="ml-2">SQL</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" v-model="formData.queryType" value="NATURAL_LANGUAGE" class="form-radio" />
                <span class="ml-2">自然语言</span>
              </label>
            </div>
          </div>
          
          <!-- 查询内容 -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">
              查询内容 <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="formData.queryText"
              rows="4"
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
              placeholder="查询内容"
            ></textarea>
            <p v-if="errors.queryText" class="text-red-500 text-xs">{{ errors.queryText }}</p>
          </div>
          
          <!-- 描述/备注 -->
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-700">描述</label>
            <textarea
              v-model="formData.description"
              rows="2"
              class="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="查询的用途或说明"
            ></textarea>
          </div>
        </div>
      </div>
      
      <!-- 底部按钮 -->
      <div class="px-6 py-4 bg-gray-50 border-t flex justify-end space-x-3">
        <button
          @click="handleClose"
          class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          取消
        </button>
        <button
          @click="handleSave"
          class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {{ formData.id ? '保存更改' : '保存新查询' }}
        </button>
      </div>
    </div>
  </div>
</template>