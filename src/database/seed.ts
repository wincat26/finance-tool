import pool from './connection';

async function seed() {
  try {
    console.log('🌱 開始插入範例資料...');
    
    // 插入範例客戶
    await pool.query(`
      INSERT INTO customers (name, vat_number, contact_info) VALUES
      ('ABC科技有限公司', '12345678', '聯絡人：張經理，電話：02-1234-5678'),
      ('XYZ行銷公司', '87654321', '聯絡人：李總監，電話：02-8765-4321'),
      ('創新設計工作室', '11223344', '聯絡人：王設計師，電話：02-1122-3344')
      ON CONFLICT DO NOTHING
    `);
    
    // 插入範例專案
    await pool.query(`
      INSERT INTO projects (company_name, vat_number, contact_name, contact_phone, contact_email, 
                           project_date, responsible_person, status, description) VALUES
      ('ABC科技有限公司', '12345678', '張經理', '02-1234-5678', 'manager@abc.com', 
       '2024-01-15', '王業務', 'active', '企業網站重新設計專案'),
      ('XYZ行銷公司', '87654321', '李總監', '02-8765-4321', 'director@xyz.com', 
       '2024-02-01', '陳業務', 'active', '品牌形象設計與行銷活動'),
      ('創新設計工作室', '11223344', '王設計師', '02-1122-3344', 'designer@innovation.com', 
       '2024-01-20', '林業務', 'completed', 'Logo設計與名片製作')
    `);
    
    // 插入範例收入
    await pool.query(`
      INSERT INTO revenues (project_id, service_type, amount, income_date, invoice_number, status, notes) VALUES
      (1, '網站設計', 150000, '2024-01-20', 'INV-2024-001', 'partial', '第一期款項'),
      (2, '品牌設計', 200000, '2024-02-05', 'INV-2024-002', 'completed', '全額收款'),
      (3, 'Logo設計', 50000, '2024-01-25', 'INV-2024-003', 'completed', '專案完成')
    `);
    
    // 插入範例分期收款
    await pool.query(`
      INSERT INTO revenue_installments (revenue_id, period, planned_date, planned_amount, 
                                       actual_received_date, actual_amount, status) VALUES
      (1, 1, '2024-01-20', 75000, '2024-01-20', 75000, 'received'),
      (1, 2, '2024-03-20', 75000, NULL, NULL, 'pending'),
      (2, 1, '2024-02-05', 200000, '2024-02-05', 200000, 'received'),
      (3, 1, '2024-01-25', 50000, '2024-01-25', 50000, 'received')
    `);
    
    // 插入範例支出
    await pool.query(`
      INSERT INTO expenses (project_id, supplier_name, expense_type, amount, expense_date, 
                           invoice_number, notes) VALUES
      (1, 'CloudFlare', '廣告費', 15000, '2024-01-22', 'CF-001', 'Google Ads 廣告費用'),
      (1, '自由設計師', '設計費', 30000, '2024-01-25', 'DES-001', '外包UI設計費'),
      (2, 'Facebook', '廣告費', 25000, '2024-02-10', 'FB-001', 'Facebook廣告投放'),
      (2, '印刷廠', '行銷費', 8000, '2024-02-15', 'PRT-001', '宣傳品印刷費用'),
      (3, '字型公司', '設計費', 5000, '2024-01-28', 'FONT-001', '商用字型授權費')
    `);
    
    console.log('✅ 範例資料插入完成！');
    console.log('📊 已插入：');
    console.log('   - 3 個客戶');
    console.log('   - 3 個專案');
    console.log('   - 3 筆收入記錄');
    console.log('   - 4 筆分期收款');
    console.log('   - 5 筆支出記錄');
    
  } catch (error) {
    console.error('❌ 插入範例資料失敗:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// 如果直接執行此檔案
if (require.main === module) {
  seed();
}

export default seed;