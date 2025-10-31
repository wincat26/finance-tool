import { Router } from 'express';
import pool from '../database/connection';

const router = Router();

// 年度收益表
router.get('/annual-report', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
    
    // 取得收入資料，包含公司名稱和服務類型
    const revenueQuery = `
      SELECT 
        p.company_name,
        r.service_type,
        EXTRACT(MONTH FROM r.income_date) as month,
        SUM(r.amount) as total_amount
      FROM revenues r
      JOIN projects p ON r.project_id = p.id
      WHERE EXTRACT(YEAR FROM r.income_date) = $1
      GROUP BY p.company_name, r.service_type, EXTRACT(MONTH FROM r.income_date)
      ORDER BY p.company_name, r.service_type, month
    `;
    
    // 取得支出資料，包含公司名稱和支出類型
    const expenseQuery = `
      SELECT 
        p.company_name,
        e.expense_type,
        EXTRACT(MONTH FROM e.expense_date) as month,
        SUM(e.amount) as total_amount
      FROM expenses e
      JOIN projects p ON e.project_id = p.id
      WHERE EXTRACT(YEAR FROM e.expense_date) = $1
      GROUP BY p.company_name, e.expense_type, EXTRACT(MONTH FROM e.expense_date)
      ORDER BY p.company_name, e.expense_type, month
    `;
    
    const [revenueResult, expenseResult] = await Promise.all([
      pool.query(revenueQuery, [year]),
      pool.query(expenseQuery, [year])
    ]);
    
    // 整理收入資料：公司 -> 服務類型 -> 月份
    const revenues: Record<string, Record<string, Record<number, number>>> = {};
    revenueResult.rows.forEach(row => {
      const company = row.company_name || '未分類';
      if (!revenues[company]) {
        revenues[company] = {};
      }
      if (!revenues[company][row.service_type]) {
        revenues[company][row.service_type] = {};
      }
      revenues[company][row.service_type][row.month] = parseFloat(row.total_amount);
    });
    
    // 整理支出資料：公司 -> 支出類型 -> 月份
    const expenses: Record<string, Record<string, Record<number, number>>> = {};
    expenseResult.rows.forEach(row => {
      const company = row.company_name || '未分類';
      if (!expenses[company]) {
        expenses[company] = {};
      }
      if (!expenses[company][row.expense_type]) {
        expenses[company][row.expense_type] = {};
      }
      expenses[company][row.expense_type][row.month] = parseFloat(row.total_amount);
    });
    
    // 計算總收益
    const totalRevenue = Object.values(revenues).reduce((sum, companyData) => {
      return sum + Object.values(companyData).reduce((companySum, monthlyData) => {
        return companySum + Object.values(monthlyData).reduce((monthSum, amount) => monthSum + amount, 0);
      }, 0);
    }, 0);
    
    const totalExpense = Object.values(expenses).reduce((sum, companyData) => {
      return sum + Object.values(companyData).reduce((companySum, monthlyData) => {
        return companySum + Object.values(monthlyData).reduce((monthSum, amount) => monthSum + amount, 0);
      }, 0);
    }, 0);
    
    const report = {
      year,
      revenues,
      expenses,
      totalRevenue,
      totalExpense,
      totalProfit: totalRevenue - totalExpense
    };
    
    res.json(report);
  } catch (error) {
    console.error('Annual report error:', error);
    res.status(500).json({ error: '取得年度報表失敗' });
  }
});

export default router;