import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

const StatusBadge = ({ status, showIcon = true, className = '' }) => {
  let badgeStyle = '';
  let icon = null;
  let text = status || 'Requires Review';

  switch (status) {
    case 'Compliant':
      badgeStyle = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      icon = <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />;
      break;
    case 'Requires Inspector Review':
    case 'Requires Review':
      badgeStyle = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      icon = <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-400" />;
      text = 'Requires Inspector Review';
      break;
    case 'Potential Non-Compliance':
      badgeStyle = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      icon = <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-rose-400" />;
      text = 'Potential Non-Compliance';
      break;
    default:
      badgeStyle = 'bg-slate-800 text-slate-400 border-slate-700';
      icon = null;
  }

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold border tracking-wide ${badgeStyle} ${className}`}
    >
      {showIcon && icon}
      {text}
    </span>
  );
};

export default StatusBadge;
