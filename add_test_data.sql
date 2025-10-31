-- 添加測試客戶數據
INSERT INTO projects (company_name, contact_name, project_date, responsible_person, status, description) VALUES 
('測試公司A', '張三', '2024-01-15', '專案經理', 'active', '網站設計專案'),
('測試公司B', '李四', '2024-02-20', '專案經理', 'completed', '品牌設計專案'),
('測試公司C', '王五', '2024-03-10', '業務經理', 'active', '系統開發專案');

-- 添加測試收入數據
INSERT INTO revenues (project_id, service_type, amount, income_date, status, notes) VALUES 
(1, '網站設計', 100000, '2024-01-20', 'completed', '第一期款項'),
(2, '品牌設計', 80000, '2024-02-25', 'completed', '設計費用'),
(3, '系統開發', 150000, '2024-03-15', 'pending', '開發費用');

-- 添加測試支出數據
INSERT INTO expenses (project_id, supplier_name, expense_type, amount, expense_date, notes) VALUES 
(1, '設計外包商', '設計費', 20000, '2024-01-22', '外包設計費'),
(2, 'Google Ads', '廣告費', 15000, '2024-02-28', 'Google廣告投放'),
(3, '開發團隊', '開發費', 50000, '2024-03-20', '外包開發費用');