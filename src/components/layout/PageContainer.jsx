import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const PageContainer = ({ children }) => {
  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      backgroundColor: 'var(--pg-bg)',
      color: 'var(--pg-text-primary)',
    }}>
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Layout */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Content */}
        <main
          data-pg-main
          style={{
            flex: 1,
            padding: '24px 32px',
            overflowY: 'auto',
            maxWidth: '1350px',
            width: '100%',
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default PageContainer;
