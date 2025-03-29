# 错误处理指南
本文档是 DataScope API 服务的错误处理指南，为开发者提供有关如何在项目中使用错误处理系统的详细说明。

## 错误处理系统概述
DataScope API 服务采用了统一的错误处理机制，包括以下核心组件：

1. **错误代码（ERROR_CODES）**：定义了所有可能的错误代码和对应的错误消息。
2. **错误类层次结构**：基于 `AppError` 基类的错误类型系统。
3. **全局错误处理中间件**：捕获并处理所有应用错误。
4. **请求日志中间件**：为每个请求生成唯一 ID 并记录请求和响应信息。

## 错误类层次结构

错误类层次结构如下：

```
AppError (基类)
├── ApiError
├── DatabaseError
├── DataSourceError
├── ValidationError
└── QueryError
```

### AppError 基类

`AppError` 是所有错误类型的基类，提供了以下核心功能：

- 错误状态码（HTTP 状态码）
- 错误代码（内部错误代码）
- 错误类型（字符串标识符）
- 错误详情（可选的额外信息）
- 时间戳
- 请求路径
- 请求 ID

```typescript
// 创建基本错误
const error = new AppError(
  '错误消息',
  ERROR_CODES.INTERNAL_SERVER_ERROR,
  500,
  'ERROR_TYPE'
);

// 设置额外信息
error
  .setPath('/api/resource')
  .setRequestId('unique-request-id')
  .addDetails({ key: 'value' });
```

## 使用专业错误类型

### ApiError

用于 API 请求处理过程中的错误。

```typescript
// 400 错误
throw ApiError.badRequest('无效的请求参数', { field: 'name', issue: 'required' });

// 401 错误
throw ApiError.unauthorized('用户未登录或会话已过期');

// 403 错误
throw ApiError.forbidden('没有权限访问此资源');

// 404 错误
throw ApiError.notFound('请求的资源不存在');

// 409 错误
throw ApiError.conflict('资源已存在', { resource: 'user', identifier: 'email@example.com' });

// 429 错误
throw ApiError.tooManyRequests('请求频率过高，请稍后再试');

// 500 错误
throw ApiError.internal('服务器内部错误');
```

### ValidationError

用于请求验证过程中的错误。

```typescript
// 创建字段验证错误集合
const fieldErrors = {
  username: '用户名不能为空',
  password: '密码长度不足'
};
throw ValidationError.fromFieldErrors(fieldErrors, '表单验证失败');

// 必填字段错误
throw ValidationError.requiredField('username', '用户名是必填项');

// 字段类型错误
throw ValidationError.invalidType('age', 'number', '年龄必须是数字');

// 字段长度错误
throw ValidationError.invalidLength('password', 8, 20, '密码长度必须在8-20个字符之间');

// 字段格式错误
throw ValidationError.invalidFormat('email', 'email@example.com', '邮箱格式不正确');
```

### DatabaseError

用于数据库操作过程中的错误。

```typescript
// 数据库连接错误
throw DatabaseError.connectionError('无法连接到数据库', { host: 'localhost' });

// 查询错误
throw DatabaseError.queryError('SQL查询执行失败', { sql: 'SELECT * FROM users' });

// 事务错误
throw DatabaseError.transactionError('事务执行失败');

// 记录不存在错误
throw DatabaseError.recordNotFound('用户记录不存在', { id: 123 });

// 记录已存在错误
throw DatabaseError.recordExists('用户邮箱已存在', { email: 'test@example.com' });

// 约束错误
throw DatabaseError.constraintError('违反唯一约束', { field: 'email' });
```

### DataSourceError

用于数据源操作过程中的错误。

```typescript
// 连接失败
throw DataSourceError.connectionFailed('无法连接到数据源', { source: 'MySQL', host: 'db.example.com' });

// 认证失败
throw DataSourceError.authenticationFailed('数据源认证失败', { source: 'PostgreSQL' });

// 数据源不存在
throw DataSourceError.notFound('数据源不存在', { id: 123 });

// 数据源同步失败
throw DataSourceError.syncFailed('数据源同步失败', { source: 'MySQL', reason: '网络连接中断' });
```

### QueryError

用于查询执行过程中的错误。

```typescript
// 执行失败
throw QueryError.executionFailed('查询执行失败');

// 语法错误
throw QueryError.syntaxError('SQL语法错误', { sql: 'SELECT * FORM users', position: 7 });

// 查询超时
throw QueryError.timeout('查询执行超时', { sql: 'SELECT * FROM large_table', executionTime: '30s' });

// 权限不足
throw QueryError.permissionDenied('无权执行此查询', { table: 'sensitive_data', operation: 'SELECT' });
```

## 错误响应格式

所有错误都会生成统一格式的响应：

