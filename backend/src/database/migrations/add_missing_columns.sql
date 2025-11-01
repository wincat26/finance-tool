-- 新增缺少的欄位到 projects 表
ALTER TABLE projects ADD COLUMN IF NOT EXISTS company_alias VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS finance_contact_name VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS finance_contact_phone VARCHAR(50);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS finance_contact_email VARCHAR(255);
ALTER TABLE projects ADD COLUMN IF NOT EXISTS finance_notes TEXT;