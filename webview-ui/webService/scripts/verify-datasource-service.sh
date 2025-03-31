#!/bin/bash
# 验证数据源服务文件是否具有正确的导出

echo "正在验证数据源服务文件..."
grep -q "export default" src/services/datasource.service.ts

if [ $? -eq 0 ]; then
  echo "✅ 验证通过: 数据源服务文件包含默认导出"
  exit 0
else
  echo "❌ 验证失败: 数据源服务文件缺少默认导出"
  echo "建议使用 './scripts/restore-datasource-service.sh' 恢复文件"
  exit 1
fi 