import React, { useState, useMemo } from 'react';
import { useFinance } from '../context/FinanceContext';
import { Platform, ReconStatus } from '../types';
import { PLATFORM_OPTIONS, STATUS_OPTIONS } from '../constants';
import { StatusBadge } from '../components/StatusBadge';
import { Download, Search, AlertCircle } from 'lucide-react';

export const ReconciliationPage: React.FC = () => {
  const { records } = useFinance();
  const [platformFilter, setPlatformFilter] = useState<string>(Platform.ALL);
  const [statusFilter, setStatusFilter] = useState<string>(ReconStatus.ALL);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return records.filter(item => {
      const matchPlatform = platformFilter === Platform.ALL || item.platform === platformFilter;
      const matchStatus = statusFilter === ReconStatus.ALL || item.status === statusFilter;
      const matchSearch = item.orderId.toLowerCase().includes(searchTerm.toLowerCase());
      return matchPlatform && matchStatus && matchSearch;
    });
  }, [records, platformFilter, statusFilter, searchTerm]);

  const handleExport = () => {
    if (filteredData.length === 0) return;
    
    // Simple CSV Export Logic
    const headers = ['订单号', '平台', '店铺', '应收金额', '实收金额', '对账状态', '差额', '日期'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(row => [
        row.orderId,
        row.platform,
        row.shopName,
        row.receivableAmount,
        row.actualAmount,
        row.status,
        row.diff,
        row.date
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '对账结果导出.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">对账结果明细</h2>
          <p className="text-slate-500 text-sm mt-1">查看每一笔订单的支付回款与差异情况。</p>
        </div>
        <button 
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors text-sm"
        >
          <Download className="w-4 h-4" /> 导出 CSV
        </button>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="搜索订单号..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <select
          value={platformFilter}
          onChange={(e) => setPlatformFilter(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {PLATFORM_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        
        <div className="flex items-center justify-end text-sm text-slate-500">
          显示 {filteredData.length} 条记录
        </div>
      </div>

      {/* Table Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">订单号</th>
                <th className="px-6 py-4 font-semibold text-slate-700">平台</th>
                <th className="px-6 py-4 font-semibold text-slate-700">店铺</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">应收金额</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">实收金额</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-center">状态</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">差额</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.length > 0 ? (
                filteredData.map((row) => (
                  <tr key={row.orderId} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-3 font-medium text-slate-700">{row.orderId}</td>
                    <td className="px-6 py-3 text-slate-500">{row.platform === 'TB' ? '淘宝' : row.platform === 'JD' ? '京东' : row.platform}</td>
                    <td className="px-6 py-3 text-slate-500 truncate max-w-[150px]">{row.shopName}</td>
                    <td className="px-6 py-3 text-right text-slate-700">¥{row.receivableAmount.toFixed(2)}</td>
                    <td className="px-6 py-3 text-right text-slate-700">¥{row.actualAmount.toFixed(2)}</td>
                    <td className="px-6 py-3 text-center">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className={`px-6 py-3 text-right font-medium ${row.diff < 0 ? 'text-rose-600' : row.diff > 0 ? 'text-green-600' : 'text-slate-400'}`}>
                      {row.diff > 0 ? '+' : ''}{row.diff.toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center">
                      <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
                      <p>未找到匹配的记录。</p>
                      {records.length === 0 && <p className="text-xs mt-1">请先在导入页面上传数据。</p>}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};