import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ShieldCheck, LogOut, CheckCircle2, Shield } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();

  // Role state for prototype demonstration (INSPECTOR / ADMIN)
  const [role, setRole] = useState('INSPECTOR');
  const [loggedOut, setLoggedOut] = useState(false);

  const handleLogout = () => {
    setLoggedOut(true);
    setTimeout(() => {
      setLoggedOut(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto pb-12">
      {/* Page Title */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-xl font-bold text-white flex items-center space-x-2">
          <User className="w-5 h-5 text-indigo-400" />
          <span>Account & Profile</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Authorized user credentials, role capabilities, and active session details.
        </p>
      </div>

      {loggedOut && (
        <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-300 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-indigo-400" />
          <span>Session logged out. Redirecting to Dashboard...</span>
        </div>
      )}

      {/* Account Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-white">Authorized Officer</h2>
                <span
                  className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${
                    role === 'INSPECTOR'
                      ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {role} ROLE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Department of Consumer Affairs</p>
            </div>
          </div>

          {/* Prototype Role Switcher */}
          <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-lg border border-slate-800 text-xs shrink-0">
            <span className="text-[11px] text-slate-500 font-medium px-1">Switch Role:</span>
            <button
              type="button"
              onClick={() => setRole('INSPECTOR')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                role === 'INSPECTOR'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Inspector
            </button>
            <button
              type="button"
              onClick={() => setRole('ADMIN')}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                role === 'ADMIN'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Role Capabilities List */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {role} Authorized Capabilities
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Create new product package inspection</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Upload commodity panel images</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Run AI OCR & Legal Metrology rule checks</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-slate-300 flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Generate official inspection certificate report</span>
            </div>
          </div>
        </div>

        {/* System Version & Session */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div>
            <span className="text-slate-500">Application Version:</span>{' '}
            <span className="font-mono font-bold text-slate-300">PackSure v1.0 (Legal Metrology AI)</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center justify-center space-x-1.5 px-4 py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-colors shrink-0"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>End Session / Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
