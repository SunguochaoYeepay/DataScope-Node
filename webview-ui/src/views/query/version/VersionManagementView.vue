<template>
  <div class="container mx-auto px-4 py-6">
    <!-- 页面标题和操作按钮 -->
    <div class="md:flex md:items-center md:justify-between mb-6">
      <div class="flex-1 min-w-0">
        <div class="flex items-center">
          <router-link
            :to="`/query/detail/${queryId}`"
            class="text-gray-500 hover:text-gray-700 mr-2"
          >
            <i class="fas fa-arrow-left"></i>
          </router-link>
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:truncate">
            {{ queryName || '查询' }} - 版本管理
          </h2>
        </div>
      </div>
      <div class="mt-4 flex md:mt-0 md:ml-4 space-x-3">
        <button
          @click="refreshVersions"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-sync-alt mr-2"></i>
          刷新
        </button>
        <router-link
          :to="`/query/editor?id=${queryId}`"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="fas fa-edit mr-2"></i>
          编辑查询
        </router-link>
      </div>
    </div>

    <!-- 加载中状态 -->
    <div v-if="isLoading" class="flex justify-center items-center h-64">
      <div class="flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span class="text-gray-600">加载版本历史中...</span>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="errorMessage" class="bg-red-50 p-4 rounded-md mb-6">
      <div class="flex items-center">
        <i class="fas fa-exclamation-circle text-red-400 mr-3"></i>
        <h3 class="text-sm font-medium text-red-800">加载失败</h3>
      </div>
      <div class="mt-2 text-sm text-red-700">
        <p>{{ errorMessage }}</p>
      </div>
      <div class="mt-4">
        <button
          @click="refreshVersions"
          class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          <i class="fas fa-sync-alt mr-1.5"></i>
          重试
        </button>
      </div>
    </div>

    <!-- 版本列表 -->
    <div v-else-if="versions.length > 0">
      <!-- 当前活跃版本卡片 -->
      <div class="bg-white border-2 border-indigo-300 shadow rounded-lg mb-6 p-6">
        <div class="flex justify-between items-start">
          <div>
            <div class="flex items-center mb-2">
              <h3 class="text-lg font-medium text-gray-900">当前活跃版本</h3>
              <span class="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                版本 {{ currentVersion?.versionNumber || '-' }}
              </span>
              <span class="ml-2 text-gray-500 text-sm">
                {{ formatDate(currentVersion?.createdAt) }}
              </span>
            </div>
            <div class="text-sm text-gray-500 mb-3">
              <p>由 {{ currentVersion?.createdBy || '系统' }} 创建，上次修改于 {{ formatDate(currentVersion?.updatedAt) }}</p>
            </div>
            <div class="bg-gray-50 p-3 rounded-md border border-gray-200">
              <pre class="text-sm text-gray-800 whitespace-pre-wrap max-h-32 overflow-y-auto">{{ currentVersion?.queryText }}</pre>
            </div>
          </div>
          <div class="flex space-x-2">
            <button
              @click="executeVersion(currentVersion)"
              class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <i class="fas fa-play mr-1.5"></i>
              执行
            </button>
          </div>
        </div>
      </div>

      <!-- 版本历史 -->
      <div class="bg-white shadow overflow-hidden rounded-lg mb-6">
        <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
          <h3 class="text-lg leading-6 font-medium text-gray-900">版本历史</h3>
          <div class="flex items-center space-x-2">
            <label for="compareMode" class="text-sm text-gray-600">对比模式:</label>
            <select
              id="compareMode"
              v-model="compareMode"
              class="text-sm border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="single">单选</option>
              <option value="dual">双选</option>
            </select>
          </div>
        </div>
        
        <div class="border-t border-gray-200">
          <ul class="divide-y divide-gray-200">
            <li v-for="version in sortedVersions" :key="version.versionNumber" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
              <div class="flex items-center justify-between">
                <div class="flex-1">
                  <div class="flex items-center mb-1">
                    <h4 class="text-base font-medium text-gray-900">
                      版本 {{ version.versionNumber }}
                    </h4>
                    <span
                      v-if="currentVersion?.versionNumber === version.versionNumber"
                      class="ml-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full"
                    >
                      当前活跃
                    </span>
                    <span
                      v-if="isVersionSelected(version)"
                      class="ml-2 px-2 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full"
                    >
                      已选择
                    </span>
                    <span class="ml-2 text-gray-500 text-sm">
                      {{ formatDate(version.createdAt) }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-500">
                    由 {{ version.createdBy || '系统' }} 创建
                  </p>
                  <div class="mt-2 bg-gray-50 p-2 rounded-md border border-gray-200">
                    <pre class="text-xs text-gray-700 whitespace-pre-wrap max-h-20 overflow-y-auto">{{ version.queryText }}</pre>
                  </div>
                </div>
                <div class="ml-4 flex-shrink-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    v-if="compareMode === 'single'"
                    @click="selectVersion(version)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <i class="fas fa-check mr-1.5"></i>
                    选择
                  </button>
                  <button
                    v-else
                    @click="toggleVersionSelection(version)"
                    class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    :class="isVersionSelected(version) ? 'text-indigo-700 bg-indigo-50 hover:bg-indigo-100' : 'text-gray-700 bg-white hover:bg-gray-50'"
                  >
                    <i class="fas mr-1.5" :class="isVersionSelected(version) ? 'fa-check-square' : 'fa-square'"></i>
                    {{ isVersionSelected(version) ? '已选择' : '选择' }}
                  </button>
                  <button
                    @click="activateVersion(version)"
                    :disabled="currentVersion?.versionNumber === version.versionNumber"
                    :class="[
                      'inline-flex items-center px-3 py-1.5 border text-sm rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
                      currentVersion?.versionNumber === version.versionNumber 
                        ? 'border-gray-200 text-gray-400 bg-gray-100 cursor-not-allowed' 
                        : 'border-indigo-300 text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:ring-indigo-500'
                    ]"
                  >
                    <i class="fas fa-check-circle mr-1.5"></i>
                    {{ currentVersion?.versionNumber === version.versionNumber ? '已激活' : '设为当前' }}
                  </button>
                  <button
                    @click="executeVersion(version)"
                    class="inline-flex items-center px-3 py-1.5 border border-transparent text-sm rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <i class="fas fa-play mr-1.5"></i>
                    执行
                  </button>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- 版本对比区域 (仅在对比模式时显示) -->
      <div v-if="compareMode === 'dual' && selectedVersions.length === 2" class="bg-white shadow rounded-lg p-6 mb-6">
        <h3 class="text-lg font-medium text-gray-900 mb-4">版本对比</h3>
        
        <div class="grid grid-cols-2 gap-6">
          <div>
            <div class="flex items-center mb-2">
              <h4 class="text-base font-medium text-gray-800">版本 {{ selectedVersions[0].versionNumber }}</h4>
              <span class="ml-2 text-sm text-gray-500">{{ formatDate(selectedVersions[0].createdAt) }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-md border border-gray-200 h-80 overflow-auto">
              <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ selectedVersions[0].queryText }}</pre>
            </div>
          </div>
          
          <div>
            <div class="flex items-center mb-2">
              <h4 class="text-base font-medium text-gray-800">版本 {{ selectedVersions[1].versionNumber }}</h4>
              <span class="ml-2 text-sm text-gray-500">{{ formatDate(selectedVersions[1].createdAt) }}</span>
            </div>
            <div class="bg-gray-50 p-3 rounded-md border border-gray-200 h-80 overflow-auto">
              <pre class="text-sm text-gray-800 whitespace-pre-wrap">{{ selectedVersions[1].queryText }}</pre>
            </div>
          </div>
        </div>
        
        <div class="mt-4 flex justify-end">
          <button
            @click="clearSelection"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <i class="fas fa-times mr-2"></i>
            清除选择
          </button>
        </div>
      </div>
    </div>

    <!-- 没有版本时的状态 -->
    <div v-else class="bg-white shadow rounded-lg p-6 flex flex-col items-center justify-center text-center py-12">
      <div class="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <i class="fas fa-code-branch text-2xl text-gray-400"></i>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">没有版本历史</h3>
      <p class="text-sm text-gray-500 max-w-md mb-6">这个查询还没有保存过版本。每次修改查询并保存时，系统会自动创建新版本。</p>
      <router-link
        :to="`/query/editor?id=${queryId}`"
        class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <i class="fas fa-edit mr-2"></i>
        编辑查询
      </router-link>
    </div>

    <!-- 操作确认对话框 -->
    <div v-if="showConfirmDialog" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">{{ confirmDialog.title }}</h3>
        <p class="text-sm text-gray-500 mb-6">{{ confirmDialog.message }}</p>
        <div class="flex justify-end space-x-3">
          <button
            @click="cancelConfirmAction"
            class="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            取消
          </button>
          <button
            @click="confirmAction"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQueryStore } from '@/stores/query'
