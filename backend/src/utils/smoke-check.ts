import pool from '../database/connection';

async function smokeCheck() {
  console.log('🚦 執行後端 smoke check...');

  const checks: Array<[string, string, string]> = [
    ['projects', 'company_alias', '專案別名欄位'],
    ['projects', 'finance_contact_name', '財務聯絡人姓名'],
    ['projects', 'finance_contact_phone', '財務聯絡人電話'],
    ['projects', 'finance_contact_email', '財務聯絡人 Email'],
    ['projects', 'finance_notes', '財務備註'],
    ['project_files', 'created_by', '檔案建立者']
  ];

  try {
    await pool.query('SELECT 1');
  } catch (error) {
    console.error('❌ 無法連線資料庫:', error);
    process.exit(1);
  }

  const missing: string[] = [];

  for (const [table, column, description] of checks) {
    try {
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
        missing.push(`${table}.${column} (${description})`);
      }
    } catch (error) {
      console.error(`❌ 無法檢查欄位 ${table}.${column}:`, error);
      process.exit(1);
    }
  }

  if (missing.length > 0) {
    console.error('❌ Schema 缺少必要欄位:');
    missing.forEach(item => console.error(`  - ${item}`));
    process.exit(1);
  }

  console.log('✅ Schema 檢查通過');

  try {
    const { rows } = await pool.query('SELECT COUNT(*) AS project_count FROM projects');
    console.log(`📦 現有專案數量: ${rows[0].project_count}`);
  } catch (error) {
    console.warn('⚠️ 無法取得專案數統計:', error);
  }

  process.exit(0);
}

smokeCheck();
