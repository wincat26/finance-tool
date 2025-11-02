import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import projectRoutes from './routes/projects';
import dashboardRoutes from './routes/dashboard';
import customerRoutes from './routes/customers';
import financeRoutes from './routes/finance';
import pool from './database/connection';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中間件
app.use(helmet());
app.use(cors());
app.use(express.json());

// 根路由
app.get('/', (req, res) => {
  res.json({ message: '財務工具 API', version: '1.0.0' });
});

// 路由
app.use('/api/projects', projectRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/finance', financeRoutes);

// 健康檢查
app.get('/health', async (_req, res) => {
  try {
    const result = await pool.query('SELECT 1');
    const dbOk = result.rowCount === 1;
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      database: dbOk ? 'connected' : 'unknown'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      database: 'disconnected'
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

app.listen(PORT, () => {
  console.log(`🚀 伺服器運行在 http://localhost:${PORT}`);
});
