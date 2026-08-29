import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InspectionTable from '../components/inspection/InspectionTable';
import EmptyState from '../components/common/EmptyState';
import { useInspections } from '../context/InspectionContext';
import { Search, Plus, RefreshCw } from 'lucide-react';

const InspectionHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { inspections } = useInspections();

  // Filter states: Search, Status filter, Date filter
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  const filteredInspections = inspections.filter((item) => {
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        item.id.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q));
      if (!matches) return false;
    }

    // Status filter
    if (statusFilter !== 'All') {
      if (statusFilter === 'Requires Review') {
        if (item.status !== 'Requires Inspector Review' && item.status !== 'Requires Review') return false;
      } else if (item.status !== statusFilter) {
        return false;
      }
    }

    // Date filter
    if (dateFilter !== 'All') {
      const itemDate = new Date(item.date);
      const now = new Date();
      const diffDays = (now - itemDate) / (1000 * 60 * 60 * 24);
      if (dateFilter === '7d' && diffDays > 7) return false;
      if (dateFilter === '30d' && diffDays > 30) return false;
    }

    return true;
  });

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setDateFilter('All');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold text-white">Inspection History</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Database log of completed packaged commodity inspections.
          </p>
        </div>

        {inspections.length > 0 && (
          <button
            onClick={() => navigate('/new-inspection')}
            className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors shadow-sm shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>New Inspection</span>
          </button>
        )}
      </div>

      {inspections.length === 0 ? (
        <EmptyState
          title="No inspections found"
          description="Completed inspections will appear here."
          actionButton={
            <button
              onClick={() => navigate('/new-inspection')}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-lg text-xs shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Start New Inspection</span>
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search ID or product..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Assessment Statuses</option>
                  <option value="Compliant">Compliant</option>
                  <option value="Requires Review">Requires Inspector Review</option>
                  <option value="Potential Non-Compliance">Potential Non-Compliance</option>
                </select>
              </div>

              {/* Date Filter */}
              <div>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="All">All Dates</option>
                  <option value="7d">Last 7 Days</option>
                  <option value="30d">Last 30 Days</option>
                </select>
              </div>
            </div>

            {(searchQuery || statusFilter !== 'All' || dateFilter !== 'All') && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <span className="text-slate-400">
                  Showing {filteredInspections.length} of {inspections.length} cases
                </span>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center space-x-1 text-slate-400 hover:text-white"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Filters</span>
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          {filteredInspections.length > 0 ? (
            <InspectionTable inspections={filteredInspections} />
          ) : (
            <EmptyState
              title="No matching inspections found"
              description="Try adjusting search or status filters."
            />
          )}
        </div>
      )}
    </div>
  );
};

export default InspectionHistory;
