import React, { useState, useEffect } from 'react';
import { FileUpload } from '../components/FileUpload';
import { useFinance } from '../context/FinanceContext';
import { apiService } from '../services/api';
import { Play, Loader2, Database, Wifi, WifiOff, CheckCircle2 } from 'lucide-react';

interface ImportPageProps {
  onNavigate: (tab: string) => void;
}

export const ImportPage: React.FC<ImportPageProps> = ({ onNavigate }) => {
  const { setRecords, setImportStats, importStats, isProcessing, setIsProcessing, setMetrics } = useFinance();
  const [tbFile, setTbFile] = useState<File | null>(null);
  const [jdFile, setJdFile] = useState<File | null>(null);
  const [bankFile, setBankFile] = useState<File | null>(null);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const check = async () => {
      const healthy = await apiService.checkHealth();
      setServerStatus(healthy ? 'online' : 'offline');
    };
    check();
    const timer = setInterval(check, 10000);
    return () => clearInterval(timer);
  }, []);

  const handleProcess = async () => {
    setIsProcessing(true);
    
    try {
      const data = await apiService.uploadFiles(tbFile, jdFile, bankFile);
      setRecords(data.records);
      setMetrics(data.metrics);
      setImportStats(data.stats);
      
      // 成功提示并跳转
      setTimeout(() => {
        setIsProcessing(false);
        // 显示处理成功的提示
        const normalCount = data.records.filter((r: any) => r.status === '对账正常').length;
        const totalCount = data.records.length;
        alert(`✅ 处理完成！\n\n共处理 ${totalCount} 笔订单\n对账正常: ${normalCount} 笔\n需要核查: ${totalCount - normalCount} 笔`);
        // 自动跳转到对账结果页
        onNavigate('recon');
      }, 500);
      
    } catch (err: any) {
      console.error('处理文件错误:', err);
      const errorMessage = err.message || '未知错误';
      
      // 提供更友好的错误提示
      if (errorMessage.includes('Network') || errorMessage.includes('Failed to fetch')) {
        alert('⚠️ 无法连接到后端服务\n\n系统已自动切换到演示模式。\n如需使用完整功能，请确保后端服务已启动：\n\n  cd backend\n  python main.py');
      } else if (errorMessage.includes('timeout')) {
        alert('⏱️ 服务响应超时\n\n文件可能过大或服务繁忙，已切换到演示模式。');
      } else {
        alert(`❌ 处理文件时出错\n\n${errorMessage}\n\n已切换到演示数据，您可以继续体验功能。`);
      }
      
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">数据导入</h2>
          <p className="text-slate-500 mt-1">上传 Excel/CSV 文件，系统将自动清洗并生成财务报表。</p>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
          serverStatus === 'online' ? 'bg-green-50 text-green-700 border-green-200' : 
          serverStatus === 'offline' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-slate-50 text-slate-600 border-slate-200'
        }`}>
          {serverStatus === 'online' ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
          <span>
            {serverStatus === 'online' ? '后端引擎就绪' : 
             serverStatus === 'offline' ? '使用本地演示模式' : '连接中...'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FileUpload label="淘宝订单 (.xlsx/.csv)" onFileSelect={setTbFile} accept=".csv,.xlsx,.xls" />
        <FileUpload label="京东订单 (.xlsx/.csv)" onFileSelect={setJdFile} accept=".csv,.xlsx,.xls" />
        <FileUpload label="银行/支付宝流水 (.xlsx/.csv)" onFileSelect={setBankFile} accept=".csv,.xlsx,.xls" />
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-8 flex flex-col items-center justify-center text-center gap-6">
        <div className="max-w-md">
          <h3 className="text-xl font-bold text-slate-800 mb-2">一键智能对账</h3>
          <p className="text-slate-500">
            {isProcessing 
              ? "正在进行：格式转换 -> 字段映射 -> 自动勾稽 -> 异常识别..." 
              : "无需手动整理表格，直接上传原始文件。系统会自动识别列名并完成核对。"}
          </p>
        </div>
        
        <button
          onClick={handleProcess}
          disabled={isProcessing}
          className={`
            w-full max-w-sm flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-bold text-lg shadow-xl transition-all
            ${isProcessing
                ? 'bg-indigo-400 text-white cursor-wait translate-y-0'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-2xl hover:-translate-y-1'
            }
          `}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" /> 正在处理...
            </>
          ) : (
            <>
              <Play className="w-6 h-6 fill-current" /> 开始处理
            </>
          )}
        </button>
        
        {!isProcessing && (
          <div className="text-center space-y-3">
            <p className="text-xs text-slate-400">
              💡 提示：如果没有文件，直接点击按钮也可体验全功能演示。
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-xl mx-auto">
              <h4 className="text-sm font-semibold text-blue-900 mb-2">📋 关于对账状态：</h4>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• <strong>对账正常</strong>：订单金额与银行流水一致</li>
                <li>• <strong>金额异常</strong>：有流水但金额不匹配（可能是手续费、退款等）</li>
                <li>• <strong>缺少流水</strong>：订单存在但在银行流水中找不到对应记录</li>
              </ul>
              <p className="text-xs text-blue-600 mt-2">
                💡 若要看到"对账正常"，需同时上传<strong>订单文件</strong>和<strong>银行流水文件</strong>，且流水中的订单号与订单一致。
              </p>
            </div>
          </div>
        )}
      </div>

      {importStats && (
        <div className="mt-8 bg-green-50 rounded-xl border border-green-100 p-6 flex items-center gap-4 animate-fade-in">
           <CheckCircle2 className="w-8 h-8 text-green-600" />
           <div>
             <h4 className="font-bold text-green-900">上一次处理完成</h4>
             <p className="text-sm text-green-700">导入 {importStats.taobao + importStats.jd} 条订单，{importStats.flow} 条流水。请点击左侧菜单查看详情。</p>
           </div>
        </div>
      )}
    </div>
  );
};