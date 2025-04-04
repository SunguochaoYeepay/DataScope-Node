# 系统集成功能实现方案

## 1. 概述

系统集成功能允许用户创建、管理和执行数据集成接口，使外部系统能够通过简单的API访问DataScope中的数据，无需了解SQL或数据库结构。

## 2. 技术方案

### 2.1 数据库设计

```sql
CREATE TABLE tbl_integration (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  query_id VARCHAR(36) NOT NULL,
  type VARCHAR(50) NOT NULL,
  config JSON NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  updated_by VARCHAR(36),
  FOREIGN KEY (query_id) REFERENCES tbl_query(id)
);
```

### 2.2 后端API接口

#### 集成配置管理接口

| 方法   | 路径                          | 描述                |
|-------|-------------------------------|-------------------|
| GET   | /api/v1/low-code/apis         | 获取集成列表         |
| GET   | /api/v1/low-code/apis/:id     | 获取单个集成详情      |
| POST  | /api/v1/low-code/apis         | 创建新集成           |
| PUT   | /api/v1/low-code/apis/:id     | 更新集成             |
| DELETE| /api/v1/low-code/apis/:id     | 删除集成             |
| GET   | /api/v1/low-code/apis/:id/config | 获取API配置        |
| POST  | /api/v1/low-code/apis/:id/test   | 测试集成            |

#### 数据查询接口

| 方法   | 路径                     | 描述               |
|-------|--------------------------|-------------------|
| POST  | /api/data-service/query  | 执行集成查询        |

### 2.3 请求/响应格式

#### 集成对象结构

```typescript
interface Integration {
  id: string;
  name: string;
  description?: string;
  queryId: string;
  type: 'FORM' | 'TABLE' | 'CHART';
  config: {
    params?: Array<{
      name: string;
      required: boolean;
      defaultValue?: any;
      type: string;
    }>;
    tableConfig?: {
      columns: Array<{
        key: string;
        title: string;
        dataIndex: string;
        // 其他列配置
      }>;
      // 其他表格配置
    };
    chartConfig?: any;
    // 其他配置
  };
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}
```

#### 数据查询请求格式

```typescript
interface QueryRequest {
  integrationId: string;
  params?: Record<string, any>;
  pagination?: {
    page: number;
    pageSize: number;
  };
  sorting?: Array<{
    field: string;
    order: 'asc' | 'desc';
  }>;
}
```

#### 数据查询响应格式

```typescript
interface QueryResponse {
  success: boolean;
  data?: {
    records: any[];
    total?: number;
    page?: number;
    pageSize?: number;
    totalPages?: number;
  };
  error?: {
    code: number;
    type: string;
    message: string;
    timestamp: string;
    path: string;
    requestId: string;
    details?: any;
  };
}
```

## 3. 实现步骤

### 3.1 基础实现

1. **创建数据模型**
   - 定义Prisma模型
   - 创建数据库迁移

2. **实现集成服务**
   - 创建集成CRUD操作
   - 实现配置验证

3. **实现集成控制器**
   - 创建REST API端点
   - 添加参数验证
   - 实现集成测试功能

4. **实现查询执行服务**
   - 解析集成配置
   - 调用查询服务
   - 格式化结果

### 3.2 权限和安全

1. **集成现有权限系统**
   - 集成用户与查询权限

2. **参数验证**
   - 根据配置验证参数
   - 防止注入攻击

3. **日志与审计**
   - 记录所有API调用
   - 追踪系统集成使用情况

## 4. 具体实现方案

### 4.1 Prisma模型定义

```prisma
model Integration {
  id          String   @id @default(uuid())
  name        String
  description String?  @db.Text
  queryId     String
  type        String
  config      Json
  status      String   @default("DRAFT")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  createdBy   String?
  updatedBy   String?
  
  // 关联
  query       Query    @relation(fields: [queryId], references: [id])

  @@map("tbl_integration")
}
```

### 4.2 服务层实现

