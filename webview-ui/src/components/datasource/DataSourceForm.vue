<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import type { DataSource, DataSourceType, SyncFrequency, CreateDataSourceParams, ConnectionTestResult, TestConnectionParams, EncryptionType } from '@/types/datasource'
import { useDataSourceStore } from '@/stores/datasource'
import { message } from '@/services/message'

// 组件属性
const props = defineProps<{
  dataSource?: DataSource | null
  isEdit?: boolean
}>()

// 组件事件
const emit = defineEmits<{
  (e: 'save', dataSource: CreateDataSourceParams): void
  (e: 'cancel'): void
  (e: 'test-connection', params: TestConnectionParams, callback: (success: boolean) => void): void
}>()

// 数据源状态管理
const dataSourceStore = useDataSourceStore()

// 表单数据
interface FormData {
  id?: string
  name: string
  description: string
  type: DataSourceType
  host: string
  port: number
  database: string
  databaseName: string
  schema?: string
  username: string
  password: string
  confirmPassword: string
  syncFrequency: SyncFrequency
  connectionTimeout?: number
  maxPoolSize?: number
  autoSync?: boolean
  connectionParams: Record<string, string>
  encryptionType?: EncryptionType
  encryptionOptions?: Record<string, string>
}

const formData = reactive<FormData>({
  name: '',
  description: '',
  type: 'MYSQL',
  host: '',
  port: 3306,
  database: '',
  databaseName: '',
  username: '',
  password: '',
  confirmPassword: '',
  syncFrequency: 'MANUAL',
  connectionTimeout: 30,
  maxPoolSize: 10,
  autoSync: false,
  schema: '',
  connectionParams: {}
})

// 表单验证状态
const formErrors = reactive<Record<string, string>>({})
const isFormSubmitting = ref(false)
const isFormValid = ref(false)
const isTestingConnection = ref(false)
const testConnectionResult = ref<ConnectionTestResult | null>(null)

// 表单验证
const validateForm = () => {
  const errors: Record<string, string> = {}
  
  // 验证名称
  if (!formData.name.trim()) {
    errors.name = '请输入数据源名称'
  }
  
  // 验证主机
  if (!formData.host.trim()) {
    errors.host = '请输入主机地址'
  }
  
  // 验证端口
  if (!formData.port || formData.port <= 0) {
    errors.port = '请输入有效的端口号'
  }
  
  // 验证数据库名
  if (!formData.database.trim()) {
    errors.database = '请输入数据库名称'
  }
  
  // 验证用户名
  if (!formData.username.trim()) {
    errors.username = '请输入用户名'
  }
  
  // 验证密码（仅新建时必填）
  if (!props.isEdit && !formData.password) {
    errors.password = '请输入密码'
  }
  
  // 使用 Object.assign 更新 reactive 对象
  Object.assign(formErrors, errors)
  isFormValid.value = Object.keys(errors).length === 0
  
  // 在控制台输出验证结果，帮助调试
  console.log('表单验证结果:', { isFormValid: isFormValid.value, errors })
  
  return isFormValid.value
}

// 默认端口映射
const defaultPorts: Record<DataSourceType, number> = {
  'MYSQL': 3306,
  'POSTGRESQL': 5432,
  'ORACLE': 1521,
  'SQLSERVER': 1433,
  'MONGODB': 27017,
  'ELASTICSEARCH': 9200
}

// 计算标题
const formTitle = computed(() => props.isEdit ? '编辑数据源' : '添加数据源')

