#!/bin/bash

# 生產環境資料庫遷移腳本
# 使用方式: ./scripts/migrate-production.sh

echo "🚀 開始執行資料庫遷移..."
echo ""

# 檢查 migration 檔案
MIGRATION_DIR="backend/src/database/migrations"
if [ ! -d "$MIGRATION_DIR" ]; then
    echo "❌ 找不到 migration 目錄：$MIGRATION_DIR"
    exit 1
fi

MIGRATIONS=$(ls "$MIGRATION_DIR"/*.sql 2>/dev/null | sort)

if [ -z "$MIGRATIONS" ]; then
    echo "❌ 在 $MIGRATION_DIR 找不到任何 .sql 檔案"
    exit 1
fi

echo "📋 即將執行以下 migrations："
for FILE in $MIGRATIONS; do
    echo " - $(basename "$FILE")"
done
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
for FILE in $MIGRATIONS; do
    echo "🔄 執行 $(basename "$FILE")..."
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f "$FILE"
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ 遷移失敗於檔案 $(basename "$FILE")"
        exit 1
    fi
done

echo ""
echo "✅ 遷移成功完成！"
echo ""
echo "📊 驗證新欄位："
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d projects"
PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -c "\d project_files"