```typescript
// src/services/integration.service.ts
import { PrismaClient } from '@prisma/client';
import { QueryService } from './query.service';
import { ApiError } from '../utils/errors';
import logger from '../utils/logger';

const prisma = new PrismaClient();

export class IntegrationService {
  constructor(private queryService: QueryService) {}

  // 获取所有集成
  async getIntegrations() {
    try {
    return prisma.integration.findMany();
    } catch (error) {
      logger.error('获取集成列表失败', { error });
      throw ApiError.internal('获取集成列表失败', { originalError: error.message });
    }
  }

  // 获取集成详情
  async getIntegrationById(id: string) {
    try {
      const integration = await prisma.integration.findUnique({
      where: { id }
    });
      
      if (!integration) {
        throw ApiError.notFound(`ID为${id}的集成配置不存在`);
      }
      
      return integration;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`获取集成详情失败: ${id}`, { error });
      throw ApiError.internal('获取集成详情失败', { originalError: error.message });
    }
  }

  // 创建集成
  async createIntegration(data: any) {
    try {
      // 验证关联的查询是否存在
      const queryExists = await prisma.query.findUnique({
        where: { id: data.queryId }
      });
      
      if (!queryExists) {
        throw ApiError.badRequest(`ID为${data.queryId}的查询不存在`);
      }
      
    return prisma.integration.create({
      data
    });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error('创建集成失败', { error, data });
      throw ApiError.internal('创建集成失败', { originalError: error.message });
    }
  }

  // 更新集成
  async updateIntegration(id: string, data: any) {
    try {
      // 检查集成是否存在
      const integration = await this.getIntegrationById(id);
      
      // 如果更新了queryId，验证新的查询是否存在
      if (data.queryId && data.queryId !== integration.queryId) {
        const queryExists = await prisma.query.findUnique({
          where: { id: data.queryId }
        });
        
        if (!queryExists) {
          throw ApiError.badRequest(`ID为${data.queryId}的查询不存在`);
        }
      }
      
    return prisma.integration.update({
      where: { id },
      data
    });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`更新集成失败: ${id}`, { error, data });
      throw ApiError.internal('更新集成失败', { originalError: error.message });
    }
  }

  // 删除集成
  async deleteIntegration(id: string) {
    try {
      // 检查集成是否存在
      await this.getIntegrationById(id);
      
    return prisma.integration.delete({
      where: { id }
    });
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`删除集成失败: ${id}`, { error });
      throw ApiError.internal('删除集成失败', { originalError: error.message });
    }
  }

  // 执行集成查询
  async executeQuery(integrationId: string, params: any, pagination?: any, sorting?: any) {
    try {
    // 1. 获取集成配置
    const integration = await this.getIntegrationById(integrationId);
      
      // 2. 获取关联的查询信息
      const query = await prisma.query.findUnique({
        where: { id: integration.queryId },
        include: {
          dataSource: true
        }
      });
      
      if (!query) {
        throw ApiError.notFound(`ID为${integration.queryId}的查询不存在`);
      }
      
      // 3. 验证参数
    this.validateParams(integration.config, params);

      // 4. 准备执行SQL
      // 获取SQL内容和数据源ID
      const sqlContent = query.sqlContent;
      const dataSourceId = query.dataSourceId;
      
      // 处理SQL参数
      const sqlParams = this.prepareSqlParams(integration.config, params);
      
      // 5. 执行查询
      // 调用现有的查询服务执行查询
      const result = await this.queryService.executeQuery(
        dataSourceId,
        sqlContent,
        sqlParams,
        {
          page: pagination?.page,
          pageSize: pagination?.pageSize,
          sort: sorting?.field,
          order: sorting?.order
        }
      );
      
      // 6. 格式化结果
      return this.formatResult(result, integration.config);
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      logger.error(`执行集成查询失败: ${integrationId}`, { 
        error, 
      params,
        pagination,
        sorting
      });
      throw ApiError.internal('执行集成查询失败', { originalError: error.message });
    }
  }

  // 准备SQL参数
  private prepareSqlParams(config: any, params: any): any[] {
    // 获取参数配置
    const paramConfigs = config.params || [];
    const sqlParams: any[] = [];
    
    // 按照参数配置顺序准备SQL参数
    for (const paramConfig of paramConfigs) {
      let value = params[paramConfig.name];
      
      // 如果参数未提供但有默认值，使用默认值
      if ((value === undefined || value === null) && paramConfig.defaultValue !== undefined) {
        value = paramConfig.defaultValue;
      }
      
      // 进行必要的类型转换
      if (value !== undefined && value !== null) {
        switch (paramConfig.type) {
          case 'number':
            value = Number(value);
            break;
          case 'boolean':
            value = Boolean(value);
            break;
          case 'string':
          default:
            value = String(value);
            break;
        }
      }
      
      sqlParams.push(value);
    }
    
    return sqlParams;
  }

  // 验证参数
  private validateParams(config: any, params: any) {
    // 获取参数配置
    const paramConfigs = config.params || [];
    
    // 检查必填参数
    for (const paramConfig of paramConfigs) {
      if (paramConfig.required && (params[paramConfig.name] === undefined || params[paramConfig.name] === null)) {
        throw ApiError.badRequest(`参数${paramConfig.name}为必填项`);
      }
      
      // TODO: 添加参数类型验证
    }
  }

  // 格式化结果
  private formatResult(result: any, config: any) {
    // 处理可能的空结果
    if (!result || !result.rows) {
      return {
        records: [],
        total: 0,
        page: 1,
        pageSize: 10,
        totalPages: 0
      };
    }
    
    // 获取原始查询结果
    const { rows, rowCount, fields, totalCount, page, pageSize, totalPages } = result;
    
    // 获取表格配置
    const tableConfig = config.tableConfig || { columns: [] };
    
    // 映射字段
    let records = rows;
    if (tableConfig.columns && tableConfig.columns.length > 0) {
      // 如果定义了列映射，则应用列映射
      records = rows.map((row: any) => {
        const mappedRow: any = {};
        
        for (const column of tableConfig.columns) {
          // 使用dataIndex作为原始字段名，key作为映射后的字段名
          if (column.dataIndex && column.key) {
            // 获取原始值
            const originalValue = row[column.dataIndex];
            
            // 应用格式化器（如果有）
            let formattedValue = originalValue;
            if (column.formatter) {
              try {
                // 注意：实际实现中，这里可能需要一个更安全的方式来执行格式化器
                // 例如使用预定义的格式化函数而不是eval
                const formatFunc = new Function('value', 'row', 'return ' + column.formatter);
                formattedValue = formatFunc(originalValue, row);
              } catch (error) {
                logger.warn('格式化字段值失败', { error, column, value: originalValue });
                formattedValue = originalValue;
              }
            }
            
            // 设置映射后的值
            mappedRow[column.key] = formattedValue;
          }
        }
        
        return mappedRow;
      });
    }
    
    // 构建返回结果
    const formattedResult = {
      records,
      total: totalCount || rowCount,
      page: page || 1,
      pageSize: pageSize || records.length,
      totalPages: totalPages || 1
    };
    
    // 可选：添加元数据
    if (config.includeMetadata) {
      formattedResult.metadata = {
        fields: fields.map((f: any) => ({
          name: f.name,
          type: f.type
        })),
        query: {
          executionTime: result.executionTime
        }
      };
    }
    
    return formattedResult;
  }
}
```

