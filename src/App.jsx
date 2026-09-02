import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { InspectionProvider } from './context/InspectionContext';
import PageContainer from './components/layout/PageContainer';

import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import NewInspection from './pages/NewInspection';
import AnalysisResult from './pages/AnalysisResult';
import InspectionHistory from './pages/InspectionHistory';
import InspectionDetails from './pages/InspectionDetails';
import ReportPreview from './pages/ReportPreview';
import ReportsList from './pages/ReportsList';

/**
 * AppLayout — wraps all internal app routes in the shared
 * PageContainer (Sidebar + Header). Landing page is excluded.
 */
const AppLayout = () => (
  <PageContainer>
    <Outlet />
  </PageContainer>
);

function App() {
  return (
    <InspectionProvider>
      <Router>
        <Routes>
          {/* Landing page — no sidebar/header */}
          <Route path="/" element={<Landing />} />

          {/* Internal app routes — wrapped in PageContainer */}
          <Route element={<AppLayout />}>
            <Route path="/hub"                  element={<Dashboard />} />
            <Route path="/new-inspection"        element={<NewInspection />} />
            <Route path="/analysis-result/:id"   element={<AnalysisResult />} />
            <Route path="/history"               element={<InspectionHistory />} />
            <Route path="/inspection/:id"        element={<InspectionDetails />} />
            <Route path="/report/:id"            element={<ReportPreview />} />
            <Route path="/reports"               element={<ReportsList />} />
          </Route>
        </Routes>
      </Router>
    </InspectionProvider>
  );
}

export default App;
