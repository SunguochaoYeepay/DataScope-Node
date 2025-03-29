import { DataSource } from '@prisma/client';
import { CreateDataSourceDto, UpdateDataSourceDto } from '../types/datasource';
import { DatabaseConnector } from "../types/datasource";
export declare class DataSourceService {
    private connectors;
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
     * 测试数据源连接
     */
    testConnection(dataSource: DataSource): Promise<boolean>;
    /**
     * 获取连接器实例
     */
    getConnector(dataSource: DataSource): Promise<DatabaseConnector>;
}
declare const _default: DataSourceService;
export default _default;
