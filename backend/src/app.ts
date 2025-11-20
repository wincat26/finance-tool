import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { FinanceApplication } from './core/Application';
import { ProjectModule } from './modules/ProjectModule';
import { CRMModule } from './modules/CRMModule';
import { FinanceModule } from './modules/FinanceModule';
import { WorkflowService } from './services/WorkflowService';

import dashboardRoutes from './routes/dashboard';
import customerRoutes from './routes/customers';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中間件
app.use(helmet());
app.use(cors());
app.use(express.json());

// 建立 Finance Application 實例
const financeApp = new FinanceApplication(app);

// 註冊服務
financeApp.registerService('workflow', new WorkflowService(financeApp));

// 註冊模組
financeApp.registerModule('projects', new ProjectModule(financeApp));
financeApp.registerModule('crm', new CRMModule(financeApp));
financeApp.registerModule('finance', new FinanceModule(financeApp));

// 根路由
app.get('/', (req, res) => {
  res.json({ 
    message: '財務工具 API v2.0', 
    version: '2.0.0',
    architecture: 'NocoBase-inspired',
    modules: financeApp.getModule('projects') ? ['projects', 'crm', 'finance'] : []
  });
});

// 非模組化路由 (暫時保留)
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);

// 健康檢查
app.get('/health', async (_req, res) => {
  try {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      architecture: 'modular',
      modules: financeApp.getModule('projects') ? 'loaded' : 'not loaded'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString()
    });
  }
});

// 錯誤處理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: '伺服器內部錯誤' });
});

// 404 處理
app.use('*', (req, res) => {
  res.status(404).json({ error: '找不到該路由' });
});

// 啟動應用
async function startApp() {
  try {
    await financeApp.start();
    
    app.listen(PORT, () => {
      console.log(`🚀 財務工具 v2.0 運行在 http://localhost:${PORT}`);
      console.log(`📋 架構: NocoBase-inspired Modular`);
      console.log(`🔧 已載入模組: ${financeApp.getModule('projects') ? 'projects, crm, finance' : 'none'}`);
    });
  } catch (error) {
    console.error('❌ 應用啟動失敗:', error);
    process.exit(1);
  }
}

startApp();

export { financeApp };