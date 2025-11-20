import { Pool } from 'pg';
import dotenv from 'dotenv';
import path from 'path';

// 根據環境載入對應的 .env 檔案
const env = process.env.NODE_ENV || 'development';
const envFile = env === 'production' ? '.env.production' : 
                env === 'staging' ? '.env.staging' : '.env';

dotenv.config({ path: path.resolve(__dirname, '../../', envFile) });

const pool = new Pool({
  user: process.env.POSTGRES_USERNAME || process.env.DB_USER || 'postgres',
  host: process.env.POSTGRES_HOST || process.env.DB_HOST || 'localhost',
  database: process.env.POSTGRES_DATABASE || process.env.DB_NAME || 'finance_tool',
  password: process.env.POSTGRES_PASSWORD || process.env.DB_PASSWORD || 'password',
  port: parseInt(process.env.POSTGRES_PORT || process.env.DB_PORT || '5432'),
});

// 連線時顯示環境資訊
pool.on('connect', () => {
  console.log(`📊 資料庫已連線 [${env.toUpperCase()}]: ${pool.options.database}`);
});

export default pool;