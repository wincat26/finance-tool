import { Router } from 'express';
import { ProjectModel } from '../models/Project';
import { z } from 'zod';
import pool from '../database/connection';

const router = Router();

const customerSchema = z.object({
  company_name: z.string().min(1),
  company_alias: z.string().optional(),
  vat_number: z.string().optional(),
  contact_name: z.string().min(1),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional(),
  project_date: z.string().transform(str => new Date(str)),
  responsible_person: z.string().min(1),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
  description: z.string().optional()
});

// 取得所有客戶
router.get('/', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const customers = await ProjectModel.getAll(year);
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: '取得客戶列表失敗' });
  }
});

// 建立客戶
router.post('/', async (req, res) => {
  try {
    const validatedData = customerSchema.parse(req.body);
    const customer = await ProjectModel.create(validatedData);
    res.status(201).json(customer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '資料格式錯誤', details: error.errors });
    }
    res.status(500).json({ error: '建立客戶失敗' });
  }
});

// 取得客戶檔案
router.get('/:id/files', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const files = await ProjectModel.getFiles(customerId);
    res.json(files);
  } catch (error) {
    res.status(500).json({ error: '取得檔案列表失敗' });
  }
});

// 新增客戶檔案
router.post('/:id/files', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const file = await ProjectModel.addFile({
      project_id: customerId,
      created_by: req.body.created_by || '系統管理員',
      ...req.body
    });
    res.status(201).json(file);
  } catch (error) {
    res.status(500).json({ error: '新增檔案失敗' });
  }
});

// 更新檔案
router.put('/:id/files/:fileId', async (req, res) => {
  try {
    const fileId = parseInt(req.params.fileId);
    const result = await pool.query(
      'UPDATE project_files SET file_type = $1, file_name = $2, google_drive_url = $3 WHERE id = $4 RETURNING *',
      [req.body.file_type, req.body.file_name, req.body.google_drive_url, fileId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: '更新檔案失敗' });
  }
});

// 刪除檔案
router.delete('/:id/files/:fileId', async (req, res) => {
  try {
    const fileId = parseInt(req.params.fileId);
    await pool.query('DELETE FROM project_files WHERE id = $1', [fileId]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: '刪除檔案失敗' });
  }
});

// 取得客戶支出
router.get('/:id/expenses', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const expenses = await pool.query(
      'SELECT * FROM expenses WHERE project_id = $1 ORDER BY expense_date DESC',
      [customerId]
    );
    res.json(expenses.rows);
  } catch (error) {
    res.status(500).json({ error: '取得支出列表失敗' });
  }
});

// 新增客戶支出
router.post('/:id/expenses', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const supplierName = req.body.supplier_name || req.body.ad_platform || '未知供應商';
    
    const expense = await pool.query(
      'INSERT INTO expenses (project_id, supplier_name, expense_type, amount, expense_date, invoice_number, file_url, notes, payment_request) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
      [customerId, supplierName, req.body.expense_type, req.body.amount, req.body.expense_date, req.body.invoice_number || null, req.body.file_url || null, req.body.notes || null, req.body.payment_request || false]
    );
    res.status(201).json(expense.rows[0]);
  } catch (error) {
    console.error('Expense creation error:', error);
    res.status(500).json({ error: '新增支出失敗' });
  }
});

// 更新支出
router.put('/:id/expenses/:expenseId', async (req, res) => {
  try {
    const expenseId = parseInt(req.params.expenseId);
    const supplierName = req.body.supplier_name || req.body.ad_platform || '未知供應商';
    
    const result = await pool.query(
      'UPDATE expenses SET supplier_name = $1, expense_type = $2, amount = $3, expense_date = $4, invoice_number = $5, file_url = $6, notes = $7, payment_request = $8, updated_at = CURRENT_TIMESTAMP WHERE id = $9 RETURNING *',
      [supplierName, req.body.expense_type, req.body.amount, req.body.expense_date, req.body.invoice_number, req.body.file_url, req.body.notes, req.body.payment_request || false, expenseId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: '更新支出失敗' });
  }
});

// 刪除支出
router.delete('/:id/expenses/:expenseId', async (req, res) => {
  try {
    const expenseId = parseInt(req.params.expenseId);
    await pool.query('DELETE FROM expenses WHERE id = $1', [expenseId]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: '刪除支出失敗' });
  }
});

// 取得客戶收入
router.get('/:id/revenues', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    const revenues = await pool.query(
      'SELECT * FROM revenues WHERE project_id = $1 ORDER BY income_date DESC',
      [customerId]
    );
    res.json(revenues.rows);
  } catch (error) {
    res.status(500).json({ error: '取得收入列表失敗' });
  }
});

// 新增客戶收入
router.post('/:id/revenues', async (req, res) => {
  try {
    const customerId = parseInt(req.params.id);
    
    const revenue = await pool.query(
      'INSERT INTO revenues (project_id, service_type, amount, income_date, invoice_number, status, notes) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [customerId, req.body.service_type, req.body.amount, req.body.income_date, req.body.invoice_number || null, req.body.status, req.body.notes || null]
    );
    res.status(201).json(revenue.rows[0]);
  } catch (error) {
    console.error('Revenue creation error:', error);
    res.status(500).json({ error: '新增收入失敗' });
  }
});

// 更新收入
router.put('/:id/revenues/:revenueId', async (req, res) => {
  try {
    const revenueId = parseInt(req.params.revenueId);
    
    const result = await pool.query(
      'UPDATE revenues SET service_type = $1, amount = $2, income_date = $3, invoice_number = $4, status = $5, notes = $6, updated_at = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [req.body.service_type, req.body.amount, req.body.income_date, req.body.invoice_number, req.body.status, req.body.notes, revenueId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: '更新收入失敗' });
  }
});

// 刪除收入
router.delete('/:id/revenues/:revenueId', async (req, res) => {
  try {
    const revenueId = parseInt(req.params.revenueId);
    await pool.query('DELETE FROM revenues WHERE id = $1', [revenueId]);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: '刪除收入失敗' });
  }
});

export default router;