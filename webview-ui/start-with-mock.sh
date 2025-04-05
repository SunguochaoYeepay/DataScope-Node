#!/bin/bash
echo "===================================================="
echo "正在以模拟数据模式启动DataScope API服务"
echo "此模式不需要数据库连接，使用内置的模拟数据"
echo "===================================================="
export USE_MOCK_DATA=true
export NODE_ENV=development
echo "以开发模式启动（使用ts-node）..."
npx ts-node src/index.ts
