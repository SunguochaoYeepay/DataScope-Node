import fs from 'fs';

// 读取所有部分
const part1 = JSON.parse(fs.readFileSync('swagger-part1.json', 'utf8'));
const part2 = JSON.parse(fs.readFileSync('swagger-part2-datasources.json', 'utf8'));
const part3 = JSON.parse(fs.readFileSync('swagger-part3-integration.json', 'utf8'));
const part4 = JSON.parse(fs.readFileSync('swagger-part4-schemas.json', 'utf8'));

// 合并paths
const paths = {
  ...part1.paths,
  ...part2.paths,
  ...part3.paths
};

// 创建完整文档
const fullSwagger = {
  openapi: part1.openapi,
  info: part1.info,
  servers: part1.servers,
  tags: part1.tags,
  paths: paths,
  components: part4.components
};

// 写入文件
fs.writeFileSync('swagger-current-full.json', JSON.stringify(fullSwagger, null, 2));
console.log('成功合并Swagger文件：swagger-current-full.json');