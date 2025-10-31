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