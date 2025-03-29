/**
 * MySQL查询优化器
 * 基于查询执行计划分析，生成优化建议和优化后的SQL查询
 */

import { QueryPlan } from '../../types/query-plan';
import logger from '../../utils/logger';

/**
 * 优化建议类型
 */
export interface OptimizationSuggestion {
  type: string;        // 建议类型，如 'index', 'rewrite', 'structure'
  priority: number;    // 优先级 1-5，5最高
  description: string; // 建议描述
  action: string;      // 建议操作
  impact: string;      // 预期影响
  example?: string;    // 示例代码
}

/**
 * MySQL查询优化器
 * 分析查询执行计划，提供SQL优化建议
 */
export class MySQLQueryOptimizer {
  /**
   * 分析SQL查询并生成优化建议
   * @param plan 查询执行计划
   * @param sql 原始SQL查询
   * @returns 优化建议数组
   */
  public analyzeSql(plan: QueryPlan, sql: string): OptimizationSuggestion[] {
    logger.debug('分析MySQL查询以生成优化建议', { query: sql });
    
    const suggestions: OptimizationSuggestion[] = [];
    
    // 从计划中提取优化提示
    if (plan.optimizationTips && plan.optimizationTips.length > 0) {
      // 将优化提示转换为优化建议
      for (const tip of plan.optimizationTips) {
        const suggestion = this.convertTipToSuggestion(tip);
        if (suggestion) {
          suggestions.push(suggestion);
        }
      }
    }
    
    // 分析SQL语句本身
    this.analyzeSqlStructure(sql, suggestions);
    
    // 分析性能特征
    if (plan.performanceAnalysis) {
      this.analyzePerformanceFeatures(plan, suggestions);
    }
    
    // 根据优先级排序
    return suggestions.sort((a, b) => b.priority - a.priority);
  }
  
  /**
   * 将优化提示转换为优化建议
   * @param tip 优化提示
   * @returns 优化建议
   */
  private convertTipToSuggestion(tip: string): OptimizationSuggestion | null {
    // 提取表名
    const tableMatch = tip.match(/表\s+(\w+)/);
    const table = tableMatch ? tableMatch[1] : '';
    
    // 根据提示内容分类处理
    if (tip.includes('添加索引')) {
      return {
        type: 'index',
        priority: 5,
        description: `为表 ${table} 添加索引`,
        action: '创建适当的索引以加速查询',
        impact: '可以显著减少扫描行数，提高查询性能',
        example: `ALTER TABLE ${table} ADD INDEX idx_column (column_name);`
      };
    }
    
    if (tip.includes('文件排序') || tip.includes('ORDER BY')) {
      return {
        type: 'index',
        priority: 4,
        description: '优化ORDER BY操作',
        action: '添加包含排序列的索引',
        impact: '避免文件排序操作，提高排序性能',
        example: `ALTER TABLE ${table} ADD INDEX idx_sort (sort_column1, sort_column2);`
      };
    }
    
    if (tip.includes('临时表')) {
      return {
        type: 'rewrite',
        priority: 4,
        description: '减少临时表使用',
        action: '优化GROUP BY子句或添加恰当的索引',
        impact: '减少内存压力，避免临时表溢出到磁盘',
        example: `-- 尝试下面的索引添加:\nALTER TABLE ${table} ADD INDEX idx_group (group_column);`
      };
    }
    
    if (tip.includes('连接顺序')) {
      return {
        type: 'rewrite',
        priority: 3,
        description: '优化表连接顺序',
        action: '重写查询，使用JOIN顺序提示',
        impact: '使小表先连接，减少中间结果集大小',
        example: `-- 使用STRAIGHT_JOIN强制连接顺序:\nSELECT STRAIGHT_JOIN ... FROM small_table JOIN large_table ...`
      };
    }
    
    if (tip.includes('简化查询') || tip.includes('复杂')) {
      return {
        type: 'structure',
        priority: 3,
        description: '简化复杂查询',
        action: '将复杂查询拆分为多个简单查询',
        impact: '更好的查询可读性和可维护性，可能提高性能',
        example: `-- 考虑创建视图或临时表:\nCREATE VIEW simple_view AS SELECT ... FROM ...;\nSELECT * FROM simple_view WHERE ...;`
      };
    }
    
    // 默认处理
    return {
      type: 'general',
      priority: 2,
      description: tip,
      action: '根据建议优化SQL',
      impact: '可能提高查询性能'
    };
  }
  
