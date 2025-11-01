import pool from '../database/connection';
import { Project, ProjectFile } from '../types';

export class ProjectModel {
  static async getAll(year?: number): Promise<Project[]> {
    let query = 'SELECT * FROM projects';
    const params: any[] = [];
    
    if (year) {
      query += ' WHERE EXTRACT(YEAR FROM project_date) = $1';
      params.push(year);
    }
    
    query += ' ORDER BY project_date DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  static async getById(id: number): Promise<Project | null> {
    const result = await pool.query('SELECT * FROM projects WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  static async create(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    const query = `
      INSERT INTO projects (company_name, company_alias, vat_number, contact_name, contact_phone, 
                           contact_email, project_date, responsible_person, status, description,
                           finance_contact_name, finance_contact_phone, finance_contact_email, finance_notes)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *
    `;
    
    const values = [
      project.company_name,
      project.company_alias,
      project.vat_number,
      project.contact_name,
      project.contact_phone,
      project.contact_email,
      project.project_date,
      project.responsible_person,
      project.status,
      project.description,
      project.finance_contact_name,
      project.finance_contact_phone,
      project.finance_contact_email,
      project.finance_notes
    ];
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async update(id: number, project: Partial<Project>): Promise<Project | null> {
    const fields = Object.keys(project).filter(key => key !== 'id' && key !== 'created_at');
    const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
    
    if (fields.length === 0) return null;
    
    const query = `
      UPDATE projects 
      SET ${setClause}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 
      RETURNING *
    `;
    
    const values = [id, ...fields.map(field => (project as any)[field])];
    const result = await pool.query(query, values);
    return result.rows[0] || null;
  }

  static async delete(id: number): Promise<boolean> {
    const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  }

  static async getFiles(projectId: number): Promise<ProjectFile[]> {
    const result = await pool.query(
      'SELECT * FROM project_files WHERE project_id = $1 ORDER BY created_at DESC',
      [projectId]
    );
    return result.rows;
  }

  static async addFile(file: Omit<ProjectFile, 'id' | 'created_at'>): Promise<ProjectFile> {
    const query = `
      INSERT INTO project_files (project_id, file_type, file_name, google_drive_url, created_by)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    
    const values = [file.project_id, file.file_type, file.file_name, file.google_drive_url, (file as any).created_by];
    const result = await pool.query(query, values);
    return result.rows[0];
  }
}