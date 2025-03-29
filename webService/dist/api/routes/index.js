"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const datasource_routes_1 = __importDefault(require("./datasource.routes"));
const query_routes_1 = __importDefault(require("./query.routes"));
const metadata_routes_1 = __importDefault(require("./metadata.routes"));
const examples_routes_1 = __importDefault(require("./examples.routes"));
const plan_visualization_routes_1 = __importDefault(require("./plan-visualization.routes"));
const query_plan_routes_1 = __importDefault(require("./query-plan.routes"));
const router = (0, express_1.Router)();
// API路由
router.use('/datasources', datasource_routes_1.default);
router.use('/queries', query_routes_1.default);
router.use('/metadata', metadata_routes_1.default);
router.use('/examples', examples_routes_1.default);
router.use('/plan-visualization', plan_visualization_routes_1.default);
router.use('/query-plans', query_plan_routes_1.default);
// API文档
router.get('/', (req, res) => {
    res.redirect('/api-docs');
});
exports.default = router;
//# sourceMappingURL=index.js.map