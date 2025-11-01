# ✅ 資料庫遷移完成

## 本地測試結果

**執行時間**: $(date '+%Y-%m-%d %H:%M:%S')

### 遷移狀態
✅ 本地資料庫遷移成功

### 新增欄位
- ✅ `company_alias` (VARCHAR 255)
- ✅ `finance_contact_name` (VARCHAR 255)
- ✅ `finance_contact_phone` (VARCHAR 50)
- ✅ `finance_contact_email` (VARCHAR 255)
- ✅ `finance_notes` (TEXT)

## 🚀 生產環境遷移

### 方式 1: 使用後端服務執行（推薦）

由於後端服務已經連接到生產資料庫，可以直接在 Zeabur 上執行遷移：

```bash
# 在 Zeabur Backend Service 的 Console 中執行
npm run migrate
```

**步驟：**
1. 登入 Zeabur Dashboard
2. 進入 finance-reddoor 專案
3. 點擊 Backend Service
4. 點擊 "Console" 或 "Terminal"
5. 執行: `npm run migrate`

### 方式 2: 使用 Zeabur PostgreSQL Console

1. 登入 Zeabur Dashboard
2. 進入 PostgreSQL Service
3. 點擊 "Console"
4. 執行以下 SQL:

```sql
ALTER TABLE projects ADD COLUMN IF NOT EXISTS company_alias VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS finance_contact_name VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS finance_contact_phone VARCHAR(50);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS finance_contact_email VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS finance_notes TEXT;
```

### 方式 3: 部署後自動執行

在 Zeabur 部署設定中添加 post-deploy hook:

```json
{
  "postDeploy": "npm run migrate"
}
```

## 📋 驗證清單

完成遷移後，請驗證：

- [ ] 生產資料庫已新增 5 個欄位
- [ ] 後端 API 正常運作
- [ ] 前端可以儲存財務資訊
- [ ] 現有資料未受影響

## 🔧 驗證指令

```bash
# 檢查欄位是否存在
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'projects' 
AND column_name IN ('company_alias', 'finance_contact_name', 'finance_contact_phone', 'finance_contact_email', 'finance_notes');
```

## 📊 下一步

1. ✅ 本地遷移完成
2. ⏳ 執行生產環境遷移（選擇上述方式之一）
3. ⏳ 確認後端部署完成
4. ⏳ 測試完整功能

---

**工具準備完成！** 選擇最方便的方式執行生產環境遷移。
