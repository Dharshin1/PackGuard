import React from 'react';
import { CheckCircle2, XCircle, AlertCircle, ShieldCheck } from 'lucide-react';

const ComplianceChecklist = ({ checklist = [] }) => {
  if (!checklist || checklist.length === 0) return null;

  const passed = checklist.filter((c) => c.compliant === true).length;
  const total = checklist.length;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Rule Compliance Checklist</h3>
        </div>
        <span className="text-xs font-mono font-semibold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
          {passed}/{total} Passed
        </span>
      </div>

      <div className="p-4 space-y-2.5">
        {checklist.map((check, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg border flex items-start space-x-3 transition-colors ${
              check.compliant
                ? 'bg-slate-800/40 border-slate-800 text-slate-200'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-200'
            }`}
          >
            {check.compliant ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-xs font-medium leading-snug">{check.item}</p>
            </div>
            <span
              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                check.compliant
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {check.compliant ? 'PASSED' : 'NON-COMPLIANT'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplianceChecklist;
