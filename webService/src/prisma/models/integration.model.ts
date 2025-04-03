import { Integration } from '@prisma/client';

/**
 * @swagger
 * components:
 *   schemas:
 *     Integration:
 *       type: object
 *       required:
 *         - id
 *         - name
 *         - queryId
 *         - type
 *         - config
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: 集成ID
 *         name:
 *           type: string
 *           description: 集成名称
 *         description:
 *           type: string
 *           description: 集成描述
 *         queryId:
 *           type: string
 *           format: uuid
 *           description: 关联的查询ID
 *         type:
 *           type: string
 *           enum: [FORM, TABLE, CHART]
 *           description: 集成类型
 *         config:
 *           type: object
 *           description: 集成配置
 *         status:
 *           type: string
 *           enum: [DRAFT, ACTIVE, INACTIVE]
 *           description: 集成状态
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: 创建时间
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: 更新时间
 *         createdBy:
 *           type: string
 *           description: 创建者ID
 *         updatedBy:
 *           type: string
 *           description: 更新者ID
 *       example:
 *         id: "550e8400-e29b-41d4-a716-446655440000"
 *         name: "用户列表API"
 *         description: "提供用户数据查询服务"
 *         queryId: "550e8400-e29b-41d4-a716-446655440001"
 *         type: "TABLE"
 *         config:
 *           params: []
 *           tableConfig:
 *             columns: []
 *         status: "ACTIVE"
 *         createdAt: "2023-01-01T00:00:00.000Z"
 *         updatedAt: "2023-01-01T00:00:00.000Z"
 */

export class IntegrationModel {
  constructor(private data: Integration) {}

  toJSON() {
    return {
      id: this.data.id,
      name: this.data.name,
      description: this.data.description,
      queryId: this.data.queryId,
      type: this.data.type,
      config: this.data.config,
      status: this.data.status,
      createdAt: this.data.createdAt,
      updatedAt: this.data.updatedAt,
      createdBy: this.data.createdBy,
      updatedBy: this.data.updatedBy
    };
  }
} 