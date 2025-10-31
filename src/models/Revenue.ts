import pool from '../database/connection';
import { Revenue, RevenueInstallment } from '../types';

export class RevenueModel {
  static async getAll(year?: number, projectId?: number): Promise<Revenue[]> {
    let query = 'SELECT * FROM revenues WHERE 1=1';
    const params: any[] = [];
    let paramIndex = 1;
    
    if (year) {
      query += ` AND EXTRACT(YEAR FROM income_date) = $${paramIndex}`;
      params.push(year);
      paramIndex++;
    }
    
    if (projectId) {
      query += ` AND project_id = $${paramIndex}`;
      params.push(projectId);
    }
    
    query += ' ORDER BY income_date DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getById(id: number): Promise<Revenue | null> {
    const result = await pool.query('SELECT * FROM revenues WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(revenue: Omit<Revenue, 'id' | 'created_at' | 'updated_at'>): Promise<Revenue> {
    const query = `
      INSERT INTO revenues (project_id, customer_id, contract_number, service_type, 
                           amount, income_date, invoice_number, status, notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `;
    
    const values = [
      revenue.project_id,
      revenue.customer_id,
      revenue.contract_number,
      revenue.service_type,
      revenue.amount,
      revenue.income_date,
      revenue.invoice_number,
      revenue.status,
      revenue.notes
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id: number, revenue: Partial<Revenue>): Promise<Revenue | null> {
    const fields = Object.keys(revenue).filter(key => key !== 'id' && key !== 'created_at');
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    if (fields.length === 0) return null;
    
    const query = `
      UPDATE revenues 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `;
    
    const values = [id, ...fields.map(field => (revenue as any)[field])];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async getInstallments(revenueId: number): Promise<RevenueInstallment[]> {
    const result = await pool.query(
      'SELECT * FROM revenue_installments WHERE revenue_id = $1 ORDER BY period',
      [revenueId]
    );
    return result.rows;
  }

  static async createInstallment(installment: Omit<RevenueInstallment, 'id' | 'created_at'>): Promise<RevenueInstallment> {
    const query = `
      INSERT INTO revenue_installments (revenue_id, period, planned_date, planned_amount, 
                                       actual_received_date, actual_amount, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [
      installment.revenue_id,
      installment.period,
      installment.planned_date,
      installment.planned_amount,
      installment.actual_received_date,
      installment.actual_amount,
      installment.status
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async updateInstallment(id: number, installment: Partial<RevenueInstallment>): Promise<RevenueInstallment | null> {
    const fields = Object.keys(installment).filter(key => key !== 'id' && key !== 'created_at');
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    if (fields.length === 0) return null;
    
    const query = `
      UPDATE revenue_installments 
      SET ${setClause}
      WHERE id = $1 
      RETURNING *
    `;
    
    const values = [id, ...fields.map(field => (installment as any)[field])];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }
}