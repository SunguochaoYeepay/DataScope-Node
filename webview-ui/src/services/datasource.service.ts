  async updateDataSourceStatus(id: string, status: string, message?: string): Promise<DataSource> {
    try {
      logger.info(`更新数据源状态: ID=${id}, 状态=${status}, 错误消息=${message || 'none'}`);
      // 检查数据源是否存在
      const dataSource = await prisma.dataSource.findUnique({
        where: { id }
      })

      if (!dataSource) {
        throw new DataSourceError(`数据源 ID ${id} 不存在`, 404)
      }

      // 更新数据源状态
      const updatedDataSource = await prisma.dataSource.update({
        where: { id },
        data: { 
          status: status as DataSourceStatus,
          statusMessage: message
        }
      })

      return updatedDataSource
    } catch (error) {
      logger.error(`更新数据源状态失败:`, error)
      throw new DataSourceError(
        error instanceof Error ? error.message : '更新数据源状态失败',
        error instanceof DataSourceError ? error.statusCode : 500
      )
    }
  } 