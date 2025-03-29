# 查询取消功能设计文档

## 概述

查询取消功能允许用户在查询执行过程中随时终止正在进行的数据库查询操作，有效避免长时间运行的查询占用系统资源，提高系统响应性能。本文档详细描述查询取消功能的设计和实现方案。

## 系统设计

### 1. 架构图

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   API层      │      │   服务层      │      │  连接器层     │
│  Controller  │──────▶  Service     │──────▶  Connector   │
└──────────────┘      └──────────────┘      └──────────────┘
       │                     │                     │
       │                     │                     │
       ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ /api/queries │      │QueryService  │      │MySQLConnector│
│ /cancel/{id} │      │   cancel()   │      │   cancel()   │
└──────────────┘      └──────────────┘      └──────────────┘
```

### 2. 接口定义

#### 2.1 数据库连接器接口扩展

需要在`DatabaseConnector`接口中添加取消查询的方法：

```typescript
export interface DatabaseConnector {
  // 现有方法...
  
  /**
   * 取消正在执行的查询
   * @param queryId 查询ID
   * @returns 是否成功取消
   */
  cancelQuery(queryId: string): Promise<boolean>;
}
```

#### 2.2 查询服务接口扩展

在`QueryService`中添加取消查询的方法：

```typescript
async cancelQuery(queryId: string): Promise<boolean> {
  // 实现取消查询的逻辑
}
```

#### 2.3 API接口扩展

添加新的API端点用于取消查询：

```
POST /api/queries/{id}/cancel
```

## 实现方案

### 1. MySQL查询取消实现

MySQL不直接支持从客户端取消正在执行的查询，但可以通过以下方法实现：

1. **连接ID跟踪**：在执行查询时记录连接ID
2. **KILL QUERY命令**：使用管理连接执行KILL QUERY命令

```typescript
// MySQLConnector实现
async cancelQuery(queryId: string): Promise<boolean> {
  if (!this.activeQueries.has(queryId)) {
    return false; // 查询不存在或已完成
  }

  const connectionId = this.activeQueries.get(queryId);
  
  // 使用管理连接执行KILL QUERY命令
  const adminConnection = await this.pool.getConnection();
  try {
    await adminConnection.query(`KILL QUERY ${connectionId}`);
    this.activeQueries.delete(queryId);
    return true;
  } catch (error) {
    logger.error('取消MySQL查询失败', { error, queryId, connectionId });
    return false;
  } finally {
    adminConnection.release();
  }
}
```

### 2. 查询执行监控

为了实现查询取消功能，需要跟踪所有正在执行的查询：

```typescript
// 活动查询跟踪Map
private activeQueries: Map<string, number> = new Map(); // queryId -> connectionId

// 执行查询时记录连接ID
async executeQuery(sql: string, params: any[] = [], queryId: string): Promise<QueryResult> {
  let connection;
  try {
    connection = await this.pool.getConnection();
    
    // 获取连接ID并记录
    const [threadIdResult] = await connection.query('SELECT CONNECTION_ID() as connectionId');
    const connectionId = threadIdResult[0].connectionId;
    this.activeQueries.set(queryId, connectionId);
    
    // 执行查询...
    
    return result;
  } catch (error) {
    // 错误处理...
  } finally {
    // 清理活动查询记录
    this.activeQueries.delete(queryId);
    if (connection) {
      connection.release();
    }
  }
}
```

### 3. 查询服务实现

```typescript
async cancelQuery(queryId: string): Promise<boolean> {
  try {
    // 首先查找查询执行记录
    const queryExecution = await prisma.queryHistory.findUnique({
      where: { id: queryId }
    });
    
    if (!queryExecution) {
      throw new ApiError('查询不存在', 404);
    }
    
    if (queryExecution.status !== 'RUNNING') {
      return false; // 查询已经完成或已取消
    }
    
    // 获取数据源连接器
    const connector = await dataSourceService.getConnector(queryExecution.dataSourceId);
    
    // 取消查询
    const success = await connector.cancelQuery(queryId);
    
    if (success) {
      // 更新查询历史状态
      await prisma.queryHistory.update({
        where: { id: queryId },
        data: {
          status: 'CANCELLED',
          endTime: new Date(),
          duration: new Date().getTime() - new Date(queryExecution.startTime).getTime(),
          errorMessage: '查询已取消'
        }
      });
    }
    
    return success;
  } catch (error) {
    logger.error('取消查询失败', { error, queryId });
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('取消查询失败', 500, error?.message || '未知错误');
  }
}
```

### 4. 控制器实现

```typescript
// 在query.controller.ts中添加
async cancelQuery(req: Request, res: Response): Promise<void> {
  const { id } = req.params;
  
  try {
    const success = await queryService.cancelQuery(id);
    
    if (success) {
      res.status(200).json({
        success: true,
        message: '查询已成功取消'
      });
    } else {
      res.status(400).json({
        success: false,
        message: '无法取消查询，查询可能已完成或已取消'
      });
    }
  } catch (error) {
    next(error);
  }
}
```

## 实现步骤

1. 更新`DatabaseConnector`接口，添加`cancelQuery`方法
2. 在`MySQLConnector`中实现查询取消功能
3. 修改`executeQuery`方法，添加连接ID跟踪
4. 在`QueryService`中实现`cancelQuery`方法
5. 添加API控制器方法和路由
6. 添加单元测试和集成测试

## 测试计划

### 单元测试

1. 测试`MySQLConnector.cancelQuery`方法
2. 测试`QueryService.cancelQuery`方法
3. 测试查询取消API端点

### 集成测试

1. 测试长时间运行查询的取消
2. 测试并发查询场景下的查询取消
3. 测试不同状态下的查询取消

## 注意事项与限制

1. MySQL的KILL QUERY命令需要足够的权限
2. 查询取消可能不是即时的，取决于数据库引擎
3. 需要考虑事务一致性问题
4. 连接池管理需要注意资源释放