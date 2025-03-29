import { DatabaseConnector } from '../../services/database/dbInterface';
import { QueryPlan } from '../../types/query-plan';

/**
 * 查询计划服务
 * 负责管理和获取数据库查询执行计划
 */
export class QueryPlanService {
  /**
   * 从数据库连接器获取查询执行计划
   * @param connector 数据库连接器
   * @param sql SQL查询语句
   * @param params 查询参数
   * @returns 查询执行计划
   */
  async getQueryPlan(connector: DatabaseConnector, sql: string, params: any[] = []): Promise<QueryPlan> {
    return await connector.explainQuery(sql, params) as QueryPlan;
  }
  
  /**
   * 分析查询执行计划并提取关键信息
   * @param plan 查询执行计划
   * @returns 查询执行计划关键信息
   */
  extractPlanSummary(plan: QueryPlan): any {
    return {
      tablesScanned: this.getTablesScanned(plan),
      totalRows: plan.estimatedRows,
      estimatedCost: plan.estimatedCost,
      optimizationTips: plan.optimizationTips,
      // 提取是否使用了索引
      usesIndexes: this.checkIfUsesIndexes(plan),
      // 是否使用了临时表
      usesTemporaryTable: this.checkIfUsesTemporaryTable(plan),
      // 是否使用了文件排序
      usesFileSort: this.checkIfUsesFileSort(plan)
    };
  }
  
  /**
   * 获取执行计划中的表列表
   */
  private getTablesScanned(plan: QueryPlan): string[] {
    const tables = new Set<string>();
    
    for (const node of plan.planNodes) {
      if (node.table) {
        tables.add(node.table);
      }
    }
    
    return Array.from(tables);
  }
  
  /**
   * 检查执行计划是否使用了索引
   */
  private checkIfUsesIndexes(plan: QueryPlan): boolean {
    return plan.planNodes.some(node => node.key && node.key !== 'NULL');
  }
  
  /**
   * 检查执行计划是否使用了临时表
   */
  private checkIfUsesTemporaryTable(plan: QueryPlan): boolean {
    return plan.planNodes.some(node => node.extra && node.extra.includes('Using temporary'));
  }
  
  /**
   * 检查执行计划是否使用了文件排序
   */
  private checkIfUsesFileSort(plan: QueryPlan): boolean {
    return plan.planNodes.some(node => node.extra && node.extra.includes('Using filesort'));
  }
}