// 初始化表单数据
onMounted(() => {
  if (props.dataSource) {
    const ds = props.dataSource
    
    formData.id = ds.id
    formData.name = ds.name
    formData.description = ds.description
    formData.type = 'MYSQL'
    formData.host = ds.host
    formData.port = ds.port || 3306
    formData.database = ds.databaseName
    formData.username = ds.username
    formData.syncFrequency = ds.syncFrequency
    
    // 只有在编辑模式下才不设置密码，因为后端通常不会返回密码
    if (!props.isEdit) {
      formData.password = ds.password || ''
    }
    
    // 处理高级选项
    if (ds.connectionParams) {
      formData.connectionParams = { ...ds.connectionParams }
      
      if (ds.connectionParams.connectionTimeout) {
        formData.connectionTimeout = parseInt(ds.connectionParams.connectionTimeout, 10)
      }
      
      if (ds.connectionParams.maxPoolSize) {
        formData.maxPoolSize = parseInt(ds.connectionParams.maxPoolSize, 10)
      }
      
      formData.autoSync = ds.syncFrequency !== 'MANUAL'
    }
  } else {
    // 如果没有传入数据源，确保类型为MySQL，端口为3306
    formData.type = 'MYSQL'
    formData.port = 3306
  }
  
  // 只有在编辑模式下才初始验证表单
  if (props.isEdit && props.dataSource) {
    validateForm()
    // 使用setTimeout确保验证在下一个事件循环中执行
    setTimeout(() => {
      isFormValid.value = true
    }, 0)
  } else {
    // 新建模式下，清空所有错误信息
    Object.keys(formErrors).forEach(key => {
      formErrors[key] = '';
    });
  }
})

// 监听表单数据变化，自动更新isFormValid值
watch([
  () => formData.name,
  () => formData.host,
  () => formData.port,
  () => formData.database,
  () => formData.username,
  () => formData.password
], () => {
  // 编辑模式下，如果所有必填字段都有值，则表单有效
  if (props.isEdit) {
    const allRequiredFieldsHaveValue = 
      formData.name.trim() && 
      formData.host.trim() && 
      formData.port > 0 && 
      formData.database.trim() && 
      formData.username.trim();
    
    // 如果所有必填字段都有值，则强制设置表单有效
    if (allRequiredFieldsHaveValue) {
      isFormValid.value = true;
      // 清除所有错误
      Object.keys(formErrors).forEach(key => {
        formErrors[key] = '';
      });
    }
  } else {
    // 初始页面加载时不做验证，只在用户开始交互后才验证
    // 检查是否已经开始交互了
    const hasInteracted = formData.name.trim() || 
                           formData.host.trim() || 
                           (formData.port !== 3306) || 
                           formData.database.trim() || 
                           formData.username.trim() || 
                           formData.password.trim();
    
    if (hasInteracted) {
      validateForm();
    } else {
      // 清除所有错误，等待用户交互
      Object.keys(formErrors).forEach(key => {
        formErrors[key] = '';
      });
    }
  }
}, { immediate: true });

// 监听数据源变化
watch(() => props.dataSource, (newDataSource) => {
  if (newDataSource) {
    formData.id = newDataSource.id
    formData.name = newDataSource.name
    formData.description = newDataSource.description || ''
    formData.type = 'MYSQL'
    formData.host = newDataSource.host
    formData.port = newDataSource.port || 3306
    formData.database = newDataSource.databaseName
    formData.username = newDataSource.username
    formData.syncFrequency = newDataSource.syncFrequency
    
    // 只有在编辑模式下才不设置密码
    if (!props.isEdit) {
      formData.password = newDataSource.password || ''
    }
    
    // 处理高级选项
    if (newDataSource.connectionParams) {
      formData.connectionParams = { ...newDataSource.connectionParams }
      
      if (newDataSource.connectionParams.connectionTimeout) {
        formData.connectionTimeout = parseInt(newDataSource.connectionParams.connectionTimeout, 10)
      }
      
      if (newDataSource.connectionParams.maxPoolSize) {
        formData.maxPoolSize = parseInt(newDataSource.connectionParams.maxPoolSize, 10)
      }
      
      formData.autoSync = newDataSource.syncFrequency !== 'MANUAL'
    }
  }
}, { immediate: true })

// 处理输入变化
const handleInput = () => {
  validateForm()
  
  // 清除测试连接结果
  testConnectionResult.value = null
}

// 处理自动同步变化
const handleAutoSyncChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  formData.syncFrequency = target.checked ? 'DAILY' : 'MANUAL'
}

