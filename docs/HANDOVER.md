# 財務管理工具 - 專案交接文件

**交接日期**: 2025-11-02  
**專案狀態**: ✅ 生產環境運行中  
**版本**: v1.1.0

---

## 📋 專案概述

專為專案型業務設計的財務管理系統，支援客戶管理、收支記錄、財務報表等功能。

### 核心功能
- ✅ 客戶/專案管理（含財務聯絡人資訊）
- ✅ 收入記錄（服務類型、金額、發票、狀態）
- ✅ 支出記錄（含廣告費自動稅費計算）
- ✅ 檔案管理（Google Drive 連結）
- ✅ 損益報表

---

## 🌐 部署資訊

### 生產環境

| 服務 | 平台 | URL | 狀態 |
|------|------|-----|------|
| 前端 | Vercel | https://finance-tool-sage.vercel.app | ✅ 運行中 |
| 後端 | Zeabur | https://finance-reddoor.zeabur.app | ✅ 運行中 |
| 資料庫 | Zeabur PostgreSQL | 內部連接 | ✅ 運行中 |
| 代碼倉庫 | GitHub | https://github.com/wincat26/finance-tool | ✅ 最新 |

### 自動部署
- **前端**: GitHub push → Vercel 自動部署（約 2-3 分鐘）
- **後端**: GitHub push → Zeabur 自動部署（約 3-5 分鐘）

---

## 🔑 關鍵資訊

### 資料庫連接（Zeabur PostgreSQL）
```
Host (外部): hndl.clusters.zeabur.com
Port (外部): 26006
Host (內部): postgresql.zeabur.internal
Port (內部): 5432
Database: zeabur
User: root
Password: k5x18vL3HiyR29jOWUCp6ISZ4Ab70lNm
```

### 環境變數（已配置）

**Zeabur Backend Service**:
- `POSTGRES_HOST`: service-6906f5ac0ada8cc29857d7c4
- `POSTGRES_PORT`: 5432
- `POSTGRES_DATABASE`: zeabur
- `POSTGRES_USERNAME`: root
- `POSTGRES_PASSWORD`: k5x18vL3HiyR29jOWUCp6ISZ4Ab70lNm

**Vercel Frontend**:
- `VITE_API_BASE_URL`: https://finance-reddoor.zeabur.app/api

### 服務 ID
- **Zeabur Project**: 6906f464192a0a143db528b9
- **Zeabur Backend Service**: 6906f4b4e899b7703fe66916
- **Zeabur PostgreSQL Service**: 6906f5ac0ada8cc29857d7c4
- **Zeabur Environment**: 6906f4642655171f1baa1456
- **Vercel Project**: prj_0LCrjZ7o9NDpqTL27o85EUKAwLNM
- **Vercel Team**: team_a0BnZz085DxHY4jzTnGYHJ1c

---

## 📊 資料庫結構

### 主要資料表

#### projects (客戶/專案)
```sql
- id, company_name, company_alias
- vat_number, contact_name, contact_phone, contact_email
- project_date, responsible_person, status, description
- finance_contact_name, finance_contact_phone, finance_contact_email, finance_notes
- created_at, updated_at
```

#### revenues (收入)
```sql
- id, project_id, service_type, amount, income_date
- invoice_number, status, notes
- created_at, updated_at
```

#### expenses (支出)
```sql
- id, project_id, supplier_name, expense_type, amount, expense_date
- invoice_number, file_url, notes
- payment_request, ad_platform, card_fee, overseas_tax, business_tax
- created_at, updated_at
```

#### project_files (檔案)
```sql
- id, project_id, file_type, file_name, google_drive_url
- created_at
```

### 當前資料
- **客戶總數**: 6 筆
- **2025 年客戶**: 5 筆
- **測試資料**: 包含紅門互動、ABC科技、XYZ行銷等

---

## 🛠️ 技術架構

### 前端
- **框架**: React 18 + TypeScript
- **UI**: Tailwind CSS
- **圖表**: Recharts
- **HTTP**: Axios
- **構建**: Vite 4.5.0
- **Node**: 22.x

### 後端
- **框架**: Node.js + Express + TypeScript
- **資料庫**: PostgreSQL (pg)
- **驗證**: Zod
- **Node**: 18.x

### 專案結構
```
finance-tool/
├── frontend/          # React 前端
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── types/
│   └── package.json
├── backend/           # Node.js 後端
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── database/
│   │   └── types/
│   └── package.json
└── docs/              # 文件
```

---

## 🚀 本地開發

### 快速啟動

