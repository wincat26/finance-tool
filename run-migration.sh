#!/bin/bash

# 從 Zeabur 截圖的連線資訊
# 使用 POSTGRES_CONNECTION_STRING 變數

echo "🔄 執行資料庫遷移..."
echo ""
echo "📋 Migration SQL:"
cat backend/src/database/migrations/add_missing_columns.sql
echo ""
echo "---"
echo ""

# 方法 1: 使用 Zeabur CLI (如果已安裝)
if command -v zeabur &> /dev/null; then
    echo "使用 Zeabur CLI 執行..."
    zeabur service exec postgresql -- psql -U root -d zeabur -f /tmp/migration.sql
    exit 0
fi

# 方法 2: 手動提示
echo "⚠️  無法直接連接到 Zeabur PostgreSQL"
echo ""
echo "請使用以下方式之一執行遷移："
echo ""
echo "方式 1 - 使用 Zeabur Dashboard:"
echo "1. 登入 Zeabur Dashboard"
echo "2. 進入 PostgreSQL Service"
echo "3. 點擊 'Console' 或 'Shell'"
echo "4. 執行以下 SQL:"
echo ""
cat backend/src/database/migrations/add_missing_columns.sql
echo ""
echo ""
echo "方式 2 - 使用 Zeabur CLI:"
echo "1. 安裝: npm install -g @zeabur/cli"
echo "2. 登入: zeabur auth login"
echo "3. 執行: zeabur service exec postgresql -- psql -U root -d zeabur"
echo "4. 貼上上面的 SQL"
echo ""
echo "方式 3 - 從後端服務執行:"
echo "後端服務已經有資料庫連線，可以在後端代碼中執行遷移"
