import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 读取文件
const filePath = path.resolve(__dirname, './src/services/datasource.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 定义需要替换的模式和替换内容
const replacements = [
  // 修复API路径问题
  {
    pattern: /METADATA_API_BASE_URL}\/${dataSourceId}\/relationships/g,
    replacement: 'METADATA_API_BASE_URL}/datasources/${dataSourceId}/relationships'
  },
  {
    pattern: /METADATA_API_BASE_URL}\/${dataSourceId}\/tables\/${tableName}\/preview/g,
    replacement: 'METADATA_API_BASE_URL}/datasources/${dataSourceId}/tables/${tableName}/preview'
  },
  {
    pattern: /METADATA_API_BASE_URL}\/${dataSourceId}\/search/g,
    replacement: 'METADATA_API_BASE_URL}/datasources/${dataSourceId}/search'
  },
  {
    pattern: /METADATA_API_BASE_URL}\/${dataSourceId}\/sync-history/g,
    replacement: 'METADATA_API_BASE_URL}/datasources/${dataSourceId}/sync-history'
  },
  {
    pattern: /METADATA_API_BASE_URL}\/${dataSourceId}\/columns\/analyze/g,
    replacement: 'METADATA_API_BASE_URL}/datasources/${dataSourceId}/columns/analyze'
  },
  {
    pattern: /METADATA_API_BASE_URL}\/search/g,
    replacement: 'METADATA_API_BASE_URL}/datasources/search'
  }
];

// 应用所有替换
replacements.forEach(({ pattern, replacement }) => {
  content = content.replace(pattern, replacement);
});

// 写回文件
fs.writeFileSync(filePath, content, 'utf8');
console.log('文件已成功更新'); 