# DataScope API 接口文档

## 接口规范

### 请求规范
- 基础路径: `/api/v1`
- 请求方法: GET/POST/PUT/DELETE
- Content-Type: application/json
- 认证头: X-User-Id

### 响应规范
```json
{
  "code": "0",           // 响应码，0表示成功
  "message": "success",  // 响应消息
  "data": {}            // 响应数据
}
```

## 数据源管理接口

### 创建数据源
- 请求路径: `/datasources`
- 请求方法: POST
- 请求参数:
```json
{
  "name": "string",          // 数据源名称
  "type": "MYSQL",          // 数据源类型：MYSQL/DB2
  "host": "string",         // 主机地址
  "port": 3306,            // 端口号
  "database": "string",    // 数据库名称
  "username": "string",    // 用户名
  "password": "string",    // 密码
  "remark": "string"       // 备注
}
```
- 响应数据:
```json
{
  "id": "string",          // 数据源ID
  "name": "string",        // 数据源名称
  "type": "MYSQL",        // 数据源类型
  "status": "ACTIVE",     // 数据源状态
  "createdAt": "string"   // 创建时间
}
```

### 更新数据源
- 请求路径: `/datasources/{id}`
- 请求方法: PUT
- 请求参数: 同创建数据源
- 响应数据: 同创建数据源

### 获取数据源
- 请求路径: `/datasources/{id}`
- 请求方法: GET
- 响应数据: 同创建数据源

### 删除数据源
- 请求路径: `/datasources/{id}`
- 请求方法: DELETE
- 响应数据: 无

### 获取数据源列表
- 请求路径: `/datasources`
- 请求方法: GET
- 请求参数:
  - type: 数据源类型（可选）
  - status: 数据源状态（可选）
- 响应数据:
```json
{
  "list": [
    {
      "id": "string",
      "name": "string",
      "type": "MYSQL",
      "status": "ACTIVE",
      "createdAt": "string"
    }
  ]
}
```

### 测试数据源连接
- 请求路径: `/datasources/{id}/test`
- 请求方法: POST
- 响应数据:
```json
{
  "success": true,        // 是否成功
  "message": "string"     // 错误信息
}
```

### 同步数据源元数据
- 请求路径: `/datasources/{id}/sync`
- 请求方法: POST
- 响应数据:
```json
{
  "success": true,        // 是否成功
  "message": "string",    // 错误信息
  "syncAt": "string"      // 同步时间
}
```

## 查询接口

### 执行SQL查询
- 请求路径: `/queries/sql`
- 请求方法: POST
- 请求参数:
```json
{
  "dataSourceId": "string",  // 数据源ID
  "sql": "string",          // SQL语句
  "params": {},            // 查询参数
  "timeout": 30,          // 超时时间（秒）
  "maxRows": 1000        // 最大返回行数
}
```
- 响应数据:
```json
{
  "columns": [           // 列信息
    {
      "name": "string",  // 列名
      "type": "string"   // 数据类型
    }
  ],
  "rows": [             // 数据行
    {
      "column1": "value1",
      "column2": "value2"
    }
  ],
  "total": 100,         // 总行数
  "executionTime": 100  // 执行时间（毫秒）
}
```

### 自然语言查询
- 请求路径: `/queries/nl`
- 请求方法: POST
- 请求参数:
```json
{
  "dataSourceId": "string",  // 数据源ID
  "question": "string",     // 自然语言问题
  "context": "string"      // 上下文信息
}
```
- 响应数据:
```json
{
  "sql": "string",         // 生成的SQL
  "explanation": "string", // 解释说明
  "result": {             // 查询结果
    "columns": [],
    "rows": [],
    "total": 0,
    "executionTime": 0
  }
}
```

## 配置接口

### 保存显示配置
- 请求路径: `/configs/display`
- 请求方法: POST
- 请求参数:
```json
{
  "userId": "string",       // 用户ID
  "dataSourceId": "string", // 数据源ID
  "tableName": "string",    // 表名
  "columnName": "string",   // 列名
  "config": {              // 显示配置
    "displayName": "string",
    "width": 120,
    "align": "left",
    "visible": true,
    "maskType": "string"
  }
}
```
- 响应数据:
```json
{
  "id": "string",          // 配置ID
  "createdAt": "string"    // 创建时间
}
```

### 获取显示配置
- 请求路径: `/configs/display`
- 请求方法: GET
- 请求参数:
  - userId: 用户ID
  - dataSourceId: 数据源ID
  - tableName: 表名
- 响应数据:
```json
{
  "list": [
    {
      "columnName": "string",
      "config": {}
    }
  ]
}
```

## 错误码说明
| 错误码 | 说明 |
|--------|------|
| 0      | 成功 |
| 1001   | 参数错误 |
| 1002   | 数据源不存在 |
| 1003   | 查询超时 |
| 1004   | 查询频率超限 |
| 1005   | 数据量超限 |
| 2001   | 系统错误 |