/**
 * 列信息分析器
 * 负责增强列元数据、提取统计信息和数据分布
 */
export declare class ColumnAnalyzer {
    /**
     * 分析数据列并增强元数据
     * @param dataSourceId 数据源ID
     * @param schemaName 架构名称
     * @param tableName 表名称
     * @param columnName 列名称
     * @returns 分析结果
     */
    analyzeColumn(dataSourceId: string, schemaName: string, tableName: string, columnName: string): Promise<any>;
    /**
     * 获取列统计信息
     */
    private getColumnStatistics;
    /**
     * 获取数据分布信息
     */
    private getDataDistribution;
    /**
     * 获取样本值
     */
    private getSampleValues;
    /**
     * 获取列的唯一值数量
     */
    private getUniqueValuesCount;
    /**
     * 获取特定值的出现次数
     */
    private getValueCount;
    /**
     * 基于分析结果增强列描述
     */
    private enhanceDescription;
    /**
     * 分析列基数统计
     */
    analyzeColumnCardinality(dataSourceId: string, schemas: string[]): Promise<any>;
    /**
     * 获取基数分布建议
     */
    private getRecommendation;
    /**
     * 判断是否为数值类型
     * @param dataType 数据类型字符串
     * @returns 是否为数值类型
     */
    private isNumericType;
    /**
     * 获取特定数据类型的值分布
     */
    getValueDistribution(dataSourceId: string, schema: string, table: string, column: string): Promise<any[]>;
    /**
     * 获取列数据的频率分布
     */
    private getFrequencyDistribution;
}
declare const _default: ColumnAnalyzer;
export default _default;
