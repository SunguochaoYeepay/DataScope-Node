// 更新Swagger文档，合并缺失的API端点
import fs from 'fs';

// 读取现有Swagger文件
const existingSwagger = JSON.parse(fs.readFileSync('./swagger-current-full.json', 'utf8'));
// 读取缺失的端点文件
const missingEndpoints = JSON.parse(fs.readFileSync('./swagger-missing-endpoints.json', 'utf8'));

// 合并路径
Object.assign(existingSwagger.paths, missingEndpoints.paths);

// 合并组件模式
if (missingEndpoints.components && missingEndpoints.components.schemas) {
  // 确保components存在
  if (!existingSwagger.components) {
    existingSwagger.components = {};
  }
  // 确保schemas存在
  if (!existingSwagger.components.schemas) {
    existingSwagger.components.schemas = {};
  }
  // 合并schemas
  Object.assign(existingSwagger.components.schemas, missingEndpoints.components.schemas);
}

// 添加版本管理的标签（如果不存在）
let hasVersionManagementTag = false;
for (const tag of existingSwagger.tags || []) {
  if (tag.name === "版本管理") {
    hasVersionManagementTag = true;
    break;
  }
}

if (!hasVersionManagementTag) {
  if (!existingSwagger.tags) {
    existingSwagger.tags = [];
  }
  existingSwagger.tags.push({
    name: "版本管理",
    description: "查询版本的管理和操作"
  });
}

// 记录更新统计
const newPathsCount = Object.keys(missingEndpoints.paths).length;
const newSchemasCount = missingEndpoints.components && missingEndpoints.components.schemas 
  ? Object.keys(missingEndpoints.components.schemas).length 
  : 0;

// 将更新后的文档写入文件
fs.writeFileSync('./swagger-updated-full.json', JSON.stringify(existingSwagger, null, 2), 'utf8');

console.log(`Swagger文档更新完成：`);
console.log(`- 添加了 ${newPathsCount} 个新API路径`);
console.log(`- 添加了 ${newSchemasCount} 个新数据模型`);
console.log(`- 更新后的文档已保存至 swagger-updated-full.json`);