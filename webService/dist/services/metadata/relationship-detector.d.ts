/**
 * 表关系检测器
 * 负责分析数据库结构中的表关系并自动检测潜在关系
 */
export declare class RelationshipDetector {
    /**
     * 分析数据源中的表关系
     * @param dataSourceId 数据源ID
     * @returns 检测到的关系数量
     */
    detectRelationships(dataSourceId: string): Promise<number>;
    /**
     * 基于已有外键信息检测表关系
     * @param dataSourceId 数据源ID
     * @returns 检测到的关系数量
     */
    private detectForeignKeyRelationships;
    /**
     * 基于命名规则检测潜在表关系
     * @param dataSourceId 数据源ID
     * @returns 检测到的关系数量
     */
    private detectNamingConventionRelationships;
}
declare const _default: RelationshipDetector;
export default _default;
