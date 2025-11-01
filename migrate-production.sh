#!/bin/bash

# 生產環境資料庫遷移腳本
# 使用方式: ./migrate-production.sh

echo "🚀 開始執行資料庫遷移..."
echo ""

# 檢查是否有 migration 檔案
if [ ! -f "backend/src/database/migrations/add_missing_columns.sql" ]; then
    echo "❌ 找不到 migration 檔案"
    exit 1
fi

echo "📋 Migration 內容："
cat backend/src/database/migrations/add_missing_columns.sql
echo ""
echo "---"
echo ""

# 提示使用者輸入資料庫連線資訊
echo "請輸入 Zeabur PostgreSQL 連線資訊："
echo "(可以從 Zeabur Dashboard > Service > Variables 找到)"
echo ""

read -p "DB_HOST: " DB_HOST
read -p "DB_PORT (預設 5432): " DB_PORT
DB_PORT=${DB_PORT:-5432}
read -p "DB_NAME: " DB_NAME
read -p "DB_USER: " DB_USER
read -sp "DB_PASSWORD: " DB_PASSWORD
echo ""
echo ""

# 執行遷移
echo "🔄 執行遷移中..."
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f backend/src/database/migrations/add_missing_columns.sql

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ 遷移成功完成！"
    echo ""
    echo "📊 驗證新欄位："
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d projects"
else
    echo ""
    echo "❌ 遷移失敗，請檢查錯誤訊息"
    exit 1
fi
