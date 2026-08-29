import React from 'react';
import { Loader2, Scan, CheckCircle2 } from 'lucide-react';

const LoadingState = ({
  message = 'AI-Assisted Assessment in Progress',
  subtext = 'Processing packaged commodity panel images.',
  steps = []
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center">
          <Scan className="w-8 h-8 text-indigo-400 animate-pulse" />
        </div>
      </div>

      <h3 className="text-lg font-bold text-white mb-1">{message}</h3>
      <p className="text-xs text-slate-400 max-w-sm mb-6">{subtext}</p>

      {steps.length > 0 && (
        <div className="w-full max-w-md space-y-2.5 bg-slate-900 border border-slate-800 rounded-xl p-4 text-left">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center justify-between text-xs py-1">
              <div className="flex items-center space-x-2.5">
                {step.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : step.active ? (
                  <Loader2 className="w-4 h-4 text-indigo-400 animate-spin shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
                    {idx + 1}
                  </div>
                )}
                <span
                  className={
                    step.active
                      ? 'text-indigo-300 font-bold'
                      : step.completed
                      ? 'text-slate-200 font-medium'
                      : 'text-slate-500'
                  }
                >
                  {step.label}
                </span>
              </div>
              <span className="text-[11px] font-mono text-slate-400">{step.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LoadingState;
