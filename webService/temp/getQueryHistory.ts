  /**
   * 获取查询历史记录
   */
  async getQueryHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const { dataSourceId, limit, offset, page, size } = req.query;
      
      // 优先使用limit和offset参数
      let finalLimit = limit ? Number(limit) : (size ? Number(size) : 20);
      let finalOffset = offset ? Number(offset) : 0;
      
      // 如果提供了page和size，但没有提供limit和offset，则从page和size计算
      if (!limit && !offset && page) {
        const pageNum = Number(page);
        const sizeNum = size ? Number(size) : 20;
        finalOffset = (pageNum - 1) * sizeNum;
        finalLimit = sizeNum;
      }
      
      const result = await queryService.getQueryHistory(
        dataSourceId as string,
        finalLimit,
        finalOffset
      );
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error: any) {
      next(error);
    }
  }