// 准备保存数据
const prepareDataForSave = (): CreateDataSourceParams => {
  // 构建保存的数据对象
  const saveData: CreateDataSourceParams = {
    name: formData.name,
    description: formData.description,
    type: 'MYSQL',
    host: formData.host,
    port: formData.port,
    databaseName: formData.database,
    username: formData.username,
    password: formData.password,
    syncFrequency: formData.syncFrequency,
    connectionParams: {
      ...formData.connectionParams,
      connectionTimeout: formData.connectionTimeout?.toString() || '',
      maxPoolSize: formData.maxPoolSize?.toString() || '',
      schema: formData.schema || ''
    }
  }
  
  // 如果是编辑模式，并且id存在，额外处理
  if (props.isEdit && formData.id) {
    // @ts-ignore - 忽略类型检查，允许添加id字段
    saveData.id = formData.id
  }
  
  return saveData
}

// 处理表单提交
const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  isFormSubmitting.value = true
  try {
    const saveData = prepareDataForSave()
    emit('save', saveData)
  } finally {
    isFormSubmitting.value = false
  }
}

// 处理测试连接
const handleTestConnection = async () => {
  if (!validateForm()) {
    return
  }
  
  isTestingConnection.value = true
  try {
    const params = prepareDataForSave()
    const testParams: TestConnectionParams = {
      type: params.type,
      host: params.host,
      port: params.port,
      databaseName: params.databaseName,
      username: params.username,
      password: params.password,
      connectionParams: formData.connectionParams
    }
    
    // 如果是编辑模式，添加ID
    if (props.isEdit && formData.id) {
      testParams.id = formData.id
    }
    
    emit('test-connection', testParams, (success) => {
      testConnectionResult.value = {
        success,
        message: success ? '连接成功' : '连接失败'
      }
    })
  } finally {
    isTestingConnection.value = false
  }
}

// 处理取消
const handleCancel = () => {
  emit('cancel')
}

// 强制重置表单状态
const forceEnableSubmit = () => {
  // 只在编辑模式下启用
  if (props.isEdit) {
    // 强制更新isFormValid状态
    isFormValid.value = true;
    
    // 清除所有错误
    Object.keys(formErrors).forEach(key => {
      formErrors[key] = '';
    });
    
    console.log('已强制启用表单提交');
  }
}

// 编辑模式下，组件挂载后自动启用表单提交
if (props.isEdit) {
  setTimeout(forceEnableSubmit, 500);  // 延迟执行，确保表单数据已加载
}
</script>

