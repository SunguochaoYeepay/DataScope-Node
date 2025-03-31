/**
 * @param status 新状态 ('ACTIVE' | 'INACTIVE' | 'ERROR' | 'SYNCING')
 * @param errorMessage 可选的错误消息
 * @returns 更新后的数据源
 */
async updateDataSourceStatus(id: string, status: string, message?: string): Promise<DataSource> {
  try {
    // 检查数据源是否存在
    const dataSource = await prisma.dataSource.findUnique({
      where: { id }
    });
    
    if (!dataSource) {
      throw new ApiError('数据源不存在', 404);
    }
    
    // 更新状态和消息
    const updatedDataSource = await prisma.dataSource.update({
      where: { id },
      data: {
        status,
        errorMessage: message
      }
    });
    
    logger.info(`数据源状态已更新: ${id}, 新状态: ${status}`);
    return updatedDataSource;
  } catch (error: any) {
    logger.error(`更新数据源状态失败: ${id}`, { error });
    throw new ApiError(`更新数据源状态失败: ${error.message}`, 500);
  }
}
}

// 创建并导出服务实例
const dataSourceService = new DataSourceService();
export default dataSourceService; 