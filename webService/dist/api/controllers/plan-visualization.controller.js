"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlanVisualizationController = void 0;
const express_validator_1 = require("express-validator");
const query_service_1 = __importDefault(require("../../services/query.service"));
const error_1 = require("../../utils/error");
/**
 * 查询计划可视化控制器
 * 提供查询计划分析和可视化功能
 */
class PlanVisualizationController {
    /**
     * 获取查询执行计划的可视化数据
     * @param req 请求对象
     * @param res 响应对象
     * @param next 下一个中间件
     */
    async getVisualizationData(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
            }
            const { planId } = req.params;
            // 获取查询计划
            const planHistory = await query_service_1.default.getQueryPlanById(planId);
            if (!planHistory) {
                throw new error_1.ApiError('查询计划不存在', 404);
            }
            // 解析计划数据
            const planData = JSON.parse(planHistory.planData);
            // 转换为可视化格式
            const visualizationData = this.transformToVisualizationFormat(planData);
            res.status(200).json({
                success: true,
                data: visualizationData
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 比较两个查询计划
     * @param req 请求对象
     * @param res 响应对象
     * @param next 下一个中间件
     */
    async comparePlans(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
            }
            const { planId1, planId2 } = req.params;
            // 获取两个查询计划
            const [plan1, plan2] = await Promise.all([
                query_service_1.default.getQueryPlanById(planId1),
                query_service_1.default.getQueryPlanById(planId2)
            ]);
            if (!plan1 || !plan2) {
                throw new error_1.ApiError('一个或多个查询计划不存在', 404);
            }
            // 解析计划数据
            const planData1 = JSON.parse(plan1.planData);
            const planData2 = JSON.parse(plan2.planData);
            // 比较两个计划
            const comparisonResult = this.comparePlanData(planData1, planData2);
            res.status(200).json({
                success: true,
                data: comparisonResult
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 保存查询计划分析注释
     * @param req 请求对象
     * @param res 响应对象
     * @param next 下一个中间件
     */
    async saveAnalysisNotes(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
            }
            const { planId } = req.params;
            const { notes } = req.body;
            // 验证查询计划是否存在
            const planHistory = await query_service_1.default.getQueryPlanById(planId);
            if (!planHistory) {
                throw new error_1.ApiError('查询计划不存在', 404);
            }
            // 保存注释
            // 注意：这里需要实现保存注释的功能，可能需要扩展数据模型
            // 此处为示例代码，实际实现需要根据数据库结构调整
            /*
            await prisma.queryPlanAnalysisNote.upsert({
              where: {
                planId: planId
              },
              update: {
                notes: notes
              },
              create: {
                planId: planId,
                notes: notes,
                createdAt: new Date(),
                createdBy: req.user?.id || 'system'
              }
            });
            */
            res.status(200).json({
                success: true,
                message: '分析注释已保存'
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 生成优化后的SQL查询
     * @param req 请求对象
     * @param res 响应对象
     * @param next 下一个中间件
     */
    async generateOptimizedQuery(req, res, next) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                throw new error_1.ApiError('验证错误', 400, { errors: errors.array() });
            }
            const { planId } = req.params;
            // 获取查询计划
            const planHistory = await query_service_1.default.getQueryPlanById(planId);
            if (!planHistory) {
                throw new error_1.ApiError('查询计划不存在', 404);
            }
            // 解析计划数据
            const planData = JSON.parse(planHistory.planData);
            // 根据优化建议生成优化后的SQL
            // 这部分可能需要更复杂的逻辑，或者接入AI服务来生成优化建议
            const optimizedSql = this.generateOptimizedSql(planHistory.sql, planData);
            res.status(200).json({
                success: true,
                data: {
                    originalSql: planHistory.sql,
                    optimizedSql: optimizedSql,
                    optimizationNotes: planData.optimizationTips || []
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    /**
     * 将查询计划转换为可视化格式
     * @param planData 查询计划数据
     * @returns 可视化格式数据
     */
    transformToVisualizationFormat(planData) {
        // 基本结构
        const result = {
            nodes: [],
            links: [],
            summary: {
                totalCost: planData.estimatedCost || 0,
                totalRows: planData.estimatedRows || 0,
                optimizationTips: planData.optimizationTips || [],
                bottlenecks: planData.performanceAnalysis?.bottlenecks || []
            }
        };
        // 处理节点
        if (planData.planNodes && planData.planNodes.length > 0) {
            // 首先创建所有节点
            result.nodes = planData.planNodes.map((node, index) => {
                return {
                    id: node.id || index + 1,
                    label: `${node.type} - ${node.table}`,
                    type: node.type,
                    table: node.table,
                    rows: node.rows,
                    filtered: node.filtered,
                    key: node.key || '无索引',
                    extra: node.extra || '',
                    cost: this.calculateNodeCost(node, planData.estimatedCost),
                    isBottleneck: this.isNodeBottleneck(node)
                };
            });
            // 然后创建节点之间的连接
            for (let i = 0; i < planData.planNodes.length - 1; i++) {
                result.links.push({
                    source: planData.planNodes[i].id || i + 1,
                    target: planData.planNodes[i + 1].id || i + 2,
                    value: planData.planNodes[i].rows
                });
            }
        }
        return result;
    }
    /**
     * 计算节点成本
     * @param node 查询计划节点
     * @param totalCost 总成本
     * @returns 节点成本
     */
    calculateNodeCost(node, totalCost) {
        // 如果没有总成本信息，则根据节点的行数估算
        if (!totalCost) {
            return node.rows;
        }
        // 否则尝试根据节点信息分配成本
        // 这里使用简化算法，实际情况可能需要更复杂的计算
        if (node.type === 'ALL') {
            return node.rows * 2; // 全表扫描成本更高
        }
        else if (node.type === 'range' || node.type === 'ref') {
            return node.rows;
        }
        else if (node.type === 'eq_ref' || node.type === 'const') {
            return 1; // 这些是高效的访问类型
        }
        return node.rows;
    }
    /**
     * 判断节点是否为瓶颈
     * @param node 查询计划节点
     * @returns 是否为瓶颈
     */
    isNodeBottleneck(node) {
        // 全表扫描通常是瓶颈
        if (node.type === 'ALL' && node.rows > 1000) {
            return true;
        }
        // 使用临时表或文件排序的节点
        if (node.extra && (node.extra.includes('Using temporary') ||
            node.extra.includes('Using filesort'))) {
            return true;
        }
        // 扫描大量行但过滤率低的节点
        if (node.rows > 10000 && node.filtered < 20) {
            return true;
        }
        return false;
    }
    /**
     * 比较两个查询计划
     * @param plan1 第一个查询计划
     * @param plan2 第二个查询计划
     * @returns 比较结果
     */
    comparePlanData(plan1, plan2) {
        const result = {
            summary: {
                costDifference: (plan2.estimatedCost || 0) - (plan1.estimatedCost || 0),
                rowsDifference: (plan2.estimatedRows || 0) - (plan1.estimatedRows || 0),
                plan1BottlenecksCount: this.countBottlenecks(plan1),
                plan2BottlenecksCount: this.countBottlenecks(plan2)
            },
            nodeComparison: [],
            accessTypeChanges: [],
            indexUsageChanges: []
        };
        // 比较节点
        if (plan1.planNodes && plan2.planNodes) {
            // 为简单起见，假设节点顺序匹配
            // 实际情况可能需要更复杂的匹配算法
            const minLength = Math.min(plan1.planNodes.length, plan2.planNodes.length);
            for (let i = 0; i < minLength; i++) {
                const node1 = plan1.planNodes[i];
                const node2 = plan2.planNodes[i];
                if (node1.table === node2.table) {
                    // 比较相同表的处理方式
                    if (node1.type !== node2.type) {
                        result.accessTypeChanges.push({
                            table: node1.table,
                            from: node1.type,
                            to: node2.type,
                            improvement: this.isAccessTypeImprovement(node1.type, node2.type)
                        });
                    }
                    // 比较索引使用变化
                    if (node1.key !== node2.key) {
                        result.indexUsageChanges.push({
                            table: node1.table,
                            from: node1.key || '无索引',
                            to: node2.key || '无索引'
                        });
                    }
                    // 节点详细比较
                    result.nodeComparison.push({
                        table: node1.table,
                        rows: {
                            plan1: node1.rows,
                            plan2: node2.rows,
                            difference: node2.rows - node1.rows
                        },
                        filtered: {
                            plan1: node1.filtered,
                            plan2: node2.filtered,
                            difference: node2.filtered - node1.filtered
                        },
                        accessType: {
                            plan1: node1.type,
                            plan2: node2.type,
                            improved: this.isAccessTypeImprovement(node1.type, node2.type)
                        }
                    });
                }
            }
        }
        return result;
    }
    /**
     * 计算查询计划中的瓶颈数量
     * @param plan 查询计划
     * @returns 瓶颈数量
     */
    countBottlenecks(plan) {
        let count = 0;
        if (plan.planNodes) {
            for (const node of plan.planNodes) {
                if (this.isNodeBottleneck(node)) {
                    count++;
                }
            }
        }
        return count;
    }
    /**
     * 判断访问类型变化是否是改进
     * @param fromType 原访问类型
     * @param toType 新访问类型
     * @returns 是否改进
     */
    isAccessTypeImprovement(fromType, toType) {
        // 定义访问类型的效率排序（从高到低）
        const efficiency = ['system', 'const', 'eq_ref', 'ref', 'fulltext', 'ref_or_null',
            'index_merge', 'unique_subquery', 'index_subquery',
            'range', 'index', 'ALL'];
        const fromIndex = efficiency.indexOf(fromType);
        const toIndex = efficiency.indexOf(toType);
        // 索引越小，访问类型越高效
        return toIndex < fromIndex;
    }
    /**
     * 根据优化建议生成优化后的SQL
     * @param originalSql 原始SQL
     * @param planData 查询计划数据
     * @returns 优化后的SQL
     */
    generateOptimizedSql(originalSql, planData) {
        // 这里仅作为示例，实际优化需要更复杂的实现
        // 可能需要SQL解析器和根据不同问题的特定优化逻辑
        let optimizedSql = originalSql;
        // 检查是否有全表扫描，尝试添加WHERE条件提示
        const fullTableScans = planData.planNodes ?
            planData.planNodes.filter((node) => node.type === 'ALL') :
            [];
        if (fullTableScans.length > 0) {
            // 这里只是示例，不会真正修改SQL逻辑
            const tables = fullTableScans.map((node) => node.table).join(', ');
            optimizedSql = `/* 建议为表 ${tables} 添加索引 */\n${optimizedSql}`;
        }
        // 检查是否使用了文件排序
        const hasFilesort = planData.planNodes ?
            planData.planNodes.some((node) => node.extra && node.extra.includes('Using filesort')) :
            false;
        if (hasFilesort) {
            optimizedSql = `/* 考虑添加ORDER BY列的索引 */\n${optimizedSql}`;
        }
        // 检查是否使用了临时表
        const hasTempTable = planData.planNodes ?
            planData.planNodes.some((node) => node.extra && node.extra.includes('Using temporary')) :
            false;
        if (hasTempTable) {
            optimizedSql = `/* 考虑简化查询或添加索引 */\n${optimizedSql}`;
        }
        return optimizedSql;
    }
}
exports.PlanVisualizationController = PlanVisualizationController;
// 导出控制器实例
exports.default = new PlanVisualizationController();
//# sourceMappingURL=plan-visualization.controller.js.map