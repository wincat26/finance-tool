# 開發者上手指南

## 📋 專案概述

**專案名稱**: 財務管理工具 (Finance Tool)  
**類型**: 全端 Web 應用程式  
**目的**: 專案型業務的客戶管理、收支追蹤、財務報表系統

## 🏗️ 技術架構

### 前端
- **框架**: React 18 + TypeScript
- **UI**: Tailwind CSS
- **圖表**: Recharts
- **HTTP**: Axios
- **構建**: Vite 4.5.0

### 後端
- **框架**: Node.js + Express + TypeScript
- **資料庫**: PostgreSQL
- **驗證**: Zod
- **ORM**: 原生 pg (node-postgres)

### 部署
- **前端**: Vercel (https://finance-tool-sage.vercel.app)
- **後端**: Zeabur (https://finance-reddoor.zeabur.app)
- **資料庫**: Zeabur PostgreSQL

## 📂 專案結構

```
finance-tool/
├── frontend/                 # React 前端
│   ├── src/
│   │   ├── components/      # React 元件
│   │   ├── pages/           # 頁面元件
│   │   ├── utils/           # 工具函數
│   │   └── types/           # TypeScript 類型
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                  # Node.js 後端
│   ├── src/
│   │   ├── routes/          # API 路由
│   │   ├── models/          # 資料模型
│   │   ├── database/        # 資料庫相關
│   │   │   ├── connection.ts
│   │   │   ├── schema.sql
│   │   │   └── migrations/
│   │   ├── types/           # TypeScript 類型
│   │   └── index.ts         # 入口文件
│   ├── package.json
│   └── tsconfig.json
│
├── docs/                     # 文件
├── log/                      # 日誌文件
├── README.md                 # 專案說明
├── DEPLOYMENT_GUIDE.md       # 部署指南
├── SYSTEM_DIAGNOSIS.md       # 系統診斷
└── DEVELOPER_ONBOARDING.md   # 本文件
```

## 🚀 本地開發環境設置

### 前置需求

```bash
# 必須安裝
- Node.js >= 18.0.0
- PostgreSQL >= 14
- Git
- npm 或 yarn

# 檢查版本
node --version
npm --version
psql --version
```

### 1. Clone 專案

```bash
git clone https://github.com/wincat26/finance-tool.git
cd finance-tool
```

### 2. 安裝依賴

```bash
# 安裝後端依賴
cd backend
npm install

# 安裝前端依賴
cd ../frontend
npm install
```

### 3. 設置資料庫

```bash
# 建立資料庫
createdb finance_tool

# 或使用 psql
psql -U postgres
CREATE DATABASE finance_tool;
\q

# 執行 schema
psql -U postgres -d finance_tool -f backend/src/database/schema.sql

# 執行最新 migration（財務欄位）
psql -U postgres -d finance_tool -f backend/src/database/migrations/add_missing_columns.sql
```

### 4. 配置環境變數

**後端** (`backend/.env`):
```env
# 資料庫設定
DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tool
DB_USER=postgres
DB_PASSWORD=your_password

# 伺服器設定
PORT=3001
NODE_ENV=development
```

**前端** (`frontend/.env`):
```env
VITE_API_BASE_URL=http://localhost:3001/api
```

### 5. 啟動開發伺服器

```bash
# Terminal 1 - 啟動後端
cd backend
npm run dev
# 後端運行在 http://localhost:3001

# Terminal 2 - 啟動前端
cd frontend
npm run dev
# 前端運行在 http://localhost:3000
```

### 6. 驗證安裝

```bash
# 測試後端 API
curl http://localhost:3001/api/projects

# 或在瀏覽器訪問
open http://localhost:3000
```

## 📊 資料庫結構

### 主要資料表

#### projects (專案/客戶)
```sql
- id: SERIAL PRIMARY KEY
- company_name: VARCHAR(255) NOT NULL
- company_alias: VARCHAR(255)              -- 新增：公司別名
- vat_number: VARCHAR(50)
- contact_name: VARCHAR(255) NOT NULL
- contact_phone: VARCHAR(50)
- contact_email: VARCHAR(255)
- project_date: DATE NOT NULL
- responsible_person: VARCHAR(255) NOT NULL
- status: VARCHAR(20)
- description: TEXT
- finance_contact_name: VARCHAR(255)       -- 新增：財務人員姓名
- finance_contact_phone: VARCHAR(50)       -- 新增：財務人員電話
- finance_contact_email: VARCHAR(255)      -- 新增：財務人員Email
- finance_notes: TEXT                      -- 新增：財務備註
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

#### revenues (收入)
```sql
- id, project_id, service_type, amount, income_date
- invoice_number, status, notes
```

#### expenses (支出)
```sql
- id, project_id, supplier_name, expense_type
- amount, expense_date, invoice_number, notes
```

#### project_files (檔案)
```sql
- id, project_id, file_type, file_name
- google_drive_url
```

## 🔧 開發指令

### 後端

```bash
cd backend

# 開發模式（熱重載）
npm run dev

# 編譯 TypeScript
npm run build

# 生產模式
npm start

# 執行資料庫遷移
npm run migrate
```

### 前端

```bash
cd frontend

# 開發模式
npm run dev

# 編譯生產版本
npm run build

# 預覽生產版本
npm run preview
```

## 🐛 當前問題

### ❌ 生產環境問題

**症狀**: Zeabur 後端 API 返回 500 錯誤

**已確認**:
- ✅ 本地環境完全正常
- ✅ 代碼沒有問題
- ✅ 資料庫結構正確
- ✅ 最新代碼已部署

**需要調查**:
1. Zeabur 後端日誌中的具體錯誤
2. 資料庫連接是否正常
3. 環境變數是否正確注入

**測試方法**:
```bash
# 測試生產 API
curl https://finance-reddoor.zeabur.app/api/projects

# 預期: 返回專案列表
# 實際: {"error":"取得專案列表失敗"}
```

## 📝 最近更新

### 2024-11-02: 財務欄位新增

**變更內容**:
1. 資料庫新增 5 個財務相關欄位
2. 前端 CustomerModal 新增財務資訊區塊
3. 後端 API 支援新欄位的驗證和儲存

**相關 Commits**:
- `16358e6` - Add finance contact fields to projects table
- `877d22f` - Update backend API to support finance contact fields
- `37f620c` - Update gitignore to exclude all log files
- `234e4b2` - Add deployment scripts and documentation
- `25b3060` - Add migration tools and complete local migration

**檔案變更**:
- `backend/src/database/migrations/add_missing_columns.sql` (新增)
- `backend/src/types/index.ts` (更新)
- `backend/src/routes/customers.ts` (更新)
- `backend/src/routes/projects.ts` (更新)
- `backend/src/models/Project.ts` (更新)
- `frontend/src/components/CustomerModal.tsx` (更新)

## 🔍 除錯指南

### 後端除錯

```bash
# 查看資料庫連接
cd backend
node -e "const pool = require('./dist/database/connection').default; pool.query('SELECT NOW()').then(r => console.log('✅ DB OK:', r.rows[0])).catch(e => console.error('❌ Error:', e));"

# 測試特定 API
curl -v http://localhost:3001/api/projects
curl -v http://localhost:3001/api/customers

# 查看編譯後的代碼
cat backend/dist/index.js
```

### 前端除錯

```bash
# 檢查環境變數
cd frontend
cat .env

# 查看編譯輸出
npm run build

# 檢查 API 配置
cat src/utils/api.ts
```

### 資料庫除錯

```bash
# 連接資料庫
psql -U postgres -d finance_tool

# 查看所有表
\dt

# 查看 projects 表結構
\d projects

# 查看資料
SELECT * FROM projects LIMIT 5;

# 檢查財務欄位
SELECT company_name, company_alias, finance_contact_name 
FROM projects 
WHERE finance_contact_name IS NOT NULL;
```

## 🌐 API 端點

### 客戶管理
```
GET    /api/customers              # 取得客戶列表
POST   /api/customers              # 新增客戶
PUT    /api/customers/:id          # 更新客戶
DELETE /api/customers/:id          # 刪除客戶
```

### 專案管理
```
GET    /api/projects               # 取得專案列表
GET    /api/projects/:id           # 取得單一專案
POST   /api/projects               # 新增專案
PUT    /api/projects/:id           # 更新專案
DELETE /api/projects/:id           # 刪除專案
```

### 檔案管理
```
GET    /api/customers/:id/files    # 取得客戶檔案
POST   /api/customers/:id/files    # 新增檔案
PUT    /api/customers/:id/files/:fileId    # 更新檔案
DELETE /api/customers/:id/files/:fileId    # 刪除檔案
```

### 收支管理
```
GET    /api/customers/:id/revenues    # 取得收入
POST   /api/customers/:id/revenues    # 新增收入
GET    /api/customers/:id/expenses    # 取得支出
POST   /api/customers/:id/expenses    # 新增支出
```

### 報表
```
GET    /api/finance/annual-report?year=2024    # 年度收益表
GET    /api/dashboard?year=2024                # Dashboard 數據
```

## 🤝 如何協助

### 優先任務

1. **修復 Zeabur 部署問題** (高優先)
   - 查看 Zeabur 後端日誌
   - 找出資料庫連接錯誤
   - 修復並驗證

2. **添加健康檢查端點** (中優先)
   ```typescript
   // backend/src/routes/health.ts
   router.get('/health', async (req, res) => {
     try {
       await pool.query('SELECT 1');
       res.json({ status: 'ok', database: 'connected' });
     } catch (error) {
       res.status(500).json({ status: 'error', database: 'disconnected' });
     }
   });
   ```

3. **改善錯誤處理** (中優先)
   - 返回更詳細的錯誤訊息
   - 添加結構化日誌

4. **添加測試** (低優先)
   - 單元測試
   - 整合測試
   - E2E 測試

### 開發流程

1. **建立分支**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **開發並測試**
   ```bash
   # 本地測試
   npm run dev
   ```

3. **提交變更**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

4. **建立 Pull Request**
   - 在 GitHub 上建立 PR
   - 描述變更內容
   - 等待審核

## 📚 相關文件

- `README.md` - 專案概述
- `DEPLOYMENT_GUIDE.md` - 部署指南
- `SYSTEM_DIAGNOSIS.md` - 系統診斷報告
- `RELEASE_NOTES.md` - 版本發布說明
- `MIGRATION_COMPLETE.md` - 遷移完成報告

## 💬 聯絡方式

- **GitHub**: https://github.com/wincat26/finance-tool
- **Issues**: https://github.com/wincat26/finance-tool/issues

## 🎯 快速開始檢查清單

- [ ] Clone 專案
- [ ] 安裝 Node.js 和 PostgreSQL
- [ ] 安裝依賴 (backend + frontend)
- [ ] 建立資料庫
- [ ] 執行 schema 和 migrations
- [ ] 配置環境變數
- [ ] 啟動後端 (port 3001)
- [ ] 啟動前端 (port 3000)
- [ ] 測試 API 連接
- [ ] 查看 Zeabur 日誌找出生產問題

---

**歡迎加入！如有任何問題，請查看文件或建立 Issue。**
