import pool from '../database/connection';
import { Lead } from '../types';
import { GoogleChatService } from '../services/GoogleChatService';

export class LeadModel {
  static async getAll(filters?: { status?: string; assigned_to?: string }): Promise<Lead[]> {
    let query = 'SELECT * FROM leads WHERE 1=1';
    const params: any[] = [];
    let paramCount = 1;

    if (filters?.status) {
      query += ` AND status = $${paramCount}`;
      params.push(filters.status);
      paramCount++;
    }

    if (filters?.assigned_to) {
      query += ` AND assigned_to = $${paramCount}`;
      params.push(filters.assigned_to);
      paramCount++;
    }

    query += ' ORDER BY lead_score DESC, created_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getById(id: number): Promise<Lead | null> {
    const result = await pool.query('SELECT * FROM leads WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(data: Partial<Lead>): Promise<Lead> {
    const result = await pool.query(
      `INSERT INTO leads (name, company, phone, email, source, status, tags, custom_fields, assigned_to, lead_score, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
       RETURNING *`,
      [
        data.name,
        data.company,
        data.phone,
        data.email,
        data.source,
        data.status || 'new',
        data.tags || [],
        data.custom_fields || {},
        data.assigned_to,
        data.lead_score || 0,
        data.notes
      ]
    );

    const newLead = result.rows[0];

    // 發送 Google Chat 通知 (非同步執行，不阻塞回應)
    GoogleChatService.sendNewLeadNotification(newLead).catch(err =>
      console.error('Background notification failed:', err)
    );

    return newLead;
  }

  static async update(id: number, data: Partial<Lead>): Promise<Lead | null> {
    const result = await pool.query(
      `UPDATE leads 
       SET name = COALESCE($1, name),
           company = COALESCE($2, company),
           phone = COALESCE($3, phone),
           email = COALESCE($4, email),
           source = COALESCE($5, source),
           status = COALESCE($6, status),
           tags = COALESCE($7, tags),
           custom_fields = COALESCE($8, custom_fields),
           assigned_to = COALESCE($9, assigned_to),
           lead_score = COALESCE($10, lead_score),
           last_contact_date = COALESCE($11, last_contact_date),
           notes = COALESCE($12, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $13
       RETURNING *`,
      [
        data.name,
        data.company,
        data.phone,
        data.email,
        data.source,
        data.status,
        data.tags,
        data.custom_fields,
        data.assigned_to,
        data.lead_score,
        data.last_contact_date,
        data.notes,
        id
      ]
    );
    return result.rows[0] || null;
  }

  static async convertToContact(leadId: number, contactData: any): Promise<{ contact: any; lead: Lead }> {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      // 建立 Contact
      const contactResult = await client.query(
        `INSERT INTO contacts (name, company, position, phone, email, tags, custom_fields, source, lead_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         RETURNING *`,
        [
          contactData.name,
          contactData.company,
          contactData.position,
          contactData.phone,
          contactData.email,
          contactData.tags || [],
          contactData.custom_fields || {},
          contactData.source,
          leadId
        ]
      );

      // 更新 Lead 狀態
      const leadResult = await client.query(
        `UPDATE leads 
         SET status = 'qualified',
             converted_at = CURRENT_TIMESTAMP,
             converted_to_contact_id = $1,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $2
         RETURNING *`,
        [contactResult.rows[0].id, leadId]
      );

      await client.query('COMMIT');
      return { contact: contactResult.rows[0], lead: leadResult.rows[0] };
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM leads WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }
}