import { useQueryVersionStore } from '@/stores/queryVersion'
import type { QueryVersion } from '@/types/query'

// 状态变量
const isLoading = ref(true)
const errorMessage = ref('')
const compareMode = ref('single')
const selectedVersions = ref<QueryVersion[]>([])
const showConfirmDialog = ref(false)
const confirmDialog = ref({
  title: '',
  message: '',
  action: '',
  data: null as any
})

// 路由相关
const route = useRoute()
const router = useRouter()
const queryId = computed(() => route.params.id as string)

// Store
const queryStore = useQueryStore()
const versionStore = useQueryVersionStore()

// 查询名称
const queryName = computed(() => {
  return queryStore.currentQuery?.name || ''
})

// 获取所有版本
const versions = computed(() => {
  return versionStore.versions
})

// 排序后的版本
const sortedVersions = computed(() => {
  return [...versions.value].sort((a, b) => b.versionNumber - a.versionNumber)
})

// 当前活跃版本
const currentVersion = computed(() => {
  return versionStore.currentVersion
})

// 组件加载完成后获取数据
onMounted(async () => {
  loadVersionData()
})

// 加载版本数据
const loadVersionData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    console.log('开始加载版本数据，查询ID:', queryId.value)
    
    // 加载查询详情
    console.log('正在获取查询详情...')
    await queryStore.getQuery(queryId.value)
    console.log('查询详情获取成功:', queryStore.currentQuery)
    
    // 加载版本数据
    console.log('正在获取版本列表...')
    await versionStore.getQueryVersions(queryId.value)
    console.log('版本列表获取成功，数量:', versions.value.length, '数据:', versions.value)
    
    // 加载当前活跃版本
    console.log('正在获取当前活跃版本...')
    await versionStore.getCurrentVersion(queryId.value)
    console.log('当前活跃版本获取成功:', currentVersion.value)
    
    // 记录获取到的版本ID和queryId关系，用于调试
    if (versions.value && versions.value.length > 0) {
      console.log('版本和查询ID关系：', versions.value.map(v => ({
        versionId: v.id,
        queryId: v.queryId,
        versionNumber: v.versionNumber,
        isActive: v.isActive
      })))
    } else {
      console.warn('没有找到任何版本数据!')
      errorMessage.value = '该查询暂无版本历史记录'
    }
    
    isLoading.value = false
  } catch (error) {
    console.error('Failed to load version data:', error)
    errorMessage.value = error instanceof Error 
      ? `无法加载版本数据: ${error.message}` 
      : '无法加载版本数据，请稍后重试'
    isLoading.value = false
  }
}