### 4.3 控制器实现

```typescript
// src/controllers/integration.controller.ts
import { Request, Response, NextFunction } from 'express';
import { IntegrationService } from '../services/integration.service';
import { ApiError } from '../utils/apiError';

export class IntegrationController {
  constructor(private integrationService: IntegrationService) {}

  // 获取所有集成
  async getIntegrations(req: Request, res: Response, next: NextFunction) {
    try {
      const integrations = await this.integrationService.getIntegrations();
      res.json({
        success: true,
        data: integrations
      });
    } catch (error) {
      next(error);
    }
  }

  // 获取单个集成
  async getIntegrationById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const integration = await this.integrationService.getIntegrationById(id);
      if (!integration) {
        throw ApiError.notFound('集成配置不存在');
      }
      res.json({
        success: true,
        data: integration
      });
    } catch (error) {
      next(error);
    }
  }

  // 创建集成
  async createIntegration(req: Request, res: Response, next: NextFunction) {
    try {
      const data = req.body;
      const integration = await this.integrationService.createIntegration(data);
      res.status(201).json({
        success: true,
        data: integration
      });
    } catch (error) {
      next(error);
    }
  }

  // 更新集成
  async updateIntegration(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const data = req.body;
      const integration = await this.integrationService.updateIntegration(id, data);
      res.json({
        success: true,
        data: integration
      });
    } catch (error) {
      next(error);
    }
  }

  // 删除集成
  async deleteIntegration(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await this.integrationService.deleteIntegration(id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  // 执行查询
  async executeQuery(req: Request, res: Response, next: any) {
    try {
      const { integrationId, params, pagination } = req.body;
      const result = await this.integrationService.executeQuery(
        integrationId,
        params,
        pagination
      );
      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      // 将错误传递给全局错误处理中间件
      next(error);
    }
  }
}
```

