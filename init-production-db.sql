-- 完整資料庫初始化腳本（包含財務欄位）

-- 客戶表
CREATE TABLE IF NOT EXISTS customers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    vat_number VARCHAR(50),
    contact_info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 專案表（包含財務欄位）
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    company_alias VARCHAR(255),
    vat_number VARCHAR(50),
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    contact_email VARCHAR(255),
    project_date DATE NOT NULL,
    responsible_person VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    description TEXT,
    finance_contact_name VARCHAR(255),
    finance_contact_phone VARCHAR(50),
    finance_contact_email VARCHAR(255),
    finance_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 專案檔案表
CREATE TABLE IF NOT EXISTS project_files (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    file_type VARCHAR(100) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    google_drive_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 收入分類表
CREATE TABLE IF NOT EXISTS revenue_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 支出分類表
CREATE TABLE IF NOT EXISTS expense_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 收入表
CREATE TABLE IF NOT EXISTS revenues (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    customer_id INTEGER REFERENCES customers(id),
    contract_number VARCHAR(100),
    service_type VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    income_date DATE NOT NULL,
    invoice_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'completed')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 分期收款表
CREATE TABLE IF NOT EXISTS revenue_installments (
    id SERIAL PRIMARY KEY,
    revenue_id INTEGER REFERENCES revenues(id) ON DELETE CASCADE,
    period INTEGER NOT NULL,
    planned_date DATE NOT NULL,
    planned_amount DECIMAL(12,2) NOT NULL,
    actual_received_date DATE,
    actual_amount DECIMAL(12,2),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'received')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 支出表
CREATE TABLE IF NOT EXISTS expenses (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
    supplier_name VARCHAR(255) NOT NULL,
    expense_type VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    expense_date DATE NOT NULL,
    invoice_number VARCHAR(100),
    file_url TEXT,
    notes TEXT,
    payment_request BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 插入預設分類
INSERT INTO revenue_categories (name, description) VALUES
('專案收入', '主要專案服務收入'),
('顧問費', '顧問諮詢服務費'),
('維護費', '系統維護服務費')
ON CONFLICT (name) DO NOTHING;

INSERT INTO expense_categories (name, description) VALUES
('廣告費', '廣告投放相關費用'),
('設計費', '設計服務費用'),
('會員經營', '會員經營相關費用'),
('行銷費', '行銷推廣費用'),
('外包費', '外包服務費用')
ON CONFLICT (name) DO NOTHING;

-- 建立索引
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_date ON projects(project_date);
CREATE INDEX IF NOT EXISTS idx_revenues_project ON revenues(project_id);
CREATE INDEX IF NOT EXISTS idx_revenues_date ON revenues(income_date);
CREATE INDEX IF NOT EXISTS idx_expenses_project ON expenses(project_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
CREATE INDEX IF NOT EXISTS idx_installments_revenue ON revenue_installments(revenue_id);
CREATE INDEX IF NOT EXISTS idx_installments_status ON revenue_installments(status);