// 刷新版本数据
const refreshVersions = async () => {
  await loadVersionData()
}

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 激活版本
const activateVersion = (version: QueryVersion) => {
  if (currentVersion.value?.versionNumber === version.versionNumber) {
    return // 已经是当前版本
  }
  
  // 打开确认对话框
  confirmDialog.value = {
    title: `激活版本 ${version.versionNumber}`,
    message: `确定要将版本 ${version.versionNumber} 设置为当前活跃版本吗？这将影响所有新的查询执行。`,
    action: 'activate',
    data: version
  }
  showConfirmDialog.value = true
}

// 执行指定版本的查询
const executeVersion = (version: QueryVersion) => {
  if (!version) return
  
  router.push({
    path: `/query/editor`,
    query: {
      id: queryId.value,
      version: version.versionNumber
    }
  })
}

// 版本选择 (单选模式)
const selectVersion = (version: QueryVersion) => {
  selectedVersions.value = [version]
}

// 切换版本选择 (对比模式)
const toggleVersionSelection = (version: QueryVersion) => {
  const index = selectedVersions.value.findIndex(v => v.versionNumber === version.versionNumber)
  
  if (index >= 0) {
    // 已选中，取消选择
    selectedVersions.value.splice(index, 1)
  } else {
    // 未选中，添加选择
    if (selectedVersions.value.length >= 2) {
      // 如果已有两个版本，替换最早选择的那个
      selectedVersions.value.shift()
    }
    selectedVersions.value.push(version)
  }
}

// 检查版本是否已选择
const isVersionSelected = (version: QueryVersion) => {
  return selectedVersions.value.some(v => v.versionNumber === version.versionNumber)
}

// 清除选择
const clearSelection = () => {
  selectedVersions.value = []
}

// 确认对话框操作
const confirmAction = async () => {
  const { action, data } = confirmDialog.value
  
  if (action === 'activate') {
    try {
      console.log('开始激活版本，查询ID:', queryId.value, '版本号:', data.versionNumber, '版本对象:', data)
      
      await versionStore.activateVersion(queryId.value, data.versionNumber)
      console.log('版本激活成功，开始重新加载数据')
      
      // 激活成功后重新加载数据以更新UI
      await loadVersionData()
      console.log('数据重新加载完成，当前活跃版本:', currentVersion.value)
      
      showConfirmDialog.value = false
    } catch (error) {
      console.error('Failed to activate version:', error)
      const errorMsg = error instanceof Error ? error.message : '未知错误'
      console.error('激活版本失败，错误详情:', errorMsg)
      
      errorMessage.value = error instanceof Error 
        ? `无法激活版本: ${error.message}` 
        : '无法激活版本，请稍后重试'
    }
  }
}

// 取消确认对话框
const cancelConfirmAction = () => {
  showConfirmDialog.value = false
}
</script>

<style scoped>
/* 自定义滚动条样式 */
pre {
  scrollbar-width: thin;
  scrollbar-color: rgba(156, 163, 175, 0.5) transparent;
}

pre::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

pre::-webkit-scrollbar-track {
  background: transparent;
}

pre::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 3px;
}
</style>