```bash
# 1. Clone 專案
git clone https://github.com/wincat26/finance-tool.git
cd finance-tool

# 2. 安裝依賴
cd backend && npm install
cd ../frontend && npm install

# 3. 設置本地資料庫
createdb finance_tool
psql -d finance_tool -f backend/src/database/schema.sql
psql -d finance_tool -f backend/src/database/migrations/add_missing_columns.sql
psql -d finance_tool -f backend/src/database/migrations/add_expense_fields.sql

# 4. 配置環境變數
# backend/.env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tool
DB_USER=postgres
DB_PASSWORD=your_password
PORT=3001
NODE_ENV=development

# frontend/.env
VITE_API_BASE_URL=http://localhost:3001/api

# 5. 啟動服務
cd backend && npm run dev    # http://localhost:3001
cd frontend && npm run dev   # http://localhost:3000
```

---

## 📝 重要功能說明

### 1. 財務聯絡人資訊
- **位置**: CustomerModal.tsx
- **欄位**: 財務人員姓名、電話、Email、備註
- **用途**: 區分業務聯絡人和財務聯絡人

### 2. 廣告費自動計算
- **位置**: ExpenseModal.tsx
- **平台**:
  - Meta: 刷卡費 1.5% + 境外稅 3%
  - Google/Line: 營業稅 5%
- **功能**: 自動計算並儲存稅費

### 3. 收支管理
- **收入**: 支援四種服務類型（顧問費、產品使用、行銷費用、其他）
- **支出**: 支援六種類型（廣告費、設計費、會員經營、行銷費、外包費、其他）
- **狀態追蹤**: 待收款、部分收款、已收款

### 4. 檔案管理
- **類型**: 合約、委刊單、報價單、發票、其他
- **儲存**: Google Drive 連結
- **功能**: 分類顯示、快速開啟

---

## 🔧 常見操作

### 健康檢查

```bash
# 執行自動化健康檢查
./scripts/health-check.sh

# 手動檢查各端點
curl https://finance-reddoor.zeabur.app/health
curl https://finance-reddoor.zeabur.app/api/dashboard?year=2025
curl https://finance-reddoor.zeabur.app/api/customers?year=2025
```

### 資料庫遷移

```bash
# 連接生產資料庫
psql "postgresql://root:k5x18vL3HiyR29jOWUCp6ISZ4Ab70lNm@hndl.clusters.zeabur.com:26006/zeabur"

# 或使用 Zeabur Dashboard
# 1. 登入 Zeabur
# 2. 進入 PostgreSQL Service
# 3. 點擊 Console
# 4. 執行 SQL
```

### 查看日誌

**Vercel**:
1. 登入 https://vercel.com
2. 進入 finance-tool 專案
3. 點擊最新部署
4. 查看 Build Logs / Runtime Logs

**Zeabur**:
1. 登入 https://zeabur.com
2. 進入 finance-tool 服務
3. 點擊 Logs 標籤

### 手動部署

```bash
# 推送到 GitHub 會自動觸發部署
git add .
git commit -m "your message"
git push origin main

# 或在平台手動觸發
# Vercel: Deployments → Redeploy
# Zeabur: Service → Redeploy
```

---

## ⚠️ 已知問題與解決方案

### 所有已知問題已修復 ✅

以下問題已在 v1.2.0 中全部修復：

1. ✅ **API 路徑重複問題** - 所有前端 API 呼叫已移除重複的 `/api` 前綴
2. ✅ **資料庫欄位缺失** - expenses 表已補齊 payment_request, ad_platform, card_fee, overseas_tax, business_tax
3. ✅ **CORS 問題** - 已移除 withCredentials 配置
4. ✅ **Boolean 判斷錯誤** - 修正 Postgres 't' 字串判斷邏輯
5. ✅ **SQL GROUP BY 錯誤** - 修正 finance API 的 GROUP BY 子句
6. ✅ **Vercel 路由 404** - 已配置 SPA rewrites
7. ✅ **環境變數配置** - 前後端環境變數已正確設定

### 驗證狀態
- ✅ 所有後端 API 端點回應 200
- ✅ 資料庫 Schema 完整（projects 16 欄、expenses 16 欄、revenues 12 欄）
- ✅ 前端所有頁面正常載入
- ✅ CRUD 操作功能正常

---

## 📚 重要文件

| 文件 | 說明 |
|------|------|
| `README.md` | 專案概述和快速開始 |
| `HANDOVER.md` | 本文件 - 專案交接文件 |
| `QA_CHECKLIST.md` | QA 測試清單（功能、API、資料庫、效能、安全） |
| `ERROR_HANDLING_IMPROVEMENTS.md` | 錯誤處理改進指南 |
| `scripts/health-check.sh` | 自動化健康檢查腳本 |
| `DEVELOPER_ONBOARDING.md` | 開發者上手指南 |
| `GITHUB_RESOURCES.md` | GitHub 資源清單 |
| `DEPLOYMENT_GUIDE.md` | 部署指南 |
| `SYSTEM_DIAGNOSIS.md` | 系統診斷報告 |
| `RELEASE_NOTES.md` | 版本發布說明 |

