import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, FileText, Edit2, Check, X } from 'lucide-react';

const DeclarationCard = ({ declarations = [], onUpdateDeclarations }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [items, setItems] = useState(declarations);

  // Sync state if prop changes
  React.useEffect(() => {
    setItems(declarations);
  }, [declarations]);

  if (!items || items.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center text-xs text-slate-500">
        No declaration metrics available.
      </div>
    );
  }

  const handleStartEdit = (idx, currentValue) => {
    setEditingIndex(idx);
    setEditValue(currentValue.includes('Not detected') ? '' : currentValue);
  };

  const handleSaveEdit = (idx) => {
    const updated = [...items];
    const item = { ...updated[idx] };
    item.detectedValue = editValue.trim() || 'Not detected in uploaded image';
    item.status = editValue.trim() ? 'Detected' : 'Not Detected';
    item.isCompliant = editValue.trim().length > 0;
    item.confidence = 1.0; // Manual inspector verification confidence
    updated[idx] = item;

    setItems(updated);
    setEditingIndex(null);

    if (onUpdateDeclarations) {
      onUpdateDeclarations(updated);
    }
  };

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
              <th className="py-3 px-4">Extracted Value (Editable)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Rule Reference</th>
              <th className="py-3 px-4 text-right">Confidence</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {items.map((item, idx) => {
              const isNotDetected =
                item.status === 'Not Detected' ||
                item.detectedValue?.toLowerCase().includes('not detected');

              const displayValue = isNotDetected
                ? 'Not detected in uploaded image'
                : item.detectedValue;

              const isEditing = editingIndex === idx;

              return (
                <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                  {/* Declaration */}
                  <td className="py-3.5 px-4 font-bold text-slate-200">
                    {item.field}
                  </td>

                  {/* Extracted Value */}
                  <td className="py-3.5 px-4 font-mono">
                    {isEditing ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="bg-slate-950 border border-indigo-500 rounded px-2 py-1 text-xs text-white focus:outline-none w-full"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveEdit(idx)}
                          className="p-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white"
                          title="Save override"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditingIndex(null)}
                          className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 group">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-xs ${
                            isNotDetected
                              ? 'text-amber-400/90 italic bg-amber-500/10 border border-amber-500/20'
                              : 'text-slate-100 bg-slate-950 border border-slate-800 font-medium'
                          }`}
                        >
                          {displayValue}
                        </span>
                        <button
                          onClick={() => handleStartEdit(idx, item.detectedValue)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-indigo-400 transition-opacity"
                          title="Edit extracted value"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
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
