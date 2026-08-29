import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspections } from '../context/InspectionContext';
import StatusBadge from '../components/common/StatusBadge';
import EmptyState from '../components/common/EmptyState';
import { Printer, Calendar, ArrowRight, FileCheck, Download, Eye } from 'lucide-react';

const ReportsList = () => {
  const navigate = useNavigate();
  const { inspections } = useInspections();

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white">Inspection Reports</h1>
        <p className="text-xs text-slate-400 mt-1">
          Official compliance certificates and inspection reports compiled from assessments.
        </p>
      </div>

      {inspections.length === 0 ? (
        <EmptyState
          title="No reports generated yet."
          description="Reports will appear after an inspection is completed."
          icon={FileCheck}
          actionButton={
            <button
              onClick={() => navigate('/history')}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-colors"
            >
              <span>View Inspections</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          }
        />
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-950/90 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
                  <th className="py-3.5 px-4">Inspection ID</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Generated Date</th>
                  <th className="py-3.5 px-4">Assessment Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {inspections.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                      REP-{item.id}
                    </td>

                    {/* Product */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-100">{item.productName}</div>
                      <div className="text-[10px] text-slate-500">{item.category}</div>
                    </td>

                    {/* Generated Date */}
                    <td className="py-3.5 px-4 text-slate-300">
                      <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        <span>{new Date(item.date).toLocaleDateString('en-IN')}</span>
                      </div>
                    </td>

                    {/* Assessment */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Actions: View / Download */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => navigate(`/report/${item.id}`)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
                          title="View Certificate"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <button
                          onClick={() => navigate(`/report/${item.id}`)}
                          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-colors"
                          title="Download Report"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsList;
