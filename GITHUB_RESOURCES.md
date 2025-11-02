# GitHub 資源清單

## 📦 Repository 資訊

**Repository URL**: https://github.com/wincat26/finance-tool  
**Branch**: main  
**最後更新**: 2024-11-02

## 📁 完整檔案結構

```
finance-tool/
├── .git/                          # Git 版本控制
├── .gitignore                     # Git 忽略規則
├── .zeabur/                       # Zeabur 配置
│   └── config.json
│
├── frontend/                      # 前端應用
│   ├── public/                    # 靜態資源
│   ├── src/
│   │   ├── components/           # React 元件
│   │   │   ├── CustomerModal.tsx        # ⭐ 客戶表單（含財務欄位）
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CustomerList.tsx
│   │   │   ├── ProjectList.tsx
│   │   │   ├── RevenueModal.tsx
│   │   │   ├── ExpenseModal.tsx
│   │   │   └── AnnualReport.tsx
│   │   ├── pages/                # 頁面
│   │   │   ├── CustomersPage.tsx
│   │   │   ├── ProjectsPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   └── ReportsPage.tsx
│   │   ├── utils/                # 工具函數
│   │   │   └── api.ts            # API 客戶端配置
│   │   ├── types/                # TypeScript 類型
│   │   ├── App.tsx               # 主應用元件
│   │   └── main.tsx              # 入口文件
│   ├── .env.production           # 生產環境變數
│   ├── index.html
│   ├── package.json              # 依賴管理
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js        # Tailwind 配置
│   ├── tsconfig.json             # TypeScript 配置
│   ├── vercel.json               # Vercel 部署配置
│   └── vite.config.ts            # Vite 配置
│
├── backend/                       # 後端 API
│   ├── src/
│   │   ├── database/
│   │   │   ├── migrations/
│   │   │   │   └── add_missing_columns.sql  # ⭐ 財務欄位遷移
│   │   │   ├── connection.ts     # 資料庫連接
│   │   │   ├── schema.sql        # 資料庫結構
│   │   │   ├── seed.ts           # 測試資料
│   │   │   ├── migrate.ts        # 遷移工具
│   │   │   └── run-migration.ts  # ⭐ 遷移執行腳本
│   │   ├── models/
│   │   │   ├── Project.ts        # ⭐ 專案模型（已更新）
│   │   │   └── Revenue.ts
│   │   ├── routes/
│   │   │   ├── customers.ts      # ⭐ 客戶 API（已更新）
│   │   │   ├── projects.ts       # ⭐ 專案 API（已更新）
│   │   │   ├── dashboard.ts      # ⭐ Dashboard API（已修復）
│   │   │   └── finance.ts        # 財務報表 API
│   │   ├── types/
│   │   │   └── index.ts          # ⭐ TypeScript 類型（已更新）
│   │   ├── utils/
│   │   └── index.ts              # 主入口
│   ├── dist/                     # 編譯輸出
│   ├── .env                      # 本地環境變數
│   ├── .env.example              # 環境變數範例
│   ├── .env.production           # 生產環境變數
│   ├── package.json              # ⭐ 依賴管理（新增 migrate 腳本）
│   ├── package-lock.json
│   └── tsconfig.json             # TypeScript 配置
│
├── database/                      # 資料庫相關（舊）
├── docs/                          # 文件目錄
├── log/                           # 日誌文件
│   ├── runtime-log-*.log.gz      # 運行日誌
│   └── finance-tool-sage.vercel.app-*.log
│
├── src/                           # 根目錄源碼（舊結構）
│   ├── database/
│   ├── models/
│   ├── routes/
│   ├── types/
│   └── utils/
│
├── .env.example                   # 環境變數範例
├── add_test_data.sql             # 測試資料
├── Dockerfile                     # Docker 配置
├── package.json                   # 根 package.json
├── package-lock.json
├── tsconfig.json                  # 根 TypeScript 配置
├── zeabur.json                    # Zeabur 配置
│
├── README.md                      # ⭐ 專案說明
├── RELEASE_NOTES.md              # 版本說明
├── DEPLOYMENT_GUIDE.md           # ⭐ 部署指南
├── DEPLOYMENT_STATUS.md          # 部署狀態
├── MIGRATION_COMPLETE.md         # 遷移完成報告
├── SYSTEM_DIAGNOSIS.md           # ⭐ 系統診斷
├── DEVELOPER_ONBOARDING.md       # ⭐ 開發者指南
├── GITHUB_RESOURCES.md           # ⭐ 本文件
│
├── migrate-production.sh         # 生產遷移腳本
├── run-migration.sh              # 遷移腳本
└── init-production-db.sql        # 完整資料庫初始化
```

