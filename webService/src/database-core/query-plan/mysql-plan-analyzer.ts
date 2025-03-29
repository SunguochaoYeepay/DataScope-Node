import { QueryPlan, QueryPlanNode } from '../../types/query-plan';
import logger from '../../utils/logger';

/**
 * MySQL查询计划分析器
 * 分析MySQL执行计划并提供优化建议
 */

/**
 * 性能关注点类型
 */
type PerformanceConcern = {
  severity: 'high' | 'medium' | 'low';
  type: string;
  description: string;
  suggestedAction: string;
};

/**
 * 性能分析结果
 */
type PerformanceAnalysis = {
  bottlenecks: PerformanceConcern[];
  indexUsage: {
    missingIndexes: PerformanceConcern[];
    inefficientIndexes: PerformanceConcern[];
  };
  joinAnalysis: PerformanceConcern[];
};

export class MySQLPlanAnalyzer {
  /**
   * 分析MySQL查询执行计划
   * @param plan 查询执行计划
   * @returns 带有分析结果的查询执行计划
   */
  public analyze(plan: QueryPlan): QueryPlan {
    logger.debug('开始分析MySQL查询执行计划');
    
    try {
      // 确保计划包含节点
      if (!plan.planNodes || plan.planNodes.length === 0) {
        plan.warnings = ['无法分析空的执行计划'];
        plan.optimizationTips = ['请确保查询语法正确'];
        return plan;
      }
      
      // 初始化警告和优化提示数组
      if (!plan.warnings) plan.warnings = [];
      if (!plan.optimizationTips) plan.optimizationTips = [];
      
      // 分析性能问题
      const performanceIssues = this.analyzePerformanceConcerns(plan);
      
      // 更新计划的警告和优化提示
      this.updatePlanWithAnalysisResults(plan, performanceIssues);
      
      // 更新计划的估算成本和行数
      this.updatePlanEstimates(plan);
      
      logger.debug('MySQL查询执行计划分析完成', { 
        warnings: plan.warnings?.length || 0,
        tips: plan.optimizationTips?.length || 0
      });
      
      return plan;
    } catch (error) {
      logger.error('分析MySQL查询执行计划时出错', { error });
      
      // 确保返回至少包含警告信息
      if (!plan.warnings) plan.warnings = [];
      if (!plan.optimizationTips) plan.optimizationTips = [];
      
      plan.warnings.push('分析执行计划时发生错误');
      plan.optimizationTips.push('请检查查询语法和执行计划格式');
      
      return plan;
    }
  }
  
  /**
   * 分析性能关注点
   * @param plan 查询执行计划
   * @returns 性能分析结果
   */
  private analyzePerformanceConcerns(plan: QueryPlan): PerformanceAnalysis {
    const analysis: PerformanceAnalysis = {
      bottlenecks: [],
      indexUsage: {
        missingIndexes: [],
        inefficientIndexes: []
      },
      joinAnalysis: []
    };
    
    // 检查全表扫描
    this.checkFullTableScans(plan, analysis);
    
    // 检查文件排序和临时表使用
    this.checkFileSortAndTemporaryTables(plan, analysis);
    
    // 检查索引使用情况
    this.checkIndexUsage(plan, analysis);
    
    // 检查连接操作
    this.checkJoinOperations(plan, analysis);
    
    return analysis;
  }
  
  /**
   * 检查全表扫描
   * @param plan 查询执行计划
   * @param analysis 性能分析结果
   */
  private checkFullTableScans(plan: QueryPlan, analysis: PerformanceAnalysis): void {
    if (!plan.planNodes) return;
    
    for (const node of plan.planNodes) {
      if (node.type === 'ALL' && node.rows > 1000) {
        analysis.bottlenecks.push({
          severity: node.rows > 10000 ? 'high' : 'medium',
          type: 'full_table_scan',
          description: `表 ${node.table} 执行全表扫描，扫描 ${node.rows} 行`,
          suggestedAction: '考虑为查询条件添加合适的索引'
        });
      }
    }
  }
  
