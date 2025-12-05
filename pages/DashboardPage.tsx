import React from 'react';
import { useFinance } from '../context/FinanceContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { TrendingUp, DollarSign, Percent, Lightbulb } from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b'];

export const DashboardPage: React.FC = () => {
  const { metrics } = useFinance();

  if (!metrics) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-slate-400">
        <Lightbulb className="w-12 h-12 mb-4 text-indigo-300" />
        <h3 className="text-xl font-semibold text-slate-700">暂无数据</h3>
        <p>请先导入数据并处理以查看分析看板。</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">经营财务分析</h2>
          <p className="text-slate-500 mt-1">关键业绩指标与平台对比分析。</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">总收入</p>
              <h3 className="text-2xl font-bold text-slate-900">¥{metrics.totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">毛利润</p>
              <h3 className="text-2xl font-bold text-slate-900">¥{metrics.totalGrossProfit.toLocaleString(undefined, { maximumFractionDigits: 0 })}</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">平均毛利率</p>
              <h3 className="text-2xl font-bold text-slate-900">{metrics.grossMargin.toFixed(1)}%</h3>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
          <p className="text-indigo-100 text-sm font-medium mb-2">智能洞察</p>
          <p className="text-sm leading-relaxed opacity-90">{metrics.insights[0]}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Comparison Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">平台营收对比</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={metrics.platformStats}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="platform" axisLine={false} tickLine={false} tickFormatter={(v) => v === 'TB' ? '淘宝' : (v === 'JD' ? '京东' : v)} />
                <YAxis axisLine={false} tickLine={false} tickFormatter={(val) => `¥${val/1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend />
                <Bar dataKey="revenue" name="收入" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="profit" name="毛利" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top 5 Products Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6">商品毛利 Top 5</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={metrics.topSkus}
                margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="profit" name="毛利" fill="#8884d8" radius={[0, 4, 4, 0]} barSize={20}>
                  {metrics.topSkus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI/Rule-based Conclusions */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h3 className="text-lg font-bold text-slate-800">系统自动结论</h3>
        </div>
        <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
          <ul className="space-y-3">
            {metrics.insights.map((text, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2"></span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};