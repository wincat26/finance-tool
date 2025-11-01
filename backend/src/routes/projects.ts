import { Router } from 'express';
import { ProjectModel } from '../models/Project';
import { z } from 'zod';

const router = Router();

const projectSchema = z.object({
  company_name: z.string().min(1),
  company_alias: z.string().optional(),
  vat_number: z.string().optional(),
  contact_name: z.string().min(1),
  contact_phone: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  project_date: z.string().transform(str => new Date(str)),
  responsible_person: z.string().min(1),
  status: z.enum(['active', 'completed', 'cancelled']).default('active'),
  description: z.string().optional(),
  finance_contact_name: z.string().optional(),
  finance_contact_phone: z.string().optional(),
  finance_contact_email: z.string().email().optional().or(z.literal('')),
  finance_notes: z.string().optional()
});

const fileSchema = z.object({
  file_type: z.string().min(1),
  file_name: z.string().min(1),
  google_drive_url: z.string().url()
});

// 取得所有專案
router.get('/', async (req, res) => {
  try {
    const year = req.query.year ? parseInt(req.query.year as string) : undefined;
    const projects = await ProjectModel.getAll(year);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: '取得專案列表失敗' });
  }
});

// 取得單一專案
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = await ProjectModel.getById(id);
    
    if (!project) {
      return res.status(404).json({ error: '專案不存在' });
    }
    
    const files = await ProjectModel.getFiles(id);
    res.json({ ...project, files });
  } catch (error) {
    res.status(500).json({ error: '取得專案失敗' });
  }
});

// 建立專案
router.post('/', async (req, res) => {
  try {
    const validatedData = projectSchema.parse(req.body);
    const project = await ProjectModel.create(validatedData);
    res.status(201).json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '資料格式錯誤', details: error.errors });
    }
    res.status(500).json({ error: '建立專案失敗' });
  }
});

// 更新專案
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = projectSchema.partial().parse(req.body);
    const project = await ProjectModel.update(id, validatedData);
    
    if (!project) {
      return res.status(404).json({ error: '專案不存在' });
    }
    
    res.json(project);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '資料格式錯誤', details: error.errors });
    }
    res.status(500).json({ error: '更新專案失敗' });
  }
});

// 刪除專案
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await ProjectModel.delete(id);
    
    if (!success) {
      return res.status(404).json({ error: '專案不存在' });
    }
    
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: '刪除專案失敗' });
  }
});

// 新增專案檔案
router.post('/:id/files', async (req, res) => {
  try {
    const projectId = parseInt(req.params.id);
    const validatedData = fileSchema.parse(req.body);
    
    const file = await ProjectModel.addFile({
      project_id: projectId,
      ...validatedData
    });
    
    res.status(201).json(file);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '資料格式錯誤', details: error.errors });
    }
    res.status(500).json({ error: '新增檔案失敗' });
  }
});

export default router;