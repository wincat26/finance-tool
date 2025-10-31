import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, ExternalLink } from 'lucide-react';
import { Project } from '../types';
import axios from 'axios';
import { format } from 'date-fns';
import CustomerModal from './CustomerModal';
import CustomerDetail from './CustomerDetail';

interface ProjectListProps {
  onProjectSelect: (project: Project) => void;
  onNewProject: () => void;
}

export default function ProjectList({ onProjectSelect, onNewProject }: ProjectListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Project | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Project | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [yearFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const apiUrl = 'https://finance-reddoor.zeabur.app:8080';
      const response = await axios.get(`${apiUrl}/api/customers?year=${yearFilter}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.contact_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return '進行中';
      case 'completed': return '已完成';
      case 'cancelled': return '已取消';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 標題和新增按鈕 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">客戶管理</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          新增客戶
        </button>
      </div>

      {/* 搜尋和篩選 */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜尋公司名稱或聯絡人..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">所有狀態</option>
            <option value="active">進行中</option>
            <option value="completed">已完成</option>
            <option value="cancelled">已取消</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year} 年</option>
            ))}
          </select>

          <div className="text-sm text-gray-500 flex items-center">
            <Filter className="h-4 w-4 mr-1" />
            共 {filteredProjects.length} 個客戶
          </div>
        </div>
      </div>

      {/* 專案列表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredProjects.map((project) => (
            <li key={project.id}>
              <div
                onClick={() => setSelectedCustomer(project)}
                className="px-4 py-4 hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-primary-600 truncate">
                        {project.company_name}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                          {getStatusText(project.status)}
                        </span>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      <p className="truncate">
                        聯絡人: {project.contact_name}
                      </p>
                      <span className="mx-2">•</span>
                      <p>
                        負責人: {project.responsible_person}
                      </p>
                      <span className="mx-2">•</span>
                      <p>
                        進案日期: {format(new Date(project.project_date), 'yyyy/MM/dd')}
                      </p>
                    </div>
                    {project.description && (
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {project.description}
                      </p>
                    )}
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <ExternalLink className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">沒有找到符合條件的客戶</p>
          </div>
        )}
      </div>

      {selectedCustomer ? (
        <>
          <CustomerDetail
            customer={selectedCustomer}
            onBack={() => setSelectedCustomer(null)}
            onEdit={(customer) => {
              setEditingCustomer(customer);
              setShowEditModal(true);
            }}
          />
          <CustomerModal
            isOpen={showEditModal}
            onClose={() => {
              setShowEditModal(false);
              setEditingCustomer(null);
            }}
            customer={editingCustomer}
            onSave={async (customer) => {
              try {
                const apiUrl = 'https://finance-reddoor.zeabur.app:8080';
                await axios.put(`${apiUrl}/api/customers/${editingCustomer!.id}`, customer);
                fetchProjects();
                setShowEditModal(false);
                setEditingCustomer(null);
                // 更新當前顯示的客戶資料
                const updatedCustomer = { ...editingCustomer!, ...customer };
                setSelectedCustomer(updatedCustomer);
              } catch (error) {
                console.error('更新客戶失敗:', error);
                alert('更新失敗，請再試一次');
              }
            }}
          />
        </>
      ) : (
        <CustomerModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={async (customer) => {
            try {
              const apiUrl = 'https://finance-reddoor.zeabur.app:8080';
              await axios.post(`${apiUrl}/api/customers`, customer);
              fetchProjects();
            } catch (error) {
              console.error('儲存客戶失敗:', error);
              alert('儲存失敗，請再試一次');
            }
          }}
        />
      )}
    </div>
  );
}