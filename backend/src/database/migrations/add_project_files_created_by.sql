-- 新增 project_files.created_by 欄位，並設定預設值
ALTER TABLE project_files
ADD COLUMN IF NOT EXISTS created_by VARCHAR(255) NOT NULL DEFAULT '系統管理員';

-- 將既有資料的 created_by 補上預設值
UPDATE project_files
SET created_by = COALESCE(created_by, '系統管理員');
