import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import InspectionTable from '../components/inspection/InspectionTable';
import EmptyState from '../components/common/EmptyState';
import { useInspections } from '../context/InspectionContext';
import { Search, Plus, RefreshCw, Filter, ClipboardList } from 'lucide-react';

/* ─── shared token shorthands ─── */
const input = {
  width: '100%',
  backgroundColor: '#FFFFFF',
  border: '1px solid var(--pg-border)',
  borderRadius: '6px',
  fontSize: '13px',
  color: 'var(--pg-text-primary)',
  padding: '8px 12px',
  outline: 'none',
  height: '36px',
  boxSizing: 'border-box',
  transition: 'border-color 0.15s ease',
};

const InspectionHistory = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { inspections } = useInspections();

  // ── Filter State — unchanged logic ──────────────────────────────
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');

  const filteredInspections = inspections.filter((item) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matches =
        item.id.toLowerCase().includes(q) ||
        item.productName.toLowerCase().includes(q) ||
        (item.brand && item.brand.toLowerCase().includes(q)) ||
        (item.location && item.location.toLowerCase().includes(q));
      if (!matches) return false;
    }
    if (statusFilter !== 'All') {
      if (statusFilter === 'Requires Review') {
        if (item.status !== 'Requires Inspector Review' && item.status !== 'Requires Review') return false;
      } else if (item.status !== statusFilter) {
        return false;
      }
    }
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

  const hasActiveFilters = searchQuery || statusFilter !== 'All' || dateFilter !== 'All';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* ── Action row — shell Header already shows page title ─────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: '16px',
        borderBottom: '1px solid var(--pg-border)',
      }}>
        {inspections.length > 0 && (
          <button
            onClick={() => navigate('/new-inspection')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              backgroundColor: 'var(--pg-accent)', color: '#ffffff',
              fontSize: '12.5px', fontWeight: 600,
              padding: '8px 16px', borderRadius: '6px',
              border: 'none', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'background-color 0.12s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent)'; }}
          >
            <Plus style={{ width: '13px', height: '13px' }} />
            <span>New Inspection</span>
          </button>
        )}
      </div>

      {/* ── EMPTY STATE (no inspections at all) ────────────────────── */}
      {inspections.length === 0 ? (
        <EmptyState
          title="No inspections recorded yet"
          description="Completed inspections will appear here. Start by uploading a packaged commodity image."
          icon={ClipboardList}
          actionButton={
            <button
              onClick={() => navigate('/new-inspection')}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                backgroundColor: 'var(--pg-accent)', color: '#ffffff',
                fontSize: '12.5px', fontWeight: 600,
                padding: '8px 18px', borderRadius: '6px',
                border: 'none', cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent)'; }}
            >
              <Plus style={{ width: '13px', height: '13px' }} />
              <span>Start First Inspection</span>
            </button>
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

          {/* ── FILTER / SEARCH TOOLBAR ─────────────────────────────── */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--pg-border)',
            borderRadius: '8px',
            padding: '12px 14px',
            boxShadow: 'var(--pg-shadow-sm)',
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr auto auto',
              gap: '10px',
              alignItems: 'center',
            }}
              className="pg-filter-grid"
            >
              {/* Search */}
              <div style={{ position: 'relative', minWidth: 0 }}>
                <Search style={{
                  width: '13px', height: '13px',
                  color: 'var(--pg-text-muted)',
                  position: 'absolute', left: '10px',
                  top: '50%', transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by inspection ID or product name…"
                  style={{ ...input, paddingLeft: '32px' }}
                  onFocus={e => { e.target.style.borderColor = 'var(--pg-accent)'; e.target.style.boxShadow = '0 0 0 2px var(--pg-accent-muted)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--pg-border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>

              {/* Status Filter */}
              <div style={{ position: 'relative' }}>
                <Filter style={{
                  width: '11px', height: '11px',
                  color: 'var(--pg-text-muted)',
                  position: 'absolute', left: '10px',
                  top: '50%', transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                }} />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    ...input,
                    paddingLeft: '28px',
                    width: 'auto',
                    minWidth: '190px',
                    appearance: 'none',
                    cursor: 'pointer',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A7773' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    paddingRight: '28px',
                    backgroundColor: statusFilter !== 'All' ? 'var(--pg-accent-muted)' : '#FFFFFF',
                    borderColor: statusFilter !== 'All' ? '#A8D5B5' : 'var(--pg-border)',
                    color: statusFilter !== 'All' ? 'var(--pg-accent-text)' : 'var(--pg-text-primary)',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'var(--pg-accent)'; }}
                  onBlur={e => { e.target.style.borderColor = statusFilter !== 'All' ? '#A8D5B5' : 'var(--pg-border)'; }}
                >
                  <option value="All">All Assessment Statuses</option>
                  <option value="Compliant">Compliant</option>
                  <option value="Requires Review">Requires Inspector Review</option>
                  <option value="Potential Non-Compliance">Potential Non-Compliance</option>
                </select>
              </div>

              {/* Date Filter */}
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                style={{
                  ...input,
                  width: 'auto',
                  minWidth: '140px',
                  appearance: 'none',
                  cursor: 'pointer',
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237A7773' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 10px center',
                  paddingRight: '28px',
                  backgroundColor: dateFilter !== 'All' ? 'var(--pg-pending-bg)' : '#FFFFFF',
                  borderColor: dateFilter !== 'All' ? 'var(--pg-pending-border)' : 'var(--pg-border)',
                  color: dateFilter !== 'All' ? 'var(--pg-pending-text)' : 'var(--pg-text-primary)',
                }}
                onFocus={e => { e.target.style.borderColor = 'var(--pg-accent)'; }}
                onBlur={e => { e.target.style.borderColor = dateFilter !== 'All' ? 'var(--pg-pending-border)' : 'var(--pg-border)'; }}
              >
                <option value="All">All Dates</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            {/* Active filter indicator */}
            {hasActiveFilters && (
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                marginTop: '10px', paddingTop: '10px',
                borderTop: '1px solid var(--pg-border)',
              }}>
                <span style={{ fontSize: '12px', color: 'var(--pg-text-muted)' }}>
                  Showing&nbsp;
                  <strong style={{ color: 'var(--pg-text-primary)', fontWeight: 600 }}>
                    {filteredInspections.length}
                  </strong>
                  &nbsp;of&nbsp;
                  <strong style={{ color: 'var(--pg-text-primary)', fontWeight: 600 }}>
                    {inspections.length}
                  </strong>
                  &nbsp;inspection{inspections.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={handleResetFilters}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '5px',
                    fontSize: '12px', fontWeight: 500,
                    color: 'var(--pg-accent)', background: 'none', border: 'none',
                    cursor: 'pointer', padding: '2px 0',
                    transition: 'opacity 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
                  onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
                >
                  <RefreshCw style={{ width: '11px', height: '11px' }} />
                  <span>Reset filters</span>
                </button>
              </div>
            )}
          </div>

          {/* ── TABLE or NO-MATCH EMPTY STATE ───────────────────────── */}
          {filteredInspections.length > 0 ? (
            <InspectionTable inspections={filteredInspections} />
          ) : (
            <EmptyState
              title="No matching inspections"
              description="No inspections match the current search or filter criteria. Try adjusting your search."
            />
          )}

          {/* ── TASTEFUL BOTTOM NOTICE (when real data < full page) ─── */}
          {filteredInspections.length > 0 && filteredInspections.length < 6 && !hasActiveFilters && (
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: 'var(--pg-surface-subtle)',
              border: '1px solid var(--pg-border)',
              borderRadius: '6px',
            }}>
              <span style={{ fontSize: '12px', color: 'var(--pg-text-muted)' }}>
                {filteredInspections.length} inspection{filteredInspections.length !== 1 ? 's' : ''} in the registry.
                New inspections will appear here as they are completed.
              </span>
              <button
                onClick={() => navigate('/new-inspection')}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px',
                  fontSize: '12px', fontWeight: 600,
                  color: 'var(--pg-accent)', background: 'none', border: 'none',
                  cursor: 'pointer', padding: 0, whiteSpace: 'nowrap',
                  transition: 'opacity 0.12s',
                }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.75'; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; }}
              >
                <Plus style={{ width: '11px', height: '11px' }} />
                <span>Start new inspection</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default InspectionHistory;
