<script setup lang="ts">
import { ref, watch, reactive } from 'vue'
import type { Query, QueryType } from '@/types/query'
import type { DataSource } from '@/types/datasource'

// 定义组件属性
const props = defineProps<{
  visible: boolean
  query?: Partial<Query> | null
  dataSources: DataSource[]
}>()

// 定义组件事件
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'save', query: Partial<Query>): void
}>()

// 表单数据
const formData = reactive({
  id: '',
  name: '',
  dataSourceId: '',
  queryType: 'SQL' as QueryType,
  queryText: '',
  description: '',
  tags: [] as string[]
})

// 新标签输入
const newTag = ref('')

// 表单验证错误
const errors = reactive({
  name: '',
  dataSourceId: '',
  queryText: ''
})

// 监听 visible 属性变化
watch(() => props.visible, (visible) => {
  if (visible && props.query) {
    console.log('SaveQueryModal打开，接收到查询数据:', props.query);
    
    // 填充表单数据
    formData.id = props.query.id || ''
    formData.name = props.query.name || ''
    formData.dataSourceId = props.query.dataSourceId || (props.dataSources.length > 0 ? props.dataSources[0].id : '')
    formData.queryType = props.query.queryType || 'SQL'
    formData.queryText = props.query.queryText || ''
    formData.description = props.query.description || ''
    formData.tags = Array.isArray(props.query.tags) ? [...props.query.tags] : []
    
    console.log('初始化表单数据完成，queryText:', formData.queryText);
    
    // 清除验证错误
    Object.keys(errors).forEach(key => {
      errors[key as keyof typeof errors] = ''
    })
  }
})

// 关闭对话框
const handleClose = () => {
  emit('update:visible', false)
}

// 添加标签
const addTag = () => {
  if (newTag.value && !formData.tags.includes(newTag.value)) {
    formData.tags.push(newTag.value)
    newTag.value = ''
  }
}

// 移除标签
const removeTag = (tag: string) => {
  formData.tags = formData.tags.filter(t => t !== tag)
}

// 验证表单
const validateForm = () => {
  let isValid = true
  
  // 验证名称
  if (!formData.name) {
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
  
  // 验证查询文本
  if (!formData.queryText) {
    errors.queryText = '查询内容不能为空'
    isValid = false
  } else {
    errors.queryText = ''
  }
  
  return isValid
}

// 保存查询
const handleSave = () => {
  if (!validateForm()) return
  
  emit('save', { ...formData })
  handleClose()
}
</script>

<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center z-50">
    <!-- 背景遮罩 -->
    <div class="absolute inset-0 bg-black bg-opacity-50" @click="handleClose"></div>
    
    <!-- 对话框内容 -->
    <div class="bg-white rounded-lg shadow-xl w-full max-w-3xl overflow-hidden relative z-10">
      <!-- 头部 -->
      <div class="px-6 py-4 border-b">
        <h3 class="text-lg font-medium text-gray-900">保存查询</h3>
      </div>
      
      <!-- 表单内容 -->
      <div class="px-6 py-4 max-h-[70vh] overflow-y-auto">
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
                <option v-for="ds in dataSources" :key="ds.id" :value="ds.id">
                  {{ ds.name }}
                </option>
              </select>
              <p v-if="errors.dataSourceId" class="text-red-500 text-xs">{{ errors.dataSourceId }}</p>
            </div>
          </div>
          
          <!-- 第二行: 标签和查询类型 -->
          <div class="grid grid-cols-2 gap-4">
            <!-- 标签 -->
            <div class="space-y-1">
              <label class="block text-sm font-medium text-gray-700">标签</label>
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="tag in formData.tags"
                  :key="tag"
                  class="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center"
                >
                  {{ tag }}
                  <button
                    class="ml-1 text-blue-600 hover:text-blue-800"
                    @click="removeTag(tag)"
                  >
                    &times;
                  </button>
                </span>
              </div>
              <div class="flex">
                <input
                  v-model="newTag"
                  type="text"
                  class="flex-grow p-2 border rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="添加标签"
                  @keyup.enter="addTag"
                />
                <button
                  class="px-3 py-2 bg-blue-500 text-white rounded-r hover:bg-blue-600"
                  @click="addTag"
                >
                  添加
                </button>
              </div>
            </div>
            
            <!-- 查询类型 -->
            <div class="space-y-1 flex flex-col">
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
          </div>
          
          <!-- 第三行: 查询内容 -->
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
          
          <!-- 第四行: 描述/备注 -->
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
          class="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          @click="handleClose"
        >
          取消
        </button>
        <button
          class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          @click="handleSave"
        >
          保存
        </button>
      </div>
    </div>
  </div>
</template>