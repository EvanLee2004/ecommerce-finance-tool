import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ImportPage } from './pages/ImportPage';
import { ReconciliationPage } from './pages/ReconciliationPage';
import { DashboardPage } from './pages/DashboardPage';
import { FinanceProvider } from './context/FinanceContext';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('import');

  const renderContent = () => {
    switch (activeTab) {
      case 'import':
        return <ImportPage onNavigate={setActiveTab} />;
      case 'recon':
        return <ReconciliationPage />;
      case 'dashboard':
        return <DashboardPage />;
      default:
        return <ImportPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <FinanceProvider>
      <div className="flex min-h-screen bg-slate-50">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-64 p-8 transition-all duration-300">
          <div className="max-w-7xl mx-auto h-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </FinanceProvider>
  );
};

export default App;