# QA 測試清單

## 環境檢查

### 生產環境
- [x] 前端: https://finance-tool-sage.vercel.app
- [x] 後端: https://finance-reddoor.zeabur.app
- [x] 資料庫: Zeabur PostgreSQL (已連接)

### 環境變數
- [x] VITE_API_BASE_URL: https://finance-reddoor.zeabur.app
- [x] POSTGRES_HOST: service-6906f5ac0ada8cc29857d7c4
- [x] POSTGRES_PORT: 5432
- [x] POSTGRES_DATABASE: zeabur
- [x] POSTGRES_USERNAME: root
- [x] POSTGRES_PASSWORD: (已設定)

## 功能測試

### 1. Dashboard (/)
- [ ] 顯示總收入、總支出、淨利潤、進案總數
- [ ] 月度現金流走勢圖表正常顯示
- [ ] 支出結構分析圖表正常顯示
- [ ] 分期收款進度正常顯示
- [ ] 年份選擇器正常運作

### 2. 客戶管理 (/customers)
- [ ] 客戶列表正常顯示
- [ ] 搜尋功能正常
- [ ] 狀態篩選正常
- [ ] 年份篩選正常
- [ ] 新增客戶功能正常
- [ ] 編輯客戶功能正常
- [ ] 客戶詳情頁正常顯示

### 3. 客戶詳情
#### 基本資料
- [ ] 顯示公司資訊
- [ ] 顯示聯絡資訊
- [ ] 顯示財務資訊
- [ ] 編輯功能正常

#### 檔案管理
- [ ] 檔案列表正常顯示
- [ ] 檔案類型篩選正常
- [ ] 新增檔案功能正常
- [ ] 編輯檔案功能正常
- [ ] 刪除檔案功能正常
- [ ] 開啟 Google Drive 連結正常

#### 收入記錄
- [ ] 收入列表正常顯示
- [ ] 新增收入功能正常
- [ ] 編輯收入功能正常
- [ ] 刪除收入功能正常
- [ ] 收款狀態顯示正確

#### 支出記錄
- [ ] 支出列表正常顯示
- [ ] 支出類型篩選正常
- [ ] 新增支出功能正常
- [ ] 編輯支出功能正常
- [ ] 刪除支出功能正常
- [ ] 廣告費自動計算稅費正常
- [ ] 請款提醒標記正常

#### 損益報表
- [ ] 收入總計正確
- [ ] 支出總計正確
- [ ] 淨利潤計算正確

### 4. 收支管理 (/finance)
- [ ] 年度收益表正常顯示
- [ ] 收入數據按公司分組正確
- [ ] 支出數據按公司分組正確
- [ ] 月份數據正確
- [ ] 展開/收合功能正常
- [ ] 匯出 CSV 功能正常
- [ ] 年份選擇器正常運作

### 5. 報表匯出 (/reports)
- [ ] 頁面正常顯示（功能開發中提示）

## API 測試

### 後端 API
- [x] GET /health - 健康檢查
- [x] GET /api/dashboard?year=2025 - Dashboard 數據
- [x] GET /api/customers?year=2025 - 客戶列表
- [x] POST /api/customers - 新增客戶
- [x] PUT /api/customers/:id - 更新客戶
- [x] GET /api/customers/:id/files - 客戶檔案
- [x] POST /api/customers/:id/files - 新增檔案
- [x] PUT /api/customers/:id/files/:fileId - 更新檔案
- [x] DELETE /api/customers/:id/files/:fileId - 刪除檔案
- [x] GET /api/customers/:id/revenues - 客戶收入
- [x] POST /api/customers/:id/revenues - 新增收入
- [x] PUT /api/customers/:id/revenues/:revenueId - 更新收入
- [x] DELETE /api/customers/:id/revenues/:revenueId - 刪除收入
- [x] GET /api/customers/:id/expenses - 客戶支出
- [x] POST /api/customers/:id/expenses - 新增支出
- [x] PUT /api/customers/:id/expenses/:expenseId - 更新支出
- [x] DELETE /api/customers/:id/expenses/:expenseId - 刪除支出
- [x] GET /api/finance/annual-report?year=2025 - 年度報表

## 資料庫檢查

### 資料表結構
- [x] projects 表 (16 欄位)
  - [x] company_alias
  - [x] finance_contact_name
  - [x] finance_contact_phone
  - [x] finance_contact_email
  - [x] finance_notes
- [x] expenses 表 (16 欄位)
  - [x] payment_request
  - [x] ad_platform
  - [x] card_fee
  - [x] overseas_tax
  - [x] business_tax
- [x] revenues 表 (12 欄位)
- [x] project_files 表

## 已知問題與修復

### 已修復
1. ✅ API 路徑重複 `/api` 問題
2. ✅ 資料庫欄位缺失問題
3. ✅ CORS 問題
4. ✅ Boolean 判斷錯誤 (Postgres 't' 字串)
5. ✅ SQL GROUP BY 子句錯誤
6. ✅ Vercel SPA 路由 404 問題
7. ✅ 環境變數配置問題

### 待測試
- [ ] 直接訪問 /finance 路由是否正常
- [ ] 所有 CRUD 操作是否正常
- [ ] 廣告費稅費計算是否正確
- [ ] CSV 匯出功能是否正常

## 測試步驟

### 基本流程測試
1. 訪問首頁，檢查 Dashboard 數據
2. 進入客戶管理，新增一個測試客戶
3. 進入客戶詳情，新增收入記錄
4. 新增支出記錄（包含廣告費）
5. 檢查損益報表計算是否正確
6. 進入收支管理，檢查年度報表
7. 測試匯出 CSV 功能

### 邊界測試
1. 測試空資料狀態
2. 測試大量資料顯示
3. 測試特殊字元輸入
4. 測試日期邊界值
5. 測試金額計算精度

### 錯誤處理測試
1. 測試網路斷線情況
2. 測試後端 API 錯誤
3. 測試表單驗證
4. 測試必填欄位

## 效能檢查
- [ ] 首頁載入時間 < 3 秒
- [ ] API 回應時間 < 1 秒
- [ ] 圖表渲染流暢
- [ ] 大量資料載入不卡頓

## 安全檢查
- [ ] SQL Injection 防護
- [ ] XSS 防護
- [ ] CSRF 防護
- [ ] 敏感資料加密
- [ ] API 錯誤訊息不洩漏資訊

## 瀏覽器相容性
- [ ] Chrome (最新版)
- [ ] Firefox (最新版)
- [ ] Safari (最新版)
- [ ] Edge (最新版)

## 行動裝置測試
- [ ] iOS Safari
- [ ] Android Chrome
- [ ] 響應式設計正常
- [ ] 觸控操作正常
