# ✅ 測試環境初始化完成

## 執行結果

### 資料庫建立
- ✅ 資料庫: `finance_tool_staging` 已建立
- ✅ 8個資料表已建立
- ✅ 所有 Migrations 執行完成
- ✅ Schema 檢查通過

### 資料表清單
```
customers
expense_categories
expenses
project_files
projects
revenue_categories
revenue_installments
revenues
```

## 🚀 啟動指令

### 後端服務

```bash
# 開發環境 (port 3001)
cd backend && npm run dev

# 測試環境 (port 3002)
cd backend && npm run dev:staging
```

### 前端服務

```bash
# 開發環境 (port 3000)
cd frontend && npm run dev

# 測試環境 (port 3003)
cd frontend && npm run dev:staging
```

## 🔍 驗證測試

```bash
# 檢查測試環境資料庫
psql -d finance_tool_staging -c "\dt"

# 執行健康檢查
cd backend && export NODE_ENV=staging && npm run smoke

# 測試API (啟動後)
curl http://localhost:3002/api/projects
```

## 📊 環境對照

| 項目 | 開發環境 | 測試環境 |
|------|---------|---------|
| 資料庫 | finance_tool | finance_tool_staging |
| 後端Port | 3001 | 3002 |
| 前端Port | 3000 | 3003 |
| 資料庫用戶 | winson | winson |

## ⚠️ 注意事項

1. 兩個環境資料完全隔離
2. 測試環境目前為空資料庫
3. 可以在測試環境自由測試新功能
4. 不會影響開發環境的資料

## 下一步

現在可以開始：
1. 同時啟動兩個環境進行測試
2. 在測試環境測試CRM新模組
3. 驗證無誤後再部署到正式環境
