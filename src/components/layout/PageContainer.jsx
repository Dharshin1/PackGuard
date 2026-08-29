import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const PageContainer = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Layout */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Content */}
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageContainer;
