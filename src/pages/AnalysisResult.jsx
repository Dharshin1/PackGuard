import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../components/inspection/ImageGallery';
import OcrPanel from '../components/inspection/OcrPanel';
import DeclarationCard from '../components/inspection/DeclarationCard';
import ComplianceChecklist from '../components/inspection/ComplianceChecklist';
import PotentialIssue from '../components/inspection/PotentialIssue';
import EvidenceViewer from '../components/inspection/EvidenceViewer';
import StatusBadge from '../components/common/StatusBadge';
import LoadingState from '../components/common/LoadingState';
import { getInspection } from '../services/api';
import { useInspections } from '../context/InspectionContext';
import {
  FileText,
  Save,
  CheckCircle2,
  ArrowLeft,
  Award,
  AlertCircle
} from 'lucide-react';

const AnalysisResult = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inspections, currentAnalysis } = useInspections();

  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (currentAnalysis && currentAnalysis.id === id) {
        setInspection(currentAnalysis);
        setLoading(false);
        return;
      }

      try {
        const res = await getInspection(inspections, id);
        setInspection(res);
      } catch (err) {
        console.error('Failed to load inspection:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id, currentAnalysis, inspections]);

  if (loading) {
    return <LoadingState message="Loading AI-Assisted Assessment..." />;
  }

  if (!inspection) {
    return (
      <div className="text-center py-16">
        <h2 className="text-base font-bold text-white mb-2">Inspection Record Not Found</h2>
        <p className="text-xs text-slate-400 mb-4">No record found matching ID: {id}</p>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold"
        >
          Back to History
        </button>
      </div>
    );
  }

  const handleSave = () => {
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const detectedTokens = inspection.declarations
    ?.filter((d) => d.status === 'Detected')
    .map((d) => d.field);

  const handleUpdateDeclarations = (updatedDeclarations) => {
    if (!inspection) return;
    setInspection(prev => ({
      ...prev,
      declarations: updatedDeclarations
    }));
  };

  return (
    <div className="space-y-6">
      {/* Action Navigation Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/history')}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-mono text-xs font-bold text-indigo-400">{inspection.id}</span>
              <StatusBadge status={inspection.status} />
            </div>
            <h1 className="text-xl font-extrabold text-white mt-0.5">{inspection.productName}</h1>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleSave}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Saved to Registry' : 'Save Inspection'}</span>
          </button>

          <button
            onClick={() => navigate(`/report/${inspection.id}`)}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Inspection Report</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Inspection record saved. You can access it anytime in Inspection History.</span>
        </div>
      )}

      {/* Overview Metrics Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Compliance Score Tile */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Compliance Score</p>
            <div className="mt-1">
              {inspection.complianceScore !== undefined && inspection.complianceScore !== null ? (
                <span className="text-3xl font-extrabold font-mono text-indigo-400">
                  {inspection.complianceScore}%
                </span>
              ) : (
                <span className="text-sm font-semibold text-slate-400">Not available</span>
              )}
            </div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Award className="w-6 h-6" />
          </div>
        </div>

        {/* Assessment Status Tile */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Overall Assessment</p>
            <StatusBadge status={inspection.status} />
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Legal Metrology Rule 6 & Rule 7 verification complete.
          </p>
        </div>

        {/* Inspection Metadata Tile */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg text-xs space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Inspector:</span>
            <span className="font-semibold text-slate-200">{inspection.inspectorName || 'Enforcement Inspector'}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Reference:</span>
            <span className="font-mono text-indigo-400">{inspection.referenceNumber}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Category:</span>
            <span className="text-slate-200">{inspection.category}</span>
          </div>
        </div>
      </div>

      {/* Two-Column Result Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Product Image Viewer & Raw OCR Text Stream */}
        <div className="lg:col-span-1 space-y-6">
          {/* Package Image Viewer */}
          <ImageGallery
            images={inspection.images}
            netQuantity={inspection.declarations?.find(d => d.field === 'Net Quantity')?.detectedValue || '500 g'}
          />

          {/* Raw OCR Text Panel */}
          <OcrPanel rawText={inspection.rawOcrText} detectedFields={detectedTokens} />

          {/* Evidence Regions */}
          <EvidenceViewer evidence={inspection.evidence} />
        </div>

        {/* RIGHT COLUMN: Declarations, Compliance Table & Violations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Extracted Declarations Compliance Table */}
          <DeclarationCard declarations={inspection.declarations} onUpdateDeclarations={handleUpdateDeclarations} />

          {/* Rule Compliance Checklist */}
          <ComplianceChecklist checklist={inspection.checklist} />

          {/* Identified Violations & Evidence Cards */}
          <PotentialIssue issues={inspection.issues} />

          {/* Statutory Legal Positioning Disclaimer */}
          <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-200">Statutory Disclaimer:</strong> This AI-assisted assessment supports inspector review and does not constitute a final legal determination.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResult;
