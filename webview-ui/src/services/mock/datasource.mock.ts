// 获取数据源统计信息
getDataSourceStats: async (id: string): Promise<DataSourceStats> => {
  // 延迟200-500ms模拟网络请求
  await delay(Math.random() * 300 + 200)

  // 查找数据源
  const dataSource = mockDatabase.find(ds => ds.id === id)
  if (!dataSource) {
    throw new Error('数据源不存在')
  }

  // 模拟统计数据 - 随机生成
  return {
    dataSourceId: id,
    tablesCount: Math.floor(Math.random() * 50) + 5,
    viewsCount: Math.floor(Math.random() * 10) + 1,
    totalRows: Math.floor(Math.random() * 1000000) + 1000,
    totalSize: `${(Math.random() * 100 + 10).toFixed(2)} MB`,
    lastUpdate: new Date().toISOString(),
    queriesCount: Math.floor(Math.random() * 500) + 10,
    connectionPoolSize: Math.floor(Math.random() * 10) + 5,
    activeConnections: Math.floor(Math.random() * 5) + 1,
    avgQueryTime: `${(Math.random() * 100 + 10).toFixed(2)}ms`,
    // 添加缺失的字段
    totalTables: Math.floor(Math.random() * 50) + 5,
    totalViews: Math.floor(Math.random() * 10) + 1,
    totalQueries: Math.floor(Math.random() * 500) + 10,
    avgResponseTime: Math.floor(Math.random() * 100) + 10,
    peakConnections: Math.floor(Math.random() * 20) + 5
  }
}, 