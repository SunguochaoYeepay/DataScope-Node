// 修复查询历史API的分页参数处理
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/api/controllers/query.controller.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 定义要查找的方法模式
const methodPattern = /async getQueryHistory\(req: Request, res: Response, next: NextFunction\) {[^}]*}/s;

// 新的方法实现
const newMethod = `async getQueryHistory(req: Request, res: Response, next: NextFunction) {
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
  }`;

// 替换方法实现
const modifiedContent = content.replace(methodPattern, newMethod);

// 写回文件
fs.writeFileSync(filePath, modifiedContent, 'utf8');

console.log('已更新 getQueryHistory 方法');