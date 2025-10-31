import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface RevenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (revenue: any) => void;
  revenue?: any;
  onDelete?: (id: number) => void;
}

export default function RevenueModal({ isOpen, onClose, onSave, revenue, onDelete }: RevenueModalProps) {
  const [formData, setFormData] = useState({
    service_type: revenue?.service_type || '',
    amount: revenue?.amount || '',
    income_date: revenue?.income_date?.split('T')[0] || new Date().toISOString().split('T')[0],
    invoice_number: revenue?.invoice_number || '',
    status: revenue?.status || 'pending',
    notes: revenue?.notes || ''
  });

  React.useEffect(() => {
    if (revenue) {
      setFormData({
        service_type: revenue.service_type || '',
        amount: revenue.amount || '',
        income_date: revenue.income_date?.split('T')[0] || new Date().toISOString().split('T')[0],
        invoice_number: revenue.invoice_number || '',
        status: revenue.status || 'pending',
        notes: revenue.notes || ''
      });
    }
  }, [revenue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    if (!revenue) {
      setFormData({
        service_type: '',
        amount: '',
        income_date: new Date().toISOString().split('T')[0],
        invoice_number: '',
        status: 'pending',
        notes: ''
      });
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{revenue ? '編輯收入記錄' : '新增收入記錄'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">服務類型 *</label>
            <select
              required
              value={formData.service_type}
              onChange={(e) => setFormData({...formData, service_type: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">請選擇服務類型</option>
              <option value="顧問費">顧問費</option>
              <option value="產品使用">產品使用</option>
              <option value="行銷費用">行銷費用</option>
              <option value="其他">其他</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">金額 *</label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">收款日期 *</label>
              <input
                type="date"
                required
                value={formData.income_date}
                onChange={(e) => setFormData({...formData, income_date: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">發票號碼</label>
              <input
                type="text"
                value={formData.invoice_number}
                onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">收款狀態</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="pending">待收款</option>
                <option value="partial">部分收款</option>
                <option value="completed">已收款</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">備註</label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div className="flex justify-between pt-4">
            {revenue && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('確定要刪除這筆收入記錄嗎？')) {
                    onDelete(revenue.id);
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