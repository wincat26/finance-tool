import { Router } from 'express';
import { LeadModel } from '../models/Lead';
import { leadSchema } from './leads';
import { z } from 'zod';

const router = Router();

// 公開 API: 建立潛客 (用於外部表單)
router.post('/leads', async (req, res) => {
    try {
        // 允許來自任何來源的請求 (或根據需求設定 CORS)
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Content-Type');

        // 驗證資料
        const validatedData = leadSchema.parse(req.body);

        // 強制設定來源為 'website_form' (若未提供)
        if (!validatedData.source) {
            validatedData.source = 'website_form';
        }

        // 建立潛客 (這會自動觸發 Google Chat 通知)
        const lead = await LeadModel.create(validatedData);

        res.status(201).json({
            success: true,
            message: 'Lead created successfully',
            id: lead.id
        });
    } catch (error) {
        console.error('Public API Error:', error);
        if (error instanceof z.ZodError) {
            return res.status(400).json({ error: 'Validation failed', details: error.errors });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// 處理 OPTIONS 預檢請求
router.options('/leads', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(200);
});

export default router;
