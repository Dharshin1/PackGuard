import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';

/**
 * StatusBadge — STYLING ONLY.
 * Props, status values, conditions, and business logic are unchanged.
 */
const StatusBadge = ({ status, showIcon = true, className = '' }) => {
  let badgeClass = '';
  let icon = null;
  let text = status || 'Requires Review';

  switch (status) {
    case 'Compliant':
      badgeClass = 'pg-badge pg-badge-compliant';
      icon = <CheckCircle2 style={{ width: '11px', height: '11px' }} />;
      break;
    case 'Requires Inspector Review':
    case 'Requires Review':
      badgeClass = 'pg-badge pg-badge-review';
      icon = <AlertTriangle style={{ width: '11px', height: '11px' }} />;
      text = 'Requires Inspector Review';
      break;
    case 'Potential Non-Compliance':
      badgeClass = 'pg-badge pg-badge-fail';
      icon = <ShieldAlert style={{ width: '11px', height: '11px' }} />;
      text = 'Potential Non-Compliance';
      break;
    default:
      badgeClass = 'pg-badge pg-badge-neutral';
      icon = null;
  }

  return (
    <span className={`${badgeClass} ${className}`}>
      {showIcon && icon}
      {text}
    </span>
  );
};

export default StatusBadge;
