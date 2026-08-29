import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  title = 'No inspections recorded yet',
  description = 'Start your first inspection by uploading a packaged commodity image.',
  icon: Icon = Inbox,
  actionButton
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-slate-900/60 border border-dashed border-slate-800 rounded-xl my-4">
      <div className="p-4 rounded-full bg-slate-800 border border-slate-700/80 text-slate-400 mb-3">
        <Icon className="w-7 h-7 text-indigo-400" />
      </div>
      <h4 className="text-base font-bold text-white mb-1">{title}</h4>
      <p className="text-xs text-slate-400 max-w-md mb-5 leading-relaxed">{description}</p>
      {actionButton && actionButton}
    </div>
  );
};

export default EmptyState;
