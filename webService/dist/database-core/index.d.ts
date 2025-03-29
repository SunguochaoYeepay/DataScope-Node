/**
 * 数据库核心功能入口文件
 * 提供获取查询计划转换器、分析器和优化器的工厂函数
 */
import { DatabaseType } from '../types/database';
/**
 * 查询计划转换器接口
 */
export interface QueryPlanConverter {
    /**
     * 转换传统格式的EXPLAIN结果
     */
    convertTraditionalExplain(explainResult: any, query: string): any;
    /**
     * 转换JSON格式的EXPLAIN结果
     */
    convertJsonExplain(explainJsonResult: any, query: string): any;
}
/**
 * 查询计划分析器接口
 */
export interface QueryPlanAnalyzer {
    /**
     * 分析查询计划
     */
    analyze(queryPlan: any): any;
    /**
     * 获取优化建议
     */
    getOptimizationTips(queryPlan: any): string[];
}
/**
 * 查询优化器接口
 */
export interface QueryOptimizer {
    /**
     * 分析SQL并提供优化建议
     */
    analyzeSql(queryPlan: any, sql: string): any[];
    /**
     * 生成优化后的SQL
     */
    generateOptimizedSql(sql: string, suggestions: any[]): string;
}
/**
 * 获取查询计划转换器
 * @param dbType 数据库类型
 * @returns 查询计划转换器实例
 */
export declare function getQueryPlanConverter(dbType: DatabaseType): QueryPlanConverter;
/**
 * 获取查询计划分析器
 * @param dbType 数据库类型
 * @returns 查询计划分析器实例
 */
export declare function getQueryPlanAnalyzer(dbType: DatabaseType): QueryPlanAnalyzer;
/**
 * 获取SQL查询优化器
 * @param dbType 数据库类型
 * @returns SQL查询优化器实例
 */
export declare function getQueryOptimizer(dbType: DatabaseType): QueryOptimizer;
