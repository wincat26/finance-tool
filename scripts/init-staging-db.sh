#!/bin/bash

# 初始化測試環境資料庫

echo "🔧 初始化測試環境資料庫..."

# 建立測試資料庫
echo "📦 建立資料庫: finance_tool_staging"
createdb finance_tool_staging 2>/dev/null || echo "資料庫已存在"

# 執行 Schema
echo "📋 執行 Schema..."
psql -U postgres -d finance_tool_staging -f backend/src/database/schema.sql

# 執行 Migrations
echo "🔄 執行 Migrations..."
cd backend && NODE_ENV=staging npm run migrate

echo "✅ 測試環境資料庫初始化完成！"
echo "🚀 啟動測試環境: npm run dev:staging"
