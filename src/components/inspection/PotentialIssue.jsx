import React from 'react';
import { AlertTriangle, Image as ImageIcon, HelpCircle, ShieldAlert, Award } from 'lucide-react';

const PotentialIssue = ({ issues = [], onSelectEvidence }) => {
  if (!issues || issues.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center text-xs text-slate-400">
        No potential non-compliance flags identified. Package meets detected Legal Metrology rule checks.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg space-y-0">
      <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-bold text-white">Identified Non-Compliance & Flagged Issues</h3>
        </div>
        <span className="text-xs font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
          {issues.length} Issue{issues.length > 1 ? 's' : ''} Identified
        </span>
      </div>

      <div className="p-4 space-y-4">
        {issues.map((issue, idx) => (
          <div
            key={issue.id || idx}
            className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3.5"
          >
            {/* Header: Title & Priority */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider block mb-0.5">
                  POTENTIAL ISSUE
                </span>
                <h4 className="text-xs font-bold text-slate-100">{issue.title}</h4>
                {issue.ruleReference && (
                  <p className="text-[10px] font-mono text-indigo-400 mt-0.5">
                    Statutory Ref: {issue.ruleReference}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                {issue.confidence && (
                  <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Conf: {(issue.confidence * 100).toFixed(0)}%
                  </span>
                )}
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                    issue.severity === 'High'
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {issue.severity || 'Medium'} Flag
                </span>
              </div>
            </div>

            {/* What Was Detected */}
            {issue.detected && (
              <div className="text-xs text-slate-300">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">
                  What Was Detected
                </span>
                <span className="font-mono text-slate-200 bg-slate-900 px-2 py-1 rounded border border-slate-800 inline-block">
                  {issue.detected}
                </span>
              </div>
            )}

            {/* Why Flagged / Reason */}
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center">
                <HelpCircle className="w-3 h-3 text-indigo-400 mr-1" /> Why Non-Compliant / Flagged
              </span>
              <p className="text-xs text-slate-300 bg-slate-900 p-3 rounded-lg border border-slate-800 leading-relaxed">
                {issue.reason || issue.explanation || 'Rule requirement evaluation pending.'}
              </p>
            </div>

            {/* Image Evidence / Cropped Region */}
            <div className="space-y-1 pt-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center">
                <ImageIcon className="w-3 h-3 text-indigo-400 mr-1" /> Image Evidence
              </span>

              {issue.evidenceImageUrl ? (
                <div className="flex items-center justify-between bg-slate-900 p-2.5 rounded-lg border border-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded overflow-hidden bg-slate-950 border border-slate-700 shrink-0">
                      <img
                        src={issue.evidenceImageUrl}
                        alt="Evidence Crop"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-200">
                        {issue.cropRegion || 'Package Label Region'}
                      </p>
                      <p className="text-[10px] text-slate-500">OCR Bounding Box Region</p>
                    </div>
                  </div>

                  {onSelectEvidence && (
                    <button
                      type="button"
                      onClick={() => onSelectEvidence(issue)}
                      className="px-2.5 py-1 rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 text-[11px] hover:bg-indigo-600/40 transition-colors"
                    >
                      View Evidence
                    </button>
                  )}
                </div>
              ) : (
                <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-500 italic">
                  Evidence not available.
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PotentialIssue;
