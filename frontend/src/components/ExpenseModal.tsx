import React, { useState } from 'react';
import { X, Save } from 'lucide-react';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: any) => void;
  expense?: any;
  onDelete?: (id: number) => void;
}

export default function ExpenseModal({ isOpen, onClose, onSave, expense, onDelete }: ExpenseModalProps) {
  const [formData, setFormData] = useState({
    supplier_name: expense?.supplier_name || '',
    expense_type: expense?.expense_type || '',
    amount: expense?.amount || '',
    expense_date: expense?.expense_date?.slice(0, 7) || new Date().toISOString().slice(0, 7),
    invoice_number: expense?.invoice_number || '',
    file_url: expense?.file_url || '',
    notes: expense?.notes || '',
    // 請款提醒
    payment_request: expense?.payment_request || false,
    // 廣告費專用欄位
    ad_platform: expense?.ad_platform || '',
    card_fee: expense?.card_fee || '',
    overseas_tax: expense?.overseas_tax || '',
    business_tax: expense?.business_tax || '',
    enable_card_fee: false,
    enable_overseas_tax: false
  });

  React.useEffect(() => {
    if (expense) {
      setFormData({
        supplier_name: expense.supplier_name || '',
        expense_type: expense.expense_type || '',
        amount: expense.amount || '',
        expense_date: expense.expense_date?.slice(0, 7) || new Date().toISOString().slice(0, 7),
        invoice_number: expense.invoice_number || '',
        file_url: expense.file_url || '',
        notes: expense.notes || '',
        payment_request: expense.payment_request || false,
        ad_platform: expense.ad_platform || '',
        card_fee: expense.card_fee || '',
        overseas_tax: expense.overseas_tax || '',
        business_tax: expense.business_tax || '',
        enable_card_fee: false,
        enable_overseas_tax: false
      });
    }
  }, [expense]);

  const getAdTaxInfo = (platform: string) => {
    switch(platform) {
      case 'Meta':
        return { cardFee: 1.5, overseasTax: 3, businessTax: 0 };
      case 'Google':
        return { cardFee: 0, overseasTax: 0, businessTax: 5 };
      case 'Line':
        return { cardFee: 0, overseasTax: 0, businessTax: 5 };
      default:
        return { cardFee: 0, overseasTax: 0, businessTax: 0 };
    }
  };

  const calculateAdFees = () => {
    const amount = parseFloat(formData.amount) || 0;
    const taxInfo = getAdTaxInfo(formData.ad_platform);
    
    const cardFee = formData.enable_card_fee ? amount * (taxInfo.cardFee / 100) : 0;
    const overseasTax = formData.enable_overseas_tax ? amount * (taxInfo.overseasTax / 100) : 0;
    const businessTax = amount * (taxInfo.businessTax / 100);
    
    return { cardFee, overseasTax, businessTax };
  };

  React.useEffect(() => {
    if (formData.expense_type === '廣告費' && formData.ad_platform && formData.amount) {
      const fees = calculateAdFees();
      setFormData(prev => ({
        ...prev,
        card_fee: fees.cardFee.toString(),
        overseas_tax: fees.overseasTax.toString(),
        business_tax: fees.businessTax.toString()
      }));
    }
  }, [formData.amount, formData.ad_platform, formData.expense_type, formData.enable_card_fee, formData.enable_overseas_tax]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      amount: parseFloat(formData.amount)
    });
    setFormData({
      supplier_name: '',
      expense_type: '',
      amount: '',
      expense_date: new Date().toISOString().slice(0, 7),
      invoice_number: '',
      file_url: '',
      notes: '',
      payment_request: false,
      ad_platform: '',
      card_fee: '',
      overseas_tax: '',
      business_tax: '',
      enable_card_fee: false,
      enable_overseas_tax: false
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{expense ? '編輯支出記錄' : '新增支出記錄'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">支出類型 *</label>
            <select
              required
              value={formData.expense_type}
              onChange={(e) => setFormData({...formData, expense_type: e.target.value, supplier_name: '', ad_platform: ''})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">請選擇支出類型</option>
              <option value="廣告費">廣告費</option>
              <option value="設計費">設計費</option>
              <option value="會員經營">會員經營</option>
              <option value="行銷費">行銷費</option>
              <option value="外包費">外包費</option>
              <option value="其他">其他</option>
            </select>
          </div>

          {formData.expense_type === '廣告費' ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">廣告平台 *</label>
                <select
                  required
                  value={formData.ad_platform}
                  onChange={(e) => setFormData({...formData, ad_platform: e.target.value, supplier_name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">請選擇廣告平台</option>
                  <option value="Google">Google Ads</option>
                  <option value="Meta">Meta Ads</option>
                  <option value="Line">Line Ads</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">廣告金額 *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">支出認列月份 *</label>
                  <input
                    type="month"
                    required
                    value={formData.expense_date}
                    onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              {formData.ad_platform && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">稅費計算</h4>
                  
                  {formData.ad_platform === 'Meta' && (
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="card_fee"
                          checked={formData.enable_card_fee}
                          onChange={(e) => setFormData({...formData, enable_card_fee: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="card_fee" className="text-sm text-gray-700">刷卡手續費 (1.5%)</label>
                        <input
                          type="number"
                          readOnly
                          value={formData.card_fee}
                          className="flex-1 border border-gray-300 rounded px-2 py-1 bg-gray-100 text-sm"
                        />
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id="overseas_tax"
                          checked={formData.enable_overseas_tax}
                          onChange={(e) => setFormData({...formData, enable_overseas_tax: e.target.checked})}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="overseas_tax" className="text-sm text-gray-700">境外稅 (3%)</label>
                        <input
                          type="number"
                          readOnly
                          value={formData.overseas_tax}
                          className="flex-1 border border-gray-300 rounded px-2 py-1 bg-gray-100 text-sm"
                        />
                      </div>
                    </div>
                  )}
                  
                  {(formData.ad_platform === 'Google' || formData.ad_platform === 'Line') && (
                    <div className="flex items-center space-x-3">
                      <label className="text-sm text-gray-700">營業稅 (5%)</label>
                      <input
                        type="number"
                        readOnly
                        value={formData.business_tax}
                        className="flex-1 border border-gray-300 rounded px-2 py-1 bg-gray-100 text-sm"
                      />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">供應商 *</label>
                <input
                  type="text"
                  required
                  value={formData.supplier_name}
                  onChange={(e) => setFormData({...formData, supplier_name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">支出認列月份 *</label>
                  <input
                    type="month"
                    required
                    value={formData.expense_date}
                    onChange={(e) => setFormData({...formData, expense_date: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">發票號碼</label>
                <input
                  type="text"
                  value={formData.invoice_number}
                  onChange={(e) => setFormData({...formData, invoice_number: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">附件連結</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.file_url}
              onChange={(e) => setFormData({...formData, file_url: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
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

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="payment_request"
              checked={formData.payment_request}
              onChange={(e) => setFormData({...formData, payment_request: e.target.checked})}
              className="rounded border-gray-300"
            />
            <label htmlFor="payment_request" className="text-sm text-gray-700">
              需要請款提醒
            </label>
          </div>

          <div className="flex justify-between pt-4">
            {expense && onDelete && (
              <button
                type="button"
                onClick={() => {
                  if (confirm('確定要刪除這筆支出記錄嗎？')) {
                    onDelete(expense.id);
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