<template>
  <div class="bg-white rounded-lg shadow">
    <!-- 表单标题和操作按钮 -->
    <div class="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <h3 class="text-lg font-medium text-gray-900">{{ formTitle }}</h3>
      </div>
      <div class="flex items-center space-x-3">
        <button
          type="button"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="isTestingConnection"
          @click="handleTestConnection"
        >
          测试连接
        </button>
        <button
          type="button"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          :disabled="!isFormValid || isFormSubmitting"
          @click="handleSubmit"
        >
          保存修改
        </button>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="p-6 space-y-6">
      <!-- 基本信息 -->
      <div>
        <h4 class="text-base font-medium text-gray-900 mb-4">基本信息</h4>
        <div class="grid grid-cols-2 gap-x-6 gap-y-4">
          <!-- 名称 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">名称<span class="text-red-500">*</span></label>
            <input
              v-model="formData.name"
              type="text"
              class="block w-full h-9 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': formErrors.name }"
              placeholder="请输入数据源名称"
              @input="handleInput"
            />
            <p v-if="formErrors.name" class="mt-1 text-sm text-red-600">{{ formErrors.name }}</p>
          </div>

          <!-- 数据库类型 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">数据库类型<span class="text-red-500">*</span></label>
            <select
              v-model="formData.type"
              class="block w-full h-9 px-3 rounded-md border border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed sm:text-sm"
              disabled
              title="本期仅支持MySQL数据源"
            >
              <option value="MYSQL">MySQL</option>
            </select>
            <p class="mt-1 text-xs text-gray-500">本期仅支持MySQL数据源</p>
          </div>

          <!-- 描述 -->
          <div class="col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              v-model="formData.description"
              rows="2"
              class="block w-full px-3 py-2 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="请输入数据源描述（可选）"
              @input="handleInput"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- 连接信息 -->
      <div>
        <h4 class="text-base font-medium text-gray-900 mb-4">连接信息</h4>
        <div class="grid grid-cols-2 gap-x-6 gap-y-4">
          <!-- 主机地址 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">主机地址<span class="text-red-500">*</span></label>
            <input
              v-model="formData.host"
              type="text"
              class="block w-full h-9 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': formErrors.host }"
              placeholder="请输入主机地址"
              @input="handleInput"
            />
            <p v-if="formErrors.host" class="mt-1 text-sm text-red-600">{{ formErrors.host }}</p>
          </div>

          <!-- 端口号 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">端口号<span class="text-red-500">*</span></label>
            <input
              v-model.number="formData.port"
              type="number"
              class="block w-full h-9 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': formErrors.port }"
              placeholder="请输入端口号"
              @input="handleInput"
            />
            <p v-if="formErrors.port" class="mt-1 text-sm text-red-600">{{ formErrors.port }}</p>
          </div>

          <!-- 数据库名 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">数据库名<span class="text-red-500">*</span></label>
            <input
              v-model="formData.database"
              type="text"
              class="block w-full h-9 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': formErrors.database }"
              placeholder="请输入数据库名称"
              @input="handleInput"
            />
            <p v-if="formErrors.database" class="mt-1 text-sm text-red-600">{{ formErrors.database }}</p>
          </div>

          <!-- Schema -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Schema</label>
            <input
              v-model="formData.schema"
              type="text"
              class="block w-full h-9 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="请输入Schema（可选）"
              @input="handleInput"
            />
          </div>

          <!-- 用户名 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">用户名<span class="text-red-500">*</span></label>
            <input
              v-model="formData.username"
              type="text"
              class="block w-full h-9 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': formErrors.username }"
              placeholder="请输入用户名"
              @input="handleInput"
            />
            <p v-if="formErrors.username" class="mt-1 text-sm text-red-600">{{ formErrors.username }}</p>
          </div>

          <!-- 密码 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">密码<span v-if="!props.isEdit" class="text-red-500">*</span></label>
            <input
              v-model="formData.password"
              type="password"
              class="block w-full h-9 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              :class="{ 'border-red-300': formErrors.password }"
              placeholder="请输入密码"
              @input="handleInput"
            />
            <p v-if="formErrors.password" class="mt-1 text-sm text-red-600">{{ formErrors.password }}</p>
          </div>
        </div>
      </div>

      <!-- 高级设置 -->
      <div>
        <h4 class="text-base font-medium text-gray-900 mb-4">高级设置</h4>
        <div class="grid grid-cols-2 gap-x-6 gap-y-4">
          <!-- 连接超时 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">连接超时（秒）</label>
            <input
              v-model.number="formData.connectionTimeout"
              type="number"
              class="block w-full h-9 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="请输入连接超时时间"
              @input="handleInput"
            />
          </div>

          <!-- 最大连接数 -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">最大连接数</label>
            <input
              v-model.number="formData.maxPoolSize"
              type="number"
              class="block w-full h-9 px-3 rounded-md border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="请输入最大连接数"
              @input="handleInput"
            />
          </div>

          <!-- 自动同步 -->
          <div class="col-span-2">
            <div class="flex items-center">
              <input
                v-model="formData.autoSync"
                type="checkbox"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                @change="handleAutoSyncChange"
              />
              <label class="ml-2 text-sm text-gray-700">启用自动同步（每日）</label>
            </div>
          </div>
        </div>
      </div>

      <!-- 测试连接结果 -->
      <div v-if="testConnectionResult" class="mt-4 p-3 rounded-md" :class="[
        testConnectionResult.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
      ]">
        <p class="text-sm">
          {{ testConnectionResult.success ? '连接成功' : `连接失败: ${testConnectionResult.message}` }}
        </p>
      </div>
    </div>

  </div>
</template>