---

## 🔄 最近更新

### 2025-11-02 (v1.2.0) - QA 全面檢查與修復
- ✅ 修復所有 API 路徑重複 `/api` 問題
- ✅ 修復資料庫欄位缺失（expenses 表補齊 5 個欄位）
- ✅ 修復 CORS 問題（移除 withCredentials）
- ✅ 修復 Postgres Boolean 判斷錯誤（'t' 字串問題）
- ✅ 修復 SQL GROUP BY 子句錯誤
- ✅ 修復 Vercel SPA 路由 404 問題
- ✅ 建立 QA 測試清單文件
- ✅ 建立錯誤處理改進指南
- ✅ 建立自動化健康檢查腳本
- ✅ 所有後端 API 測試通過（200 狀態碼）
- ✅ 資料庫 Schema 完整驗證

### 2025-11-02 (v1.1.0)
- ✅ 新增財務聯絡人欄位（5 個欄位）
- ✅ 修復支出表缺少欄位問題
- ✅ 修復日期格式問題
- ✅ 更新所有測試資料到 2025 年
- ✅ 完成生產環境部署

### 2025-11-01 (v1.0.0)
- ✅ 首次發布
- ✅ 完成核心功能開發
- ✅ 部署到 Vercel + Zeabur

---

## 📞 支援資源

### 平台登入
- **Vercel**: https://vercel.com (winsonlu-2093)
- **Zeabur**: https://zeabur.com
- **GitHub**: https://github.com/wincat26/finance-tool

### 開發工具
- **Node.js**: https://nodejs.org (需要 v18+)
- **PostgreSQL**: https://www.postgresql.org (需要 v14+)

### 文件資源
- **React**: https://react.dev
- **Express**: https://expressjs.com
- **Tailwind CSS**: https://tailwindcss.com
- **Recharts**: https://recharts.org

---

## ✅ 交接檢查清單

### 環境訪問
- [ ] 可以登入 Vercel Dashboard
- [ ] 可以登入 Zeabur Dashboard
- [ ] 可以訪問 GitHub Repository
- [ ] 可以連接生產資料庫

### 本地開發
- [ ] 成功 clone 專案
- [ ] 成功安裝依賴
- [ ] 成功啟動本地後端
- [ ] 成功啟動本地前端
- [ ] 可以連接本地資料庫

### 功能驗證
- [ ] 可以新增客戶
- [ ] 可以編輯客戶（含財務資訊）
- [ ] 可以新增收入
- [ ] 可以新增支出（含廣告費）
- [ ] 可以上傳檔案連結
- [ ] 可以查看損益報表
- [ ] Dashboard 數據正確顯示
- [ ] 年度收益表正常運作
- [ ] CSV 匯出功能正常

### 部署流程
- [ ] 理解自動部署流程
- [ ] 知道如何查看部署日誌
- [ ] 知道如何手動觸發部署
- [ ] 知道如何執行資料庫遷移
- [ ] 執行過健康檢查腳本

### 問題處理
- [ ] 知道如何查看錯誤日誌
- [ ] 知道如何連接資料庫除錯
- [ ] 知道如何回滾部署
- [ ] 閱讀過 QA_CHECKLIST.md
- [ ] 閱讀過 ERROR_HANDLING_IMPROVEMENTS.md
- [ ] 了解所有已修復的問題

---

## 🎯 後續建議

### 短期（1-2 週）
1. 熟悉代碼結構和業務邏輯
2. 在本地環境測試所有功能
3. 閱讀所有文件
4. 嘗試修改小功能並部署

### 中期（1 個月）
1. 優化前端 UI/UX
2. 添加更多報表類型
3. 改善錯誤處理和日誌
4. 添加單元測試

### 長期（3 個月+）
1. 考慮添加用戶權限管理
2. 實作資料匯入/匯出功能
3. 開發移動端應用
4. 整合第三方服務（會計系統等）

---

## 📧 聯絡資訊

**原開發者**: Winson Lu  
**Email**: winson.lu@gmail.com  
**GitHub**: @wincat26

**交接完成日期**: _____________  
**接手人簽名**: _____________

---

**最後更新**: 2025-11-02  
**文件版本**: 1.2  
**系統狀態**: ✅ 所有功能正常運作
