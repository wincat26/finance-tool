import fs from 'fs';
import path from 'path';
import pool from './connection';

async function migrate() {
  try {
    console.log('🚀 開始資料庫遷移...');
    
    // 讀取 schema.sql 檔案
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // 執行 SQL
    await pool.query(schema);
    
    console.log('✅ 資料庫遷移完成！');
    console.log('📊 已建立以下資料表：');
    console.log('   - customers (客戶)');
    console.log('   - projects (專案)');
    console.log('   - project_files (專案檔案)');
    console.log('   - revenue_categories (收入分類)');
    console.log('   - expense_categories (支出分類)');
    console.log('   - revenues (收入)');
    console.log('   - revenue_installments (分期收款)');
    console.log('   - expenses (支出)');
    console.log('🎯 預設分類已插入完成');
    
  } catch (error) {
    console.error('❌ 資料庫遷移失敗:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 如果直接執行此檔案
if (require.main === module) {
  migrate();
}

export default migrate;