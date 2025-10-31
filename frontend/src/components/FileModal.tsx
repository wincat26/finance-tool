import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface FileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (file: any) => void;
  file?: any;
  onDelete?: (id: number) => void;
}

export default function FileModal({ isOpen, onClose, onSave, file, onDelete }: FileModalProps) {
  const [formData, setFormData] = useState({
    file_type: file?.file_type || '',
    file_name: file?.file_name || '',
    google_drive_url: file?.google_drive_url || '',
    created_by: '系統管理員'
  });

  React.useEffect(() => {
    if (file) {
      setFormData({
        file_type: file.file_type || '',
        file_name: file.file_name || '',
        google_drive_url: file.google_drive_url || '',
        created_by: file.created_by || '系統管理員'
      });
    }
  }, [file]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    if (!file) {
      setFormData({ file_type: '', file_name: '', google_drive_url: '', created_by: '系統管理員' });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{file ? '編輯檔案' : '新增檔案'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">檔案類型 *</label>
            <select
              required
              value={formData.file_type}
              onChange={(e) => setFormData({...formData, file_type: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">請選擇檔案類型</option>
              <option value="合約">合約</option>
              <option value="委刊單">委刊單</option>
              <option value="報價單">報價單</option>
              <option value="發票">發票</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">檔案名稱 *</label>
            <input
              type="text"
              required
              value={formData.file_name}
              onChange={(e) => setFormData({...formData, file_name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Google Drive 連結 *</label>
            <input
              type="url"
              required
              placeholder="https://drive.google.com/..."
              value={formData.google_drive_url}
              onChange={(e) => setFormData({...formData, google_drive_url: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-between pt-4">
            {file && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('確定要刪除這個檔案嗎？')) {
                    onDelete(file.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50"
              >
                刪除
              </button>
            )}
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                取消
              </button>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Save className="h-4 w-4 mr-1" />
                儲存
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}