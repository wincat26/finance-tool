import React, { useState } from 'react';
import { ArrowLeft, Edit, Plus, ExternalLink, DollarSign, Receipt, BarChart3 } from 'lucide-react';
import { Project } from '../types';
import { format } from 'date-fns';
import FileModal from './FileModal';
import RevenueModal from './RevenueModal';
import ExpenseModal from './ExpenseModal';
import { apiClient } from '../utils/api';

interface CustomerDetailProps {
  customer: Project;
  onBack: () => void;
  onEdit: (customer: Project) => void;
}

export default function CustomerDetail({ customer, onBack, onEdit }: CustomerDetailProps) {
  const [activeTab, setActiveTab] = useState('info');
  const [showFileModal, setShowFileModal] = useState(false);
  const [editingFile, setEditingFile] = useState<any>(null);
  const [showRevenueModal, setShowRevenueModal] = useState(false);
  const [editingRevenue, setEditingRevenue] = useState<any>(null);
  const [revenues, setRevenues] = useState<any[]>([]);

  const fetchRevenues = async () => {
    try {
      const response = await apiClient.get(`/api/customers/${customer.id}/revenues`);
      setRevenues(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch revenues:', error);
      setRevenues([]);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'revenue') {
      fetchRevenues();
    }
  }, [activeTab, customer.id]);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState<any>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expenseFilter, setExpenseFilter] = useState('all');

  const fetchExpenses = async () => {
    try {
      const response = await apiClient.get(`/api/customers/${customer.id}/expenses`);
      setExpenses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
      setExpenses([]);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'expense') {
      fetchExpenses();
    }
  }, [activeTab, customer.id]);

  // 初始化 expenses 為空陣列
  React.useEffect(() => {
    setExpenses([]);
  }, [customer.id]);
  const [files, setFiles] = useState<any[]>([]);
  const [fileFilter, setFileFilter] = useState('all');

  const fetchFiles = async () => {
    try {
      const response = await apiClient.get(`/api/customers/${customer.id}/files`);
      setFiles(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setFiles([]);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'files') {
      fetchFiles();
    }
  }, [activeTab, customer.id]);

  const tabs = [
    { id: 'info', name: '基本資料', icon: Edit },
    { id: 'files', name: '檔案管理', icon: ExternalLink },
    { id: 'revenue', name: '收入記錄', icon: DollarSign },
    { id: 'expense', name: '支出記錄', icon: Receipt },
    { id: 'report', name: '損益報表', icon: BarChart3 }
  ];

  return (
    <div className="space-y-6">
      {/* 標題列 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-md"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{customer.company_name}</h1>
            <p className="text-gray-500">客戶詳情</p>
          </div>
        </div>
        <div></div>
      </div>

      {/* 標籤頁 */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 inline mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 內容區域 */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'info' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">基本資料</h3>
              <button 
                onClick={() => onEdit(customer)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Edit className="h-4 w-4 mr-1" />
                編輯資料
              </button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="text-md font-medium mb-4">公司資訊</h4>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">公司名稱</dt>
                  <dd className="text-sm text-gray-900">{customer.company_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">統一編號</dt>
                  <dd className="text-sm text-gray-900">{customer.vat_number || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">狀態</dt>
                  <dd>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      customer.status === 'active' ? 'bg-green-100 text-green-800' :
                      customer.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {customer.status === 'active' ? '進行中' : 
                       customer.status === 'completed' ? '已完成' : '已取消'}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
              <div>
                <h4 className="text-md font-medium mb-4">聯絡資訊</h4>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">聯絡人</dt>
                  <dd className="text-sm text-gray-900">{customer.contact_name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">電話</dt>
                  <dd className="text-sm text-gray-900">{customer.contact_phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="text-sm text-gray-900">{customer.contact_email || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">負責業務</dt>
                  <dd className="text-sm text-gray-900">{customer.responsible_person}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">進案日期</dt>
                  <dd className="text-sm text-gray-900">{format(new Date(customer.project_date), 'yyyy/MM/dd')}</dd>
                </div>
              </dl>
              </div>
            </div>
            
            {/* 財務資訊 */}
            <div className="border-t pt-6 mt-6">
              <h4 className="text-md font-medium mb-4">財務資訊</h4>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">財務人員姓名</dt>
                      <dd className="text-sm text-gray-900">{customer.finance_contact_name || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">財務人員電話</dt>
                      <dd className="text-sm text-gray-900">{customer.finance_contact_phone || '-'}</dd>
                    </div>
                  </dl>
                </div>
                <div>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">財務人員Email</dt>
                      <dd className="text-sm text-gray-900">{customer.finance_contact_email || '-'}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">財務備註</dt>
                      <dd className="text-sm text-gray-900">{customer.finance_notes || '-'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-medium">檔案管理</h3>
                <select
                  value={fileFilter}
                  onChange={(e) => setFileFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">所有檔案</option>
                  <option value="合約">合約</option>
                  <option value="委刊單">委刊單</option>
                  <option value="報價單">報價單</option>
                  <option value="發票">發票</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <button 
                onClick={() => setShowFileModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                新增檔案
              </button>
            </div>
            {(() => {
              const filteredFiles = files
                .filter(file => fileFilter === 'all' || file.file_type === fileFilter)
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
              
              const groupedFiles = filteredFiles.reduce((groups, file) => {
                const type = file.file_type;
                if (!groups[type]) groups[type] = [];
                groups[type].push(file);
                return groups;
              }, {} as Record<string, any[]>);

              return filteredFiles.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {fileFilter === 'all' ? '尚無檔案' : `無 ${fileFilter} 檔案`}
                </div>
              ) : fileFilter === 'all' ? (
                <div className="space-y-6">
                  {Object.entries(groupedFiles).map(([type, typeFiles]) => (
                    <div key={type}>
                      <h4 className="text-md font-medium text-gray-700 mb-3 border-b pb-1">{type} ({typeFiles.length})</h4>
                      <div className="space-y-2">
                        {typeFiles.map((file) => (
                          <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex items-center space-x-3">
                              <ExternalLink className="h-5 w-5 text-gray-400" />
                              <div>
                                <p className="font-medium text-gray-900">{file.file_name}</p>
                                <p className="text-xs text-gray-400">
                                  {file.created_by} · {format(new Date(file.created_at), 'yyyy/MM/dd HH:mm')}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingFile(file)}
                                className="text-gray-600 hover:text-gray-800 text-sm"
                              >
                                編輯
                              </button>
                              <a
                                href={file.google_drive_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                              >
                                開啟
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-3">
                        <ExternalLink className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{file.file_name}</p>
                          <p className="text-xs text-gray-400">
                            {file.created_by} · {format(new Date(file.created_at), 'yyyy/MM/dd HH:mm')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setEditingFile(file)}
                          className="text-gray-600 hover:text-gray-800 text-sm"
                        >
                          編輯
                        </button>
                        <a
                          href={file.google_drive_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                        >
                          開啟
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === 'revenue' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">收入記錄</h3>
              <button 
                onClick={() => setShowRevenueModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                新增收入
              </button>
            </div>
            {revenues.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                尚無收入記錄
              </div>
            ) : (
              <div className="space-y-3">
                {revenues.map((revenue) => (
                  <div key={revenue.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{revenue.service_type}</p>
                        <p className="text-lg font-semibold text-green-600">+${Number(revenue.amount).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-gray-500">狀態: {revenue.status === 'pending' ? '待收款' : revenue.status === 'partial' ? '部分收款' : '已收款'}</p>
                      <p className="text-xs text-gray-400">
                        {format(new Date(revenue.income_date), 'yyyy/MM/dd')} · {revenue.invoice_number || '無發票'}
                      </p>
                      {revenue.notes && (
                        <p className="text-xs text-gray-500 mt-1">{revenue.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => setEditingRevenue(revenue)}
                      className="text-gray-600 hover:text-gray-800 text-sm ml-2"
                    >
                      編輯
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'expense' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-medium">支出記錄</h3>
                <select
                  value={expenseFilter}
                  onChange={(e) => setExpenseFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">所有支出</option>
                  <option value="廣告費">廣告費</option>
                  <option value="設計費">設計費</option>
                  <option value="會員經營">會員經營</option>
                  <option value="行銷費">行銷費</option>
                  <option value="外包費">外包費</option>
                  <option value="其他">其他</option>
                </select>
              </div>
              <button 
                onClick={() => setShowExpenseModal(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                <Plus className="h-4 w-4 mr-1" />
                新增支出
              </button>
            </div>
            {(() => {
              const filteredExpenses = expenses
                .filter(expense => expenseFilter === 'all' || expense.expense_type === expenseFilter)
                .sort((a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime());
              
              const groupedExpenses = filteredExpenses.reduce((groups, expense) => {
                const type = expense.expense_type;
                if (!groups[type]) groups[type] = [];
                groups[type].push(expense);
                return groups;
              }, {} as Record<string, any[]>);

              return filteredExpenses.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {expenseFilter === 'all' ? '尚無支出記錄' : `無 ${expenseFilter} 記錄`}
                </div>
              ) : expenseFilter === 'all' ? (
                <div className="space-y-6">
                  {Object.entries(groupedExpenses).map(([type, typeExpenses]) => (
                    <div key={type}>
                      <h4 className="text-md font-medium text-gray-700 mb-3 border-b pb-1">{type} ({typeExpenses.length})</h4>
                      <div className="space-y-2">
                        {typeExpenses.map((expense) => (
                          <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900">{expense.supplier_name || expense.ad_platform || '供應商'}</p>
                                <p className="text-lg font-semibold text-red-600">-${Number(expense.amount).toLocaleString()}</p>
                              </div>
                              <p className="text-xs text-gray-400">
                                {format(new Date(expense.expense_date), 'yyyy/MM/dd')} · {expense.invoice_number || '無發票'}
                              </p>
                              {expense.notes && (
                                <p className="text-xs text-gray-500 mt-1">{expense.notes}</p>
                              )}
                              {expense.payment_request && (
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                                  需要請款
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => setEditingExpense(expense)}
                              className="text-gray-600 hover:text-gray-800 text-sm ml-2"
                            >
                              編輯
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredExpenses.map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900">{expense.supplier_name || expense.ad_platform || '供應商'}</p>
                          <p className="text-lg font-semibold text-red-600">-${Number(expense.amount).toLocaleString()}</p>
                        </div>
                        <p className="text-xs text-gray-400">
                          {format(new Date(expense.expense_date), 'yyyy/MM/dd')} · {expense.invoice_number || '無發票'}
                        </p>
                        {expense.notes && (
                          <p className="text-xs text-gray-500 mt-1">{expense.notes}</p>
                        )}
                        {expense.payment_request && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                            需要請款
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => setEditingExpense(expense)}
                        className="text-gray-600 hover:text-gray-800 text-sm ml-2"
                      >
                        編輯
                      </button>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === 'report' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium">損益報表</h3>
              <select
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                defaultValue={new Date().getFullYear()}
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year} 年</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-6">
              {/* 收入總計 */}
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-green-800 mb-3">收入總計</h4>
                <div className="grid grid-cols-2 gap-4">
                  {revenues.reduce((acc, revenue) => {
                    const type = revenue.service_type;
                    if (!acc[type]) acc[type] = 0;
                    acc[type] += Number(revenue.amount);
                    return acc;
                  }, {} as Record<string, number>) && Object.entries(revenues.reduce((acc, revenue) => {
                    const type = revenue.service_type;
                    if (!acc[type]) acc[type] = 0;
                    acc[type] += Number(revenue.amount);
                    return acc;
                  }, {} as Record<string, number>)).map(([type, amount]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-sm text-green-700">{type}</span>
                      <span className="text-sm font-medium text-green-800">${amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span className="text-green-800">總收入</span>
                    <span className="text-green-800">${revenues.reduce((sum, r) => sum + Number(r.amount), 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 支出總計 */}
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-red-800 mb-3">支出總計</h4>
                <div className="grid grid-cols-2 gap-4">
                  {expenses.reduce((acc, expense) => {
                    const type = expense.expense_type;
                    if (!acc[type]) acc[type] = 0;
                    acc[type] += Number(expense.amount);
                    return acc;
                  }, {} as Record<string, number>) && Object.entries(expenses.reduce((acc, expense) => {
                    const type = expense.expense_type;
                    if (!acc[type]) acc[type] = 0;
                    acc[type] += Number(expense.amount);
                    return acc;
                  }, {} as Record<string, number>)).map(([type, amount]) => (
                    <div key={type} className="flex justify-between">
                      <span className="text-sm text-red-700">{type}</span>
                      <span className="text-sm font-medium text-red-800">-${amount.toLocaleString()}</span>
                    </div>
                  ))}
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span className="text-red-800">總支出</span>
                    <span className="text-red-800">-${expenses.reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* 損益總計 */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="text-md font-medium text-blue-800 mb-3">損益總計</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">總收入</span>
                    <span className="text-sm font-medium text-blue-800">${revenues.reduce((sum, r) => sum + Number(r.amount), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-blue-700">總支出</span>
                    <span className="text-sm font-medium text-blue-800">-${expenses.reduce((sum, e) => sum + Number(e.amount), 0).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold text-lg">
                    <span className="text-blue-800">淨利潤</span>
                    <span className={`${revenues.reduce((sum, r) => sum + Number(r.amount), 0) - expenses.reduce((sum, e) => sum + Number(e.amount), 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      ${(revenues.reduce((sum, r) => sum + Number(r.amount), 0) - expenses.reduce((sum, e) => sum + Number(e.amount), 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <FileModal
        isOpen={showFileModal || !!editingFile}
        onClose={() => {
          setShowFileModal(false);
          setEditingFile(null);
        }}
        file={editingFile}
        onSave={async (file) => {
          try {
            const url = editingFile 
              ? `/api/customers/${customer.id}/files/${editingFile.id}`
              : `/api/customers/${customer.id}/files`;
            const method = editingFile ? 'PUT' : 'POST';
            
            if (editingFile) {
              await apiClient.put(`/api/customers/${customer.id}/files/${editingFile.id}`, file);
            } else {
              await apiClient.post(`/api/customers/${customer.id}/files`, file);
            }
            await fetchFiles();
            setEditingFile(null);
          } catch (error) {
            console.error('檔案操作失敗:', error);
          }
        }}
        onDelete={async (id) => {
          try {
            await apiClient.delete(`/api/customers/${customer.id}/files/${id}`);
            await fetchFiles();
            setEditingFile(null);
          } catch (error) {
            console.error('刪除檔案失敗:', error);
          }
        }}
      />

      <RevenueModal
        isOpen={showRevenueModal || !!editingRevenue}
        onClose={() => {
          setShowRevenueModal(false);
          setEditingRevenue(null);
        }}
        revenue={editingRevenue}
        onSave={async (revenue) => {
          try {
            const url = editingRevenue 
              ? `/api/customers/${customer.id}/revenues/${editingRevenue.id}`
              : `/api/customers/${customer.id}/revenues`;
            const method = editingRevenue ? 'PUT' : 'POST';
            
            if (editingRevenue) {
              await apiClient.put(`/api/customers/${customer.id}/revenues/${editingRevenue.id}`, revenue);
            } else {
              await apiClient.post(`/api/customers/${customer.id}/revenues`, revenue);
            }
            await fetchRevenues();
            setEditingRevenue(null);
          } catch (error) {
            console.error('收入操作失敗:', error);
          }
        }}
        onDelete={async (id) => {
          try {
            await apiClient.delete(`/api/customers/${customer.id}/revenues/${id}`);
            await fetchRevenues();
            setEditingRevenue(null);
          } catch (error) {
            console.error('刪除收入失敗:', error);
          }
        }}
      />

      <ExpenseModal
        isOpen={showExpenseModal || !!editingExpense}
        onClose={() => {
          setShowExpenseModal(false);
          setEditingExpense(null);
        }}
        expense={editingExpense}
        onSave={async (expense) => {
          try {
            const url = editingExpense 
              ? `/api/customers/${customer.id}/expenses/${editingExpense.id}`
              : `/api/customers/${customer.id}/expenses`;
            const method = editingExpense ? 'PUT' : 'POST';
            
            if (editingExpense) {
              await apiClient.put(`/api/customers/${customer.id}/expenses/${editingExpense.id}`, expense);
            } else {
              await apiClient.post(`/api/customers/${customer.id}/expenses`, expense);
            }
            await fetchExpenses();
            setEditingExpense(null);
          } catch (error) {
            console.error('支出操作失敗:', error);
          }
        }}
        onDelete={async (id) => {
          try {
            await apiClient.delete(`/api/customers/${customer.id}/expenses/${id}`);
            await fetchExpenses();
            setEditingExpense(null);
          } catch (error) {
            console.error('刪除支出失敗:', error);
          }
        }}
      />
    </div>
  );
}