  /**
   * 检查文件排序和临时表使用
   * @param plan 查询执行计划
   * @param analysis 性能分析结果
   */
  private checkFileSortAndTemporaryTables(plan: QueryPlan, analysis: PerformanceAnalysis): void {
    if (!plan.planNodes) return;
    
    for (const node of plan.planNodes) {
      if (node.extra && node.extra.includes('Using filesort')) {
        analysis.bottlenecks.push({
          severity: node.rows > 1000 ? 'high' : 'medium',
          type: 'filesort',
          description: `表 ${node.table} 使用文件排序，可能影响性能`,
          suggestedAction: '考虑添加包含排序列的索引或优化ORDER BY子句'
        });
      }
      
      if (node.extra && node.extra.includes('Using temporary')) {
        analysis.bottlenecks.push({
          severity: node.rows > 1000 ? 'high' : 'medium',
          type: 'temporary_table',
          description: `表 ${node.table} 使用临时表，可能导致内存压力`,
          suggestedAction: '优化GROUP BY子句或考虑添加合适的索引'
        });
      }
    }
  }
  
  /**
   * 检查索引使用情况
   * @param plan 查询执行计划
   * @param analysis 性能分析结果
   */
  private checkIndexUsage(plan: QueryPlan, analysis: PerformanceAnalysis): void {
    if (!plan.planNodes) return;
    
    for (const node of plan.planNodes) {
      // 检查可能但未使用的索引
      if (node.possibleKeys && !node.key) {
        analysis.indexUsage.inefficientIndexes.push({
          severity: 'medium',
          type: 'unused_index',
          description: `表 ${node.table} 有可用索引但未使用`,
          suggestedAction: '检查WHERE子句或考虑添加FORCE INDEX提示'
        });
      }
      
      // 检查索引扫描但过滤率低的情况
      if (node.key && node.filtered !== undefined && node.filtered < 20 && node.rows > 100) {
        analysis.indexUsage.inefficientIndexes.push({
          severity: 'medium',
          type: 'low_filter_rate',
          description: `表 ${node.table} 使用索引 ${node.key} 但过滤率低 (${node.filtered}%)`,
          suggestedAction: '优化WHERE条件或创建更适合的复合索引'
        });
      }
      
      // 检查缺失索引
      if (!node.key && node.type === 'ALL' && node.rows > 100) {
        analysis.indexUsage.missingIndexes.push({
          severity: 'high',
          type: 'missing_index',
          description: `表 ${node.table} 缺少适用于此查询的索引`,
          suggestedAction: '根据WHERE条件和连接字段创建合适的索引'
        });
      }
    }
  }
  
  /**
   * 检查连接操作
   * @param plan 查询执行计划
   * @param analysis 性能分析结果
   */
  private checkJoinOperations(plan: QueryPlan, analysis: PerformanceAnalysis): void {
    // 检测嵌套循环连接
    if (!plan.planNodes || plan.planNodes.length <= 1) return;
    
    // 连接性能问题的检测
    for (let i = 1; i < plan.planNodes.length; i++) {
      const node = plan.planNodes[i];
      
      // 检查连接类型是否低效
      if (['ALL', 'index'].includes(node.type)) {
        analysis.joinAnalysis.push({
          severity: 'high',
          type: 'inefficient_join',
          description: `表 ${node.table} 使用低效的连接方式`,
          suggestedAction: '为连接条件添加索引或重新组织查询'
        });
      }
      
      // 检查连接顺序是否合理 (小表应该在内层)
      const prevNode = plan.planNodes[i - 1];
      if (prevNode.rows < node.rows * 0.1) {
        analysis.joinAnalysis.push({
          severity: 'medium',
          type: 'join_order',
          description: `连接顺序可能不够优化，小表 ${prevNode.table} 应该在内层`,
          suggestedAction: '考虑使用JOIN_FIXED_ORDER或STRAIGHT_JOIN提示调整连接顺序'
        });
      }
    }
  }
  
