import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import projectRoutes from './routes/projects';
import dashboardRoutes from './routes/dashboard';
import customerRoutes from './routes/customers';
import financeRoutes from './routes/finance';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 中間件
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'https://finance-tool.vercel.app', 
    'https://finance-tool-sage.vercel.app',
    /\.vercel\.app$/
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
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
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
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