import pool from '../database/connection';
import { FinanceApplication } from '../core/Application';

export class BaseService {
  protected tableName: string;
  protected schemaName: string;
  protected app: FinanceApplication;

  constructor(tableName: string, schemaName: string, app: FinanceApplication) {
    this.tableName = tableName;
    this.schemaName = schemaName;
    this.app = app;
  }

  // 通用 CRUD 操作
  async findAll(filters?: any) {
    let query = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];
    
    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters).map((key, index) => {
        params.push(filters[key]);
        return `${key} = $${index + 1}`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findById(id: number) {
    const result = await pool.query(
      `SELECT * FROM ${this.tableName} WHERE id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async create(data: any) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, index) => `$${index + 1}`);

    const query = `
      INSERT INTO ${this.tableName} (${fields.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(id: number, data: any) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`);

    const query = `
      UPDATE ${this.tableName}
      SET ${setClause.join(', ')}
      WHERE id = $1
      RETURNING *
    `;

    const result = await pool.query(query, [id, ...values]);
    return result.rows[0];
  }

  async delete(id: number) {
    const result = await pool.query(
      `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`,
      [id]
    );
    return result.rows[0];
  }

  async count(filters?: any) {
    let query = `SELECT COUNT(*) FROM ${this.tableName}`;
    const params: any[] = [];
    
    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters).map((key, index) => {
        params.push(filters[key]);
        return `${key} = $${index + 1}`;
      });
      query += ` WHERE ${conditions.join(' AND ')}`;
    }
    
    const result = await pool.query(query, params);
    return parseInt(result.rows[0].count);
  }
}