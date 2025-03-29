"use strict";
/**
 * 列信息分析器
 * 负责增强列元数据、提取统计信息和数据分布
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnAnalyzer = void 0;
const client_1 = require("@prisma/client");
const logger_1 = __importDefault(require("../../utils/logger"));
const datasource_service_1 = __importDefault(require("../datasource.service"));
const prisma = new client_1.PrismaClient();
class ColumnAnalyzer {
    /**
     * 分析数据列并增强元数据
     * @param dataSourceId 数据源ID
     * @param schemaName 架构名称
     * @param tableName 表名称
     * @param columnName 列名称
     * @returns 分析结果
     */
    async analyzeColumn(dataSourceId, schemaName, tableName, columnName) {
        try {
            logger_1.default.info(`开始分析列 ${schemaName}.${tableName}.${columnName}`);
            // 查找表和列
            const table = await prisma.table.findFirst({
                where: {
                    name: tableName,
                    schema: {
                        name: schemaName,
                        dataSourceId
                    }
                }
            });
            if (!table) {
                throw new Error(`表 ${schemaName}.${tableName} 不存在`);
            }
            const column = await prisma.column.findFirst({
                where: {
                    tableId: table.id,
                    name: columnName
                }
            });
            if (!column) {
                throw new Error(`列 ${schemaName}.${tableName}.${columnName} 不存在`);
            }
            // 获取数据源连接器
            const connector = await datasource_service_1.default.getConnector(dataSourceId);
            // 获取列统计信息
            const stats = await this.getColumnStatistics(connector, schemaName, tableName, columnName, column.dataType);
            // 数据分布（如果是数值或日期类型）
            let distribution = null;
            if (['int', 'bigint', 'decimal', 'float', 'double', 'date', 'datetime', 'timestamp'].includes(column.dataType.toLowerCase())) {
                distribution = await this.getDataDistribution(connector, schemaName, tableName, columnName, column.dataType, 10);
            }
            // 获取样本值
            const samples = await this.getSampleValues(connector, schemaName, tableName, columnName);
            // 获取唯一值数量（如果不是主键）
            let uniqueCount = null;
            if (!column.isPrimaryKey) {
                uniqueCount = await this.getUniqueValuesCount(connector, schemaName, tableName, columnName);
            }
            // 组装分析结果
            const analysisResult = {
                name: columnName,
                dataType: column.dataType,
                tableName,
                schemaName,
                isPrimaryKey: column.isPrimaryKey,
                isForeignKey: column.isForeignKey,
                nullable: column.nullable,
                statistics: stats,
                distribution: distribution,
                sampleValues: samples,
                uniqueValuesCount: uniqueCount,
                uniquenessRatio: uniqueCount !== null ? uniqueCount / stats.totalCount : 1,
            };
            // 更新列信息
            await prisma.column.update({
                where: { id: column.id },
                data: {
                    description: this.enhanceDescription(column.description || '', analysisResult)
                }
            });
            logger_1.default.info(`列 ${schemaName}.${tableName}.${columnName} 分析完成`);
            return analysisResult;
        }
        catch (error) {
            logger_1.default.error(`分析列时出错`, {
                error,
                dataSourceId,
                schemaName,
                tableName,
                columnName
            });
            throw error;
        }
    }
    /**
     * 获取列统计信息
     */
    async getColumnStatistics(connector, schemaName, tableName, columnName, dataType) {
        try {
            // 构建SQL查询以获取统计信息
            let sql = `
        SELECT
          COUNT(*) as total_count,
          COUNT(${columnName}) as non_null_count,
          COUNT(*) - COUNT(${columnName}) as null_count
      `;
            // 根据数据类型添加适当的聚合函数
            if (['int', 'bigint', 'decimal', 'float', 'double'].includes(dataType.toLowerCase())) {
                sql += `,
          MIN(${columnName}) as min_value,
          MAX(${columnName}) as max_value,
          AVG(${columnName}) as avg_value,
          SUM(${columnName}) as sum_value
        `;
            }
            else if (['date', 'datetime', 'timestamp'].includes(dataType.toLowerCase())) {
                sql += `,
          MIN(${columnName}) as min_value,
          MAX(${columnName}) as max_value
        `;
            }
            else if (['char', 'varchar', 'text'].includes(dataType.toLowerCase())) {
                sql += `,
          MIN(LENGTH(${columnName})) as min_length,
          MAX(LENGTH(${columnName})) as max_length,
          AVG(LENGTH(${columnName})) as avg_length
        `;
            }
            sql += ` FROM ${schemaName}.${tableName}`;
            const result = await connector.executeQuery(sql);
            if (result.rows.length === 0) {
                return { totalCount: 0, nonNullCount: 0, nullCount: 0 };
            }
            // 处理结果
            const stats = {
                totalCount: parseInt(result.rows[0].total_count),
                nonNullCount: parseInt(result.rows[0].non_null_count),
                nullCount: parseInt(result.rows[0].null_count)
            };
            if (['int', 'bigint', 'decimal', 'float', 'double'].includes(dataType.toLowerCase())) {
                Object.assign(stats, {
                    minValue: parseFloat(result.rows[0].min_value),
                    maxValue: parseFloat(result.rows[0].max_value),
                    avgValue: parseFloat(result.rows[0].avg_value),
                    sumValue: parseFloat(result.rows[0].sum_value)
                });
            }
            else if (['date', 'datetime', 'timestamp'].includes(dataType.toLowerCase())) {
                Object.assign(stats, {
                    minValue: result.rows[0].min_value,
                    maxValue: result.rows[0].max_value
                });
            }
            else if (['char', 'varchar', 'text'].includes(dataType.toLowerCase())) {
                Object.assign(stats, {
                    minLength: parseInt(result.rows[0].min_length || 0),
                    maxLength: parseInt(result.rows[0].max_length || 0),
                    avgLength: parseFloat(result.rows[0].avg_length || 0)
                });
            }
            return stats;
        }
        catch (error) {
            logger_1.default.error(`获取列统计信息时出错`, {
                error,
                schemaName,
                tableName,
                columnName
            });
            return { totalCount: 0, nonNullCount: 0, nullCount: 0 };
        }
    }
    /**
     * 获取数据分布信息
     */
    async getDataDistribution(connector, schemaName, tableName, columnName, dataType, bucketCount) {
        try {
            // 对于数值类型，获取分布区间
            if (['int', 'bigint', 'decimal', 'float', 'double'].includes(dataType.toLowerCase())) {
                // 先获取最小值和最大值
                const minMaxSql = `
          SELECT
            MIN(${columnName}) as min_value,
            MAX(${columnName}) as max_value
          FROM ${schemaName}.${tableName}
          WHERE ${columnName} IS NOT NULL
        `;
                const minMaxResult = await connector.executeQuery(minMaxSql);
                if (minMaxResult.rows.length === 0 || minMaxResult.rows[0].min_value === null) {
                    return [];
                }
                const minValue = parseFloat(minMaxResult.rows[0].min_value);
                const maxValue = parseFloat(minMaxResult.rows[0].max_value);
                // 如果最小值等于最大值，无法创建区间
                if (minValue === maxValue) {
                    return [{
                            range: `${minValue}`,
                            count: await this.getValueCount(connector, schemaName, tableName, columnName, minValue)
                        }];
                }
                // 计算区间宽度
                const step = (maxValue - minValue) / bucketCount;
                // 创建区间并获取每个区间的计数
                const distribution = [];
                for (let i = 0; i < bucketCount; i++) {
                    const lowerBound = minValue + i * step;
                    const upperBound = minValue + (i + 1) * step;
                    const sql = `
            SELECT COUNT(*) as count
            FROM ${schemaName}.${tableName}
            WHERE ${columnName} >= ${lowerBound} AND ${columnName} < ${upperBound === maxValue ? upperBound + 0.1 : upperBound}
          `;
                    const result = await connector.executeQuery(sql);
                    distribution.push({
                        range: `${lowerBound.toFixed(2)} - ${upperBound.toFixed(2)}`,
                        count: parseInt(result.rows[0].count)
                    });
                }
                return distribution;
            }
            // 对于日期类型，获取按时间段分组的分布
            if (['date', 'datetime', 'timestamp'].includes(dataType.toLowerCase())) {
                // 根据数据范围确定适当的时间分组
                const timespanSql = `
          SELECT
            MIN(${columnName}) as min_value,
            MAX(${columnName}) as max_value,
            DATEDIFF(MAX(${columnName}), MIN(${columnName})) as date_diff
          FROM ${schemaName}.${tableName}
          WHERE ${columnName} IS NOT NULL
        `;
                const timespanResult = await connector.executeQuery(timespanSql);
                if (timespanResult.rows.length === 0 || timespanResult.rows[0].min_value === null) {
                    return [];
                }
                const dateDiff = parseInt(timespanResult.rows[0].date_diff);
                // 根据日期范围选择合适的分组单位
                let groupBy, format;
                if (dateDiff <= 30) {
                    groupBy = "DAY";
                    format = "%Y-%m-%d";
                }
                else if (dateDiff <= 365) {
                    groupBy = "MONTH";
                    format = "%Y-%m";
                }
                else {
                    groupBy = "YEAR";
                    format = "%Y";
                }
                const sql = `
          SELECT 
            DATE_FORMAT(${columnName}, '${format}') as time_group,
            COUNT(*) as count
          FROM ${schemaName}.${tableName}
          WHERE ${columnName} IS NOT NULL
          GROUP BY time_group
          ORDER BY MIN(${columnName})
        `;
                const result = await connector.executeQuery(sql);
                return result.rows.map((row) => ({
                    range: row.time_group,
                    count: parseInt(row.count)
                }));
            }
            return [];
        }
        catch (error) {
            logger_1.default.error(`获取数据分布时出错`, {
                error,
                schemaName,
                tableName,
                columnName
            });
            return [];
        }
    }
    /**
     * 获取样本值
     */
    async getSampleValues(connector, schemaName, tableName, columnName, sampleSize = 10) {
        try {
            const sql = `
        SELECT ${columnName} as value
        FROM ${schemaName}.${tableName}
        WHERE ${columnName} IS NOT NULL
        ORDER BY RAND()
        LIMIT ${sampleSize}
      `;
            const result = await connector.executeQuery(sql);
            return result.rows.map((row) => row.value);
        }
        catch (error) {
            logger_1.default.error(`获取样本值时出错`, {
                error,
                schemaName,
                tableName,
                columnName
            });
            return [];
        }
    }
    /**
     * 获取列的唯一值数量
     */
    async getUniqueValuesCount(connector, schemaName, tableName, columnName) {
        try {
            const sql = `
        SELECT COUNT(DISTINCT ${columnName}) as unique_count
        FROM ${schemaName}.${tableName}
      `;
            const result = await connector.executeQuery(sql);
            return parseInt(result.rows[0].unique_count);
        }
        catch (error) {
            logger_1.default.error(`获取唯一值数量时出错`, {
                error,
                schemaName,
                tableName,
                columnName
            });
            return 0;
        }
    }
    /**
     * 获取特定值的出现次数
     */
    async getValueCount(connector, schemaName, tableName, columnName, value) {
        try {
            const sql = `
        SELECT COUNT(*) as count
        FROM ${schemaName}.${tableName}
        WHERE ${columnName} = ?
      `;
            const result = await connector.executeQuery(sql, [value]);
            return parseInt(result.rows[0].count);
        }
        catch (error) {
            logger_1.default.error(`获取值计数时出错`, {
                error,
                schemaName,
                tableName,
                columnName,
                value
            });
            return 0;
        }
    }
    /**
     * 基于分析结果增强列描述
     */
    enhanceDescription(originalDescription, analysis) {
        let enhancedDescription = originalDescription;
        // 如果是自动生成的描述或原始描述为空，创建全新描述
        if (!enhancedDescription || enhancedDescription === `${analysis.name} 列`) {
            enhancedDescription = `${analysis.name} 列，数据类型：${analysis.dataType}。`;
            if (analysis.isPrimaryKey) {
                enhancedDescription += '此列是主键。';
            }
            else if (analysis.isForeignKey) {
                enhancedDescription += '此列是外键。';
            }
            const stats = analysis.statistics;
            if (stats.totalCount > 0) {
                enhancedDescription += `包含 ${stats.totalCount} 行数据`;
                if (stats.nullCount > 0) {
                    const nullPercentage = (stats.nullCount / stats.totalCount * 100).toFixed(2);
                    enhancedDescription += `，其中 ${stats.nullCount} 行 (${nullPercentage}%) 为NULL值`;
                }
                enhancedDescription += '。';
            }
            // 根据数据类型添加特定描述
            if (analysis.uniqueValuesCount !== null) {
                enhancedDescription += ` 包含 ${analysis.uniqueValuesCount} 个不同的值`;
                if (analysis.uniquenessRatio !== null) {
                    const ratio = (analysis.uniquenessRatio * 100).toFixed(2);
                    if (analysis.uniquenessRatio > 0.9) {
                        enhancedDescription += `，几乎每个值都是唯一的 (${ratio}%)`;
                    }
                    else if (analysis.uniquenessRatio > 0.5) {
                        enhancedDescription += `，多样性较高 (${ratio}%)`;
                    }
                    else {
                        enhancedDescription += `，存在大量重复值 (${ratio}%)`;
                    }
                }
                enhancedDescription += '。';
            }
            if (['int', 'bigint', 'decimal', 'float', 'double'].includes(analysis.dataType.toLowerCase())) {
                if (stats.minValue !== undefined && stats.maxValue !== undefined) {
                    enhancedDescription += ` 数值范围从 ${stats.minValue} 到 ${stats.maxValue}`;
                    if (stats.avgValue !== undefined) {
                        enhancedDescription += `，平均值 ${stats.avgValue.toFixed(2)}`;
                    }
                    enhancedDescription += '。';
                }
            }
            else if (['date', 'datetime', 'timestamp'].includes(analysis.dataType.toLowerCase())) {
                if (stats.minValue && stats.maxValue) {
                    enhancedDescription += ` 日期范围从 ${stats.minValue} 到 ${stats.maxValue}。`;
                }
            }
            else if (['char', 'varchar', 'text'].includes(analysis.dataType.toLowerCase())) {
                if (stats.minLength !== undefined && stats.maxLength !== undefined) {
                    enhancedDescription += ` 字符长度从 ${stats.minLength} 到 ${stats.maxLength}`;
                    if (stats.avgLength !== undefined) {
                        enhancedDescription += `，平均长度 ${stats.avgLength.toFixed(2)}`;
                    }
                    enhancedDescription += '。';
                }
            }
        }
        return enhancedDescription;
    }
    /**
     * 分析列基数统计
     */
    async analyzeColumnCardinality(dataSourceId, schemas) {
        try {
            const connector = await datasource_service_1.default.getConnector(dataSourceId);
            // 构建要分析的表条件
            const schemaCondition = schemas.length > 0
                ? `AND table_schema IN (${schemas.map(s => `'${s}'`).join(',')})`
                : '';
            // 基础查询部分
            let query = `
        SELECT 
          table_schema AS schema_name,
          table_name,
          column_name,
          column_type AS data_type,
          COUNT(*) AS total_values,
          COUNT(DISTINCT column_name) AS unique_values,
          ROUND(COUNT(DISTINCT column_name) * 100.0 / COUNT(*), 2) AS cardinality_percentage,
          ROUND(SUM(CASE WHEN column_name IS NULL THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS null_percentage,
          '' AS comments
        FROM 
          information_schema.columns
        WHERE 
          table_schema NOT IN ('information_schema', 'mysql', 'performance_schema', 'sys')
          ${schemaCondition}
      `;
            // 分组条件
            const groupBy = [
                'table_schema',
                'table_name',
                'column_name',
                'column_type'
            ];
            query += `
        GROUP BY ${groupBy.join(', ')}
        ORDER BY cardinality_percentage ASC, column_name ASC
        LIMIT 100
      `;
            const result = await connector.executeQuery(query);
            // 转换结果为所需格式
            return result.rows.map((row) => ({
                schemaName: row.schema_name,
                tableName: row.table_name,
                columnName: row.column_name,
                dataType: row.data_type,
                totalValues: row.total_values,
                uniqueValues: row.unique_values,
                cardinalityPercentage: row.cardinality_percentage,
                nullPercentage: row.null_percentage,
                comments: `${row.comments || ''} ${this.getRecommendation(row)}`
            }));
        }
        catch (error) {
            logger_1.default.error(`分析列数据分布失败: ${error.message}`);
            throw error;
        }
    }
    /**
     * 获取基数分布建议
     */
    getRecommendation(row) {
        // 根据基数值给出建议
        const uniqueCount = row.unique_count || 0;
        const totalCount = row.total_count || 0;
        if (totalCount === 0) {
            return '无数据，无法给出建议';
        }
        const ratio = uniqueCount / totalCount;
        if (ratio > 0.9) {
            return '列基数非常高，考虑用作主键或添加唯一索引';
        }
        else if (ratio > 0.7) {
            return '列基数较高，适合创建索引';
        }
        else if (ratio > 0.3) {
            return '列基数中等，可以考虑创建索引，但效果可能一般';
        }
        else {
            return '列基数较低，不适合单独创建索引';
        }
    }
    /**
     * 判断是否为数值类型
     * @param dataType 数据类型字符串
     * @returns 是否为数值类型
     */
    isNumericType(dataType) {
        const numericTypes = [
            'int', 'bigint', 'decimal', 'float', 'double', 'numeric',
            'tinyint', 'smallint', 'mediumint', 'real'
        ];
        return numericTypes.some(type => dataType.toLowerCase().includes(type));
    }
    /**
     * 获取特定数据类型的值分布
     */
    async getValueDistribution(dataSourceId, schema, table, column) {
        try {
            const connector = await datasource_service_1.default.getConnector(dataSourceId);
            // 获取列的数据类型
            const columnsInfo = await connector.getColumns(schema, table);
            const columnInfo = columnsInfo.find(col => col.name === column);
            if (!columnInfo) {
                throw new Error(`列 ${column} 不存在`);
            }
            // 根据数据类型构建不同的查询
            let query = '';
            const isNumeric = this.isNumericType(columnInfo.dataType);
            if (isNumeric) {
                // 数值型列的分位数分析
                query = `
          SELECT 
            PERCENTILE_CONT(0.05) WITHIN GROUP (ORDER BY ${column}) AS p5,
            PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY ${column}) AS p25,
            PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY ${column}) AS median,
            PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY ${column}) AS p75,
            PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY ${column}) AS p95,
            MIN(${column}) AS min_value,
            MAX(${column}) AS max_value,
            AVG(${column}) AS avg_value,
            STDDEV(${column}) AS stddev
          FROM ${schema}.${table}
          WHERE ${column} IS NOT NULL
        `;
            }
            else {
                // 字符串或其他类型的频率分析
                query = `
          SELECT 
            ${column} AS value,
            COUNT(*) AS count,
            ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM ${schema}.${table} WHERE ${column} IS NOT NULL), 2) AS percentage
          FROM ${schema}.${table}
          WHERE ${column} IS NOT NULL
          GROUP BY ${column}
          ORDER BY count DESC
          LIMIT 20
        `;
            }
            const result = await connector.executeQuery(query);
            return result.rows.map((row) => row);
        }
        catch (error) {
            logger_1.default.error(`获取值分布失败: ${error.message}`);
            throw error;
        }
    }
    /**
     * 获取列数据的频率分布
     */
    async getFrequencyDistribution(connector, schema, table, column) {
        const query = `
      SELECT ${column} AS value
      FROM ${schema}.${table}
      WHERE ${column} IS NOT NULL
      GROUP BY ${column}
      ORDER BY COUNT(*) DESC
      LIMIT 10
    `;
        const result = await connector.executeQuery(query);
        return result.rows.map((row) => row.value);
    }
}
exports.ColumnAnalyzer = ColumnAnalyzer;
exports.default = new ColumnAnalyzer();
//# sourceMappingURL=column-analyzer.js.map