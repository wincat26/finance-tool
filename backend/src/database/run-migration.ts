import pool from './connection';
import fs from 'fs';
import path from 'path';

async function runMigration() {
  try {
    console.log('🔄 執行資料庫遷移...');
    
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    if (migrationFiles.length === 0) {
      console.log('⚠️  未找到可執行的 migration。');
      process.exit(0);
    }

    for (const file of migrationFiles) {
      const migrationPath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(migrationPath, 'utf8');

      console.log(`📋 執行 ${file}`);
      await pool.query(sql);
    }

    console.log('✅ 所有遷移執行完成！\n');

    // 驗證必備欄位
    const requiredColumns = [
      { table: 'projects', column: 'company_alias' },
      { table: 'projects', column: 'finance_contact_name' },
      { table: 'projects', column: 'finance_contact_phone' },
      { table: 'projects', column: 'finance_contact_email' },
      { table: 'projects', column: 'finance_notes' },
      { table: 'project_files', column: 'created_by' }
    ];

    const missing: string[] = [];

    for (const { table, column } of requiredColumns) {
      const result = await pool.query(
        `
          SELECT EXISTS (
            SELECT 1
            FROM information_schema.columns
            WHERE table_name = $1
              AND column_name = $2
          ) AS has_column
        `,
        [table, column]
      );

      if (!result.rows[0]?.has_column) {
        missing.push(`${table}.${column}`);
      }
    }

    if (missing.length > 0) {
      console.warn('⚠️  以下欄位仍缺失：');
      missing.forEach(name => console.warn(`  - ${name}`));
      process.exit(1);
    }

    console.log('📊 必要欄位檢查通過。');
    process.exit(0);
  } catch (error) {
    console.error('❌ 遷移失敗:', error);
    process.exit(1);
  }
}

runMigration();
