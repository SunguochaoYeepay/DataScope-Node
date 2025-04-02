import axios from 'axios'
import type {
  QueryVersion,
  QueryVersionStatus,
  CreateVersionParams,
  UpdateVersionParams,
  QueryVersionParams,
  VersionListParams,
  VersionComparison,
  PageResponse
} from '@/types/queryVersion'
import { getErrorMessage } from '@/utils/error'

// 获取API基础URL
export const getApiBaseUrl = (): string => {
  return process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api'
    : '/api'
}

// 判断是否使用模拟API
export const isUsingMockApi = (): boolean => {
  return process.env.VUE_APP_USE_MOCK_API === 'true' || 
         process.env.NODE_ENV === 'development'
}

// 创建API实例
const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Content-Type': 'application/json'
  }
})

// 模拟数据
const mockVersions: QueryVersion[] = [
  {
    id: 'v1',
    queryId: 'q1',
    versionNumber: 1,
    queryText: 'SELECT * FROM users',
    status: 'PUBLISHED',
    description: '初始版本',
    createdBy: 'user1',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-01-01T00:00:00Z',
    publishedAt: '2023-01-01T02:00:00Z',
    isActive: true
  },
  {
    id: 'v2',
    queryId: 'q1',
    versionNumber: 2,
    queryText: 'SELECT * FROM users WHERE status = "active"',
    status: 'PUBLISHED',
    description: '添加状态过滤',
    createdBy: 'user1',
    createdAt: '2023-01-02T00:00:00Z',
    updatedAt: '2023-01-02T00:00:00Z',
    publishedAt: '2023-01-02T02:00:00Z',
    isActive: false
  },
  {
    id: 'v3',
    queryId: 'q1',
    versionNumber: 3,
    queryText: 'SELECT id, name, email, status FROM users WHERE status = "active"',
    status: 'DRAFT',
    description: '精简字段选择',
    createdBy: 'user1',
    createdAt: '2023-01-03T00:00:00Z',
    updatedAt: '2023-01-03T00:00:00Z',
    isActive: false
  }
]

// 生成模拟版本列表
const generateMockVersions = (queryId: string, count: number = 5): QueryVersion[] => {
  const versions: QueryVersion[] = []
  
  for (let i = 1; i <= count; i++) {
    const isLatest = i === count
    const isDraft = isLatest
    const isActive = i === count - 1
    
    versions.push({
      id: `version-${queryId}-${i}`,
      queryId,
      versionNumber: i,
      queryText: `SELECT * FROM table_${i} WHERE id > ${i * 10}`,
      status: isDraft ? 'DRAFT' : (i % 3 === 0 ? 'DEPRECATED' : 'PUBLISHED'),
      description: `版本 ${i} 的描述`,
      createdBy: 'user1',
      createdAt: new Date(Date.now() - (count - i) * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - (count - i) * 86400000).toISOString(),
      publishedAt: isDraft ? undefined : new Date(Date.now() - (count - i) * 86400000 + 3600000).toISOString(),
      deprecatedAt: i % 3 === 0 ? new Date(Date.now() - (count - i) * 86400000 + 7200000).toISOString() : undefined,
      isActive
    })
  }
  
  return versions
}