  /**
   * 分析SQL语句结构
   * @param sql SQL查询语句
   * @param suggestions 存放生成的建议
   */
  private analyzeSqlStructure(sql: string, suggestions: OptimizationSuggestion[]): void {
    const normalizedSql = sql.toLowerCase().trim();
    
    // 检查SELECT *
    if (normalizedSql.includes('select *')) {
      suggestions.push({
        type: 'rewrite',
        priority: 3,
        description: '避免使用SELECT *',
        action: '明确指定需要的列',
        impact: '减少IO和网络传输，提高查询性能',
        example: `-- 替换:\nSELECT * FROM table\n-- 使用:\nSELECT id, name, status FROM table`
      });
    }
    
    // 检查WHERE子句中的函数
    if (normalizedSql.includes('where') && 
        /where.*\w+\s*\(.*\)/.test(normalizedSql)) {
      suggestions.push({
        type: 'rewrite',
        priority: 4,
        description: '避免在WHERE子句中对列使用函数',
        action: '重写查询，将函数应用在右侧值上',
        impact: '允许使用索引，避免全表扫描',
        example: `-- 替换:\nWHERE YEAR(date_column) = 2023\n-- 使用:\nWHERE date_column BETWEEN '2023-01-01' AND '2023-12-31'`
      });
    }
    
    // 检查过多的JOIN
    const joinCount = (normalizedSql.match(/join/g) || []).length;
    if (joinCount > 3) {
      suggestions.push({
        type: 'structure',
        priority: 3,
        description: '查询包含过多的JOIN操作',
        action: '考虑拆分查询或使用临时表存储中间结果',
        impact: '简化查询执行计划，提高可维护性',
        example: `-- 创建临时表存储中间结果:\nCREATE TEMPORARY TABLE temp_results AS\nSELECT ... FROM table1 JOIN table2 ...;\n\n-- 然后在临时表上进行查询:\nSELECT ... FROM temp_results JOIN table3 ...;`
      });
    }
    
    // 检查OR语句
    if (normalizedSql.includes(' or ') && normalizedSql.includes('where')) {
      suggestions.push({
        type: 'rewrite',
        priority: 2,
        description: 'WHERE子句中使用了OR条件',
        action: '考虑使用UNION ALL替代OR，或确保OR两侧的列都有索引',
        impact: '优化器可能更好地利用索引',
        example: `-- 替换:\nSELECT * FROM table WHERE col1 = 'a' OR col2 = 'b'\n\n-- 使用:\nSELECT * FROM table WHERE col1 = 'a'\nUNION ALL\nSELECT * FROM table WHERE col2 = 'b' AND col1 != 'a'`
      });
    }
    
    // 检查是否使用了NOT IN
    if (normalizedSql.includes('not in')) {
      suggestions.push({
        type: 'rewrite',
        priority: 3,
        description: '使用了NOT IN子查询',
        action: '考虑使用LEFT JOIN或NOT EXISTS替代',
        impact: '通常性能更好，特别是当子查询返回NULL值时',
        example: `-- 替换:\nSELECT * FROM table1 WHERE id NOT IN (SELECT id FROM table2)\n\n-- 使用:\nSELECT table1.* FROM table1\nLEFT JOIN table2 ON table1.id = table2.id\nWHERE table2.id IS NULL`
      });
    }
    
    // 检查HAVING没有GROUP BY的情况
    if (normalizedSql.includes('having') && !normalizedSql.includes('group by')) {
      suggestions.push({
        type: 'rewrite',
        priority: 2,
        description: '使用了HAVING但没有GROUP BY',
        action: '如果可能，用WHERE替代HAVING',
        impact: 'WHERE在分组前过滤数据，性能通常更好',
        example: `-- 替换:\nSELECT col1, col2 FROM table HAVING col1 > 10\n\n-- 使用:\nSELECT col1, col2 FROM table WHERE col1 > 10`
      });
    }
  }
  
