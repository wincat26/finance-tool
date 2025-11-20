import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, DollarSign, TrendingUp, FileText, AlertCircle } from 'lucide-react';
import { DashboardData } from '../types';
import { api } from '../utils/api';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4'];

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/dashboard?year=${selectedYear}`);
      setData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">無法載入資料</h3>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 年度選擇器 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">財務 Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 關鍵指標卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">總收入</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(data.profitLoss?.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-red-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">總支出</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(data.profitLoss?.totalExpense || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">淨利潤</p>
              <p className={`text-2xl font-bold ${(data.profitLoss?.profit || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                ${(data.profitLoss?.profit || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">進案總數</p>
              <p className="text-2xl font-bold text-gray-900">
                {(data.projectStats || []).reduce((sum, stat) => sum + stat.count, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 圖表區域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 現金流走勢 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">月度現金流走勢</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.cashFlow || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
              <Bar dataKey="revenue" fill="#10b981" name="收入" />
              <Bar dataKey="expense" fill="#ef4444" name="支出" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 支出結構 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">支出結構分析</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.expenseStructure || []}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
              >
                {(data.expenseStructure || []).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 分期收款進度 */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">分期收款進度</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>已收款</span>
              <span>{data.installmentProgress?.receivedCount || 0} 筆</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{
                  width: `${((data.installmentProgress?.receivedCount || 0) /
                    ((data.installmentProgress?.receivedCount || 0) + (data.installmentProgress?.pendingCount || 0)) || 1) * 100}%`
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              ${(data.installmentProgress?.receivedAmount || 0).toLocaleString()}
            </p>
          </div>
          <div>
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>待收款</span>
              <span>{data.installmentProgress?.pendingCount || 0} 筆</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-500 h-2 rounded-full"
                style={{
                  width: `${((data.installmentProgress?.pendingCount || 0) /
                    ((data.installmentProgress?.receivedCount || 0) + (data.installmentProgress?.pendingCount || 0)) || 1) * 100}%`
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              ${(data.installmentProgress?.pendingAmount || 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}