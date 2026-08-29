import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ImageGallery from '../components/inspection/ImageGallery';
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
  ArrowLeft,
  MapPin,
  UserCheck,
  Clock,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const InspectionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inspections, getInspectionById, updateInspectionStatus } = useInspections();

  const [inspection, setInspection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [overrideStatus, setOverrideStatus] = useState('');
  const [overrideNotes, setOverrideNotes] = useState('');

  useEffect(() => {
    const fetchRecord = async () => {
      const fromContext = getInspectionById(id);
      if (fromContext) {
        setInspection(fromContext);
        setOverrideStatus(fromContext.status);
        setOverrideNotes(fromContext.summaryNotes || '');
        setLoading(false);
        return;
      }

      try {
        const res = await getInspection(inspections, id);
        setInspection(res);
        setOverrideStatus(res.status);
        setOverrideNotes(res.summaryNotes || '');
      } catch (err) {
        console.error('Failed to fetch inspection details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id, inspections, getInspectionById]);

  const handleStatusUpdate = () => {
    if (overrideStatus && inspection) {
      updateInspectionStatus(inspection.id, overrideStatus, overrideNotes);
      setInspection((prev) => ({
        ...prev,
        status: overrideStatus,
        summaryNotes: overrideNotes,
      }));
      alert('Inspector enforcement decision updated successfully.');
    }
  };

  if (loading) {
    return <LoadingState message="Loading Inspection Details..." />;
  }

  if (!inspection) {
    return (
      <div className="py-16 text-center">
        <h2 className="text-base font-bold text-white mb-2">Inspection Case Not Found</h2>
        <button
          onClick={() => navigate('/history')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs"
        >
          Back to History
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Navigation Header */}
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

        <button
          onClick={() => navigate(`/report/${inspection.id}`)}
          className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-md transition-all shrink-0"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Official Report</span>
        </button>
      </div>

      {/* Case Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Inspector Officer</p>
            <p className="text-xs font-bold text-slate-100">{inspection.inspectorName || 'Enforcement Inspector'}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Timestamp</p>
            <p className="text-xs font-bold text-slate-100">
              {new Date(inspection.date).toLocaleDateString('en-IN')}
            </p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Facility Location</p>
            <p className="text-xs font-bold text-slate-100 truncate max-w-[150px]">{inspection.location}</p>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center space-x-3">
          <div className="p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400">Compliance Score</p>
            <p className="text-xl font-extrabold font-mono text-white">
              {inspection.complianceScore ? `${inspection.complianceScore}%` : 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <ImageGallery images={inspection.images} />
          <EvidenceViewer evidence={inspection.evidence} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          <DeclarationCard declarations={inspection.declarations} />
          <ComplianceChecklist checklist={inspection.checklist} />
          <PotentialIssue issues={inspection.issues} />

          {/* Inspector Review & Decision Override */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
              <AlertCircle className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Inspector Review & Decision Override</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Enforcement Status Decision
                </label>
                <select
                  value={overrideStatus}
                  onChange={(e) => setOverrideStatus(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Compliant">Compliant</option>
                  <option value="Requires Inspector Review">Requires Inspector Review</option>
                  <option value="Potential Non-Compliance">Potential Non-Compliance</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Officer Remarks / Action Notes
                </label>
                <input
                  type="text"
                  value={overrideNotes}
                  onChange={(e) => setOverrideNotes(e.target.value)}
                  placeholder="Enter remarks or legal notice references..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleStatusUpdate}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md transition-colors"
              >
                Update Official Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectionDetails;