  /**
   * 分析性能特征
   * @param plan 查询执行计划
   * @param suggestions 存放生成的建议
   */
  private analyzePerformanceFeatures(plan: QueryPlan, suggestions: OptimizationSuggestion[]): void {
    if (!plan.performanceAnalysis) return;
    
    // 分析瓶颈
    if (plan.performanceAnalysis.bottlenecks && plan.performanceAnalysis.bottlenecks.length > 0) {
      // 已经在转换提示中处理了瓶颈，这里可以添加额外的定制建议
    }
    
    // 分析索引使用情况
    if (plan.performanceAnalysis.indexUsage) {
      const indexIssues = plan.performanceAnalysis.indexUsage;
      if (Array.isArray(indexIssues) && indexIssues.length > 0) {
        for (const issue of indexIssues) {
          if (issue.effectiveness < 30) {
            suggestions.push({
              type: 'index',
              priority: 4,
              description: `索引效率低(${issue.effectiveness}%)`,
              action: `考虑为表 ${issue.table} 优化或重建索引 ${issue.index}`,
              impact: '提高索引选择性，减少扫描行数'
            });
          }
        }
      }
    }
    
    // 分析连接操作
    if (plan.performanceAnalysis.joinAnalysis && plan.performanceAnalysis.joinAnalysis.length > 0) {
      const joinIssues = plan.performanceAnalysis.joinAnalysis;
      
      // 检查是否有通过相同大小的表
      const hasSizableTables = joinIssues.some(join => join.tables.length > 1 && join.joinType === 'inefficient');
      
      if (hasSizableTables) {
        suggestions.push({
          type: 'structure',
          priority: 4,
          description: '连接大表时使用了低效的连接策略',
          action: '考虑改进表结构或添加数据分区',
          impact: '减少处理数据量，提高连接性能',
          example: '-- 考虑对频繁连接的大表进行分区:\nALTER TABLE large_table PARTITION BY RANGE(column_name) (...)'
        });
      }
    }
  }
  
  /**
   * 根据优化建议生成优化后的SQL查询
   * @param originalSql 原始SQL查询
   * @param suggestions 优化建议
   * @returns 优化后的SQL查询
   */
  public generateOptimizedSql(originalSql: string, suggestions: OptimizationSuggestion[]): string {
    // 这个方法实现自动SQL重写非常复杂，需要SQL解析器和更深入的查询分析
    // 这里提供一个示例实现，仅适用于简单情况
    
    let optimizedSql = originalSql;
    
    try {
      const normalizedSql = originalSql.toLowerCase();
      
      // 根据建议类型进行简单的替换
      for (const suggestion of suggestions) {
        // 处理SELECT *
        if (suggestion.type === 'rewrite' && suggestion.description.includes('避免使用SELECT *') &&
            normalizedSql.includes('select *')) {
          // 这是一个非常简化的实现，实际中需要SQL解析和语法树分析
          // 不尝试自动替换列名，因为需要了解表结构
          optimizedSql = optimizedSql.replace(/SELECT\s+\*/i, '/* 建议: 明确指定需要的列 */ SELECT *');
        }
        
        // 添加索引提示
        if (suggestion.type === 'index' && suggestion.description.includes('添加索引')) {
          // 提取表名和可能的列名
          const tableMatch = suggestion.description.match(/表\s+(\w+)/);
          if (tableMatch && tableMatch[1]) {
            const table = tableMatch[1];
            
            // 如果查询中包含该表，添加USE INDEX提示
            const tablePattern = new RegExp(`\\b${table}\\b`, 'i');
            if (tablePattern.test(optimizedSql)) {
              // 查找表后的第一个空格
              const tableIndex = optimizedSql.search(tablePattern);
              const afterTableIndex = tableIndex + table.length;
              
              // 添加注释提示
              optimizedSql = optimizedSql.substring(0, afterTableIndex) + 
                            ' /* 建议: 添加适当的索引，或使用FORCE INDEX */ ' + 
                            optimizedSql.substring(afterTableIndex);
            }
          }
        }
        
        // 处理JOIN顺序
        if (suggestion.type === 'rewrite' && suggestion.description.includes('优化表连接顺序') &&
            normalizedSql.includes(' join ')) {
          optimizedSql = optimizedSql.replace(/SELECT/i, 'SELECT /* 建议: 使用STRAIGHT_JOIN控制连接顺序 */');
        }
        
        // 处理WHERE子句中的函数
        if (suggestion.type === 'rewrite' && suggestion.description.includes('避免在WHERE子句中对列使用函数')) {
          optimizedSql = optimizedSql.replace(/WHERE/i, 'WHERE /* 建议: 避免在WHERE子句中对列使用函数 */');
        }
      }
      
      return optimizedSql;
    } catch (error) {
      logger.error('生成优化SQL失败', { error });
      return originalSql; // 出错时返回原始SQL
    }
  }
}