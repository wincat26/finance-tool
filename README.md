# 財務互動工具 (MVP)

專為專案型業務、代理、接案團隊設計的「進案+收支+檔案+報表」互動工具。

## 功能特色

- 🎯 **進案管理**: 完整專案進案流程，客戶資料、合約檔案一站管理
- 💰 **收支追蹤**: 分期收款、多來源支出、科目自訂
- 📊 **動態報表**: 即時Dashboard、年度切換、一鍵匯出
- 📁 **檔案整合**: Google Drive連結，合約、委刊單集中管理

## 技術架構

- **前端**: React + TypeScript + Tailwind CSS + Vite
- **後端**: Node.js + Express + TypeScript
- **資料庫**: PostgreSQL
- **圖表**: Recharts
- **部署**: GitHub + Zeabur

## 快速開始

### 1. 安裝依賴

```bash
# 安裝後端依賴
npm install --workspace backend

# 安裝前端依賴
npm install --workspace frontend
```

### 2. 設定資料庫

```bash
# 安裝 PostgreSQL (macOS)
brew install postgresql
brew services start postgresql

# 建立資料庫
createdb finance_tool
```

### 3. 設定環境變數

```bash
# 複製環境變數範例
cp backend/.env.example backend/.env

# 編輯 backend/.env 設定資料庫連線
```

### 4. 初始化資料庫

```bash
# 匯入 schema（第一次安裝）
psql -U postgres -d finance_tool -f backend/src/database/schema.sql

# 執行所有 migrations
npm run backend:migrate
```

### 5. 啟動開發伺服器

```bash
# 分別啟動
npm run backend:dev  # 後端: http://localhost:3001
npm run frontend:dev # 前端: http://localhost:3000
```

## 專案結構

```
finance-tool/
├── package.json           # npm workspace 管理
├── backend/               # Node.js 後端 API
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│   │   ├── routes/        # API 路由
│   │   ├── models/        # 資料模型
│   │   ├── database/      # 資料庫相關
│   │   ├── utils/         # 工具函數
│   │   └── types/         # TypeScript 型別
├── frontend/              # React 前端應用
│   ├── package.json
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── hooks/
│       ├── utils/
│       └── types/
└── docs/                  # 專案文件
```

## API 端點

### 專案管理
- `GET /api/projects` - 取得專案列表
- `GET /api/projects/:id` - 取得單一專案
- `POST /api/projects` - 建立專案
- `PUT /api/projects/:id` - 更新專案
- `DELETE /api/projects/:id` - 刪除專案
- `POST /api/projects/:id/files` - 新增專案檔案

### Dashboard
- `GET /api/dashboard?year=2024` - 取得 Dashboard 統計資料

## 資料庫結構

### 主要資料表
- `projects` - 專案基本資料
- `project_files` - 專案檔案連結
- `customers` - 客戶資料
- `revenues` - 收入記錄
- `revenue_installments` - 分期收款
- `expenses` - 支出記錄
- `revenue_categories` - 收入分類
- `expense_categories` - 支出分類

## 開發指南

### 新增功能
1. 後端：在 `backend/src/routes/` 新增路由
2. 前端：在 `frontend/src/components/` 新增元件
3. 資料庫：更新 `backend/src/database/schema.sql`

### 部署
```bash
# 建置專案
npm run build

# 部署到 Zeabur
# 1. 推送到 GitHub
# 2. 在 Zeabur 連接 GitHub repo
# 3. 設定環境變數
# 4. 部署
```

## 未來擴充

- [ ] 收支管理模組完整實作
- [ ] 報表匯出功能 (CSV/Google Sheets)
- [ ] 多用戶支援
- [ ] 權限管理
- [ ] API 自動串接
- [ ] 行動版優化
- [ ] 通知系統

## 授權

MIT License
