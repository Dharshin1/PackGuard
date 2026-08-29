import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

const OcrPanel = ({ rawText, detectedFields = [] }) => {
  const [expanded, setExpanded] = useState(true);
  const [copied, setCopied] = useState(false);

  const sampleRawText = rawText || `
[PRINCIPAL DISPLAY PANEL OCR STREAM]
BRAND: NUTRIPURE FOODS INDIA PVT LTD
PRODUCT: ORGANIC ALMOND MILK
NET QUANTITY: 1 Litre (1000 ml)
MAXIMUM RETAIL PRICE (MRP): RS. 240.00 INCL. OF ALL TAXES
MFG DATE: 07/2026
BATCH NO: NP-8801-A
ADDRESS: PLOT 45, FOOD PARK, PHASE-3, RAI, HARYANA - 131029
CONSUMER CARE: 1800-11-9988 | CARE@NUTRIPURE.IN
COUNTRY OF ORIGIN: INDIA
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleRawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div
        onClick={() => setExpanded(!expanded)}
        className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between cursor-pointer select-none"
      >
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-indigo-400" />
          <h3 className="text-sm font-bold text-white">Raw OCR Text Stream</h3>
          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            Tesseract OCR Engine
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
            className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-medium flex items-center space-x-1 transition-colors"
            title="Copy OCR text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
          </button>
          {expanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
        </div>
      </div>

      {expanded && (
        <div className="p-4 space-y-3 bg-slate-950/60">
          <pre className="text-[11px] font-mono text-slate-300 leading-relaxed overflow-x-auto p-3 bg-slate-950 rounded-lg border border-slate-800 whitespace-pre-wrap">
            {sampleRawText}
          </pre>

          {detectedFields.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-1">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mr-1 self-center">
                Detected Tokens:
              </span>
              {detectedFields.map((field, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-slate-800 text-indigo-300 border border-slate-700"
                >
                  {field}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default OcrPanel;
