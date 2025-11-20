# 快速上手指南

## 🚀 5 分鐘快速開始

### 1. 訪問系統
```
前端: https://finance-tool-sage.vercel.app
後端: https://finance-reddoor.zeabur.app/api
```

### 2. 基本操作

#### 新增客戶
1. 點擊「新增客戶」
2. 填寫公司名稱、聯絡人、負責業務（必填）
3. 選填：統編、電話、Email、財務資訊
4. 點擊「儲存」

#### 新增收入
1. 點擊客戶進入詳情
2. 切換到「收入記錄」標籤
3. 點擊「新增收入」
4. 選擇服務類型、填寫金額和日期
5. 點擊「儲存」

#### 新增支出
1. 點擊客戶進入詳情
2. 切換到「支出記錄」標籤
3. 點擊「新增支出」
4. 選擇支出類型
   - 廣告費：選擇平台（Meta/Google/Line）自動計算稅費
   - 其他：填寫供應商名稱
5. 填寫金額和認列月份
6. 點擊「儲存」

---

## 💻 本地開發（15 分鐘）

### 前置需求
```bash
node --version  # 需要 v18+
psql --version  # 需要 v14+
```

### 快速設置
```bash
# 1. Clone
git clone https://github.com/wincat26/finance-tool.git
cd finance-tool

# 2. 安裝
cd backend && npm install
cd ../frontend && npm install

# 3. 資料庫
createdb finance_tool
psql -d finance_tool -f backend/src/database/schema.sql
psql -d finance_tool -f backend/src/database/migrations/add_missing_columns.sql
psql -d finance_tool -f backend/src/database/migrations/add_expense_fields.sql

# 4. 環境變數
echo "DB_HOST=localhost
DB_PORT=5432
DB_NAME=finance_tool
DB_USER=postgres
DB_PASSWORD=
PORT=3001
NODE_ENV=development" > backend/.env

echo "VITE_API_BASE_URL=http://localhost:3001/api" > frontend/.env

# 5. 啟動
cd backend && npm run dev &
cd frontend && npm run dev
```

訪問 http://localhost:3000

---

## 🔧 常用指令

### 開發
```bash
# 後端
cd backend
npm run dev      # 開發模式（熱重載）
npm run build    # 編譯
npm start        # 生產模式
npm run migrate  # 執行遷移

# 前端
cd frontend
npm run dev      # 開發模式
npm run build    # 編譯
npm run preview  # 預覽生產版本
```

### Git
```bash
git status                    # 查看狀態
git log --oneline -10        # 查看歷史
git diff                     # 查看變更
git add .                    # 加入變更
git commit -m "message"      # 提交
git push origin main         # 推送（自動部署）
```

### 資料庫
```bash
# 本地
psql -d finance_tool
\dt                          # 列出所有表
\d projects                  # 查看表結構
SELECT * FROM projects;      # 查詢資料

# 生產（Zeabur Dashboard → PostgreSQL Service → Console）
SELECT COUNT(*) FROM projects;
SELECT * FROM projects WHERE EXTRACT(YEAR FROM project_date) = 2025;
```

---

## 🐛 問題排查

### 前端無法連接後端
```bash
# 檢查後端狀態
curl https://finance-reddoor.zeabur.app/api/projects

# 檢查環境變數
cat frontend/.env.production
```

### 資料庫連接失敗
```bash
# 檢查環境變數（Zeabur Dashboard → Backend Service → Variables）
# 確認有: POSTGRES_HOST, POSTGRES_PORT, POSTGRES_DATABASE, POSTGRES_USERNAME, POSTGRES_PASSWORD
```

### 客戶列表為空
```bash
# 檢查年份篩選器（預設 2025）
# 檢查資料庫
SELECT COUNT(*), EXTRACT(YEAR FROM project_date) as year 
FROM projects 
GROUP BY year;
```

### 新增功能失敗
```bash
# 查看瀏覽器 Console (F12)
# 查看 Network 標籤的 API 回應
# 查看 Zeabur 後端日誌
```

---

## 📞 緊急聯絡

### 平台問題
- **Vercel 支援**: https://vercel.com/support
- **Zeabur 支援**: https://zeabur.com/docs

### 代碼問題
- **GitHub Issues**: https://github.com/wincat26/finance-tool/issues
- **原開發者**: winson.lu@gmail.com

---

## ✨ 提示

1. **自動部署**: 推送到 main 分支會自動部署，無需手動操作
2. **資料備份**: 定期備份 Zeabur PostgreSQL 資料
3. **測試環境**: 建議建立 dev 分支用於測試
4. **文件更新**: 修改功能時記得更新文件
5. **版本管理**: 使用語義化版本號（v1.0.0）

---

**準備好了嗎？開始探索吧！** 🚀
