"use strict";
/**
 * 表关系检测器
 * 负责分析数据库结构中的表关系并自动检测潜在关系
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RelationshipDetector = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../../utils/logger"));
const prisma = new client_1.PrismaClient();
class RelationshipDetector {
    /**
     * 分析数据源中的表关系
     * @param dataSourceId 数据源ID
     * @returns 检测到的关系数量
     */
    async detectRelationships(dataSourceId) {
        let detectedCount = 0;
        try {
            logger_1.default.info(`开始检测数据源 ${dataSourceId} 的表关系`);
            // 1. 基于外键检测关系
            const fkRelationships = await this.detectForeignKeyRelationships(dataSourceId);
            detectedCount += fkRelationships;
            // 2. 基于命名规则检测关系
            const namingRelationships = await this.detectNamingConventionRelationships(dataSourceId);
            detectedCount += namingRelationships;
            logger_1.default.info(`数据源 ${dataSourceId} 关系检测完成，共检测到 ${detectedCount} 个关系`);
            return detectedCount;
        }
        catch (error) {
            logger_1.default.error(`检测表关系时出错`, { error, dataSourceId });
            throw error;
        }
    }
    /**
     * 基于已有外键信息检测表关系
     * @param dataSourceId 数据源ID
     * @returns 检测到的关系数量
     */
    async detectForeignKeyRelationships(dataSourceId) {
        let count = 0;
        try {
            // 获取所有具有外键的列
            const foreignKeyColumns = await prisma.column.findMany({
                where: {
                    isForeignKey: true,
                    table: {
                        schema: {
                            dataSourceId
                        }
                    }
                },
                include: {
                    table: {
                        include: {
                            schema: true
                        }
                    }
                }
            });
            logger_1.default.info(`找到 ${foreignKeyColumns.length} 个外键列`);
            // 获取所有主键列用于匹配
            const primaryKeyColumns = await prisma.column.findMany({
                where: {
                    isPrimaryKey: true,
                    table: {
                        schema: {
                            dataSourceId
                        }
                    }
                },
                include: {
                    table: {
                        include: {
                            schema: true
                        }
                    }
                }
            });
            // 将主键列组织成映射以便快速查找
            const primaryKeyMap = new Map();
            for (const pkColumn of primaryKeyColumns) {
                const key = `${pkColumn.table.schema.name}.${pkColumn.table.name}.${pkColumn.name}`;
                primaryKeyMap.set(key, pkColumn);
            }
            // 处理每个外键列
            for (const fkColumn of foreignKeyColumns) {
                // 获取此列的外键信息
                const foreignKeys = await prisma.$queryRaw `
          SELECT 
            column_name, 
            referenced_table_schema,
            referenced_table_name, 
            referenced_column_name
          FROM 
            information_schema.key_column_usage
          WHERE 
            table_schema = ${fkColumn.table.schema.name}
            AND table_name = ${fkColumn.table.name}
            AND column_name = ${fkColumn.name}
            AND referenced_table_name IS NOT NULL`;
                // 逐个处理外键信息
                for (const fk of foreignKeys) {
                    const referencedSchemaName = fk.referenced_table_schema;
                    const referencedTableName = fk.referenced_table_name;
                    const referencedColumnName = fk.referenced_column_name;
                    // 查找目标表和目标列
                    const targetTable = await prisma.table.findFirst({
                        where: {
                            name: referencedTableName,
                            schema: {
                                name: referencedSchemaName,
                                dataSourceId
                            }
                        }
                    });
                    if (!targetTable)
                        continue;
                    const targetColumn = await prisma.column.findFirst({
                        where: {
                            name: referencedColumnName,
                            tableId: targetTable.id
                        }
                    });
                    if (!targetColumn)
                        continue;
                    // 检查关系是否已存在
                    const existingRelationship = await prisma.tableRelationship.findFirst({
                        where: {
                            sourceTableId: fkColumn.tableId,
                            targetTableId: targetTable.id
                        }
                    });
                    // 如果关系不存在，创建新关系
                    if (!existingRelationship) {
                        const relationship = await prisma.tableRelationship.create({
                            data: {
                                sourceTableId: fkColumn.tableId,
                                targetTableId: targetTable.id,
                                type: 'MANY_TO_ONE', // 默认外键关系类型
                                confidence: 1.0, // 外键是确定的关系
                                isAutoDetected: false, // 不是自动检测的，而是基于外键信息
                            }
                        });
                        // 创建列级关系
                        await prisma.columnRelationship.create({
                            data: {
                                tableRelationshipId: relationship.id,
                                sourceColumnId: fkColumn.id,
                                targetColumnId: targetColumn.id
                            }
                        });
                        count++;
                        logger_1.default.debug(`创建外键关系: ${fkColumn.table.name}.${fkColumn.name} -> ${targetTable.name}.${targetColumn.name}`);
                    }
                }
            }
            logger_1.default.info(`基于外键检测到 ${count} 个关系`);
            return count;
        }
        catch (error) {
            logger_1.default.error(`基于外键检测关系时出错`, { error, dataSourceId });
            return 0;
        }
    }
    /**
     * 基于命名规则检测潜在表关系
     * @param dataSourceId 数据源ID
     * @returns 检测到的关系数量
     */
    async detectNamingConventionRelationships(dataSourceId) {
        let count = 0;
        try {
            // 获取数据源中的所有表
            const tables = await prisma.table.findMany({
                where: {
                    schema: {
                        dataSourceId
                    }
                },
                include: {
                    columns: true,
                    schema: true
                }
            });
            if (tables.length < 2) {
                return 0; // 只有一个表，无法检测关系
            }
            // 将表名转换为小写以进行不区分大小写的比较
            const tableMap = new Map();
            for (const table of tables) {
                tableMap.set(table.name.toLowerCase(), table);
            }
            // 为每个表查找潜在关系
            for (const sourceTable of tables) {
                // 查找主键列
                const primaryKeys = sourceTable.columns.filter(col => col.isPrimaryKey);
                if (primaryKeys.length === 0)
                    continue;
                const primaryKeyColumn = primaryKeys[0]; // 使用第一个主键列
                const sourceTableName = sourceTable.name.toLowerCase();
                // 查找可能的关系表
                for (const targetTable of tables) {
                    // 跳过自关联
                    if (targetTable.id === sourceTable.id)
                        continue;
                    // 检查是否已存在这对表之间的关系（基于外键）
                    const existingRelationship = await prisma.tableRelationship.findFirst({
                        where: {
                            OR: [
                                {
                                    sourceTableId: sourceTable.id,
                                    targetTableId: targetTable.id
                                },
                                {
                                    sourceTableId: targetTable.id,
                                    targetTableId: sourceTable.id
                                }
                            ]
                        }
                    });
                    if (existingRelationship)
                        continue; // 跳过已有关系
                    const targetTableName = targetTable.name.toLowerCase();
                    let potentialRelations = [];
                    // 检查命名规则1: target_table_id 或 targetTableId 形式
                    const foreignKeyPatterns = [
                        `${sourceTableName}_id`,
                        `${sourceTableName.slice(0, -1)}_id` // 处理单复数形式
                    ];
                    for (const pattern of foreignKeyPatterns) {
                        for (const column of targetTable.columns) {
                            if (column.name.toLowerCase() === pattern) {
                                potentialRelations.push({
                                    sourceColumn: primaryKeyColumn,
                                    targetColumn: column,
                                    confidence: 0.8, // 命名规则匹配度高
                                    type: 'ONE_TO_MANY' // source 是 "one" 侧
                                });
                            }
                        }
                    }
                    // 检查命名规则2: 表名作为前缀
                    for (const column of targetTable.columns) {
                        const columnName = column.name.toLowerCase();
                        if (columnName !== 'id' && columnName.endsWith('_id')) {
                            const prefix = columnName.slice(0, -3); // 去掉_id后缀
                            if (prefix === sourceTableName || prefix === sourceTableName.slice(0, -1)) {
                                potentialRelations.push({
                                    sourceColumn: primaryKeyColumn,
                                    targetColumn: column,
                                    confidence: 0.7, // 前缀匹配
                                    type: 'ONE_TO_MANY'
                                });
                            }
                        }
                    }
                    // 取置信度最高的一个关系
                    if (potentialRelations.length > 0) {
                        potentialRelations.sort((a, b) => b.confidence - a.confidence);
                        const bestRelation = potentialRelations[0];
                        // 创建表关系
                        const relationship = await prisma.tableRelationship.create({
                            data: {
                                sourceTableId: sourceTable.id,
                                targetTableId: targetTable.id,
                                type: bestRelation.type,
                                confidence: bestRelation.confidence,
                                isAutoDetected: true, // 这是自动检测的关系
                            }
                        });
                        // 创建列级关系
                        await prisma.columnRelationship.create({
                            data: {
                                tableRelationshipId: relationship.id,
                                sourceColumnId: bestRelation.sourceColumn.id,
                                targetColumnId: bestRelation.targetColumn.id
                            }
                        });
                        count++;
                        logger_1.default.debug(`基于命名检测到关系: ${sourceTable.name}.${bestRelation.sourceColumn.name} -> ${targetTable.name}.${bestRelation.targetColumn.name} (置信度: ${bestRelation.confidence})`);
                    }
                }
            }
            logger_1.default.info(`基于命名规则检测到 ${count} 个关系`);
            return count;
        }
        catch (error) {
            logger_1.default.error(`基于命名规则检测关系时出错`, { error, dataSourceId });
            return 0;
        }
    }
}
exports.RelationshipDetector = RelationshipDetector;
exports.default = new RelationshipDetector();
//# sourceMappingURL=relationship-detector.js.map