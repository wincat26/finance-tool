import { useState, useEffect } from 'react';
import { Lead } from '../types';
import LeadModal from './LeadModal';
import { api } from '../utils/api';

const statusColors = {
  new: 'bg-blue-100 text-blue-800',
  contacted: 'bg-yellow-100 text-yellow-800',
  qualified: 'bg-green-100 text-green-800',
  lost: 'bg-gray-100 text-gray-800'
};

const statusLabels = {
  new: '新潛客',
  contacted: '已聯繫',
  qualified: '已轉換',
  lost: '已流失'
};

export default function LeadList() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [filter]);

  const fetchLeads = async () => {
    try {
      const data = await api.getLeads(filter);
      setLeads(data);
    } catch (error) {
      console.error('取得潛客失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveLead = async (data: Partial<Lead>) => {
    try {
      if (editingLead) {
        await api.updateLead(editingLead.id, data);
      } else {
        await api.createLead(data);
      }
      fetchLeads();
      setIsModalOpen(false);
      setEditingLead(null);
    } catch (error) {
      console.error('儲存潛客失敗:', error);
      alert('儲存失敗，請稍後再試');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('確定要刪除此潛客嗎？')) return;
    try {
      await api.deleteLead(id);
      fetchLeads();
    } catch (error) {
      console.error('刪除潛客失敗:', error);
      alert('刪除失敗');
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  if (loading) return <div className="p-8">載入中...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">潛在客戶管理</h1>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + 新增潛客
        </button>
      </div>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilter('')}
          className={`px-4 py-2 rounded ${!filter ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          全部
        </button>
        {Object.entries(statusLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded ${filter === key ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">姓名</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">公司</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">電話</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">來源</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">評分</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">狀態</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">負責人</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium">{lead.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.company || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.source || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="font-semibold">{lead.lead_score}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors[lead.status]}`}>
                    {statusLabels[lead.status]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{lead.assigned_to || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(lead)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    編輯
                  </button>
                  <button
                    onClick={() => handleDelete(lead.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="text-center py-8 text-gray-500">尚無潛客資料</div>
        )}
      </div>

      <LeadModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveLead}
        initialData={editingLead}
      />
    </div>
  );
}
