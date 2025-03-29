"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const env_1 = __importDefault(require("./env"));
// Swagger 定义
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'DataScope API',
            version: '1.0.0',
            description: '数据库可视化查询管理与元数据分析API',
            license: {
                name: 'MIT',
                url: 'https://opensource.org/licenses/MIT',
            },
            contact: {
                name: 'API Support',
                email: 'support@example.com',
            },
        },
        servers: [
            {
                url: `http://${env_1.default.service.host}:${env_1.default.service.port}${env_1.default.service.apiPrefix}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/api/routes/*.ts', './src/types/*.ts'],
};
const specs = (0, swagger_jsdoc_1.default)(options);
/**
 * 设置Swagger UI
 */
const setupSwagger = (app) => {
    // Swagger API 文档路由
    app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(specs, {
        explorer: true,
        customCss: '.swagger-ui .topbar { display: none }',
    }));
};
exports.default = setupSwagger;
//# sourceMappingURL=swagger.js.map