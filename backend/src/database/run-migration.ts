import pool from './connection';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log('🔄 執行資料庫遷移...');
    
    const migrationPath = path.join(__dirname, 'migrations', 'add_missing_columns.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    console.log('📋 Migration SQL:');
    console.log(sql);
    console.log('---\n');
    
    await pool.query(sql);
    
    console.log('✅ 遷移成功完成！\n');
    
    // 驗證新欄位
    const result = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND column_name IN ('company_alias', 'finance_contact_name', 'finance_contact_phone', 'finance_contact_email', 'finance_notes')
      ORDER BY column_name
    `);
    
    console.log('📊 新增的欄位:');
    result.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ 遷移失敗:', error);
    process.exit(1);
  }
}

runMigration();
