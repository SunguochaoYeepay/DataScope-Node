/**
 * 查询计划服务类
 * 提供查询执行计划获取和比较功能
 */
import { DatabaseConnector } from '../types/connector';
import { QueryPlan } from '../types/query-plan';
interface PlanComparisonResult {
    summary: {
        costDifference: number;
        rowsDifference: number;
        plan1BottlenecksCount: number;
        plan2BottlenecksCount: number;
        improvement: boolean;
    };
    nodeComparison: Array<{
        table: string;
        rows: {
            plan1: number;
            plan2: number;
            difference: number;
        };
        filtered: {
            plan1: number;
            plan2: number;
            difference: number;
        };
        accessType: {
            plan1: string;
            plan2: string;
            improved: boolean;
        };
    }>;
    accessTypeChanges: Array<{
        table: string;
        from: string;
        to: string;
        improvement: boolean;
    }>;
    indexUsageChanges: Array<{
        table: string;
        from: string;
        to: string;
    }>;
}
export declare class QueryPlanService {
    /**
     * 获取SQL查询执行计划
     * @param connector 数据库连接器
     * @param sql SQL查询语句
     * @returns 查询执行计划
     */
    getQueryPlan(connector: DatabaseConnector, sql: string): Promise<QueryPlan>;
    /**
     * 比较两个查询执行计划
     * @param plan1 第一个查询执行计划
     * @param plan2 第二个查询执行计划
     * @returns 比较结果
     */
    comparePlans(plan1: QueryPlan, plan2: QueryPlan): PlanComparisonResult;
    /**
     * 分析查询执行计划并添加性能建议
     * @param plan 查询执行计划
     */
    private analyzePlan;
    /**
     * 判断访问类型是否有改进
     * @param oldType 旧访问类型
     * @param newType 新访问类型
     * @returns 是否改进
     */
    private isAccessTypeImprovement;
    /**
     * 计算查询计划中的瓶颈数量
     * @param plan 查询计划
     * @returns 瓶颈数量
     */
    private countBottlenecks;
}
export {};
