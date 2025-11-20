# CRM 模組開發交接文件

## 📋 專案概述

**專案名稱**: 財務管理工具 CRM 擴展  
**交接日期**: 2025-02-02  
**開發階段**: Phase 1 - Leads 模組 MVP 完成  
**技術架構**: React + TypeScript + Node.js + PostgreSQL

---

## 🎯 已完成項目

### 1. 環境分離架構

#### 資料庫配置
```
開發環境: finance_tool (Port 3001/3000)
測試環境: finance_tool_staging (Port 3002/3003)
正式環境: Zeabur PostgreSQL (Port 3001)
```

#### 啟動指令
```bash
# 測試環境
cd backend && npm run dev:staging    # Port 3002
cd frontend && npm run dev:staging   # Port 3003

# 開發環境
cd backend && npm run dev            # Port 3001
cd frontend && npm run dev           # Port 3000
```

### 2. CRM 三層架構設計

```
潛在客戶 (Leads)
    ↓ 初步接觸、評分篩選
聯絡人 (Contacts)
    ↓ 深度溝通、商機追蹤
正式客戶 (Customers)
    ↓ 專案管理、財務收支
```

### 3. Leads 模組功能

#### 資料表結構
```sql
leads (17 欄位)
├── 基本資訊: name, company, phone, email
├── 業務管理: source, status, assigned_to
├── 評分系統: lead_score (0-100)
├── 擴展功能: tags[], custom_fields (JSONB)
└── 轉換追蹤: converted_at, converted_to_contact_id

contacts (14 欄位)
├── 基本資訊: name, company, position, phone, email
├── 關聯: lead_id, customer_id
└── 擴展: tags[], custom_fields (JSONB)
```

#### API 端點
```
GET    /api/leads              # 列表（支援 status, assigned_to 篩選）
GET    /api/leads/:id          # 單筆查詢
POST   /api/leads              # 新增
PUT    /api/leads/:id          # 更新
POST   /api/leads/:id/convert  # 轉換為 Contact
DELETE /api/leads/:id          # 刪除
```

#### 前端元件
- `LeadList.tsx`: 潛客列表頁（含狀態篩選）
- 路由: `/leads`

---

## 📂 檔案結構

```
finance-tool/
├── backend/
│   ├── src/
│   │   ├── database/
│   │   │   └── migrations/
│   │   │       └── 20250202_create_leads_table.sql  ✅ 新增
│   │   ├── models/
│   │   │   └── Lead.ts                              ✅ 新增
│   │   ├── routes/
│   │   │   └── leads.ts                             ✅ 新增
│   │   ├── types/index.ts                           ✅ 更新
│   │   └── index.ts                                 ✅ 更新
│   ├── .env.staging                                 ✅ 新增
│   └── package.json                                 ✅ 更新
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── LeadList.tsx                         ✅ 新增
│   │   ├── types/index.ts                           ✅ 更新
│   │   └── App.tsx                                  ✅ 更新
│   ├── .env.staging                                 ✅ 新增
│   └── package.json                                 ✅ 更新
│
├── scripts/
│   └── init-staging-db.sh                           ✅ 新增
│
└── 文件/
    ├── ENVIRONMENT_GUIDE.md                         ✅ 環境分離指南
    ├── LEADS_MODULE_COMPLETE.md                     ✅ Leads 模組完成報告
    └── STAGING_SETUP_COMPLETE.md                    ✅ 測試環境設置報告
```

---

## 🚀 快速啟動

### 首次設置

```bash
# 1. 初始化測試環境資料庫
createdb finance_tool_staging
psql -d finance_tool_staging -f backend/src/database/schema.sql
cd backend && export NODE_ENV=staging && npm run migrate

# 2. 配置環境變數
# backend/.env.staging 已配置
# frontend/.env.staging 已配置

# 3. 啟動服務
cd backend && npm run dev:staging    # Terminal 1
cd frontend && npm run dev:staging   # Terminal 2
```

### 日常開發