### 4.4 路由配置

```typescript
// src/routes/integration.routes.ts
import { Router } from 'express';
import { IntegrationController } from '../controllers/integration.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { validate } from '../utils/validate';
import { body, param } from 'express-validator';

const router = Router();
const controller = new IntegrationController();

// 集成管理路由
// 获取集成列表
router.get(
  '/v1/low-code/apis',
  authMiddleware.authenticate,
  controller.getIntegrations
);

// 获取单个集成
router.get(
  '/v1/low-code/apis/:id',
  authMiddleware.authenticate,
  validate([
    param('id').isUUID().withMessage('集成ID必须是有效的UUID')
  ]),
  controller.getIntegrationById
);

// 创建集成
router.post(
  '/v1/low-code/apis',
  authMiddleware.authenticate,
  validate([
    body('name').notEmpty().withMessage('集成名称不能为空'),
    body('queryId').isUUID().withMessage('查询ID必须是有效的UUID'),
    body('type').isIn(['FORM', 'TABLE', 'CHART']).withMessage('集成类型必须是FORM、TABLE或CHART之一'),
    body('config').isObject().withMessage('配置必须是有效的JSON对象')
  ]),
  controller.createIntegration
);

// 更新集成
router.put(
  '/v1/low-code/apis/:id',
  authMiddleware.authenticate,
  validate([
    param('id').isUUID().withMessage('集成ID必须是有效的UUID'),
    body('name').optional().notEmpty().withMessage('集成名称不能为空'),
    body('queryId').optional().isUUID().withMessage('查询ID必须是有效的UUID'),
    body('type').optional().isIn(['FORM', 'TABLE', 'CHART']).withMessage('集成类型必须是FORM、TABLE或CHART之一'),
    body('config').optional().isObject().withMessage('配置必须是有效的JSON对象')
  ]),
  controller.updateIntegration
);

// 删除集成
router.delete(
  '/v1/low-code/apis/:id',
  authMiddleware.authenticate,
  validate([
    param('id').isUUID().withMessage('集成ID必须是有效的UUID')
  ]),
  controller.deleteIntegration
);

// 获取API配置
router.get(
  '/v1/low-code/apis/:id/config',
  authMiddleware.authenticate,
  validate([
    param('id').isUUID().withMessage('集成ID必须是有效的UUID')
  ]),
  controller.getIntegrationConfig
);

// 测试集成
router.post(
  '/v1/low-code/apis/:id/test',
  authMiddleware.authenticate,
  validate([
    param('id').isUUID().withMessage('集成ID必须是有效的UUID'),
    body('params').optional().isObject().withMessage('参数必须是有效的JSON对象')
  ]),
  controller.testIntegration
);

// 数据查询接口
router.post(
  '/data-service/query',
  validate([
    body('integrationId').isUUID().withMessage('集成ID必须是有效的UUID'),
    body('params').optional().isObject().withMessage('参数必须是有效的JSON对象'),
    body('pagination').optional().isObject().withMessage('分页参数必须是有效的JSON对象'),
    body('sorting').optional().isObject().withMessage('排序参数必须是有效的JSON对象')
  ]),
  controller.executeQuery
);

export default router;
```

