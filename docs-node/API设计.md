# DataScope Node API 设计

## API 标准

### 通用原则

- RESTful API 设计
- JSON 请求/响应格式
- URL 路径中的版本控制 (/api/v1/...)
- 一致的错误处理
- 通过 JWT 进行身份验证
- 速率限制头
- 仅支持 HTTPS

### 响应格式

```json
{
    "code": 0,           // 0 表示成功，其他表示错误
    "message": "string", // 成功或错误消息
    "data": {},          // 响应数据
    "timestamp": "string" // ISO-8601 格式时间戳
}
```

### 错误码

- 1000-1999: 认证/授权错误
- 2000-2999: 输入验证错误
- 3000-3999: 业务逻辑错误
- 4000-4999: 系统错误
- 5000-5999: 外部服务错误

## API 端点

### 数据源管理

#### 获取数据源列表

```
GET /api/v1/datasources
查询参数:
- page: int (默认: 1)
- size: int (默认: 10)
- status: string (可选)
- type: string (可选)
```

#### 创建数据源

```
POST /api/v1/datasources
请求体:
{
    "name": "string",
    "type": "string",
    "host": "string",
    "port": int,
    "databaseName": "string",
    "username": "string",
    "password": "string",
    "description": "string"
}
```

#### 更新数据源

```
PUT /api/v1/datasources/{id}
请求体:
{
    "name": "string",
    "host": "string",
    "port": int,
    "username": "string",
    "password": "string",
    "description": "string"
}
```

#### 测试连接

```
POST /api/v1/datasources/{id}/test
响应:
{
    "success": boolean,
    "message": "string"
}
```

### 元数据管理

#### 获取模式列表

```
GET /api/v1/datasources/{id}/schemas
查询参数:
- page: int
- size: int
```

#### 获取表

```
GET /api/v1/schemas/{id}/tables
查询参数:
- page: int
- size: int
- search: string
```

#### 获取列

```
GET /api/v1/tables/{id}/columns
查询参数:
- page: int
- size: int
```

#### 同步元数据

```
POST /api/v1/datasources/{id}/sync
查询参数:
- type: string (FULL/INCREMENTAL)
```

### 查询管理

#### 执行查询

```
POST /api/v1/queries/execute
请求体:
{
    "dataSourceId": "string",
    "sql": "string",
    "parameters": {},
    "timeout": int,
    "maxRows": int
}
```

#### 自然语言查询

```
POST /api/v1/queries/nl
请求体:
{
    "dataSourceId": "string",
    "question": "string",
    "context": {}
}
```

#### 保存查询

```
POST /api/v1/queries
请求体:
{
    "name": "string",
    "description": "string",
    "dataSourceId": "string",
    "sql": "string",
    "displayConfig": {}
}
```

#### 获取查询历史

```
GET /api/v1/queries/history
查询参数:
- page: int
- size: int
- userId: string
- status: string
```

### 显示配置

#### 保存显示配置

```
POST /api/v1/display-configs
请求体:
{
    "queryId": "string",
    "displayType": "string",
    "config": {
        "conditions": [{
            "field": "string",
            "label": "string",
            "type": "string",
            "required": boolean,
            "defaultValue": "string"
        }],
        "columns": [{
            "field": "string",
            "label": "string",
            "type": "string",
            "mask": "string",
            "format": "string"
        }],
        "operations": [{
            "type": "string",
            "label": "string",
            "action": "string"
        }]
    }
}
```

#### 获取显示配置

```
GET /api/v1/display-configs/{id}
```

### 用户偏好

#### 保存偏好

```
POST /api/v1/preferences
请求体:
{
    "type": "string",
    "key": "string",
    "value": "string"
}
```

#### 获取偏好

```
GET /api/v1/preferences
查询参数:
- type: string
```

## 低代码集成

### 生成查询 API

```
POST /api/v1/low-code/apis
请求体:
{
    "queryId": "string",
    "apiPath": "string",
    "method": "string",
    "parameters": [{
        "name": "string",
        "type": "string",
        "required": boolean,
        "defaultValue": "string"
    }]
}
```

### 获取 API 配置

```
GET /api/v1/low-code/apis/{id}/config
响应:
{
    "apiConfig": {
        "path": "string",
        "method": "string",
        "parameters": []
    },
    "displayConfig": {
        "conditions": [],
        "columns": [],
        "operations": []
    }
}
```

## 速率限制

### 头信息

```
X-RateLimit-Limit: 每个时间窗口的最大请求数
X-RateLimit-Remaining: 当前窗口中剩余的请求数
X-RateLimit-Reset: 速率限制重置的时间
```

### 限制

- API 调用: 每个用户每分钟 1000 个请求
- 查询执行: 每个用户 10 个并发查询
- 数据下载: 每个请求 50000 行

## API 版本控制策略

### 版本格式
- API 版本遵循语义化版本控制 (MAJOR.MINOR.PATCH)
- URI 路径版本控制: /api/v{MAJOR}/...
- 响应中包含版本元数据

### API 生命周期阶段
1. 活跃
   - 当前稳定版本
   - 完全支持
   - 定期更新

2. 弃用
   - 仍然可用
   - 不添加新功能
   - 仅修复错误
   - 宣布终止日期

3. 终止
   - 生命周期结束
   - 只读模式
   - 重定向到新版本
   - 最终移除

### 版本支持
- 主要版本支持 24 个月
- 次要版本支持 12 个月
- 终止前至少提前 6 个月通知
- 同时最多支持 2 个主要版本

## 实现 (Node.js/Express)

### URI 版本控制
```typescript
// routes/v1/queryRoutes.ts
import { Router } from 'express';
import { QueryControllerV1 } from '../../controllers/v1/queryController';

const router = Router();
const controller = new QueryControllerV1();

router.post('/queries', controller.executeQuery);

export default router;

// routes/v2/queryRoutes.ts
import { Router } from 'express';
import { QueryControllerV2 } from '../../controllers/v2/queryController';

const router = Router();
const controller = new QueryControllerV2();

router.post('/queries', controller.executeQuery);

export default router;

// app.ts
app.use('/api/v1', v1Routes);
app.use('/api/v2', v2Routes);
```

### 版本中间件
```typescript
// middlewares/apiVersionMiddleware.ts
import { Request, Response, NextFunction } from 'express';

export function apiVersionMiddleware(req: Request, res: Response, next: NextFunction) {
    const version = req.header('API-Version') || '1';
    req.apiVersion = version;
    next();
}

// 响应中添加版本信息
export function addVersionMetadata(req: Request, res: Response, next: NextFunction) {
    const originalJson = res.json;
    res.json = function(body) {
        body.api = {
            version: req.apiVersion,
            deprecated: isDeprecated(req.apiVersion),
            sunset: getSunsetDate(req.apiVersion)
        };
        return originalJson.call(this, body);
    };
    next();
}
```

## 错误码与错误处理

### 业务错误码
- DS_001: 数据源名称已存在
- DS_002: 数据源连接失败
- DS_003: 数据源同步失败
- QY_001: SQL 语法错误
- QY_002: 查询超时
- QY_003: 查询结果过大
- EX_001: 导出任务创建失败
- EX_002: 导出超过最大限制

### 错误响应示例
```json
{
    "code": 3001,
    "message": "数据源连接失败",
    "details": {
        "host": "db.example.com",
        "reason": "Connection timed out"
    },
    "timestamp": "2023-09-15T14:30:45Z"
}
```