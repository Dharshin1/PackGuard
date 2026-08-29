import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, Bell, Plus } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/history?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <header className="h-16 bg-slate-950 border-b border-slate-800 px-6 flex items-center justify-between sticky top-0 z-20">
      {/* Title / Subtitle */}
      <div>
        <h2 className="text-sm font-bold text-white tracking-tight">Executive Enforcement Dashboard</h2>
        <p className="text-[11px] text-slate-400">Department of Consumer Affairs | Legal Metrology Division</p>
      </div>

      {/* Right Header Controls */}
      <div className="flex items-center space-x-4">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search inspection ID or product..."
            className="w-full bg-slate-900 border border-slate-800 text-xs text-slate-200 pl-9 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </form>

        {/* New Inspection Button */}
        {location.pathname !== '/new-inspection' && (
          <button
            onClick={() => navigate('/new-inspection')}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Inspection</span>
          </button>
        )}

        {/* Notifications Icon */}
        <button
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

export default Header;
