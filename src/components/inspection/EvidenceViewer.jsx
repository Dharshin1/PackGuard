import React from 'react';
import { Camera, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';

const EvidenceViewer = ({ evidence = [], title = 'Visual Evidence Artifacts' }) => {
  if (!evidence || evidence.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-center text-xs text-slate-500">
        No specific visual evidence artifacts uploaded.
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <div className="px-5 py-4 bg-slate-950 border-b border-slate-800 flex items-center space-x-2">
        <Camera className="w-4 h-4 text-indigo-400" />
        <h3 className="text-sm font-bold text-white">{title}</h3>
      </div>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {evidence.map((item, idx) => (
          <div key={item.id || idx} className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden group">
            <div className="relative aspect-video bg-slate-900 overflow-hidden">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-2 left-2 right-2 text-white">
                <p className="text-xs font-bold truncate">{item.title}</p>
              </div>
            </div>
            <div className="p-3">
              <p className="text-[11px] text-slate-400 leading-normal">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvidenceViewer;
