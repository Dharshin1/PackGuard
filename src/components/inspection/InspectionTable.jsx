import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { Eye, FileText, Calendar } from 'lucide-react';

/**
 * InspectionTable — Inspection list table.
 * All logic, handlers, navigation, and data access preserved exactly.
 * Visual redesign: converted from dark Tailwind classes to design system tokens.
 */
const InspectionTable = ({ inspections = [] }) => {
  const navigate = useNavigate();

  if (!inspections || inspections.length === 0) {
    return (
      <div style={{
        padding: '24px',
        textAlign: 'center',
        fontSize: '12.5px',
        color: 'var(--pg-text-muted)',
        backgroundColor: 'var(--pg-surface)',
        border: '1px solid var(--pg-border)',
        borderRadius: '8px',
      }}>
        No inspections found matching criteria.
      </div>
    );
  }

  const formatDate = (isoString) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div style={{
      backgroundColor: 'var(--pg-surface)',
      border: '1px solid var(--pg-border)',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: 'var(--pg-shadow-sm)',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed' }}>
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '24%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead>
            <tr style={{
              backgroundColor: 'var(--pg-navy)',
              borderBottom: '1px solid var(--pg-navy-border)',
            }}>
              {['Inspection ID', 'Product / Category', 'Date', 'Assessment Status', 'Flags', 'Action'].map((col, i) => (
                <th key={col} style={{
                  padding: '11px 14px',
                  fontSize: '9.5px', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                  textAlign: i === 4 ? 'center' : i === 5 ? 'right' : 'left',
                  whiteSpace: 'nowrap',
                }}>
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {inspections.map((item, idx) => {
              const violationCount = item.issues?.length || 0;
              const isEven = idx % 2 === 0;

              return (
                <tr
                  key={item.id}
                  style={{
                    backgroundColor: isEven ? 'var(--pg-surface)' : 'var(--pg-surface-subtle)',
                    borderBottom: '1px solid var(--pg-border)',
                    cursor: 'pointer',
                    transition: 'background-color 0.1s ease',
                  }}
                  onClick={() => navigate(`/inspection/${item.id}`)}
                  onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-muted)'; }}
                  onMouseLeave={e => { e.currentTarget.style.backgroundColor = isEven ? 'var(--pg-surface)' : 'var(--pg-surface-subtle)'; }}
                >
                  {/* Inspection ID */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                    <span style={{
                      fontFamily: 'monospace', fontSize: '11px', fontWeight: 700,
                      color: 'var(--pg-accent)',
                      backgroundColor: 'var(--pg-accent-muted)', border: '1px solid #A8D5B5',
                      borderRadius: '3px', padding: '2px 7px',
                    }}>
                      {item.id}
                    </span>
                  </td>

                  {/* Product & Category */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--pg-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.productName}
                    </div>
                    <div style={{ fontSize: '10.5px', color: 'var(--pg-text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.category}
                    </div>
                  </td>

                  {/* Date */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Calendar style={{ width: '11px', height: '11px', color: 'var(--pg-text-muted)', flexShrink: 0 }} />
                      <span style={{ fontSize: '11.5px', color: 'var(--pg-text-secondary)', whiteSpace: 'nowrap' }}>
                        {formatDate(item.date)}
                      </span>
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle' }}>
                    <StatusBadge status={item.status} />
                  </td>

                  {/* Violations */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'center' }}>
                    {violationCount > 0 ? (
                      <span style={{
                        fontFamily: 'monospace', fontSize: '11px', fontWeight: 700,
                        padding: '3px 8px', borderRadius: '3px',
                        backgroundColor: 'var(--pg-fail-bg)', border: '1px solid var(--pg-fail-border)',
                        color: 'var(--pg-fail-text)',
                      }}>
                        {violationCount} Flag{violationCount > 1 ? 's' : ''}
                      </span>
                    ) : (
                      <span style={{
                        fontFamily: 'monospace', fontSize: '11px', fontWeight: 700,
                        padding: '3px 8px', borderRadius: '3px',
                        backgroundColor: 'var(--pg-compliant-bg)', border: '1px solid var(--pg-compliant-border)',
                        color: 'var(--pg-compliant-text)',
                      }}>
                        Clear
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td style={{ padding: '12px 14px', verticalAlign: 'middle', textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                      <button
                        onClick={() => navigate(`/inspection/${item.id}`)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '5px', padding: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: 'var(--pg-surface-subtle)',
                          border: '1px solid var(--pg-border)',
                          color: 'var(--pg-text-muted)', cursor: 'pointer',
                          transition: 'border-color 0.12s, color 0.12s',
                        }}
                        title="View Inspection"
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--pg-accent)'; e.currentTarget.style.color = 'var(--pg-accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pg-border)'; e.currentTarget.style.color = 'var(--pg-text-muted)'; }}
                      >
                        <Eye style={{ width: '13px', height: '13px' }} />
                      </button>
                      <button
                        onClick={() => navigate(`/report/${item.id}`)}
                        style={{
                          width: '28px', height: '28px', borderRadius: '5px', padding: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          backgroundColor: 'var(--pg-accent-muted)',
                          border: '1px solid #A8D5B5',
                          color: 'var(--pg-accent)', cursor: 'pointer',
                          transition: 'background-color 0.12s',
                        }}
                        title="Generate Report"
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--pg-accent)'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--pg-accent-muted)'; e.currentTarget.style.color = 'var(--pg-accent)'; e.currentTarget.style.borderColor = '#A8D5B5'; }}
                      >
                        <FileText style={{ width: '13px', height: '13px' }} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InspectionTable;
