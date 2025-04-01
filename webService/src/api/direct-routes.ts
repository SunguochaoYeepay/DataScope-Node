import { Application, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import mockQueryPlanController from './controllers/mock-query-plan.controller';
import planVisualizationController from './controllers/plan-visualization.controller';

/**
 * 注册直接路由，不通过路由文件
 * @param app Express应用实例
 */
export function registerDirectRoutes(app: Application): void {
  // 模拟查询计划API
  app.get('/api/mock-plan', mockQueryPlanController.getMockPlan);
  app.post('/api/mock-plan', mockQueryPlanController.saveMockQueryPlan);
  
  // 创建测试数据
  app.get('/api/setup-test', async (req: Request, res: Response) => {
    try {
      // 创建测试目录
      const testDir = path.join(process.cwd(), 'sqldump');
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
      }
      
      // 创建示例计划数据
      const testPlan = {
        id: '123',
        planData: JSON.stringify({
          planNodes: [
            {id: 1, table: 'users', type: 'index', rows: 100, filtered: 100, key: 'PRIMARY', extra: ''},
            {id: 2, table: 'orders', type: 'ALL', rows: 1500, filtered: 80, key: '', extra: 'Using filesort'}
          ],
          estimatedCost: 300,
          warnings: [],
          optimizationTips: ['考虑为orders表添加索引']
        })
      };
      
      // 保存到文件
      const testFile = path.join(testDir, 'testplan.json');
      fs.writeFileSync(testFile, JSON.stringify(testPlan, null, 2));
      
      res.status(200).json({
        success: true,
        message: '测试环境已准备',
        testplan: '123',
        testRoutes: [
          '/api/mock-plan',
          '/api/plan-visualization/123'
        ]
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: '创建测试环境失败',
        error: error.message
      });
    }
  });
  
  // 测试直接调用可视化控制器
  app.get('/api/test-visual/:planId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.params.planId = '123'; // 强制使用测试ID
      await planVisualizationController.getVisualizationData(req, res, next);
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: '测试可视化失败',
        error: error.message
      });
    }
  });
} 