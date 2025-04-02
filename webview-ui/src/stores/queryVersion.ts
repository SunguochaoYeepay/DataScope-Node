import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  queryVersionService, 
  isUsingMockApi, 
  getApiBaseUrl 
} from '@/services/queryVersionService'
import { message } from '@/services/message'
import { loading } from '@/services/loading'
import type { 
  QueryVersion, 
  QueryVersionStatus,
  QueryVersionParams,
  SaveVersionParams,
  VersionListParams,
  Pagination
} from '@/types/queryVersion'

export const useQueryVersionStore = defineStore('queryVersion', () => {
  // 状态
  const versions = ref<QueryVersion[]>([])
  const currentVersion = ref<QueryVersion | null>(null)
  const isLoading = ref(false)
  const error = ref<Error | null>(null)
  const pagination = ref<Pagination>({
    total: 0,
    page: 1,
    size: 10,
    totalPages: 0,
    hasMore: false
  })

  // 计算属性
  const activeVersion = computed(() => {
    return versions.value.find(v => v.isActive)
  })

  const latestVersion = computed(() => {
    if (versions.value.length === 0) return null
    return versions.value.reduce((latest, current) => {
      return current.versionNumber > latest.versionNumber ? current : latest
    }, versions.value[0])
  })

  const draftVersions = computed(() => {
    return versions.value.filter(v => v.status === 'DRAFT')
  })

  const publishedVersions = computed(() => {
    return versions.value.filter(v => v.status === 'PUBLISHED')
  })

  // 获取查询版本列表
  const fetchVersions = async (queryId: string, params: VersionListParams = {}) => {
    try {
      isLoading.value = true
      error.value = null
      
      const result = await queryVersionService.getVersions(queryId, params)
      
      versions.value = result.items || []
      
      // 更新分页信息
      pagination.value = {
        page: result.page || 1,
        size: result.size || 10,
        total: result.total || 0,
        totalPages: result.totalPages || Math.ceil((result.total || 0) / (result.size || 10)),
        hasMore: (result.page || 1) < (result.totalPages || 1)
      }
      
      return result
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('获取版本列表失败')
      console.error('获取版本列表失败:', err)
      return { items: [], total: 0, page: 1, size: 10, totalPages: 0 }
    } finally {
      isLoading.value = false
    }
  }

  // 获取单个版本详情
  const getVersion = async (queryId: string, versionId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const version = await queryVersionService.getVersion(queryId, versionId)
      currentVersion.value = version
      
      return version
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('获取版本详情失败')
      console.error('获取版本详情失败:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 保存草稿版本
  const saveDraft = async (queryId: string, params: SaveVersionParams) => {
    try {
      isLoading.value = true
      error.value = null
      
      loading.show('保存草稿中...')
      
      // 首先检查是否有版本ID
      if (params.versionId) {
        // 更新现有草稿
        const version = await queryVersionService.updateVersion(queryId, params.versionId, {
          queryText: params.queryText,
          description: params.description
        })
        
        // 更新本地状态
        currentVersion.value = version
        
        // 如果版本列表中有此版本，更新它
        const index = versions.value.findIndex(v => v.id === version.id)
        if (index !== -1) {
          versions.value[index] = version
        }
        
        message.success('草稿已更新')
        return version
      } else {
        // 创建新草稿
        const version = await queryVersionService.createVersion(queryId, {
          queryText: params.queryText,
          description: params.description || '新建草稿版本'
        })
        
        // 更新本地状态
        currentVersion.value = version
        
        // 添加到版本列表
        versions.value = [version, ...versions.value]
        
        message.success('新草稿已创建')
        return version
      }
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('保存草稿失败')
      console.error('保存草稿失败:', err)
      throw error.value
    } finally {
      loading.hide()
      isLoading.value = false
    }
  }

  // 发布版本
  const publishVersion = async (queryId: string, versionId: string, setActive: boolean = false) => {
    try {
      isLoading.value = true
      error.value = null
      
      loading.show('发布版本中...')
      
      const version = await queryVersionService.publishVersion(queryId, versionId, setActive)
      
      // 更新本地状态
      currentVersion.value = version
      
      // 更新版本列表中的状态
      const index = versions.value.findIndex(v => v.id === version.id)
      if (index !== -1) {
        versions.value[index] = version
      }
      
      // 如果设置为活跃版本，更新其他版本的活跃状态
      if (setActive && version.isActive) {
        versions.value = versions.value.map(v => {
          if (v.id !== version.id) {
            return { ...v, isActive: false }
          }
          return v
        })
      }
      
      message.success('版本已发布')
      return version
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('发布版本失败')
      console.error('发布版本失败:', err)
      throw error.value
    } finally {
      loading.hide()
      isLoading.value = false
    }
  }

  // 废弃版本
  const deprecateVersion = async (queryId: string, versionId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      loading.show('废弃版本中...')
      
      const version = await queryVersionService.deprecateVersion(queryId, versionId)
      
      // 更新本地状态
      if (currentVersion.value && currentVersion.value.id === version.id) {
        currentVersion.value = version
      }
      
      // 更新版本列表中的状态
      const index = versions.value.findIndex(v => v.id === version.id)
      if (index !== -1) {
        versions.value[index] = version
      }
      
      message.success('版本已废弃')
      return version
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('废弃版本失败')
      console.error('废弃版本失败:', err)
      throw error.value
    } finally {
      loading.hide()
      isLoading.value = false
    }
  }

  // 设置为活跃版本
  const setActiveVersion = async (queryId: string, versionId: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      loading.show('设置活跃版本中...')
      
      const version = await queryVersionService.setActiveVersion(queryId, versionId)
      
      // 更新本地状态
      if (currentVersion.value && currentVersion.value.id === version.id) {
        currentVersion.value = version
      }
      
      // 更新所有版本的活跃状态
      versions.value = versions.value.map(v => {
        if (v.id === version.id) {
          return { ...v, isActive: true }
        } else {
          return { ...v, isActive: false }
        }
      })
      
      message.success('已设置为当前活跃版本')
      return version
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('设置活跃版本失败')
      console.error('设置活跃版本失败:', err)
      throw error.value
    } finally {
      loading.hide()
      isLoading.value = false
    }
  }

  // 创建新版本（基于现有版本）
  const createNewVersion = async (queryId: string, baseVersionId: string, params: Partial<SaveVersionParams> = {}) => {
    try {
      isLoading.value = true
      error.value = null
      
      loading.show('创建新版本中...')
      
      // 先获取基础版本详情
      const baseVersion = await queryVersionService.getVersion(queryId, baseVersionId)
      
      // 创建新草稿版本
      const newVersion = await queryVersionService.createVersion(queryId, {
        queryText: params.queryText || baseVersion.queryText,
        description: params.description || `基于版本 ${baseVersion.versionNumber} 创建的新版本`
      })
      
      // 更新本地状态
      currentVersion.value = newVersion
      
      // 添加到版本列表
      versions.value = [newVersion, ...versions.value]
      
      message.success('新版本已创建')
      return newVersion
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('创建新版本失败')
      console.error('创建新版本失败:', err)
      throw error.value
    } finally {
      loading.hide()
      isLoading.value = false
    }
  }

  // 比较两个版本
  const compareVersions = async (queryId: string, versionId1: string, versionId2: string) => {
    try {
      isLoading.value = true
      error.value = null
      
      const comparison = await queryVersionService.compareVersions(queryId, versionId1, versionId2)
      return comparison
    } catch (err) {
      error.value = err instanceof Error ? err : new Error(String(err))
      message.error('比较版本失败')
      console.error('比较版本失败:', err)
      return null
    } finally {
      isLoading.value = false
    }
  }

  // 重置状态
  const resetState = () => {
    versions.value = []
    currentVersion.value = null
    isLoading.value = false
    error.value = null
    pagination.value = {
      total: 0,
      page: 1,
      size: 10,
      totalPages: 0,
      hasMore: false
    }
  }

  return {
    // 状态
    versions,
    currentVersion,
    isLoading,
    error,
    pagination,
    
    // 计算属性
    activeVersion,
    latestVersion,
    draftVersions,
    publishedVersions,
    
    // 方法
    fetchVersions,
    getVersion,
    saveDraft,
    publishVersion,
    deprecateVersion,
    setActiveVersion,
    createNewVersion,
    compareVersions,
    resetState
  }
})