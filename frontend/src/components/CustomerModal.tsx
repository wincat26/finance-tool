import React, { useState } from 'react';
import { X, Save, Archive, Trash2 } from 'lucide-react';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (customer: any) => void;
  customer?: any;
}

export default function CustomerModal({ isOpen, onClose, onSave, customer }: CustomerModalProps) {
  const [formData, setFormData] = useState({
    company_name: customer?.company_name || '',
    company_alias: customer?.company_alias || '',
    vat_number: customer?.vat_number || '',
    contact_name: customer?.contact_name || '',
    contact_phone: customer?.contact_phone || '',
    contact_email: customer?.contact_email || '',
    project_date: customer?.project_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    responsible_person: customer?.responsible_person || '',
    status: customer?.status || 'active',
    description: customer?.description || '',
    finance_contact_name: customer?.finance_contact_name || '',
    finance_contact_phone: customer?.finance_contact_phone || '',
    finance_contact_email: customer?.finance_contact_email || '',
    finance_notes: customer?.finance_notes || ''
  });

  const [originalData, setOriginalData] = useState(formData);
  const [hasChanges, setHasChanges] = useState(false);

  React.useEffect(() => {
    const initial = {
      company_name: customer?.company_name || '',
      company_alias: customer?.company_alias || '',
      vat_number: customer?.vat_number || '',
      contact_name: customer?.contact_name || '',
      contact_phone: customer?.contact_phone || '',
      contact_email: customer?.contact_email || '',
      project_date: customer?.project_date?.split('T')[0] || new Date().toISOString().split('T')[0],
      responsible_person: customer?.responsible_person || '',
      status: customer?.status || 'active',
      description: customer?.description || '',
      finance_contact_name: customer?.finance_contact_name || '',
      finance_contact_phone: customer?.finance_contact_phone || '',
      finance_contact_email: customer?.finance_contact_email || '',
      finance_notes: customer?.finance_notes || ''
    };
    setFormData(initial);
    setOriginalData(initial);
  }, [customer]);

  React.useEffect(() => {
    setHasChanges(JSON.stringify(formData) !== JSON.stringify(originalData));
  }, [formData, originalData]);

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors };
    
    if (name === 'vat_number' && value) {
      if (!/^\d{8}$/.test(value)) {
        newErrors.vat_number = '統編必須為8位數字';
      } else {
        delete newErrors.vat_number;
      }
    }
    
    if (name === 'contact_phone' && value) {
      if (!/^[0-9-+()\s]+$/.test(value)) {
        newErrors.contact_phone = '電話格式不正確';
      } else {
        delete newErrors.contact_phone;
      }
    }
    
    if ((name === 'contact_email' || name === 'finance_contact_email') && value) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        newErrors[name] = 'Email格式不正確';
      } else {
        delete newErrors[name];
      }
    }
    
    if ((name === 'contact_phone' || name === 'finance_contact_phone') && value) {
      if (!/^[0-9-+()\s]+$/.test(value)) {
        newErrors[name] = '電話格式不正確';
      } else {
        delete newErrors[name];
      }
    }
    
    setErrors(newErrors);
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData({...formData, [name]: value});
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      try {
        // 確保 contact_name 欄位存在
        const submitData = {
          ...formData,
          contact_name: formData.contact_name || formData.finance_contact_name
        };
        await onSave(submitData);
        onClose();
      } catch (error) {
        console.error('Save error:', error);
        alert('儲存失敗，請檢查網路連線或稍後再試');
      }
    }
  };

  const handleSaveDraft = () => {
    localStorage.setItem('customerDraft', JSON.stringify(formData));
    alert('已暫存');
  };

  const handleClear = () => {
    const emptyData = {
      company_name: '',
      company_alias: '',
      vat_number: '',
      contact_phone: '',
      contact_email: '',
      project_date: new Date().toISOString().split('T')[0],
      responsible_person: '',
      status: 'active',
      description: '',
      finance_contact_name: '',
      finance_contact_phone: '',
      finance_contact_email: '',
      finance_notes: ''
    };
    setFormData(emptyData);
    setOriginalData(emptyData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{customer ? '編輯客戶' : '新增客戶'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">公司名稱 *</label>
            <input
              type="text"
              required
              value={formData.company_name}
              onChange={(e) => setFormData({...formData, company_name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">公司別名</label>
              <input
                type="text"
                placeholder="報表顯示用短名稱"
                value={formData.company_alias}
                onChange={(e) => setFormData({...formData, company_alias: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">統一編號</label>
              <input
                type="text"
                value={formData.vat_number}
                onChange={(e) => handleInputChange('vat_number', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.vat_number ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
                }`}
              />
              {errors.vat_number && <p className="text-red-500 text-xs mt-1">{errors.vat_number}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">聯絡人 *</label>
              <input
                type="text"
                required
                value={formData.contact_name}
                onChange={(e) => setFormData({...formData, contact_name: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">聯絡電話</label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.contact_phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
                }`}
              />
              {errors.contact_phone && <p className="text-red-500 text-xs mt-1">{errors.contact_phone}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.contact_email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
                }`}
              />
              {errors.contact_email && <p className="text-red-500 text-xs mt-1">{errors.contact_email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">進案日期 *</label>
              <input
                type="date"
                required
                value={formData.project_date}
                onChange={(e) => setFormData({...formData, project_date: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">負責業務 *</label>
              <input
                type="text"
                required
                value={formData.responsible_person}
                onChange={(e) => setFormData({...formData, responsible_person: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">狀態</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">進行中</option>
                <option value="completed">已完成</option>
                <option value="cancelled">已取消</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          {/* 財務資訊 */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">財務資訊</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">財務人員姓名</label>
                <input
                  type="text"
                  value={formData.finance_contact_name}
                  onChange={(e) => setFormData({...formData, finance_contact_name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">財務人員電話</label>
                <input
                  type="tel"
                  value={formData.finance_contact_phone}
                  onChange={(e) => handleInputChange('finance_contact_phone', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                    errors.finance_contact_phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
                  }`}
                />
                {errors.finance_contact_phone && <p className="text-red-500 text-xs mt-1">{errors.finance_contact_phone}</p>}
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">財務人員Email</label>
              <input
                type="email"
                value={formData.finance_contact_email}
                onChange={(e) => handleInputChange('finance_contact_email', e.target.value)}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.finance_contact_email ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500'
                }`}
              />
              {errors.finance_contact_email && <p className="text-red-500 text-xs mt-1">{errors.finance_contact_email}</p>}
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">財務備註</label>
              <textarea
                rows={3}
                value={formData.finance_notes}
                onChange={(e) => setFormData({...formData, finance_notes: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="flex justify-between pt-4">
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Archive className="h-4 w-4 mr-1" />
                暫存
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                清空
              </button>
            </div>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => {
                  if (hasChanges && !confirm('有未儲存的變更，確定要關閉嗎？')) {
                    return;
                  }
                  onClose();
                }}
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