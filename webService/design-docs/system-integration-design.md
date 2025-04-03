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
    code: string;
    message: string;
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

const prisma = new PrismaClient();

export class IntegrationService {
  constructor(private queryService: QueryService) {}

  // 获取所有集成
  async getIntegrations() {
    return prisma.integration.findMany();
  }

  // 获取集成详情
  async getIntegrationById(id: string) {
    return prisma.integration.findUnique({
      where: { id }
    });
  }

  // 创建集成
  async createIntegration(data: any) {
    return prisma.integration.create({
      data
    });
  }

  // 更新集成
  async updateIntegration(id: string, data: any) {
    return prisma.integration.update({
      where: { id },
      data
    });
  }

  // 删除集成
  async deleteIntegration(id: string) {
    return prisma.integration.delete({
      where: { id }
    });
  }

  // 执行集成查询
  async executeQuery(integrationId: string, params: any, pagination?: any) {
    // 1. 获取集成配置
    const integration = await this.getIntegrationById(integrationId);
    if (!integration) {
      throw new Error('Integration not found');
    }

    // 2. 验证参数
    this.validateParams(integration.config, params);

    // 3. 调用查询服务
    const result = await this.queryService.executeQuery({
      queryId: integration.queryId,
      params,
      pagination
    });

    // 4. 格式化结果
    return this.formatResult(result, integration.config);
  }

  // 验证参数
  private validateParams(config: any, params: any) {
    // 实现参数验证逻辑
  }

  // 格式化结果
  private formatResult(result: any, config: any) {
    // 实现结果格式化逻辑
    return result;
  }
}
```

### 4.3 控制器实现

```typescript
// src/controllers/integration.controller.ts
import { Request, Response } from 'express';
import { IntegrationService } from '../services/integration.service';

export class IntegrationController {
  constructor(private integrationService: IntegrationService) {}

  // 获取所有集成
  async getIntegrations(req: Request, res: Response) {
    try {
      const integrations = await this.integrationService.getIntegrations();
      res.json(integrations);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 获取单个集成
  async getIntegrationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const integration = await this.integrationService.getIntegrationById(id);
      if (!integration) {
        return res.status(404).json({ error: 'Integration not found' });
      }
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 创建集成
  async createIntegration(req: Request, res: Response) {
    try {
      const data = req.body;
      const integration = await this.integrationService.createIntegration(data);
      res.status(201).json(integration);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 更新集成
  async updateIntegration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const integration = await this.integrationService.updateIntegration(id, data);
      res.json(integration);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 删除集成
  async deleteIntegration(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await this.integrationService.deleteIntegration(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // 执行查询
  async executeQuery(req: Request, res: Response) {
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
      res.status(400).json({
        success: false,
        error: {
          message: error.message
        }
      });
    }
  }
}
```

### 4.4 路由配置

```typescript
// src/routes/integration.routes.ts
import { Router } from 'express';
import { IntegrationController } from '../controllers/integration.controller';
import { IntegrationService } from '../services/integration.service';
import { QueryService } from '../services/query.service';

const router = Router();
const queryService = new QueryService();
const integrationService = new IntegrationService(queryService);
const controller = new IntegrationController(integrationService);

// 集成管理路由
router.get('/v1/low-code/apis', controller.getIntegrations.bind(controller));
router.get('/v1/low-code/apis/:id', controller.getIntegrationById.bind(controller));
router.post('/v1/low-code/apis', controller.createIntegration.bind(controller));
router.put('/v1/low-code/apis/:id', controller.updateIntegration.bind(controller));
router.delete('/v1/low-code/apis/:id', controller.deleteIntegration.bind(controller));

// 数据查询路由
router.post('/data-service/query', controller.executeQuery.bind(controller));

export default router;
```

## 5. 测试与验证

1. **单元测试**
   - 为所有服务方法创建单元测试
   - 模拟依赖项和数据库调用

2. **集成测试**
   - 测试API端点响应
   - 验证完整流程

3. **前端测试**
   - 验证前端页面与新后端接口的交互

## 6. 部署与上线

1. **数据库迁移**
   - 执行数据库迁移脚本创建新表

2. **服务部署**
   - 部署新的后端API服务

3. **监控与日志**
   - 设置监控告警
   - 确保日志记录完整

## 7. 优势与价值

1. **简化集成**：外部系统可以简单地通过API访问数据，无需了解SQL
2. **代码复用**：复用现有查询服务和权限系统
3. **集中管理**：统一管理所有集成配置
4. **低代码方案**：通过UI配置实现，无需编写代码
5. **安全可控**：通过权限系统控制访问，防止滥用

## 8. 项目计划

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