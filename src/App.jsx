import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { InspectionProvider } from './context/InspectionContext';
import PageContainer from './components/layout/PageContainer';

import Dashboard from './pages/Dashboard';
import NewInspection from './pages/NewInspection';
import AnalysisResult from './pages/AnalysisResult';
import InspectionHistory from './pages/InspectionHistory';
import InspectionDetails from './pages/InspectionDetails';
import ReportPreview from './pages/ReportPreview';
import ReportsList from './pages/ReportsList';

function App() {
  return (
    <InspectionProvider>
      <Router>
        <PageContainer>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new-inspection" element={<NewInspection />} />
            <Route path="/analysis-result/:id" element={<AnalysisResult />} />
            <Route path="/history" element={<InspectionHistory />} />
            <Route path="/inspection/:id" element={<InspectionDetails />} />
            <Route path="/report/:id" element={<ReportPreview />} />
            <Route path="/reports" element={<ReportsList />} />
          </Routes>
        </PageContainer>
      </Router>
    </InspectionProvider>
  );
}

export default App;
