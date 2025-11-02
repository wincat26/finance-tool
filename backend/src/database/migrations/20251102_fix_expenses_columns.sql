-- 修復 expenses 表缺失欄位問題
-- 日期: 2025-11-02
-- 說明: 同步 init-production-db.sql 與實際使用的欄位

ALTER TABLE expenses ADD COLUMN IF NOT EXISTS payment_request BOOLEAN DEFAULT FALSE;
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS ad_platform VARCHAR(50);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS card_fee DECIMAL(12,2);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS overseas_tax DECIMAL(12,2);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS business_tax DECIMAL(12,2);