```json
{
  "statusCode": 400,
  "error": "VALIDATION_ERROR",
  "message": "数据验证失败",
  "code": 80001,
  "timestamp": "2023-03-29T12:34:56.789Z",
  "path": "/api/users",
  "details": {
    "field": "email",
    "issue": "格式无效"
  }
}
```

## 错误处理最佳实践

1. **使用特定错误类型**：始终使用最具体的错误类型，而不是通用 AppError。

2. **添加错误详情**：尽可能提供错误详情，以帮助调试和客户端处理。

3. **保持一致的错误代码**：使用 `ERROR_CODES` 常量而不是硬编码错误代码。

4. **不要暴露敏感信息**：确保错误详情不包含敏感信息（如密码、内部路径等）。

5. **记录错误**：错误处理中间件会自动记录错误，但在关键位置可以添加额外的日志。

## 示例 API

项目包含了错误处理示例 API，可以用来测试不同类型的错误：

- `GET /api/examples/errors?type=badRequest|unauthorized|forbidden|notFound|conflict|tooManyRequests|internal`
- `GET /api/examples/errors/validation`
- `GET /api/examples/errors/database?subtype=connection|query|transaction|notFound`
- `GET /api/examples/errors/datasource?subtype=connection|authentication|notFound`
- `GET /api/examples/errors/query?subtype=syntax|timeout|permission`

## 扩展错误类型

如需添加新的错误类型，请按照以下步骤操作：

1. 在 `src/utils/errors/error-codes.ts` 中添加新的错误代码。
2. 在 `src/utils/errors/types/` 目录下创建新的错误类文件。
3. 确保新错误类继承自 `AppError`。
4. 在 `src/utils/errors/index.ts` 中导出新的错误类。
5. 添加单元测试。

## 处理异步错误

由于项目使用了 `express-async-errors` 库，异步函数中的错误会自动捕获并传递给错误处理中间件。

```typescript
// 这样写是安全的，错误会被自动捕获
router.get('/users/:id', async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) {
    throw ApiError.notFound(`用户 ${req.params.id} 不存在`);
  }
  res.json(user);
});
```

## 在现有代码中集成错误处理

### 控制器中使用错误处理

```typescript
// 之前的写法
export const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userService.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'User not found',
        message: `User with id ${userId} was not found`
      });
    }
    
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// 使用新的错误处理系统
export const getUserById = async (req, res) => {
  const userId = req.params.id;
  const user = await userService.findById(userId);
  
  if (!user) {
    throw ApiError.notFound(`用户 ${userId} 不存在`);
  }
  
  res.json(user);
};
```

### 服务层中使用错误处理

```typescript
// 之前的写法
export const createUser = async (userData) => {
  try {
    const existingUser = await userRepository.findByEmail(userData.email);
    if (existingUser) {
      return { error: true, message: 'Email already in use' };
    }
    return await userRepository.create(userData);
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// 使用新的错误处理系统
export const createUser = async (userData) => {
  const existingUser = await userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw ApiError.conflict('邮箱已被使用', { field: 'email', value: userData.email });
  }
  
  try {
    return await userRepository.create(userData);
  } catch (error) {
    // 数据库错误转换为应用错误
    if (error.code === 'ER_DUP_ENTRY') {
      throw DatabaseError.constraintError('违反唯一约束', { field: 'email' });
    }
    throw DatabaseError.queryError('创建用户失败', { error: error.message });
  }
};
```

## 错误处理中间件流程

1. **请求日志中间件**：为每个请求生成唯一ID并记录请求信息。
2. **应用路由和控制器**：处理业务逻辑，可能抛出各种错误。
3. **错误处理中间件**：捕获所有错误，包括：
   - 将原始错误转换为应用错误（如果不是AppError的实例）
   - 添加请求路径和请求ID
   - 记录错误日志
   - 发送格式化的错误响应

## 与前端集成

前端应用可以统一处理API错误：

```javascript
// 错误处理函数示例
function handleApiError(error) {
  const { response } = error;
  
  if (!response || !response.data) {
    // 网络错误或服务器无响应
    return showToast('网络错误，请检查网络连接后重试', 'error');
  }
  
  const { error: errorData } = response.data;
  
  if (!errorData) {
    // 非标准错误格式
    return showToast('发生未知错误', 'error');
  }
  
  // 根据错误码处理特定类型的错误
  switch (errorData.code) {
    case 10005: // UNAUTHORIZED
      logout();
      return showToast('会话已过期，请重新登录', 'warning');
      
    case 10004: // RESOURCE_NOT_FOUND
      return showToast(errorData.message || '请求的资源不存在', 'warning');
      
    // ... 其他特定错误处理
      
    default:
      return showToast(errorData.message || '请求处理失败', 'error');
  }
}
```
