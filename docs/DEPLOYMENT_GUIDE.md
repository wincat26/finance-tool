# 部署指南 - 財務資訊欄位更新

## 📋 更新內容

本次更新新增了財務聯絡人相關欄位到 projects 表：
- `company_alias` - 公司別名
- `finance_contact_name` - 財務人員姓名
- `finance_contact_phone` - 財務人員電話
- `finance_contact_email` - 財務人員 Email
- `finance_notes` - 財務備註

## 🚀 部署步驟

### 1. 資料庫遷移

後端 `npm start` 會自動執行 migrations，但建議部署前手動跑一次確認。

#### 方法 A：透過 npm workspace（推薦）

```bash
# 於專案根目錄
npm run backend:migrate
```

#### 方法 B：手動 SQL

```bash
# 連接到 Zeabur PostgreSQL
psql -h <ZEABUR_HOST> -p 5432 -U <USERNAME> -d <DATABASE>

# 依序執行全部 migration 檔案
\i backend/src/database/migrations/add_missing_columns.sql
\i backend/src/database/migrations/add_project_files_created_by.sql

# 驗證
\d projects
\d project_files
```

### 1.1 環境變數設定

| 服務 | 變數 | 說明 | 範例 |
| ---- | ---- | ---- | ---- |
| Zeabur Backend | `POSTGRES_HOST` | PostgreSQL 主機名稱 | `postgresql.internal` |
|  | `POSTGRES_PORT` | PostgreSQL 連線 port | `5432` |
|  | `POSTGRES_DATABASE` | 資料庫名稱 | `finance_tool` |
|  | `POSTGRES_USERNAME` | DB 使用者 | `postgres` |
|  | `POSTGRES_PASSWORD` | DB 密碼 | `********` |
|  | `PORT` | 服務埠號 | `3001` |
| Vercel Frontend | `VITE_API_BASE_URL` | 後端 API 入口 | `https://finance-reddoor.zeabur.app/api` |

> 建議於 Zeabur 與 Vercel 後台記錄上述變數，與 `.env` 命名保持一致，方便換環境部署。

### 2. 後端部署

Zeabur 會自動偵測 GitHub 推送並重新部署。後端 `npm start` 會在啟動前自動執行 `npm run migrate`，確保資料表欄位到位。

**手動觸發：**
1. 登入 Zeabur Dashboard
2. 進入 finance-reddoor 專案
3. 點擊 Backend Service
4. 點擊 "Redeploy"

**驗證部署：**
```bash
curl https://finance-reddoor.zeabur.app/api/projects
# Smoke check（於本地或 Zeabur console）
npm run backend:smoke
```

### 3. 前端部署

Vercel 會自動偵測 GitHub 推送並重新部署。

**檢查部署狀態：**
1. 登入 Vercel Dashboard
2. 查看 finance-tool 專案
3. 確認最新 commit 已部署

**驗證部署：**
訪問 https://finance-tool-sage.vercel.app

### 4. 測試驗證

#### 測試清單：
- [ ] 新增客戶時可以填寫財務資訊
- [ ] 編輯現有客戶可以更新財務資訊
- [ ] 財務資訊正確儲存到資料庫
- [ ] 財務資訊正確顯示在表單中
- [ ] Email 和電話格式驗證正常運作

#### 測試步驟：
1. 開啟 https://finance-tool-sage.vercel.app
2. 點擊「新增客戶」
3. 填寫基本資訊和財務資訊
4. 儲存並確認資料正確
5. 編輯該客戶，修改財務資訊
6. 確認更新成功

## 📊 資料庫連線資訊

從 Zeabur Dashboard 取得：
1. 登入 Zeabur
2. 進入專案
3. 點擊 PostgreSQL Service
4. 查看 Variables 標籤

需要的變數：
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DATABASE`
- `POSTGRES_USERNAME`
- `POSTGRES_PASSWORD`

## 🔧 故障排除

### 遷移失敗
- 檢查資料庫連線資訊是否正確
- 確認有足夠的權限執行 ALTER TABLE
- 檢查欄位是否已存在

### 後端部署失敗
- 檢查 Zeabur 部署日誌
- 確認環境變數設定正確
- 驗證 TypeScript 編譯無錯誤

### 前端顯示問題
- 清除瀏覽器快取
- 檢查 API 回應是否包含新欄位
- 查看瀏覽器 Console 錯誤訊息

## 📝 回滾計畫

如需回滾：

```sql
-- 移除新增的欄位
ALTER TABLE projects DROP COLUMN IF EXISTS company_alias;
ALTER TABLE projects DROP COLUMN IF EXISTS finance_contact_name;
ALTER TABLE projects DROP COLUMN IF EXISTS finance_contact_phone;
ALTER TABLE projects DROP COLUMN IF EXISTS finance_contact_email;
ALTER TABLE projects DROP COLUMN IF EXISTS finance_notes;
```

然後回滾到前一個 commit：
```bash
git revert HEAD~3..HEAD
git push origin main
```

## ✅ 完成確認

部署完成後，請確認：
- [ ] 資料庫遷移成功
- [ ] 後端 API 正常運作
- [ ] 前端介面正確顯示
- [ ] 新功能測試通過
- [ ] 現有功能未受影響