```bash
# 測試環境（推薦用於 CRM 開發）
cd backend && npm run dev:staging
cd frontend && npm run dev:staging
訪問: http://localhost:3003/leads

# 開發環境
cd backend && npm run dev
cd frontend && npm run dev
訪問: http://localhost:3000/leads
```

---

## 🧪 測試驗證

### 1. 資料庫檢查
```bash
# 查看表結構
psql -d finance_tool_staging -c "\d leads"
psql -d finance_tool_staging -c "\d contacts"

# 查看資料
psql -d finance_tool_staging -c "SELECT * FROM leads;"
```

### 2. API 測試
```bash
# 新增潛客
curl -X POST http://localhost:3002/api/leads \
  -H "Content-Type: application/json" \
  -d '{
    "name": "張三",
    "company": "測試公司",
    "phone": "0912345678",
    "email": "test@example.com",
    "source": "廣告",
    "lead_score": 80,
    "assigned_to": "業務A"
  }'

# 查詢列表
curl http://localhost:3002/api/leads

# 篩選狀態
curl http://localhost:3002/api/leads?status=new

# 轉換為聯絡人
curl -X POST http://localhost:3002/api/leads/1/convert \
  -H "Content-Type: application/json" \
  -d '{
    "name": "張三",
    "company": "測試公司",
    "position": "經理",
    "phone": "0912345678",
    "email": "test@example.com"
  }'
```

### 3. 前端測試
- 訪問 http://localhost:3003/leads
- 測試狀態篩選按鈕
- 確認列表顯示正常

---

## 📋 待開發功能

### Phase 2: Leads 功能增強（預估 3-5 天）

#### 優先級 P0（必須）
- [ ] LeadModal 新增/編輯表單
- [ ] 表單驗證（Zod）
- [ ] 錯誤處理與提示

#### 優先級 P1（重要）
- [ ] 批量匯入功能（CSV/Excel）
- [ ] 評分自動計算邏輯
- [ ] 標籤管理介面
- [ ] 轉換確認對話框

#### 優先級 P2（次要）
- [ ] 進階搜尋（姓名、公司、電話）
- [ ] 排序功能
- [ ] 分頁功能
- [ ] 匯出功能

### Phase 3: Contacts 模組（預估 5-7 天）

```typescript
// 需要開發的檔案
backend/src/models/Contact.ts
backend/src/routes/contacts.ts
frontend/src/components/ContactList.tsx
frontend/src/components/ContactModal.tsx
```

#### 核心功能
- [ ] Contacts CRUD API
- [ ] 與 Leads 關聯顯示
- [ ] 與 Customers 關聯
- [ ] 互動記錄時間軸
- [ ] 升級為 Customer 功能

### Phase 4: Opportunities 模組（預估 7-10 天）

```sql
-- 商機表設計
CREATE TABLE opportunities (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    contact_id INTEGER REFERENCES contacts(id),
    organization_id INTEGER REFERENCES customers(id),
    amount DECIMAL(12,2),
    stage VARCHAR(50),  -- 階段：初步接觸/需求確認/報價/議價/成交
    probability INTEGER,  -- 成交機率 0-100
    expected_close_date DATE,
    assigned_to VARCHAR(100),
    status VARCHAR(20) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Phase 5: 整合與優化（預估 3-5 天）

- [ ] Dashboard 新增 CRM 統計
- [ ] 轉換率分析圖表
- [ ] 來源渠道分析
- [ ] 業務績效追蹤
- [ ] 權限系統（RBAC）

---

## 🔧 技術債務與已知問題

### 需要優化的項目

1. **前端狀態管理**
   - 目前使用 useState，建議引入 React Query 或 Zustand
   - 減少重複的 API 呼叫

2. **錯誤處理**
   - 後端需要更詳細的錯誤訊息
   - 前端需要統一的錯誤提示元件

3. **型別安全**
   - 前後端型別定義需同步
   - 考慮使用 tRPC 或 GraphQL

4. **測試覆蓋**
   - 目前無單元測試
   - 建議優先為 Model 層添加測試

### 已知限制

1. **轉換邏輯為單向**
   - Lead → Contact 不可逆
   - 未來可考慮支援「退回」功能

2. **自定義欄位無 UI**
   - 資料庫已支援 JSONB
   - 前端需實作動態表單生成器

3. **無批量操作**
   - 目前僅支援單筆操作
   - 需要批量刪除、批量分配等功能

---

## 📊 資料庫 Schema 總覽

```sql
-- 現有表
customers (8 欄位) + primary_contact_id
projects (18 欄位)
revenues (12 欄位)
expenses (15 欄位)
project_files (7 欄位)

