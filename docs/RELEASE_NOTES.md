# 財務管理工具 Release Notes

## Version 1.0.0 - 2024/10/31

### 🎉 首次發布

完整的專案型業務財務管理系統，支援客戶管理、收支記錄、年度報表等核心功能。

### ✨ 新功能

#### 🏢 客戶管理系統
- 客戶基本資料管理（公司名稱、聯絡人、統編等）
- 專案狀態追蹤（進行中、已完成、已取消）
- 檔案分類管理（合約、委刊單、報價單等）
- 年度篩選和搜尋功能

#### 💰 收支記錄功能
- **收入管理**
  - 支援四種服務類型：顧問費、產品使用、行銷費用、其他
  - 收款狀態追蹤（待收、部分收款、已完成）
  - 發票號碼記錄
- **支出管理**
  - 廣告費特殊處理（Meta/Google/Line 平台選擇）
  - 自動稅費計算（Meta 刷卡費 1.5% + 境外稅 3%，Google/Line 營業稅 5%）
  - 請款提醒功能
  - 月份認列而非具體日期

#### 📊 年度收益表
- 公司別名和收支細項兩個維度展開
- 可展開/收合的階層式顯示
- 月度收支統計
- 淨收益計算
- CSV 匯出功能
- 年份篩選

#### 📈 Dashboard 儀表板
- 關鍵財務指標卡片（總收入、總支出、淨利潤、進案總數）
- 月度現金流走勢圖
- 支出結構分析圓餅圖
- 分期收款進度追蹤
- 年度數據篩選

### 🏗️ 技術架構

#### 前端
- **框架**: React 18 + TypeScript
- **UI**: Tailwind CSS + Headless UI
- **圖表**: Recharts
- **路由**: React Router DOM
- **HTTP**: Axios
- **部署**: Vercel

#### 後端
- **框架**: Node.js + Express + TypeScript
- **資料庫**: PostgreSQL
- **驗證**: Zod
- **安全**: Helmet + CORS
- **部署**: Zeabur

#### 資料庫設計
- `projects` - 專案/客戶資料
- `project_files` - 檔案管理
- `revenues` - 收入記錄
- `expenses` - 支出記錄

### 🚀 部署資訊

- **前端 URL**: https://finance-tool-sage.vercel.app
- **後端 API**: https://finance-reddoor.zeabur.app:8080
- **資料庫**: PostgreSQL on Zeabur
- **代碼倉庫**: https://github.com/wincat26/finance-tool

### 🔧 部署修復

#### 解決的問題
- ✅ 修復 Rollup 平台依賴問題（降級 Vite 至 4.5.0）
- ✅ 修復 TypeScript 編譯錯誤
- ✅ 配置 CORS 允許前端域名訪問
- ✅ 修復生產環境 API URL 配置
- ✅ 解決 `process` 未定義問題

#### 配置優化
- 簡化 TypeScript 檢查設定
- 扁平化專案結構適配 Zeabur
- 配置 Vercel 部署參數
- 設置環境變數

### 📋 API 端點

#### 客戶管理
- `GET /api/customers` - 取得客戶列表
- `POST /api/customers` - 新增客戶
- `PUT /api/customers/:id` - 更新客戶
- `DELETE /api/customers/:id` - 刪除客戶

#### 檔案管理
- `GET /api/customers/:id/files` - 取得客戶檔案
- `POST /api/customers/:id/files` - 新增檔案
- `PUT /api/customers/:id/files/:fileId` - 更新檔案
- `DELETE /api/customers/:id/files/:fileId` - 刪除檔案

#### 收支管理
- `GET /api/customers/:id/revenues` - 取得收入記錄
- `POST /api/customers/:id/revenues` - 新增收入
- `PUT /api/customers/:id/revenues/:revenueId` - 更新收入
- `DELETE /api/customers/:id/revenues/:revenueId` - 刪除收入
- `GET /api/customers/:id/expenses` - 取得支出記錄
- `POST /api/customers/:id/expenses` - 新增支出
- `PUT /api/customers/:id/expenses/:expenseId` - 更新支出
- `DELETE /api/customers/:id/expenses/:expenseId` - 刪除支出

#### 報表功能
- `GET /api/finance/annual-report?year=2024` - 年度收益表
- `GET /api/dashboard?year=2024` - Dashboard 數據

### 🎯 核心特色

1. **專案導向設計** - 以客戶專案為核心的財務管理
2. **廣告費智能處理** - 自動計算不同平台的稅費
3. **階層式報表** - 支援公司和細項兩個維度的數據展開
4. **請款提醒** - 支出記錄整合請款流程管理
5. **月度認列** - 財務認列以月份為單位，符合會計實務
6. **響應式設計** - 支援桌面和移動設備
7. **即時部署** - 前後端分離，支援獨立部署和擴展

### 📝 使用說明

1. **客戶管理**: 新增客戶 → 上傳相關檔案 → 記錄收支
2. **收支記錄**: 選擇客戶 → 新增收入/支出 → 設定認列月份
3. **年度報表**: 選擇年份 → 查看收支統計 → 匯出 CSV
4. **Dashboard**: 總覽年度財務狀況和關鍵指標

### 🔮 未來規劃

- [ ] 分期收款功能完善
- [ ] 更多報表類型
- [ ] 權限管理系統
- [ ] 資料匯入/匯出功能
- [ ] 移動端 App

---

**開發團隊**: Amazon Q Assistant  
**發布日期**: 2024年10月31日  
**版本**: 1.0.0  
**狀態**: 生產就緒 ✅