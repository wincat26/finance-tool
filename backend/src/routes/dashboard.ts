import { Router } from 'express';
import pool from '../database/connection';

const router = Router();

// Dashboard 統計資料
router.get('/', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : new Date().getFullYear();
    
    // 月度現金流
    const cashFlowQuery = `
      SELECT 
        DATE_TRUNC('month', income_date) as month,
        SUM(amount) as revenue
      FROM revenues 
      WHERE EXTRACT(YEAR FROM income_date) = $1
      GROUP BY DATE_TRUNC('month', income_date)
      ORDER BY month
    `;
    
    const expenseFlowQuery = `
      SELECT 
        DATE_TRUNC('month', expense_date) as month,
        SUM(amount) as expense
      FROM expenses 
      WHERE EXTRACT(YEAR FROM expense_date) = $1
      GROUP BY DATE_TRUNC('month', expense_date)
      ORDER BY month
    `;
    
    // 支出結構
    const expenseStructureQuery = `
      SELECT 
        expense_type,
        SUM(amount) as total_amount
      FROM expenses 
      WHERE EXTRACT(YEAR FROM expense_date) = $1
      GROUP BY expense_type
      ORDER BY total_amount DESC
    `;
    
    // 年度損益
    const profitLossQuery = `
      SELECT 
        (SELECT COALESCE(SUM(amount), 0) FROM revenues WHERE EXTRACT(YEAR FROM income_date) = $1) as total_revenue,
        (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE EXTRACT(YEAR FROM expense_date) = $1) as total_expense
    `;
    
    // 收款狀態統計
    const revenueStatusQuery = `
      SELECT 
        status,
        COUNT(*) as count,
        SUM(amount) as total_amount
      FROM revenues 
      WHERE EXTRACT(YEAR FROM income_date) = $1
      GROUP BY status
    `;
    
    // 進案量統計
    const projectStatsQuery = `
      SELECT 
        status,
        COUNT(*) as count
      FROM projects 
      WHERE EXTRACT(YEAR FROM project_date) = $1
      GROUP BY status
    `;
    
    const [
      cashFlow,
      expenseFlow,
      expenseStructure,
      profitLoss,
      revenueStatus,
      projectStats
    ] = await Promise.all([
      pool.query(cashFlowQuery, [year]),
      pool.query(expenseFlowQuery, [year]),
      pool.query(expenseStructureQuery, [year]),
      pool.query(profitLossQuery, [year]),
      pool.query(revenueStatusQuery, [year]),
      pool.query(projectStatsQuery, [year])
    ]);
    
    // 合併現金流資料
    const monthlyData = new Map();
    
    cashFlow.rows.forEach(row => {
      const month = new Date(row.month).toISOString().slice(0, 7);
      monthlyData.set(month, { ...monthlyData.get(month), revenue: parseFloat(row.revenue) });
    });
    
    expenseFlow.rows.forEach(row => {
      const month = new Date(row.month).toISOString().slice(0, 7);
      monthlyData.set(month, { ...monthlyData.get(month), expense: parseFloat(row.expense) });
    });
    
    const cashFlowData = Array.from(monthlyData.entries()).map(([month, data]) => ({
      month,
      revenue: data.revenue || 0,
      expense: data.expense || 0,
      profit: (data.revenue || 0) - (data.expense || 0)
    })).sort((a, b) => a.month.localeCompare(b.month));
    
    const dashboard = {
      year,
      cashFlow: cashFlowData,
      expenseStructure: expenseStructure.rows.map(row => ({
        category: row.expense_type,
        amount: parseFloat(row.total_amount)
      })),
      profitLoss: {
        totalRevenue: parseFloat(profitLoss.rows[0].total_revenue),
        totalExpense: parseFloat(profitLoss.rows[0].total_expense),
        profit: parseFloat(profitLoss.rows[0].total_revenue) - parseFloat(profitLoss.rows[0].total_expense)
      },
      revenueStatus: revenueStatus.rows.map(row => ({
        status: row.status,
        count: parseInt(row.count),
        amount: parseFloat(row.total_amount)
      })),
      installmentProgress: {
        pendingCount: 0,
        receivedCount: 0,
        pendingAmount: 0,
        receivedAmount: 0
      },
      projectStats: projectStats.rows.map(row => ({
        status: row.status,
        count: parseInt(row.count)
      }))
    };
    
    res.json(dashboard);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: '取得 Dashboard 資料失敗', details: error instanceof Error ? error.message : String(error) });
  }
});

export default router;