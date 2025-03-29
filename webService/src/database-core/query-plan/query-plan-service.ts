import { DatabaseConnector } from '../../services/database/dbInterface';
import { QueryPlan } from '../../types/query-plan';
import { MySQLPlanAnalyzer } from './mysql-plan-analyzer';
import { DatabaseType } from '../../types/datasource';
import logger from '../../utils/logger';

/**
 * 查询计划服务
 * 负责管理和获取数据库查询执行计划
 */
export class QueryPlanService {
  private analyzers: Map<DatabaseType, any>;

  constructor() {
    // 初始化不同数据库类型的分析器
    this.analyzers = new Map();
    this.analyzers.set(DatabaseType.MYSQL, new MySQLPlanAnalyzer());
    // 将来可以添加其他数据库类型的分析器
    // this.analyzers.set(DatabaseType.POSTGRESQL, new PostgreSQLPlanAnalyzer());
  }

  /**
   * 从数据库连接器获取查询执行计划
   * @param connector 数据库连接器
   * @param databaseType 数据库类型
   * @param sql SQL查询语句
   * @param params 查询参数
   * @returns 查询执行计划
   */
  async getQueryPlan(connector: DatabaseConnector, databaseType: DatabaseType, sql: string, params: any[] = []): Promise<QueryPlan> {
    // 获取原始查询计划
    const plan = await connector.explainQuery(sql, params) as QueryPlan;
    
    try {
      // 丰富查询计划，添加优化建议
      await this.enhanceQueryPlan(plan, databaseType);
    } catch (error) {
      // 如果增强过程出错，记录日志但继续使用原始计划
      logger.error('增强查询计划失败', { error, sql });
    }
    
    return plan;
  }
  
  /**
   * 分析查询执行计划并提取关键信息
   * @param plan 查询执行计划
   * @param databaseType 数据库类型
   * @returns 查询执行计划关键信息
   */
  extractPlanSummary(plan: QueryPlan, databaseType: DatabaseType = DatabaseType.MYSQL): any {
    // 获取对应数据库类型的分析器
    const analyzer = this.getAnalyzerForType(databaseType);
    if (analyzer) {
      return analyzer.analyzePerformance(plan);
    }
    
    // 如果没有找到对应分析器，使用基本分析
    return {
      tablesScanned: this.getTablesFromPlan(plan),
      totalRows: plan.estimatedRows,
      estimatedCost: plan.estimatedCost,
      optimizationTips: plan.optimizationTips || []
    };
  }
  
  /**
   * 获取针对特定查询的优化建议
   * @param plan 查询执行计划
   * @param databaseType 数据库类型
   * @returns 优化建议列表
   */
  getOptimizationSuggestions(plan: QueryPlan, databaseType: DatabaseType = DatabaseType.MYSQL): string[] {
    const analyzer = this.getAnalyzerForType(databaseType);
    if (analyzer) {
      return analyzer.provideOptimizationSuggestions(plan);
    }
    return plan.optimizationTips || [];
  }
  
  /**
   * 增强查询计划，添加更多分析信息
   * @param plan 原始查询计划
   * @param databaseType 数据库类型
   */
  private async enhanceQueryPlan(plan: QueryPlan, databaseType: DatabaseType): Promise<void> {
    const analyzer = this.getAnalyzerForType(databaseType);
    if (!analyzer) return;
    
    // 确保optimizationTips存在
    if (!plan.optimizationTips) {
      plan.optimizationTips = [];
    }
    
    // 如果优化建议为空，使用分析器生成
    if (plan.optimizationTips.length === 0) {
      plan.optimizationTips = analyzer.provideOptimizationSuggestions(plan);
    }
    
    // 添加性能分析结果
    plan.performanceAnalysis = analyzer.analyzePerformance(plan);
  }
  
  /**
   * 获取特定数据库类型的分析器
   * @param databaseType 数据库类型
   */
  private getAnalyzerForType(databaseType: DatabaseType): any {
    return this.analyzers.get(databaseType);
  }
  
  /**
   * 从计划中提取表名列表
   */
  private getTablesFromPlan(plan: QueryPlan): string[] {
    const tables = new Set<string>();
    
    for (const node of plan.planNodes) {
      if (node.table) {
        tables.add(node.table);
      }
    }
    
    return Array.from(tables);
  }
}