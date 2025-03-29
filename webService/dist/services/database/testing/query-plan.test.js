"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const enhanced_mysql_connector_1 = require("../enhanced-mysql.connector");
// Mock数据库模块
globals_1.jest.mock('mysql2/promise', () => {
    const mockPool = {
        getConnection: globals_1.jest.fn(),
        query: globals_1.jest.fn(),
        end: globals_1.jest.fn(),
    };
    return {
        createPool: globals_1.jest.fn().mockReturnValue(mockPool),
    };
});
// 禁用控制台输出以保持测试输出干净
globals_1.jest.spyOn(console, 'log').mockImplementation(() => { });
globals_1.jest.spyOn(console, 'error').mockImplementation(() => { });
(0, globals_1.describe)('EnhancedMySQLConnector - 查询计划功能测试', () => {
    let connector;
    let mockConnection;
    let mockPool;
    // 创建假的查询执行计划结果
    const mockExplainResult = [
        [
            {
                id: 1,
                select_type: 'SIMPLE',
                table: 'users',
                type: 'ALL',
                possible_keys: null,
                key: null,
                key_len: null,
                ref: null,
                rows: 1000,
                filtered: 100,
                Extra: null
            }
        ],
        []
    ];
    // 创建假的JSON格式的执行计划结果
    const mockExplainJsonResult = [
        [
            {
                EXPLAIN: JSON.stringify({
                    query_block: {
                        select_id: 1,
                        cost_info: {
                            query_cost: '1024.50'
                        }
                    }
                })
            }
        ],
        []
    ];
    (0, globals_1.beforeEach)(() => {
        // 重置所有模拟并创建新实例
        globals_1.jest.clearAllMocks();
        // 设置模拟连接
        mockConnection = {
            query: globals_1.jest.fn(),
            release: globals_1.jest.fn(),
        };
        // 获取模拟池
        mockPool = require('mysql2/promise').createPool();
        mockPool.getConnection.mockResolvedValue(mockConnection);
        // 创建连接器实例
        connector = new enhanced_mysql_connector_1.EnhancedMySQLConnector('test-source-id', {
            host: 'localhost',
            port: 3306,
            user: 'test',
            password: 'test',
            database: 'testdb'
        });
    });
    (0, globals_1.afterEach)(() => {
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.it)('应当成功解析查询执行计划', async () => {
        // 设置模拟返回
        mockConnection.query
            .mockResolvedValueOnce(mockExplainResult) // 模拟传统格式的EXPLAIN结果
            .mockResolvedValueOnce(mockExplainJsonResult); // 模拟JSON格式的EXPLAIN结果
        const sql = 'SELECT * FROM users WHERE active = 1';
        const plan = await connector.explainQuery(sql);
        // 验证连接和查询是否正确调用
        (0, globals_1.expect)(mockPool.getConnection).toHaveBeenCalled();
        (0, globals_1.expect)(mockConnection.query).toHaveBeenCalledWith(`EXPLAIN ${sql}`, []);
        (0, globals_1.expect)(mockConnection.query).toHaveBeenCalledWith(`EXPLAIN FORMAT=JSON ${sql}`, []);
        (0, globals_1.expect)(mockConnection.release).toHaveBeenCalled();
        // 验证结果
        (0, globals_1.expect)(plan).toBeDefined();
        (0, globals_1.expect)(plan.planNodes).toHaveLength(1);
        (0, globals_1.expect)(plan.planNodes[0].id).toBe(1);
        (0, globals_1.expect)(plan.planNodes[0].table).toBe('users');
        (0, globals_1.expect)(plan.planNodes[0].type).toBe('ALL');
        (0, globals_1.expect)(plan.planNodes[0].rows).toBe(1000);
        (0, globals_1.expect)(plan.estimatedCost).toBe(1024.5); // 从JSON格式中提取
    });
    (0, globals_1.it)('应当处理JSON解析错误并回退到传统格式', async () => {
        // 设置模拟返回
        mockConnection.query
            .mockResolvedValueOnce(mockExplainResult) // 模拟传统格式的EXPLAIN结果
            .mockRejectedValueOnce(new Error('JSON解析失败')); // 模拟JSON格式查询失败
        const sql = 'SELECT * FROM users WHERE active = 1';
        const plan = await connector.explainQuery(sql);
        // 验证连接和查询是否正确调用
        (0, globals_1.expect)(mockPool.getConnection).toHaveBeenCalled();
        (0, globals_1.expect)(mockConnection.query).toHaveBeenCalledWith(`EXPLAIN ${sql}`, []);
        (0, globals_1.expect)(mockConnection.query).toHaveBeenCalledWith(`EXPLAIN FORMAT=JSON ${sql}`, []);
        (0, globals_1.expect)(mockConnection.release).toHaveBeenCalled();
        // 验证结果 - 应该还是能够从传统格式获取数据
        (0, globals_1.expect)(plan).toBeDefined();
        (0, globals_1.expect)(plan.planNodes).toHaveLength(1);
        (0, globals_1.expect)(plan.planNodes[0].table).toBe('users');
        (0, globals_1.expect)(plan.estimatedCost).toBeUndefined(); // JSON格式失败，成本信息未获取
    });
    (0, globals_1.it)('应当拒绝非SELECT查询的执行计划请求', async () => {
        const sql = 'INSERT INTO users (name) VALUES ("test")';
        // 验证是否抛出正确的错误
        await (0, globals_1.expect)(connector.explainQuery(sql)).rejects.toThrow();
        // 验证连接是否被获取和释放
        (0, globals_1.expect)(mockPool.getConnection).toHaveBeenCalled();
        (0, globals_1.expect)(mockConnection.release).toHaveBeenCalled();
        // 验证查询方法从未被调用（因为非SELECT语句检查失败）
        (0, globals_1.expect)(mockConnection.query).not.toHaveBeenCalled();
    });
    (0, globals_1.it)('应当捕获并包装查询执行计划过程中的错误', async () => {
        // 设置模拟连接查询失败
        mockConnection.query.mockRejectedValueOnce(new Error('数据库错误'));
        const sql = 'SELECT * FROM users WHERE active = 1';
        // 验证是否抛出正确的错误
        await (0, globals_1.expect)(connector.explainQuery(sql)).rejects.toThrow();
        // 验证连接是否被获取和释放
        (0, globals_1.expect)(mockPool.getConnection).toHaveBeenCalled();
        (0, globals_1.expect)(mockConnection.release).toHaveBeenCalled();
    });
    (0, globals_1.it)('应当为执行计划生成优化建议', async () => {
        // 设置模拟返回 - 全表扫描的情况
        const mockFullScanResult = [
            [
                {
                    id: 1,
                    select_type: 'SIMPLE',
                    table: 'users',
                    type: 'ALL', // 全表扫描
                    possible_keys: null,
                    key: null,
                    key_len: null,
                    ref: null,
                    rows: 10000, // 大量行
                    filtered: 10, // 低过滤率
                    Extra: 'Using filesort' // 使用文件排序
                }
            ],
            []
        ];
        mockConnection.query
            .mockResolvedValueOnce(mockFullScanResult)
            .mockResolvedValueOnce([[{ EXPLAIN: '{}' }], []]);
        const sql = 'SELECT * FROM users ORDER BY created_at';
        const plan = await connector.explainQuery(sql);
        // 验证优化建议
        (0, globals_1.expect)(plan.optimizationTips).toBeDefined();
        (0, globals_1.expect)(plan.optimizationTips.length).toBeGreaterThan(0);
        // 应该包含关于全表扫描的建议
        (0, globals_1.expect)(plan.optimizationTips.some(tip => tip.includes('全表扫描') && tip.includes('添加索引'))).toBe(true);
        // 应该包含关于文件排序的建议
        (0, globals_1.expect)(plan.optimizationTips.some(tip => tip.includes('文件排序'))).toBe(true);
    });
});
//# sourceMappingURL=query-plan.test.js.map