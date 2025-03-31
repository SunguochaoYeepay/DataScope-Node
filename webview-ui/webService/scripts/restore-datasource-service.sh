#!/bin/bash
# 恢复数据源服务文件
echo "正在恢复数据源服务文件..."
git checkout working-datasource-service-v1 -- src/services/datasource.service.ts
echo "恢复完成！"
