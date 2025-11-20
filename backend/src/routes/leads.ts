import { Router } from 'express';
import { LeadModel } from '../models/Lead';
import { z } from 'zod';

const router = Router();

export const leadSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  source: z.string().optional(),
  status: z.enum(['new', 'contacted', 'qualified', 'lost']).default('new'),
  tags: z.array(z.string()).optional(),
  custom_fields: z.record(z.any()).optional(),
  assigned_to: z.string().optional(),
  lead_score: z.number().min(0).max(100).default(0),
  last_contact_date: z.string().transform(str => str ? new Date(str) : undefined).optional(),
  notes: z.string().optional()
});

const convertSchema = z.object({
  name: z.string().min(1),
  company: z.string().optional(),
  position: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  tags: z.array(z.string()).optional(),
  custom_fields: z.record(z.any()).optional(),
  source: z.string().optional()
});

// 取得所有潛客
router.get('/', async (req, res) => {
  try {
    const filters = {
      status: req.query.status as string,
      assigned_to: req.query.assigned_to as string
    };
    const leads = await LeadModel.getAll(filters);
    res.json(leads);
  } catch (error) {
    res.status(500).json({ error: '取得潛客列表失敗' });
  }
});

// 取得單一潛客
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const lead = await LeadModel.getById(id);

    if (!lead) {
      return res.status(404).json({ error: '潛客不存在' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ error: '取得潛客失敗' });
  }
});

// 建立潛客
router.post('/', async (req, res) => {
  try {
    const validatedData = leadSchema.parse(req.body);
    const lead = await LeadModel.create(validatedData);
    res.status(201).json(lead);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '資料格式錯誤', details: error.errors });
    }
    res.status(500).json({ error: '建立潛客失敗' });
  }
});

// 更新潛客
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const validatedData = leadSchema.partial().parse(req.body);
    const lead = await LeadModel.update(id, validatedData);

    if (!lead) {
      return res.status(404).json({ error: '潛客不存在' });
    }

    res.json(lead);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '資料格式錯誤', details: error.errors });
    }
    res.status(500).json({ error: '更新潛客失敗' });
  }
});

// 轉換為聯絡人
router.post('/:id/convert', async (req, res) => {
  try {
    const leadId = parseInt(req.params.id);
    const validatedData = convertSchema.parse(req.body);
    const result = await LeadModel.convertToContact(leadId, validatedData);
    res.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: '資料格式錯誤', details: error.errors });
    }
    res.status(500).json({ error: '轉換失敗' });
  }
});

// 刪除潛客
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const success = await LeadModel.delete(id);

    if (!success) {
      return res.status(404).json({ error: '潛客不存在' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: '刪除潛客失敗' });
  }
});

export default router;
