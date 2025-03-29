import { DataSource } from '@prisma/client';
import { DatabaseConnector } from './database/dbInterface';
import { CreateDataSourceDto, UpdateDataSourceDto, TestConnectionDto } from '../types/datasource';
export declare class DataSourceService {
    private connectors;
    /**
     * 解密数据源密码
     * @param encryptedPassword 加密的密码
     * @param salt 盐值
     * @returns 解密后的密码
     */
    private decryptPassword;
    /**
     * 创建数据源
     */
    createDataSource(data: CreateDataSourceDto): Promise<DataSource>;
    /**
     * 获取所有数据源
     */
    getAllDataSources(): Promise<Omit<DataSource, 'passwordEncrypted' | 'passwordSalt'>[]>;
    /**
     * 根据ID获取数据源
     */
    getDataSourceById(id: string): Promise<Omit<DataSource, 'passwordEncrypted' | 'passwordSalt'>>;
    /**
     * 更新数据源
     */
    updateDataSource(id: string, data: UpdateDataSourceDto): Promise<DataSource>;
    /**
     * 删除数据源
     */
    deleteDataSource(id: string): Promise<void>;
    /**
     * 根据ID获取数据源（包含密码）
     */
    getDataSourceByIdWithPassword(id: string): Promise<DataSource>;
    /**
     * 测试数据源连接
     */
    testConnection(connectionData: TestConnectionDto): Promise<boolean>;
    /**
     * 获取连接器实例
     * @param dataSourceOrId 数据源对象或数据源ID
     * @returns 数据库连接器实例
     */
    getConnector(dataSourceOrId: DataSource | string): Promise<DatabaseConnector>;
}
declare const _default: DataSourceService;
export default _default;
