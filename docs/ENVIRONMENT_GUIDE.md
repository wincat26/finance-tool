# 環境分離指南

## 📦 環境架構

```
開發環境 (Development)  → finance_tool (本地)
測試環境 (Staging)      → finance_tool_staging (本地/雲端)
正式環境 (Production)   → finance_tool (Zeabur)
```

## 🚀 快速啟動

### 1. 初始化測試環境

```bash
# 執行初始化腳本
./scripts/init-staging-db.sh

# 或手動執行
createdb finance_tool_staging
psql -U postgres -d finance_tool_staging -f backend/src/database/schema.sql
cd backend && NODE_ENV=staging npm run migrate
```

### 2. 啟動不同環境

#### 開發環境 (預設)
```bash
# 後端 (port 3001)
cd backend && npm run dev

# 前端 (port 3000)
cd frontend && npm run dev
```

#### 測試環境
```bash
# 後端 (port 3002)
cd backend && npm run dev:staging

# 前端 (port 3003)
cd frontend && npm run dev:staging
```

#### 正式環境
```bash
# 建置
npm run build

# 啟動
NODE_ENV=production npm start
```

## 🔧 環境變數配置

### 後端環境變數

| 檔案 | 環境 | 資料庫 | Port |
|------|------|--------|------|
| `.env` | development | finance_tool | 3001 |
| `.env.staging` | staging | finance_tool_staging | 3002 |
| `.env.production` | production | Zeabur PostgreSQL | 3001 |

### 前端環境變數

| 檔案 | API位址 | Port |
|------|---------|------|
| `.env` | http://localhost:3001/api | 3000 |
| `.env.staging` | http://localhost:3002/api | 3003 |
| `.env.production` | https://finance-reddoor.zeabur.app/api | - |

## 📋 常用指令

### 資料庫操作

```bash
# 查看所有資料庫
psql -U postgres -l

# 連接開發環境
psql -U postgres -d finance_tool

# 連接測試環境
psql -U postgres -d finance_tool_staging

# 執行 Migration
npm run migrate              # 開發環境
npm run migrate:staging      # 測試環境

# 健康檢查
npm run smoke                # 開發環境
npm run smoke:staging        # 測試環境
```

### 資料同步

```bash
# 從正式環境匯出資料
pg_dump -U postgres -d finance_tool > backup.sql

# 匯入到測試環境
psql -U postgres -d finance_tool_staging < backup.sql

# 清空測試環境
psql -U postgres -d finance_tool_staging -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
```

## 🌐 雲端部署配置

### Zeabur 環境變數設定

#### 測試環境服務
```
NODE_ENV=staging
POSTGRES_HOST=<staging-db-host>
POSTGRES_PORT=5432
POSTGRES_DATABASE=finance_tool_staging
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=<password>
PORT=3001
```

#### 正式環境服務
```
NODE_ENV=production
POSTGRES_HOST=<production-db-host>
POSTGRES_PORT=5432
POSTGRES_DATABASE=finance_tool
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=<password>
PORT=3001
```

### Vercel 環境變數設定

#### Preview (測試)
```
VITE_API_BASE_URL=https://finance-staging.zeabur.app/api
```

#### Production (正式)
```
VITE_API_BASE_URL=https://finance-reddoor.zeabur.app/api
```

## ✅ 驗證清單

- [ ] 本地開發環境正常運行 (port 3001/3000)
- [ ] 測試環境資料庫已建立
- [ ] 測試環境可獨立啟動 (port 3002/3003)
- [ ] 兩個環境資料互不影響
- [ ] Migration 在兩個環境都能執行
- [ ] 雲端測試環境已部署
- [ ] 雲端正式環境已部署

## 🔒 安全建議

1. **絕不將 `.env` 檔案提交到 Git**
2. **測試環境使用假資料，避免真實客戶資訊**
3. **定期備份正式環境資料庫**
4. **測試環境可設定 IP 白名單限制存取**

## 📞 問題排查

### 連線錯誤
```bash
# 檢查環境變數
echo $NODE_ENV

# 檢查資料庫連線
psql -U postgres -d finance_tool_staging -c "SELECT 1"

# 查看後端日誌
tail -f backend/backend.log
```

### Port 衝突
```bash
# 查看 Port 佔用
lsof -i :3001
lsof -i :3002

# 終止佔用程序
kill -9 <PID>
```