  /**
   * 使用分析结果更新计划的警告和优化提示
   * @param plan 查询执行计划
   * @param analysis 性能分析结果
   */
  private updatePlanWithAnalysisResults(plan: QueryPlan, analysis: PerformanceAnalysis): void {
    if (!plan.warnings) plan.warnings = [];
    
    // 添加瓶颈警告
    for (const bottleneck of analysis.bottlenecks) {
      plan.warnings.push(`${bottleneck.severity.toUpperCase()}: ${bottleneck.description}`);
    }
    
    // 添加索引使用警告
    for (const missingIndex of analysis.indexUsage.missingIndexes) {
      plan.warnings.push(`${missingIndex.severity.toUpperCase()}: ${missingIndex.description}`);
    }
    
    for (const inefficientIndex of analysis.indexUsage.inefficientIndexes) {
      plan.warnings.push(`${inefficientIndex.severity.toUpperCase()}: ${inefficientIndex.description}`);
    }
    
    // 添加连接分析警告
    for (const joinIssue of analysis.joinAnalysis) {
      plan.warnings.push(`${joinIssue.severity.toUpperCase()}: ${joinIssue.description}`);
    }
    
    // 汇总优化建议
    this.addOptimizationTips(plan, analysis);
    
    // 添加性能分析结果到计划
    plan.performanceAnalysis = {
      bottlenecks: analysis.bottlenecks,
      indexUsage: analysis.indexUsage,
      joinAnalysis: analysis.joinAnalysis
    };
  }
  
  /**
   * 添加优化提示
   * @param plan 查询执行计划
   * @param analysis 性能分析结果
   */
  private addOptimizationTips(plan: QueryPlan, analysis: PerformanceAnalysis): void {
    if (!plan.optimizationTips) plan.optimizationTips = [];
    if (!plan.warnings) plan.warnings = [];
    
    // 汇总所有建议
    const allSuggestions = [
      ...analysis.bottlenecks.map(item => item.suggestedAction),
      ...analysis.indexUsage.missingIndexes.map(item => item.suggestedAction),
      ...analysis.indexUsage.inefficientIndexes.map(item => item.suggestedAction),
      ...analysis.joinAnalysis.map(item => item.suggestedAction)
    ];
    
    // 去重
    const uniqueSuggestions = [...new Set(allSuggestions)];
    
    // 添加到计划
    plan.optimizationTips.push(...uniqueSuggestions);
    
    // 添加通用优化建议
    if (plan.warnings.length > 0) {
      plan.optimizationTips.push('考虑使用EXPLAIN ANALYZE获取更详细的执行信息');
    }
    
    // 如果没有任何问题，添加正面反馈
    if (plan.warnings.length === 0 && plan.optimizationTips.length === 0) {
      plan.optimizationTips.push('查询执行计划看起来已经优化得很好');
    }
  }
  
  /**
   * 更新计划的估算成本和行数
   * @param plan 查询执行计划
   */
  private updatePlanEstimates(plan: QueryPlan): void {
    if (!plan.planNodes) return;
    
    // 更新估算行数（如果未设置）
    if (!plan.estimatedRows) {
      plan.estimatedRows = plan.planNodes.reduce((sum, node) => sum + node.rows, 0);
    }
    
    // 估算成本（如果未设置）
    if (!plan.estimatedCost) {
      // 基本成本基于总行数
      let cost = plan.estimatedRows || 0;
      
      // 根据警告增加成本系数
      const warningCount = plan.warnings?.length || 0;
      if (warningCount > 0) {
        // 每个警告增加10%的成本
        cost *= (1 + (warningCount * 0.1));
      }
      
      // 根据临时表和文件排序情况调整成本
      const tempTableCount = plan.planNodes.filter(
        node => node.extra && node.extra.includes('Using temporary')
      ).length;
      
      const fileSortCount = plan.planNodes.filter(
        node => node.extra && node.extra.includes('Using filesort')
      ).length;
      
      // 临时表增加50%的成本
      cost *= (1 + (tempTableCount * 0.5));
      
      // 文件排序增加30%的成本
      cost *= (1 + (fileSortCount * 0.3));
      
      plan.estimatedCost = Math.round(cost);
    }
  }
}