## 5. 接口实现规范

### 5.1 集成管理接口

#### 5.1.1 获取集成列表

**请求方法：** GET

**路径：** `/api/v1/low-code/apis`

**请求头：**
```
Authorization: Bearer {token}
```

**响应格式：**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-example-1",
      "name": "用户查询接口",
      "description": "查询系统用户信息",
      "queryId": "uuid-query-1",
      "type": "TABLE",
      "config": {...},
      "status": "ACTIVE",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    },
    ...
  ]
}
```

#### 5.1.2 获取单个集成

**请求方法：** GET

**路径：** `/api/v1/low-code/apis/:id`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "uuid-example-1",
    "name": "用户查询接口",
    "description": "查询系统用户信息",
    "queryId": "uuid-query-1",
    "type": "TABLE",
    "config": {
      "params": [
        {
          "name": "username",
          "label": "用户名",
          "type": "string",
          "required": true
        }
      ],
      "tableConfig": {
        "columns": [
          {
            "key": "id",
            "dataIndex": "id",
            "title": "ID"
          },
          {
            "key": "username",
            "dataIndex": "username",
            "title": "用户名"
          }
        ]
      }
    },
    "status": "ACTIVE",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### 5.1.3 创建集成

**请求方法：** POST

**路径：** `/api/v1/low-code/apis`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体：**
```json
{
  "name": "用户查询接口",
  "description": "查询系统用户信息",
  "queryId": "uuid-query-1",
  "type": "TABLE",
  "config": {
    "params": [
      {
        "name": "username",
        "label": "用户名",
        "type": "string",
        "required": true
      }
    ],
    "tableConfig": {
      "columns": [
        {
          "key": "id",
          "dataIndex": "id",
          "title": "ID"
        },
        {
          "key": "username",
          "dataIndex": "username",
          "title": "用户名"
        }
      ]
    }
  },
  "status": "DRAFT"
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "uuid-example-1",
    "name": "用户查询接口",
    "description": "查询系统用户信息",
    "queryId": "uuid-query-1",
    "type": "TABLE",
    "config": {...},
    "status": "DRAFT",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

#### 5.1.4 更新集成

**请求方法：** PUT

**路径：** `/api/v1/low-code/apis/:id`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**请求体：**
```json
{
  "name": "更新后的用户查询接口",
  "description": "查询系统用户信息（已更新）",
  "config": {
    "params": [
      {
        "name": "username",
        "label": "用户名",
        "type": "string",
        "required": true
      },
      {
        "name": "status",
        "label": "状态",
        "type": "string",
        "required": false
      }
    ],
    "tableConfig": {...}
  },
  "status": "ACTIVE"
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "uuid-example-1",
    "name": "更新后的用户查询接口",
    "description": "查询系统用户信息（已更新）",
    "queryId": "uuid-query-1",
    "type": "TABLE",
    "config": {...},
    "status": "ACTIVE",
    "createdAt": "2023-01-01T00:00:00.000Z",
    "updatedAt": "2023-01-01T01:00:00.000Z"
  }
}
```

#### 5.1.5 更新集成状态

**请求方法：** PATCH

**路径：** `/api/v1/low-code/apis/:id/status`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**请求体：**
```json
{
  "status": "ACTIVE"
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "uuid-example-1",
    "status": "ACTIVE",
    "updatedAt": "2023-01-01T01:00:00.000Z"
  }
}
```

#### 5.1.6 删除集成

**请求方法：** DELETE

**路径：** `/api/v1/low-code/apis/:id`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**响应格式：**
```
HTTP/1.1 204 No Content
```

#### 5.1.7 获取API配置

**请求方法：** GET

**路径：** `/api/v1/low-code/apis/:id/config`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**响应格式：**
```json
{
  "success": true,
  "data": {
    "apiEndpoint": "/api/data-service/query",
    "method": "POST",
    "requestFormat": {
      "integrationId": "uuid-example-1",
      "params": {
        "username": "示例值"
      },
      "pagination": {
        "page": 1,
        "pageSize": 10
      }
    },
    "responseFormat": {
      "success": true,
      "data": {
        "records": [
          {
            "id": 1,
            "username": "user1"
          }
        ],
        "total": 100,
        "page": 1,
        "pageSize": 10,
        "totalPages": 10
      }
    },
    "parameterDocs": [
      {
        "name": "username",
        "description": "用户名",
        "type": "string",
        "required": true
      }
    ]
  }
}
```

#### 5.1.8 测试集成

**请求方法：** POST

**路径：** `/api/v1/low-code/apis/:id/test`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**请求体：**
```json
{
  "params": {
    "username": "testuser"
  },
  "pagination": {
    "page": 1,
    "pageSize": 10
  }
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "username": "testuser"
      }
    ],
    "total": 1,
    "page": 1,
    "pageSize": 10,
    "totalPages": 1,
    "executionTime": "120ms"
  }
}
```

### 5.2 数据查询接口

#### 5.2.1 执行集成查询

**请求方法：** POST

**路径：** `/api/data-service/query`

**请求头：**
```
Content-Type: application/json
```

**请求体：**
```json
{
  "integrationId": "uuid-example-1",
  "params": {
    "username": "searchuser",
    "status": "active"
  },
  "pagination": {
    "page": 1,
    "pageSize": 20
  },
  "sorting": [
    {
      "field": "createdAt",
      "order": "desc"
    }
  ]
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "records": [
      {
        "id": 1,
        "username": "searchuser",
        "email": "user@example.com",
        "status": "active",
        "lastLogin": "2023-01-01T00:00:00.000Z"
      },
      // ...更多记录
    ],
    "total": 42,
    "page": 1,
    "pageSize": 20,
    "totalPages": 3
  }
}
```

**错误响应示例：**
```json
{
  "success": false,
  "error": {
    "code": 400,
    "type": "BAD_REQUEST",
    "message": "参数username为必填项",
    "timestamp": "2023-01-01T00:00:00.000Z",
    "path": "/api/data-service/query",
    "requestId": "req-uuid-123"
  }
}
```

### 5.3 API密钥管理接口（可选）

#### 5.3.1 创建API密钥

**请求方法：** POST

**路径：** `/api/keys`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**请求体：**
```json
{
  "name": "外部系统集成密钥",
  "description": "用于ERP系统集成",
  "expiresAt": "2024-12-31T23:59:59.999Z"
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "key-id-1",
    "name": "外部系统集成密钥",
    "description": "用于ERP系统集成",
    "key": "sk_test_abcdefghijklmnopqrstuvwxyz123456",
    "enabled": true,
    "expiresAt": "2024-12-31T23:59:59.999Z",
    "createdAt": "2023-01-01T00:00:00.000Z"
  },
  "message": "API密钥已创建，请保存密钥值，它不会再次显示"
}
```

#### 5.3.2 获取API密钥列表

**请求方法：** GET

**路径：** `/api/keys`

**请求头：**
```
Authorization: Bearer {token}
```

**响应格式：**
```json
{
  "success": true,
  "data": [
    {
      "id": "key-id-1",
      "name": "外部系统集成密钥",
      "description": "用于ERP系统集成",
      "enabled": true,
      "expiresAt": "2024-12-31T23:59:59.999Z",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "lastUsed": "2023-01-02T00:00:00.000Z"
    },
    // ...更多API密钥
  ]
}
```

#### 5.3.3 更新API密钥状态

**请求方法：** PUT

**路径：** `/api/keys/:id/status`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**
- `id`: API密钥ID

**请求体：**
```json
{
  "enabled": false
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "key-id-1",
    "enabled": false,
    "updatedAt": "2023-01-03T00:00:00.000Z"
  }
}
```

#### 5.3.4 删除API密钥

**请求方法：** DELETE

**路径：** `/api/keys/:id`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: API密钥ID

**响应格式：**
```
HTTP/1.1 204 No Content
```

### 5.4 集成访问权限控制接口（可选）

#### 5.4.1 设置集成访问权限

**请求方法：** PUT

**路径：** `/api/v1/low-code/apis/:id/access`

**请求头：**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**请求体：**
```json
{
  "publicAccess": false,
  "allowedApiKeys": ["key-id-1", "key-id-2"],
  "requireAuthentication": true
}
```

**响应格式：**
```json
{
  "success": true,
  "data": {
    "id": "uuid-example-1",
    "publicAccess": false,
    "allowedApiKeys": ["key-id-1", "key-id-2"],
    "requireAuthentication": true,
    "updatedAt": "2023-01-01T00:00:00.000Z"
  }
}
```

### 5.5 统计与监控接口（可选）

#### 5.5.1 获取集成使用统计

**请求方法：** GET

**路径：** `/api/v1/low-code/apis/stats`

**请求头：**
```
Authorization: Bearer {token}
```

**查询参数：**
- `startDate`: 开始日期（ISO格式）
- `endDate`: 结束日期（ISO格式）
- `integrationId`: 集成ID（可选）

**响应格式：**
```json
{
  "success": true,
  "data": {
    "totalCalls": 1245,
    "uniqueUsers": 42,
    "averageResponseTime": 150,
    "errorRate": 0.02,
    "topIntegrations": [
      {
        "id": "uuid-example-1",
        "name": "用户查询接口",
        "calls": 523
      },
      {
        "id": "uuid-example-2",
        "name": "订单查询接口",
        "calls": 412
      }
    ],
    "dailyStats": [
      {
        "date": "2023-01-01",
        "calls": 120,
        "errors": 2
      },
      {
        "date": "2023-01-02",
        "calls": 145,
        "errors": 3
      }
    ]
  }
}
```

#### 5.5.2 获取集成访问日志

**请求方法：** GET

**路径：** `/api/v1/low-code/apis/:id/logs`

**请求头：**
```
Authorization: Bearer {token}
```

**路径参数：**
- `id`: 集成ID (UUID格式)

**查询参数：**
- `page`: 页码（默认1）
- `pageSize`: 每页记录数（默认20）
- `startDate`: 开始日期（ISO格式）
- `endDate`: 结束日期（ISO格式）

**响应格式：**
```json
{
  "success": true,
  "data": {
    "logs": [
      {
        "id": "log-id-1",
        "timestamp": "2023-01-01T12:34:56.789Z",
        "ip": "192.168.1.1",
        "method": "POST",
        "path": "/api/data-service/query",
        "status": 200,
        "responseTime": 120,
        "user": "user@example.com",
        "apiKey": "key-id-1"
      },
      // ...更多日志
    ],
    "total": 156,
    "page": 1,
    "pageSize": 20,
    "totalPages": 8
  }
}
```

## 6. 测试与验证

1. **单元测试**
   - 为所有服务方法创建单元测试
   - 模拟依赖项和数据库调用

2. **集成测试**
   - 测试API端点响应
   - 验证完整流程

3. **前端测试**
   - 验证前端页面与新后端接口的交互

## 7. 部署与上线

1. **数据库迁移**
   - 执行数据库迁移脚本创建新表

2. **服务部署**
   - 部署新的后端API服务

3. **监控与日志**
   - 设置监控告警
   - 确保日志记录完整

## 8. 优势与价值

1. **简化集成**：外部系统可以简单地通过API访问数据，无需了解SQL
2. **代码复用**：复用现有查询服务和权限系统
3. **集中管理**：统一管理所有集成配置
4. **低代码方案**：通过UI配置实现，无需编写代码
5. **安全可控**：通过权限系统控制访问，防止滥用

## 9. 项目计划

1. **设计与准备** (1天)
   - 完善数据库设计
   - 整理API规范

2. **基础开发** (2天)
   - 实现数据模型
   - 创建基本服务和接口

3. **核心功能** (3天)
   - 实现查询执行
   - 参数验证和结果格式化

4. **权限与安全** (2天)
   - 集成权限系统
   - 添加安全措施

5. **测试与优化** (2天)
   - 编写测试用例
   - 性能优化

总计：约10个工作日 