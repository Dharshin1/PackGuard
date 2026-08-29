import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { Eye, FileText, Calendar } from 'lucide-react';

const InspectionTable = ({ inspections = [] }) => {
  const navigate = useNavigate();

  if (!inspections || inspections.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs bg-slate-900/60 rounded-xl border border-slate-800">
        No inspections found matching criteria.
      </div>
    );
  }

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/90 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
              <th className="py-3.5 px-4">Inspection ID</th>
              <th className="py-3.5 px-4">Product / Category</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Assessment Status</th>
              <th className="py-3.5 px-4 text-center">Violations</th>
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {inspections.map((item) => {
              const violationCount = item.issues?.length || 0;

              return (
                <tr
                  key={item.id}
                  className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                  onClick={() => navigate(`/inspection/${item.id}`)}
                >
                  {/* Inspection ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-indigo-400">
                    {item.id}
                  </td>

                  {/* Product & Category */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {item.productName}
                    </div>
                    <div className="text-[10px] text-slate-500">{item.category}</div>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-300">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-400">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>{formatDate(item.date)}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={item.status} />
                  </td>

                  {/* Violations Count */}
                  <td className="py-3.5 px-4 text-center">
                    {violationCount > 0 ? (
                      <span className="font-mono text-xs font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {violationCount} Flag{violationCount > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        0 Flags
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => navigate(`/inspection/${item.id}`)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                        title="View Inspection"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/report/${item.id}`)}
                        className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition-colors"
                        title="Generate Report"
                      >
                        <FileText className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InspectionTable;
