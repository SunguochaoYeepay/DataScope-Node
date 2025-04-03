import { Request, Response } from 'express';
import logger from '../../utils/logger';
import fs from 'fs';
import path from 'path';

/**
 * 用于开发/测试的查询计划模拟控制器
 */
class MockQueryPlanController {
  constructor() {
    // 绑定类方法
    this.getMockPlan = this.getMockPlan.bind(this);
    this.saveMockQueryPlan = this.saveMockQueryPlan.bind(this);
  }
  
  /**
   * 获取模拟的查询计划
   */
  public getMockPlan(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // 从文件加载模拟数据
        const testFile = path.join(process.cwd(), 'sqldump', 'testplan.json');
        if (!fs.existsSync(testFile)) {
          return res.status(404).json({
            success: false,
            message: '模拟数据不存在'
          });
        }
        
        const mockPlanData = fs.readFileSync(testFile, 'utf-8');
        const mockPlan = JSON.parse(mockPlanData);
        
        res.status(200).json({
          success: true,
          data: mockPlan
        });
        resolve();
      } catch (error: any) {
        logger.error('获取模拟查询计划失败', { error });
        res.status(500).json({
          success: false,
          message: '获取模拟查询计划失败',
          error: error.message
        });
        reject(error);
      }
    });
  }

  /**
   * 记录查询计划，用于调试
   */
  public saveMockQueryPlan(req: Request, res: Response): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const { planData } = req.body;
        
        if (!planData) {
          return res.status(400).json({
            success: false,
            message: '缺少planData'
          });
        }
        
        // 保存到文件
        const testFile = path.join(process.cwd(), 'sqldump', 'testplan.json');
        fs.writeFileSync(testFile, JSON.stringify({
          id: '123',
          planData: JSON.stringify(planData)
        }, null, 2));
        
        res.status(200).json({
          success: true,
          message: '查询计划已保存',
          planId: '123'
        });
        resolve();
      } catch (error: any) {
        logger.error('保存模拟查询计划失败', { error });
        res.status(500).json({
          success: false,
          message: '保存模拟查询计划失败',
          error: error.message
        });
        reject(error);
      }
    });
  }
}

export default new MockQueryPlanController(); 