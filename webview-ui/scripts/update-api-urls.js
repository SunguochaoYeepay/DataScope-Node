#!/usr/bin/env node

/**
 * 更新API URL适配脚本
 * 此脚本用于自动更新前端代码中的API URL以适配后端API规范
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 源文件路径
const datasourcePath = path.join(__dirname, '..', 'src', 'services', 'datasource.ts');
const queryPath = path.join(__dirname, '..', 'src', 'services', 'query.ts');

// 读取文件内容
console.log('读取datasource.ts文件...');
let datasourceContent = fs.readFileSync(datasourcePath, 'utf8');

console.log('读取query.ts文件...');
let queryContent = fs.readFileSync(queryPath, 'utf8');

// 定义API端点映射
const urlMappings = [
  // 数据源管理API路径
  { from: /\/api\/datasources\/test/g, to: '/api/datasources/test-connection' },
  { from: /\/api\/metadata\/([^\/]+)\/tables/g, to: '/api/metadata/datasources/$1/tables' },
  { from: /\/api\/metadata\/([^\/]+)\/sync/g, to: '/api/metadata/datasources/$1/sync' },
  { from: /\/api\/metadata\/([^\/]+)\/search/g, to: '/api/metadata/datasources/$1/search' },
  { from: /\/api\/metadata\/([^\/]+)\/sync-history/g, to: '/api/metadata/datasources/$1/sync-history' },
  { from: /\/api\/metadata\/([^\/]+)\/columns\/analyze/g, to: '/api/metadata/datasources/$1/columns/analyze' },
  { from: /\/api\/metadata\/([^\/]+)\/relationships/g, to: '/api/metadata/datasources/$1/relationships' },
  
  // 查询管理API路径
  { from: /\/api\/queries\/nl-to-sql/g, to: '/api/queries/nl-to-sql' },
  { from: /\/api\/queries\/favorites/g, to: '/api/queries/favorites' },
  { from: /\/api\/queries\/([^\/]+)\/execute/g, to: '/api/queries/$1/execute' },
  { from: /\/api\/queries\/([^\/]+)\/history/g, to: '/api/queries/$1/history' },
  { from: /\/api\/queries\/([^\/]+)\/execution-plan/g, to: '/api/queries/$1/execution-plan' },
  { from: /\/api\/queries\/([^\/]+)\/parameters/g, to: '/api/queries/$1/parameters' },
  { from: /\/api\/queries\/([^\/]+)\/versions/g, to: '/api/queries/$1/versions' },
  { from: /\/api\/queries\/versions\/([^\/]+)/g, to: '/api/queries/versions/$1' },
  
  // 集成管理API路径
  { from: /\/api\/low-code\/apis/g, to: '/api/low-code/apis' },
  { from: /\/api\/integrations/g, to: '/api/integrations' },
  { from: /\/api\/integration\/execute-query/g, to: '/api/integration/execute-query' },
];

// 更新API端点
console.log('更新API端点...');
urlMappings.forEach(mapping => {
  datasourceContent = datasourceContent.replace(mapping.from, mapping.to);
  queryContent = queryContent.replace(mapping.from, mapping.to);
});

// 更新端口号
console.log('更新API端口号...');
datasourceContent = datasourceContent.replace(/http:\/\/localhost:3000/g, 'http://localhost:3200');
queryContent = queryContent.replace(/http:\/\/localhost:3000/g, 'http://localhost:3200');

// 写入更新后的文件
console.log('写入更新后的文件...');
fs.writeFileSync(datasourcePath, datasourceContent);
fs.writeFileSync(queryPath, queryContent);

console.log('API URL更新完成！现在前端代码已适配后端API规范。');