// 查询版本服务
export const queryVersionService = {
  // 获取查询版本列表
  async getVersions(queryId: string, params: VersionListParams = {}): Promise<PageResponse<QueryVersion>> {
    try {
      if (isUsingMockApi()) {
        // 使用模拟数据
        const mockData = generateMockVersions(queryId, 10)
        
        // 应用筛选
        let filteredData = [...mockData]
        if (params.status) {
          filteredData = filteredData.filter(v => v.status === params.status)
        }
        
        // 应用排序
        if (params.sortBy) {
          filteredData.sort((a: any, b: any) => {
            const aValue = a[params.sortBy as keyof QueryVersion]
            const bValue = b[params.sortBy as keyof QueryVersion]
            const direction = params.sortDir === 'desc' ? -1 : 1
            
            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return direction * aValue.localeCompare(bValue)
            }
            
            return direction * (aValue > bValue ? 1 : -1)
          })
        } else {
          // 默认按版本号降序排列
          filteredData.sort((a, b) => b.versionNumber - a.versionNumber)
        }
        
        // 应用分页
        const page = params.page || 1
        const size = params.size || 10
        const start = (page - 1) * size
        const end = start + size
        const paginatedData = filteredData.slice(start, end)
        
        // 返回分页结果
        return {
          items: paginatedData,
          total: filteredData.length,
          page,
          size,
          totalPages: Math.ceil(filteredData.length / size)
        }
      }
      
      // 调用实际API
      const response = await api.get(`/queries/${queryId}/versions`, { params })
      return response.data
    } catch (error) {
      console.error('Failed to get versions:', error)
      throw new Error(getErrorMessage(error))
    }
  },
  
  // 获取单个版本详情
  async getVersion(queryId: string, versionId: string): Promise<QueryVersion> {
    try {
      if (isUsingMockApi()) {
        // 使用模拟数据
        const mockData = generateMockVersions(queryId, 10)
        const version = mockData.find(v => v.id === versionId)
        
        if (!version) {
          throw new Error(`版本不存在: ${versionId}`)
        }
        
        return version
      }
      
      // 调用实际API
      const response = await api.get(`/queries/${queryId}/versions/${versionId}`)
      return response.data
    } catch (error) {
      console.error('Failed to get version:', error)
      throw new Error(getErrorMessage(error))
    }
  },
  
  // 创建新版本
  async createVersion(queryId: string, params: CreateVersionParams): Promise<QueryVersion> {
    try {
      if (isUsingMockApi()) {
        // 使用模拟数据
        const mockData = generateMockVersions(queryId, 10)
        const nextVersionNumber = Math.max(...mockData.map(v => v.versionNumber)) + 1
        
        const newVersion: QueryVersion = {
          id: `version-${queryId}-${nextVersionNumber}`,
          queryId,
          versionNumber: nextVersionNumber,
          queryText: params.queryText,
          status: 'DRAFT',
          description: params.description || `版本 ${nextVersionNumber}`,
          createdBy: 'user1',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: false
        }
        
        return newVersion
      }
      
      // 调用实际API
      const response = await api.post(`/queries/${queryId}/versions`, params)
      return response.data
    } catch (error) {
      console.error('Failed to create version:', error)
      throw new Error(getErrorMessage(error))
    }
  },
  
  // 更新版本
  async updateVersion(queryId: string, versionId: string, params: UpdateVersionParams): Promise<QueryVersion> {
    try {
      if (isUsingMockApi()) {
        // 使用模拟数据
        const mockData = generateMockVersions(queryId, 10)
        const versionIndex = mockData.findIndex(v => v.id === versionId)
        
        if (versionIndex === -1) {
          throw new Error(`版本不存在: ${versionId}`)
        }
        
        const version = mockData[versionIndex]
        
        // 只允许更新草稿状态的版本
        if (version.status !== 'DRAFT') {
          throw new Error('只能更新草稿状态的版本')
        }
        
        const updatedVersion: QueryVersion = {
          ...version,
          queryText: params.queryText || version.queryText,
          description: params.description !== undefined ? params.description : version.description,
          updatedAt: new Date().toISOString()
        }
        
        return updatedVersion
      }
      
      // 调用实际API
      const response = await api.put(`/queries/${queryId}/versions/${versionId}`, params)
      return response.data
    } catch (error) {
      console.error('Failed to update version:', error)
      throw new Error(getErrorMessage(error))
    }
  },
  
  // 发布版本
  async publishVersion(queryId: string, versionId: string, setActive: boolean = false): Promise<QueryVersion> {
    try {
      if (isUsingMockApi()) {
        // 使用模拟数据
        const mockData = generateMockVersions(queryId, 10)
        const versionIndex = mockData.findIndex(v => v.id === versionId)
        
        if (versionIndex === -1) {
          throw new Error(`版本不存在: ${versionId}`)
        }
        
        const version = mockData[versionIndex]
        
        // 只允许发布草稿状态的版本
        if (version.status !== 'DRAFT') {
          throw new Error('只能发布草稿状态的版本')
        }
        
        const updatedVersion: QueryVersion = {
          ...version,
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isActive: setActive
        }
        
        return updatedVersion
      }
      
      // 调用实际API
      const response = await api.post(`/queries/${queryId}/versions/${versionId}/publish`, { setActive })
      return response.data
    } catch (error) {
      console.error('Failed to publish version:', error)
      throw new Error(getErrorMessage(error))
    }
  },
  
  // 废弃版本
  async deprecateVersion(queryId: string, versionId: string): Promise<QueryVersion> {
    try {
      if (isUsingMockApi()) {
        // 使用模拟数据
        const mockData = generateMockVersions(queryId, 10)
        const versionIndex = mockData.findIndex(v => v.id === versionId)
        
        if (versionIndex === -1) {
          throw new Error(`版本不存在: ${versionId}`)
        }
        
        const version = mockData[versionIndex]
        
        // 只允许废弃已发布状态的版本
        if (version.status !== 'PUBLISHED') {
          throw new Error('只能废弃已发布状态的版本')
        }
        
        // 不允许废弃当前活跃版本
        if (version.isActive) {
          throw new Error('不能废弃当前活跃版本')
        }
        
        const updatedVersion: QueryVersion = {
          ...version,
          status: 'DEPRECATED',
          deprecatedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        return updatedVersion
      }
      
      // 调用实际API
      const response = await api.post(`/queries/${queryId}/versions/${versionId}/deprecate`)
      return response.data
    } catch (error) {
      console.error('Failed to deprecate version:', error)
      throw new Error(getErrorMessage(error))
    }
  },
  
  // 设置活跃版本
  async setActiveVersion(queryId: string, versionId: string): Promise<QueryVersion> {
    try {
      if (isUsingMockApi()) {
        // 使用模拟数据
        const mockData = generateMockVersions(queryId, 10)
        const versionIndex = mockData.findIndex(v => v.id === versionId)
        
        if (versionIndex === -1) {
          throw new Error(`版本不存在: ${versionId}`)
        }
        
        const version = mockData[versionIndex]
        
        // 只允许设置已发布状态的版本为活跃
        if (version.status !== 'PUBLISHED') {
          throw new Error('只能将已发布状态的版本设为活跃')
        }
        
        const updatedVersion: QueryVersion = {
          ...version,
          isActive: true,
          updatedAt: new Date().toISOString()
        }
        
        return updatedVersion
      }
      
      // 调用实际API
      const response = await api.post(`/queries/${queryId}/versions/${versionId}/activate`)
      return response.data
    } catch (error) {
      console.error('Failed to set active version:', error)
      throw new Error(getErrorMessage(error))
    }
  },
  
  // 比较两个版本
  async compareVersions(queryId: string, versionId1: string, versionId2: string): Promise<VersionComparison> {
    try {
      if (isUsingMockApi()) {
        // 使用模拟数据
        const mockData = generateMockVersions(queryId, 10)
        const version1 = mockData.find(v => v.id === versionId1)
        const version2 = mockData.find(v => v.id === versionId2)
        
        if (!version1) {
          throw new Error(`版本不存在: ${versionId1}`)
        }
        
        if (!version2) {
          throw new Error(`版本不存在: ${versionId2}`)
        }
        
        // 简单模拟比较结果
        return {
          version1: {
            id: version1.id,
            versionNumber: version1.versionNumber,
            status: version1.status,
            queryText: version1.queryText,
            createdAt: version1.createdAt
          },
          version2: {
            id: version2.id,
            versionNumber: version2.versionNumber,
            status: version2.status,
            queryText: version2.queryText,
            createdAt: version2.createdAt
          },
          differences: {
            addedLines: [2, 3],
            removedLines: [1],
            changedLines: [4, 5]
          }
        }
      }
      
      // 调用实际API
      const response = await api.get(`/queries/${queryId}/versions/compare`, {
        params: { version1Id: versionId1, version2Id: versionId2 }
      })
      return response.data
    } catch (error) {
      console.error('Failed to compare versions:', error)
      throw new Error(getErrorMessage(error))
    }
  }
}