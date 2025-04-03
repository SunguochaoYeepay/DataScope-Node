#!/bin/bash

# 提示信息
echo "==================================================="
echo "正在以真实数据库模式启动DataScope API服务"
echo "此模式需要MySQL数据库连接"
echo "确保数据库已启动并正确配置"
echo "==================================================="

# 设置环境变量并启动服务
export USE_MOCK_DATA=false
export NODE_ENV=development

# 启动服务
echo "以开发模式启动（使用ts-node）..."
npx ts-node src/index.ts