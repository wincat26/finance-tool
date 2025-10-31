import React, { useState, useEffect } from 'react';
import { Download, Calendar, ChevronDown, ChevronRight } from 'lucide-react';

export default function FinanceManagement() {
  const [yearFilter, setYearFilter] = useState<number>(new Date().getFullYear());
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchReportData();
  }, [yearFilter]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.PROD ? 'https://finance-reddoor.zeabur.app:8080' : '';
      const response = await fetch(`${apiUrl}/api/finance/annual-report?year=${yearFilter}`);
      const data = await response.json();
      setReportData(data);
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompany = (company: string) => {
    const newExpanded = new Set(expandedCompanies);
    if (newExpanded.has(company)) {
      newExpanded.delete(company);
    } else {
      newExpanded.add(company);
    }
    setExpandedCompanies(newExpanded);
  };

  const exportToCSV = () => {
    if (!reportData) return;
    
    const csvData = [];
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    
    // 標題行
    csvData.push(['類別', '公司', '細項', ...months, '合計']);
    
    // 收入數據
    Object.entries(reportData.revenues).forEach(([company, companyData]: [string, any]) => {
      Object.entries(companyData).forEach(([category, monthlyData]: [string, any]) => {
        const row = ['收入', company, category];
        months.forEach((_, index) => {
          row.push(monthlyData[index + 1] || 0);
        });
        row.push(Object.values(monthlyData).reduce((sum: number, val: any) => sum + (val || 0), 0));
        csvData.push(row);
      });
    });
    
    // 支出數據
    Object.entries(reportData.expenses).forEach(([company, companyData]: [string, any]) => {
      Object.entries(companyData).forEach(([category, monthlyData]: [string, any]) => {
        const row = ['支出', company, category];
        months.forEach((_, index) => {
          row.push(monthlyData[index + 1] || 0);
        });
        row.push(Object.values(monthlyData).reduce((sum: number, val: any) => sum + (val || 0), 0));
        csvData.push(row);
      });
    });
    
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${yearFilter}年度收益表.csv`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!reportData) {
    return <div className="text-center py-12 text-gray-500">無法載入報表資料</div>;
  }

  const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];

  return (
    <div className="space-y-6">
      {/* 標題和操作 */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">年度收益表</h1>
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button
            onClick={exportToCSV}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
          >
            <Download className="h-4 w-4 mr-2" />
            匯出CSV
          </button>
        </div>
      </div>

      {/* 收益表 */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">類別</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">公司/細項</th>
                {months.map(month => (
                  <th key={month} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{month}</th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">合計</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {/* 收入部分 */}
              {Object.entries(reportData.revenues).map(([company, companyData]: [string, any]) => {
                const isExpanded = expandedCompanies.has(`revenue-${company}`);
                const companyTotal = Object.values(companyData).reduce((sum: number, monthlyData: any) => {
                  return sum + Object.values(monthlyData).reduce((monthSum: number, val: any) => monthSum + (val || 0), 0);
                }, 0);
                
                return (
                  <React.Fragment key={`revenue-${company}`}>
                    {/* 公司總計行 */}
                    <tr className="bg-green-100 cursor-pointer hover:bg-green-200" onClick={() => toggleCompany(`revenue-${company}`)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-800">收入</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-800 flex items-center">
                        {isExpanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                        {company}
                      </td>
                      {months.map((_, index) => {
                        const monthTotal = Object.values(companyData).reduce((sum: number, monthlyData: any) => {
                          return sum + (monthlyData[index + 1] || 0);
                        }, 0);
                        return (
                          <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-green-800">
                            {monthTotal ? `$${Number(monthTotal).toLocaleString()}` : '-'}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-green-800">
                        ${Number(companyTotal).toLocaleString()}
                      </td>
                    </tr>
                    
                    {/* 展開的細項 */}
                    {isExpanded && Object.entries(companyData).map(([category, monthlyData]: [string, any]) => {
                      const total = Object.values(monthlyData).reduce((sum: number, val: any) => sum + (val || 0), 0);
                      return (
                        <tr key={`revenue-${company}-${category}`} className="bg-green-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-700 pl-12">{category}</td>
                          {months.map((_, index) => (
                            <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-700">
                              {monthlyData[index + 1] ? `$${Number(monthlyData[index + 1]).toLocaleString()}` : '-'}
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-green-700">
                            ${Number(total).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              
              {/* 支出部分 */}
              {Object.entries(reportData.expenses).map(([company, companyData]: [string, any]) => {
                const isExpanded = expandedCompanies.has(`expense-${company}`);
                const companyTotal = Object.values(companyData).reduce((sum: number, monthlyData: any) => {
                  return sum + Object.values(monthlyData).reduce((monthSum: number, val: any) => monthSum + (val || 0), 0);
                }, 0);
                
                return (
                  <React.Fragment key={`expense-${company}`}>
                    {/* 公司總計行 */}
                    <tr className="bg-red-100 cursor-pointer hover:bg-red-200" onClick={() => toggleCompany(`expense-${company}`)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-800">支出</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-800 flex items-center">
                        {isExpanded ? <ChevronDown className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4 mr-2" />}
                        {company}
                      </td>
                      {months.map((_, index) => {
                        const monthTotal = Object.values(companyData).reduce((sum: number, monthlyData: any) => {
                          return sum + (monthlyData[index + 1] || 0);
                        }, 0);
                        return (
                          <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-red-800">
                            {monthTotal ? `-$${Number(monthTotal).toLocaleString()}` : '-'}
                          </td>
                        );
                      })}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-red-800">
                        -${Number(companyTotal).toLocaleString()}
                      </td>
                    </tr>
                    
                    {/* 展開的細項 */}
                    {isExpanded && Object.entries(companyData).map(([category, monthlyData]: [string, any]) => {
                      const total = Object.values(monthlyData).reduce((sum: number, val: any) => sum + (val || 0), 0);
                      return (
                        <tr key={`expense-${company}-${category}`} className="bg-red-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600"></td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-red-700 pl-12">{category}</td>
                          {months.map((_, index) => (
                            <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-700">
                              {monthlyData[index + 1] ? `-$${Number(monthlyData[index + 1]).toLocaleString()}` : '-'}
                            </td>
                          ))}
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-red-700">
                            -${Number(total).toLocaleString()}
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              
              {/* 總計行 */}
              <tr className="bg-blue-50 font-semibold">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-blue-800" colSpan={2}>淨收益</td>
                {months.map((_, index) => {
                  const monthRevenue = Object.values(reportData.revenues).reduce((sum: number, companyData: any) => {
                    return sum + Object.values(companyData).reduce((companySum: number, monthlyData: any) => {
                      return companySum + (monthlyData[index + 1] || 0);
                    }, 0);
                  }, 0);
                  const monthExpense = Object.values(reportData.expenses).reduce((sum: number, companyData: any) => {
                    return sum + Object.values(companyData).reduce((companySum: number, monthlyData: any) => {
                      return companySum + (monthlyData[index + 1] || 0);
                    }, 0);
                  }, 0);
                  const monthProfit = monthRevenue - monthExpense;
                  return (
                    <td key={index} className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                      monthProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {monthProfit !== 0 ? `${monthProfit >= 0 ? '' : '-'}$${Math.abs(monthProfit).toLocaleString()}` : '-'}
                    </td>
                  );
                })}
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${
                  reportData.totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {reportData.totalProfit >= 0 ? '' : '-'}${Math.abs(reportData.totalProfit).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


    </div>
  );
}