-- CRM 新增表
leads (17 欄位)          ✅ 已完成
contacts (14 欄位)       ✅ 已完成

-- 待開發表
opportunities (12 欄位)  ⏳ 待開發
interactions (10 欄位)   ⏳ 待開發
users (8 欄位)           ⏳ 待開發
roles (5 欄位)           ⏳ 待開發
```

---

## 🔐 環境變數配置

### 測試環境 (backend/.env.staging)
```env
NODE_ENV=staging
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tool_staging
DB_USER=winson
DB_PASSWORD=
PORT=3002
```

### 測試環境 (frontend/.env.staging)
```env
VITE_API_BASE_URL=http://localhost:3002/api
```

---

## 📞 問題排查

### 常見問題

**Q1: 後端啟動失敗，提示資料庫連線錯誤**
```bash
# 檢查資料庫是否存在
psql -l | grep finance_tool_staging

# 檢查環境變數
cat backend/.env.staging

# 測試連線
psql -d finance_tool_staging -c "SELECT 1"
```

**Q2: 前端無法連接後端 API**
```bash
# 檢查後端是否運行
lsof -i :3002

# 測試 API
curl http://localhost:3002/api/leads

# 檢查前端環境變數
cat frontend/.env.staging
```

**Q3: Migration 執行失敗**
```bash
# 查看 Migration 日誌
cd backend && export NODE_ENV=staging && npm run migrate

# 手動執行 SQL
psql -d finance_tool_staging -f backend/src/database/migrations/20250202_create_leads_table.sql
```

---

## 📚 相關文件

- `README.md` - 專案總覽
- `ENVIRONMENT_GUIDE.md` - 環境分離完整指南
- `LEADS_MODULE_COMPLETE.md` - Leads 模組技術文件
- `DEVELOPER_ONBOARDING.md` - 開發者上手指南
- `DEPLOYMENT_GUIDE.md` - 部署指南

---

## 🎯 下一步建議

### 立即可執行（1-2 天）
1. 實作 LeadModal 新增/編輯表單
2. 新增表單驗證與錯誤提示
3. 測試完整的 CRUD 流程

### 短期目標（1 週）
1. 完成 Leads 模組所有功能
2. 開始 Contacts 模組開發
3. 建立基礎測試案例

### 中期目標（2-3 週）
1. 完成 Contacts 模組
2. 開始 Opportunities 模組
3. 整合 Dashboard 統計

---

## 👥 聯絡資訊

**專案負責人**: 阿Q (PM)  
**技術架構**: React + Node.js + PostgreSQL  
**開發環境**: macOS  
**專案路徑**: `/Users/winson/Dropbox/vibe_tools/reddoor-winson-assistant/finance-tool`

---

## ✅ 交接檢查清單

- [x] 測試環境資料庫已建立
- [x] Leads 表與 Contacts 表已建立
- [x] Migration 腳本已執行
- [x] 後端 API 測試通過
- [x] 前端元件可正常顯示
- [x] 環境變數已配置
- [x] 文件已更新
- [ ] 新增/編輯表單待開發
- [ ] 批量匯入功能待開發
- [ ] Contacts 模組待開發

---

**交接完成日期**: 2025-02-02  
**當前版本**: v1.1.0-leads-mvp  
**下一版本目標**: v1.2.0-leads-complete
