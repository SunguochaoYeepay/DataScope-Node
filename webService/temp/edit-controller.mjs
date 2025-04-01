// 修改controller.js文件
import { replaceInFile } from 'replace-in-file';

const options = {
  files: 'src/api/controllers/query.controller.ts',
  from: /async getQueryHistory\(req: Request, res: Response, next: NextFunction\) {[\s\S]*?const { dataSourceId, limit, offset } = req\.query;[\s\S]*?data: result[\s\S]*?};[\s\S]*?} catch \(error: any\) {[\s\S]*?next\(error\);[\s\S]*?}/,
  to: `async getQueryHistory(req: Request, res: Response, next: NextFunction) {
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
  }`,
};

async function run() {
  try {
    const results = await replaceInFile(options);
    console.log('Replacement results:', results);
  } catch (error) {
    console.error('Error occurred:', error);
  }
}

run();