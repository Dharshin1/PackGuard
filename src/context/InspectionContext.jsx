import React, { createContext, useContext, useState } from 'react';
import { INITIAL_INSPECTIONS, DEMO_PRODUCTS } from '../data/mockData';

const InspectionContext = createContext();

export const InspectionProvider = ({ children }) => {
  // Start with empty dataset by default as required by real backend architecture
  const [inspections, setInspections] = useState(INITIAL_INSPECTIONS);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);

  const addInspection = (newInspection) => {
    setInspections((prev) => [newInspection, ...prev]);
    setCurrentAnalysis(newInspection);
  };

  const updateInspectionStatus = (id, newStatus, notes) => {
    setInspections((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: newStatus, summaryNotes: notes || item.summaryNotes }
          : item
      )
    );
    if (currentAnalysis && currentAnalysis.id === id) {
      setCurrentAnalysis((prev) => ({
        ...prev,
        status: newStatus,
        summaryNotes: notes || prev.summaryNotes,
      }));
    }
  };

  const getInspectionById = (id) => {
    return inspections.find((item) => item.id === id) || null;
  };

  const clearInspections = () => {
    setInspections([]);
    setCurrentAnalysis(null);
  };

  const loadDemoPresets = () => {
    setInspections(DEMO_PRODUCTS);
  };

  return (
    <InspectionContext.Provider
      value={{
        inspections,
        currentAnalysis,
        setCurrentAnalysis,
        addInspection,
        updateInspectionStatus,
        getInspectionById,
        clearInspections,
        loadDemoPresets
      }}
    >
      {children}
    </InspectionContext.Provider>
  );
};

export const useInspections = () => {
  const context = useContext(InspectionContext);
  if (!context) {
    throw new Error('useInspections must be used within an InspectionProvider');
  }
  return context;
};
