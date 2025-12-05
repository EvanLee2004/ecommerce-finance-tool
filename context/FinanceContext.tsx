import React, { createContext, useContext, useState, ReactNode } from 'react';
import { OrderRecord, DashboardMetrics } from '../types';

interface FinanceContextType {
  records: OrderRecord[];
  metrics: DashboardMetrics | null;
  setRecords: (records: OrderRecord[]) => void;
  setMetrics: (metrics: DashboardMetrics) => void;
  isProcessing: boolean;
  setIsProcessing: (isProcessing: boolean) => void;
  importStats: { taobao: number; jd: number; flow: number } | null;
  setImportStats: (stats: { taobao: number; jd: number; flow: number }) => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [records, setRecords] = useState<OrderRecord[]>([]);
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importStats, setImportStats] = useState<{ taobao: number; jd: number; flow: number } | null>(null);

  return (
    <FinanceContext.Provider value={{ 
      records, 
      metrics,
      setRecords, 
      setMetrics,
      isProcessing, 
      setIsProcessing,
      importStats,
      setImportStats
    }}>
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