## 🔑 關鍵檔案說明

### ⭐ 最近更新的檔案

#### 1. 資料庫遷移
- `backend/src/database/migrations/add_missing_columns.sql`
  - 新增 5 個財務欄位到 projects 表
  - 使用 `IF NOT EXISTS` 確保冪等性

#### 2. 前端元件
- `frontend/src/components/CustomerModal.tsx`
  - 新增財務資訊區塊
  - 表單驗證（電話、Email）
  - 變更追蹤功能

#### 3. 後端 API
- `backend/src/routes/customers.ts`
  - 更新 customerSchema 支援財務欄位
  - Email 驗證允許空字串

- `backend/src/routes/projects.ts`
  - 更新 projectSchema 支援財務欄位

- `backend/src/models/Project.ts`
  - 更新 create 方法包含財務欄位
  - 修復 TypeScript null 檢查

- `backend/src/routes/dashboard.ts`
  - 修復錯誤處理的類型問題

#### 4. TypeScript 類型
- `backend/src/types/index.ts`
  - Project 介面新增 5 個財務欄位

#### 5. 部署工具
- `backend/src/database/run-migration.ts`
  - TypeScript 遷移執行腳本
  - 自動驗證新欄位

- `backend/package.json`
  - 新增 `npm run migrate` 腳本

### 📄 配置檔案

#### 前端配置
- `frontend/vite.config.ts` - Vite 構建配置
- `frontend/tailwind.config.js` - Tailwind CSS 配置
- `frontend/tsconfig.json` - TypeScript 配置
- `frontend/vercel.json` - Vercel 部署配置
- `frontend/.env.production` - 生產環境 API URL

#### 後端配置
- `backend/tsconfig.json` - TypeScript 配置
- `backend/.env` - 本地資料庫連接
- `backend/.env.production` - 生產環境變數模板

#### 部署配置
- `.zeabur/config.json` - Zeabur 服務配置
- `zeabur.json` - Zeabur 專案配置
- `Dockerfile` - Docker 容器配置

## 📊 Git 歷史

### 最近 Commits

```bash
234e4b2 - Add deployment scripts and documentation
877d22f - Update backend API to support finance contact fields
16358e6 - Add finance contact fields to projects table
37f620c - Update gitignore to exclude all log files
717c47c - Fix CORS preflight - add OPTIONS method and headers
418f1e9 - Fix CORS to allow Vercel domain
b4afec9 - Remove port 8080 from API URL
ab83f1a - Fix API calls to use correct backend URL
c9247ce - Add Vercel proxy to redirect API calls
06f63a3 - Fix CustomerModal error handling
```

### 查看完整歷史

```bash
git log --oneline --graph --all
git log --stat
git log -p backend/src/types/index.ts  # 查看特定檔案歷史
```

## 🔍 重要代碼片段

### 1. 資料庫連接 (backend/src/database/connection.ts)

```typescript
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.POSTGRES_USERNAME || process.env.DB_USER || 'postgres',
  host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.POSTGRES_DATABASE || process.env.DB_NAME || 'finance_tool',
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432'),
});

export default pool;
```

### 2. API 客戶端配置 (frontend/src/utils/api.ts)

```typescript
import axios from 'axios';

const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL: API_BASE || undefined,
  withCredentials: true,
});
```

