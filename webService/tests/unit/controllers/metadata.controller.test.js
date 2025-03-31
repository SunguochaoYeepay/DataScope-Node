describe('getTableData', () => {
  beforeEach(() => {
    req = {
      params: {
        dataSourceId: 'test-datasource-id',
        tableName: 'users'
      },
      query: {
        page: '1',
        size: '10'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  it('应该成功获取表数据并返回分页结果', async () => {
    // 模拟数据源服务返回数据源
    datasourceService.getDataSourceById.mockResolvedValue({
      id: 'test-datasource-id',
      name: 'Test DataSource'
    });

    // 模拟连接器
    const mockConnector = {
      executeQuery: jest.fn()
    };

    // 模拟查询结果
    const mockRows = [
      { id: 1, name: 'User 1', email: 'user1@example.com' },
      { id: 2, name: 'User 2', email: 'user2@example.com' }
    ];

    // 模拟查询结果中的字段信息
    const mockFields = [
      { name: 'id', type: 'int' },
      { name: 'name', type: 'varchar' },
      { name: 'email', type: 'varchar' }
    ];

    // 模拟数据查询结果
    mockConnector.executeQuery.mockResolvedValueOnce({
      rows: mockRows,
      fields: mockFields,
      rowCount: 2
    });

    // 模拟计数查询结果
    mockConnector.executeQuery.mockResolvedValueOnce({
      rows: [{ total: 2 }],
      fields: [{ name: 'total', type: 'bigint' }],
      rowCount: 1
    });

    // 模拟获取连接器
    datasourceService.getConnector.mockResolvedValue(mockConnector);

    // 执行被测试的方法
    await metadataController.getTableData(req, res);

    // 断言
    expect(datasourceService.getDataSourceById).toHaveBeenCalledWith('test-datasource-id');
    expect(datasourceService.getConnector).toHaveBeenCalledWith('test-datasource-id');
    expect(mockConnector.executeQuery).toHaveBeenCalledTimes(2);
    
    // 验证第一次调用是查询表数据
    expect(mockConnector.executeQuery.mock.calls[0][0]).toContain('SELECT * FROM `users` LIMIT 0, 10');
    
    // 验证第二次调用是查询计数
    expect(mockConnector.executeQuery.mock.calls[1][0]).toContain('SELECT COUNT(*) as total FROM `users`');
    
    // 验证响应状态和数据
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        rows: mockRows,
        columns: mockFields.map(field => ({
          name: field.name,
          type: field.type
        })),
        pagination: {
          page: 1,
          size: 10,
          total: 2,
          totalPages: 1,
          hasMore: false
        },
        tableInfo: {
          tableName: 'users',
          totalRows: 2
        }
      }
    });
  });

  it('应该处理排序和过滤参数', async () => {
    // 设置查询参数包含排序和过滤
    req.query = {
      page: '1',
      size: '10',
      sort: 'name',
      order: 'desc',
      'filter[id]': '1'
    };

    // 模拟数据源和连接器
    datasourceService.getDataSourceById.mockResolvedValue({
      id: 'test-datasource-id',
      name: 'Test DataSource'
    });

    const mockConnector = {
      executeQuery: jest.fn()
    };

    // 模拟查询结果
    mockConnector.executeQuery.mockResolvedValueOnce({
      rows: [{ id: 1, name: 'User 1', email: 'user1@example.com' }],
      fields: [
        { name: 'id', type: 'int' },
        { name: 'name', type: 'varchar' },
        { name: 'email', type: 'varchar' }
      ],
      rowCount: 1
    });

    // 模拟计数查询结果
    mockConnector.executeQuery.mockResolvedValueOnce({
      rows: [{ total: 1 }],
      fields: [{ name: 'total', type: 'bigint' }],
      rowCount: 1
    });

    datasourceService.getConnector.mockResolvedValue(mockConnector);

    // 执行被测试的方法
    await metadataController.getTableData(req, res);

    // 验证SQL中包含了过滤和排序
    const sql = mockConnector.executeQuery.mock.calls[0][0];
    expect(sql).toContain('WHERE');
    expect(sql).toContain('ORDER BY');
    expect(sql).toContain('`name` DESC');
    
    // 验证参数化查询的参数
    const params = mockConnector.executeQuery.mock.calls[0][1];
    expect(params).toContain('1'); // id参数值

    // 验证响应状态是200
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('当数据源不存在时应抛出404错误', async () => {
    // 模拟数据源不存在
    datasourceService.getDataSourceById.mockResolvedValue(null);

    // 执行被测试的方法
    await metadataController.getTableData(req, res);

    // 验证响应
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: expect.stringContaining('不存在')
    });
  });
}); 