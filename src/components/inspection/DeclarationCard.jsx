import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, FileText, Image as ImageIcon } from 'lucide-react';

const DeclarationCard = ({ declarations = [] }) => {
  if (!declarations || declarations.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center text-xs text-slate-500">
        No declaration metrics available.
      </div>
    );
  }

  const renderStatusBadge = (item) => {
    const isNotDetected =
      item.status === 'Not Detected' ||
      item.detectedValue?.toLowerCase().includes('not detected');

    if (isNotDetected) {
      return (
        <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          — NOT DETECTED
        </span>
      );
    }

    if (item.status === 'Detected' && item.isCompliant !== false) {
      return (
        <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3 mr-1" /> ✓ PASS
        </span>
      );
    }

    if (item.isCompliant === false && item.status !== 'Requires Review') {
      return (
        <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3 h-3 mr-1" /> ✕ VIOLATION
        </span>
      );
    }

    return (
      <span className="inline-flex items-center text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
        <AlertTriangle className="w-3 h-3 mr-1" /> ⚠ REVIEW
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Legal Metrology Compliance Check Table</h3>
        </div>
        <span className="text-[11px] text-slate-400 font-mono">PCR 2011 Mandatory Rules</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/80 text-slate-400 text-[10px] font-bold uppercase tracking-wider border-b border-slate-800">
              <th className="py-3 px-4">Declaration Field</th>
              <th className="py-3 px-4">Extracted Value</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Rule Reference</th>
              <th className="py-3 px-4 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {declarations.map((item, idx) => {
              const isNotDetected =
                item.status === 'Not Detected' ||
                item.detectedValue?.toLowerCase().includes('not detected');

              const displayValue = isNotDetected
                ? 'Not detected in uploaded image'
                : item.detectedValue;

              return (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  {/* Declaration */}
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    {item.field}
                  </td>

                  {/* Extracted Value */}
                  <td className="py-3.5 px-4 font-mono">
                    <span
                      className={`inline-block px-2.5 py-1 rounded text-xs ${
                        isNotDetected
                          ? 'text-amber-400/90 italic bg-amber-500/10 border border-amber-500/20'
                          : 'text-slate-100 bg-slate-950 border border-slate-800 font-medium'
                      }`}
                    >
                      {displayValue}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4">
                    {renderStatusBadge(item)}
                  </td>

                  {/* Rule Reference */}
                  <td className="py-3.5 px-4 font-mono text-indigo-400 text-[11px]">
                    {item.ruleRef || 'Rule 6'}
                  </td>

                  {/* Confidence Score */}
                  <td className="py-3.5 px-4 text-right font-mono text-slate-400 text-xs">
                    {item.confidence !== undefined && item.confidence !== null && item.confidence > 0 ? (
                      <span className="font-bold text-slate-300">{(item.confidence * 100).toFixed(0)}%</span>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
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

export default DeclarationCard;
