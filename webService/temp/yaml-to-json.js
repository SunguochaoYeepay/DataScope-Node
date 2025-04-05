const fs = require('fs');
const yaml = require('yamljs');
const path = require('path');

// 读取YAML文件并转换为JSON
const yamlPath = path.join(__dirname, '../public/openapi/full-spec.yaml');
const jsonPath = path.join(__dirname, './swagger.json');

try {
  // 解析YAML文件
  const yamlContent = yaml.load(yamlPath);
  
  // 将对象转换为格式化的JSON字符串
  const jsonContent = JSON.stringify(yamlContent, null, 2);
  
  // 写入JSON文件
  fs.writeFileSync(jsonPath, jsonContent);
  
  console.log(`成功将YAML转换为JSON，保存在: ${jsonPath}`);
  
  // 输出JSON前100个字符预览
  console.log(jsonContent.substring(0, 100) + '...');
} catch (error) {
  console.error('转换过程中出错:', error);
}