### 3. 財務欄位 Schema (backend/src/routes/customers.ts)

```typescript
const customerSchema = z.object({
  company_name: z.string().min(1),
  company_alias: z.string().optional(),
  // ... 其他欄位
  finance_contact_name: z.string().optional(),
  finance_contact_phone: z.string().optional(),
  finance_contact_email: z.string().email().optional().or(z.literal('')),
  finance_notes: z.string().optional()
});
```

## 📦 依賴套件

### 前端主要依賴

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.1",
  "axios": "^1.6.2",
  "recharts": "^2.10.3",
  "lucide-react": "^0.294.0",
  "tailwindcss": "^3.3.6"
}
```

### 後端主要依賴

```json
{
  "express": "^4.18.2",
  "pg": "^8.11.3",
  "zod": "^3.22.4",
  "cors": "^2.8.5",
  "helmet": "^7.1.0",
  "dotenv": "^16.3.1"
}
```

## 🌐 部署資訊

### 前端 (Vercel)
- **URL**: https://finance-tool-sage.vercel.app
- **Repository**: 自動部署 main 分支
- **環境變數**: 
  - `VITE_API_BASE_URL`: https://finance-reddoor.zeabur.app/api

### 後端 (Zeabur)
- **URL**: https://finance-reddoor.zeabur.app
- **Repository**: 自動部署 main 分支
- **環境變數**: 自動注入 PostgreSQL 連接資訊
  - `POSTGRES_HOST`
  - `POSTGRES_PORT`
  - `POSTGRES_DATABASE`
  - `POSTGRES_USERNAME`
  - `POSTGRES_PASSWORD`

### 資料庫 (Zeabur PostgreSQL)
- **Host**: postgresql.zeabur.internal (內部)
- **Host**: hndl.clusters.zeabur.com (外部)
- **Port**: 5432 (內部) / 26006 (外部)
- **Database**: zeabur
- **User**: root

## 🔐 環境變數範例

### 本地開發 (backend/.env)

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

### 本地開發 (frontend/.env)

```env
VITE_API_BASE_URL=http://localhost:3001/api
```

## 📝 開發工作流程

### 1. Clone 並設置

```bash
# Clone repository
git clone https://github.com/wincat26/finance-tool.git
cd finance-tool

# 安裝依賴
cd backend && npm install
cd ../frontend && npm install
```

### 2. 設置資料庫

```bash
# 建立資料庫
createdb finance_tool

# 執行 schema
psql -d finance_tool -f backend/src/database/schema.sql

# 執行 migrations
psql -d finance_tool -f backend/src/database/migrations/add_missing_columns.sql
```

### 3. 啟動開發

```bash
# Terminal 1 - 後端
cd backend
npm run dev

# Terminal 2 - 前端
cd frontend
npm run dev
```

### 4. 建立功能分支

```bash
git checkout -b feature/your-feature
# 開發...
git add .
git commit -m "feat: description"
git push origin feature/your-feature
```

## 🐛 已知問題

### 生產環境問題

**問題**: Zeabur 後端 API 返回 500 錯誤

**狀態**: 🔴 待修復

**影響**: 生產環境無法使用

**本地環境**: ✅ 完全正常

**需要**:
1. 查看 Zeabur 後端日誌
2. 驗證資料庫連接
3. 檢查環境變數

## 📚 相關連結

- **GitHub Repository**: https://github.com/wincat26/finance-tool
- **前端部署**: https://finance-tool-sage.vercel.app
- **後端部署**: https://finance-reddoor.zeabur.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Zeabur Dashboard**: https://zeabur.com/dashboard

## 🤝 貢獻指南

1. Fork 專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📞 支援

如有問題，請：
1. 查看 `DEVELOPER_ONBOARDING.md`
2. 查看 `SYSTEM_DIAGNOSIS.md`
3. 在 GitHub 建立 Issue
4. 聯絡專案維護者

---

**最後更新**: 2024-11-02  
**維護者**: Winson Lu  
**狀態**: 開發中
