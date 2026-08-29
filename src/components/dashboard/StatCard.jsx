import React from 'react';

const StatCard = ({ title, value, icon: Icon, color = 'indigo' }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
  };

  const currentStyle = colorMap[color] || colorMap.indigo;
  const displayValue = (value !== undefined && value !== null && value !== 0 && value !== '0') ? value : '—';

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-extrabold text-white mt-1.5 tracking-tight font-mono">
          {displayValue}
        </p>
      </div>

      {Icon && (
        <div className={`p-3 rounded-xl border ${currentStyle}`}>
          <Icon className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};

export default StatCard;
