import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../components/dashboard/StatCard';
import InspectionTable from '../components/inspection/InspectionTable';
import EmptyState from '../components/common/EmptyState';
import { useInspections } from '../context/InspectionContext';
import {
  FileCheck2,
  AlertTriangle,
  FileText,
  Plus,
  Sparkles,
  History
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { inspections, loadDemoPresets } = useInspections();

  // Dynamic metrics from real data
  const totalInspections = inspections.length;
  const requiresReviewCount = inspections.filter(
    (i) => i.status === 'Requires Inspector Review' || i.status === 'Requires Review'
  ).length;
  const reportsGeneratedCount = inspections.length;

  return (
    <div className="space-y-6">
      {/* Header & Hero Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            PackSure AI Enforcement Hub
          </h1>
          <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
            AI-assisted declaration extraction and rule-based compliance assessment for packaged commodities.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">


          <button
            onClick={() => navigate('/new-inspection')}
            className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-xs shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>+ New Product Inspection</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Overview
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard
            title="Total Inspections"
            value={totalInspections || '—'}
            icon={FileCheck2}
            color="indigo"
          />
          <StatCard
            title="Requires Review"
            value={requiresReviewCount || '—'}
            icon={AlertTriangle}
            color="amber"
          />
          <StatCard
            title="Reports Generated"
            value={reportsGeneratedCount || '—'}
            icon={FileText}
            color="emerald"
          />
        </div>
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-300">Quick Actions:</span>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => navigate('/new-inspection')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/20 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-indigo-400" />
            <span>New Inspection</span>
          </button>

          <button
            onClick={() => navigate('/history')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/20 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <History className="w-3.5 h-3.5 text-indigo-400" />
            <span>Inspection History</span>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/20 text-slate-200 border border-slate-700 text-xs font-medium transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>Reports</span>
          </button>
        </div>
      </div>

      {/* Recent Inspections Table or Intentional Empty State */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Recent Inspections</h3>
          {totalInspections > 0 && (
            <button
              onClick={() => navigate('/history')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              View All History →
            </button>
          )}
        </div>

        {totalInspections > 0 ? (
          <InspectionTable inspections={inspections.slice(0, 5)} />
        ) : (
          <EmptyState
            title="No inspections have been recorded yet."
            description="Start your first inspection by uploading a packaged commodity image."
            actionButton={
              <button
                onClick={() => navigate('/new-inspection')}
                className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Start Inspection</span>
              </button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
